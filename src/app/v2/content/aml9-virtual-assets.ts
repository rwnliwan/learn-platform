import type { V2Lesson } from "../lib/types";

const FIG_FLOW = `<svg viewBox="0 0 480 250" role="img" aria-label="Alur dana: on-ramp, mixer, chain-hop, off-ramp.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="20" y="90" width="90" height="60" fill="var(--c1)" opacity="0.9"/>
<text x="65" y="116" font-size="12" fill="#fff" font-weight="600">On-ramp</text>
<text x="65" y="134" font-size="10" fill="#fff">Rp9,8 M masuk</text>
<rect x="140" y="90" width="90" height="60" fill="var(--c3)" opacity="0.9"/>
<text x="185" y="116" font-size="12" fill="#fff" font-weight="600">Mixer</text>
<text x="185" y="134" font-size="10" fill="#fff">40 output</text>
<rect x="260" y="90" width="90" height="60" fill="var(--c2)" opacity="0.9"/>
<text x="305" y="116" font-size="12" fill="#fff" font-weight="600">Chain-hop</text>
<text x="305" y="134" font-size="10" fill="#fff">3 chain</text>
<rect x="380" y="90" width="90" height="60" fill="var(--c4)" opacity="0.9"/>
<text x="425" y="116" font-size="12" fill="#fff" font-weight="600">Off-ramp</text>
<text x="425" y="134" font-size="10" fill="#fff">jadi rupiah</text>
<line x1="110" y1="120" x2="140" y2="120" stroke="var(--chart-text)" stroke-width="2" marker-end="url(#ah)"/>
<line x1="230" y1="120" x2="260" y2="120" stroke="var(--chart-text)" stroke-width="2"/>
<line x1="350" y1="120" x2="380" y2="120" stroke="var(--chart-text)" stroke-width="2"/>
<text x="240" y="180" font-size="11" fill="var(--chart-text)">Jejak on-chain tidak pernah hilang; yang kabur = identitas.</text>
<text x="240" y="200" font-size="11" fill="var(--chart-text)">Titik lemah pelaku = on/off-ramp (VASP teregulasi).</text>
</g>
</svg>`;

export const aml9: V2Lesson = {
  slug: "aml9-virtual-assets",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML9 — Virtual Assets & VASP Typologies",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp9,8 miliar yang 'hilang' di blockchain",
      prose: [
        "Rp9,8 miliar — dana dari jaringan placement di AML1 — masuk ke sebuah mixer. Keluar sebagai 40 transfer ke 40 alamat baru, lalu melompat antar blockchain tiga kali, lalu muncul sebagai rupiah di rekening bank. Investigator menatap layar: 'Uangnya hilang.'",
        "Twist-nya: tidak ada yang hilang. Blockchain tidak pernah lupa — setiap hop tercatat permanen, terbuka, bisa dibaca siapa pun. Yang kabur bukan JEJAKNYA, melainkan NAMANYA: tidak ada kolom 'nama' di blockchain. Kasus ini tentang virtual assets (VA) & VASP: di mana pelaku menyentuh dunia teregulasi (on/off-ramp), dan bagaimana membaca jejak yang 'anonim' tetapi transparan.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan on/off-ramp, VASP, dan travel rule; (2) mengenali pola mixer, chain-hopping, dan peel chain; (3) menghitung skor heuristik mixer; (4) menentukan kapan kasus VA layak menjadi SAR.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Blockchain = satu-satunya sistem keuangan di mana 'mengikuti uangnya' benar-benar harfiah: jejaknya permanen dan publik. Kelemahan investigator bukan data — melainkan kemampuan membaca graf (ingat AML8). Pelaku tahu ini; makanya mereka membayar 'pajak pencucian' ke mixer.",
      },
      reference: "Jejak abadi, nama kabur. Titik lemah = on/off-ramp.",
    },
    {
      id: "vasp",
      eyebrow: "Langkah 2 · Konsep",
      title: "VASP, on/off-ramp, travel rule",
      prose: [
        "VASP (Virtual Asset Service Provider) = exchange, kustodian, broker kripto. On-ramp = rupiah → kripto (beli di exchange); off-ramp = kripto → rupiah (jual/tarik). Inilah 'pintu' antara dunia kripto anonim dan sistem keuangan teregulasi — dan titik di mana KYC/CDD berlaku penuh.",
        "Travel rule (FATF Rekomendasi 16): transfer VA ≥ USD 1.000 wajib menyertakan info pengirim & penerima antar VASP — seperti 'berita transfer' di wire konvensional. VASP yang tidak patuh = red flag institusional: dana dari exchange tanpa travel rule diperlakukan seperti dana dari bank cangkang.",
        "Di Indonesia: pedagang aset kripto terdaftar di Bappebti/CFTC-equivalent; PPATK mengawasi transaksi mencurigakan VA. Nasabah dengan volume on/off-ramp tidak wajar vs profilnya = trigger EDD (ingat AML2: drift profil).",
        "Red flag VASP: (1) on-ramp besar lalu langsung kirim ke mixer; (2) banyak akun kecil off-ramp ke satu rekening bank (fan-in fiat); (3) VASP luar negeri tanpa lisensi jelas; (4) pola 'beli-tahan-sebentar-jual' tanpa motif investasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kripto = anonim, tidak bisa dilacak.” Bitcoin dkk = pseudonim, bukan anonim. Alamat bisa di-cluster (AML8 versi blockchain), dan setiap sentuhan ke VASP teregulasi = identitas. Yang benar-benar sulit = privacy coin + tanpa on/off-ramp teregulasi — itulah kenapa pelaku tetap butuh off-ramp.",
      },
      hints: [
        "Titik KYC = on/off-ramp (VASP).",
        "Travel rule ≥ USD 1.000 antar VASP.",
      ],
      reference: "Pintu = VASP. Awasi fan-in fiat di off-ramp.",
    },
    {
      id: "pola",
      eyebrow: "Langkah 3 · Konsep",
      title: "Mixer, chain-hop, peel chain",
      prose: [
        "Mixer: kumpulkan dana banyak orang dalam satu pool, acak, keluarkan ke alamat baru. Tujuannya memutus tautan on-chain input→output. Heuristik deteksi: n_input besar (≥50), n_output ≈ n_input (±10%), fee 0,5–3%. Bukan bukti — tetapi skor ≥70 = 'MIXER?' untuk investigasi.",
        "Chain-hopping: pindah antar blockchain (BTC → ETH → stablecoin → BTC) via bridge/DEX. Tujuannya mempersulit pelacakan lintas-ledger. Sinyal: bridge transaction besar diikuti split ke banyak alamat di chain tujuan dalam hitungan jam.",
        "Peel chain: operator 'mengupas' — kirim 45 BTC, sisakan fee, teruskan 40,5, lalu 36,4... rasio antar hop konsisten 0,85–0,95. Seperti mengupas bawang: tiap lapis sedikit lebih kecil. Lab mendeteksinya dari konsistensi rasio.",
        "Cara membaca figur: empat kotak = perjalanan dana; panah = arah. Interpretasi: 3 tahap tengah (mixer, hop, off-ramp) adalah 'kabut'; tetapi kabut on-chain bisa ditembus analisis graf — yang tidak bisa ditembus hanya jika pelaku tidak pernah menyentuh VASP teregulasi.",
      ],
      figure: {
        svg: FIG_FLOW,
        alt: "Alur dana: on-ramp, mixer, chain-hop, off-ramp.",
        caption: "Kabut ada di tengah; identitas bocor di pintu (on/off-ramp).",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Pelaku VA membayar 'pajak pencucian' berlapis: fee mixer 1–3% + slippage bridge + fee off-ramp. Total 5–10% untuk Rp9,8 M = Rp500 jt–Rp1 M. Mereka membayar semahal itu karena alternatifnya (ketahuan) jauh lebih mahal — logika ekonomi yang sama dengan layering konvensional (AML6).",
      },
      reference: "Mixer = pool & split; hop = pindah chain; peel = kupas berasio tetap.",
    },
    {
      id: "lab-peel",
      eyebrow: "Langkah 4 · Lab",
      title: "Deteksi peel chain",
      prose: [
        "Lima hop keluar sebuah wallet: 45 → 40,5 → 36,4 → 32,8 → 29,5 BTC. Hitung rasio antar hop; jika semuanya di 0,85–0,95 → PEEL CHAIN. Pola ini = satu operator mengupas, bukan lima orang berbeda (yang rasionya acak).",
        "Eksperimen: ubah hop ke-3 menjadi 20,0 — rasio menjadi 0,55 → bukan peel chain. Satu anomali merusak konsistensi; pelaku profesional tidak membuat anomali.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rasio`, `rata`, dan `peel`" },
        { id: "t2", text: "Jalankan dan pastikan vonis tercetak" },
      ],
      expected: "Rasio hop: 0.90, 0.90, 0.90, 0.90\nRata-rata 0.90 -> PEEL CHAIN: satu operator mengupas",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Nominal menurun = peel chain.” Menurun saja tidak cukup — yang spesifik = KONSISTENSI rasio. Lima orang berbeda mengirim nominal menurun secara kebetulan tidak akan seragam 0,90 tiap hop.",
      },
      hints: [
        "rasio[i] = keluar[i+1]/keluar[i].",
        "peel = all(0.85 <= r <= 0.95).",
      ],
      code: {
        starter: "# Aliran keluar sebuah wallet (BTC). JANGAN UBAH.\nkeluar = [45.0, 40.5, 36.4, 32.8, 29.5]  # BTC per hop\n\n# TULIS KODEMU: deteksi peel chain (rasio antar hop konsisten ~0.85-0.95)\nrasio =\nrata =\npeel =\nprint(\"Rasio hop: \" + \", \".join(f\"{r:.2f}\" for r in rasio))\nprint(f\"Rata-rata {rata:.2f} -> {'PEEL CHAIN: satu operator mengupas' if peel else 'bukan peel chain'}\")\n",
        lockLines: 2,
        solution: "# Aliran keluar sebuah wallet (BTC). JANGAN UBAH.\nkeluar = [45.0, 40.5, 36.4, 32.8, 29.5]  # BTC per hop\n\n# TULIS KODEMU: deteksi peel chain (rasio antar hop konsisten ~0.85-0.95)\nrasio = [keluar[i+1] / keluar[i] for i in range(len(keluar) - 1)]\nrata = sum(rasio) / len(rasio)\npeel = all(0.85 <= r <= 0.95 for r in rasio)\nprint(\"Rasio hop: \" + \", \".join(f\"{r:.2f}\" for r in rasio))\nprint(f\"Rata-rata {rata:.2f} -> {'PEEL CHAIN: satu operator mengupas' if peel else 'bukan peel chain'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Rasio tercetak", msg: "Lima hop → 4 rasio.", pattern: "Rasio hop: 0\\.90, 0\\.90, 0\\.90, 0\\.90" },
          { kind: "stdout_matches", task: "t2", label: "Vonis PEEL CHAIN", msg: "Semua rasio di 0,85–0,95.", pattern: "PEEL CHAIN" }
        ],
      },
      reference: "Rasio konsisten 0,85–0,95 = satu operator mengupas.",
    },
    {
      id: "lab-mixer",
      eyebrow: "Langkah 5 · Lab",
      title: "Skor heuristik mixer",
      prose: [
        "Tiga wallet kandidat. Skor = 40 (input ≥50) + 40 (output ≈ input) + 20 (fee wajar mixer). Skor ≥70 → 'MIXER?' untuk investigasi lanjut — bukan vonis.",
        "Perhatikan W3: 85 input, 90 output, fee 2,5% → skor 100. W2: 3→3, fee 0,2% → skor 40 (output ≈ input memberi 40 poin, tetapi terlalu kecil + fee bukan fee mixer → di bawah 70, bukan mixer). Heuristik memisahkan dengan bersih di data ini — di dunia nyata, tambahkan dimensi waktu (kecepatan pool & split).",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `skor` (0–100)" },
        { id: "t2", text: "Jalankan dan pastikan vonis tercetak" },
      ],
      expected: "W1: skor 100 -> MIXER?\nW2: skor 40 -> bukan\nW3: skor 100 -> MIXER?",
      note: {
        title: "Intuisi",
        body: "Heuristik mixer = seperti rule-based fraud (FR5): cepat, bisa dijelaskan, tetapi butuh tuning. Skor 70 bukan kebenaran — ia prioritas antrean investigasi. Yang menentukan SAR tetap analis + bukti.",
      },
      hints: [
        "40 poin untuk n_in >= 50.",
        "40 poin jika |in-out| <= 10% dari max.",
      ],
      code: {
        starter: "# Kandidat wallet mixer (JANGAN UBAH).\n# (nama, n_input, n_output, fee_%)\nkandidat = [(\"W1\", 120, 118, 1.0), (\"W2\", 3, 3, 0.2), (\"W3\", 85, 90, 2.5)]\n\n# TULIS KODEMU: skor mixer 0-100\ndef skor(n_in, n_out, fee):\n    return  # 0-100\n\nfor nama, ni, no, fee in kandidat:\n    s = skor(ni, no, fee)\n    print(f\"{nama}: skor {s} -> {'MIXER?' if s >= 70 else 'bukan'}\")\n",
        lockLines: 6,
        solution: "# Kandidat wallet mixer (JANGAN UBAH).\n# (nama, n_input, n_output, fee_%)\nkandidat = [(\"W1\", 120, 118, 1.0), (\"W2\", 3, 3, 0.2), (\"W3\", 85, 90, 2.5)]\n\n# TULIS KODEMU: skor mixer 0-100\ndef skor(n_in, n_out, fee):\n    s = 0\n    s += 40 if n_in >= 50 else (20 if n_in >= 10 else 0)\n    s += 40 if abs(n_in - n_out) <= max(n_in, n_out) * 0.1 else 0\n    s += 20 if 0.5 <= fee <= 3.0 else 0\n    return s\n\nfor nama, ni, no, fee in kandidat:\n    s = skor(ni, no, fee)\n    print(f\"{nama}: skor {s} -> {'MIXER?' if s >= 70 else 'bukan'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "W1 = MIXER?", msg: "120 input, fee 1%.", pattern: "W1: skor 100 -> MIXER\\?" },
          { kind: "stdout_matches", task: "t2", label: "W2 bukan mixer", msg: "Terlalu kecil.", pattern: "W2: skor 40 -> bukan" }
        ],
      },
      reference: "Skor ≥70 = investigasi. Bukan vonis.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Temuan VA: respons apa",
      prose: [
        "Satu: on-ramp besar tak wajar vs profil → EDD + tanya sumber dana (ingat drift AML2). Dua: kirim ke mixer terindikasi → investigasi + pertimbangkan SAR; bekukan jika kebijakan memungkinkan. Tiga: off-ramp fan-in (banyak wallet kecil → satu rekening) → network case: petakan cluster wallet. Empat: VASP luar negeri tanpa lisensi → perlakukan sebagai yurisdiksi berisiko tinggi; EDD mendalam.",
        "Aturan praktis 10 detik: sentuh mixer = investigasi. Fan-in fiat = network case. VASP tak berlisensi = EDD mendalam. Semua = dokumentasikan jejak on-chain (hash transaksi) sebagai lampiran SAR.",
        "Catatan tentang 'bukan vonis': skor mixer 100 pada wallet W1 tidak cukup untuk SAR sendirian — ia cukup untuk MEMBUKA investigasi. Yang menutup menjadi SAR = kombinasi: skor mixer + keterkaitan ke on-ramp KYC + tidak ada penjelasan bisnis. Satu sinyal = investigasi; dua sinyal independen = SAR. Aturan ini mencegah 'skor 100' menjadi stempel otomatis yang menakut-nakuti nasabah sah (mis. pengguna DeFi yang memakai mixer untuk privasi).",
        "Untuk off-ramp fan-in (banyak wallet kecil → satu rekening bank), tekniknya = AML8 versi fiat: hitung in-degree rekening bank dari alamat VA yang berbeda. 40 wallet → 1 rekening dalam 48 jam = fan-in (ingat money mule ring). Bedanya: di VA, 'rekening' pengirim adalah alamat pseudonim — cluster dulu by heuristik (waktu, nominal, pola), baru hitung in-degree.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Simpan hash transaksi + alamat di SAR: PPATK bisa mencocokkan dengan laporan VASP lain. SAR VA tanpa hash = SAR tanpa identifier (ingat AML7) — tidak bisa digabungkan lintas institusi.",
      },
      reference: "Mixer = investigasi; fan-in fiat = network; hash = identifier.",
    },
    {
      id: "lab-3",
      eyebrow: "Lab 3 · Skor risiko VASP",
      title: "Exchange mana yang paling berisiko?",
      prose: [
        "Lab 1–2 menilai transaksi. Lab ini menilai VASP-nya: tiga exchange dinilai dari lisensi (bobot 40%), travel rule (35%), dan riwayat sanksi (25%). Exchange tanpa lisensi dan tanpa travel rule = skor 85/100 = risiko TINGGI — EDD wajib sebelum kirim dana nasabah ke sana.",
        "Skor VASP dipakai untuk daftar putih: hanya VASP berisiko RENDAH–SEDANG yang boleh menerima transfer keluar. Satu lapisan pertahanan yang murah tetapi memotong jalur off-ramp utama pencucian via kripto.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor = 40*lisensi + 35*travel + 25*sanksi (invers)" },
        { id: "t2", text: "Jalankan dan pastikan peringkat tercetak" },
      ],
      expected: "NusaX: skor 0 -> RENDAH\nKriptoBebas: skor 100 -> TINGGI\nCoinTenggara: skor 35 -> RENDAH",
      note: {
        title: "Lisensi ≠ bersih.",
        type: "pitfall",
        body: "“Sudah berlisensi, pasti aman.” Lisensi = terdaftar, bukan terawasi ketat — exchange berlisensi di yurisdiksi lemah tetap berisiko. Skor gabungan menangkap ini; satu atribut tidak.",
      },
      hints: [
        "Skor 0-100; lisensi/travel/sanksi sebagai 0/1.",
        "Risiko TINGGI bila skor >= 70.",
      ],
      code: {
        starter: "# VASP: (nama, berlisensi, travel_rule, pernah_disanksi). JANGAN UBAH.\nvasp = [(\"NusaX\", 1, 1, 0), (\"KriptoBebas\", 0, 0, 1), (\"CoinTenggara\", 1, 0, 0)]\n\n# TULIS KODEMU: skor risiko 0-100 (tanpa lisensi/travel/sanksi = berisiko)\nfor nama, lisensi, travel, sanksi in vasp:\n    skor = \n    level = \"TINGGI\" if skor >= 70 else (\"SEDANG\" if skor >= 40 else \"RENDAH\")\n    print(f\"{nama}: skor {skor} -> {level}\")",
        lockLines: 4,
        solution: "# VASP: (nama, berlisensi, travel_rule, pernah_disanksi). JANGAN UBAH.\nvasp = [(\"NusaX\", 1, 1, 0), (\"KriptoBebas\", 0, 0, 1), (\"CoinTenggara\", 1, 0, 0)]\n\n# TULIS KODEMU: skor risiko 0-100 (tanpa lisensi/travel/sanksi = berisiko)\nfor nama, lisensi, travel, sanksi in vasp:\n    skor = 40*(1-lisensi) + 35*(1-travel) + 25*sanksi\n    level = \"TINGGI\" if skor >= 70 else (\"SEDANG\" if skor >= 40 else \"RENDAH\")\n    print(f\"{nama}: skor {skor} -> {level}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "NusaX rendah", msg: "Berlisensi + travel rule.", pattern: "NusaX: skor 0 -\> RENDAH" },
          { kind: "stdout_matches", task: "t2", label: "KriptoBebas tinggi", msg: "Tanpa lisensi, tanpa travel rule, pernah disanksi.", pattern: "KriptoBebas: skor 100 -\> TINGGI" }
        ],
      },
      reference: "Daftar putih VASP: hanya RENDAH–SEDANG boleh terima transfer keluar.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Rp9,8 miliar: dari mixer ke SAR",
      prose: [
        "Data: on-ramp Rp9,8 M via exchange lokal (KYC lengkap — nama: PT Fiktif Sejahtera). 2 jam kemudian 100% dana ke mixer (skor 100). 40 output dalam 6 jam. Chain-hop 3x. Off-ramp Rp8,9 M (susut 9% = 'pajak pencucian') ke 5 rekening bank berbeda.",
        "Pertanyaan: (a) Di titik mana identitas bocor? (b) Skor mixer + peel chain? (c) Layak SAR? Pembahasan: (a) On-ramp (KYC PT Fiktif Sejahtera) dan off-ramp (5 rekening bank) — dua pintu teregulasi. (b) Mixer skor 100 (120 input? di kasus ini 1 input besar → skor parsial, tetapi 40 output + fee 1% + kecepatan = tetap investigasi); peel chain tidak ada (split, bukan kupas). (c) Ya — SAR dengan lampiran: hash on-ramp, 40 alamat output, 5 rekening off-ramp, dan keterkaitan ke jaringan placement AML1 (Rp9,8 M = angka yang sama). Satu SAR ini menyambungkan 3 lesson: placement, mixer, off-ramp.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Susut 9% (Rp900 jt) untuk mencuci Rp9,8 M = harga yang bersedia dibayar pelaku. Jika bank mengenakan 'biaya' berupa EDD + pelaporan di on/off-ramp, ekonomi kejahatan berubah: pencucian menjadi lebih mahal dari keuntungannya.",
      },
      reference: "Identitas bocor di pintu. Hash = identifier SAR.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Ingat: jejak abadi, nama kabur.",
      ],
      tasks: [],
      summary: [
        "VASP = pintu teregulasi; on/off-ramp = titik KYC/CDD penuh.",
        "Travel rule: transfer VA ≥ USD 1.000 wajib info pengirim–penerima.",
        "Mixer = pool & split (skor ≥70 investigasi); chain-hop = pindah ledger; peel = kupas berasio tetap.",
        "Blockchain pseudonim: jejak permanen & publik; identitas bocor di on/off-ramp.",
        "SAR VA wajib lampirkan hash transaksi + alamat sebagai identifier.",
      ],
      next: { label: "AML10 — Institutional Risk Assessment", href: "/v2/learn/aml10-ira" },
      quiz: [
        {
          q: "Mengapa mixer tidak membuat dana 'hilang'?",
          options: [
            { text: "Blockchain permanen & publik; yang kabur hanya nama", why: "Benar: pseudonim, bukan anonim.", correct: true },
            { text: "Mixer menghapus histori blockchain", why: "Tidak bisa — histori on-chain immutable." },
            { text: "Dana diubah menjadi tunai", why: "Mixer = VA ke VA; tunai terjadi di off-ramp." }
          ],
        },
        {
          q: "Rasio hop 0,90, 0,90, 0,90, 0,90. Pola apa?",
          options: [
            { text: "Peel chain — satu operator mengupas", why: "Benar: konsistensi rasio = satu operator.", correct: true },
            { text: "Mixer", why: "Mixer = pool & split banyak input, bukan kupasan berurutan." },
            { text: "Transaksi normal", why: "Rasio seseragam ini tidak terjadi secara alami." }
          ],
        },
        {
          q: "Kapan travel rule berlaku?",
          options: [
            { text: "Transfer VA ≥ USD 1.000 antar VASP", why: "Benar (FATF R16).", correct: true },
            { text: "Semua transaksi kripto", why: "Ambang USD 1.000." },
            { text: "Hanya off-ramp ke bank", why: "Antar VASP, bukan hanya ke bank." }
          ],
        },
        {
          q: "Nasabah on-ramp Rp5 M lalu 100% ke mixer 2 jam kemudian. Respons?",
          options: [
            { text: "Investigasi + pertimbangkan SAR", why: "Benar: pola klasik placement→layering VA.", correct: true },
            { text: "Abaikan, kan sudah KYC", why: "KYC di pintu tidak memutihkan perilaku setelahnya." },
            { text: "Blokir permanen tanpa investigasi", why: "Butuh investigasi + bukti dulu; blokir membabi buta = masalah hukum." }
          ],
        },
        {
          q: "Apa identifier SAR untuk kasus VA?",
          options: [
            { text: "Hash transaksi + alamat wallet", why: "Benar: memungkinkan PPATK menggabungkan lintas institusi.", correct: true },
            { text: "Nama samaran Telegram pelaku", why: "Bukan identifier yang bisa diverifikasi." },
            { text: "Cukup nominalnya", why: "Nominal tanpa identifier = tidak bisa digabungkan (ingat AML7)." }
          ],
        }
      ],
      reference: "Pintu = VASP. Pola = mixer/hop/peel. Identifier = hash.",
    },
  ],
};
