import type { V2Lesson } from "../lib/types";

export const cr23: V2Lesson = {
  slug: "cr23-regulasi-indonesia",
  track: "Credit Risk",
  module: "Regulasi & Fairness",
  title: "CR23 — Regulasi Indonesia",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tinta kegagalan bank",
      prose: [
        "1998: bank-bank menyalurkan triliunan ke grup usahanya sendiri, modal tipis, pengawasan longgar. Ketika krisis datang, puluhan bank runtuh bersama — dan rakyat membayar lewat BLBI.",
        "Pelajaran itu melahirkan OJK (2011) dan seperangkat rambu: BMPK (batas konsentrasi), KPMM (bantalan modal), kolektibilitas (standar kualitas aset), SLIK (mata bersama).",
        "Hari ini, analis kredit Bank Nusantara hendak ACC kredit Rp 900 M ke PT Maju — perusahaan milik komisaris bank. Tanpa BMPK, ini \"bisnis biasa\". Dengan BMPK: ini pelanggaran hukum jika melebihi 10% modal. Rambu yang dulu tidak ada di 1998, kini menyelamatkan bank dari dirinya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Banyak analis menganggap regulasi = \"birokrasi\". Padahal setiap pasal POJK ditulis dengan tinta kegagalan bank — ada yang bangkrut di balik tiap angka. Bacalah rambu seperti sejarah, bukan seperti hambatan.",
      },
      reference: "OJK seperti wasit sepak bola — analis yang baik bermain dengan wasit, bukan melawannya.",
    },
    {
      id: "ojk",
      eyebrow: "Langkah 2 · OJK",
      title: "Wasit perbankan",
      prose: [
        "OJK (Otoritas Jasa Keuangan) = pengawas bank sejak 2011 (sebelumnya Bank Indonesia). POJK = peraturan yang diterbitkan OJK — hukum bagi bank.",
        "POJK kunci risiko kredit: kualitas aset — standar kolektibilitas 1–5 & CKPN (CR2); BMPK — batas maksimum pemberian kredit per pihak (anti-konsentrasi); KPMM — kecukupan modal minimum (Basel III versi Indonesia); manajemen risiko — wajib ada satuan kerja manajemen risiko yang independen.",
        "POJK baru memperketat bobot risiko; KPMM bank turun 10,5%→9,3%. Langkah pertama yang benar: hitung dampak presisi per segmen + komunikasi proaktif ke OJK + rencana modal/rebalancing. Penyesuaian di awal murah, di akhir mahal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Regulasi hanya urusan compliance — analis kredit fokus bisnis.\" BMPK & KPMM menentukan apakah kredit boleh diberikan dan berapa banyak. Analis yang mengusulkan kredit melanggar BMPK = usulannya mati di meja (atau lebih buruk: lolos lalu jadi temuan OJK). Cek regulasi adalah langkah pertama analisis, bukan terakhir.",
      },
      reference: "Regulator menghargai bank yang siap; yang panik di tenggat membuat keputusan buruk.",
    },
    {
      id: "lab-bmpk",
      eyebrow: "Langkah 3 · Lab BMPK",
      title: "Kalkulator BMPK",
      prose: [
        "BMPK dihitung dari MODAL bank (bukan total kredit). Modal Rp 8000 M. Aturan terkunci: pihak terkait 10%; satu debitur (tidak terkait) 20%; satu grup (tidak terkait) 25%; BUMN pembangunan 30%. Rencana: PT Maju (terkait) Rp 900 M; PT Sejahtera (satu debitur) Rp 1500 M; Grup Sejahtera (grup) Rp 2200 M. Tugasmu: hitung batas tiap rencana dan tentukan pelanggarannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `maks_terkait` dan `maks_satu`" },
        { id: "t2", text: "Tentukan `langgar_terkait` dan `langgar_grup` (bool)" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "terkait=800 langgar=True satu=1600 grup langgar=True",
      hints: [
        "maks = modal_bank × persen aturan.",
        "maks_terkait = 8000 × 0.10.",
        "langgar = rencana > maks.",
      ],
      code: {
        starter: `modal_bank = 8000\naturan = {"terkait": 0.10, "satu": 0.20, "grup": 0.25}\nrencana_terkait, rencana_satu, rencana_grup = 900, 1500, 2200\n\n# TULIS KODEMU\nmaks_terkait = \nmaks_satu = \nlanggar_terkait = \nlanggar_grup = \n\nprint(f"terkait={maks_terkait:.0f} langgar={langgar_terkait} satu={maks_satu:.0f} grup_langgar={langgar_grup}")`,
        lockLines: 3,
        solution: `modal_bank = 8000\naturan = {"terkait": 0.10, "satu": 0.20, "grup": 0.25}\nrencana_terkait, rencana_satu, rencana_grup = 900, 1500, 2200\n\n# TULIS KODEMU\nmaks_terkait = modal_bank * aturan["terkait"]\nmaks_satu = modal_bank * aturan["satu"]\nlanggar_terkait = rencana_terkait > maks_terkait\nlanggar_grup = rencana_grup > modal_bank * aturan["grup"]\n\nprint(f"terkait={maks_terkait:.0f} langgar={langgar_terkait} satu={maks_satu:.0f} grup_langgar={langgar_grup}")`,
        checks: [
          { kind: "equal", task: "t1", name: "maks_terkait", value: 800, tol: 1e-9, label: "`maks_terkait` seharusnya 800", msg: "8000 × 10% = 800." },
          { kind: "equal", task: "t1", name: "maks_satu", value: 1600, tol: 1e-9, label: "`maks_satu` seharusnya 1600", msg: "8000 × 20% = 1600." },
          { kind: "equal", task: "t2", name: "langgar_terkait", value: true, label: "`langgar_terkait` = True", msg: "900 > 800 — kredit ke perusahaan komisaris = pelanggaran!" },
          { kind: "equal", task: "t2", name: "langgar_grup", value: true, label: "`langgar_grup` = True", msg: "2200 > 2000 — melanggar juga." },
          { kind: "stdout_matches", task: "t3", pattern: "terkait=800\\s+langgar=True\\s+satu=1600\\s+grup_langgar=True", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Bank modal Rp 10 T → maksimal ke satu debitur tidak terkait = 20% × 10 T = Rp 2 T.",
    },
    {
      id: "bmpk-detail",
      eyebrow: "Langkah 4 · BMPK",
      title: "Jangan taruh semua telur",
      prose: [
        "BMPK (Batas Maksimum Pemberian Kredit) = plafon kredit ke satu pihak/grup sebagai % modal bank. Pihak terkait paling ketat (10%) — konflik kepentingan = risiko moral tertinggi. Pelajaran 1998: kredit ke grup sendiri adalah jalur favorit pengurasan bank. Analis WAJIB cek status \"terkait/tidak\" sebelum ACC — salah klasifikasi = pelanggaran.",
        "RM mengusulkan memecah kredit Rp 190 M ke 4 anak perusahaan satu grup (direksi & pemegang saham sama) agar \"di bawah BMPK\": TOLAK — single obligor: pengendalian bersama = satu pihak untuk BMPK; ini pelanggaran dengan sanksi OJK. Single obligor melihat pengendalian ekonomi, bukan badan hukum. Solusi benar: kecilkan plafon atau sindikasi.",
        "BMPK dihitung dari modal, bukan dari total kredit. Artinya: bank kecil tidak bisa memberi kredit jumbo — bukan karena tidak mau, melainkan karena dilarang. Inilah mengapa bank kecil fokus UMKM: regulasi membentuk strategi bisnis.",
      ],
      tasks: [],
      reference: "BMPK lolos tetapi KPMM mepet dan analisis 5C dikorbankan? Regulasi = batas MINIMUM, bukan standar ideal.",
    },
    {
      id: "lab-kpmm",
      eyebrow: "Langkah 5 · Lab KPMM",
      title: "Berapa kredit bisa tumbuh?",
      prose: [
        "KPMM = modal / ATMR. Data terkunci: modal Rp 8000 M, ATMR saat ini Rp 50.000 M, bobot rata-rata portofolio baru 0,75, target KPMM 14%. Tugasmu: hitung KPMM saat ini, ATMR maksimum, dan kredit baru maksimum.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kpmm_skrg` (%) dan `atmr_maks`" },
        { id: "t2", text: "Hitung `kredit_baru_maks`" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "KPMM=16.0 ATMRmaks=57142.9 baru=9523.8",
      hints: [
        "kpmm_skrg = modal / atmr_saat_ini * 100.",
        "atmr_maks = modal / (target/100).",
        "kredit_baru_maks = (atmr_maks − atmr_saat_ini) / bobot.",
      ],
      code: {
        starter: `modal, atmr_saat_ini = 8000, 50000\nbobot_rata2, target_kpmm = 0.75, 14.0\n\n# TULIS KODEMU\nkpmm_skrg = \natmr_maks = \nkredit_baru_maks = \n\nprint(f"KPMM={kpmm_skrg:.1f} ATMRmaks={atmr_maks:.1f} baru={kredit_baru_maks:.1f}")`,
        lockLines: 2,
        solution: `modal, atmr_saat_ini = 8000, 50000\nbobot_rata2, target_kpmm = 0.75, 14.0\n\n# TULIS KODEMU\nkpmm_skrg = modal / atmr_saat_ini * 100\natmr_maks = modal / (target_kpmm / 100)\nkredit_baru_maks = (atmr_maks - atmr_saat_ini) / bobot_rata2\n\nprint(f"KPMM={kpmm_skrg:.1f} ATMRmaks={atmr_maks:.1f} baru={kredit_baru_maks:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kpmm_skrg", value: 16.0, tol: 0.01, label: "`kpmm_skrg` seharusnya 16.0", msg: "8000 / 50000 × 100 = 16.0." },
          { kind: "equal", task: "t1", name: "atmr_maks", value: 57142.86, tol: 1.0, label: "`atmr_maks` sekitar 57142.9", msg: "8000 / 0.14 = 57142.9." },
          { kind: "equal", task: "t2", name: "kredit_baru_maks", value: 9523.81, tol: 1.0, label: "`kredit_baru_maks` sekitar 9523.8", msg: "(57142.9 − 50000) / 0.75 = 9523.8." },
          { kind: "stdout_matches", task: "t3", pattern: "KPMM=16\\.0\\s+ATMRmaks=57142\\.9\\s+baru=9523\\.8", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "KPMM adalah REM pertumbuhan — modal membatasi ambisi. Bobot naik → ruang tumbuh menyusut.",
    },
    {
      id: "slik",
      eyebrow: "Langkah 6 · SLIK",
      title: "Mata dan ijazah",
      prose: [
        "SLIK (Sistem Layanan Informasi Keuangan, dulu BI Checking) = database kredit nasional OJK. Tiap bank wajib lapor dan boleh cek riwayat kredit calon debitur di semua bank. Skor SLIK 1–5 = kolektibilitas terburuk di sistem. Aturan praktis: SLIK 3+ di bank lain = tolak otomatis (atau verifikasi mendalam). Calon debitur \"bersih\" di bankmu tetapi macet di 3 bank lain = terlihat di SLIK. Inilah mengapa \"pindah bank untuk kabur dari utang\" tidak berhasil.",
        "BSMR (Badan Sertifikasi Manajemen Risiko) = lembaga sertifikasi profesi risiko Indonesia. Sertifikasi BSMR level 1–5 adalah kredensial standar industri — banyak lowongan Credit Risk Analyst mencantumkan \"BSMR preferred/diutamakan\". Level 1 = dasar (cocok untuk analis junior); level 4–5 = enterprise risk (direksi). Materi ujiannya = persis topik track ini (risiko kredit, regulasi, PSAK 109).",
        "KPMM 16%, target internal 14%, rencana ekspansi menurunkan ke 13,5%: tahan/batasi — melanggar target INTERNAL (14%). Target internal adalah komitmen ke komisaris, bukan angka hiasan. Menurunkannya agar \"lolos\" = manipulasi ambang.",
      ],
      tasks: [],
      reference: "Industri konsisten 2–3× lipat di atas minimum 8% — perbankan Indonesia sangat capitalized (pelajaran 1998 tidak dilupakan).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: menavigasi rambu OJK",
      prose: [
        "Skenario 1 — Kredit ke perusahaan milik komisaris bank. → Cek status pihak TERKAIT dulu: BMPK 10% modal — paling ketat karena konflik kepentingan = risiko moral tertinggi. Contoh nyata: Rp 900 M ke PT Maju (terkait) dengan modal Rp 8 T → 11,25% = pelanggaran. Tanpa BMPK, ini 'bisnis biasa'; dengan BMPK, ini pelanggaran hukum.",
        "Skenario 2 — RM mengusulkan memecah Rp 190 M ke 4 anak perusahaan satu grup agar 'di bawah BMPK'. → TOLAK: single obligor — pengendalian bersama = satu pihak untuk BMPK, apapun badan hukumnya. Solusi benar: kecilkan plafon atau sindikasi.",
        "Skenario 3 — Rencana ekspansi agresif ('kredit kilat Rp 10 T'). → Hitung KPMM pasca-ATMR dan batasi bertahap: Rp 10 T baru → KPMM 16% → ~13% (mepet target 14%). Setuju bersyarat: tahap 1 Rp 5 T, tahap 2 setelah tambah modal. Dan proses 3 hari hanya untuk rating A + agunan penuh + SLIK bersih — kecepatan tanpa standar = BLBI jilid 2.",
        "Skenario 4 — Laporan tanggal 30 terlihat patuh (NPL 2,8%). → Curigai window dressing: cek arus 3 hari sebelum–sesudah tanggal laporan, waspadai evergreening (kredit baru Rp 210 M untuk melunasi kredit macet Rp 200 M). Baca jejak, bukan foto — angka tanggal 30 berbohong.",
        "Skenario 5 — Calon debitur 'bersih' di bankmu. → Cek SLIK: SLIK 3+ di bank lain = tolak otomatis / verifikasi mendalam. 'Pindah bank untuk kabur dari utang' tidak berhasil — SLIK adalah mata bersama.",
        "Aturan praktis 10 detik: regulasi hanya sekuat kejujuran laporannya — cek terkait-tidaknya pihak SEBELUM ACC; BMPK dari modal (bukan total kredit); dan ingat BMPK = lantai hukum, bukan vonis aman.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "'Lolos BMPK = aman.' Kredit kilat Rp 1 T per debitur lolos BMPK 20% — tetapi 10 debitur × Rp 1 T menekan KPMM ke ~13%, proses 3 hari mengorbankan analisis 5C, dan HHI melonjak. Tiga rambu lain berkedip merah sementara satu rambu hijau dirayakan. Rambu hukum adalah minimum — bukan kesimpulan.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Kredit kilat yang menabrak rambu",
      prose: [
        "Direksi Bank Nusantara ingin \"kredit kilat korporasi\": plafon Rp 1 T per debitur, proses 3 hari, target Rp 10 T dalam setahun. Modal bank Rp 8 T. Kamu diminta pendapat risiko. BMPK satu debitur tidak terkait = 20% × 8 T = Rp 1,6 T — plafon Rp 1 T lolos BMPK. Tetapi: 10 debitur × Rp 1 T = Rp 10 T baru; ATMR naik ~Rp 10 T → KPMM turun dari 16% ke ~13% — mepet target internal 14%!; proses 3 hari = analisis 5C dikorbankan; konsentrasi: 10 debitur = 12,5% modal per nama — HHI melonjak (CR15).",
        "Setuju bersyarat — BMPK lolos, tetapi tiga rambu lain berkedip: (1) KPMM: batasi tahap 1 = Rp 5 T (KPMM tetap ≥14%), tahap 2 setelah tambah modal / laba ditahan. (2) Proses: 3 hari hanya untuk rating A dengan agunan penuh + SLIK bersih; sisanya ikut proses normal. Kecepatan tanpa standar = BLBI jilid 2. (3) Konsentrasi: maks 5% modal per nama untuk program kilat (lebih ketat dari BMPK) + diversifikasi sektor wajib.",
        "Pelajaran: BMPK lolos ≠ aman. Regulasi adalah batas minimum, bukan standar ideal — bank yang baik menetapkan rambu internal lebih ketat dari OJK.",
      ],
      tasks: [],
      reference: "OJK menetapkan lantai, bukan langit-langit. Risk appetite internal harus lebih konservatif.",
    },
    {
      id: "window-dressing",
      eyebrow: "Langkah 9 · Trik laporan",
      title: "Laporan yang berdandan",
      prose: [
        "Regulasi hanya sekuat kejujuran laporannya — dan di sinilah analis perlu mengenal trik-trik yang membuat angka terlihat patuh padahal tidak. Trik pertama: window dressing. Bank wajib lapor posisi akhir bulan ke OJK (termasuk NPL, BMPK, KPMM). Beberapa bank \"mendandani\" laporannya: kredit bermasalah Rp 500 miliar dialihkan sementara ke perusahaan afiliasi tiga hari sebelum tanggal laporan, lalu dibeli kembali seminggu sesudahnya. Di atas kertas tanggal 30: NPL 2,8% (di bawah 3% — aman!). Kenyataan tanggal 5: NPL 4,1%. Trik kedua: evergreening — kredit macet Rp 200 miliar \"diselamatkan\" dengan memberikan kredit baru Rp 210 miliar kepada debitur yang sama (atau afiliasinya) untuk melunasi yang lama. Di laporan: kolektibilitas 1, lancar! Di realitas: debitur yang sama, utang yang membesar, kemampuan bayar yang tidak berubah. Trik ketiga lebih halus: restrukturisasi kosmetik — mengubah jadwal angsuran (grace period 12 bulan) agar status kolektibilitas kembali 1, tanpa analisis kemampuan bayar yang sesungguhnya. Ketiganya punya kesamaan: mengubah LAPORAN tanpa mengubah RISIKO.",
        "Bagaimana analis (atau auditor, atau OJK) menangkapnya? Dengan membaca JEJAK, bukan foto. Empat pola yang patut dicurigai. Pertama, pola \"akhir bulan\": pelunasan besar yang selalu terjadi 2–3 hari sebelum tanggal laporan, lalu pencairan baru 5–7 hari sesudahnya — ke debitur yang sama atau terafiliasi. Satu kali = kebetulan; tiga bulan berturut-turut = pola. Kedua, mutasi antar-bank di SLIK: debitur dilunasi di Bank A bulan ini, muncul sebagai debitur baru di Bank B bulan depan dengan plafon mirip — klasik \"lempar macet\". SLIK membuat trik ini terlihat — itulah gunanya \"mata bersama\" (langkah 6). Ketiga, pertumbuhan kredit yang tidak masuk akal: cabang yang NPL-nya selalu tepat di bawah 3% sementara penyalurannya tumbuh 40% per tahun — kombinasi yang secara statistik hampir mustahil tanpa bantuan \"dandanan\". Keempat, rasio restrukturisasi: jika >15% portofolio adalah kredit restrukturisasi, tanyakan berapa persen yang benar-benar pulih vs yang direstrukturisasi ulang (re-restrukturisasi = evergreening berbaju resmi).",
        "Aturan keputusan untuk analis kredit — karena kamulah garis pertahanan pertama, bukan OJK. Pertama, saat menganalisis debitur, SELALU tarik SLIK 24 bulan (bukan 12): pola lempar-melempar antar bank terlihat di horizon panjang. Debitur yang \"bersih 12 bulan\" tetapi punya riwayat kolek 4 delapan belas bulan lalu di dua bank berbeda = bendera merah berkibar. Kedua, untuk kredit korporasi besar, minta mutasi rekening 6 bulan — bukan hanya laporan keuangan: arus kas tidak bisa berdandan; pola \"masuk besar akhir bulan dari afiliasi, keluar awal bulan\" terbaca di mutasi. Ketiga, jika kamu menemukan indikasi window dressing di bankmu sendiri — laporkan ke satuan kerja manajemen risiko atau audit internal. Ini bukan \"melaporkan teman\"; POJK mewajibkan whistleblowing channel dan melindunginya. Analis yang menutup mata terhadap dandanan laporan sedang menandatangani kebohongan — dan ketika OJK menemukannya (mereka punya data seluruh sistem untuk pembanding — bankmu tidak bisa berdandan sendirian tanpa terlihat aneh dibanding rata-rata industri), yang ditanya pertama adalah analis yang mengusulkan. Integritas analis (tema capstone) dimulai dari menolak ikut mendandani angka.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: Baca jejak, bukan foto — angka tanggal 30 berbohong, arus kas tidak",
        body: "Laporan keuangan dan laporan OJK adalah FOTO: satu titik waktu yang bisa dipozekan. Analis amatir menilai dari fotonya (\"NPL 2,8%, bagus!\"). Analis profesional menilai dari FILMnya: bagaimana angka itu bergerak antar tanggal laporan. Heuristiknya: setiap kali sebuah metrik terlihat \"terlalu pas\" — NPL 2,9% (tepat di bawah 3%), BMPK 19,8% (tepat di bawah 20%), KPMM 8,1% (tepat di atas 8%) — curigai dandanan sampai terbukti sebaliknya. Alam tidak menghasilkan angka yang rapi; kerapian yang mencurigakan adalah tanda tangan manusia. Tanda paling cepat: minta data HARIAN atau MINGGUAN di sekitar tanggal laporan, bukan hanya posisi akhir bulan. Foto bisa dipozekan; film 30 hari jauh lebih sulit dipalsukan — pola \"pelunasan tanggal 28, pencairan tanggal 5\" hanya terlihat di film. Dan ingat: SLIK adalah kamera pengawas yang tidak bisa dimatikan — debitur yang \"bersih\" di bankmu tetapi punya jejak di bank lain akan terlihat. Analis yang malas menarik SLIK 24 bulan sedang memilih untuk tidak melihat — dan \"tidak melihat\" bukan pembelaan saat OJK bertanya.",
      },
      reference: "Foto bisa dipozekan; film 30 hari tidak. SLIK 24 bulan, mutasi 6 bulan.",
    },
    {
      id: "bank-kecil",
      eyebrow: "Langkah 10 · Bank kecil, strategi besar",
      title: "Regulasi membentuk strategi",
      prose: [
        "Langkah BMPK menyebut sekilas: bank kecil tidak bisa memberi kredit jumbo — regulasi membentuk strategi bisnis. Mari hitung implikasinya sampai tuntas, karena inilah cara membaca peta persaingan perbankan Indonesia. Bank Perkreditan Rakyat (BPR) \"Maju Bersama\": modal Rp 150 miliar. BMPK satu debitur tidak terkait = 20% × 150 miliar = Rp 30 miliar. Artinya: kredit terbesar yang BOLEH diberikan ke satu nasabah = Rp 30 miliar — plafon korporasi menengah pun tidak bisa dilayani. Pilihan strategisnya otomatis menyempit: UMKM, mikro, konsumtif. Bukan karena direkturnya \"tidak berani main korporasi\" — melainkan karena hukum melarang. Bandingkan Bank Umum \"Nusantara\": modal Rp 8 triliun → BMPK satu debitur Rp 1,6 triliun — bisa melayani konglomerat. Inilah mengapa struktur perbankan Indonesia berlapis: bank besar melayani korporasi (skala + BMPK memungkinkan), BPR melayani mikro-UMKM (BMPK memaksa fokus). Regulasi bukan hanya rambu — ia adalah arsitek pasar.",
        "Contoh paling terang: KUR (Kredit Usaha Rakyat). Suku bunga KUR 6% per tahun — jauh di bawah bunga komersial mikro (20–30%). Mengapa bank mau? Karena pemerintah mensubsidi selisihnya + menjamin 70–80% via Jamkrindo/Askrindo. Untuk BPR/bank kecil, KUR adalah anugerah strategis: plafon KUR mikro Rp 100 juta, KUR kecil Rp 500 juta — pas dengan BMPK mereka; risiko dijamin negara; volume besar. Bank \"Maju Bersama\" menyalurkan Rp 400 miliar KUR ke 6.000 debitur mikro: rata-rata Rp 67 juta per debitur — 450x lipat di bawah BMPK Rp 30 miliar. Diversifikasi ekstrem = risiko konsentrasi nol. NPL KUR 3–4% tertutup subsidi + penjaminan. Inilah strategi yang DIBENTUK regulasi: BMPK kecil + program pemerintah = mesin penyaluran mikro yang sehat. Cara salah memahami ini: \"BPR itu bank kelas dua yang tidak bisa main korporasi.\" Cara benar: BPR adalah spesialis yang dilindungi regulasi dari godaan bermain di liga yang bukan ukurannya — dan justru di situlah keunggulannya: mereka mengenal debitur mikro yang bank besar tidak bisa layani secara ekonomis (biaya akuisisi Rp 2 juta per debitur mikro tidak masuk akal untuk bank dengan overhead korporasi).",
        "Aturan keputusan untuk analis yang bekerja di bank kecil — atau yang menganalisisnya. Pertama, jangan menilai bank kecil dengan metrik bank besar: NIM 8% di BPR bukan \"tidak efisien\" — ia adalah harga wajar kredit mikro (bandingkan dengan NIM 5% bank korporasi yang risikonya beda dunia). Kedua, pahami batas tumbuhnya: bank modal Rp 150 miliar dengan ATMR Rp 900 miliar → KPMM 16,7%; setiap Rp 100 miliar ekspansi menurunkan KPMM ~1,7 poin — ruang tumbuhnya terbatas; pertumbuhan 30% per tahun tanpa tambah modal = KPMM jebol dalam 2 tahun. Analis yang merekomendasikan \"genjot penyaluran 40%\" tanpa menghitung KPMM sedang menulis resep pelanggaran. Ketiga, untuk karirmu: analis kredit di bank kecil justru mendapat eksposur LEBIH luas — kamu menangani 500 debitur UMKM setahun (vs 20 korporasi di bank besar), belajar membaca karakter, arus kas warung, dan musim panen — keterampilan yang tidak diajarkan di menara gading korporasi. Regulasi membentuk strategi bank; strategi bank membentuk analisnya. Pilihlah tempat yang membentukmu menjadi analis yang kamu inginkan.",
      ],
      tasks: [],
      reference: "BMPK = arsitek pasar. Bank kecil = spesialis mikro, bukan bank kelas dua.",
    },
    {
      id: "kolek",
      eyebrow: "Langkah 11 · Kolektibilitas",
      title: "Lima kotak nasib kredit",
      prose: [
        "Langkah OJK menyebut kolektibilitas 1–5 sekilas sebagai \"standar kualitas aset\". Padahal lima kotak ini adalah bahasa sehari-hari seluruh industri — dan analis yang tidak fasih akan tersesat di setiap rapat. Definisinya berdasarkan DPD (days past due): Kolek 1 (Lancar): DPD 0 — bayar tepat waktu. Kolek 2 (Dalam Perhatian Khusus/DPK): DPD 1–90 hari — mulai batuk. Kolek 3 (Kurang Lancar): DPD 91–120 hari. Kolek 4 (Diragukan): DPD 121–180 hari. Kolek 5 (Macet): DPD >180 hari — koma. NPL = kolek 3+4+5. Contoh portofolio Rp 10 triliun: kolek 1 Rp 9,2 T (92%), kolek 2 Rp 400 M (4%), kolek 3 Rp 150 M (1,5%), kolek 4 Rp 100 M (1%), kolek 5 Rp 150 M (1,5%) → NPL = (150+100+150)/10.000 = 4,0%. Di atas ambang psikologis 3% — lampu kuning menyala di OJK.",
        "Lima kotak ini bukan sekadar label — masing-masing memicu CKPN (cadangan kerugian) dengan tarif pembentukan: kolek 1 → 1%, kolek 2 → 5%, kolek 3 → 15%, kolek 4 → 50%, kolek 5 → 100%. Hitung untuk portofolio di atas: 9.200×1% + 400×5% + 150×15% + 100×50% + 150×100% = 92 + 20 + 22,5 + 50 + 150 = Rp 334,5 miliar CKPN. Perhatikan lompatannya: Rp 150 miliar di kolek 3 \"hanya\" butuh Rp 22,5 miliar cadangan, tetapi Rp 150 miliar yang sama di kolek 5 butuh Rp 150 miliar penuh. Setiap migrasi kotak = biaya cadangan yang melonjak — inilah insentif ekonomi untuk bertindak di kolek 2, bukan menunggu kolek 5. Cara salah yang umum: \"kolek 2 kan belum NPL, masih aman.\" Cara benar: kolek 2 adalah RUANG OPERASI — satu-satunya kotak di mana intervensi masih murah (telepon, kunjungan, restrukturisasi ringan) sebelum biaya cadangan meledak 3x–20x lipat. Bank yang baik mengukur \"rasio migrasi kolek 1→2\" tiap bulan sebagai KRI utama; kenaikan tiga bulan berturut-turut = alarm dini yang lebih jujur daripada NPL itu sendiri (NPL adalah mayat, migrasi adalah gejala).",
        "Hubungan yang wajib dipahami: kolektibilitas adalah BAHASA REGULATOR (backward-looking, berdasarkan DPD yang sudah terjadi), sedangkan staging PSAK 109 adalah BAHASA AKUNTANSI (forward-looking, berdasarkan SICR). Keduanya harus dibaca bersamaan — dan ketidakcocokannya adalah sinyal. Contoh: debitur masih kolek 1 tetapi sudah Stage 2 (SICR terpicu DER 3,7x) = sistem peringatan dini bekerja dengan benar — akuntansi mendahului regulator. Sebaliknya: debitur kolek 3 tetapi masih Stage 1 = anomali berbahaya — DPD 100 hari tanpa SICR berarti pemicu staging-nya rusak atau dimanipulasi; auditor akan menandai ini pertama kali. Aturan keputusan: setiap bulan, tarik daftar \"mismatch\" — kolek ≥3 tetapi Stage 1, dan kolek 1 tetapi Stage 2/3. Daftar pertama = calon temuan audit; daftar kedua = validasi bahwa forward-looking-mu bekerja. Analis yang hanya membaca kolektibilitas sedang mengemudi sambil melihat kaca spion; analis yang membaca keduanya melihat spion DAN jalan di depan. Regulator menilai masa lalumu lewat kolektibilitas; pasar menilai masa depanmu lewat staging — kuasai kedua bahasanya.",
      ],
      tasks: [],
      reference: "Kolek 2 = ruang operasi. Mismatch kolek vs staging = daftar temuan audit.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "OJK (2011) = wasit; POJK = hukum. Setiap angka ditulis dengan tinta kegagalan bank.",
        "BMPK dari MODAL: terkait 10%, satu debitur 20%, satu grup 25%, BUMN pembangunan 30%.",
        "Single obligor = pengendalian ekonomi, bukan badan hukum.",
        "KPMM = modal/ATMR; target internal > minimum OJK; KPMM = rem pertumbuhan.",
        "SLIK 3+ di bank lain = tolak/verifikasi mendalam. Regulasi = minimum, bukan ideal.",
      ],
      next: { label: "CR24 — Fairness & Explainability", href: "/v2/learn/cr24-fairness-explainability" },
      quiz: [
        {
          q: "Bank modal Rp 10 T. Maksimal kredit ke satu debitur TIDAK terkait?",
          options: [
            { text: "Rp 1 T (10%)", why: "10% = pihak terkait." },
            { text: "Rp 2 T (20%)", why: "20% × 10 T = Rp 2 T. (25% untuk grup, 30% BUMN pembangunan, 10% pihak terkait.)", correct: true },
            { text: "Rp 2,5 T (25%)", why: "25% = satu grup." },
            { text: "Rp 3 T (30%)", why: "30% = BUMN pembangunan." },
          ],
        },
        {
          q: "Mengapa BMPK pihak terkait (10%) lebih ketat?",
          options: [
            { text: "Diskriminasi", why: "Bukan." },
            { text: "Konflik kepentingan: kredit ke grup sendiri adalah jalur favorit pengurasan bank (pelajaran 1998) — risiko moral tertinggi", why: "Setiap angka BMPK ditulis dengan tinta kegagalan bank.", correct: true },
            { text: "Agar bank kecil tidak tumbuh", why: "Bukan itu alasannya." },
            { text: "Tidak ada alasan", why: "Ada — 1998." },
          ],
        },
        {
          q: "KPMM 16%, target internal 14%, rencana ekspansi menurunkan ke 13,5%. Keputusan?",
          options: [
            { text: "Jalan terus — masih di atas 8%", why: "8% bukan patokan operasional." },
            { text: "Tahan/batasi: melanggar target INTERNAL (14%) — target internal adalah komitmen ke komisaris, bukan angka hiasan", why: "Menurunkannya agar 'lolos' = manipulasi ambang.", correct: true },
            { text: "Turunkan target jadi 12%", why: "Itu manipulasi ambang." },
            { text: "Tambah ATMR lagi", why: "Memperburuk KPMM." },
          ],
        },
        {
          q: "RM mengusulkan memecah kredit Rp 190 M ke 4 anak perusahaan satu grup (direksi & pemegang saham sama) agar 'di bawah BMPK'. Responsmu?",
          options: [
            { text: "Setuju — kan beda PT, efisien", why: "Single obligor melihat pengendalian ekonomi." },
            { text: "Tolak — single obligor: pengendalian bersama = satu pihak untuk BMPK; ini pelanggaran dengan sanksi OJK", why: "'Kreativitas' menghindari BMPK = pelanggaran = temuan OJK.", correct: true },
            { text: "Setuju asal dokumennya rapi", why: "Dokumen rapi tidak mengubah substansi." },
            { text: "Tanyakan ke direksi", why: "Analis harus bisa menolak sendiri." },
          ],
        },
        {
          q: "POJK baru memperketat bobot risiko; KPMM bank turun 10,5%→9,3%. Langkah pertama yang benar?",
          options: [
            { text: "Tunggu tenggat — masih di atas 8%", why: "Menunggu = panik di akhir." },
            { text: "Hitung dampak presisi per segmen + komunikasi proaktif ke OJK + rencana modal/rebalancing — penyesuaian di awal murah, di akhir mahal", why: "Regulator menghargai bank yang siap.", correct: true },
            { text: "Sembunyikan dari OJK", why: "Pelanggaran." },
            { text: "Naikkan bunga semua kredit", why: "Bukan respons yang tepat." },
          ],
        },
      ],
    },
  ],
};
