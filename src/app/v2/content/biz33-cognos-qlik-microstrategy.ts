import type { V2Lesson } from "../lib/types";

export const biz33: V2Lesson = {
  slug: "biz33-cognos-qlik-microstrategy",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI33 — Cognos, Qlik, dan MicroStrategy: Tiga Suite Enterprise di Luar Power BI",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga vendor, tiga demo memukau, satu keputusan yang tertunda setahun",
      prose: [
        "Bank Artha Dana mengevaluasi suite BI enterprise. Cognos memukau dengan pelaporan terjadwal yang rapi. Qlik memukau dengan asosiasi data yang responsif saat diklik. MicroStrategy memukau dengan distribusi mobile ke ribuan karyawan. Tiap demo sempurna — dan tiap tim pulang dengan favorit berbeda. Keputusan tertunda setahun karena tidak ada yang membandingkan ketiganya dengan ukuran yang sama.",
        "Masalahnya bukan kurangnya informasi, melainkan tidak adanya kerangka perbandingan: kekuatan tiap suite, harga total selama 3 tahun, dan kecocokan dengan kebutuhan bank. Demo vendor selalu memukau — demo dirancang untuk itu.",
        "Lesson ini mengajarkan tiga suite enterprise: Cognos, Qlik, dan MicroStrategy — kekuatan, kelemahan, dan TCO-nya. Setelah lesson ini kamu bisa: (1) menjelaskan kekuatan khas tiap suite; (2) menghitung TCO 3 tahun; (3) membedakan arsitektur asosiatif Qlik dari model semantik; (4) menilai kecocokan tiap suite dengan kebutuhan; (5) menulis rekomendasi dengan ukuran yang sama untuk semua opsi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Grep seluruh track BI untuk Cognos, Qlik, dan MicroStrategy menghasilkan 0 hit — ketiganya tidak pernah disebut. BI19 membahas Tableau dan Looker, BI15 dan BI16 membahas Power BI mendalam. Lesson ini melengkapi peta tool enterprise dengan tiga suite yang belum pernah dibahas.",
      },
      reference: "TCO 3 tahun: Cognos 300 juta, Qlik 210 juta, MicroStrategy 255 juta. Pemenang biaya: Qlik — tetapi keputusan bukan hanya biaya.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengevaluasi suite BI enterprise tanpa terpukau demo — dengan kerangka dan angka yang sama untuk semua opsi.",
        "(1) Menjelaskan kekuatan khas Cognos, Qlik, dan MicroStrategy;",
        "(2) Menghitung TCO 3 tahun: lisensi plus operasional per tahun;",
        "(3) Menjelaskan model asosiatif Qlik vs model semantik;",
        "(4) Memetakan kebutuhan bank ke kekuatan tiap suite;",
        "(5) Menulis rekomendasi yang memisahkan biaya dari kecocokan.",
      ],
      tasks: [],
    },
    {
      id: "tiga-suite",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga kepribadian: pelaporan, asosiasi, distribusi",
      prose: [
        "Cognos (IBM) adalah si pelapor rapi: kekuatan terbesarnya pelaporan terjadwal dan terformat — laporan regulator yang harus tampil sama setiap bulan, didistribusikan ke ratusan penerima dengan burst dan penjadwalan. Kelemahannya: eksplorasi ad-hoc terasa kaku dibanding tool modern, dan kustomisasi butuh spesialis.",
        "Qlik Sense adalah si penjelajah asosiatif: model asosiatifnya memuat data ke memori dan menghitung ulang semua pilihan saat pengguna mengklik — nilai yang tidak terkait langsung berubah abu-abu, memperlihatkan hubungan yang tidak terlihat di query biasa. Kelemahannya: model asosiatif yang besar memakan memori, dan tata kelola definisi butuh disiplin karena tiap aplikasi bisa mendefinisikan metrik sendiri.",
        "MicroStrategy (kini Strategy) adalah si distributor: kekuatan terbesarnya distribusi ke ribuan pengguna mobile dengan keamanan berlapis dan dossier yang konsisten. Kelemahannya: siklus pengembangannya lebih berat dan butuh tim khusus — kecepatan iterasi kalah dari tool self-service.",
      ],
      tasks: [],
      note: {
        title: "Demo vendor selalu memukau — uji dengan datamu",
        body: "Tiap vendor mendemokan data yang sudah dibersihkan dan pertanyaan yang sudah disiapkan. Proof-of-concept yang jujur memakai data kotor milikmu, pertanyaan direksi yang sebenarnya, dan 10 pengguna nyata selama 2 minggu. Suite yang menang di demo belum tentu menang di PoC.\n\nModel asosiatif vs model semantik (jangan tertukar): Model ASOSIATIF Qlik memuat data ke memori dan menghitung ulang semua pilihan saat pengguna mengklik — nilai yang tidak terkait langsung berubah abu-abu, memperlihatkan hubungan yang tidak terlihat di query biasa. Model SEMANTIK adalah lapisan definisi yang dikelola pusat — metrik didefinisikan sekali dan dipakai semua tool. Qlik asosiatif menjawab 'apa yang berhubungan'; semantic layer menjawab 'apa arti angka ini'. Keduanya bisa hidup bersama: Qlik untuk eksplorasi, semantic layer untuk definisi yang disepakati.",
      },
      reference: "Cognos: pelaporan terjadwal. Qlik: asosiatif di memori. MicroStrategy: distribusi mobile ribuan pengguna.",
    },
    {
      id: "tco-keputusan",
      eyebrow: "Langkah 4 · Teori",
      title: "TCO dan keputusan: biaya bukan satu-satunya ukuran",
      prose: [
        "Hitung TCO 3 tahun: lisensi awal ditambah operasional per tahun dikali 3. Cognos: 180 ditambah 40 dikali 3 sama dengan 300 juta. Qlik: 120 ditambah 30 dikali 3 sama dengan 210 juta. MicroStrategy: 150 ditambah 35 dikali 3 sama dengan 255 juta. Pemenang biaya: Qlik, 210 juta — 90 juta lebih murah dari Cognos.",
        "Tetapi keputusan bukan hanya biaya. Bank yang kebutuhan utamanya laporan regulator terjadwal akan memilih Cognos meski termahal — karena 90 juta selisih lebih murah dari denda keterlambatan laporan dan jam kerja manual. Bank yang butuh eksplorasi analis akan memilih Qlik. Bank dengan ribuan karyawan lapangan akan memilih MicroStrategy.",
        "Kerangka keputusan: skor kecocokan (seperti DE32) dikali bobot, lalu TCO sebagai kendala — bukan sebagai skor. Opsi yang tidak memenuhi kebutuhan inti gugur dulu, berapa pun murahnya. Baru di antara yang lolos, TCO dibandingkan.",
      ],
      tasks: [],
      reference: "TCO 3 tahun: Cognos 300, Qlik 210, MicroStrategy 255 (juta). Kecocokan dulu, TCO kemudian.",
    },
    {
      id: "lab-tco",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung TCO 3 tahun tiga suite",
      prose: [
        "Lab ini menghitung TCO 3 tahun tiap suite dari lisensi awal dan biaya operasional tahunan.",
        "Hitung dulu di kepala. Cognos: 180 ditambah 40 dikali 3 sama dengan 180 tambah 120 sama dengan 300. Qlik: 120 ditambah 30 dikali 3 sama dengan 120 tambah 90 sama dengan 210. MicroStrategy: 150 ditambah 35 dikali 3 sama dengan 150 tambah 105 sama dengan 255.",
        "Tugas lab: tulis fungsi yang menerima lisensi dan operasional tiap suite, lalu mencetak tiga angka: tco_cognos, tco_qlik, tco_ms.",
        "Setelah lolos, coba eksperimen: naikkan operasional Qlik menjadi 60 per tahun dan lihat TCO-nya menjadi 300 — setara Cognos. Selisih biaya bisa hilang bila operasional tidak dikendalikan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung tco_cognos" },
        { id: "t2", text: "Hitung tco_qlik" },
        { id: "t3", text: "Hitung tco_ms" },
      ],
      expected: "tco_cognos=300\ntco_qlik=210\ntco_ms=255",
      hints: [
        "TCO = lisensi ditambah operasional dikali 3 tahun.",
        "Satuan juta rupiah.",
      ],
      code: {
        starter: `# Evaluasi suite BI Bank Artha Dana (juta rupiah).\n# Urutan: lisensi awal, operasional per tahun.\ncognos = [180, 40]\nqlik = [120, 30]\nms = [150, 35]\n\n# TULIS KODEMU: hitung tco_cognos, tco_qlik, tco_ms.\n# Cetak, per baris: tco_cognos, tco_qlik, tco_ms.\n\n\nmesin_tco(cognos, qlik, ms)`,
        lockLines: 4,
        solution: `# Evaluasi suite BI Bank Artha Dana (juta rupiah).\n# Urutan: lisensi awal, operasional per tahun.\ncognos = [180, 40]\nqlik = [120, 30]\nms = [150, 35]\n\n\ndef mesin_tco(cognos, qlik, ms):\n    tco_cognos = cognos[0] + cognos[1] * 3\n    tco_qlik = qlik[0] + qlik[1] * 3\n    tco_ms = ms[0] + ms[1] * 3\n    print(f"tco_cognos={tco_cognos}")\n    print(f"tco_qlik={tco_qlik}")\n    print(f"tco_ms={tco_ms}")\n\n\nmesin_tco(cognos, qlik, ms)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "tco_cognos=300", label: "Cognos 300 juta", msg: "180 + 40 x 3 = 300 juta." },
          { kind: "stdout_matches", task: "t2", pattern: "tco_qlik=210", label: "Qlik 210 juta", msg: "120 + 30 x 3 = 210 juta. Termurah — tetapi bukan satu-satunya ukuran." },
          { kind: "stdout_matches", task: "t3", pattern: "tco_ms=255", label: "MicroStrategy 255 juta", msg: "150 + 35 x 3 = 255 juta." },
        ],
      },
      reference: "TCO 3 tahun: Cognos 300, Qlik 210, MicroStrategy 255 (juta rupiah).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: keputusan yang akhirnya diambil dalam 6 minggu",
      prose: [
        "Kembali ke Bank Artha Dana. Evaluasi diulang dengan kerangka: PoC 2 minggu per suite dengan data kotor bank dan pertanyaan direksi yang sebenarnya, skor kecocokan dari kebutuhan, lalu TCO sebagai kendala. Hasilnya: Cognos menang kecocokan untuk laporan regulator — kebutuhan inti bank — meski TCO-nya 300 juta, termahal.",
        "Keputusan rapat: Cognos dipilih untuk pelaporan regulator dan distribusi terjadwal; Qlik dipakai tim analis untuk eksplorasi ad-hoc dengan lisensi terbatas. Dua tool untuk dua kebutuhan — dan biayanya DUA-DUANYA: TCO gabungan bukan Rp300 juta (itu Cognos saja), melainkan 300 juta ditambah lisensi Qlik terbatas dan biaya integrasi antar-tool — yang tidak dihitung di TCO lesson ini dan wajib dihitung sebelum anggaran disetujui.",
        "Keputusan itu ditulis dengan alasan dan angka — supaya tahun depan, saat seseorang bertanya kenapa bank membayar 300 juta, jawabannya ada di dokumen, bukan di ingatan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat evaluasi ini berhasil. Pertama, PoC dengan data kotor dan pertanyaan nyata — bukan demo vendor. Kedua, kecocokan dulu, TCO kemudian — opsi yang gagal kebutuhan inti gugur berapa pun murahnya. Ketiga, dua tool untuk dua kebutuhan — tidak ada satu tool yang dipaksa serba bisa.",
      },
      reference: "Cognos untuk pelaporan regulator (TCO 300); Qlik terbatas untuk eksplorasi analis. Keputusan ditulis dengan alasan dan angka.",
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
        "Lab: TCO 3 tahun Cognos 300, Qlik 210, MicroStrategy 255 (juta).",
        "Cognos: pelaporan terjadwal. Qlik: asosiatif di memori. MicroStrategy: distribusi mobile.",
        "Demo vendor selalu memukau — PoC memakai data kotor dan pertanyaan nyata.",
        "Kecocokan dulu sebagai gerbang, TCO kemudian sebagai pembanding.",
        "Dua tool untuk dua kebutuhan boleh lebih baik dari satu tool serba bisa.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Lisensi dan operasional per tahun (juta): Cognos 180/40, Qlik 120/30, MicroStrategy 150/35. Berapa TCO 3 tahun masing-masing?",
          options: [
            { text: "Cognos 300, Qlik 210, MicroStrategy 255", why: "Tepat: 180 + 120 = 300; 120 + 90 = 210; 150 + 105 = 255.", correct: true },
            { text: "Cognos 220, Qlik 150, MicroStrategy 185 — operasional 1 tahun", why: "Salah: TCO 3 tahun memakai operasional dikali 3, bukan 1." },
            { text: "Cognos 300, Qlik 300, MicroStrategy 300 — semua sama", why: "Salah: ketiganya berbeda; hitung satu per satu." },
            { text: "Cognos 540, Qlik 450, MicroStrategy 495 — lisensi dikali 3", why: "Salah: lisensi dibayar sekali di awal; hanya operasional yang dikali 3." },
          ],
        },
        {
          q: "Bank butuh laporan regulator terjadwal yang tampil sama tiap bulan. Suite mana yang paling cocok?",
          options: [
            { text: "Qlik — asosiatif dan responsif", why: "Salah: kekuatan Qlik adalah eksplorasi, bukan pelaporan terjadwal yang kaku dan konsisten." },
            { text: "Cognos — pelaporan terjadwal dan terformat adalah kekuatan utamanya", why: "Tepat: burst, penjadwalan, dan format konsisten adalah DNA Cognos.", correct: true },
            { text: "MicroStrategy — distribusi mobile", why: "Salah: distribusi mobile bukan kebutuhan utama laporan regulator terjadwal." },
            { text: "Yang termurah — selalu Qlik", why: "Salah: termurah bukan berarti cocok; kebutuhan inti adalah gerbang pertama." },
          ],
        },
        {
          q: "Apa yang membuat model asosiatif Qlik berbeda?",
          options: [
            { text: "Data disimpan di disk dan di-query dengan SQL tiap klik", why: "Salah: itu model ROLAP biasa — Qlik memuat ke memori dan menghitung ulang asosiasi tiap klik." },
            { text: "Qlik tidak memakai memori sama sekali", why: "Salah: justru memori adalah bahan bakar model asosiatifnya." },
            { text: "Klik satu nilai menghitung ulang semua pilihan dan mengabukan nilai yang tidak terkait", why: "Tepat: itulah asosiasi — hubungan yang tidak terlihat di query biasa menjadi tampak.", correct: true },
            { text: "Qlik hanya bisa menampilkan satu chart", why: "Salah: Qlik menampilkan banyak visualisasi; asosiasi adalah soal model, bukan jumlah chart." },
          ],
        },
        {
          q: "Kenapa PoC harus memakai data kotor milik sendiri?",
          options: [
            { text: "Supaya vendor kesulitan", why: "Salah: tujuannya bukan menyulitkan vendor — melainkan menguji di kondisi nyata." },
            { text: "Data bersih tidak boleh dipakai sama sekali", why: "Salah: data bersih boleh untuk demo awal — hanya saja tidak cukup untuk keputusan." },
            { text: "Supaya PoC lebih cepat selesai", why: "Salah: PoC dengan data kotor justru lebih lambat — tetapi hasilnya jujur." },
            { text: "Demo memakai data bersih dan pertanyaan siap — PoC menguji kondisi nyata", why: "Tepat: suite yang menang di demo belum tentu menang dengan data kotor dan pertanyaan direksi.", correct: true },
          ],
        },
        {
          q: "Qlik termurah (210) tetapi kebutuhan inti adalah laporan regulator. Apa keputusan yang benar?",
          options: [
            { text: "Pilih Cognos bila ia lolos gerbang kecocokan — TCO dibandingkan hanya di antara yang lolos", why: "Tepat: kecocokan adalah gerbang; TCO adalah pembanding di antara yang lolos.", correct: true },
            { text: "Pilih Qlik — termurah selalu menang", why: "Salah: opsi yang gagal kebutuhan inti gugur dulu, berapa pun murahnya." },
            { text: "Pilih yang termahal — mahal berarti bagus", why: "Salah: mahal bukan bukti cocok; kecocokan diukur dari kebutuhan, bukan harga." },
            { text: "Tunda keputusan setahun lagi", why: "Salah: penundaan tanpa kerangka hanya mengulang kebuntuan cerita pembuka." },
          ],
        },
      ],
    },
  ],
};
