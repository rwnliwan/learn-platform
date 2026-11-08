import type { V2Lesson } from "../lib/types";

const FIG_LAPIS = `<svg viewBox="0 0 520 320" role="img" aria-label="Pertahanan berlapis terhadap fraud berbasis AI: empat lapis verifikasi.">
<g font-family="var(--font-ui)">
<text x="260" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Pertahanan berlapis vs fraud AI</text>
<rect x="60" y="50" width="400" height="44" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="260" y="78" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Lapis 1 — Verifikasi identitas berlapis (bukan sekadar OTP)</text>
<rect x="60" y="106" width="400" height="44" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="260" y="134" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Lapis 2 — Verifikasi out-of-band (kanal kedua independen)</text>
<rect x="60" y="162" width="400" height="44" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="260" y="190" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Lapis 3 — Anomali perilaku &amp; perangkat</text>
<rect x="60" y="218" width="400" height="44" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="260" y="246" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Lapis 4 — Prosedur manusia (callback, kata sandi, maker-checker)</text>
<text x="260" y="292" font-size="10" fill="var(--chart-text)" text-anchor="middle">Satu lapis bisa ditipu AI. Empat lapis sekaligus jauh lebih sulit.</text>
</g>
</svg>`;

export const aml24: V2Lesson = {
  slug: "aml24-ai-enabled-fraud",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML24 — Fraud Berwajah AI: Deepfake, Impersonation, dan Pertahanan Berlapis",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Video call dengan 'direktur' yang tidak pernah ada",
      prose: [
        "Seorang staf keuangan perusahaan multinasional di Hong Kong menerima undangan video call: direkturnya — yang ia kenali wajah dan suaranya — meminta transfer dana mendesak ke beberapa rekening. Ia menurut. Belakangan terbukti: SEMUA peserta call kecuali dirinya adalah deepfake yang dibuat dengan AI. Kerugian: ratusan juta dolar Hong Kong. Kasus nyata yang dilaporkan kepolisian Hong Kong pada 2024 ini mengubah cara industri memandang verifikasi.",
        "Twist-nya: korban bukan orang bodoh atau ceroboh — ia mengikuti prosedur yang tertulis. Prosedurnya lah yang usang: 'verifikasi visual via video call' ditulis di era ketika memalsukan wajah butuh studio Hollywood. Kini memalsukan wajah butuh laptop dan beberapa foto dari media sosial. Analis fraud yang masih mengandalkan 'lihat wajahnya, dengar suaranya' sedang menjaga gerbang dengan kunci yang sudah diduplikasi massal.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan modus fraud berbasis AI yang dominan (voice cloning, video deepfake, dokumen sintetis); (2) menjelaskan mengapa kontrol lama (KYC statis, OTP) gagal menghadapinya; (3) merancang pertahanan berlapis; (4) menghitung skor risiko sesi dan menentukan keputusan izinkan/tantang/blokir; (5) menjelaskan peran analis fraud dalam playbook respons. Konteks karir: AI-enabled fraud adalah ancaman yang paling sering disebut dalam laporan industri 2025–2026 — pewawancara akan bertanya apa jawabanmu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Deepfake fraud menyerang dua sisi sekaligus: sisi fraud (dana keluar lewat rekayasa sosial) dan sisi AML (dana hasil kejahatan masuk lewat identitas sintetis). Analis yang memahami keduanya menjadi jembatan langka antara tim fraud dan tim AML — posisi yang makin dicari.",
      },
      reference: "Wajah bisa dipalsukan; prosedur harus diperbarui.",
    },
    {
      id: "modus",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga wajah fraud AI: suara, video, dokumen",
      prose: [
        "Si Peniru Tiga Rupa. Rupa pertama: voice cloning — AI meniru suara seseorang dari sampel audio singkat (voicemail, rekaman rapat, konten media sosial). Modus klasik: 'CFO' menelepon staf keuangan meminta transfer mendesak, dengan urgensi sebagai senjata ('jangan bilang siapa-siapa, ini rahasia direksi').",
        "Rupa kedua: video deepfake — wajah dan gerak bibir direkayasa real-time dalam video call, seperti kasus Hong Kong di atas. Rupa ketiga: dokumen sintetis — KTP, slip gaji, atau laporan keuangan yang dibuat/diedit AI untuk lolos KYC dan pengajuan kredit. Ketiganya berbagi satu pola: menyerang KEPERCAYAAN pada indera dan dokumen, bukan pada sistem.",
        "Kenapa 2026 menjadi titik didih: biaya pembuatan turun drastis sementara kualitas naik — serangan yang dulu butuh tim ahli kini bisa dijalankan penjahat kelas menengah. Volume impersonation scam melonjak tajam menurut laporan industri; trennya naik, bukan turun.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Deepfake mudah dikenali — gerakannya kaku.” Itu deepfake 2021. Generasi sekarang menangani kedipan, gerak bibir, bahkan interupsi real-time. Mengandalkan 'feeling tidak natural' sebagai kontrol = tidak punya kontrol.",
      },
      reference: "Tiga rupa, satu target: kepercayaanmu.",
    },
    {
      id: "kontrol-gagal",
      eyebrow: "Langkah 3 · Konsep",
      title: "Kenapa kontrol lama gagal",
      prose: [
        "Si Kunci yang Sudah Diduplikasi. Kontrol lama gagal karena ia memverifikasi hal yang kini bisa dipalsukan. KYC statis (foto KTP + selfie) kalah oleh dokumen sintetis dan wajah buatan. OTP via SMS kalah oleh SIM swap dan rekayasa sosial ('tolong bacakan kode yang masuk, ini verifikasi keamanan'). Verifikasi video call kalah oleh deepfake real-time.",
        "Pola kegagalannya sama: kontrol satu faktor yang mengandalkan SATU jenis bukti. AI generatif berspesialisasi meniru tepat satu jenis bukti itu dengan murah. Pertahanan yang selamat adalah yang menuntut bukti dari JENIS yang berbeda dan dari KANAL yang independen — sehingga penipu harus memalsukan banyak hal sekaligus, secara bersamaan.",
        "Implikasi untuk analis: setiap kali kamu menulis aturan deteksi, tanyakan 'jenis bukti apa yang diverifikasi aturan ini, dan bisakah AI memalsukannya hari ini?' Aturan yang tidak lolos pertanyaan itu adalah utang keamanan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Solusinya AI detector yang lebih canggih.” Perlombaan senjata detektor vs generator tidak pernah dimenangkan permanen oleh detektor — generator selalu selangkah di depan. Strategi yang tahan lama adalah pertahanan berlapis dan verifikasi independen, bukan satu detektor ajaib.",
      },
      reference: "Satu bukti bisa dipalsukan; banyak bukti independen sulit.",
    },
    {
      id: "pertahanan",
      eyebrow: "Langkah 4 · Konsep",
      title: "Pertahanan berlapis: empat lapis",
      prose: [
        "Si Benteng Empat Lapis. Lapis 1 — verifikasi identitas berlapis: kombinasikan sesuatu yang diketahui, dimiliki, dan melekat — tetapi pilih yang tahan AI (misalnya, biometrik dengan liveness detection yang sesungguhnya, bukan sekadar foto).",
        "Lapis 2 — verifikasi out-of-band: konfirmasi lewat kanal KEDUA yang independen. Instruksi transfer via video call diverifikasi lewat telepon balik ke nomor resmi yang tersimpan (bukan nomor yang diberikan penelepon), atau lewat pesan di sistem internal. Prinsipnya: penipu menguasai satu kanal; ia jarang menguasai dua kanal independen sekaligus.",
        "Lapis 3 — anomali perilaku & perangkat: pola mengetik, perangkat yang dipakai, lokasi, jam transaksi — sinyal yang sulit ditiru karena penipu tidak punya baseline perilaku korban. Lapis 4 — prosedur manusia: maker-checker untuk transfer besar, kata sandi/ frasa verifikasi internal untuk instruksi sensitif, dan budaya 'boleh menolak instruksi atasan yang tidak terverifikasi'.",
        "Cara membaca figur: empat balok bertumpuk — setiap lapis adalah gerbang independen. Interpretasi: penipu deepfake mungkin lolos lapis 1 (wajah palsu), tetapi harus juga lolos panggilan balik independen (lapis 2), meniru perilaku (lapis 3), DAN melewati prosedur manusia (lapis 4) — dalam satu serangan yang sama. Itulah gunanya lapisan: mengalikan biaya serangan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Lapis 4 (prosedur manusia) sering diremehkan sebagai 'birokrasi', padahal ia lapis yang paling sulit diakali AI — karena AI tidak bisa memalsukan budaya organisasi yang sehat. Korban kasus Hong Kong bukan kurang pintar; ia kurang dilindungi prosedur callback.",
      },
      figure: {
        svg: FIG_LAPIS,
        alt: "Empat lapis pertahanan terhadap fraud berbasis AI.",
        caption: "Empat lapis independen: penipu harus menembus semuanya sekaligus.",
      },
      reference: "Kalikan lapis, kalikan biaya serangan.",
    },
    {
      id: "peran-analis",
      eyebrow: "Langkah 5 · Konsep",
      title: "Peran analis fraud: dari aturan ke playbook",
      prose: [
        "Si Perancang Jebakan Balik. Peran analis fraud bergeser: dari menulis aturan statis ('blokir bila X') menjadi merancang SISTEM keputusan — skor risiko sesi yang menggabungkan banyak sinyal, ambang keputusan yang dikalibrasi, dan playbook respons untuk tiap vonis.",
        "Rumus kerja analis — skor risiko sesi:",
      ],
      formula: String.raw`\text{Skor} = \sum (\text{bobot}_i \times \text{sinyal}_i)`,
      formulaNote: "sinyal_i = 1 bila sinyal risiko ke-i hadir (misalnya perangkat baru, kanal verifikasi tidak independen), 0 bila tidak; bobot_i = seberapa kuat sinyal itu menurut data historis (ditentukan dari analisis, bukan tebakan); Skor = jumlah terbobot. Vonis: skor ≥ 7 → BLOKIR; 4–6 → TANTANG (verifikasi tambahan); < 4 → IZINKAN dengan pemantauan.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Skor tinggi = pasti fraud, langsung blokir permanen.” Skor adalah PROBABILITAS, bukan vonis. Nasabah sah bisa mendapat skor tinggi (ganti HP + bepergian + transfer besar = liburan, bukan kejahatan). Itulah gunanya vonis TANTANG di tengah: verifikasi tambahan, bukan hukuman.",
      },
      reference: "Skor = probabilitas; vonis = keputusan bisnis.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 6 · Lab",
      title: "Skor risiko sesi & vonis",
      prose: [
        "Lima sesi login/transaksi tertanam (data sintetis), masing-masing dengan 4 sinyal biner: perangkat_baru, perilaku_aneh, kanal_tak_independen, nilai_besar. Bobot: perangkat_baru=2, perilaku_aneh=3, kanal_tak_independen=3, nilai_besar=2. Hitung skor tiap sesi; vonis: ≥7 BLOKIR, 4–6 TANTANG, <4 IZINKAN.",
        "Hasil: S1 skor 8 → BLOKIR; S2 skor 5 → TANTANG; S3 skor 2 → IZINKAN; S4 skor 7 → BLOKIR; S5 skor 0 → IZINKAN. Perhatikan S2: hanya dua sinyal tetapi kombinasinya (kanal tak independen + nilai besar) cukup untuk TANTANG — inilah gunanya bobot.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor tiap sesi dari sinyal × bobot" },
        { id: "t2", text: "Tentukan vonis IZINKAN / TANTANG / BLOKIR" },
        { id: "t3", text: "Hitung & cetak jumlah tiap vonis" },
      ],
      expected: "S1: skor=8 vonis=BLOKIR\nS2: skor=5 vonis=TANTANG\nS3: skor=2 vonis=IZINKAN\nS4: skor=7 vonis=BLOKIR\nS5: skor=0 vonis=IZINKAN\nizinkan=2 tantang=1 blokir=2",
      note: {
        title: "💡 Intuisi",
        body: "Bobot adalah tempat judgment analis tinggal: kenapa kanal_tak_independen berbobot 3? Karena data historis menunjukkan sinyal itu paling berkorelasi dengan fraud yang lolos. Bobot yang baik lahir dari analisis, bukan dari firasat.",
      },
      hints: [
        "skor = 2*perangkat_baru + 3*perilaku_aneh + 3*kanal_tak_independen + 2*nilai_besar.",
        "Vonis: skor>=7 BLOKIR; skor>=4 TANTANG; else IZINKAN.",
      ],
      code: {
        starter: "# Sesi & sinyal (1=hadir). JANGAN UBAH.\nsesi = [\n    {\"id\": \"S1\", \"perangkat_baru\": 1, \"perilaku_aneh\": 1, \"kanal_tak_independen\": 1, \"nilai_besar\": 0},\n    {\"id\": \"S2\", \"perangkat_baru\": 0, \"perilaku_aneh\": 0, \"kanal_tak_independen\": 1, \"nilai_besar\": 1},\n    {\"id\": \"S3\", \"perangkat_baru\": 1, \"perilaku_aneh\": 0, \"kanal_tak_independen\": 0, \"nilai_besar\": 0},\n    {\"id\": \"S4\", \"perangkat_baru\": 1, \"perilaku_aneh\": 1, \"kanal_tak_independen\": 0, \"nilai_besar\": 1},\n    {\"id\": \"S5\", \"perangkat_baru\": 0, \"perilaku_aneh\": 0, \"kanal_tak_independen\": 0, \"nilai_besar\": 0},\n]\nBOBOT = {\"perangkat_baru\": 2, \"perilaku_aneh\": 3, \"kanal_tak_independen\": 3, \"nilai_besar\": 2}\n\n# TULIS KODEMU: skor + vonis\nizinkan = 0\ntantang = 0\nblokir = 0\nfor s in sesi:\n    skor = \n    vonis = \n    print(f\"{s['id']}: skor={skor} vonis={vonis}\")\nprint(f\"izinkan={izinkan} tantang={tantang} blokir={blokir}\")\n",
        lockLines: 9,
        solution: "# Sesi & sinyal (1=hadir). JANGAN UBAH.\nsesi = [\n    {\"id\": \"S1\", \"perangkat_baru\": 1, \"perilaku_aneh\": 1, \"kanal_tak_independen\": 1, \"nilai_besar\": 0},\n    {\"id\": \"S2\", \"perangkat_baru\": 0, \"perilaku_aneh\": 0, \"kanal_tak_independen\": 1, \"nilai_besar\": 1},\n    {\"id\": \"S3\", \"perangkat_baru\": 1, \"perilaku_aneh\": 0, \"kanal_tak_independen\": 0, \"nilai_besar\": 0},\n    {\"id\": \"S4\", \"perangkat_baru\": 1, \"perilaku_aneh\": 1, \"kanal_tak_independen\": 0, \"nilai_besar\": 1},\n    {\"id\": \"S5\", \"perangkat_baru\": 0, \"perilaku_aneh\": 0, \"kanal_tak_independen\": 0, \"nilai_besar\": 0},\n]\nBOBOT = {\"perangkat_baru\": 2, \"perilaku_aneh\": 3, \"kanal_tak_independen\": 3, \"nilai_besar\": 2}\n\n# TULIS KODEMU: skor + vonis\nizinkan = 0\ntantang = 0\nblokir = 0\nfor s in sesi:\n    skor = sum(s[k] * BOBOT[k] for k in BOBOT)\n    if skor >= 7:\n        vonis = \"BLOKIR\"\n        blokir += 1\n    elif skor >= 4:\n        vonis = \"TANTANG\"\n        tantang += 1\n    else:\n        vonis = \"IZINKAN\"\n        izinkan += 1\n    print(f\"{s['id']}: skor={skor} vonis={vonis}\")\nprint(f\"izinkan={izinkan} tantang={tantang} blokir={blokir}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "S1 BLOKIR", msg: "Tiga sinyal berat.", pattern: "S1: skor=8 vonis=BLOKIR" },
          { kind: "stdout_matches", task: "t2", label: "S2 TANTANG", msg: "Kombinasi dua sinyal cukup untuk tantangan.", pattern: "S2: skor=5 vonis=TANTANG" },
          { kind: "stdout_matches", task: "t2", label: "S4 BLOKIR", msg: "Skor tepat di ambang.", pattern: "S4: skor=7 vonis=BLOKIR" },
          { kind: "equal", task: "t3", name: "izinkan", value: 2, label: "`izinkan` = 2", msg: "S3 dan S5." },
          { kind: "equal", task: "t3", name: "tantang", value: 1, label: "`tantang` = 1", msg: "Hanya S2." },
          { kind: "equal", task: "t3", name: "blokir", value: 2, label: "`blokir` = 2", msg: "S1 dan S4." },
        ],
      },
      reference: "Skor = sinyal × bobot; vonis = ambang yang dikalibrasi.",
    },
    {
      id: "lab-playbook",
      eyebrow: "Langkah 7 · Lab",
      title: "Playbook respons per vonis",
      prose: [
        "Ubah vonis menjadi AKSI memakai playbook: IZINKAN → 'proses + pantau'; TANTANG → 'telepon balik ke nomor resmi + minta verifikasi tambahan'; BLOKIR → 'bekukan sesi + eskalasi ke tim fraud + catat insiden'. Terapkan pada hasil lab sebelumnya (S1..S5) dan cetak pasangan vonis → aksi.",
        "Pelajaran: analis yang baik tidak berhenti di skor — ia menerjemahkan skor menjadi tindakan yang bisa dieksekusi operator. Playbook yang tertulis rapi adalah bedanya respons 10 menit vs respons 10 jam.",
      ],
      tasks: [
        { id: "t1", text: "Petakan tiap vonis ke aksi playbook" },
        { id: "t2", text: "Cetak vonis → aksi untuk S1..S5" },
      ],
      expected: "S1 (BLOKIR): bekukan sesi + eskalasi ke tim fraud + catat insiden\nS2 (TANTANG): telepon balik ke nomor resmi + minta verifikasi tambahan\nS3 (IZINKAN): proses + pantau\nS4 (BLOKIR): bekukan sesi + eskalasi ke tim fraud + catat insiden\nS5 (IZINKAN): proses + pantau",
      hints: [
        "playbook = dict vonis → aksi.",
        "vonis tiap sesi sama seperti lab sebelumnya.",
      ],
      code: {
        starter: "# Vonis dari lab sebelumnya. JANGAN UBAH.\nvonis = {\"S1\": \"BLOKIR\", \"S2\": \"TANTANG\", \"S3\": \"IZINKAN\", \"S4\": \"BLOKIR\", \"S5\": \"IZINKAN\"}\n\n# TULIS KODEMU: playbook vonis -> aksi\nplaybook = {\n    \"IZINKAN\": \"proses + pantau\",\n    \"TANTANG\": \"telepon balik ke nomor resmi + minta verifikasi tambahan\",\n    \"BLOKIR\": \"bekukan sesi + eskalasi ke tim fraud + catat insiden\",\n}\nfor sid, v in vonis.items():\n    aksi = \n    print(f\"{sid} ({v}): {aksi}\")\n",
        lockLines: 8,
        solution: "# Vonis dari lab sebelumnya. JANGAN UBAH.\nvonis = {\"S1\": \"BLOKIR\", \"S2\": \"TANTANG\", \"S3\": \"IZINKAN\", \"S4\": \"BLOKIR\", \"S5\": \"IZINKAN\"}\n\n# TULIS KODEMU: playbook vonis -> aksi\nplaybook = {\n    \"IZINKAN\": \"proses + pantau\",\n    \"TANTANG\": \"telepon balik ke nomor resmi + minta verifikasi tambahan\",\n    \"BLOKIR\": \"bekukan sesi + eskalasi ke tim fraud + catat insiden\",\n}\nfor sid, v in vonis.items():\n    aksi = playbook[v]\n    print(f\"{sid} ({v}): {aksi}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Aksi BLOKIR", msg: "Playbook eskalasi.", pattern: "S1 \\(BLOKIR\\): bekukan sesi \\+ eskalasi ke tim fraud \\+ catat insiden" },
          { kind: "stdout_matches", task: "t2", label: "Aksi TANTANG", msg: "Playbook verifikasi tambahan.", pattern: "S2 \\(TANTANG\\): telepon balik ke nomor resmi" },
          { kind: "defined", task: "t1", name: "aksi", label: "`aksi` terdefinisi", msg: "Variabel aksi dipakai di loop." },
        ],
      },
      reference: "Vonis tanpa playbook = angka tanpa tindakan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: respons insiden fraud AI",
      prose: [
        "Skenario 1 — Skor ≥ 7 dengan sinyal deepfake (kanal tak independen + perilaku aneh) → BLOKIR sesi, eskalasi ke tim fraud, catat insiden, pertimbangkan pelaporan. Jangan 'tunggu konfirmasi nasabah' — nasabahnya mungkin justru korban.",
        "Skenario 2 — Skor 4–6 → TANTANG: telepon balik ke nomor resmi yang tersimpan + verifikasi tambahan (pertanyaan pengetahuan / dokumen kedua). Bila lolos, proses dengan pemantauan diperketat 30 hari.",
        "Skenario 3 — Skor < 4 tetapi satu sinyal merah tunggal yang kuat (misalnya dokumen terindikasi sintetis oleh sistem) → TANTANG juga. Skor agregat bisa menutupi satu sinyal yang sangat spesifik — analis boleh meng-override dengan alasan tertulis.",
        "Skenario 4 — Pola berulang lintas nasabah (beberapa korban, modus sama) → naikkan ke respons krisis: peringatan ke seluruh nasabah, pengetatan ambang sementara, koordinasi dengan PPATK/penegak hukum bila dana sudah bergerak.",
        "Aturan 10 detik: (1) skornya berapa? (2) ada sinyal deepfake/impersonation? (3) vonis playbook apa? Bertindak sesuai playbook — jangan improvisaasi saat insiden.",
      ],
      tasks: [],
      reference: "Empat skenario, satu playbook, tanpa improvisasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "'CFO' menelepon jam 17:55",
      prose: [
        "Jumat 17:55, staf keuangan menerima telepon: suara 'CFO' (persis seperti di rapat) meminta transfer Rp3,2 miliar ke rekening vendor baru 'karena deal harus tutup hari ini'. Ia terdengar terburu-buru dan berkata 'jangan ganggu saya dengan prosedur, ini perintah langsung'. Staf ragu — ia ingat training fraud bulan lalu.",
        "Pertanyaan: (1) Sinyal merah apa saja yang hadir? (2) Tindakan yang benar menurut pertahanan berlapis? (3) Apa yang harus dilakukan perusahaan Senin pagi terlepas dari hasil verifikasi?",
        "Pembahasan: (1) Urgensi buatan + perintah melewati prosedur + permintaan merahasiakan + rekening vendor baru + jam mepet tutup — lima sinyal klasik rekayasa sosial, terlepas dari apakah suaranya asli. (2) Terapkan lapis 2 & 4: telepon balik ke nomor resmi CFO yang tersimpan + minta persetujuan tertulis via sistem (maker-checker). Bila CFO asli, ia akan memahami; bila palsu, serangan gagal. (3) Senin pagi: laporkan insiden ke tim fraud/keamanan, simpan rekaman, review apakah nomor telepon staf bocor, dan jadikan studi kasus training — insiden yang digagalkan adalah materi training terbaik.",
      ],
      tasks: [],
      reference: "Urgensi + rahasia + lewati prosedur = pola klasik.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Tiga modus dominan: voice cloning (telepon 'CFO'), video deepfake real-time (kasus Hong Kong 2024), dokumen sintetis untuk KYC/kredit.",
        "Kontrol lama gagal karena memverifikasi satu jenis bukti yang kini murah dipalsukan AI; solusinya bukti berjenis beda dari kanal independen.",
        "Empat lapis: identitas berlapis, verifikasi out-of-band, anomali perilaku & perangkat, prosedur manusia (callback, kata sandi, maker-checker).",
        "Skor sesi = jumlah terbobot sinyal; vonis: ≥7 BLOKIR, 4–6 TANTANG, <4 IZINKAN; vonis diterjemahkan ke playbook aksi.",
        "Skor adalah probabilitas — TANTANG ada untuk menangani ketidakpastian; override analis atas satu sinyal kuat harus tertulis alasannya.",
      ],
      quiz: [
        {
          q: "Mengapa verifikasi video call tidak lagi cukup sebagai kontrol identitas?",
          options: [
            { text: "Deepfake real-time kini bisa memalsukan wajah & suara dalam call langsung", why: "Benar: terbukti di kasus Hong Kong 2024.", correct: true },
            { text: "Video call selalu bisa disadap", why: "Penyadapan masalah lain; isu di sini adalah pemalsuan identitas." },
            { text: "Karyawan tidak suka video call", why: "Preferensi bukan argumen keamanan." },
            { text: "Biaya video call terlalu mahal", why: "Biaya bukan isu kontrol." },
          ],
        },
        {
          q: "Prinsip verifikasi out-of-band yang benar:",
          options: [
            { text: "Konfirmasi lewat kanal kedua yang independen, mis. telepon balik ke nomor resmi tersimpan", why: "Benar: penipu jarang menguasai dua kanal independen.", correct: true },
            { text: "Minta penelepon mengulang permintaannya dua kali", why: "Salah: itu kanal yang sama — tidak independen." },
            { text: "Telepon balik ke nomor yang diberikan penelepon", why: "Salah: nomor dari penipu = kanal yang dikuasai penipu." },
            { text: "Kirim email balasan ke alamat penelepon", why: "Lemah: email bisa dipalsukan; bukan kanal independen yang terverifikasi." },
          ],
        },
        {
          q: "Sesi mendapat skor 5 (kanal tak independen + nilai besar). Vonis & tindakan:",
          options: [
            { text: "TANTANG — telepon balik + verifikasi tambahan", why: "Benar: skor 4–6 = tantang.", correct: true },
            { text: "IZINKAN — skor belum mencapai 7", why: "Salah: 5 berarti risiko nyata yang butuh verifikasi." },
            { text: "BLOKIR permanen dan tutup rekening", why: "Salah: blokir untuk ≥7; penutupan rekening butuh proses lebih jauh." },
            { text: "Abaikan skor, proses seperti biasa", why: "Salah: mengabaikan sistem skormu sendiri." },
          ],
        },
        {
          q: "Kelemahan utama mengandalkan 'AI detector' tunggal melawan deepfake:",
          options: [
            { text: "Perlombaan senjata: generator selalu selangkah di depan detektor", why: "Benar: tidak ada kemenangan permanen.", correct: true },
            { text: "AI detector terlalu murah", why: "Salah arah: murahnya bukan kelemahan." },
            { text: "Detector tidak bisa dipasang di HP", why: "Salah teknis: bisa, tetapi itu bukan kelemahan utamanya." },
            { text: "Regulator melarang penggunaannya", why: "Salah: tidak ada larangan seperti itu." },
          ],
        },
        {
          q: "Staf menerima 'perintah CFO via telepon' yang mendesak dan rahasia. Respons pertama yang benar:",
          options: [
            { text: "Telepon balik ke nomor resmi CFO + minta persetujuan tertulis via sistem", why: "Benar: lapis 2 (out-of-band) + lapis 4 (prosedur).", correct: true },
            { text: "Segera transfer — perintah atasan tidak boleh ditunda", why: "Salah: urgensi + rahasia adalah pola rekayasa sosial klasik." },
            { text: "Rekam teleponnya lalu transfer", why: "Salah: merekam tidak memverifikasi identitas penelepon." },
            { text: "Tanya rekan apakah suara itu mirip CFO", why: "Salah: suara bisa dikloning; opini rekan bukan verifikasi." },
          ],
        },
        {
          q: "Skor sesi 2 tetapi sistem menandai dokumen terindikasi sintetis. Tindakan analis:",
          options: [
            { text: "TANTANG dengan alasan tertulis — satu sinyal kuat boleh meng-override skor agregat", why: "Benar: skor bukan satu-satunya kebenaran; override harus terdokumentasi.", correct: true },
            { text: "IZINKAN — skor di bawah 4 mutlak", why: "Salah: skor adalah alat bantu, bukan belenggu; sinyal spesifik kuat layak ditindaklanjuti." },
            { text: "BLOKIR permanen tanpa catatan", why: "Salah: blokir butuh ambang; dan tanpa catatan tidak bisa diaudit." },
            { text: "Hapus temuan sistem agar skor konsisten", why: "Salah dan berbahaya: memanipulasi temuan." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Setelah insiden digagalkan, kasus selesai.” Belum: insiden yang digagalkan adalah INTELIJEN — simpan modusnya, sebarkan ke tim sebagai training, dan periksa apakah penipu mencoba target lain. Penipu yang gagal sekali akan mencoba lagi dengan variasi.",
      },
      hints: [
        "Uji cepat: sebutkan 3 modus + 4 lapis pertahanan tanpa catatan.",
        "Ingat ambang: ≥7 BLOKIR, 4–6 TANTANG, <4 IZINKAN — dan skor bukan vonis mati.",
      ],
      next: {
        label: "AML25 — Graph Analytics: Memburu Jaringan Pencucian",
        href: "/v2/learn/aml25-graph-analytics-laundering",
      },
      reference: "AI meniru bukti; lapisan mengalahkan peniru.",
    },
  ],
};
