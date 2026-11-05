import type { V2Lesson } from "../lib/types";

// Pola ETL kecil untuk pelaporan: ekstrak → transformasi → validasi → muat,
// dengan logging di setiap tahap sehingga setiap angka bisa ditelusur balik.
const FIG_ETL = `<svg viewBox="0 0 520 250" role="img" aria-label="Pola ETL kecil: ekstrak, transformasi, validasi dengan gerbang lolos atau karantina, muat, dan log.">
<g font-family="var(--font-ui)" text-anchor="middle">
<defs><marker id="ah5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--chart-text)"/></marker></defs>
<g stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#ah5)">
<line x1="95" y1="55" x2="140" y2="55"/><line x1="240" y1="55" x2="285" y2="55"/>
<line x1="385" y1="55" x2="420" y2="55"/><line x1="330" y1="100" x2="330" y2="140"/>
</g>
<rect x="15" y="29" width="80" height="52" rx="8" fill="var(--c1)" opacity="0.9"/><text x="55" y="51" font-size="10" font-weight="700" fill="#fff">Ekstrak</text><text x="55" y="67" font-size="9" fill="#fff">sumber</text>
<rect x="144" y="29" width="92" height="52" rx="8" fill="var(--c2)" opacity="0.9"/><text x="190" y="51" font-size="10" font-weight="700" fill="#fff">Transfor-</text><text x="190" y="67" font-size="10" font-weight="700" fill="#fff">masi</text>
<rect x="289" y="29" width="92" height="52" rx="8" fill="var(--c3)" opacity="0.9"/><text x="335" y="51" font-size="10" font-weight="700" fill="#fff">Validasi</text><text x="335" y="67" font-size="9" fill="#fff">gerbang</text>
<rect x="424" y="29" width="80" height="52" rx="8" fill="var(--c4)" opacity="0.9"/><text x="464" y="51" font-size="10" font-weight="700" fill="#fff">Muat</text><text x="464" y="67" font-size="9" fill="#fff">laporan</text>
<rect x="270" y="145" width="120" height="52" rx="8" fill="none" stroke="var(--c1)" stroke-dasharray="6 4"/><text x="330" y="167" font-size="10" font-weight="700" fill="var(--chart-text)">Karantina</text><text x="330" y="183" font-size="9" fill="var(--text-muted)">telusur &amp; perbaiki</text>
<rect x="15" y="150" width="225" height="52" rx="8" fill="var(--c1)" opacity="0.25"/><text x="127" y="172" font-size="10" font-weight="700" fill="var(--chart-text)">Log setiap tahap</text><text x="127" y="188" font-size="9" fill="var(--text-muted)">waktu, jumlah baris, versi definisi</text>
<text x="260" y="228" font-size="12" fill="var(--chart-text)">Data yang gagal validasi tidak ikut dimuat — ia dikarantina.</text>
<text x="260" y="244" font-size="11" fill="var(--text-muted)">Laporan tanpa log = angka tanpa saksi.</text>
</g>
</svg>`;

export const rr31: V2Lesson = {
  slug: "rr31-python-risk-reporting",
  track: "Risk Reporting",
  module: "Otomasi Reporting",
  title: "RR31 — Python untuk Risk Reporting: Otomasi ETL & Rekonsiliasi",
  estMinutes: 70,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lesson ini tentang senjata paling hemat dalam pelaporan risiko modern: script Python kecil yang melakukan pekerjaan berulang dengan sempurna — mengekstrak data, mentransformasi, memvalidasi, dan merekonsiliasi angka laporan terhadap buku besar. Bukan pipeline raksasa; cukup script yang bisa dibaca satu layar. Isi lesson: (1) pola ETL kecil untuk reporting, (2) rekonsiliasi laporan vs sumber kebenaran — selisih, toleransi, dan break report, (3) lab: rekonsiliasi dua sumber data dan susun daftar break, (4) penjadwalan, logging, dan idempotensi batch.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan 4 tahap ETL kecil beserta fungsi validasi sebagai gerbang; (2) menghitung selisih rekonsiliasi dan memutuskan break vs dalam toleransi; (3) menulis script rekonsiliasi dua sumber data dengan break report; (4) menyebutkan 3 isi wajib log batch; (5) menjelaskan kenapa batch harus idempotent.",
      ],
      tasks: [],
      reference: "Otomasi yang baik = pekerjaan berulang yang hasilnya selalu bisa dijelaskan.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Selisih Rp25 juta yang bukan fraud",
      prose: [
        "Bimo, reporting analyst di sebuah bank digital, menghadapi pagi yang buruk. Angka KREDIT di laporan regulator: Rp8.500 juta. Angka KREDIT di laporan internal: Rp8.475 juta. Selisih Rp25 juta. Rapat darurat dipanggil. Pertanyaan pertama direksi: “Ada fraud?”",
        "Tiga jam investigasi kemudian, jawabannya: bukan fraud. Bukan salah hitung. Penyebabnya adalah TIMING. Job ETL laporan regulator berjalan pukul 17.00 dengan cut-off data 16.30; job laporan internal berjalan pukul 23.59 dengan cut-off 23.00. Di antara kedua cut-off itu, ada satu pelunasan Rp25 juta. Kedua angka BENAR pada waktunya masing-masing — tapi tidak ada yang mencatat cut-off-nya, sehingga selisihnya tampak seperti misteri.",
        "Twist-nya: masalah Bimo bukan angka yang salah, melainkan METADATA yang hilang. Rekonsiliasi yang baik tidak hanya membandingkan angka — ia membandingkan angka BESERTA konteksnya: cut-off, versi definisi, waktu ekstrak. Rp25 juta itu bukan temuan; ia adalah pelajaran Rp25 juta tentang pentingnya logging.",
      ],
      tasks: [],
      reference: "Bandingkan angka beserta konteksnya — bukan angkanya saja.",
    },
    {
      id: "etl",
      eyebrow: "Langkah 3 · ETL",
      title: "Pola ETL kecil: ekstrak, transformasi, validasi, muat",
      prose: [
        "ETL kecil punya 4 tahap. EKSTRAK: tarik data dari sumber (core banking, GL, file regulator) — catat WAKTU ekstrak dan cut-off data. TRANSFORMASI: ubah ke bentuk laporan — agregasi, mapping kode, konversi mata uang; definisinya harus merujuk kamus metrik yang berversi. VALIDASI: gerbang kualitas — cek kelengkapan (semua cabang masuk?), kewajaran (angka dalam rentang?), konsistensi (total = jumlah komponen?). Data yang gagal validasi TIDAK ikut dimuat — ia masuk KARANTINA untuk ditelusur. MUAT: tulis ke laporan final.",
        "Validasi sebagai gerbang adalah pembeda antara script asal jalan dan script pelaporan. Contoh aturan validasi: jumlah baris > 0 (ekstrak kosong = gagal, bukan nol), tidak ada ID duplikat, total aset = total liabilitas + ekuitas (identity check), dan tanggal cut-off = tanggal yang diharapkan (menangkap cerita Bimo).",
        "Setiap tahap menulis LOG: waktu mulai/selesai, jumlah baris masuk dan keluar, versi definisi yang dipakai, dan jumlah baris yang dikarantina. Log inilah yang 3 jam investigasi Bimo coba rekonstruksi dari ingatan — padahal seharusnya tertulis otomatis.",
      ],
      figure: {
        svg: FIG_ETL,
        alt: "Diagram pola ETL kecil dengan gerbang validasi, jalur karantina, dan logging.",
        caption: "Cara membaca: ikuti panah kiri ke kanan — ekstrak → transformasi → validasi (gerbang) → muat; panah bawah dari validasi menuju karantina untuk data yang gagal. Interpretasi: validasi bukan hiasan — ia memutuskan apa yang boleh masuk laporan dan apa yang wajib ditelusur.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Script sudah jalan tanpa error = datanya benar.” Jalan tanpa error hanya berarti sintaksnya benar. Data yang salah format, tidak lengkap, atau kedaluwarsa tetap “jalan” dengan sempurna — dan menghasilkan laporan yang salah dengan sempurna pula. Itulah gunanya gerbang validasi.",
        type: "pitfall",
      },
      reference: "Tanpa gerbang validasi, ETL hanyalah pipa — bukan kendali.",
    },
    {
      id: "rekonsiliasi",
      eyebrow: "Langkah 4 · Rekonsiliasi",
      title: "Rekonsiliasi: selisih, toleransi, break report",
      prose: [
        "Rekonsiliasi membandingkan dua sumber yang seharusnya sama: angka laporan regulator vs buku besar (GL), angka hari ini vs kemarin, angka sistem A vs sistem B. Rumusnya sederhana:",
      ],
      formula: String.raw`|\text{selisih}| = |\text{saldo laporan} - \text{saldo sumber}|`,
      formulaNote: "saldo laporan = angka yang akan/sudah dikirim; saldo sumber = buku besar atau sumber kebenaran lain. Nilai absolut dipakai karena arah selisih tidak penting untuk keputusan break — yang penting besarnya.",
      tasks: [],
    },
    {
      id: "rekonsiliasi2",
      eyebrow: "Langkah 5 · Toleransi",
      title: "Toleransi dan break report",
      prose: [
        "Tidak semua selisih adalah masalah. TOLERANSI adalah ambang yang disepakati: selisih di bawahnya dianggap noise operasional (pembulatan, timing), selisih di atasnya = BREAK yang wajib ditelusur. Menetapkan toleransi adalah keputusan bisnis, bukan teknis — Rp10 juta untuk bank besar bisa jadi noise, tapi untuk BPR bisa jadi temuan.",
        "BREAK REPORT adalah daftar semua break: rekening, saldo kedua sumber, selisih, umur break (sudah berapa hari belum selesai), dan pemilik tindak lanjut. Break report yang baik punya ATURAN UMUR: break yang hidup lebih dari N hari naik eskalasi. Break tanpa umur = break yang dilupakan.",
        "Kembali ke cerita Bimo: dengan rekonsiliasi + toleransi + log cut-off, investigasi 3 jam itu menjadi 3 menit. Break report akan menunjukkan: KREDIT selisih 25 > toleransi 10 → break; log menunjukkan cut-off berbeda → penyebab jelas; keputusan: selaraskan cut-off kedua job, bukan saling menyalahkan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Selisih kecil tidak usah dilaporkan — nanti juga hilang sendiri.” Selisih yang tidak tercatat tidak pernah “hilang sendiri”; ia menumpuk. Rp25 juta yang diabaikan bulan ini menjadi Rp300 juta yang tidak bisa dijelaskan saat akumulasi setahun. Toleransi memaafkan, tapi pencatatan tetap wajib.",
        type: "pitfall",
      },
      reference: "Toleransi memaafkan selisih — tapi tidak menghapus kewajiban mencatat.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: rekonsiliasi laporan vs buku besar",
      prose: [
        "Dua sumber saldo di bawah: `saldo_laporan` (yang akan dikirim ke regulator) dan `saldo_gl` (buku besar). Tugasmu: hitung selisih absolut per rekening, tentukan break (selisih > TOLERANSI), dan cetak break report mini.",
        "Data ini kecil — tapi polanya persis yang dipakai untuk ribuan rekening: bandingkan, saring dengan toleransi, laporkan yang break.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih`: dict selisih absolut per rekening antara `saldo_laporan` dan `saldo_gl`" },
        { id: "t2", text: "Tentukan `breaks`: list rekening dengan selisih > `TOLERANSI`; hitung `n_break` dan `total_selisih`" },
        { id: "t3", text: "Cetak break report dengan baris diawali `REKONSILIASI:`" },
      ],
      expected: "breaks = ['KREDIT'] — n_break = 1 | total_selisih = 25 — REKONSILIASI: 1 break (KREDIT, selisih 25) di atas toleransi 10",
      hints: [
        "Selisih absolut = abs(a - b). Bangun dict dulu, baru saring.",
        "Urutan breaks mengikuti urutan rekening di dict — deterministik, jadi ['KREDIT'] bukan ['KREDIT', ...] yang lain.",
      ],
      code: {
        starter: `# ── DATA KUNCI (JANGAN UBAH) ─────────────────────────────
saldo_laporan = {"KAS": 1200, "KREDIT": 8500, "DANA_PIHAK3": 9000, "MODAL": 1700}  # yang dikirim ke regulator
saldo_gl      = {"KAS": 1200, "KREDIT": 8475, "DANA_PIHAK3": 9000, "MODAL": 1700}  # buku besar
TOLERANSI = 10  # juta rupiah; selisih di atas ini = break

# ── TULIS KODEMU ─────────────────────────────────────────`,
        lockLines: 5,
        solution: `# ── DATA KUNCI (JANGAN UBAH) ─────────────────────────────
saldo_laporan = {"KAS": 1200, "KREDIT": 8500, "DANA_PIHAK3": 9000, "MODAL": 1700}  # yang dikirim ke regulator
saldo_gl      = {"KAS": 1200, "KREDIT": 8475, "DANA_PIHAK3": 9000, "MODAL": 1700}  # buku besar
TOLERANSI = 10  # juta rupiah; selisih di atas ini = break

# ── TULIS KODEMU ─────────────────────────────────────────
selisih = {k: abs(saldo_laporan[k] - saldo_gl[k]) for k in saldo_laporan}
breaks = [k for k in selisih if selisih[k] > TOLERANSI]
n_break = len(breaks)
total_selisih = sum(selisih.values())

print("breaks =", breaks)
print("n_break =", n_break, "| total_selisih =", total_selisih)
print("REKONSILIASI: 1 break (KREDIT, selisih 25) — di atas toleransi 10, wajib ditelusur")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih", value: { KAS: 0, KREDIT: 25, DANA_PIHAK3: 0, MODAL: 0 }, label: "`selisih` benar per rekening", msg: "Hanya KREDIT yang berselisih: |8500-8475| = 25." },
          { kind: "equal", task: "t2", name: "breaks", value: ["KREDIT"], label: "`breaks` = ['KREDIT']", msg: "25 > toleransi 10. Tiga rekening lain selisih 0." },
          { kind: "equal", task: "t2", name: "total_selisih", value: 25, label: "`total_selisih` = 25", msg: "Jumlah seluruh selisih absolut." },
          { kind: "stdout_matches", task: "t3", pattern: "REKONSILIASI:", label: "Break report tercetak", msg: "Baris laporan harus diawali persis 'REKONSILIASI:'." },
        ],
      },
      note: {
        title: "Sering salah",
        body: "“Rekonsiliasi = selisihnya nol.” Rekonsiliasi yang sehat justru SERING menemukan selisih — dan setiap selisih punya penjelasan tercatat (timing, pembulatan, definisi). Rekonsiliasi yang selalu nol tanpa satu pun break patut dicurigai: mungkin toleransinya terlalu longgar, atau bandingannya tidak pernah dijalankan.",
        type: "pitfall",
      },
      reference: "Break report = daftar selisih + umur + pemilik tindak lanjut.",
    },
    {
      id: "jadwal",
      eyebrow: "Langkah 7 · Operasional",
      title: "Penjadwalan, logging, dan idempotensi",
      prose: [
        "Batch pelaporan berjalan terjadwal — harian, mingguan, bulanan. Tiga aturan operasionalnya: (1) LOG WAJIB: setiap run mencatat waktu mulai/selesai, cut-off data, jumlah baris per tahap, versi definisi, dan jumlah baris karantina. Inilah yang menyelamatkan Bimo. (2) IDEMPOTENT: menjalankan batch dua kali atas data yang sama harus menghasilkan hasil yang sama — tidak ada duplikat, tidak ada angka ganda. Caranya: tulis dengan kunci unik (upsert), bukan append buta. (3) ALERT, bukan diam: batch yang gagal harus berteriak (notifikasi) — batch yang gagal diam-diam adalah bom waktu.",
        "Satu jebakan klasik: job yang “sukses” tapi mengekstrak 0 baris karena sumbernya sedang maintenance. Tanpa validasi jumlah baris > 0, laporan kosong terkirim sebagai “laporan nihil” — dan tidak ada yang sadar sampai regulator bertanya. Inilah kenapa validasi jumlah baris adalah aturan pertama di gerbang.",
      ],
      tasks: [],
      reference: "Batch yang baik: berlog, idempotent, dan berteriak saat gagal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: otomatisasi apa dulu?",
      prose: [
        "Skenario 1 — Pekerjaan berulang, aturan jelas, volume besar (ekstraksi harian, agregasi rutin): OTOMASI PENUH dengan ETL kecil + validasi + log. Inilah ROI tertinggi.",
        "Skenario 2 — Pekerjaan berulang tapi butuh judgment (klasifikasi transaksi mencurigakan): OTOMASI SEBAGIAN. Script menyaring dan mengusulkan; manusia memutuskan. Jangan pernah mengotomasi keputusan yang butuh akuntabilitas manusia.",
        "Skenario 3 — Pekerjaan sekali-sekali/ad-hoc: JANGAN OTOMASI. Script sekali pakai di notebook cukup. Membangun pipeline untuk pekerjaan tahunan = biaya tanpa manfaat.",
        "Skenario 4 — Selisih rekonsiliasi di atas toleransi: JANGAN OTOMASI PENJELASANNYA. Break report otomatis, investigasi manual. Script menemukan; manusia menjelaskan.",
        "Aturan praktis 10 detik: otomatisasi layak bila (1) frekuensinya ≥ mingguan, (2) aturannya bisa ditulis tanpa kata “biasanya”, dan (3) hasil salahnya bisa dideteksi validasi otomatis. Gagal satu syarat = tetap manual atau semi-otomatis.",
      ],
      tasks: [],
      reference: "Otomasi menemukan; manusia menjelaskan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: cut-off yang tidak tercatat",
      prose: [
        "Bank Wira menjalankan dua job: job regulator (cut-off 16.30, run 17.00) dan job internal (cut-off 23.00, run 23.59). Suatu hari: saldo KREDIT regulator Rp8.500 juta, internal Rp8.475 juta. Selisih Rp25 juta > toleransi Rp10 juta → break. Investigasi menemukan satu pelunasan Rp25 juta pukul 19.42 — setelah cut-off regulator, sebelum cut-off internal.",
        "Pertanyaan 1: sumber kebenaran mana yang “benar”? (Jawaban: keduanya benar pada cut-off masing-masing. Yang salah adalah ekspektasi bahwa keduanya harus sama tanpa menyamakan cut-off.)",
        "Pertanyaan 2: apa isi log yang akan membuat investigasi ini 3 menit, bukan 3 jam? (Jawaban: cut-off data, waktu ekstrak, jumlah baris, dan versi definisi di setiap run kedua job.)",
        "Pertanyaan 3: perbaikan permanennya apa? (Jawaban: selaraskan cut-off kedua job ATAU dokumentasikan perbedaan cut-off sebagai penjelasan baku di break report — pilih satu, catat, dan konsisten.)",
      ],
      tasks: [],
      reference: "Selisih tanpa konteks = misteri. Selisih dengan log = penjelasan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca alasannya bahkan untuk jawaban yang kamu pilih.",
      ],
      tasks: [],
      summary: [
        "ETL kecil: ekstrak (catat cut-off) → transformasi → validasi sebagai gerbang → muat; gagal validasi = karantina.",
        "Rekonsiliasi: |laporan − sumber|; di atas toleransi = break; break report berisi selisih + umur + pemilik.",
        "Toleransi = keputusan bisnis; pencatatan selisih tetap wajib walau di bawah toleransi.",
        "Batch: berlog lengkap, idempotent (upsert, bukan append), berteriak saat gagal; waspadai job “sukses” 0 baris.",
        "Otomasi untuk yang berulang & aturannya tegas; judgment dan penjelasan selisih tetap milik manusia.",
      ],
      next: {
        label: "RR32 — Excel Advanced untuk Risk Reporting",
        href: "/learn/rr32-excel-advanced-risiko",
      },
      quiz: [
        {
          q: "Job ETL selesai tanpa error tetapi laporan yang dihasilkan kosong (0 baris). Apa yang seharusnya terjadi?",
          options: [
            { text: "Kirim saja sebagai laporan nihil — sistem tidak error", why: "Salah dan berbahaya: 0 baris kemungkinan besar berarti sumber sedang maintenance, bukan benar-benar nihil.", correct: false },
            { text: "Gerbang validasi harus menggagalkan run: jumlah baris > 0 adalah aturan pertama", why: "Tepat: validasi jumlah baris menangkap 'sukses palsu' sebelum laporan kosong terkirim.", correct: true },
            { text: "Jalankan ulang berkali-kali sampai ada datanya", why: "Salah: mengulang tanpa diagnosis hanya mengulang kegagalan — cek dulu kenapa 0 baris.", correct: false },
            { text: "Isi manual dengan angka kemarin agar tidak kosong", why: "Salah total: mengarang data laporan = pelanggaran integritas.", correct: false },
          ],
        },
        {
          q: "Selisih rekonsiliasi Rp5 juta dengan toleransi Rp10 juta. Tindakan yang benar?",
          options: [
            { text: "Abaikan sepenuhnya — di bawah toleransi berarti tidak ada masalah", why: "Salah: toleransi memaafkan, tapi selisih tetap dicatat. Yang diabaikan hari ini menumpuk bulan depan.", correct: false },
            { text: "Catat selisihnya; tidak perlu eskalasi karena dalam toleransi", why: "Tepat: toleransi = tidak perlu investigasi, bukan tidak perlu pencatatan.", correct: true },
            { text: "Eskalasi ke direksi karena ada selisih", why: "Salah: eskalasi untuk break di atas toleransi. Eskalasi untuk noise = alarm fatigue.", correct: false },
            { text: "Ubah toleransi menjadi Rp4 juta agar selisihnya menjadi temuan", why: "Salah: toleransi adalah keputusan bisnis yang disepakati, bukan alat untuk 'menemukan' sesuatu.", correct: false },
          ],
        },
        {
          q: "Kenapa batch pelaporan harus idempotent?",
          options: [
            { text: "Agar berjalan lebih cepat", why: "Salah: idempotensi tidak berhubungan dengan kecepatan.", correct: false },
            { text: "Agar dijalankan ulang (retry) tidak menduplikasi data — hasil run kedua sama dengan pertama", why: "Tepat: retry adalah keniscayaan operasional; tanpa idempotensi, retry = angka ganda.", correct: true },
            { text: "Agar tidak perlu logging", why: "Salah: idempotensi dan logging adalah dua kebutuhan berbeda yang sama-sama wajib.", correct: false },
            { text: "Agar bisa dijalankan tanpa jadwal", why: "Salah: penjadwalan tetap diperlukan; idempotensi hanya menjamin keamanan pengulangan.", correct: false },
          ],
        },
        {
          q: "Dalam cerita Bimo, apa akar masalah sebenarnya dari selisih Rp25 juta?",
          options: [
            { text: "Ada fraud Rp25 juta yang belum terdeteksi", why: "Salah: investigasi membuktikan bukan fraud — ini jebakan pertama yang harus disingkirkan dengan data.", correct: false },
            { text: "Salah satu job salah hitung", why: "Salah: kedua job benar pada cut-off masing-masing.", correct: false },
            { text: "Cut-off data kedua job berbeda dan tidak tercatat di log", why: "Tepat: metadata yang hilang — bukan angka yang salah.", correct: true },
            { text: "Toleransi Rp10 juta terlalu kecil", why: "Salah: toleransi bekerja dengan benar — ia menangkap selisih dan memicu investigasi yang memang diperlukan.", correct: false },
          ],
        },
        {
          q: "Klasifikasi transaksi mencurigakan sebaiknya…",
          options: [
            { text: "Sepenuhnya diotomasi agar cepat dan konsisten", why: "Salah: keputusan yang butuh akuntabilitas manusia tidak boleh diserahkan penuh ke mesin.", correct: false },
            { text: "Semi-otomatis: script menyaring & mengusulkan, manusia memutuskan", why: "Tepat: skenario 2 peta keputusan — mesin untuk skala, manusia untuk judgment.", correct: true },
            { text: "Tetap manual sepenuhnya — mesin tidak boleh menyentuh", why: "Salah: volume transaksi modern membuat manual penuh tidak mungkin; saringan mesin justru menaikkan kualitas.", correct: false },
            { text: "Diserahkan ke vendor tanpa pengawasan", why: "Salah: akuntabilitas tetap di bank — vendor adalah alat, bukan pemilik keputusan.", correct: false },
          ],
        },
      ],
    },
  ],
};
