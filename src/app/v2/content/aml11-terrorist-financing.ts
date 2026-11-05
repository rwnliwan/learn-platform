import type { V2Lesson } from "../lib/types";

const FIG_TFML = `<svg viewBox="0 0 480 260" role="img" aria-label="Perbandingan TF vs ML: arah dana, nominal, sumber.">
<g font-family="var(--font-ui)">
<text x="150" y="30" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="600">Money Laundering</text>
<text x="390" y="30" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="600">Terrorist Financing</text>
<text x="150" y="60" font-size="11" fill="var(--chart-text)" text-anchor="middle">uang KOTOR &#8594; bersih</text>
<text x="390" y="60" font-size="11" fill="var(--chart-text)" text-anchor="middle">uang BERSIH &#8594; kejahatan</text>
<rect x="60" y="80" width="180" height="26" fill="var(--c1)" opacity="0.85"/>
<text x="150" y="98" font-size="11" fill="#fff" text-anchor="middle">nominal BESAR</text>
<rect x="300" y="80" width="90" height="26" fill="var(--c2)" opacity="0.85"/>
<text x="345" y="98" font-size="11" fill="#fff" text-anchor="middle">nominal kecil</text>
<rect x="60" y="120" width="180" height="26" fill="var(--c3)" opacity="0.85"/>
<text x="150" y="138" font-size="11" fill="#fff" text-anchor="middle">sumber: kejahatan</text>
<rect x="300" y="120" width="180" height="26" fill="var(--c3)" opacity="0.85"/>
<text x="390" y="138" font-size="11" fill="#fff" text-anchor="middle">sumber: legal (donasi, gaji)</text>
<rect x="60" y="160" width="180" height="26" fill="var(--c4)" opacity="0.85"/>
<text x="150" y="178" font-size="11" fill="#fff" text-anchor="middle">deteksi: ikuti uangnya</text>
<rect x="300" y="160" width="180" height="26" fill="var(--c4)" opacity="0.85"/>
<text x="390" y="178" font-size="11" fill="#fff" text-anchor="middle">deteksi: ikuti jaringannya</text>
<text x="240" y="215" font-size="11" fill="var(--chart-text)" text-anchor="middle">ML: placement besar mencolok. TF: donasi kecil tidak mencolok.</text>
<text x="240" y="235" font-size="11" fill="var(--chart-text)" text-anchor="middle">Itulah mengapa TF butuh lensa berbeda.</text>
</g>
</svg>`;

export const aml11: V2Lesson = {
  slug: "aml11-terrorist-financing",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML11 — Terrorist Financing Typologies",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp50 ribu × 200 orang",
      prose: [
        "'Yayasan Cahaya Bangsa' menggalang donasi kemanusiaan: Rp50 ribu per orang, 200 donatur, total Rp10 juta dalam 48 jam. Terlihat seperti filantropi biasa — sampai 3 bulan kemudian yayasan itu masuk DTTOT (Daftar Terduga Teroris dan Organisasi Teroris). Dana 'kemanusiaan' mengalir ke jaringan yang salah.",
        "Twist-nya: tidak ada yang 'dicuci'. Uangnya bersih — donasi sah, gaji sah. Inilah perbedaan fundamental: money laundering = uang KOTOR menjadi bersih; terrorist financing = uang BERSIH untuk kejahatan. Semua teknik AML1–AML8 (cari uang kotor!) buta terhadap TF — karena yang dicari tidak ada.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan 4 beda TF vs ML; (2) mengenali tipologi TF (charity, crowdfunding, cash courier); (3) menghitung skor red-flag TF; (4) mendeteksi burst donasi anomali.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "TF = risiko yang tidak bisa dideteksi dengan 'ikuti uang kotornya' karena uangnya bersih. Satu-satunya cara = ikuti JARINGANNYA: siapa terkait siapa (DTTOT, adverse media, pola pengumpulan). Inilah mengapa screening sanksi (AML4) + network analysis (AML8) adalah pertahanan utama anti-TF.",
      },
      reference: "ML: kotor → bersih. TF: bersih → kejahatan. Lensa berbeda.",
    },
    {
      id: "beda",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat beda TF vs ML",
      prose: [
        "Satu — Arah: ML = placement → layering → integration (kotor dibersihkan). TF = collection → transmission → use (bersih dikumpulkan untuk dipakai). Alirannya terbalik.",
        "Dua — Nominal: ML butuh volume besar (Rp9,8 M butuh dipecah). TF butuh sedikit — serangan bisa didanai Rp50–100 juta. Ambang deteksi nominal (ingat structuring Rp100 jt) TIDAK menangkap TF.",
        "Tiga — Sumber: ML dari kejahatan (narkotika, korupsi). TF dari sumber LEGAL: donasi, gaji, usaha sah, bahkan dana sosial. 'Sumber dana jelas' ≠ 'aman' untuk TF.",
        "Empat — Deteksi: ML = ikuti uangnya (pola transaksi). TF = ikuti jaringannya (keterkaitan orang/organisasi) + pola pengumpulan (burst, fan-in). Inilah mengapa TF 30% bobot CAMS tetapi sering luput dari transaction monitoring biasa.",
        "Cara membaca figur: dua kolom = dua kejahatan; empat baris = empat beda. Interpretasi: jika sistem AML-mu hanya mencari 'uang kotor besar', TF lewat di bawah radar secara desain. Butuh lensa kedua.",
      ],
      figure: {
        svg: FIG_TFML,
        alt: "Perbandingan TF vs ML: arah, nominal, sumber, deteksi.",
        caption: "ML: cari uang kotor besar. TF: cari jaringan + pola kumpul kecil.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Donasi kecil = risiko kecil.” Untuk ML ya; untuk TF tidak. Rp10 juta cukup untuk mendanai serangan. Menilai TF dengan logika ML = mengukur suhu dengan penggaris.",
      },
      hints: [
        "TF: bersih → kejahatan; nominal kecil; sumber legal.",
        "Deteksi TF = jaringan + pola pengumpulan, bukan nominal.",
      ],
      reference: "Empat beda: arah, nominal, sumber, deteksi.",
    },
    {
      id: "tipologi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga tipologi TF",
      prose: [
        "Satu — Charity/charity front: yayasan kemanusiaan (atau disusupi) sebagai corong. Sinyal: donasi burst 48 jam, tujuan transfer ke wilayah konflik/risiko tinggi, pengurus berganti mendadak, laporan keuangan tidak transparan. Kasus cerita = tipologi ini.",
        "Dua — Crowdfunding & social media: penggalangan 'kemanusiaan' via platform/grup chat. Sinyal: narasi emosional + urgensi + tujuan personal (bukan organisasi), donatur tersebar tetapi ditarik ke satu wallet/rekening dalam hitungan jam (fan-in).",
        "Tiga — Cash courier & trade kecil: uang tunai dibawa lintas batas, atau over/under-invoice kecil berulang (ingat TBML AML6 versi mini). Sinyal: pola perjalanan tidak wajar + transaksi tunai besar di perbatasan.",
        "Benang merah: KETIGA tipologi memakai 'wajah legal' (amal, dagang, perjalanan). Pertahanan = verifikasi wajahnya: yayasan terdaftar? laporan keuangan diaudit? perjalanan konsisten dengan profil? Wajah legal yang tidak bisa diverifikasi = wajah palsu.",
        "Contoh angka crowdfunding: grup chat 500 anggota, target 'Rp100 juta untuk saudara kita'. Terkumpul Rp87 juta dalam 72 jam dari 340 donatur (rata-rata Rp256 ribu). Pola normal? Bandingkan dengan baseline platform: penggalangan kemanusiaan normal mencapai 30% target dalam 72 jam pertama; yang ini 87%. Ditambah: 90% donatur baru bergabung < 7 hari (akun dadakan). Kombinasi kecepatan + akun baru = red flag ganda.",
        "Cash courier versi angka: kurir tertangkap dengan USD 40.000 tunai di perbatasan. Bukan jumlah yang fantastis — tetapi pola perjalanannya: 6x perjalanan dalam 2 bulan ke kota yang sama, menginap < 24 jam, tanpa alasan bisnis yang bisa diverifikasi. Satu perjalanan = bukan apa-apa; enam = pola. Inilah mengapa data perjalanan (jika tersedia via EDD) digabungkan dengan data transaksi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Pelaku TF tidak menyembunyikan UANGNYA (ia bersih) — mereka menyembunyikan TUJUANNYA. Maka pertanyaannya bukan 'uang ini dari mana?' melainkan 'uang ini untuk apa, dan siapa di ujungnya?' Beda pertanyaan = beda investigasi.",
      },
      reference: "Charity, crowdfunding, courier. Verifikasi wajah legalnya.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 4 · Lab",
      title: "Skor red-flag TF",
      prose: [
        "Empat red flag, 25 poin tiap satu: burst donasi 48 jam, fan-in (banyak donatur → satu titik), tujuan ke wilayah/yayasan berisiko, nominal seragam kecil. Skor ≥75 → INVESTIGASI TF; 50–74 → pantau; <50 → bukan TF.",
        "Perhatikan 'Arisan Keluarga': burst + fan-in = 50 → pantau, BUKAN investigasi. Dua red flag tanpa tujuan berisiko + nominal tidak seragam = arisan biasa. Skor mencegah kepanikan: tidak setiap kerumunan donasi = terorisme.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `skor_tf` (0–100)" },
        { id: "t2", text: "Jalankan dan pastikan vonis tercetak" },
      ],
      expected: "Yayasan Cahaya: skor 100 -> INVESTIGASI TF\nArisan Keluarga: skor 50 -> pantau\nDonasi Bencana: skor 25 -> bukan TF",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Skor 50 = setengah teroris.” Skor = prioritas, bukan vonis. Arisan keluarga skor 50 = 'pantau' — diverifikasi, bukan diinvestigasi. Skor yang diperlakukan sebagai vonis = diskriminasi.",
      },
      hints: [
        "25 poin per red flag yang True.",
        "Ambang: ≥75 investigasi, ≥50 pantau.",
      ],
      code: {
        starter: "# Kandidat kasus: (nama, burst_48j, fan_in, tujuan_risiko, nominal_seragam). JANGAN UBAH.\nkasus = [(\"Yayasan Cahaya\", True, True, True, True),\n         (\"Arisan Keluarga\", True, True, False, False),\n         (\"Donasi Bencana\", False, True, False, False)]\n\n# TULIS KODEMU: skor TF 0-100 (25 per red flag)\ndef skor_tf(burst, fanin, tujuan, seragam):\n    return  # 0-100\n\nfor nama, b, f, t, s in kasus:\n    sk = skor_tf(b, f, t, s)\n    vonis = \"INVESTIGASI TF\" if sk >= 75 else (\"pantau\" if sk >= 50 else \"bukan TF\")\n    print(f\"{nama}: skor {sk} -> {vonis}\")\n",
        lockLines: 6,
        solution: "# Kandidat kasus: (nama, burst_48j, fan_in, tujuan_risiko, nominal_seragam). JANGAN UBAH.\nkasus = [(\"Yayasan Cahaya\", True, True, True, True),\n         (\"Arisan Keluarga\", True, True, False, False),\n         (\"Donasi Bencana\", False, True, False, False)]\n\n# TULIS KODEMU: skor TF 0-100 (25 per red flag)\ndef skor_tf(burst, fanin, tujuan, seragam):\n    return (25 if burst else 0) + (25 if fanin else 0) + (25 if tujuan else 0) + (25 if seragam else 0)\n\nfor nama, b, f, t, s in kasus:\n    sk = skor_tf(b, f, t, s)\n    vonis = \"INVESTIGASI TF\" if sk >= 75 else (\"pantau\" if sk >= 50 else \"bukan TF\")\n    print(f\"{nama}: skor {sk} -> {vonis}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Yayasan Cahaya 100", msg: "4/4 red flag.", pattern: "Yayasan Cahaya: skor 100 -> INVESTIGASI TF" },
          { kind: "stdout_matches", task: "t2", label: "Arisan dipantau", msg: "2/4 = 50, bukan investigasi.", pattern: "Arisan Keluarga: skor 50 -> pantau" }
        ],
      },
      reference: "4 red flag × 25. ≥75 investigasi; 50–74 pantau.",
    },
    {
      id: "lab-burst",
      eyebrow: "Langkah 5 · Lab",
      title: "Deteksi burst donasi",
      prose: [
        "14 hari donasi yayasan (Rp ribu): 10 hari pertama normal (~Rp110 rb/hari), 3 hari terakhir meledak (Rp8.800–9.200 rb/hari). Hitung baseline 10 hari, flag hari dengan donasi > 5× baseline, totalkan burst-nya: Rp26.700 rb dalam 3 hari = 80x lipat normal.",
        "Burst saja bukan bukti — bencana alam juga memicu burst. Yang membuatnya red flag TF = burst + tujuan berisiko + tidak ada bencana yang menjelaskan. Selalu gabungkan: burst = kandidat, konteks = vonis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `base`, `burst_hari`, dan `total_burst`" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Baseline: Rp110 rb/hari; burst di hari [12, 13, 14]\nTotal burst: Rp26700 rb -> INVESTIGASI: crowdfunding TF?",
      note: {
        title: "Intuisi",
        body: "Baseline harus dari periode NORMAL (10 hari pertama), bukan dari seluruh data — kalau burst ikut dihitung dalam baseline, baseline-nya ikut meledak dan burst tidak terdeteksi. Ini kesalahan klasik deteksi anomali.",
      },
      hints: [
        "base = rata-rata 10 hari pertama.",
        "burst jika d > base * 5.",
      ],
      code: {
        starter: "# Donasi harian sebuah yayasan, 14 hari (Rp ribu). JANGAN UBAH.\ndonasi = [120, 95, 110, 130, 105, 90, 115, 100, 108, 122, 95, 8800, 9200, 8700]\n# baseline = rata-rata 10 hari pertama\n\n# TULIS KODEMU: deteksi burst\nbase =\nburst_hari =\ntotal_burst =\nprint(f\"Baseline: Rp{base:.0f} rb/hari; burst di hari {burst_hari}\")\nprint(f\"Total burst: Rp{total_burst} rb -> {'INVESTIGASI: crowdfunding TF?' if burst_hari else 'normal'}\")\n",
        lockLines: 2,
        solution: "# Donasi harian sebuah yayasan, 14 hari (Rp ribu). JANGAN UBAH.\ndonasi = [120, 95, 110, 130, 105, 90, 115, 100, 108, 122, 95, 8800, 9200, 8700]\n# baseline = rata-rata 10 hari pertama\n\n# TULIS KODEMU: deteksi burst\nbase = sum(donasi[:10]) / 10\nburst_hari = [i + 1 for i, d in enumerate(donasi) if d > base * 5]\ntotal_burst = sum(donasi[i - 1] for i in burst_hari)\nprint(f\"Baseline: Rp{base:.0f} rb/hari; burst di hari {burst_hari}\")\nprint(f\"Total burst: Rp{total_burst} rb -> {'INVESTIGASI: crowdfunding TF?' if burst_hari else 'normal'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Burst hari 12–14", msg: "3 hari meledak.", pattern: "burst di hari \\[12, 13, 14\\]" },
          { kind: "stdout_matches", task: "t2", label: "Total burst benar", msg: "8.800+9.200+8.700 = 26.700.", pattern: "Total burst: Rp26700 rb" }
        ],
      },
      reference: "Burst = >5× baseline. Burst + konteks = red flag.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Temuan TF: respons apa",
      prose: [
        "Satu: skor ≥75 + tujuan terkonfirmasi berisiko (DTTOT/adverse) → SAR + pertimbangkan pelaporan ke Densus/PPATK; JANGAN tipping-off (beri tahu nasabah). Dua: skor 50–74 → pantau + EDD: verifikasi yayasan/penerima. Tiga: burst donasi + ada bencana yang menjelaskan → catat + pantau; bencana = konteks sah. Empat: nama cocok DTTOT (true match) → BLOKIR + lapor SEKARANG (ingat AML4: tanpa 'tunggu besok').",
        "Aturan praktis 10 detik: DTTOT match = blokir + lapor. Skor tinggi = SAR tanpa tipping-off. Burst + bencana = pantau. Verifikasi wajah legal selalu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "No tipping-off = aturan keras: jangan beri tahu nasabah bahwa ia diinvestigasi/dilaporkan. Satu telepon 'Pak, rekening Bapak kami laporkan' = pelaku menghilangkan jejak + kamu melanggar hukum. Diam = bagian dari prosedur.",
      },
      reference: "DTTOT = blokir + lapor. Skor tinggi = SAR. No tipping-off.",
    },
    {
      id: "lab-3",
      eyebrow: "Lab 3 · Donatur bersama",
      title: "Dua yayasan, satu dompet",
      prose: [
        "Lab 1–2 menilai yayasan dan lonjakan. Lab ini mencari donatur bersama: dua yayasan 'berbeda' yang menerima dana dari dompet yang sama. Tiga dompet muncul di kedua yayasan — indikasi koordinasi yang tak terlihat dari laporan masing-masing.",
        "Teknik ini disebut entity resolution lintas laporan: pelaku TF memecah donasi ke banyak front agar tiap laporan terlihat wajar. Yang menyatukan mereka adalah infrastruktur yang sama — dompet, IP, nomor HP.",
      ],
      tasks: [
        { id: "t1", text: "Cari irisan donatur dua yayasan" },
        { id: "t2", text: "Jalankan dan pastikan temuan tercetak" },
      ],
      expected: "Donatur bersama: 3 dompet -> INVESTIGASI: koordinasi?",
      note: {
        title: "Irisan ≠ konspirasi.",
        type: "pitfall",
        body: "“Tiga dompet sama, pasti jaringan TF.” Donatur bersama bisa kebetulan (komunitas kecil, kampanye viral). Irisan = alasan investigasi, bukan kesimpulan — langkah berikutnya verifikasi hubungan, bukan langsung vonis.",
      },
      hints: [
        "irisan = set(a) & set(b).",
        "Vonis INVESTIGASI bila irisan >= 2.",
      ],
      code: {
        starter: "# Dompet donatur dua yayasan. JANGAN UBAH.\nyayasan_a = [\"0x1a\", \"0x2b\", \"0x3c\", \"0x4d\", \"0x9z\"]\nyayasan_b = [\"0x5e\", \"0x2b\", \"0x6f\", \"0x3c\", \"0x9z\"]\n\n# TULIS KODEMU: donatur bersama\nbersama = \nprint(f\"Donatur bersama: {len(bersama)} dompet -> {'INVESTIGASI: koordinasi?' if len(bersama) >= 2 else 'wajar'}\")",
        lockLines: 4,
        solution: "# Dompet donatur dua yayasan. JANGAN UBAH.\nyayasan_a = [\"0x1a\", \"0x2b\", \"0x3c\", \"0x4d\", \"0x9z\"]\nyayasan_b = [\"0x5e\", \"0x2b\", \"0x6f\", \"0x3c\", \"0x9z\"]\n\n# TULIS KODEMU: donatur bersama\nbersama = sorted(set(yayasan_a) & set(yayasan_b))\nprint(f\"Donatur bersama: {len(bersama)} dompet -> {'INVESTIGASI: koordinasi?' if len(bersama) >= 2 else 'wajar'}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`bersama` = 3 dompet", msg: "0x2b, 0x3c, 0x9z.", name: "bersama", value: ["0x2b", "0x3c", "0x9z"] },
          { kind: "stdout_matches", task: "t2", label: "Temuan tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Donatur bersama: 3 dompet -\> INVESTIGASI: koordinasi?" }
        ],
      },
      reference: "Infrastruktur bersama (dompet/IP/HP) menyatukan front yang terlihat terpisah.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "'Yayasan Cahaya Bangsa': keputusan",
      prose: [
        "Data lengkap: 200 donasi Rp50 rb dalam 48 jam (burst: baseline Rp110 rb/hari → 80x). Fan-in ke 1 rekening yayasan, lalu 1 transfer Rp10 jt ke 'Yayasan Induk' di wilayah risiko tinggi. Pengurus yayasan berganti 2 bulan lalu. Skor: 100 → INVESTIGASI TF.",
        "Pertanyaan: (a) Langkah 24 jam pertama? (b) Kapan SAR ditulis? Pembahasan: (a) JANGAN hubungi yayasan (no tipping-off). Verifikasi diam-diam: cek DTTOT (tidak match — yayasan belum masuk saat itu), adverse media pengurus baru (ketemu: 1 artikel 2 tahun lalu, skor rendah → pantau), pantau rekening 30 hari. (b) SAR ditulis saat transfer kedua Rp15 jt ke wilayah yang sama + pengurus terhubung ke 1 nama di daftar sanksi (true match, NIK cocok) → skor tetap 100 + DTTOT-adjacent = SAR + lapor. Pelajaran: kasus TF jarang 'sekali pukul' — ia dibangun dari 2–3 sinyal yang masing-masing lemah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kasus TF = maraton bukti, bukan sprint. Analis yang menuntut 'bukti kuat' di hari pertama akan menutup kasus yang benar; analis yang sabar mengumpulkan 3 sinyal lemah = yang menangkap jaringan. Desain sistem (pantau 30–90 hari, ingat AML7) harus mendukung kesabaran ini.",
      },
      reference: "Bangun 2–3 sinyal. No tipping-off. SAR saat DTTOT-adjacent.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Kunci: TF ≠ ML mini.",
      ],
      tasks: [],
      summary: [
        "TF = uang BERSIH untuk kejahatan; ML = uang KOTOR menjadi bersih.",
        "Empat beda: arah (collection vs placement), nominal (kecil vs besar), sumber (legal vs ilegal), deteksi (jaringan vs uang).",
        "Tipologi: charity front, crowdfunding, cash courier — semua berwajah legal.",
        "Skor TF: 4 red flag × 25; ≥75 investigasi, 50–74 pantau.",
        "DTTOT match = blokir + lapor; no tipping-off selalu.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Beda fundamental TF vs ML?",
          options: [
            { text: "TF = uang bersih untuk kejahatan; ML = uang kotor dibersihkan", why: "Benar. Arahnya terbalik.", correct: true },
            { text: "TF = ML dalam nominal kecil", why: "Bukan versi mini — logika deteksinya beda (jaringan vs uang)." },
            { text: "Tidak ada beda, sama-sama pencucian", why: "Beda 4 dimensi: arah, nominal, sumber, deteksi." }
          ],
        },
        {
          q: "Donasi Rp50 rb × 200 dalam 48 jam ke yayasan baru. Red flag utama?",
          options: [
            { text: "Burst + fan-in + yayasan tak terverifikasi", why: "Benar: pola pengumpulan + wajah legal yang belum terbukti.", correct: true },
            { text: "Nominal Rp50 ribu terlalu kecil untuk dicurigai", why: "Logika ML — untuk TF nominal kecil = normal." },
            { text: "Jumlah donatur terlalu banyak", why: "Banyak donatur = wajar untuk amal; yang aneh = burst + tujuan." }
          ],
        },
        {
          q: "Skor TF 50 (burst + fan-in, tujuan tidak berisiko). Respons?",
          options: [
            { text: "Pantau + EDD/verifikasi", why: "Benar: 50–74 = pantau, bukan investigasi penuh.", correct: true },
            { text: "SAR segera", why: "Skor 50 tanpa tujuan berisiko = belum cukup untuk SAR." },
            { text: "Abaikan", why: "50 = pantau; mengabaikan = buta jika sinyal ketiga muncul." }
          ],
        },
        {
          q: "Nama pengurus cocok DTTOT (NIK cocok). Tindakan?",
          options: [
            { text: "Blokir dana + lapor SEKARANG", why: "Benar: true match sanksi = tanpa 'tunggu besok' (AML4).", correct: true },
            { text: "Telepon pengurus untuk klarifikasi", why: "Tipping-off = melanggar hukum + menghilangkan jejak." },
            { text: "Tunggu transfer berikutnya", why: "Dana yang lolos = pelanggaran." }
          ],
        },
        {
          q: "Mengapa 'sumber dana jelas' tidak cukup untuk menyingkirkan TF?",
          options: [
            { text: "Karena dana TF memang legal (donasi, gaji)", why: "Benar: yang disembunyikan = tujuannya, bukan sumbernya.", correct: true },
            { text: "Karena sumber bisa dipalsukan", why: "Bisa, tetapi bukan inti bedanya." },
            { text: "Karena semua donasi mencurigakan", why: "Tidak — donasi normal ada; yang dicari = pola + jaringan." }
          ],
        }
      ],
      reference: "TF: ikut jaringannya, bukan uangnya. Skor + verifikasi + no tipping-off.",
    },
  ],
};
