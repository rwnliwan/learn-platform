import type { V2Lesson } from "../lib/types";

export const mlops24: V2Lesson = {
  slug: "mlops24-validasi-data-tfx",
  track: "MLOps",
  module: "Data & Pipeline",
  title: "MLOps24 — Validasi Data & Skema TFX: Gerbang Pertama Pipeline",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang retrain dengan kolom yang hilang — dan tidak ada yang tahu",
      prose: [
        "Pipeline training DompetKu berjalan tiap malam. Suatu pagi, skor fraud turun 11 poin tanpa satu baris kode pun berubah. Investigasi menemukan upstream menghapus kolom 'tenor_pinjaman' dan mengubah 'gaji' dari rupiah menjadi ribuan rupiah — tanpa memberi tahu siapa pun. Model tetap training, tetap deploy, tetap memberi skor — atas data yang sudah berubah arti. Kerugian: 3 hari skor salah sebelum ada yang sadar.",
        "Validasi data adalah gerbang pertama pipeline: sebelum training, data diperiksa terhadap SKEMA — kontrak yang menyatakan kolom apa, tipe apa, rentang apa, dan distribusi seperti apa yang diharapkan. TFX (TensorFlow Extended) dengan TFDV (TensorFlow Data Validation) adalah implementasi standarnya: skema disimpulkan dari data referensi, lalu tiap batch baru diperiksa terhadap skema itu — anomali diblokir sebelum mencapai training.",
        "Lesson ini mengajarkan validasi data sebagai sistem: skema, anomali, dan drift yang diukur PSI. Setelah lesson ini kamu bisa: (1) menjelaskan skema TFX dan tiga jenis anomalinya; (2) menghitung PSI dan menafsirkan ambangnya; (3) membedakan drift, skew, dan anomali skema; (4) merancang gerbang validasi yang memblokir batch buruk; (5) memutuskan kapan skema boleh berevolusi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MLOps5 mengajarkan validasi skema sebagai satu gerbang CI/CD dan MLOps23 menyebut task validate di DAG Airflow — tetapi tidak ada lesson tentang validasi data sebagai sistem (TFX/TFDV, inferensi skema, anomali, PSI). Lesson ini membangunnya: dari skema sebagai kontrak sampai PSI sebagai pengukur drift, dengan lab yang menghitung PSI dari distribusi nyata.",
      },
      reference: "PSI fitur A 0,0412 (aman); PSI fitur B 0,3758 (drift kritis); 1 kolom hilang dari 12 (8,3 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, data buruk tidak pernah lagi mencapai training tanpa ketahuan.",
        "(1) Menjelaskan skema TFX: kolom, tipe, rentang, dan domain nilai;",
        "(2) Menghitung PSI dan menafsirkan ambang 0,1 dan 0,25;",
        "(3) Membedakan anomali skema, train-serve skew, dan drift;",
        "(4) Merancang gerbang: blokir, peringatkan, atau loloskan batch;",
        "(5) Menjelaskan evolusi skema yang aman (versioning + approval).",
      ],
      tasks: [],
    },
    {
      id: "skema-tfx",
      eyebrow: "Langkah 3 · Teori",
      title: "Skema TFX: kontrak data yang bisa dieksekusi",
      prose: [
        "Skema TFX mendeskripsikan tiap fitur: nama, tipe (int, float, string, bytes), kehadiran (wajib/opsional), domain nilai (misalnya 'pekerjaan' hanya boleh dari 8 kategori), dan rentang (umur 17-70, gaji di atas 0). Skema pertama disimpulkan otomatis dari data referensi (TFDV menganalisis 100 ribu baris dan menulis skemanya), lalu DIKUNCI dan di-review manusia — inferensi otomatis adalah draf, bukan vonis.",
        "Tiga jenis anomali yang ditangkap. Pertama, anomali skema: kolom hilang (1 dari 12 kolom = 8,3 persen skema rusak), kolom baru yang tidak dikenal, tipe berubah (string menjadi int). Kedua, anomali nilai: nilai di luar domain (pekerjaan 'astronot'), di luar rentang (umur -5). Ketiga, anomali distribusi: proporsi nilai berubah drastis — di sinilah PSI masuk.",
        "Gerbang validasi punya tiga vonis: BLOKIR (skema rusak — kolom hilang, tipe berubah — batch tidak boleh training), PERINGATKAN (distribusi bergeser sedang — training jalan tetapi alert ke manusia), LOLOS (semua dalam ambang). Aturan defaultnya: anomali skema pada kolom WAJIB atau kolom yang dipakai model = blokir; tidak ada 'training dulu, periksa belakangan'. Tetapi 'anomali skema SELALU blokir' tanpa kualifikasi itu terlalu mutlak: kolom OPSIONAL baru yang tidak dipakai model, atau nilai kategori baru yang sah, bukan alasan blokir otomatis — mereka masuk jalur evolusi skema (Skenario 4) dengan review manusia. Yang selalu diblokir adalah kerusakan struktur yang membuat training tidak bisa dipercaya — kolom wajib hilang, tipe berubah pada fitur yang dipakai. Model yang dilatih di atas skema rusak adalah model yang skornya tidak bisa dipercaya — dan kamu tidak akan tahu sampai nasabah komplain.",
      ],
      tasks: [],
      note: {
        title: "Skema adalah API antara tim",
        body: "Upstream yang mengubah kolom tanpa memberi tahu adalah pelanggaran kontrak — sama seperti mengubah API tanpa versioning. Skema TFX membuat kontrak itu eksplisit dan bisa dieksekusi: perubahan upstream yang melanggar skema gagal di gerbang, bukan di produksi. Tim data yang tidak punya skema tidak punya kontrak; ia punya harapan.",
      },
      reference: "1 kolom hilang dari 12 = 8,3 persen — BLOKIR.",
    },
    {
      id: "psi",
      eyebrow: "Langkah 4 · Teori",
      title: "PSI: mengukur seberapa jauh distribusi bergeser",
      prose: [
        "Population Stability Index (PSI) mengukur pergeseran distribusi: PSI = jumlah atas semua bin dari (aktual - ekspektasi) x ln(aktual / ekspektasi). Ambang standar industri: di bawah 0,1 = stabil; 0,1-0,25 = bergeser, periksa; di atas 0,25 = drift signifikan, selidiki sebelum training.",
        "Hitung dua fitur. Fitur A (ekspektasi [0,5; 0,3; 0,2], aktual [0,4; 0,35; 0,25]): (0,4-0,5) x ln(0,8) = 0,0223; (0,35-0,3) x ln(1,1667) = 0,0077; (0,25-0,2) x ln(1,25) = 0,0112; total PSI = 0,0412 — di bawah 0,1, stabil. Fitur B (ekspektasi [0,6; 0,4], aktual [0,3; 0,7]): (0,3-0,6) x ln(0,5) = 0,2079; (0,7-0,4) x ln(1,75) = 0,1679; total PSI = 0,3758 — di atas 0,25, drift kritis. Fitur B inilah yang menjelaskan penurunan skor: distribusinya berubah total, bukan sedikit.",
        "Bedakan tiga hal: drift (distribusi berubah seiring waktu — populasi berubah), train-serve skew (training dan serving melihat distribusi berbeda — bug pipeline, misalnya fitur dihitung berbeda di kedua jalur), dan anomali skema (struktur berubah — kolom hilang). PSI mendeteksi dua yang pertama; skema mendeteksi yang ketiga. Ketiganya butuh respons berbeda: drift = retrain atau adaptasi; skew = perbaiki pipeline; anomali skema = blokir dan panggil upstream.",
        "Satu jebakan hitung PSI: bin dengan proporsi NOL. Bila satu bin punya ekspektasi 0 atau aktual 0, rumus memuat ln(0) atau pembagian nol — PSI tidak terdefinisi. Praktik standarnya: smoothing — ganti 0 dengan nilai kecil (misalnya 0,0001) dan normalisasi ulang — atau gabungkan bin yang kosong dengan tetangganya. Tanpa penanganan ini, satu bin kosong membuat seluruh perhitungan PSI gagal tepat saat drift paling parah (bin yang dulu berisi kini kosong adalah sinyal drift yang paling kuat). TFDV menangani ini di balik layar; bila menghitung PSI sendiri, tangani nol secara eksplisit.",
      ],
      tasks: [],
      formula: "\\mathrm{PSI} = \\sum_i (A_i - E_i) \\cdot \\ln\\!\\left(\\frac{A_i}{E_i}\\right)",
      formulaNote: "A = proporsi aktual per bin; E = proporsi ekspektasi (referensi). Di bawah 0,1 stabil; 0,1-0,25 periksa; di atas 0,25 drift signifikan.",
      note: {
        title: "PSI butuh bin yang sama",
        body: "PSI hanya valid bila bin ekspektasi dan aktual SAMA — batas bin ditentukan dari data referensi, lalu dipakai untuk keduanya. Bila bin dihitung ulang dari data aktual, PSI akan selalu kecil karena bin mengikuti pergeseran. Kesalahan ini membuat drift tidak terdeteksi — dan laporan 'PSI aman' menjadi kebohongan yang rapi.",
      },
      reference: "PSI A 0,0412 (stabil); PSI B 0,3758 (drift kritis).",
    },
    {
      id: "lab-tfx",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: PSI dan vonis gerbang validasi",
      prose: [
        "Lab ini menghitung mesin validasi data dari angka mentah: PSI dua fitur dan vonis gerbang atas skema yang rusak.",
        "Hitung dulu di kepala. PSI fitur A: 0,0223 + 0,0077 + 0,0112 = 0,0412 — di bawah 0,1, stabil (vonis 0 = lolos). PSI fitur B: 0,2079 + 0,1679 = 0,3758 — di atas 0,25, drift kritis (vonis 2 = blokir). Kolom hilang: 1 dari 12 = 8,3 persen — anomali skema, blokir.",
        "Tugas lab: hitung empat angka dan cetak masing-masing di baris sendiri: psi_a, psi_b, kolom_hilang_persen, blokir (1 bila ada anomali skema ATAU PSI di atas 0,25; 0 bila tidak). Empat angka ini adalah vonis gerbang — dengan ini batch buruk tidak pernah mencapai training.",
        "Setelah lolos, coba eksperimen: ubah aktual fitur B menjadi [0,5; 0,5] dan lihat PSI menjadi 0,0405 — kembali ke zona STABIL (di bawah 0,1), bukan zona periksa: (0,5−0,6)×ln(0,5/0,6) + (0,5−0,4)×ln(0,5/0,4) = 0,0182 + 0,0223 = 0,0405. Lalu tanyakan: siapa yang memeriksa, dan berapa lama ia boleh menunda training?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `psi_a` dari ekspektasi [0,5; 0,3; 0,2] vs aktual [0,4; 0,35; 0,25]" },
        { id: "t2", text: "Hitung `psi_b` dari ekspektasi [0,6; 0,4] vs aktual [0,3; 0,7]" },
        { id: "t3", text: "Hitung `kolom_hilang_persen` dan vonis `blokir`" },
      ],
      expected: "psi_a=0.0412\npsi_b=0.3758\nkolom_hilang_persen=8.3\nblokir=1",
      hints: [
        "PSI = jumlah (aktual - ekspektasi) x ln(aktual / ekspektasi); pakai math.log.",
        "Bulatkan PSI ke 4 desimal, persen ke 1 desimal.",
        "Blokir = 1 bila kolom hilang lebih dari 0 ATAU psi_b di atas 0,25.",
      ],
      code: {
        starter: `# Mesin validasi data: PSI + vonis gerbang.\nimport math\n\nexp_a = [0.5, 0.3, 0.2]\nact_a = [0.4, 0.35, 0.25]\nexp_b = [0.6, 0.4]\nact_b = [0.3, 0.7]\nkolom_hilang, kolom_total = 1, 12\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\npsi_a = \npsi_b = \nkolom_hilang_persen = \nblokir = \n\nprint(f"psi_a={round(psi_a, 4)}")\nprint(f"psi_b={round(psi_b, 4)}")\nprint(f"kolom_hilang_persen={round(kolom_hilang_persen, 1)}")\nprint(f"blokir={blokir}")`,
        lockLines: 6,
        solution: `# Mesin validasi data: PSI + vonis gerbang.\nimport math\n\nexp_a = [0.5, 0.3, 0.2]\nact_a = [0.4, 0.35, 0.25]\nexp_b = [0.6, 0.4]\nact_b = [0.3, 0.7]\nkolom_hilang, kolom_total = 1, 12\n\n\ndef psi(exp, act):\n    return sum((a - e) * math.log(a / e) for e, a in zip(exp, act))\n\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\npsi_a = psi(exp_a, act_a)\npsi_b = psi(exp_b, act_b)\nkolom_hilang_persen = kolom_hilang / kolom_total * 100\nblokir = 1 if (kolom_hilang > 0 or psi_b > 0.25) else 0\n\nprint(f"psi_a={round(psi_a, 4)}")\nprint(f"psi_b={round(psi_b, 4)}")\nprint(f"kolom_hilang_persen={round(kolom_hilang_persen, 1)}")\nprint(f"blokir={blokir}")`,
        checks: [
          { kind: "equal", task: "t1", name: "psi_a", value: 0.0412, tol: 0.0001, label: "`psi_a` seharusnya 0.0412", msg: "0,0223+0,0077+0,0112 = 0,0412 — stabil." },
          { kind: "equal", task: "t2", name: "psi_b", value: 0.3758, tol: 0.0001, label: "`psi_b` seharusnya 0.3758", msg: "0,2079+0,1679 = 0,3758 — drift kritis." },
          { kind: "equal", task: "t3", name: "kolom_hilang_persen", value: 8.3, tol: 0.1, label: "`kolom_hilang_persen` seharusnya 8.3", msg: "1/12 = 8,3 persen." },
          { kind: "equal", task: "t3", name: "blokir", value: 1, tol: 1e-9, label: "`blokir` seharusnya 1", msg: "Kolom hilang + PSI kritis = blokir." },
        ],
      },
      reference: "PSI A 0,0412; PSI B 0,3758; kolom hilang 8,3 persen; vonis BLOKIR.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: blokir, peringatkan, atau loloskan",
      prose: [
        "Skenario 1 — Kolom hilang atau tipe berubah. → BLOKIR. Alasan: struktur rusak; training di atasnya tidak bisa dipercaya.",
        "Skenario 2 — PSI di atas 0,25 pada fitur penting. → BLOKIR training, selidiki. Alasan: distribusi berubah total; model lama mungkin sudah tidak relevan — tetapi training baru di atas data yang bergeser juga butuh manusia yang memahami pergeserannya.",
        "Skenario 3 — PSI 0,1-0,25. → PERINGATKAN, training jalan. Alasan: pergeseran sedang; catat, alert ke pemilik data, dan pantau batch berikutnya.",
        "Skenario 4 — Nilai baru dalam domain (kategori baru yang sah, misalnya pekerjaan baru). → Evolusi skema: tambah ke domain dengan approval manusia + versioning skema. Alasan: skema yang tidak bisa berevolusi akan memblokir perubahan bisnis yang sah.",
        "Skenario 5 — PSI di bawah 0,1, skema utuh. → LOLOS. Alasan: gerbang yang memblokir segalanya akan di-bypass; gerbang yang hanya memblokir yang rusak akan dihormati.",
        "Aturan praktis: skema berversi seperti kode (v1, v2, ...), perubahan skema butuh approval, dan setiap blokir mencatat alasan + pemilik + tenggat. Gerbang tanpa pemilik adalah gerbang yang akan dibuka paksa saat deadline.",
      ],
      tasks: [],
      note: {
        title: "Validasi di dua tempat",
        body: "Validasi training (batch) dan validasi serving (request live) adalah DUA gerbang yang berbeda. Data yang lolos training bisa tetap rusak saat serving — misalnya fitur dihitung berbeda di jalur serving (train-serve skew). TFX memvalidasi batch; validasi serving butuh pemeriksaan request live terhadap skema yang sama. Satu skema, dua gerbang.",
      },
      reference: "BLOKIR untuk skema rusak/PSI kritis; PERINGATKAN untuk PSI sedang; LOLOS bila stabil.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Skema TFX: kolom, tipe, rentang, domain — kontrak yang bisa dieksekusi.",
        "PSI A 0,0412 (stabil); PSI B 0,3758 (drift kritis, di atas 0,25).",
        "Kolom hilang 1 dari 12 = 8,3 persen — BLOKIR.",
        "Drift vs skew vs anomali skema: respons berbeda untuk tiap jenis.",
        "Evolusi skema butuh approval + versioning.",
      ],
      next: { label: "MLOps25 — Edge ML Deployment: Model di 50.000 Perangkat", href: "/v2/learn/mlops25-edge-ml-deployment" },
      quiz: [
        {
          q: "PSI fitur B = 0,3758. Apa vonisnya?",
          options: [
            { text: "Drift kritis — di atas 0,25, selidiki sebelum training", why: "Tepat: ambang 0,25 adalah batas drift signifikan.", correct: true },
            { text: "Stabil — di bawah 0,5", why: "Salah: ambang stabil adalah 0,1; 0,3758 jauh di atasnya." },
            { text: "Perlu diperiksa — zona 0,1-0,25", why: "Salah: 0,3758 sudah melewati zona periksa ke zona kritis." },
            { text: "Tidak bisa diputuskan tanpa melihat fitur A", why: "Salah: PSI dinilai per fitur; fitur B kritis apa pun nilai fitur A." },
          ],
        },
        {
          q: "Upstream menghapus 1 dari 12 kolom. Apa vonis gerbang?",
          options: [
            { text: "Lolos — 11 kolom masih cukup", why: "Salah: anomali skema selalu blokir; model yang dilatih tanpa kolom itu skornya tidak bisa dipercaya." },
            { text: "BLOKIR — anomali skema", why: "Tepat: kolom hilang = struktur rusak = blokir. (Kualifikasi: ini untuk kolom wajib/yang dipakai model — kolom opsional baru masuk jalur evolusi skema.)", correct: true },
            { text: "Peringatkan saja — training bisa jalan dengan imputasi", why: "Salah: imputasi kolom yang hilang total adalah fabrikasi; gerbang tidak boleh menebak." },
            { text: "Tunggu batch berikutnya — mungkin kolomnya kembali", why: "Salah: menunggu berarti training jalan di atas data rusak sementara itu." },
          ],
        },
        {
          q: "Apa perbedaan drift dan train-serve skew?",
          options: [
            { text: "Tidak ada — keduanya sama", why: "Salah: drift = distribusi berubah seiring waktu; skew = training dan serving melihat distribusi berbeda karena bug pipeline." },
            { text: "Drift berubah seiring waktu; skew adalah perbedaan training vs serving karena bug pipeline", why: "Tepat: responsnya berbeda — drift butuh retrain/adaptasi, skew butuh perbaikan pipeline.", correct: true },
            { text: "Drift hanya terjadi di training; skew hanya di serving", why: "Salah: drift bisa terjadi di mana saja distribusi berubah; skew spesifik pada kesenjangan dua jalur." },
            { text: "Skew diukur PSI; drift tidak bisa diukur", why: "Salah: PSI mengukur keduanya — yang berbeda adalah penyebab dan responsnya." },
          ],
        },
        {
          q: "Mengapa bin PSI harus ditentukan dari data referensi dan dipakai untuk keduanya?",
          options: [
            { text: "Agar komputasi lebih cepat", why: "Salah: bukan soal kecepatan — soal validitas pengukuran." },
            { text: "Bila bin dihitung ulang dari data aktual, PSI selalu kecil dan drift tidak terdeteksi", why: "Tepat: bin yang mengikuti pergeseran menyembunyikan pergeseran itu.", correct: true },
            { text: "Agar PSI selalu di bawah 0,1", why: "Salah: tujuannya pengukuran jujur, bukan angka yang bagus." },
            { text: "Tidak ada alasan — bin boleh dihitung ulang", why: "Salah: itu kesalahan klasik yang membuat laporan 'PSI aman' menjadi kebohongan." },
          ],
        },
        {
          q: "Kategori baru yang sah muncul (pekerjaan baru). Apa yang benar?",
          options: [
            { text: "Blokir selamanya — skema tidak boleh berubah", why: "Salah: skema yang tidak bisa berevolusi memblokir perubahan bisnis yang sah." },
            { text: "Evolusi skema: tambah ke domain dengan approval manusia + versioning", why: "Tepat: perubahan skema adalah keputusan, bukan kecelakaan.", correct: true },
            { text: "Biarkan lolos diam-diam tanpa mencatat", why: "Salah: perubahan tanpa catatan menghancurkan audit dan reproduksibilitas." },
            { text: "Hapus kategori baru dari data", why: "Salah: membuang data yang sah merusak representasi populasi." },
          ],
        },
      ],
    },
  ],
};
