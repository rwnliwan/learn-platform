import type { V2Lesson } from "../lib/types";

const GOV_PIPELINE_SVG = `<svg viewBox="0 0 480 200" role="img" aria-label="Pipeline governance: daftar, nilai, kontrol, audit.">
<g font-family="var(--font-ui)" font-size="11">
<line x1="30" y1="80" x2="450" y2="80" stroke="var(--chart-grid)" stroke-width="2"/>
<rect x="30" y="45" width="95" height="70" rx="6" fill="var(--c1)"/>
<rect x="145" y="45" width="95" height="70" rx="6" fill="var(--c2)"/>
<rect x="260" y="45" width="95" height="70" rx="6" fill="var(--c3)"/>
<rect x="375" y="45" width="95" height="70" rx="6" fill="var(--c4)"/>
<g text-anchor="middle" fill="var(--text)">
<text x="77" y="68" font-weight="700">DAFTAR</text><text x="77" y="86" font-size="10" fill="var(--chart-text)">inventaris</text><text x="77" y="100" font-size="10" fill="var(--chart-text)">14 sistem</text>
<text x="192" y="68" font-weight="700">NILAI</text><text x="192" y="86" font-size="10" fill="var(--chart-text)">klasifikasi</text><text x="192" y="100" font-size="10" fill="var(--chart-text)">risiko</text>
<text x="307" y="68" font-weight="700">KONTROL</text><text x="307" y="86" font-size="10" fill="var(--chart-text)">sebanding</text><text x="307" y="100" font-size="10" fill="var(--chart-text)">dgn kelas</text>
<text x="422" y="68" font-weight="700">AUDIT</text><text x="422" y="86" font-size="10" fill="var(--chart-text)">re-review</text><text x="422" y="100" font-size="10" fill="var(--chart-text)">berkala</text>
</g>
<text x="240" y="150" text-anchor="middle" fill="var(--text)" font-size="11" font-weight="600">Yang tidak terdaftar = tidak bisa diatur. Urutannya tidak bisa dibalik.</text>
</g></svg>`;

export const llmops17: V2Lesson = {
  slug: "llmops17-governance-kepatuhan",
  track: "LLMOps",
  module: "Safety & Skala",
  title: "LLMOps17 — Governance & Kepatuhan LLM",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Governance LLM menjawab pertanyaan yang membosankan tapi menentukan: sistem AI apa saja yang berjalan di perusahaan ini, seberapa berisikonya masing-masing, siapa yang bertanggung jawab, dan bukti apa yang kita simpan saat ada yang salah.",
        "Alurnya: cerita audit 14 chatbot bayangan → inventaris & registrasi (daftar dulu) → klasifikasi risiko (nilai) → kebijakan data (apa yang boleh masuk prompt) → kepatuhan (UU PDP, sektor keuangan, AI Act sekilas) → lab klasifikasi risiko → peta keputusan → mini-case audit.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa inventaris adalah langkah pertama governance; (2) menghitung skor risiko use case dari dampak × otonomi dan menentukan kontrol wajib per kelas; (3) merumuskan kebijakan data untuk prompt (klasifikasi data, larangan, retensi log); (4) menyebut prinsip umum kepatuhan (UU PDP, konteks keuangan, AI Act berjenjang) dan kapan memicu re-review; (5) merancang respons governance untuk 5 situasi nyata.",
      ],
      tasks: [],
      reference: "DAFTAR → NILAI → KONTROL → AUDIT. Tidak bisa dibalik.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Audit menemukan 14 chatbot yang tak pernah didaftarkan",
      prose: [
        "Maret 2026. Tim audit internal NusaBank menjalankan survei rutin: `sebutkan semua sistem AI yang dipakai unitmu`. Hasilnya 14 chatbot dan asisten yang tidak ada di catatan IT mana pun — dibangun unit bisnis dengan API key pribadi, dibayar dengan kartu kredit manajer, dan dipakai untuk hal-hal seperti meringkas keluhan nasabah dan menyusun draf surat keputusan kredit.",
        "Twist-nya: model-modelnya tidak diretas dan tidak `jahat`. Masalahnya justru lebih sunyi — tidak ada yang tahu mereka ada. Tidak ada logging, tidak ada review keamanan, tidak ada yang tahu data apa yang ditempel karyawan ke prompt. Satu di antaranya ternyata rutin menerima salinan data rekening dalam bentuk teks bebas.",
        "Governance LLM dimulai bukan dari model yang lebih aman, melainkan dari jawaban atas pertanyaan paling dasar: sistem AI apa saja yang berjalan di sini, sekarang, tanpa sepengetahuan kita? Lesson ini membangun jawabannya langkah demi langkah.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: kalau modelnya aman, deploy-nya pasti aman",
        type: "pitfall",
        body: "Yang benar: risiko terbesar NusaBank bukan modelnya — melainkan 14 sistem yang tidak terdaftar. Model aman yang dipakai tanpa logging, tanpa review, dan dengan data rekening di prompt tetap menjadi insiden kepatuhan. Governance mengatur SISTEM (siapa memakai apa untuk apa), bukan hanya model.",
      },
      reference: "Risiko terbesar = yang tidak terdaftar. Governance dimulai dari inventaris.",
    },
    {
      id: "inventaris",
      eyebrow: "Langkah 3 · Konsep",
      title: "Inventaris: atur yang terdaftar, daftarkan yang berjalan",
      prose: [
        "Inventaris (registri sistem LLM) adalah daftar terpusat semua sistem AI yang berjalan: untuk tiap sistem catat model + versi, provider (API publik vs self-host), versi prompt/system message, data yang diakses (jenis + klasifikasi), pemilik bisnis dan pemilik teknis, serta tanggal review berikutnya. Tanpa ini, semua aturan berikutnya tidak punya subjek — kebijakan yang tidak tahu harus mengatur siapa hanyalah dokumen.",
        "Kriteria `sistem LLM` harus jelas dan sederhana agar orang mau mendaftar: contohnya `setiap aplikasi yang memanggil model bahasa untuk keperluan bisnis, sekecil apa pun`. Ambang yang rumit (mis. hanya yang >10.000 request/bulan) justru menciptakan zona abu-abu tempat chatbot bayangan lahir. Daftar dulu, klasifikasikan kemudian.",
        "Pendaftaran harus self-service dan murah: formulir 10 menit, otomatis masuk registri, dan yang mendaftar langsung mendapat dua hal berguna — template kebijakan data dan jadwal review. Pendaftaran yang menyusahkan = insentif untuk tetap bayangan. 💡 Intuisi: registri yang baik seperti sensus penduduk — tujuannya bukan menghukum yang tidak terdaftar, melainkan membuat mereka terlihat sehingga bisa dilindungi (dan diatur).",
        "Inventaris adalah artefak hidup: tiap sistem punya tanggal review berikutnya, dan perubahan besar (ganti model, ganti provider, tambah jenis data) wajib memperbarui catatannya. Registri yang ditulis sekali lalu dilupakan = kuburan data, bukan governance.",
      ],
      tasks: [
        { id: "t1", text: "Tulis 6 kolom wajib registri sistem LLM versimu" },
        { id: "t2", text: "Tentukan kriteria `sistem LLM` satu kalimat yang tidak menciptakan zona abu-abu" },
      ],
      expected: "model+versi, provider, versi prompt, data yang diakses, pemilik, tanggal review; kriteria: setiap aplikasi yang memanggil model bahasa untuk keperluan bisnis.",
      note: {
        title: "🚨 Mitos: inventaris = spreadsheet yang diisi sekali",
        type: "pitfall",
        body: "Yang benar: tanpa tanggal review dan kewajiban update saat ada perubahan besar, registri basi dalam 6 bulan. NusaBank menemukan 14 sistem bayangan justru karena registri lamanya `lengkap` — tapi terakhir diperbarui 2 tahun lalu.",
      },
      reference: "Daftar murah & self-service; ada tanggal review; update saat berubah besar.",
    },
    {
      id: "klasifikasi-risiko",
      eyebrow: "Langkah 4 · Konsep",
      title: "Klasifikasi risiko: dampak × otonomi",
      prose: [
        "Tidak semua chatbot butuh kontrol yang sama. Chatbot FAQ produk publik dan auto-reject pengajuan KPR adalah dua ujung spektrum — memperlakukan keduanya sama berarti membuang sumber daya untuk yang ringan dan kekurangan kontrol untuk yang berbahaya. Klasifikasi risiko menempatkan tiap sistem ke kelas: RENDAH, SEDANG, TINGGI, KRITIS.",
        "Skornya sederhana: R = Dampak × Otonomi. Dampak (1–4): seberapa besar akibat keputusan yang salah bagi nasabah atau perusahaan. Otonomi (1–4): seberapa jauh sistem bertindak tanpa manusia. Kelas ditentukan dari skor, dan data sensitif menaikkan satu kelas — karena data yang bocor tidak bisa di-`unbocorkan`.",
        "💡 Intuisi: otonomi adalah pengganda, bukan penambah. Sistem yang sama (mis. draf surat kredit) menjadi jauh lebih berisiko saat dikirim otomatis tanpa review manusia dibanding saat hanya berupa draf. Governance yang baik tidak melarang sistem berisiko — ia menurunkan otonominya atau menaikkan kontrolnya.",
        "Kontrol wajib per kelas: RENDAH — logging dasar. SEDANG — tambah review sampel berkala. TINGGI — masking/redaksi data sensitif + human review untuk kasus berdampak. KRITIS — larang otonomi penuh, wajib approval tertulis, audit trail lengkap, dan pemberitahuan ke kepatuhan. Kontrol yang tidak sebanding = teater: chatbot FAQ yang dipaksa human review 100% hanya membuat orang mencari jalan pintas (baca: chatbot bayangan baru).",
      ],
      formula: String.raw`R = D \times O`,
      formulaNote: "R = skor risiko (1–16); D = dampak keputusan yang salah (1: konten publik, 2: efisiensi internal, 3: keputusan berdampak ke nasabah, 4: hak/keuangan nasabah); O = otonomi sistem (1: draf yang selalu direview manusia, 2: saran dengan human-in-the-loop, 3: aksi dengan review sampel, 4: aksi otomatis tanpa manusia). Kelas: 1–4 RENDAH, 5–8 SEDANG, 9–12 TINGGI, 13–16 KRITIS; data sensitif naik 1 kelas (maks KRITIS). Contoh: auto-reject KPR (D=4, O=4) → R=16 → KRITIS: larang otonomi penuh + approval tertulis.",
      tasks: [
        { id: "t1", text: "Hitung kelas untuk: ringkasan keluhan nasabah (D=2, O=2, data sensitif)" },
        { id: "t2", text: "Sebutkan kontrol wajib untuk kelas TINGGI" },
      ],
      expected: "skor 4 → RENDAH, data sensitif → naik jadi SEDANG; kontrol TINGGI: masking/redaksi data + human review kasus berdampak.",
      note: {
        title: "🚨 Mitos: semua sistem AI butuh kontrol yang sama",
        type: "pitfall",
        body: "Yang benar: kontrol seragam membunuh yang ringan (orang mencari jalan pintas → bayangan baru) dan tidak cukup untuk yang berat. Kelas risiko membuat kontrol PROPORSIONAL: ringan untuk FAQ, berat untuk keputusan kredit otomatis.",
      },
      reference: "R = Dampak × Otonomi; sensitif naik 1 kelas; kontrol sebanding per kelas.",
    },
    {
      id: "kebijakan-data",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kebijakan data: apa yang boleh masuk prompt",
      prose: [
        "Prompt adalah tempat data perusahaan bertemu sistem pihak ketiga — dan itulah titik bocor paling sepele. Kebijakan data menjawab tiga hal: klasifikasi (data publik / internal / rahasia / terbatas — tiap kelas punya aturan main), larangan eksplisit (data rahasia dan data nasabah dilarang ditempel ke API publik; gunakan endpoint dengan perjanjian pemrosesan data atau self-host), dan retensi log (log disimpan berapa lama, siapa boleh baca, dan bagaimana memenuhi permintaan penghapusan).",
        "Aturan praktis yang bisa ditempel di dinding: `jika datanya tidak boleh kamu email ke orang asing, jangan tempel ke chatbot publik`. Karyawan NusaBank yang menempelkan data rekening ke chatbot API publik tidak berniat jahat — mereka tidak tahu itu dilarang, karena tidak ada yang pernah menuliskannya.",
        "Retensi log dan hak penghapusan sering dilupakan: log percakapan berisi PII adalah data pribadi juga. Kebijakan harus menetapkan masa simpan (mis. 90 hari untuk debugging, lalu agregat/anonymize) dan prosedur purge selektif saat nasabah meminta penghapusan datanya. 💡 Intuisi: log yang tidak bisa dihapus adalah bom waktu kepatuhan — setiap permintaan penghapusan yang tidak bisa dipenuhi = satu temuan audit.",
        "Kebijakan tanpa alat bantu = doa. Sediakan: template klasifikasi data satu halaman, daftar endpoint yang disetujui vs dilarang, dan tombol `laporkan pemakaian` yang mudah. Yang melanggar karena tidak tahu beda dengan yang melanggar karena sengaja — kebijakan yang baik membedakan keduanya.",
      ],
      tasks: [
        { id: "t1", text: "Tulis aturan dinding satu kalimat untuk prompt & data rahasia" },
        { id: "t2", text: "Tentukan masa retensi log + alasan bisnisnya" },
      ],
      expected: "tidak boleh di-email ke orang asing → jangan ditempel ke chatbot publik; mis. 90 hari untuk debugging lalu agregat.",
      note: {
        title: "🚨 Mitos: data yang sudah masuk prompt `sudah terjadi, tidak apa-apa`",
        type: "pitfall",
        body: "Yang benar: sekali data rahasia masuk ke API pihak ketiga tanpa perjanjian pemrosesan, kamu kehilangan kendali atasnya — tidak bisa memastikan dihapus, tidak bisa mengaudit aksesnya. Pencegahan (larangan + endpoint disetujui) selalu lebih murah dari forensik.",
      },
      reference: "Klasifikasi data + larangan eksplisit + retensi log yang bisa dihapus.",
    },
    {
      id: "kepatuhan",
      eyebrow: "Langkah 6 · Konsep",
      title: "Kepatuhan: UU PDP, sektor keuangan, AI Act sekilas",
      prose: [
        "Kerangka hukumnya (prinsip umum, bukan kutipan pasal — untuk detailnya libatkan penasihat hukum): UU Perlindungan Data Pribadi mengatur data pribadi dengan prinsip persetujuan, tujuan yang terbatas dan jelas, minimisasi data (kumpulkan yang perlu saja), keamanan, dan hak subjek data termasuk akses dan penghapusan. Setiap prinsip ini punya padanan operasional di langkah sebelumnya: minimisasi = klasifikasi data; hak penghapusan = retensi log yang bisa di-purge.",
        "Konteks sektor keuangan menambah lapisan: keputusan yang berdampak ke nasabah (persetujuan kredit, klaim) umumnya menuntut penjelasan yang bisa dipahami nasabah, mekanisme sanggahan atau banding, dan jejak audit siapa memutuskan apa dengan data versi berapa. LLM yang memberi keputusan tanpa jejak = temuan kepatuhan yang menunggu waktu. 💡 Intuisi: regulator tidak menuntut modelmu sempurna — ia menuntut kamu bisa MENJELASKAN dan MEMPERTANGGUNGJAWABKAN keputusannya.",
        "Gambaran umum standar internasional: Uni Eropa mengatur AI berjenjang risiko — praktik yang dilarang, sistem berisiko tinggi (kewajiban dokumentasi, uji, human oversight), risiko terbatas (kewajiban transparansi: beri tahu user ia bicara dengan AI), dan risiko minimal. Polanya sama dengan klasifikasi di langkah 4: semakin besar dampak, semakin berat kewajibannya. Mengetahui kerangka ini membantu saat perusahaanmu beroperasi lintas yurisdiksi atau memakai vendor global.",
        "Praktiknya: petakan tiap sistem KRITIS/TINGGI ke kewajiban spesifik (dokumentasi apa, uji apa, siapa menandatangani), simpan buktinya di satu tempat, dan jadwalkan review kepatuhan bersamaan dengan re-review teknis. Kepatuhan yang terpisah dari operasi = dokumen yang tidak dibaca siapa pun.",
      ],
      tasks: [
        { id: "t1", text: "Padankan 3 prinsip UU PDP dengan kontrol operasional di lesson ini" },
        { id: "t2", text: "Sebutkan 3 hal yang harus bisa dijelaskan ke nasabah untuk keputusan berdampak" },
      ],
      expected: "minimisasi→klasifikasi data; hak hapus→retensi log purge; persetujuan→kebijakan pemakaian; penjelasan: dasar keputusan, data yang dipakai, cara menyanggah.",
      note: {
        title: "🚨 Mitos: kepatuhan = urusan legal, bukan tim teknis",
        type: "pitfall",
        body: "Yang benar: setiap prinsip hukum butuh implementasi teknis — hak penghapusan butuh log yang bisa di-purge, kewajiban penjelasan butuh jejak keputusan yang tersimpan. Tanpa tim teknis, kepatuhan hanya dokumen; tanpa legal, teknis menebak-nebak kewajibannya.",
      },
      reference: "UU PDP: persetujuan, tujuan terbatas, minimisasi, keamanan, hak subjek data. Keuangan: penjelasan + sanggahan + jejak audit.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: klasifikasikan risiko & tentukan kontrol",
      prose: [
        "Enam use case NusaBank menunggu klasifikasimu. Tugasmu: tulis fungsi `kelas_risiko(skor, sensitif)` yang memetakan skor R = D × O ke kelas (1–4 RENDAH, 5–8 SEDANG, 9–12 TINGGI, 13–16 KRITIS; data sensitif menaikkan 1 kelas, maksimal KRITIS), lalu terapkan ke semua kasus dan cetak baris `nama | skor | kelas | kontrol`. Perhatikan `Skor prioritas klaim asuransi`: skor 9 = TINGGI, tetapi karena menyentuh data sensitif ia naik menjadi KRITIS — aturan yang sama yang mengangkat `Ringkasan keluhan` dari RENDAH ke SEDANG.",
        "Coba eksplorasi: apa yang terjadi pada kelas `Ringkasan keluhan nasabah` jika aturan data sensitif dihapus? Dan kasus mana yang paling dekat dengan batas kelas berikutnya (sensitif terhadap salah nilai D atau O)? Itulah mengapa penilaian D dan O harus dilakukan berdua — yang paham dampak dan yang paham otonomi.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `kelas_risiko(skor, sensitif)`" },
        { id: "t2", text: "Hitung `hasil_kelas` untuk keenam kasus" },
        { id: "t3", text: "Cetak tiap baris dengan format yang diminta" },
      ],
      expected: "RENDAH, SEDANG, KRITIS, TINGGI, RENDAH, KRITIS — skor klaim 9 + sensitif → KRITIS; auto-reject KPR: skor=16, KRITIS, kontrol: larang otonomi penuh + approval tertulis",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa menaikkan kelas untuk data sensitif — atau menaikkannya dua kali (untuk skor yang sudah KRITIS tidak perlu naik lagi). Aturannya: naik tepat 1 kelas, dengan batas atas KRITIS. Cek juga: `hasil_kelas` harus list of string, bukan list of tuple — karena check membandingkan dengan ==.",
      },
      hints: [
        "skor = dampak * otonomi; indeks dasar: skor<=4 → 0, <=8 → 1, <=12 → 2, selain itu 3.",
        "if sensitif and idx < 3: idx += 1 — lalu KELAS[idx].",
        "hasil_kelas = [kelas untuk tiap kasus, berurutan seperti KASUS].",
      ],
      code: {
        starter: `# Tabel use case: (nama, dampak 1-4, otonomi 1-4, data_sensitif)
KASUS = [
    ("Chatbot FAQ produk (publik)", 1, 3, False),
    ("Ringkasan keluhan nasabah", 2, 2, True),
    ("Skor prioritas klaim asuransi", 3, 3, True),
    ("Draft surat keputusan kredit", 4, 2, True),
    ("Terjemah dokumen internal", 2, 1, False),
    ("Auto-reject pengajuan KPR", 4, 4, True),
]

KELAS = ["RENDAH", "SEDANG", "TINGGI", "KRITIS"]
KONTROL = {
    "RENDAH": "log dasar",
    "SEDANG": "log + review sampel 10%",
    "TINGGI": "masking data + human review",
    "KRITIS": "larang otonomi penuh + approval tertulis",
}

# TULIS KODEMU: fungsi kelas_risiko(skor, sensitif) -> kelas
def kelas_risiko(skor, sensitif):
    return None

hasil_kelas = []
for nama, dampak, otonomi, sensitif in KASUS:
    skor = dampak * otonomi
    hasil_kelas.append(kelas_risiko(skor, sensitif))

for (nama, dampak, otonomi, sensitif), kelas in zip(KASUS, hasil_kelas):
    skor = dampak * otonomi
    print(f"{nama} | skor={skor} | {kelas} | kontrol: {KONTROL[kelas]}")`,
        lockLines: 18,
        solution: `# Tabel use case: (nama, dampak 1-4, otonomi 1-4, data_sensitif)
KASUS = [
    ("Chatbot FAQ produk (publik)", 1, 3, False),
    ("Ringkasan keluhan nasabah", 2, 2, True),
    ("Skor prioritas klaim asuransi", 3, 3, True),
    ("Draft surat keputusan kredit", 4, 2, True),
    ("Terjemah dokumen internal", 2, 1, False),
    ("Auto-reject pengajuan KPR", 4, 4, True),
]

KELAS = ["RENDAH", "SEDANG", "TINGGI", "KRITIS"]
KONTROL = {
    "RENDAH": "log dasar",
    "SEDANG": "log + review sampel 10%",
    "TINGGI": "masking data + human review",
    "KRITIS": "larang otonomi penuh + approval tertulis",
}

# TULIS KODEMU: fungsi kelas_risiko(skor, sensitif) -> kelas
def kelas_risiko(skor, sensitif):
    if skor <= 4:
        idx = 0
    elif skor <= 8:
        idx = 1
    elif skor <= 12:
        idx = 2
    else:
        idx = 3
    if sensitif and idx < 3:
        idx += 1
    return KELAS[idx]

hasil_kelas = []
for nama, dampak, otonomi, sensitif in KASUS:
    skor = dampak * otonomi
    hasil_kelas.append(kelas_risiko(skor, sensitif))

for (nama, dampak, otonomi, sensitif), kelas in zip(KASUS, hasil_kelas):
    skor = dampak * otonomi
    print(f"{nama} | skor={skor} | {kelas} | kontrol: {KONTROL[kelas]}")`,
        checks: [
          { kind: "defined", task: "t1", name: "kelas_risiko", label: "fungsi `kelas_risiko` terdefinisi", msg: "Definisikan fungsi kelas_risiko(skor, sensitif)." },
          { kind: "equal", task: "t2", name: "hasil_kelas", value: ["RENDAH", "SEDANG", "KRITIS", "TINGGI", "RENDAH", "KRITIS"], label: "`hasil_kelas` sesuai keenam kasus", msg: "Skor: 3,4,9,8,2,16 → kelas dasar RENDAH,RENDAH,TINGGI,SEDANG,RENDAH,KRITIS; data sensitif menaikkan kasus 2, 3, dan 4 satu kelas (maks KRITIS)." },
          { kind: "stdout_matches", task: "t3", pattern: "Auto-reject pengajuan KPR \\| skor=16 \\| KRITIS", label: "baris auto-reject KPR tercetak benar", msg: "Format: nama | skor=... | KELAS | kontrol: ..." },
          { kind: "stdout_matches", task: "t3", pattern: "kontrol: larang otonomi penuh", label: "kontrol KRITIS tercetak", msg: "Ambil kontrol dari dict KONTROL dengan kelas sebagai kunci." },
        ],
      },
      reference: "Skor = D × O; sensitif naik 1 kelas; kontrol sebanding dari dict.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Lima situasi governance",
      prose: [
        "Satu: karyawan menempel data nasabah ke chatbot API publik → hentikan pemakaian, ganti ke endpoint yang disetujui (atau self-host), ingatkan kebijakan, catat sebagai near-miss. Dua: unit bisnis mau deploy chatbot baru → daftarkan dulu (10 menit), klasifikasikan risiko, terapkan kontrol sesuai kelas SEBELUM go-live. Tiga: vendor AI meminta akses data produksi untuk `meningkatkan model` → tolak akses mentah; tawarkan data agregat/anonymize + perjanjian pemrosesan data tertulis.",
        "Empat: model di-upgrade ke versi mayor → picu re-review: uji ulang golden set, cek perubahan perilaku pada kasus berdampak, perbarui registri. Lima: log lama ditemukan berisi PII di luar masa retensi → purge sesuai kebijakan, catat insiden kepatuhan, perbaiki job retensi agar tidak terulang.",
        "Aturan praktis 10 detik: `tidak terdaftar → daftarkan; tidak diklasifikasi → klasifikasikan; berubah besar → re-review; ada data sensitif → naikkan kontrol satu tingkat`. Empat kalimat ini menyelesaikan 80% dilema governance sehari-hari.",
      ],
      figure: {
        svg: GOV_PIPELINE_SVG,
        alt: "Pipeline governance: daftar (inventaris), nilai (klasifikasi risiko), kontrol (sebanding), audit (re-review berkala).",
        caption: "Cara membaca: empat kotak dari kiri ke kanan = urutan wajib; panah tidak bisa dibalik. Interpretasi: setiap jalan pintas (langsung pasang kontrol tanpa klasifikasi, atau audit tanpa inventaris) menghasilkan aturan yang tidak tahu harus mengatur siapa — persis seperti 14 chatbot bayangan NusaBank.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: governance = melarang inovasi",
        type: "pitfall",
        body: "Yang benar: governance yang baik mempercepat yang berisiko rendah (daftar 10 menit, langsung jalan dengan kontrol ringan) dan hanya memperlambat yang berisiko tinggi — itulah intinya. Yang melarang semua = birokrasi; yang mengizinkan semua = bayangan. Klasifikasi risiko adalah pembedanya.",
      },
      reference: "Tidak terdaftar → daftarkan. Berubah besar → re-review. Sensitif → naikkan kontrol.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Audit NusaBank: 14 bayangan, 3 menyentuh rekening",
      prose: [
        "Hasil audit lengkap: 14 sistem tak terdaftar. Tiga di antaranya rutin menerima data rekening dalam prompt (kelas KRITIS setelah dinilai). Rata-rata tiap bot melayani 40 percakapan/hari; dalam 30 hari ≈ 16.800 percakapan tanpa logging dan tanpa review. Estimasi biaya pendaftaran + review awal: 14 × 8 jam × Rp250.000 = Rp28.000.000 — sekali bayar, versus eksposur yang berjalan tiap hari.",
        "Rencana 30 hari tim governance: minggu 1 — daftarkan semua 14 (amankan dulu yang 3 KRITIS: matikan akses data rekening, alihkan ke endpoint disetujui); minggu 2 — klasifikasikan 11 sisanya dan terapkan kontrol per kelas; minggu 3 — tetapkan kebijakan data + retensi log; minggu 4 — umumkan registri self-service agar bayangan berikutnya mendaftar sendiri.",
        "Pertanyaan analisis: (a) mengapa 3 yang menyentuh rekening ditangani duluan, bukan yang paling banyak dipakai? (b) rancang kriteria `perubahan besar` yang memicu re-review dalam 2 kalimat. (c) apa risiko dari respons `matikan semua 14 sekarang juga`, dan apa alternatif yang lebih baik?",
        "Pembahasan: (a) karena kelas risiko (KRITIS: D=4 data keuangan × otonomi) mengalahkan volume pemakaian — chatbot FAQ dengan 1.000 percakapan/hari tetap RENDAH. Prioritas = risiko, bukan popularitas. (b) contoh: `ganti model/provider, menambah jenis data yang diakses, atau mengubah tingkat otonomi (mis. draf menjadi kirim otomatis)`. (c) mematikan semua tanpa pengganti = unit bisnis membangun bayangan baru yang lebih tersembunyi; alternatifnya: amankan yang kritis, daftarkan sisanya, beri jalur resmi yang mudah.",
      ],
      tasks: [
        { id: "t1", text: "Urutkan 14 sistem ke rencana 4 minggu berdasarkan kelas risiko" },
        { id: "t2", text: "Tulis kriteria perubahan besar versimu (2 kalimat)" },
      ],
      expected: "minggu 1: 3 KRITIS diamankan; minggu 2: klasifikasi + kontrol 11 sisanya; kriteria: ganti model/provider, tambah jenis data, ubah otonomi.",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Eksposur = jumlah sistem tak terdaftar × percakapan tanpa logging × hari. Metrik governance yang bisa dilaporkan ke direksi: `sistem terdaftar (%)`, `sistem KRITIS tanpa kontrol lengkap (0 target)`, dan `waktu dari perubahan besar ke re-review`. Tanpa angka, governance = ceramah.",
      },
      reference: "Prioritas = kelas risiko, bukan volume. Amankan kritis, daftarkan sisanya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Yang tidak terdaftar tidak bisa diatur — inventaris murah & self-service adalah langkah pertama.",
        "R = Dampak × Otonomi; data sensitif naik 1 kelas; kontrol sebanding per kelas.",
        "Kebijakan data: klasifikasi + larangan eksplisit + retensi log yang bisa di-purge.",
        "UU PDP (prinsip umum), konteks keuangan (penjelasan + sanggahan + jejak), AI Act berjenjang — detailnya libatkan legal.",
        "Pemicu re-review: ganti model/provider, tambah jenis data, ubah otonomi.",
        "Governance yang baik mempercepat yang ringan, memperlambat yang berat — bukan melarang semua.",
      ],
      next: { label: "LLMOps18 — Agent Ops: Mengoperasikan Agen LLM", href: "/v2/learn/llmops18-agent-ops" },
      quiz: [
        {
          q: "Audit menemukan 14 chatbot tak terdaftar. Langkah governance PERTAMA yang benar?",
          options: [
            { text: "Matikan semuanya sekarang juga", why: "Tanpa pengganti resmi, unit bisnis membangun bayangan baru yang lebih tersembunyi." },
            { text: "Daftarkan semuanya ke registri, amankan dulu yang menyentuh data sensitif", why: "Tepat: inventaris dulu (langkah 1 pipeline), prioritas = kelas risiko. Yang kritis diamankan, sisanya diklasifikasikan.", correct: true },
            { text: "Minta legal menyusun kebijakan 50 halaman dulu", why: "Kebijakan tanpa tahu harus mengatur siapa = dokumen. Daftar dulu, tulis aturan kemudian." },
            { text: "Ganti semua ke model yang lebih aman", why: "Modelnya bukan masalah — ketidakterdaftaranlah masalahnya." },
          ],
        },
        {
          q: "Use case: draf surat keputusan kredit (D=4, O=2) dengan data nasabah. Kelasnya?",
          options: [
            { text: "SEDANG — skor 8, tidak perlu penyesuaian", why: "Skor 8 = SEDANG, tapi data sensitif menaikkan satu kelas." },
            { text: "TINGGI — skor 8 = SEDANG, data sensitif naik 1 kelas", why: "Tepat: 4×2=8 → SEDANG; data nasabah menaikkan menjadi TINGGI (masking + human review).", correct: true },
            { text: "KRITIS — karena menyentuh kredit", why: "KRITIS butuh skor 13–16 (atau naik dari TINGGI). Di sini 8 → TINGGI, bukan KRITIS." },
            { text: "RENDAH — karena masih berupa draf", why: "Draf (O=2) memang menurunkan otonomi, tapi D=4 (keputusan kredit) membuat skor 8 = SEDANG minimum." },
          ],
        },
        {
          q: "Karyawan menempel data rekening ke chatbot API publik. Respons yang benar?",
          options: [
            { text: "Biarkan — datanya sudah terkirim, tidak bisa diapa-apakan", why: "Pasrah bukan respons; hentikan pemakaian dan cegah pengulangan." },
            { text: "Hentikan pemakaian, alihkan ke endpoint disetujui, ingatkan kebijakan, catat near-miss", why: "Tepat: mitigasi (hentikan) + pencegahan (endpoint resmi + edukasi) + pembelajaran (catat).", correct: true },
            { text: "Pecat karyawan tersebut sebagai efek jera", why: "Ia melanggar karena tidak tahu ada larangan — kegagalan kebijakan, bukan (hanya) kegagalan individu." },
            { text: "Minta vendor menghapus datanya dan anggap selesai", why: "Tidak bisa memverifikasi penghapusan di pihak ketiga tanpa perjanjian — dan tidak mencegah pengulangan." },
          ],
        },
        {
          q: "Manakah yang BUKAN prinsip umum UU PDP?",
          options: [
            { text: "Pengumpulan data dibatasi pada yang diperlukan (minimisasi)", why: "Ini prinsip umum yang benar — kumpulkan seperlunya." },
            { text: "Data boleh dipakai untuk tujuan apa pun setelah dikumpulkan", why: "Tepat sebagai jawaban: ini MELANGGAR prinsip tujuan terbatas — data hanya boleh dipakai sesuai tujuan pengumpulannya.", correct: true },
            { text: "Subjek data punya hak akses dan penghapusan", why: "Ini prinsip umum yang benar — hak subjek data." },
            { text: "Data pribadi harus diamankan dari akses tak sah", why: "Ini prinsip umum yang benar — keamanan data." },
          ],
        },
        {
          q: "Kapan sebuah sistem LLM wajib di-re-review?",
          options: [
            { text: "Setiap ada update kecil prompt (typo, contoh)", why: "Perubahan kosmetik tidak mengubah profil risiko — mewajibkan review untuk typo = birokrasi." },
            { text: "Saat ganti model/provider, tambah jenis data, atau ubah tingkat otonomi", why: "Tepat: inilah `perubahan besar` — ketiganya mengubah skor risiko atau permukaan kepatuhan.", correct: true },
            { text: "Hanya saat ada insiden", why: "Re-review reaktif = governance yang selalu terlambat satu insiden." },
            { text: "Setiap hari Senin pagi", why: "Jadwal kaku tanpa pemicu = buang waktu untuk sistem yang tidak berubah." },
          ],
        },
        {
          q: "Mengapa `kontrol yang sama untuk semua sistem` adalah kebijakan buruk?",
          options: [
            { text: "Karena mahal", why: "Biaya memang naik, tapi itu bukan inti masalahnya." },
            { text: "Karena membunuh yang ringan (orang cari jalan pintas → bayangan baru) dan tidak cukup untuk yang berat", why: "Tepat: kontrol seragam = teater untuk FAQ publik sekaligus under-control untuk keputusan kredit otomatis. Proporsionalitas adalah inti klasifikasi risiko.", correct: true },
            { text: "Karena auditor tidak suka", why: "Auditor justru sering meminta keseragaman semu — argumennya harus substantif, bukan soal selera auditor." },
            { text: "Karena sulit ditulis", why: "Menulisnya mudah; menjalankannya yang gagal di dua ujung spektrum." },
          ],
        },
      ],
    },
  ],
};
