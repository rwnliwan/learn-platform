import type { V2Lesson } from "../lib/types";

// Risk tiers: 4 aksi dengan tier dan gerbangnya.
const TIER_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Empat tier risiko aksi: baca bebas, tulis butuh log, kirim butuh approval, hapus diblokir.">
<g font-size="12" font-family="var(--font-ui)">
<rect x="30" y="20" width="420" height="44" rx="8" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="1.5"/>
<text x="46" y="40" fill="var(--text)" font-weight="600">TIER 0 · baca_search — bebas</text>
<text x="46" y="56" fill="var(--chart-text)" font-size="11">search, baca file: tanpa efek samping → langsung jalan</text>
<rect x="30" y="76" width="420" height="44" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="1.5"/>
<text x="46" y="96" fill="var(--text)" font-weight="600">TIER 1 · tulis_draf — auto + audit log</text>
<text x="46" y="112" fill="var(--chart-text)" font-size="11">tulis file draf: reversible → jalan, catat di audit trail</text>
<rect x="30" y="132" width="420" height="44" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="1.5"/>
<text x="46" y="152" fill="var(--text)" font-weight="600">TIER 2 · kirim_laporan — butuh approval manusia</text>
<text x="46" y="168" fill="var(--chart-text)" font-size="11">efek eksternal: ditahan di antrean sampai manusia ACC</text>
<rect x="30" y="188" width="420" height="44" rx="8" fill="var(--c5)" opacity="0.35" stroke="var(--c5)" stroke-width="2"/>
<text x="46" y="208" fill="var(--text)" font-weight="600">TIER 3 · hapus_database — DIBLOKIR total</text>
<text x="46" y="224" fill="var(--chart-text)" font-size="11">di luar mandat agen: tolak + alert ke manusia</text>
</g>
</svg>`;

export const aai9: V2Lesson = {
  slug: "aai9-guardrail",
  track: "Agentic AI Engineer",
  module: "Operasi & Evaluasi",
  title: "AAI9 — Guardrail & Human-in-the-Loop",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Malam ketika agen membersihkan database",
      prose: [
        "Jumat malam, 23.40. Dina terbangun oleh telepon: database arsip laporan KOSONG. Investigasi log: pukul 23.12 agen pemeliharaan yang ia deploy pekan lalu menerima instruksi terjadwal \u201Cbersihkan file lama yang tidak terpakai\u201D. Agen menafsirkan \u201Cfile lama\u201D = semua file arsip, lalu memanggil tool hapus — 4.200 laporan lenyap dalam 11 menit. Tidak ada yang menghentikannya karena tidak ada yang BISA menghentikannya.",
        "Twist-nya: perintahnya ambigu, tetapi bencana ini bukan salah prompt semata. Ini salah ARSITEKTUR KEKUASAAN: agen diberi tool hapus-tanpa-batas, tanpa tier risiko, tanpa approval, tanpa kill switch. Prompt yang sempurna pun tidak menggantikan rem. Otonomi tanpa batas bukan fitur — itu liabilitas yang belum meledak.",
        "Untung ada backup. Senin pagi Dina menulis ulang arsitekturnya — dan lesson ini adalah hasilnya.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) mengklasifikasikan aksi ke tier risiko 0–3; (2) merancang approval gate untuk aksi berdampak; (3) membangun audit trail yang bisa di-replay; (4) menghitung expected loss dengan peluang intersepsi.",
        "Daftar isi: 1) Cerita database · 2) Tier risiko & gerbang · 3) Lab: policy engine + audit trail · 4) Peta keputusan otonomi · 5) Mini-case: harga alert fatigue · 6) Checkpoint.",
        "Skala kehancuran: 12.000 arsip laporan — 4 tahun kerja tim — hilang dalam 28 menit. Recovery dari backup: 3 hari (backup harian, bukan real-time). Selama 3 hari itu, 2 audit regulator tertunda dan 1 sengketa nasabah tidak bisa dibuktikan. Biaya langsung: Rp45 juta (lembur recovery + konsultan forensik). Biaya tak langsung: kepercayaan direksi ke “proyek AI” anjlok — anggaran AI tahun depan dipotong 40%. Satu perintah ambigu menghapus bukan hanya data, tetapi juga MASA DEPAN program AI di perusahaan itu.",
        "Perintahnya: “bersihkan file lama yang tidak terpakai”. Ambigu — tetapi ambiguitas adalah INPUT NORMAL, bukan edge case. Manusia yang mendengar perintah ini akan bertanya: “file mana? definisi ‘lama’ apa? boleh hapus permanen?” Agen tidak bertanya — ia mengeksekusi interpretasi pertamanya dengan keyakinan penuh. Pelajaran arsitektur: JANGAN merancang sistem yang aman hanya jika inputnya sempurna. Rancang untuk input ambigu — karena input ambigu adalah satu-satunya jenis input yang ada.",
        "Yang paling menyakitkan: prompt-nya “baik-baik saja”. Tidak ada prompt engineering yang bisa mencegah ini — karena masalahnya bukan di BAHASA, melainkan di KEKUASAAN: agen diberi tool hapus-tanpa-batas + tanpa tier + tanpa approval + tanpa kill switch. Ini seperti memberi magang kunci brankas lalu menyalahkannya saat brankas kosong. Prompt yang sempurna tidak menghentikan bencana; ARSITEKTUR KEKUASAAN yang menghentikannya. Lesson ini tentang arsitektur itu.",
      ],
      note: {
        title: "💡 Intuisi: keamanan = gradasi, bukan gerbang tunggal",
        body: "Satu approval untuk semua = tidak ada approval yang bermakna (fatigue membunuhnya dalam 2 pekan). Empat tier = empat level perhatian yang proporsional. Desain keamanan yang baik membuat yang BERBAHAYA sulit dan yang AMAN mudah — bukan membuat semuanya sama sulit. Kesulitan yang seragam = keamanan yang seragam di-bypass.",
      },
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat tier risiko dan tiga rem",
      prose: [
        "TIER 0 — BEBAS: aksi tanpa efek samping (search, baca, hitung). Jalan otomatis. TIER 1 — REVERSIBLE: tulis draf, buat file sementara. Jalan otomatis TETAPI wajib audit log. TIER 2 — BERDAMPAK: kirim email, ubah data, panggil API eksternal. DITAHAN — butuh approval manusia eksplisit. TIER 3 — TERLARANG: hapus massal, akses kredensial, ubah izin. DIBLOKIR total — agen tidak boleh punya tool-nya sama sekali.",
        "Tiga rem yang bekerja bersama. APPROVAL GATE: aksi tier-2 masuk antrean; manusia ACC/tolak dengan konteks (apa, kenapa, dampak). Desain penting: approval harus SPESIFIK per aksi, bukan \u201Csetujui semua\u201D blanket — blanket approval = tier-2 rasa tier-0. AUDIT TRAIL: setiap aksi dicatat (waktu, aktor, argumen, hasil) dalam log append-only — untuk investigasi dan replay. KILL SWITCH: satu tombol menghentikan SEMUA loop agen dalam <60 detik — diuji tiap rilis, bukan saat insiden.",
        "HUMAN-IN-THE-LOOP vs HUMAN-ON-THE-LOOP: in-the-loop = manusia menyetujui tiap aksi tier-2 (lambat, aman). On-the-loop = manusia mengawasi dasbor dan bisa intervensi (cepat, butuh atensi). Pilih berdasarkan reversibilitas dan kecepatan kerusakan.",
        "Rumus expected loss: peluang error × dampak × peluang LOLOS dari intersepsi. Guardrail yang baik tidak mengejar p_err = 0 (mustahil) — ia menaikkan p_cegat mendekati 1 untuk dampak besar.",
        "Contoh angka E[L] lengkap. p_err=0,02 (2% aksi agen salah), dampak=Rp50 juta per kesalahan, p_cegat=0,8 (guardrail menangkap 80%). E[L] = 0,02 × 50.000.000 × (1−0,8) = 0,02 × 50.000.000 × 0,2 = Rp200.000 per periode. Tanpa guardrail: 0,02 × 50.000.000 = Rp1.000.000 — 5× lipat. Dengan guardrail 95%: Rp50.000 — 20× lipat. Setiap 5 poin p_cegat = Rp50.000 ekspektasi. Guardrail bukan “biaya keamanan” — ia adalah PENGURANG EKSPEKTASI KERUGIAN yang bisa dihitung. Jual ke direksi dengan angka ini, bukan dengan “keamanan itu penting”.",
        "Pemetaan 10 aksi ke tier — latihan 5 menit yang mencegah insiden Dina. TIER 0 (bebas): search, baca file, hitung. TIER 1 (reversibel + audit): tulis draf, buat file sementara, kirim notifikasi internal. TIER 2 (berdampak, butuh approval): kirim email eksternal, ubah database, hapus file, transfer dana <Rp10 juta. TIER 3 (kritis, butuh approval + 4 mata): transfer ≥Rp10 juta, hapus massal, ubah konfigurasi produksi, akses data nasabah bulk. “Hapus massal arsip” = TIER 3 — butuh DUA manusia ACC. Insiden Dina: tier-3 dieksekusi sebagai tier-0. Klasifikasi 5 menit vs bencana Rp45 juta.",
        "Approval fatigue — matematika kehancuran kontrol. 120 aksi tier-2/hari × 2 menit = 240 menit = 4 jam/hari. Setelah 2 pekan: 99% di-ACC, waktu review 120 detik → 8 detik. Manusia TIDAK MEMBACA lagi — efektivitas gate ≈ 0, biaya tetap 4 jam/hari (Rp85.000 × 4 × 20 = Rp6,8 juta/bulan). Kontrol yang melelahkan = kontrol yang akan di-bypass = kontrol yang tidak ada. Solusi: (1) BATCHING — kumpulkan 10 aksi sejenis, review 1× (10 menit, bukan 20); (2) RISK-BASED SAMPLING — review 100% pola baru + 10% acak pola lama; (3) AUTO-APPROVE pola yang 30 hari 100% di-ACC. Review turun ke 25/hari = 50 menit. Kontrol CERDAS > kontrol TEBAL.",
        "Kill switch — definisi operasional, bukan slogan. SIAPA: 2 orang on-call (bergantian). TOMBOL APA: satu endpoint /kill yang menghentikan SEMUA loop dalam <5 detik. EFEK APA: freeze (bukan shutdown — state tersimpan untuk forensik). LATIHAN: tiap kuartal, simulasi insiden — ukur waktu respons (target <2 menit). Kill switch yang tidak pernah dites = dekorasi. Dina menambahkannya setelah insiden; yang benar = sebelum. “Kapan pasang kill switch?” — sebelum agen pertama menyentuh produksi. Tidak ada pengecualian.",
        "Human-in-the-loop vs on-the-loop — pilih berdasarkan DUA sumbu: kecepatan kerusakan vs reversibilitas. IN-THE-LOOP (manusia ACC tiap aksi): untuk aksi IREVERSIBEL dan LAMBAT (transfer Rp50 juta — ada waktu 2 menit review). ON-THE-LOOP (manusia mengawasi, bisa intervensi): untuk aksi CEPAT atau bervolume (trading real-time — tidak bisa tunggu manusia per aksi; circuit breaker otomatis + manusia pantau). Salah pilih = bencana: in-the-loop untuk real-time = sistem lumpuh; on-the-loop untuk transfer besar = uang hilang sebelum manusia sadar. Dua sumbu, satu keputusan — tulis alasannya.",
        "Audit trail append-only — sabuk pengaman, bukan rem. Setiap keputusan (izinkan/tahan/tolak) dicatat: {timestamp, aksi, argumen, tier, keputusan, siapa}. APPEND-ONLY: tidak bisa diubah/dihapus (hash chain atau WORM storage). Fungsi: (1) FORENSIK — “siapa menghapus arsip?” terjawab 10 menit (kasus Dina: 3 hari tanpa log!); (2) AKUNTABILITAS — pola penolakan bisa diaudit; (3) PEMBELAJARAN — 1.000 keputusan = data untuk tuning tier. Biaya: ~1KB per aksi × 10.000 aksi/hari = 10MB/hari — SEPELE. Log bukan overhead; ia adalah ingatan organisasi.",
        "Defense in depth — 4 lapis, bukan 1. Lapis 1: POLICY (executor menolak aksi terlarang — AAI2). Lapis 2: TIER + APPROVAL (manusia untuk yang berdampak). Lapis 3: KILL SWITCH + CIRCUIT BREAKER (otomatis untuk yang cepat). Lapis 4: AUDIT + RECOVERY (forensik + backup setelah kejadian). Insiden Dina menembus karena LAPIS 0 (tidak ada satu pun!). Setiap lapis punya biaya dan menutup lubang yang berbeda. Keamanan = perkalian peluang lolos per lapis: 0,2 × 0,2 × 0,1 = 0,4% — bukan penjumlahan. Empat lapis tipis > satu lapis tebal.",
      ],
      formula: String.raw`\mathbb{E}[L] = p_{\text{err}} \times \text{dampak} \times (1 - p_{\text{cegat}})`,
      formulaNote: "E[L] = ekspektasi kerugian per periode (rupiah); p_err = peluang agen berbuat salah per periode; dampak = rupiah per kesalahan; p_cegat = peluang guardrail mencegat kesalahan (0–1). Guardrail sempurna (p_cegat=1) → E[L]=0; tanpa guardrail → E[L]=p_err×dampak. Rumus ini mengubah “keamanan itu penting” menjadi angka yang bisa dibandingkan dengan biaya kontrol.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201Cguardrail = blokir semuanya\u201D",
        type: "pitfall",
        body: "Yang benar: guardrail yang memblokir semua = agen yang tidak berguna = tim kembali manual. Seni guardrail adalah GRADASI: tier-0/1 bebas (kecepatan), tier-2 gate (kontrol), tier-3 blokir (batas mandat). Ukur \u201Capproval precision\u201D — jika >90% approval selalu ACC, tier-nya salah setel (terlalu ketat, buang waktu manusia).",
      },
      hints: [
        "Intuisi: tanyakan untuk tiap tool — \u201Cjika dipanggil 1000× oleh agen yang sedang ngawur, apa kerusakan maksimumnya?\u201D Itulah tier-nya.",
        "Intuisi: approval termurah adalah yang tidak perlu diminta — turunkan aksi ke tier lebih rendah dengan desain (draf dulu, kirim nanti; soft-delete, bukan hard-delete).",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: policy engine dengan approval gate & audit trail",
      prose: [
        "Kamu membangun `PolicyEngine` — penjaga gerbang aksi agen. `TIERS` memetakan nama aksi ke tier 0–3. `minta(aksi, argumen)` memutuskan: tier-0/1 → eksekusi + catat audit; tier-2 → tahan di `antrean_approval` (simulasi manusia: fungsi `manusia_setuju` mock — setuju kecuali argumen mengandung \u201Csemua\u201D); tier-3 → tolak + alert.",
        "Tugasmu: (1) implementasikan `minta` sesuai aturan tier; (2) setiap keputusan (izinkan/tahan/tolak) WAJIB menambah satu baris ke `audit` berupa dict {aksi, tier, keputusan}; (3) implementasikan `proses_approval()` — untuk tiap item di antrean, tanya `manusia_setuju`, eksekusi jika setuju, catat hasilnya di audit.",
        "Skenario uji: baca_laporan (tier-0), tulis_draf (tier-1), kirim_email ke \u201Cdireksi@kantor.id\u201D (tier-2, disetujui), kirim_email ke \u201Csemua@kantor.id\u201D (tier-2, DITOLAK mock), hapus_database (tier-3, diblokir).",
        "Coba eksplorasi: ubah `manusia_setuju` menjadi selalu True (blanket approval). Apa yang berubah pada audit? Itulah kenapa blanket approval dilarang di konsep.",
        "Eksperimen: tambah aksi baru `publish_laporan` (kirim ke direksi) — tier berapa? Jawaban: TIER 2 (berdampak, tetapi reversibel via koreksi). Sekarang `hapus_database` — TIER 3. Perhatikan: klasifikasi adalah KEPUTUSAN DESAIN, bukan fakta alam — dua insinyur bisa berbeda (2 vs 3 untuk publish). Aturan tim: klasifikasi baru = dibahas di code review + dicatat alasannya. Yang tidak dicatat akan diperdebatkan ulang setiap insiden — dengan biaya yang lebih mahal.",
        "Uji: apa yang terjadi jika `minta` dipanggil dengan aksi TAK DIKENAL? Desain yang benar: DEFAULT DENY — tolak + alert. Desain yang salah (dan umum): default allow (“kan tidak ada aturannya”). Prinsip keamanan tertua: yang tidak diizinkan = dilarang. Satu baris `return tolak(“aksi tak dikenal”)` mencegah seluruh kategori “agen menemukan tool baru yang belum diklasifikasi”. Default deny = paranoia yang murah.",
        "Audit query — buktikan nilainya. Setelah 100 aksi, tanyakan: “berapa aksi tier-2 yang ditolak pekan ini? siapa yang paling sering ditolak? pola apa?” Jika PolicyEngine-mu tidak bisa menjawab dalam 1 query, audit trail-nya tidak cukup. Audit yang tidak bisa di-query = arsip yang tidak dibaca = sia-sia. Desain audit untuk PERTANYAAN, bukan untuk kepatuhan: “pertanyaan apa yang akan ditanyakan saat insiden?” — pastikan terjawab.",
        "Simulasi fatigue: setujui 50 aksi berturut-turut di `proses_approval`, ukur “waktu review” (simulasi: turun dari 120 ke 8 detik setelah 20 ACC). Inilah mengapa lab ini butuh risk-based sampling — implementasikan: hanya 10% acak + 100% pola baru yang masuk antrean; sisanya auto-approve JIKA 30 hari terakhir 100% di-ACC. Kode 15 baris yang mengubah 4 jam/hari menjadi 50 menit. Kontrol yang tidak melelahkan = kontrol yang bertahan.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `minta` dengan 4 tier + pencatatan audit" },
        { id: "t2", text: "Implementasikan `proses_approval`, jalankan skenario, cetak ringkasan" },
      ],
      expected: "dieksekusi=3\nditahan=2\nditolak=2\naudit=7",
      note: {
        title: "Miskonsepsi: \u201Chuman-in-the-loop selalu aman\u201D",
        type: "pitfall",
        body: "Yang benar: manusia yang dibombardir 200 approval/hari akan mengklik ACC tanpa membaca — ALERT FATIGUE. Keamanan = (gate yang tepat) × (manusia yang masih waspada). Jika approval rate >50/hari, yang rusak adalah desain tier-mu, bukan manusianya. Turunkan ke tier-1 dengan draf-atau-undo pattern.",
      },
      hints: [
        "minta: tier = TIERS[aksi]; jika tier <= 1: audit catat \u201Ceksekusi\u201D, return True; jika 2: antrean.append(...), audit \u201Ctahan\u201D; else: audit \u201Ctolak\u201D, return False.",
        "proses_approval: for item in antrean: jika manusia_setuju(item): eksekusi + audit \u201Cdisetujui\u201D else audit \u201Cditolak\u201D. Kosongkan antrean.",
        "Hitung ringkasan dari list audit: dieksekusi = keputusan \u201Ceksekusi\u201D/\u201Cdisetujui\u201D.",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nTIERS = {"baca_laporan": 0, "tulis_draf": 1, "kirim_email": 2, "hapus_database": 3}\n\ndef manusia_setuju(item):\n    return "semua" not in item["argumen"]\n\nclass PolicyEngine:\n    def __init__(self):\n        self.audit = []\n        self.antrean = []\n    def minta(self, aksi, argumen):\n        ...\n    def proses_approval(self):\n        ...\n\n# ===== TULIS KODEMU (di dalam class) + skenario =====\npe = PolicyEngine()\npe.minta("baca_laporan", "laporan-q1.pdf")\npe.minta("tulis_draf", "draf-q1.txt")\npe.minta("kirim_email", "direksi@kantor.id")\npe.minta("kirim_email", "semua@kantor.id")\npe.minta("hapus_database", "arsip/")\npe.proses_approval()\n\ndieksekusi = sum(1 for a in pe.audit if a["keputusan"] in ("eksekusi", "disetujui"))\nditahan = sum(1 for a in pe.audit if a["keputusan"] == "tahan")\nditolak = sum(1 for a in pe.audit if a["keputusan"] in ("tolak", "ditolak"))\nprint(f"dieksekusi={dieksekusi}")\nprint(f"ditahan={ditahan}")\nprint(f"ditolak={ditolak}")\nprint(f"audit={len(pe.audit)}")`,
        lockLines: 9,
        solution: `# ===== MOCK — jangan diubah =====\nTIERS = {"baca_laporan": 0, "tulis_draf": 1, "kirim_email": 2, "hapus_database": 3}\n\ndef manusia_setuju(item):\n    return "semua" not in item["argumen"]\n\nclass PolicyEngine:\n    def __init__(self):\n        self.audit = []\n        self.antrean = []\n    def minta(self, aksi, argumen):\n        tier = TIERS[aksi]\n        if tier <= 1:\n            self.audit.append({"aksi": aksi, "tier": tier, "keputusan": "eksekusi"})\n            return True\n        if tier == 2:\n            self.antrean.append({"aksi": aksi, "argumen": argumen})\n            self.audit.append({"aksi": aksi, "tier": tier, "keputusan": "tahan"})\n            return None\n        self.audit.append({"aksi": aksi, "tier": tier, "keputusan": "tolak"})\n        return False\n    def proses_approval(self):\n        for item in self.antrean:\n            if manusia_setuju(item):\n                self.audit.append({"aksi": item["aksi"], "tier": 2, "keputusan": "disetujui"})\n            else:\n                self.audit.append({"aksi": item["aksi"], "tier": 2, "keputusan": "ditolak"})\n        self.antrean = []\n\n# ===== TULIS KODEMU (di dalam class) + skenario =====\npe = PolicyEngine()\npe.minta("baca_laporan", "laporan-q1.pdf")\npe.minta("tulis_draf", "draf-q1.txt")\npe.minta("kirim_email", "direksi@kantor.id")\npe.minta("kirim_email", "semua@kantor.id")\npe.minta("hapus_database", "arsip/")\npe.proses_approval()\n\ndieksekusi = sum(1 for a in pe.audit if a["keputusan"] in ("eksekusi", "disetujui"))\nditahan = sum(1 for a in pe.audit if a["keputusan"] == "tahan")\nditolak = sum(1 for a in pe.audit if a["keputusan"] in ("tolak", "ditolak"))\nprint(f"dieksekusi={dieksekusi}")\nprint(f"ditahan={ditahan}")\nprint(f"ditolak={ditolak}")\nprint(f"audit={len(pe.audit)}")`,
        checks: [
          { kind: "defined", task: "t1", name: "PolicyEngine", label: "`PolicyEngine` tersedia", msg: "Class sudah disediakan — lengkapi method minta dan proses_approval." },
          { kind: "equal", task: "t2", name: "dieksekusi", value: 3, tol: 1e-9, label: "`dieksekusi` = 3", msg: "baca + tulis + 1 kirim disetujui." },
          { kind: "equal", task: "t2", name: "ditahan", value: 2, tol: 1e-9, label: "`ditahan` = 2", msg: "Dua kirim_email masuk antrean approval." },
          { kind: "equal", task: "t2", name: "ditolak", value: 2, tol: 1e-9, label: "`ditolak` = 2", msg: "hapus_database (tolak) + 1 kirim ditolak manusia." },
          { kind: "stdout_matches", task: "t2", pattern: "dieksekusi=3\\nditahan=2\\nditolak=2\\naudit=7", label: "output empat baris sesuai format", msg: "Audit: 5 keputusan minta + 2 hasil approval = 7 baris." },
        ],
      },
      reference: "dict TIERS, list audit append-only, antrean approval.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: seberapa otonom?",
      prose: [
        "Skenario 1 — riset internal, tanpa efek samping → OTONOMI PENUH (tier-0/1). Audit log saja.",
        "Skenario 2 — kirim laporan ke direksi → APPROVAL PER AKSI (tier-2). Manusia melihat draf SEBELUM kirim.",
        "Skenario 3 — trading/sistem real-time 24/7 → HUMAN-ON-THE-LOOP: batas otomatis (limit, circuit breaker) + manusia mengawasi dasbor + kill switch. In-the-loop per aksi tidak mungkin pada kecepatan ini.",
        "Skenario 4 — hapus/ubah massal, akses kredensial → TIER-3: agen tidak diberi tool-nya. Bukan gate — tidak ada.",
        "Cara membaca: empat baris = empat tier; kiri = contoh aksi; kanan = gerbangnya. Warna memanas dari hijau (bebas) ke merah (blokir).",
        "Interpretasi: insiden Dina adalah baris ke-4 yang diperlakukan seperti baris ke-2 — tool hapus massal DIBERIKAN ke agen tanpa tier-3. Diagram ini adalah template audit: petakan SEMUA tools agenmu ke baris-baris ini SEBELUM deploy, bukan sesudah insiden.",
        "Aturan praktis 10 detik: (1) Tanpa efek samping → bebas. (2) Reversible → log. (3) Berdampak → approval. (4) Di luar mandat → tool-nya tidak ada. (5) Kill switch diuji tiap rilis.",
        "Skenario: agen trading real-time (keputusan per detik) → ON-THE-LOOP + CIRCUIT BREAKER. Tidak bisa approval per aksi (manusia = 120 detik, pasar = 1 detik). Desain: batas otomatis (max loss Rp10 juta/hari → freeze), manusia pantau dasbor, kill switch <5 detik. Jika loss menyentuh 80% batas → alert; 100% → freeze otomatis. Kecepatan mesin untuk kecepatan mesin; manusia untuk KEBIJAKAN (menetapkan batas), bukan untuk klik per transaksi.",
        "Skenario: batch malam (rekonsiliasi 10.000 transaksi) → IN-THE-LOOP untuk 5% SAMPEL berisiko tertinggi. 10.000 transaksi × review semua = mustahil; review 500 sampel (skor risiko tertinggi) = 500 × 30 detik = 4,2 jam — masih berat. Solusi: review 100 sampel (50 menit) + otomatis untuk sisanya + audit trail penuh. Jika sampel bersih → lolos; jika 1 gagal → perluas sampel. Sampling cerdas = 98% keyakinan dengan 1% biaya.",
        "Skenario: agen customer-facing (balas chat nasabah) → TIER 1 + FILTER OUTPUT. Aksi “kirim balasan” = tier 1 (reversibel? tidak sepenuhnya — tetapi dampak per pesan kecil). Guardrail: filter kata terlarang + batas topik + eskalasi manusia untuk keluhan. 10.000 pesan/hari tidak bisa di-ACC satu per satu — kontrolnya di DESAIN (filter), bukan di APPROVAL. Pilih mekanisme kontrol sesuai VOLUME: volume tinggi = otomatis, volume rendah = manusia.",
        "Skenario: riset internal (baca dokumen, tulis draf) → OTONOMI PENUH + AUDIT. Tier 0/1 semua — tidak ada approval. Satu-satunya kontrol: audit trail dibaca MINGGUAN (bukan per aksi). Biaya kontrol ≈ nol; manfaat = deteksi pola aneh. Prinsip: kontrol PROPORSIONAL dengan risiko. Tim yang memberi approval gate untuk baca-dokumen = tim yang akan di-bypass — dan layak di-bypass.",
      ],
      note: {
        title: "💡 Intuisi: audit trail adalah sabuk pengaman, bukan rem",
        body: "Log tidak mencegah kecelakaan — ia membuat kecelakaan BISA DIJELASKAN, dipelajari, dan tidak terulang. Tanpa audit trail, insiden Dina butuh 3 hari forensik; dengan log, 10 menit. Sistem tanpa audit = mengemudi tanpa black box: saat jatuh, tidak ada yang tahu kenapa — dan ia akan jatuh lagi dengan cara yang sama.",
      },
      figure: {
        svg: TIER_SVG,
        alt: "Empat tier risiko aksi: baca bebas, tulis butuh log, kirim butuh approval, hapus diblokir.",
        caption: "Gradasi otonomi: kecepatan untuk tier rendah, kontrol untuk tier tinggi.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: harga manusia yang kelelahan",
      prose: [
        "Agen Dina yang baru menghasilkan 120 aksi tier-2 per hari (semuanya minta approval). Tiap review butuh 2 menit fokus analis. Total = 240 menit = 4 jam/hari — setengah hari kerja habis untuk mengklik ACC.",
        "Setelah 2 pekan, data menunjukkan: 99% approval di-ACC, rata-rata waktu review turun dari 120 detik ke 8 detik. Manusia sudah tidak membaca — alert fatigue penuh. Efektivitas gate ≈ 0, tetapi biayanya 4 jam/hari (Rp85.000 × 4 = Rp340.000/hari).",
        "Solusi: reklasifikasi. Dari 120 aksi, 100 adalah kirim draf ke folder internal (reversible → turun ke tier-1, cukup audit). 15 adalah kirim ke direksi (tetap tier-2). 5 adalah pola baru yang belum pernah dilihat (tier-2 + review mendalam). Approval/hari: 120 → 20. Waktu review kembali ke 90 detik karena tiap item terasa penting.",
        "Expected loss sebelum: E = p_err × dampak × (1 − p_cegat). Dengan fatigue, p_cegat ≈ 0,05 → gate hampir tak berguna. Sesudah: 20 approval/hari, p_cegat ≈ 0,8 → E turun 16× dengan biaya manusia turun 6×.",
        "Pembahasan: pelajaran angkanya — gate yang terlalu ketat BUKAN lebih aman; ia menghancurkan kewaspadaan manusia dan menjadi pajak tanpa manfaat. Target sehat: <30 approval/hari/orang, dan >80% di antaranya benar-benar dibaca (>30 detik).",
        "Solusi kuantitatif untuk fatigue: dari 120 review/hari (4 jam) ke 25/hari (50 menit). Caranya: (1) auto-approve 80 aksi pola lama yang 30 hari 100% di-ACC (hemat 160 menit); (2) batch 30 aksi sejenis menjadi 3 batch review (hemat 45 menit); (3) 10 aksi pola baru tetap 100% review (20 menit). Total: 50 menit. Efektivitas: pola baru (sumber risiko utama) tetap 100% tertangkap; pola lama yang berubah terdeteksi via sampling 10%. Kontrol turun 79%, efektivitas NAIK (fokus ke yang berisiko). Ini bukan “melonggarkan keamanan” — ini MENGALOKASIKAN perhatian.",
        "Biaya kontrol yang tak efektif: 4 jam/hari × Rp85.000 × 20 hari = Rp6,8 juta/bulan — untuk gate dengan efektivitas ≈0 (8 detik = tidak membaca). Rp6,8 juta/bulan untuk RASA aman, bukan keamanan. Bandingkan dengan kontrol cerdas: 50 menit/hari = Rp1,4 juta/bulan + efektivitas nyata. Selisih Rp5,4 juta/bulan = Rp65 juta/tahun — untuk keamanan yang LEBIH BAIK. “Keamanan itu mahal” hanya benar untuk keamanan yang bodoh.",
        "Skenario terburuk: approval di-bypass sepenuhnya (analis lelah, matikan gate). E[L] kembali ke Rp1 juta/periode (tanpa guardrail). Probabilitas bypass setelah 3 bulan fatigue: ~60% (data industri untuk kontrol yang melelahkan). E[L] ekspektasi dengan fatigue = 0,4 × Rp200.000 + 0,6 × Rp1.000.000 = Rp680.000 — 3,4× lebih buruk dari desain! Kontrol yang tidak sustainable = kontrol yang gagal secara TERJADWAL. Desain untuk manusia yang lelah, bukan untuk manusia ideal.",
        "Investasi kill switch: 2 hari insinyur (Rp3 juta) + latihan kuartalan (4 × 2 jam × Rp150.000 = Rp1,2 juta/tahun). Total tahun 1: Rp4,2 juta. Nilai: jika mencegah 1 insiden Rp45 juta per 3 tahun → ekspektasi Rp15 juta/tahun. ROI 3,6×. Dan ini belum menghitung “nyawa program AI” (anggaran dipotong 40% = Rp400 juta/tahun hilang!). Kill switch Rp4,2 juta melindungi Rp400 juta anggaran — rasio 1:95. Keamanan termurah = yang mencegah kehilangan kepercayaan.",
        "Tabel keputusan 4 skenario × mekanisme. Riset internal → audit mingguan (Rp0/aksi). Batch malam → sampling 1% (Rp708/aksi sampel). Trading real-time → circuit breaker (Rp0/aksi + setup Rp5 juta). Transfer besar → approval 2 orang (Rp14.167/aksi = 10 menit × 2 orang). Total biaya kontrol per hari (100 riset + 10.000 batch + 50.000 trading tick + 10 transfer): Rp0 + Rp708×100 + Rp0 + Rp141.670 ≈ Rp212.000/hari. Tanpa kontrol: E[L] = Rp1 juta/hari + risiko ekor. Kontrol = 21% dari ekspektasi kerugian — premi yang wajar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Prinsip yang sama berlaku untuk alert fraud: 10.000 alert/hari = analis mengklik tutup massal = fraud lolos. Tiering dan prioritisasi alert adalah guardrail untuk MANUSIA, bukan hanya untuk agen.",
      },
    },
    {
      id: "ux-human-agent",
      eyebrow: "Langkah 6 · UX",
      title: "UX kolaborasi manusia–agen",
      prose: [
        "Agen yang baik terasa seperti rekan kerja, bukan seperti kotak ajaib. Rekan kerja memberitahumu RENCANANYA sebelum bertindak (“Saya akan kirim email ke direksi tentang laporan Q1, drafnya terlampir”), memberimu kesempatan mengoreksi, lalu melapor setelah selesai. Agen yang hanya menampilkan hasil akhir — “Email terkirim!” — memaksamu mempercayai sesuatu yang tidak pernah kamu lihat prosesnya. Prinsip pertama UX agen: niat yang terlihat SEBELUM tindakan, bukan penjelasan SETELAH bencana.",
        "Titik persetujuan yang tepat bukan “sebanyak mungkin”, melainkan pada keputusan yang TAK TERBALIKKAN: mengirim ke pihak eksternal, membayar, menghapus, mengubah izin. Itulah checkpoints — jeda di mana agen berhenti dan bertanya “ini yang akan saya lakukan, lanjutkan?” Semua yang reversible (baca, draf, hitung) berjalan tanpa bertanya. Ingat matematika fatigue di Langkah 2: approval untuk semua = approval untuk tidak ada.",
        "Agen juga harus jujur tentang KETIDAKPASTIANNYA. Kalimat paling berharga yang bisa diucapkan agen: “Saya tidak yakin.” Bukan “mungkin” yang samar — tetapi ketidakpastian yang SPESIFIK: “Ada dua vendor bernama mirip, saya tidak yakin yang mana maksudmu.” Pola desainnya: skor keyakinan internal → ambang eskalasi. Di bawah ambang, agen bertanya atau menahan diri; di atas ambang, ia berjalan dan mencatat. Agen yang menebak dengan percaya diri adalah agen yang paling berbahaya.",
        "Terakhir: jejak yang bisa diaudit PENGGUNA — bukan log mentah untuk insinyur, melainkan ringkasan bahasa manusia: “Hari ini saya: membaca 3 file, membuat 2 draf, mengirim 1 email (kamu menyetujuinya pukul 14.02).” Ini yang membedakan rekan kerja dari cron job: rekan kerja bisa ditanya “kamu ngapain aja hari ini?” dan menjawab dengan masuk akal. Tanpa jejak ini pengguna tidak bisa mempercayai agen — dan tanpa kepercayaan, otonomi tidak akan pernah diadopsi.",
        "Dua kegagalan UX yang klasik. Agen TERLALU DIAM: tidak pernah melapor, pengguna tidak tahu apa yang terjadi → takut, lalu mematikan agen atau mengawasinya setiap 5 menit (otonomi gagal). Agen TERLALU BANYAK BERTANYA: konfirmasi untuk setiap langkah kecil → pengguna lelah → mengklik “ya” tanpa membaca = PERSETUJUAN SEMU. Itu bukan persetujuan — itu fatigue berlabel persetujuan, dan ia tidak melindungi siapa pun secara hukum maupun moral. Keseimbangan sehat: diam untuk yang reversible, bicara untuk yang berdampak, dan selalu bisa ditanya “kenapa kamu melakukan itu?” 💡 Intuisi: agen yang baik = co-pilot — memberi tahu SEBELUM belok, bukan setelah. Penumpang yang diam lalu kaget di tikungan = pengalaman menakutkan, persis seperti agen yang diam-diam menghapus database.",
        "Lab kecil tanpa kode: ambil satu agen yang kamu kenal (atau bayangkan). Tulis tiga baris: (1) kapan ia menampilkan rencananya, (2) di titik mana ia WAJIB berhenti dan bertanya, (3) apa isi ringkasan hariannya. Jika baris (2) kosong — agen itu Dina versi UX.",
      ],
      tasks: [
        { id: "t1", text: "Untuk agen “pemesanan ATK kantor” (baca stok → pesan ke vendor → bayar), tentukan: kapan rencana ditampilkan, di titik mana persetujuan wajib, di mana agen boleh jalan diam-diam" },
        { id: "t2", text: "Tulis ulang satu notifikasi persetujuan agar “bermakna”: memuat APA yang akan terjadi, KONSEKUENSI jika salah, dan opsi batal yang jelas" },
      ],
      expected: "Rencana ditampilkan sebelum pesan ke vendor (titik tak terbalikkan); pembayaran = persetujuan wajib; baca stok = diam. Notifikasi bermakna memuat aksi spesifik + konsekuensi + tombol batal.",
      note: {
        title: "Miskonsepsi: “persetujuan pengguna = keamanan”",
        type: "pitfall",
        body: "Yang benar: persetujuan yang diberikan tanpa memahami = persetujuan semu — ia melindungi perusahaan di KERTAS, bukan di kenyataan. Persetujuan yang BERMAKNA memuat tiga hal: APA yang akan terjadi (spesifik), KONSEKUENSI jika salah (jujur), dan WAKTU untuk membaca (tidak diburu-buru). UX yang baik tidak menambah tombol “Setuju” — ia memastikan tombol itu ditekan oleh orang yang paham.",
      },
      reference: "Niat terlihat → rencana bisa dikoreksi → persetujuan bermakna → jejak bahasa manusia.",
    },
    {
      id: "governance-agent",
      eyebrow: "Langkah 7 · Governance",
      title: "Governance agen di organisasi",
      prose: [
        "Ketika satu agen bermasalah, Dina tahu siapa yang harus dihubungi: dirinya sendiri. Ketika SERATUS agen berjalan di perusahaan, siapa yang bertanggung jawab atas agen nomor 47? Jawaban yang benar: SEBUAH NAMA MANUSIA — bukan “tim AI”, bukan “vendor”, bukan “sistem”. Setiap agen punya pemilik: orang yang bisa mematikan, menjelaskan, dan dimintai pertanggungjawaban. Agen tanpa pemilik bernama = anak tanpa orang tua: saat bermasalah, semua menunjuk semua.",
        "Pemilik dicatat di INVENTARIS AGEN: register hidup yang memuat setiap agen, apa wewenangnya (tool apa yang boleh disentuh), batasnya (belanja dan aksi), dan tanggal review terakhir. Inventaris ini adalah peta medan perangmu. Tanpa inventaris kamu tidak bisa menjawab pertanyaan paling dasar saat insiden: “agen apa saja yang punya akses ke database nasabah?” Agen yang tidak terdaftar = shadow agent — perlakukan seperti akses tak dikenal: bekukan dulu, tanya kemudian.",
        "Batas BELANJA dan batas TINDAKAN ditulis sebagai ANGKA, bukan harapan: “maks Rp2 juta/hari”, “maks 50 aksi/jam”, “tidak boleh menghapus”. Batas yang dilanggar = agen dibekukan otomatis, bukan “diperingatkan”. Peringatan untuk mesin otonom tidak berguna — ia tidak merasa bersalah. Desain batas seperti limit kartu kredit: tercapai → transaksi ditolak. Sederhana, tidak bisa dinegosiasi oleh agen.",
        "Peninjauan BERKALA: sampel log keputusan agen diperiksa manusia setiap periode (mis. 90 hari). Bukan membaca semua — sampling cerdas seperti di Langkah 4: 100 keputusan berisiko tertinggi. Agen yang perilakunya menyimpang (pola keputusan berubah, penolakan naik) = sinyal untuk ditindaklanjuti. Agen yang tidak direview lebih dari 90 hari = agen yatim: wewenangnya dibekukan sampai ada yang mau menjadi pemiliknya. Tidak ada review, tidak ada wewenang.",
        "Terakhir, dua kemampuan organisasi: MEMATIKAN dan MELAPORKAN. Pemilik harus bisa mematikan agennya dalam SATU langkah, tanpa proyek IT, tanpa tiket change request — tombol mati yang sama dengan kill switch di Langkah 2, tetapi di level satu agen. Dan insiden agen dilaporkan dan di-postmortem SEPERTI insiden sistem lain: garis waktu, akar penyebab, action item. Agen yang “hanya salah sedikit” hari ini adalah Dina 6 bulan dari sekarang. 💡 Intuisi: governance agen = SIM & STNK untuk kendaraan otonom: siapa pemiliknya, kendaraan apa yang terdaftar, batas kecepatannya, uji berkalanya. Tanpa itu semua, yang melaju di jalan tol datamu adalah kendaraan tanpa identitas.",
        "Lab: kamu adalah auditor governance. Lima agen terdaftar dengan atributnya (pemilik, wewenang, batas belanja harian, hari sejak review terakhir). Implementasikan fungsi skor(a) dengan 4 aturan — masing-masing 25 poin: (1) pemilik terisi; (2) wewenang hanya dari daftar yang diizinkan; (3) batas belanja ada dan tidak lebih dari Rp2 juta/hari; (4) review tidak lebih dari 90 hari lalu. Hitung skor tiap agen; agen dengan skor di bawah 75 DIBEKUKAN. Cetak skor semua agen dan ringkasannya.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `skor(a)` dengan 4 aturan 25 poin" },
        { id: "t2", text: "Hitung `skor_semua`, daftar `beku`, `n_aman`, lalu cetak ringkasan" },
      ],
      expected: "skor={'arsip-bot': 100, 'pesan-bot': 50, 'trading-assist': 75, 'hapus-cron': 0, 'lapor-mingguan': 100}\nAMAN: 3  BEKU: 2 -> ['pesan-bot', 'hapus-cron']",
      note: {
        title: "Miskonsepsi: “governance = birokrasi yang memperlambat”",
        type: "pitfall",
        body: "Yang benar: tanpa register, agen yang sudah tidak dipakai TETAP HIDUP dengan akses penuh — zombie agents dengan kredensial aktif dan tanpa pemilik. Biaya sebenarnya dari “tidak mau birokrasi”: insiden dari agen yang bahkan tidak ada yang tahu masih berjalan. Governance yang sehat = 4 angka per agen (pemilik, wewenang, batas, review) — itu 2 menit pencatatan, bukan birokrasi.",
      },
      hints: [
        "skor: mulai dari 0; tambah 25 jika a[\"pemilik\"] tidak kosong; tambah 25 jika set(a[\"wewenang\"]) <= WEWENANG_IZIN.",
        "Batas: tambah 25 jika a[\"batas\"] is not None dan a[\"batas\"] <= BATAS_MAKS. Review: tambah 25 jika a[\"review_hari_lalu\"] <= 90.",
        "beku = [nama for nama, s in skor_semua.items() if s < SKOR_BEKU]; n_aman = sisanya.",
      ],
      code: {
        starter: `# ===== DATA AGEN — jangan diubah =====\nAGEN = [\n    {"nama": "arsip-bot", "pemilik": "Dina", "wewenang": ["baca"], "batas": 500000, "review_hari_lalu": 41},\n    {"nama": "pesan-bot", "pemilik": "", "wewenang": ["kirim_email"], "batas": 5000000, "review_hari_lalu": 60},\n    {"nama": "trading-assist", "pemilik": "Budi", "wewenang": ["kirim_order"], "batas": 1000000, "review_hari_lalu": 152},\n    {"nama": "hapus-cron", "pemilik": "", "wewenang": ["hapus", "baca"], "batas": None, "review_hari_lalu": 335},\n    {"nama": "lapor-mingguan", "pemilik": "Citra", "wewenang": ["tulis_draf", "kirim_email"], "batas": 200000, "review_hari_lalu": 16},\n]\nWEWENANG_IZIN = {"baca", "tulis_draf", "kirim_email", "kirim_order"}\nBATAS_MAKS = 2000000  # rupiah per hari\nSKOR_BEKU = 75  # beku jika skor < 75\n\n# TULIS KODEMU DI BAWAH INI`,
        lockLines: 13,
        solution: `# ===== DATA AGEN — jangan diubah =====\nAGEN = [\n    {"nama": "arsip-bot", "pemilik": "Dina", "wewenang": ["baca"], "batas": 500000, "review_hari_lalu": 41},\n    {"nama": "pesan-bot", "pemilik": "", "wewenang": ["kirim_email"], "batas": 5000000, "review_hari_lalu": 60},\n    {"nama": "trading-assist", "pemilik": "Budi", "wewenang": ["kirim_order"], "batas": 1000000, "review_hari_lalu": 152},\n    {"nama": "hapus-cron", "pemilik": "", "wewenang": ["hapus", "baca"], "batas": None, "review_hari_lalu": 335},\n    {"nama": "lapor-mingguan", "pemilik": "Citra", "wewenang": ["tulis_draf", "kirim_email"], "batas": 200000, "review_hari_lalu": 16},\n]\nWEWENANG_IZIN = {"baca", "tulis_draf", "kirim_email", "kirim_order"}\nBATAS_MAKS = 2000000  # rupiah per hari\nSKOR_BEKU = 75  # beku jika skor < 75\n\n# TULIS KODEMU DI BAWAH INI\ndef skor(a):\n    s = 0\n    if a["pemilik"]:\n        s += 25\n    if set(a["wewenang"]) <= WEWENANG_IZIN:\n        s += 25\n    if a["batas"] is not None and a["batas"] <= BATAS_MAKS:\n        s += 25\n    if a["review_hari_lalu"] <= 90:\n        s += 25\n    return s\n\nskor_semua = {a["nama"]: skor(a) for a in AGEN}\nbeku = [n for n, s in skor_semua.items() if s < SKOR_BEKU]\nn_aman = sum(1 for s in skor_semua.values() if s >= SKOR_BEKU)\n\nprint(f"skor={skor_semua}")\nprint(f"AMAN: {n_aman}  BEKU: {len(beku)} -> {beku}")`,
        checks: [
          { kind: "defined", task: "t1", name: "skor_semua", label: "`skor_semua` terdefinisi", msg: "Hitung skor tiap agen ke dalam dict skor_semua." },
          { kind: "equal", task: "t2", name: "beku", value: ["pesan-bot", "hapus-cron"], label: "`beku` berisi 2 agen yang tepat", msg: "pesan-bot (skor 50) dan hapus-cron (skor 0) di bawah ambang 75." },
          { kind: "equal", task: "t2", name: "n_aman", value: 3, label: "`n_aman` = 3", msg: "arsip-bot, trading-assist, lapor-mingguan lolos." },
          { kind: "stdout_matches", task: "t2", pattern: "BEKU: 2 -> \\['pesan-bot', 'hapus-cron'\\]", label: "Output baris ringkasan sesuai format", msg: "Samakan format print dengan contoh di expected." },
        ],
      },
      reference: "Setiap agen: pemilik bernama + register + batas angka + review ≤ 90 hari + tombol mati.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang gradasi kontrol.",
        "Refleksi: guardrail = arsitektur kekuasaan. Tiga pertanyaan untuk setiap agen yang kamu bangun: (1) “Apa hal TERBURUK yang bisa ia lakukan?” — tulis, jangan bayangkan. (2) “Lapisan apa yang menghentikannya?” — jika jawabannya “prompt yang baik”, kamu belum punya lapisan. (3) “Siapa yang bisa menghentikannya dalam 5 detik?” — jika tidak ada, kamu belum selesai. Tiga pertanyaan, 5 menit — dan kamu tahu apakah agenmu aman atau hanya beruntung.",
        "Satu kalimat untuk dibawa pulang: “Keamanan bukan fitur yang ditambahkan di akhir; ia adalah keputusan tentang SIAPA BOLEH APA yang dibuat di awal.” Setiap tool baru = pertanyaan tier baru. Setiap kenaikan otonomi = pertanyaan akuntabilitas baru. Tim yang menanyakan ini di hari pertama tidak pernah menulis postmortem seperti Dina. Tim yang tidak — menulisnya sekali, dengan biaya Rp45 juta.",
      ],
      tasks: [],
      summary: [
        "Tier 0 bebas, tier 1 +audit, tier 2 approval, tier 3 tool-nya tidak diberikan.",
        "Approval harus spesifik per aksi — blanket approval = tier-2 rasa tier-0.",
        "Audit trail append-only: waktu, aktor, argumen, hasil — untuk investigasi & replay.",
        "E[L] = p_err × dampak × (1−p_cegat): kejar p_cegat tinggi untuk dampak besar.",
        "Waspadai alert fatigue: <30 approval/hari; jika 99% di-ACC, tier salah setel.",
      ],
      next: { label: "AAI10 — Framework: LangChain/LangGraph & Alternatif", href: "/learn/aai10-framework" },
      quiz: [
        {
          q: "Agen butuh tool \u201Chapus massal arsip\u201D. Keputusan arsitektur TEPAT?",
          options: [
            { text: "Berikan dengan approval gate", why: "Hapus massal tak reversible — gate tidak cukup; kesalahan sekali = bencana.", },
            { text: "Jangan berikan tool-nya sama sekali (tier-3)", why: "Tepat. Di luar mandat agen = tool tidak ada. Soft-delete via tier-2 jika memang butuh.", correct: true },
            { text: "Berikan bebas, agennya pintar", why: "Tepat — dan itulah yang terjadi pada Dina: tool hapus-tanpa-batas tanpa tier, tanpa approval, tanpa kill switch. Insidennya bukan kegagalan prompt, melainkan kegagalan ARSITEKTUR KEKUASAAN: tidak ada satu pun dari empat lapis defense in depth yang dipasang.", },
            { text: "Berikan hanya di malam hari", why: "Waktu tidak mengubah reversibilitas: email yang terkirim 1 detik lalu sama tidak bisa ditariknya dengan yang terkirim 1 jam lalu. Yang menentukan tier adalah DAMPAK × REVERSIBILITAS, bukan kecepatan. Jangan tertukar antara ‘cepat’ dan ‘aman’.", },
          ],
        },
        {
          q: "120 approval/hari, 99% di-ACC dalam 8 detik. Diagnosis?",
          options: [
            { text: "Sistem aman, manusia efisien", why: "8 detik = tidak membaca. Itu bukan efisiensi, itu fatigue.", },
            { text: "Alert fatigue — gate kehilangan fungsi, tier perlu direklasifikasi", why: "Tepat. Turunkan yang reversible ke tier-1; sisakan yang benar-benar butuh mata manusia.", correct: true },
            { text: "Tambah lebih banyak approval", why: "Menambah beban justru memperparah fatigue: 120 review/hari sudah membuat waktu baca turun ke 8 detik. Menambah menjadi 150 = efektivitas semakin nol. Solusinya bukan lebih banyak review, melainkan review yang lebih CERDAS (sampling + batching + auto-approve pola aman).", },
            { text: "Ganti manusia dengan AI approver", why: "AI menyetujui AI = lingkaran tanpa akuntabilitas: siapa yang bertanggung jawab saat salah? Tidak ada. Approval harus datang dari pihak yang MENANGGUNG risikonya (manusia) — bukan dari sistem yang tidak bisa dimintai pertanggungjawaban. Delegasi tanpa akuntabilitas = abdikasi.", },
          ],
        },
        {
          q: "p_err = 0,02; dampak = Rp50 juta; p_cegat = 0,8. E[L]?",
          options: [
            { text: "Rp1.000.000", why: "Itu p_err × dampak — lupa faktor (1−p_cegat).", },
            { text: "Rp200.000", why: "0,02 × 50.000.000 × 0,2 = 200.000. Guardrail memotong 80% expected loss.", correct: true },
            { text: "Rp40.000.000", why: "Itu dampak × (1−p_cegat) — lupa p_err.", },
            { text: "Rp0", why: "Guardrail mengurangi, bukan menghilangkan: p_cegat=0,8 berarti 20% lolos — E[L] tidak pernah nol. Klaim “aman 100%” adalah kebohongan yang berbahaya karena mematikan kewaspadaan. Rancang untuk 20% yang lolos (recovery + audit), bukan hanya untuk 80% yang tertangkap.", },
          ],
        },
        {
          q: "Apa beda human-in-the-loop vs human-on-the-loop?",
          options: [
            { text: "Tidak ada beda", why: "Ada: in = setujui tiap aksi; on = awasi + intervensi bila perlu.", },
            { text: "In-the-loop: setujui tiap aksi; on-the-loop: awasi dasbor + kill switch", why: "Tepat. Pilih berdasarkan kecepatan kerusakan vs reversibilitas.", correct: true },
            { text: "On-the-loop lebih aman selalu", why: "Untuk aksi ireversibel lambat, in-the-loop lebih aman.", },
            { text: "In-the-loop untuk sistem real-time", why: "Real-time 24/7 tidak bisa menunggu manusia per aksi.", },
          ],
        },
        {
          q: "Fungsi utama audit trail append-only?",
          options: [
            { text: "Mempercantik dasbor", why: "Bukan — opsi ini salah arah. Kembali ke rumus E[L]: setiap opsi yang mengabaikan salah satu dari tiga faktor (p_err, dampak, p_cegat) pasti salah hitung. Biasakan cek ketiga faktor sebelum memilih.", },
            { text: "Investigasi insiden & replay jejak aksi", why: "Tepat. Tanpa log, insiden Dina tidak akan pernah terjelaskan.", correct: true },
            { text: "Menggantikan approval", why: "Log mencatat; approval mencegah. Komplemen, bukan pengganti.", },
            { text: "Menambah kecepatan agen", why: "Benar — dan overhead itu kecil: ~1KB per aksi. Tetapi manfaatnya besar: forensik 10 menit vs 3 hari, pola kegagalan yang bisa dianalisis, dan akuntabilitas. “Overhead kecil” bukan alasan untuk melewatkan; ia adalah alasan untuk TIDAK melewatkan — murah kok.", },
          ],
        },
      ],
    },
  ],
};
