import type { V2Lesson } from "../lib/types";

const FIG_CYBERFLOW = `<svg viewBox="0 0 480 300" role="img" aria-label="Alur pencucian hasil kejahatan siber: korban, mule, mixer, exchange.">
<g font-family="var(--font-ui)">
<text x="240" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="600">Dari korban ke &#8220;bersih&#8221;: rantai pencucian cybercrime</text>
<rect x="20" y="50" width="90" height="40" rx="6" fill="var(--c4)" opacity="0.9"/>
<text x="65" y="66" font-size="10" fill="#fff" text-anchor="middle">KORBAN</text>
<text x="65" y="81" font-size="10" fill="#fff" text-anchor="middle">Rp500 jt</text>
<text x="125" y="72" font-size="14" fill="var(--chart-text)">&#8594;</text>
<rect x="140" y="50" width="90" height="40" rx="6" fill="var(--c3)" opacity="0.9"/>
<text x="185" y="66" font-size="10" fill="#fff" text-anchor="middle">MULE x8</text>
<text x="185" y="81" font-size="10" fill="#fff" text-anchor="middle">fan-out</text>
<text x="245" y="72" font-size="14" fill="var(--chart-text)">&#8594;</text>
<rect x="260" y="50" width="90" height="40" rx="6" fill="var(--c2)" opacity="0.9"/>
<text x="305" y="66" font-size="10" fill="#fff" text-anchor="middle">MIXER</text>
<text x="305" y="81" font-size="10" fill="#fff" text-anchor="middle">acak asal</text>
<text x="365" y="72" font-size="14" fill="var(--chart-text)">&#8594;</text>
<rect x="380" y="50" width="90" height="40" rx="6" fill="var(--c1)" opacity="0.9"/>
<text x="425" y="66" font-size="10" fill="#fff" text-anchor="middle">EXCHANGE</text>
<text x="425" y="81" font-size="10" fill="#fff" text-anchor="middle">cair Rp</text>
<text x="20" y="120" font-size="11" fill="var(--chart-text)">waktu tempuh tipikal: jam, bukan hari</text>
<text x="20" y="140" font-size="11" fill="var(--chart-text)">jejak terputus di: MIXER (lompatan rantai)</text>
<rect x="20" y="160" width="440" height="60" rx="6" fill="none" stroke="var(--c4)" stroke-dasharray="6 4"/>
<text x="35" y="184" font-size="11" fill="var(--chart-text)">Jendela emas analis: SEBELUM mixer &#8212; bekukan di mule/exchange.</text>
<text x="35" y="204" font-size="11" fill="var(--chart-text)">Sesudah mixer: butuh kerja sama lintas yurisdiksi (lambat).</text>
<text x="240" y="248" font-size="11" fill="var(--chart-text)" text-anchor="middle">Cara membaca: kotak = tahap, panah = aliran dana.</text>
<text x="240" y="268" font-size="11" fill="var(--chart-text)" text-anchor="middle">Interpretasi: kecepatan adalah senjata pelaku &#8212; respons harus lebih cepat.</text>
</g>
</svg>`;

export const aml13: V2Lesson = {
  slug: "aml13-cybercrime-laundering",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML13 — Cybercrime-Enabled Laundering",
  estMinutes: 58,
  steps: [
    {
      id: "sampul",
      eyebrow: "Sampul",
      title: "Uang hasil menipu, dicuci dengan kecepatan cahaya",
      prose: [
        "AML13 — Cybercrime-Enabled Laundering · 58 menit · 3 lab Python · 5 kuis · 1 mini-case · 1 chart.",
        "Daftar isi: 1. Cerita: Budi dan 'investasi' Rp500 juta. 2. Konsep: tiga kejahatan siber. 3. Konsep: cara hasil siber dicuci. 4. Lab: deteksi rekening mule. 5. Lab: peluang pemulihan per lompatan. 6. Lab: anomali invoice BEC. 7. Peta keputusan: laporan fraud masuk, respons apa. 8. Mini-case: BEC Rp1,8 miliar. 9. Checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan tiga kejahatan siber utama (ransomware, BEC, pig butchering) dan jejak dananya; (2) menguraikan rantai pencucian cybercrime: mule, mixer, chain-hopping; (3) menghitung peluang pemulihan dana per jumlah lompatan; (4) mendeteksi rekening mule dari pola fan-in/fan-out; (5) menentukan respons analis dalam jendela emas sebelum mixer.",
        "Konteks CAMS: CAMS edisi ke-7 (relaunch 15 Juli 2025) memasukkan cybercrime sebagai domain inti spektrum Anti-Financial Crime. Bagi analis AML, ini berarti: kejahatan siber bukan 'urusan tim IT' — ia adalah predicate crime yang hasilnya WAJIB kamu kejar di sistem monitoring.",
      ],
      tasks: [],
      reference: "Cybercrime = predicate crime. Hasilnya dicuci via mule → mixer → exchange.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Budi dan 'investasi' Rp500 juta",
      prose: [
        "Budi, 58, pensiunan guru, dikenalkan 'Clara' di aplikasi chat. Tiga bulan Clara mengajarinya 'trading kripto' di platform yang terlihat profesional — saldo Budi tumbuh di layar dari Rp50 juta menjadi Rp740 juta. Saat Budi menarik Rp500 juta 'keuntungan', platform meminta 'pajak pencairan' Rp80 juta dulu. Ia transfer. Akunnya diblokir. Clara hilang. Platformnya fiktif.",
        "Twist-nya: uang Budi tidak 'hilang ke internet'. Dalam 6 jam setelah transfer terakhir, Rp580 juta itu pecah ke 8 rekening berbeda (mule), lalu 3 jam kemudian terkonsentrasi ke 2 wallet kripto, lalu 'diaduk' di mixer dan melompat ke 2 blockchain lain. Jejaknya tidak hilang karena pelaku pintar — melainkan karena rantai pencuciannya lebih cepat dari proses analis.",
        "Inilah pig butchering ('menyembelih babi'): korban 'digemukkan' dulu dengan kepercayaan dan keuntungan palsu, baru 'disembelih'. Bagi analis AFC, pelajaran ceritanya: kejahatan siber menghasilkan dana kotor dalam jumlah besar dan waktu singkat — dan pencuciannya dirancang untuk mengalahkan kecepatanmu. Lesson ini tentang cara mengejarnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rekening mule sering dibuka atas nama orang biasa (mahasiswa, ibu rumah tangga) dengan imbalan Rp500 ribu. Bank yang kecolongan = namanya muncul di laporan polisi sebagai 'bank penampung dana penipuan' = risiko reputasi + risiko regulasi. Deteksi mule sejak dini melindungi bank dua arah: dari dalam (rekening disalahgunakan) dan dari luar (dana korban).",
      },
      reference: "Pig butchering: gemukkan → sembelih. Cuci: pecah → kumpul → aduk → lompat.",
    },
    {
      id: "tiga-siber",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga kejahatan siber: kenali kepribadiannya",
      prose: [
        "Ransomware — Si Penyandera. Kepribadian: frontal dan tidak sabar. Ia mengenkripsi data korban (rumah sakit, perusahaan, pemda) lalu menuntut tebusan — biasanya dalam kripto — dengan tenggat 72 jam. Jejak dananya khas: SATU pembayaran besar ke SATU alamat wallet, lalu segera dipecah (peel chain). Bagi analis: pembayaran tebusan yang difasilitasi bank/klien = red flag; beberapa yurisdiksi mewajibkan lapor.",
        "BEC (Business Email Compromise) — Si Peniru. Kepribadian: sabar dan teliti. Ia menyusup ke email perusahaan (atau memalsukannya), mempelajari pola pembayaran, lalu di momen tepat mengirim 'instruksi transfer baru' seolah dari direksi/vendor — lengkap dengan kop surat dan bahasa yang benar. Jejak dananya: transfer bisnis yang TERLIHAT sah ke rekening 'vendor' baru, biasanya Rp500 juta–Rp5 miliar, satu-dua kali saja. Tidak ada pola berulang — karena ia hanya butuh satu pukulan.",
        "Pig butchering — Si Penggemuk. Kepribadian: romantis dan tekun. Butuh 2–6 bulan membangun hubungan (asmara atau pertemanan), 'keuntungan' palsu ditampilkan di platform fiktif, korban diminta 'tambah modal' berkali-kali. Jejak dananya: BANYAK transfer keluar dari korban ke BANYAK rekening/wallet dalam pola meningkat — lalu berhenti total (saat disembelih). Inilah pola yang bisa ditangkap monitoring: eskalasi transfer + tujuan baru berulang.",
        "Benang merah ketiganya: hasil kejahatan siber adalah dana KOTOR yang butuh dicuci — dan pencuciannya selalu berpacu dengan waktu. Peluang dana bisa dipulihkan menyusut di tiap lompatan:",
      ],
      formula: String.raw`P_n = (1 - p)^n`,
      formulaNote: "P_n = peluang dana masih terlacak setelah n lompatan; p = peluang jejak terputus per lompatan (≈0,5 setelah mixer, ≈0,15 antar-rekening bank biasa); n = jumlah lompatan. Contoh: 4 lompatan via mixer (p=0,5): P = 0,5^4 = 6,25%. Interpretasi: tiap lompatan membelah peluangmu — karena itu jendela emas = sebelum lompatan ke-2.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Korban transfer sukarela, jadi bukan fraud.” Dalam pig butchering dan BEC, korban memang menekan tombol kirim sendiri — tetapi persetujuannya direkayasa lewat penipuan. 'Sukarela' tidak menghapus pidananya, dan bank tetap wajib memproses indikasi penipuannya. Analis yang menunggu 'transfer tanpa izin' akan melewatkan 90% kasus siber.",
      },
      hints: [
        "Ransomware: 1 bayaran besar → pecah. BEC: 1 transfer 'sah' → vendor palsu. Pig butchering: banyak transfer meningkat → berhenti.",
        "P_n = (1-p)^n: tiap lompatan membelah peluang pemulihan.",
      ],
      reference: "Penyandera (frontal), Peniru (sabar), Penggemuk (tekun).",
    },
    {
      id: "rantai-cuci",
      eyebrow: "Langkah 3 · Konsep",
      title: "Cara hasil siber dicuci: mule, mixer, lompat rantai",
      prose: [
        "Mule — Si Kurir Rekening. Rekening bank/wallet milik orang lain yang dipakai menampung dana sementara, lalu meneruskannya (sering dipotong komisi 5–10%). Pola transaksinya khas: fan-in (banyak pengirim → satu rekening) lalu fan-out cepat (satu rekening → banyak tujuan), saldo mengendap < 24 jam, dan profil tidak cocok (mahasiswa menerima Rp200 juta lalu meneruskan dalam 2 jam). Mule adalah titik TERLEMAH rantai pelaku — karena ia memakai sistem perbankan yang bisa kamu bekukan.",
        "Mixer/tumbler — Si Pengaduk. Layanan (atau smart contract) yang mencampur dana banyak pengguna lalu mengeluarkan jumlah setara ke alamat baru — memutus tautan asal-tujuan di blockchain. Setelah mixer, analisis on-chain konvensional buta. Kabar baiknya: mixer adalah titik TERKUAT pelaku tetapi juga titik paling mencurigakan — dana yang keluar dari mixer yang diketahui = red flag otomatis di banyak exchange.",
        "Chain-hopping — Si Pelompat. Memindahkan dana antar-blockchain (mis. Bitcoin → Ethereum → Tron) via bridge/DEX non-kustodian, sering digabung dengan mixer di tiap rantai. Setiap lompatan memaksa analis berpindah tool, format data, dan kadang yurisdiksi.",
        "Cara membaca figur: empat kotak = empat tahap, panah = arah dana. Interpretasi: pelaku mengandalkan KECEPATAN (jam, bukan hari) — maka pertahanan analis juga harus kecepatan: deteksi mule otomatis + pembekuan dalam hitungan jam, bukan hari. Sesudah mixer, permainan berubah dari 'kejar' menjadi 'kerja sama lintas yurisdiksi'.",
      ],
      figure: {
        svg: FIG_CYBERFLOW,
        alt: "Alur pencucian: korban, mule, mixer, exchange.",
        caption: "Jendela emas: bekukan sebelum mixer.",
      },
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Sudah masuk kripto = tidak bisa dilacak.” Salah: blockchain itu BUKU BESAR PUBLIK — justru lebih transparan dari bank. Yang menyulitkan bukan kriptonya, melainkan mixer dan lompatan rantai. Analis yang paham on-chain analytics (ingat AML9) justru punya keunggulan di tahap pra-mixer.",
      },
      hints: [
        "Mule = titik terlemah (bisa dibekukan). Mixer = titik terkuat pelaku.",
        "Kecepatan pelaku (jam) vs kecepatan analis = pertempuran sesungguhnya.",
      ],
      reference: "Mule (bekukan) → mixer (red flag) → hop (ganti tool).",
    },
    {
      id: "lab-mule",
      eyebrow: "Langkah 4 · Lab",
      title: "Deteksi rekening mule",
      prose: [
        "Enam rekening dengan ringkasan 7 hari: jumlah pengirim unik (fan-in), jumlah tujuan unik (fan-out), dan jam rata-rata dana mengendap. Aturan deteksi: fan-in ≥ 5 DAN fan-out ≥ 3 DAN mengendap < 24 jam → MULE. Perhatikan 'Rek C': fan-in 8 tetapi mengendap 72 jam (toko online yang sah) — LOLOS. Dan 'Rek E': hanya fan-in 2 — bukan mule, mungkin korban.",
        "Eksperimen: turunkan ambang fan-in menjadi ≥3, lalu jalankan ulang. Berapa rekening ikut ter-flag? Inilah trade-off recall vs presisi: ambang longgar menangkap lebih banyak mule TETAPI juga lebih banyak toko online sah.",
      ],
      tasks: [
        { id: "t1", text: "Tandai mule ke list `mule` (nama rekening)" },
        { id: "t2", text: "Jalankan dan pastikan daftar tercetak" },
      ],
      expected: "Mule terdeteksi: ['Rek A', 'Rek D', 'Rek F'] (3 dari 6)",
      note: {
        title: "💡 Intuisi",
        body: "'Dana mengendap < 24 jam' adalah fitur paling jujur: orang normal membiarkan uangnya diam (gaji, tabungan); mule tidak bisa — uang harus segera diteruskan sebelum rekening dibekukan. Ketergesaan adalah tanda tangan pelaku.",
      },
      hints: [
        "mule jika fan_in >= 5 dan fan_out >= 3 dan jam < 24.",
        "Simpan nama rekening yang memenuhi ke list mule.",
      ],
      code: {
        starter: "# (nama, fan_in, fan_out, jam_mengendap). JANGAN UBAH.\nrekening = [(\"Rek A\", 9, 7, 6.0), (\"Rek B\", 3, 2, 100.0),\n            (\"Rek C\", 8, 1, 72.0), (\"Rek D\", 12, 9, 3.0),\n            (\"Rek E\", 2, 1, 200.0), (\"Rek F\", 6, 5, 18.0)]\n\n# TULIS KODEMU: deteksi mule\nmule = []\nfor nama, fi, fo, jam in rekening:\n    if :\n        mule.append(nama)\nprint(f\"Mule terdeteksi: {mule} ({len(mule)} dari {len(rekening)})\")\n",
        lockLines: 5,
        solution: "# (nama, fan_in, fan_out, jam_mengendap). JANGAN UBAH.\nrekening = [(\"Rek A\", 9, 7, 6.0), (\"Rek B\", 3, 2, 100.0),\n            (\"Rek C\", 8, 1, 72.0), (\"Rek D\", 12, 9, 3.0),\n            (\"Rek E\", 2, 1, 200.0), (\"Rek F\", 6, 5, 18.0)]\n\n# TULIS KODEMU: deteksi mule\nmule = []\nfor nama, fi, fo, jam in rekening:\n    if fi >= 5 and fo >= 3 and jam < 24:\n        mule.append(nama)\nmule_str = \",\".join(mule)\nprint(f\"Mule terdeteksi: {mule} ({len(mule)} dari {len(rekening)})\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "3 mule", msg: "Rek A, D, F.", name: "mule_str", value: "Rek A,Rek D,Rek F" },
          { kind: "stdout_matches", task: "t2", label: "Daftar tercetak", msg: "Samakan format.", pattern: "Mule terdeteksi: \\['Rek A', 'Rek D', 'Rek F'\\]" }
        ],
      },
      reference: "Mule: fan-in ≥5, fan-out ≥3, mengendap <24 jam.",
    },
    {
      id: "lab-peluang",
      eyebrow: "Langkah 5 · Lab",
      title: "Peluang pemulihan per lompatan",
      prose: [
        "Dana Rp580 juta Budi melompat 5 kali: 2 lompatan antar-rekening bank (p=0,15), 1 via mixer (p=0,5), 2 chain-hop (p=0,4). Hitung peluang kumulatif masih terlacak: P = Π(1-p_i). Perhatikan: satu mixer (p=0,5) memangkas peluang lebih dari dua lompatan bank digabung.",
        "Rumus umum P_n = (1-p)^n hanya untuk p seragam; di dunia nyata tiap lompatan punya p berbeda — maka pakai perkalian satu per satu seperti lab ini.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `peluang` kumulatif setelah tiap lompatan" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Setelah 5 lompatan: peluang terlacak 13.0% -> kejar via kerja sama yurisdiksi",
      note: {
        title: "💡 Intuisi",
        body: "Angka 18,4% BUKAN vonis 'tidak bisa' — ia adalah bahasa untuk meminta sumber daya: 'Pak, peluang turun di bawah 20% setelah mixer; saya butuh surat pembekuan HARI INI, bukan minggu depan.' Analis yang bicara dengan angka didengar lebih cepat.",
      },
      hints: [
        "peluang mulai 1.0; tiap lompatan: peluang *= (1 - p).",
        "verdict 'kejar via kerja sama yurisdiksi' jika peluang < 0.25.",
      ],
      code: {
        starter: "# p terputus per lompatan: 2x bank, 1x mixer, 2x chain-hop. JANGAN UBAH.\nlompatan = [0.15, 0.15, 0.50, 0.40, 0.40]\n\n# TULIS KODEMU: peluang kumulatif terlacak\npeluang = 1.0\nfor p in lompatan:\n    peluang =\nprint(f\"Setelah {len(lompatan)} lompatan: peluang terlacak {peluang:.1%}\", end=\"\")\nprint(\" -> \" + (\"kejar via kerja sama yurisdiksi\" if peluang < 0.25 else \"kejar langsung\"))\n",
        lockLines: 2,
        solution: "# p terputus per lompatan: 2x bank, 1x mixer, 2x chain-hop. JANGAN UBAH.\nlompatan = [0.15, 0.15, 0.50, 0.40, 0.40]\n\n# TULIS KODEMU: peluang kumulatif terlacak\npeluang = 1.0\nfor p in lompatan:\n    peluang *= (1 - p)\nprint(f\"Setelah {len(lompatan)} lompatan: peluang terlacak {peluang:.1%}\", end=\"\")\nprint(\" -> \" + (\"kejar via kerja sama yurisdiksi\" if peluang < 0.25 else \"kejar langsung\"))\n",
        checks: [
          { kind: "equal", task: "t1", label: "Peluang ≈ 0,184", msg: "0,85²×0,5×0,6².", name: "peluang", value: 0.13005, tol: 0.0001 },
          { kind: "stdout_matches", task: "t2", label: "Verdict tercetak", msg: "< 25%.", pattern: "peluang terlacak 13\\.0% -> kejar via kerja sama yurisdiksi" }
        ],
      },
      reference: "P = Π(1-p_i). Mixer = pemangkas terbesar.",
    },
    {
      id: "lab-bec",
      eyebrow: "Langkah 6 · Lab",
      title: "Anomali invoice BEC",
      prose: [
        "Delapan pembayaran vendor PT Maju Jaya (Rp juta). Pola BEC: (1) rekening tujuan BARU (belum pernah dipakai), (2) nominal di atas rata-rata historis vendor × 1,5, (3) instruksi via email (bukan portal). Skor = jumlah pola (0–3); skor ≥2 → TAHAN + verifikasi via telepon ke nomor yang sudah dikenal (bukan nomor di email!).",
        "Perhatikan 'V-004': Rp1.800 juta ke rekening baru via email — skor 3. Inilah mini-case kita nanti. Dan 'V-006': Rp950 juta via portal ke rekening lama — skor 0, walau nominal besar. Nominal besar saja bukan anomali; KOMBINASI-nya yang aneh.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor tiap pembayaran, tandai yang ≥2 ke `tahan`" },
        { id: "t2", text: "Jalankan dan pastikan daftar tahan tercetak" },
      ],
      expected: "Tahan & verifikasi: ['V-004', 'V-007']",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Sudah verifikasi via email balasan.” Email-nya JUSTRU yang dikuasai pelaku — membalas email penipu untuk verifikasi = meminta izin ke penipu. Verifikasi BEC wajib lewat kanal INDEPENDEN: telepon ke nomor di kontrak lama, atau tatap muka.",
      },
      hints: [
        "rata2 = rata-rata nominal; aneh_nominal = jml > 1.5 * rata2.",
        "skor = baru + aneh_nominal + via_email; tahan jika >= 2.",
      ],
      code: {
        starter: "# (id, jumlah Rp jt, rek_baru, via_email). JANGAN UBAH.\nbayar = [(\"V-001\", 420.0, False, False), (\"V-002\", 450.0, False, False),\n         (\"V-003\", 400.0, False, True), (\"V-004\", 1800.0, True, True),\n         (\"V-005\", 430.0, False, False), (\"V-006\", 950.0, False, False),\n         (\"V-007\", 1200.0, True, False), (\"V-008\", 410.0, False, False)]\n\n# TULIS KODEMU: skor BEC; tahan jika >= 2\nrata2 = sum(j for _, j, _, _ in bayar) / len(bayar)\ntahan = []\nfor vid, jml, baru, email in bayar:\n    skor =\n    if skor >= 2:\n        tahan.append(vid)\nprint(f\"Tahan & verifikasi: {tahan}\")\n",
        lockLines: 7,
        solution: "# (id, jumlah Rp jt, rek_baru, via_email). JANGAN UBAH.\nbayar = [(\"V-001\", 420.0, False, False), (\"V-002\", 450.0, False, False),\n         (\"V-003\", 400.0, False, True), (\"V-004\", 1800.0, True, True),\n         (\"V-005\", 430.0, False, False), (\"V-006\", 950.0, False, False),\n         (\"V-007\", 1200.0, True, False), (\"V-008\", 410.0, False, False)]\n\n# TULIS KODEMU: skor BEC; tahan jika >= 2\nrata2 = sum(j for _, j, _, _ in bayar) / len(bayar)\ntahan = []\nfor vid, jml, baru, email in bayar:\n    skor = (1 if baru else 0) + (1 if jml > 1.5 * rata2 else 0) + (1 if email else 0)\n    if skor >= 2:\n        tahan.append(vid)\nprint(f\"Tahan & verifikasi: {tahan}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "V-004 & V-007 ditahan", msg: "Skor 3 dan 2.", pattern: "Tahan & verifikasi: \\['V-004', 'V-007'\\]" },
          { kind: "uses", task: "t1", label: "Memakai rata-rata", msg: "Bandingkan dengan 1,5× rata-rata.", token: "rata2" }
        ],
      },
      reference: "BEC: rekening baru + nominal aneh + via email. Verifikasi via kanal independen.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Laporan fraud masuk: respons apa",
      prose: [
        "Satu: korban melapor < 24 jam, dana masih di mule domestik → BEKUKAN SEKARANG via mekanisme bank (recall/fraud hold), lalu telusuri fan-out. Dua: dana sudah ke mixer → jangan kejar sendirian; siapkan paket bukti (alamat wallet, tx hash, timeline) untuk exchange + aparat + kerja sama yurisdiksi. Tiga: indikasi BEC (pembayaran ke rekening vendor baru) → TAHAN pembayaran berikutnya + verifikasi via telepon ke nomor lama + cek apakah email diretas. Empat: pola pig butchering (transfer meningkat ke tujuan baru) → hubungi nasabah SEGERA (edukasi + tawarkan blokir), catat sebagai kandidat SAR.",
        "Aturan praktis 10 detik: <24 jam + masih di bank = bekukan. Sudah mixer = siapkan paket bukti. BEC = tahan + telepon nomor lama. Pola korban = hubungi + edukasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jendela emas bukan slogan: data lab menunjukkan peluang terlacak turun dari 100% ke ~13% dalam 5 lompatan. Setiap jam yang dihabiskan untuk 'rapat dulu' adalah lompatan gratis untuk pelaku. Desain SLA respons fraud < 4 jam untuk kasus siber — bukan < 4 hari.",
      },
      reference: "Kecepatan = senjata. Bekukan dulu, rapat kemudian.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "BEC Rp1,8 miliar di PT Maju Jaya",
      prose: [
        "Kamis 16:40: bagian keuangan PT Maju Jaya menerima email dari 'direktur@' (satu huruf beda dari aslinya) — instruksi bayar Rp1,8 miliar ke rekening 'vendor baru' karena 'vendor lama bermasalah'. Staf mengeksekusi Jumat 09:00. Senin pagi vendor asli menagih. Skor BEC: rekening baru (1) + nominal 4× rata-rata (1) + via email (1) = 3 → seharusnya DITAHAN.",
        "Pertanyaan: (a) Apa yang salah dari prosesnya? (b) Langkah Senin pagi? Pembahasan: (a) Tidak ada dual control untuk perubahan rekening tujuan; tidak ada verifikasi kanal independen; email mirip tidak terdeteksi. (b) Senin 08:00: hubungi bank — recall dana (peluang masih ada jika < 72 jam dan belum lompat); bekukan jika mule teridentifikasi; lapor polisi + siapkan SAR; audit email (apakah mailbox diretas — jika ya, seluruh instruksi 30 hari terakhir dicurigai). Biaya dual control: Rp0 + 10 menit per pembayaran besar. Biaya BEC ini: Rp1,8 miliar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "BEC adalah fraud termahal per kejadian justru karena ia memakai proses SAH perusahaan. Pertahanan termurah = aturan 'setiap perubahan rekening tujuan wajib konfirmasi telepon ke nomor terdaftar'. Satu kalimat di SOP mengalahkan satu tim forensik.",
      },
      reference: "Dual control + verifikasi independen > forensik.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Kunci: kecepatan + pola, bukan nominal.",
      ],
      tasks: [],
      summary: [
        "Ransomware = frontal (1 bayaran besar); BEC = peniru (1 transfer 'sah'); pig butchering = penggemuk (banyak transfer meningkat).",
        "Pencucian: mule (fan-in/out cepat) → mixer (pengaduk) → chain-hop (ganti rantai).",
        "P_n = (1-p)^n: tiap lompatan membelah peluang pemulihan; mixer pemangkas terbesar.",
        "Jendela emas = sebelum mixer: bekukan di mule/exchange dalam hitungan jam.",
        "BEC: rekening baru + nominal aneh + via email → tahan + verifikasi kanal independen.",
      ],
      next: { label: "AML14 — RegTech, AI & pKYC", href: "/v2/learn/aml14-regtech-ai-pkyc" },
      quiz: [
        {
          q: "Korban transfer Rp50 juta × 10 kali dalam 2 bulan ke wallet baru, lalu berhenti total. Pola ini paling cocok dengan?",
          options: [
            { text: "Pig butchering", why: "Benar: eskalasi transfer lalu berhenti = digemukkan lalu disembelih.", correct: true },
            { text: "Ransomware", why: "Ransomware = 1 tebusan besar dengan tenggat, bukan cicilan." },
            { text: "BEC", why: "BEC = 1 transfer bisnis 'sah', bukan cicilan personal." },
            { text: "Skimming ATM", why: "Skimming mencuri data kartu, bukan pola transfer korban." }
          ],
        },
        {
          q: "Dana melewati 2 lompatan bank (p=0,15) lalu 1 mixer (p=0,5). Peluang masih terlacak?",
          options: [
            { text: "≈36%", why: "Benar: 0,85 × 0,85 × 0,5 = 0,361.", correct: true },
            { text: "≈72%", why: "Itu tanpa mixer (0,85²). Mixer memangkas setengah." },
            { text: "≈0%", why: "Mixer menyulitkan, bukan mustahil — apalagi pra-mixer on-chain transparan." },
            { text: "≈85%", why: "Itu peluang SATU lompatan bank saja." }
          ],
        },
        {
          q: "Rekening: fan-in 8, fan-out 1, dana mengendap 72 jam. Menurut aturan lab, statusnya?",
          options: [
            { text: "Bukan mule — fan-out < 3 dan mengendap lama", why: "Benar: butuh ketiganya (≥5, ≥3, <24 jam). Ini mungkin toko online.", correct: true },
            { text: "Mule, karena fan-in tinggi", why: "Fan-in saja tidak cukup; butuh fan-out cepat + mengendap singkat." },
            { text: "Mule, karena mengendap 72 jam", why: "Mengendap LAMA justru ciri non-mule." },
            { text: "Pasti korban pig butchering", why: "Data ini tentang rekening penampung, bukan korban." }
          ],
        },
        {
          q: "Email 'direktur' meminta transfer ke rekening vendor baru. Verifikasi yang BENAR?",
          options: [
            { text: "Telepon direktur ke nomor yang sudah terdaftar lama", why: "Benar: kanal independen, bukan nomor di email.", correct: true },
            { text: "Balas email meminta konfirmasi", why: "Emailnya dikuasai pelaku — verifikasi ke penipu." },
            { text: "Cek saldo rekening vendor baru", why: "Saldo tidak membuktikan keaslian instruksi." },
            { text: "Tunggu sampai vendor lama menagih", why: "Menunggu = dana sudah lompat entah ke mana." }
          ],
        },
        {
          q: "Dana korban sudah melewati mixer yang diketahui. Langkah analis paling tepat?",
          options: [
            { text: "Siapkan paket bukti untuk exchange + aparat + kerja sama yurisdiksi", why: "Benar: pasca-mixer = permainan bukti lintas pihak, bukan kejar-kejar.", correct: true },
            { text: "Tutup kasus karena tidak terlacak", why: "Mixer ≠ akhir; exchange tujuan bisa membekukan dengan bukti cukup." },
            { text: "Bekukan rekening korban", why: "Korban bukan pelaku; bekukan = menghukum korban." },
            { text: "Tunggu pelaku memindahkan lagi", why: "Menunggu pasif = memberi waktu; paket bukti harus jalan sekarang." }
          ],
        }
      ],
      reference: "Kecepatan + pola. Jendela emas sebelum mixer.",
    },
  ],
};
