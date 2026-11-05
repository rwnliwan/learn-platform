import type { V2Lesson } from "../lib/types";

export const mk18: V2Lesson = {
  slug: "mk18-etika",
  track: "Marketing Analytics",
  module: "Etika & Storytelling",
  title: "MK18 — Etika & Storytelling: Dipercaya dan Didengar",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-pinjambaik",
      eyebrow: "Langkah 1 · Cerita PinjamBaik",
      title: "Targeting \u201Ccerdas\u201D yang diskriminatif",
      prose: [
        "PinjamBaik memakai model untuk targeting iklan pinjaman: hindari \u201Ckode pos berisiko\u201D. CPA turun 30% — efisien! Lalu audit menemukan: kode pos = proxy ras/etnis. Iklan pinjaman berbunga tinggi hanya tampil di wilayah minoritas. Viral. Denda regulator. Boikot.",
        "Tidak ada yang berniat diskriminatif — model hanya mengoptimasi CPA. Tapi \u201Ctidak berniat\u201D bukan pembelaan: dampaknya diskriminatif, dan di banyak yurisdiksi itu cukup untuk melanggar hukum.",
        "Lesson ini dua sisi analis yang bertahan lama: etika (agar tidak menghancurkan perusahaan) dan storytelling (agar yang benar didengar).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "\u201CEfisiensi\u201D 30% → denda + boikot + biaya krisis 100x lipat. Etika = asuransi termurah perusahaan.",
        type: "risk",
      },
      reference: "Yang dinilai hukum = dampak, bukan niat.",
    },
    {
      id: "uu-pdp",
      eyebrow: "Langkah 2 · UU PDP",
      title: "Aturan main data pribadi",
      prose: [
        "UU PDP (No. 27/2022): data pribadi = info tentang individu yang teridentifikasi. Prinsip: consent (persetujuan sah untuk tujuan spesifik), purpose limitation (hanya untuk tujuan yang disetujui), minimisasi (kumpulkan seperlunya), hak subjek (akses, koreksi, hapus, tarik consent).",
        "Implikasi marketing: data newsletter tidak boleh dipakai untuk custom audience tanpa consent baru; opt-out harus mudah; retensi terbatas. Worked: kampanye re-consent menghasilkan 120.000 consent baru yang sah — lebih sedikit tapi legal & engaged (malah convert lebih baik).",
        "Denda & pidana = nyata. Libatkan legal/DPO sejak desain (privacy by design), bukan setelah viral.",
      ],
      tasks: [],
      reference: "Consent spesifik, purpose limitation, minimisasi. Denda nyata.",
    },
    {
      id: "fairness-lab",
      eyebrow: "Langkah 3 · Fairness & lab",
      title: "Disparate impact: DI ratio < 0,8 = red flag",
      prose: [
        "Proxy discrimination: fitur \u201Cnetral\u201D (kode pos, device) berkorelasi dengan atribut dilindungi → model diskriminatif tanpa pernah \u201Cmelihat\u201D atributnya. Ukur dengan DI ratio = rate minoritas / rate mayoritas. Di bawah 0,8 (aturan 4/5) = red flag.",
        "Worked PinjamBaik: penawaran bunga rendah — wilayah A (mayoritas) 40%, wilayah B (minoritas) 18%. DI = 18/40 = 0,45 → red flag. Mitigasi: hapus kode pos granular, uji proxy tiap fitur, atau samakan penawaran by risiko individual yang sah.",
        "Di lab ini kamu menghitung DI ratio. Satu angka ini = bukti satu slide untuk direksi.",
      ],
      formula: String.raw`\text{DI ratio} = \frac{\text{rate}_{\text{minoritas}}}{\text{rate}_{\text{mayoritas}}} \quad (\text{red flag jika } < 0{,}8)`,
      formulaNote: "DI ratio = disparate impact ratio: rate_minoritas = tingkat hasil baik (penawaran bunga rendah, approval) untuk kelompok minoritas; rate_mayoritas = untuk kelompok mayoritas. Di bawah 0,8 (aturan 4/5) = bukti awal disparate impact. Ini red flag untuk investigasi — bukan vonis final; mitigasi: hapus fitur proxy, uji ulang, dokumentasikan.",
      tasks: [
        { id: "t1", text: "Hitung `di` = rate minoritas / rate mayoritas" },
        { id: "t2", text: "Tentukan `status` (\u201CRED FLAG\u201D jika < 0,8), cetak" },
      ],
      expected: "di=0.45 status=RED FLAG",
      hints: [
        "di = grup[\"B\"] / grup[\"A\"].",
        "status = \"RED FLAG\" if di < 0.8 else \"AMAN\".",
        "0,18 / 0,40 = 0,45.",
      ],
      code: {
        starter: `# % dapat penawaran bunga rendah per wilayah\ngrup = {"A": 0.40, "B": 0.18}\n\n# TULIS KODEMU: DI ratio dan status\nmayor = max(grup.values())\nminor = min(grup.values())\ndi =\nstatus =\n\nprint(f"di={di:.2f} status={status}")`,
        lockLines: 5,
        solution: `# % dapat penawaran bunga rendah per wilayah\ngrup = {"A": 0.40, "B": 0.18}\n\n# TULIS KODEMU: DI ratio dan status\nmayor = max(grup.values())\nminor = min(grup.values())\ndi = minor / mayor\nstatus = "RED FLAG" if di < 0.8 else "AMAN"\n\nprint(f"di={di:.2f} status={status}")`,
        checks: [
          { kind: "equal", task: "t1", name: "di", value: 0.45, tol: 1e-9, label: "`di` seharusnya 0,45", msg: "0,18 / 0,40 = 0,45." },
          { kind: "equal", task: "t2", name: "status", value: "RED FLAG", label: "`status` seharusnya RED FLAG", msg: "0,45 < 0,8 = bukti awal disparate impact." },
          { kind: "stdout_matches", task: "t2", pattern: "RED FLAG", label: "`print` menampilkan status", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "DI < 0,8 = red flag. Audit sebelum deploy model berdampak.",
    },
    {
      id: "anonim-lab",
      eyebrow: "Langkah 4 · Anonimisasi & lab",
      title: "\u201CAnonim\u201D harus dibuktikan: k ≥ 5",
      prose: [
        "Miskonsepsi: \u201Cnama dihapus = aman\u201D. Faktanya: kode pos + tanggal lahir + gender = unik untuk 87% populasi (penelitian Latanya). Tanpa nama pun orang bisa diidentifikasi kembali.",
        "k-anonymity: tiap kombinasi quasi-identifier harus dimiliki minimal k orang (praktik: k ≥ 5). Caranya: generalisasi (umur 27 → 25–30) dan supresi (buang record yang terlalu unik).",
        "Di lab ini kamu menguji dataset \u201Canonim\u201D: hitung ukuran tiap kelompok quasi-identifier. k=1 = teridentifikasi — dataset ini tidak boleh dirilis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung ukuran tiap kombinasi (kodepos, umur) di `kelompok`" },
        { id: "t2", text: "Tentukan `k_anon` = kelompok terkecil, cetak + status" },
      ],
      expected: "k_anon=1 → TERIDENTIFIKASI",
      hints: [
        "kelompok[q] = kelompok.get(q, 0) + 1.",
        "k_anon = min(kelompok.values()).",
        "k=1 → unik → teridentifikasi.",
      ],
      code: {
        starter: `# (kodepos, umur) — nama sudah dihapus\nrecords = [("A", 25), ("A", 25), ("A", 30), ("B", 40)]\n\n# TULIS KODEMU: ukuran tiap kombinasi, lalu k = minimum\nkelompok = {}\nfor q in records:\n    kelompok[q] =\nk_anon =\nstatus = "TERIDENTIFIKASI" if k_anon < 5 else "AMAN"\n\nprint(f"k_anon={k_anon} {status}")`,
        lockLines: 6,
        solution: `# (kodepos, umur) — nama sudah dihapus\nrecords = [("A", 25), ("A", 25), ("A", 30), ("B", 40)]\n\n# TULIS KODEMU: ukuran tiap kombinasi, lalu k = minimum\nkelompok = {}\nfor q in records:\n    kelompok[q] = kelompok.get(q, 0) + 1\nk_anon = min(kelompok.values())\nstatus = "TERIDENTIFIKASI" if k_anon < 5 else "AMAN"\n\nprint(f"k_anon={k_anon} {status}")`,
        checks: [
          { kind: "equal", task: "t2", name: "k_anon", value: 1, tol: 1e-9, label: "`k_anon` seharusnya 1", msg: "Kelompok (A,30) dan (B,40) hanya 1 orang — unik." },
          { kind: "stdout_matches", task: "t2", pattern: "TERIDENTIFIKASI", label: "`print` menampilkan status", msg: "k=1 < 5 = tidak boleh dirilis." },
        ],
      },
      reference: "k-anonymity ≥ 5. Generalisasi + supresi.",
    },
    {
      id: "storytelling",
      eyebrow: "Langkah 5 · Storytelling",
      title: "Benar saja tidak cukup",
      prose: [
        "Struktur what–so what–now what: WHAT (\u201Cretention cohort baru 18%\u201D), SO WHAT (\u201Cscale = bakar uang; LTV:CAC turun ke 1,8\u201D), NOW WHAT (\u201Ctahan budget 1 bulan; sprint onboarding; target M3 ≥ 30%\u201D). Pyramid principle: kesimpulan dulu, baru pendukung.",
        "Satu slide = satu pesan. Bandingkan: slide \u201CHentikan scale — perbaiki onboarding dulu\u201D + 3 aksi vs \u201CAnalisis Retention Q2\u201D berisi 12 chart tanpa kesimpulan. Yang mana dieksekusi direksi?",
        "Storytelling jujur: sumbu tidak dipotong menipu, tidak cherry-pick periode, tidak klaim kausal dari korelasi. Sekali ketahuan memanipulasi chart = kepercayaan hilang selamanya (kisah analis Andi).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membuka presentasi dengan metodologi. Direksi memutuskan dari kesimpulan, bukan dari metode. Kesimpulan di judul slide, detail di appendix.",
        type: "pitfall",
      },
      reference: "What → so what → now what. 1 slide 1 pesan. Jujur selalu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Empat gerbang + kalimat penolak",
      prose: [
        "Peta keputusan ringkas: (1) Data untuk tujuan baru → cek consent & purpose limitation (re-consent lebih murah dari denda). (2) Model berdampak ke akses/harga → audit fairness (DI ≥ 0,8) sebelum deploy. (3) Rilis data \u201Canonim\u201D → buktikan k ≥ 5. (4) Presentasi → what–so what–now what.",
        "Simulasi menolak permintaan abu-abu (bos: \u201Cpercantik chart-nya\u201D): lapis 1 — tawarkan jalan jujur (\u201Csaya tampilkan churn organik 4,2% yang ceritanya lebih kuat\u201D). Lapis 2 — minta tertulis (\u201Cboleh via email? untuk audit\u201D; 90% permintaan mati di sini). Lapis 3 — jika dipaksa: catat kaki jujur + simpan bukti + konsultasi compliance.",
        "Integritas analis = aset karier. Analis yang \u201Cdatanya jujur walau pahit\u201D = orang pertama yang ditanya saat keputusan besar.",
      ],
      tasks: [],
      reference: "Pisahkan tujuan dari cara. Minta tertulis. Dokumentasikan.",
    },
    {
      id: "adv-cookie-deprecation",
      eyebrow: "Langkah 7 · Cookie deprecation",
      title: "Peta bertahan hidup: apa yang mati, apa yang hidup",
      prose: [
        "Third-party cookie mati (Chrome Privacy Sandbox, ITP Safari, ATT iOS). Yang MATI: cross-site tracking (mengikuti user antar-situs), frequency capping lintas situs, view-through attribution presisi, dan sebagian besar retargeting pihak ketiga. Yang HIDUP: first-party data (milikmu sendiri + consent), contextual targeting (iklan by konten halaman, bukan by orang), MMM dan geo-experiment (tidak butuh identitas individu), serta aggregated reporting.",
        "Checklist migrasi 90 hari: (1) audit ketergantungan cookie pihak ketiga di semua laporan; (2) bangun first-party capture (newsletter, loyalty, login) dengan consent UU PDP yang sah; (3) pindahkan event uang ke server-side + Conversions API; (4) siapkan MMM/holdout sebagai pengganti atribusi granular; (5) latih tim membaca angka agregat + modeled — bukan menunggu 'data dulu yang lengkap'.",
        "Prinsip: privasi bukan akhir pengukuran — ia akhir dari pengukuran yang malas. Metode yang bertahan (eksperimen, agregat, first-party) justru lebih kausal dan lebih jujur dari cookie yang mati.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Third-party cookie mati. Yang TETAP hidup?",
          options: [
            { text: "First-party data + MMM/geo-experiment + contextual", why: "Tidak butuh identitas lintas situs — justru lebih kausal.", correct: true },
            { text: "Cross-site retargeting presisi", why: "Itu yang mati pertama." },
            { text: "View-through attribution per individu", why: "Mati bersama cookie-nya." },
            { text: "Frequency capping lintas situs", why: "Butuh identitas lintas situs — mati." },
          ],
        },
        {
          q: "Langkah migrasi pertama yang benar?",
          options: [
            { text: "Audit ketergantungan cookie di semua laporan", why: "Tidak bisa migrasi yang tidak dipetakan.", correct: true },
            { text: "Beli data pihak ketiga pengganti", why: "Memperdalam masalah + risiko UU PDP." },
            { text: "Berhenti mengukur", why: "Menyerah bukan strategi." },
            { text: "Tunggu Google memberi solusi", why: "Pasif = tertinggal; peta sudah jelas." },
          ],
        },
      ],
      reference: "Mati: cross-site. Hidup: first-party, MMM, eksperimen, agregat.",
    },
    {
      id: "adv-privacy-measurement",
      eyebrow: "Langkah 8 · Privacy-preserving measurement",
      title: "Mengukur tanpa mengintip: agregat, noise, clean room",
      prose: [
        "Tiga teknik pengukuran yang menghormati privasi. (1) Aggregated reporting: platform hanya melaporkan agregat (mis. '1.200 conversion dari kampanye X') tanpa identitas individu — cukup untuk optimasi, tidak cukup untuk profiling. (2) Differential privacy: noise matematis ditambahkan ke agregat sehingga tidak ada individu yang bisa diidentifikasi ulang, dengan jaminan statistik. (3) Data clean room: dua pihak (brand + publisher) mencocokkan data di ruang aman — masing-masing hanya melihat agregat hasil, tidak pernah data mentah pihak lain.",
        "Konsekuensi analis: biasakan interval dan ambang. 'Conversion 1.200 ± noise' bukan 'conversion 1.237'. Keputusan besar dari angka ber-noise butuh efek yang lebih besar untuk signifikan — dan itu sehat: mencegah keputusan dari fluktuasi.",
        "Aturan: pilih teknik sesuai sensitivitas data. Data kesehatan/keuangan → clean room + noise. Data kampanye biasa → agregat + consent. Satu standar untuk semua = over-engineering atau under-protection.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Brand ingin mengukur overlap audiens dengan publisher tanpa berbagi data mentah. Solusi?",
          options: [
            { text: "Data clean room — cocokkan di ruang aman, hanya agregat yang keluar", why: "Kedua pihak tidak pernah melihat data mentah pihak lain.", correct: true },
            { text: "Kirim CSV data mentah", why: "Melanggar purpose limitation + risiko bocor." },
            { text: "Tebak dari survei", why: "Tidak akurat dan tidak scalable." },
            { text: "Batalkan kerja sama", why: "Berlebihan; clean room dirancang untuk ini." },
          ],
        },
      ],
      reference: "Agregat + noise + clean room; sesuaikan dengan sensitivitas.",
    },
    {
      id: "intuisi-asuransi",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Etika bukan rem — ia setir",
      prose: [
        "PinjamBaik menghemat 30% CPA lalu membayar 100x lipat dalam denda dan boikot. Tiga heuristik agar efisiensimu tidak memakan perusahaanmu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: privasi bukan penghalang analytics — ia desain yang memaksa kejujuran",
        body: "Heuristik pertama: 'tidak berniat' bukan pembelaan — yang dinilai hukum dan publik adalah dampak. Setiap model yang berdampak ke akses, harga, atau peluang (kredit, hiring, asuransi) wajib audit fairness SEBELUM deploy, bukan setelah viral. DI ratio < 0,8 = berhenti dan investigasi. Audit 1 hari lebih murah dari krisis 1 tahun. Heuristik kedua: consent yang benar = data yang lebih baik. 120.000 consent sah yang engaged mengalahkan 500.000 email mati yang legally toxic. Memaksa data tanpa consent = membangun istana di atas tanah sengketa — cepat atau lambat digusur (dan biayanya bukan hanya denda, tetapi seluruh pipeline yang harus dibangun ulang). Heuristik ketiga: kematian third-party cookie adalah berkah yang menyamar. Ia membunuh pengukuran yang malas (cross-site stalking) dan memaksa yang baik: first-party relationship, eksperimen kausal, MMM, dan agregat yang jujur. Perusahaan yang meratapi cookie = perusahaan yang belum punya hubungan dengan pelanggannya sendiri. Bangun hubungan itu — login, loyalty, newsletter yang dibaca — dan kamu tidak akan merindukan cookie sama sekali. Etika = asuransi termurah + strategi data terbaik.",
      },
      reference: "Audit dampak dulu; consent = kualitas; cookie mati = berkah.",
    },
    {
      id: "minicase-pinjambaik2",
      eyebrow: "Langkah 10 · Mini-case",
      title: "PinjamBaik, bagian 2: consent sebagai keunggulan",
      prose: [
        "Pasca-krisis, PinjamBaik membangun ulang dengan privacy-by-design. (1) Fitur kode pos granular dihapus → diganti risiko individual (riwayat kredit, rasio utang) yang sah; DI ratio naik 0,45 → 0,92. (2) Kampanye re-consent: 120.000 consent sah (dari 500.000 email lama) — lebih sedikit, tetapi open rate 34% vs 8% (yang consent = yang peduli). (3) Server-side tracking + clean room dengan publisher — tanpa cookie pihak ketiga.",
        "Hasil 6 bulan: CPA naik 12% vs masa 'efisien' (biaya keadilan), tetapi: nol temuan regulator, conversion dari consent-base 2,1x lipat, dan — yang tak terduga — brand trust score naik 18 poin ('mereka meminta izin dulu').",
        "Pertanyaan: (1) Apakah CPA +12% = kegagalan? (2) Mengapa conversion consent-base lebih tinggi? (3) Pelajaran untuk deprecation cookie?",
        "Pembahasan: (1) Bukan — 12% adalah 'pajak keadilan'; bandingkan dengan 100x biaya krisis. (2) Seleksi: yang memberi consent = yang engaged; kualitas > kuantitas. (3) Mereka sudah migrasi SEBELUM dipaksa — first-party + server-side + clean room = peta yang terbukti bekerja.",
      ],
      tasks: [],
      quiz: [
        {
          q: "PinjamBaik: CPA +12% tetapi nol temuan + trust +18. Penilaian?",
          options: [
            { text: "Sukses — 12% pajak keadilan vs 100x biaya krisis", why: "Efisiensi yang diskriminatif bukan efisiensi — ia bom waktu.", correct: true },
            { text: "Gagal — CPA naik", why: "CPA bukan satu-satunya metrik; risiko dan trust ikut dihitung." },
            { text: "Netral", why: "Nol temuan + trust +18 = jelas positif." },
            { text: "Harus kembali ke model lama", why: "Model lama = menunggu krisis berikutnya." },
          ],
        },
        {
          q: "Mengapa conversion dari consent-base 2,1x lipat?",
          options: [
            { text: "Seleksi: yang consent = yang engaged — kualitas mengalahkan kuantitas", why: "120rb yang peduli > 500rb yang mati.", correct: true },
            { text: "Kebetulan", why: "Mekanisme seleksinya jelas." },
            { text: "Consent membuat orang membeli", why: "Bukan consent-nya; melainkan siapa yang memberi consent." },
            { text: "Data dimanipulasi", why: "Tidak ada bukti; polanya konsisten dengan teori." },
          ],
        },
      ],
      reference: "Keadilan = pajak murah; consent = kualitas; migrasi sebelum dipaksa.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Etika = manajemen risiko; storytelling = agar kebenaran bekerja.",
      ],
      tasks: [],
      summary: [
        "UU PDP: consent spesifik, purpose limitation, minimisasi, hak subjek.",
        "Proxy discrimination: audit DI ratio (red flag < 0,8).",
        "\u201CAnonim\u201D harus dibuktikan: k-anonymity ≥ 5.",
        "Etika = asuransi termurah; consent benar = data lebih berkualitas.",
        "What → so what → now what; 1 slide 1 pesan; tolak manipulasi dengan berlapis.",
        "Cookie pihak ketiga mati: migrasi ke first-party + server-side + MMM/eksperimen.",
        "Ukur tanpa mengintip: agregat + noise + clean room sesuai sensitivitas data.",
      ],
      next: { label: "MK19 — Capstone", href: "/learn/mk19-capstone" },
      quiz: [
        {
          q: "Penawaran baik: mayoritas 40%, minoritas 18%. DI ratio dan artinya?",
          options: [
            { text: "0,45 — red flag (< 0,8)", why: "Bukti awal disparate impact. \u201CTidak berniat\u201D bukan pembelaan.", correct: true },
            { text: "2,2 — aman", why: "Terbalik: 40/18 = 2,2 bukan rumusnya." },
            { text: "Tidak bisa dihitung", why: "Bisa: 18/40 = 0,45." },
          ],
        },
        {
          q: "Dataset \u201Canonim\u201D punya 1 orang dengan (kodepos, umur) unik. Status?",
          options: [
            { text: "Teridentifikasi (k=1) — butuh generalisasi/supresi", why: "Unik = teridentifikasi. 3 quasi-identifier cukup untuk 87% populasi.", correct: true },
            { text: "Aman — tanpa nama", why: "Nama bukan syarat identifikasi." },
            { text: "Cukup hapus kodepos", why: "Mungkin belum cukup — harus diukur ulang k-nya." },
          ],
        },
        {
          q: "Tim ingin pakai data newsletter untuk custom audience iklan. Syarat?",
          options: [
            { text: "Cek consent: jika tak mencakup iklan tertarget → re-consent", why: "Purpose limitation. 120rb consent sah > 500rb email mati.", correct: true },
            { text: "Langsung pakai — kan data sendiri", why: "\u201CData sendiri\u201D bukan dasar hukum untuk tujuan baru." },
            { text: "Cukup sediakan opt-out", why: "Opt-out tidak menggantikan consent untuk tujuan baru." },
          ],
        },
        {
          q: "Struktur presentasi analis yang dieksekusi direksi?",
          options: [
            { text: "Kesimpulan dulu (pyramid) + what–so what–now what", why: "Direksi memutuskan dari kesimpulan + aksi, bukan metodologi.", correct: true },
            { text: "Metodologi dulu, 20 chart", why: "Itu cara membuat direksi tidur (kisah Budi, MK19)." },
            { text: "Data mentah saja", why: "Data tanpa narasi = tidak ada keputusan." },
          ],
        },
        {
          q: "Fitur \u201Ckode pos\u201D berkorelasi kuat dengan etnis. Tindakan?",
          options: [
            { text: "Audit: uji proxy, hapus/batasi, atau samakan perlakuan", why: "\u201CNetral\u201D di nama ≠ netral di dampak. Ukur, mitigasi, dokumentasikan.", correct: true },
            { text: "Tetap pakai — kan netral", why: "Kasus PinjamBaik: netral di nama, diskriminatif di dampak." },
            { text: "Sembunyikan dari laporan", why: "Menyembunyikan = memperparah saat ketahuan." },
          ],
        },
      ],
    },
  ],
};
