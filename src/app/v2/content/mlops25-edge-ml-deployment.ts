import type { V2Lesson } from "../lib/types";

export const mlops25: V2Lesson = {
  slug: "mlops25-edge-ml-deployment",
  track: "MLOps",
  module: "Serving & Skala",
  title: "MLOps25 — Edge ML Deployment: Model di 50.000 Perangkat",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Update 8 MB ke 50.000 HP — dan tagihan bandwidth yang mengejutkan",
      prose: [
        "KirimCepat mengirim update model scoring ke 50.000 HP agen lapangan: 8 MB per perangkat, total 400 GB transfer. Tagihan bandwidth bulan itu naik 340 GB lebih dari yang dianggarkan — dan 12 persen perangkat gagal update karena kehabisan storage saat download. Solusinya: delta update — hanya bobot yang berubah (1,2 MB per perangkat, total 60 GB, hemat 340 GB alias 85 persen) — plus rollout bertahap: 5 persen dulu (2.500 perangkat), lalu 25 persen, baru 100 persen, dengan 24 jam jeda tiap tahap.",
        "Edge deployment adalah operasi armada, bukan operasi server. Server: satu tempat, satu deploy, satu rollback. Edge: 50.000 tempat, 50.000 versi, 50.000 kemungkinan gagal — dan separuhnya offline saat kamu deploy. Lesson ini mengajarkan operasi armada: delta update, rollout bertahap, telemetri sampel, dan rollback yang bekerja tanpa internet.",
        "Setelah lesson ini kamu bisa: (1) menghitung biaya transfer full vs delta update; (2) merancang rollout bertahap dengan ambang rollback; (3) menjelaskan telemetri sampel untuk monitoring yang buta; (4) merancang rollback edge yang tidak butuh koneksi; (5) memutuskan kapan model edge harus ditarik.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MLOps6 menyebut edge sebagai satu pola serving dalam satu paragraf dan MLOps16 menyebut dukungan Jetson di Triton; MLE32 mengajarkan konversi model ke edge dari sudut engineer. Lesson ini membangun SISI OPERASINYA dari sudut MLOps: distribusi update ke armada, rollout bertahap, telemetri, dan rollback — topik yang tidak ada di lesson mana pun.",
      },
      reference: "Full update 400 GB; delta 60 GB; hemat 340 GB (85 persen); canary 5 persen = 2.500 perangkat.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengoperasikan model di armada perangkat — bukan hanya di satu server.",
        "(1) Menghitung biaya transfer full vs delta update;",
        "(2) Merancang rollout bertahap (5 persen, 25 persen, 100 persen);",
        "(3) Menentukan ambang rollback dari metrik canary;",
        "(4) Merancang telemetri sampel untuk armada yang tidak selalu online;",
        "(5) Menjelaskan strategi rollback edge (model cadangan di perangkat).",
      ],
      tasks: [],
    },
    {
      id: "delta-rollout",
      eyebrow: "Langkah 3 · Teori",
      title: "Delta update & rollout bertahap: hemat bandwidth, kecilkan blast radius",
      prose: [
        "Delta update mengirim hanya selisih bobot antara model lama dan baru. Bila retrain hanya mengubah sebagian bobot secara signifikan, delta bisa 1,2 MB dari model 8 MB penuh. Hitungannya untuk 50.000 perangkat: full = 50.000 x 8 MB = 400.000 MB = 400 GB; delta = 50.000 x 1,2 MB = 60.000 MB = 60 GB; hemat 340 GB, yaitu 85 persen. Syaratnya: perangkat harus punya model lama sebagai basis — perangkat baru yang belum pernah punya model tetap butuh full download.",
        "Delta update membawa risiko yang tidak dimiliki full update: INTEGRITAS dan AUTENTISITAS. Delta yang rusak atau dipalsukan di tengah jalan berarti model yang rusak terpasang di 50.000 perangkat sekaligus — dan karena delta hanya bermakna bila diterapkan di atas basis yang tepat, satu basis yang salah membuat hasilnya sampah tanpa pesan error yang jelas. Aturannya: setiap delta WAJIB ditandatangani (code signing) dan diverifikasi sebelum diterapkan — periksa signature dan checksum (hash) delta di perangkat, terapkan hanya bila cocok dengan basis yang diharapkan, dan rollback ke model cadangan bila verifikasi gagal. Tanpa verifikasi, kanal distribusi menjadi permukaan serangan: penyerang yang menyuntikkan delta palsu menguasai skor di seluruh armada.",
        "Rollout bertahap membatasi blast radius: tahap 1 = 5 persen (2.500 perangkat), soak 24 jam; tahap 2 = 25 persen, soak 24 jam; tahap 3 = 100 persen. Tiap tahap punya kriteria naik: error rate canary tidak lebih dari 1,5x baseline, crash rate di bawah 0,1 persen, dan tidak ada laporan kritis dari lapangan. Bila kriteria gagal, rollout BERHENTI — bukan dilanjutkan 'sambil diperbaiki'.",
        "Jadwal total: 3 tahap x 24 jam = 3 hari dari canary ke penuh. Tiga hari terasa lambat — tetapi alternatifnya adalah 50.000 perangkat rusak dalam satu jam. Kecepatan deploy edge diukur dari kecepatan rollback, bukan kecepatan rilis.",
      ],
      tasks: [],
      note: {
        title: "Perangkat yang tidak pernah online",
        body: "Sebagian armada mungkin offline berminggu-minggu (HP rusak, agen cuti). Mereka akan menerima update saat kembali online — tetapi model mereka sudah usang. Aturan contoh: perangkat yang versinya tertinggal lebih dari 2 versi tidak boleh memakai model lama untuk keputusan kritis; ia harus update dulu atau fallback ke server. Ambang '2 versi' adalah contoh kebijakan, bukan hukum: bila rilis yang tertinggal berisi perbaikan kritis (keamanan atau kesalahan fatal), bahkan 1 versi sudah cukup untuk memaksa update; bila hanya retrain minor, toleransi bisa lebih longgar. Yang tetap: ambang ditulis per tingkat keparahan rilis, bukan satu angka untuk semua. Model usang yang tetap dipakai adalah model yang salah dengan percaya diri.",
      },
      reference: "Full 400 GB; delta 60 GB; hemat 85 persen; canary 2.500 perangkat.",
    },
    {
      id: "telemetri-rollback",
      eyebrow: "Langkah 4 · Teori",
      title: "Telemetri sampel & rollback tanpa internet",
      prose: [
        "Monitoring edge buta: perangkat tidak mengirim tiap prediksi ke server. Gantinya telemetri sampel: 1 persen perangkat (500 dari 50.000) mengirim ringkasan harian — distribusi skor, latensi p50/p99, jumlah prediksi, error. Bila distribusi skor canary bergeser lebih dari ambang, alert berbunyi — walau 99 persen perangkat diam. Sampel 1 persen cukup untuk mendeteksi PERGESERAN DISTRIBUSI yang umum bila dipilih acak dan representatif; tetapi TIDAK cukup untuk kegagalan langka: dengan 500 perangkat, crash rate 0,1 persen hanya memberi ~0,5 kejadian yang diharapkan — praktis tidak terdeteksi. Ukuran sampel harus dihitung dari laju kegagalan yang ingin dideteksi (power analysis, seperti A2.10) dan distratifikasi per kelas perangkat; sampel yang hanya dari perangkat flagship adalah sampel yang berbohong.",
        "Rollback edge tidak bisa 'deploy ulang versi lama dari server' — perangkat mungkin offline. Solusi: simpan DUA model di perangkat (aktif + cadangan). Rollback = ganti pointer ke model cadangan — instan, tanpa download, tanpa internet. Model cadangan adalah versi terakhir yang lolos uji di perangkat itu. Aturan: jangan pernah hapus model cadangan sebelum penggantinya lolos 24 jam di perangkat.",
        "Kriteria penarikan model (recall): error rate di atas 2x baseline selama 1 jam, crash rate di atas 0,5 persen, atau satu insiden keamanan (model membocorkan data). Tiga kriteria ini hanya bisa DIEVALUASI pada perangkat yang melaporkan telemetri — perangkat yang offline tidak mengirim angka, sehingga recall tidak bisa 'dilihat' dari mereka. Itulah mengapa recall edge bekerja dua lapis: (1) perintah 'kembali ke cadangan' diumumkan ke armada — perangkat yang online menerimanya dalam hitungan menit, yang offline menerimanya saat kembali online; (2) sampai perintah itu sampai, perangkat offline dilindungi oleh aturan lokalnya sendiri: model cadangan di perangkat dan gerbang versi (model yang terlalu usang tidak boleh dipakai untuk keputusan kritis). Recall yang hanya mengandalkan telemetri adalah recall yang buta terhadap perangkat yang paling berisiko.",
      ],
      tasks: [],
      note: {
        title: "Uji di perangkat, bukan hanya di lab",
        body: "Model yang lolos uji paritas di lab bisa gagal di perangkat: chip yang berbeda membulatkan berbeda, memori yang kecil membuat model terpotong, OS lama tidak mendukung operator baru. Uji penerimaan edge WAJIB di perangkat target termurah — bukan emulator, bukan flagship. Satu perangkat termurah di lab menghemat 50.000 keluhan di lapangan.",
      },
      reference: "Telemetri 1 persen = 500 perangkat; rollback = pointer ke model cadangan, tanpa internet.",
    },
    {
      id: "lab-edge-ops",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: biaya update, canary, dan hemat delta",
      prose: [
        "Lab ini menghitung operasi armada dari angka mentah: biaya transfer full vs delta, ukuran canary, dan persen hemat.",
        "Hitung dulu di kepala. Full: 50.000 x 8 MB = 400.000 MB = 400 GB. Delta: 50.000 x 1,2 MB = 60.000 MB = 60 GB. Hemat: 400 - 60 = 340 GB, yaitu (1 - 1,2/8) x 100 = 85,0 persen. Canary 5 persen: 50.000 x 0,05 = 2.500 perangkat.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: full_gb, delta_gb, hemat_gb, hemat_persen, canary. Lima angka ini adalah anggaran operasi armada — dengan ini kamu bisa menjawab 'berapa biaya update ini' sebelum menekan tombol deploy.",
        "Setelah lolos, coba eksperimen: naikkan armada menjadi 200.000 perangkat dan lihat full menjadi 1.600 GB vs delta 240 GB — lalu tanyakan: pada ukuran armada berapa delta update berubah dari 'penghematan' menjadi 'keharusan'?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `full_gb` dan `delta_gb` untuk 50.000 perangkat" },
        { id: "t2", text: "Hitung `hemat_gb` dan `hemat_persen`" },
        { id: "t3", text: "Hitung `canary` = 5 persen dari armada" },
      ],
      expected: "full_gb=400.0\ndelta_gb=60.0\nhemat_gb=340.0\nhemat_persen=85.0\ncanary=2500",
      hints: [
        "GB = perangkat x MB / 1.000.",
        "Hemat persen = (1 - delta/full) x 100.",
        "Canary = 50.000 x 0,05.",
      ],
      code: {
        starter: `# Operasi armada edge: biaya update + canary.\narmada = 50000\nukuran_penuh_mb = 8\ndelta_mb = 1.2\nfraksi_canary = 0.05\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nfull_gb = \ndelta_gb = \nhemat_gb = \nhemat_persen = \ncanary = \n\nprint(f"full_gb={full_gb}")\nprint(f"delta_gb={delta_gb}")\nprint(f"hemat_gb={hemat_gb}")\nprint(f"hemat_persen={hemat_persen}")\nprint(f"canary={canary}")`,
        lockLines: 4,
        solution: `# Operasi armada edge: biaya update + canary.\narmada = 50000\nukuran_penuh_mb = 8\ndelta_mb = 1.2\nfraksi_canary = 0.05\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nfull_gb = armada * ukuran_penuh_mb / 1000\ndelta_gb = armada * delta_mb / 1000\nhemat_gb = full_gb - delta_gb\nhemat_persen = (1 - delta_mb / ukuran_penuh_mb) * 100\ncanary = int(armada * fraksi_canary)\n\nprint(f"full_gb={full_gb}")\nprint(f"delta_gb={delta_gb}")\nprint(f"hemat_gb={hemat_gb}")\nprint(f"hemat_persen={hemat_persen}")\nprint(f"canary={canary}")`,
        checks: [
          { kind: "equal", task: "t1", name: "full_gb", value: 400.0, tol: 1e-9, label: "`full_gb` seharusnya 400.0", msg: "50.000 x 8 / 1.000 = 400 GB." },
          { kind: "equal", task: "t1", name: "delta_gb", value: 60.0, tol: 1e-9, label: "`delta_gb` seharusnya 60.0", msg: "50.000 x 1,2 / 1.000 = 60 GB." },
          { kind: "equal", task: "t2", name: "hemat_gb", value: 340.0, tol: 1e-9, label: "`hemat_gb` seharusnya 340.0", msg: "400 - 60 = 340 GB." },
          { kind: "equal", task: "t2", name: "hemat_persen", value: 85.0, tol: 1e-9, label: "`hemat_persen` seharusnya 85.0", msg: "(1 - 1,2/8) x 100 = 85,0 persen." },
          { kind: "equal", task: "t3", name: "canary", value: 2500, tol: 1e-9, label: "`canary` seharusnya 2500", msg: "50.000 x 0,05 = 2.500 perangkat." },
        ],
      },
      reference: "Full 400 GB; delta 60 GB; hemat 340 GB (85 persen); canary 2.500.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: strategi update armada",
      prose: [
        "Skenario 1 — Armada besar (di atas 10 ribu), model berubah tiap bulan. → Delta update + rollout bertahap. Alasan: full update tidak terjangkau biayanya; blast radius harus kecil.",
        "Skenario 2 — Armada kecil (di bawah 100), semua online. → Full update langsung. Alasan: biaya transfer sepele; kerumitan delta tidak sepadan.",
        "Skenario 3 — Perangkat tidak bisa menyimpan dua model (storage minim). → Update atomik dengan verifikasi hash + rollback via download ulang saat online. Alasan: tanpa cadangan lokal, rollback butuh koneksi — dokumentasikan risikonya.",
        "Skenario 4 — Model baru gagal di canary. → Hentikan rollout, kembali ke cadangan, analisis. Alasan: canary yang gagal adalah canary yang bekerja — jangan 'coba lagi' dengan harapan berbeda.",
        "Skenario 5 — Perangkat tertinggal lebih dari 2 versi. → Paksa update sebelum keputusan kritis, atau fallback ke server. Alasan: model usang yang tetap dipakai adalah model yang salah dengan percaya diri.",
        "Aturan praktis: armada adalah sistem terdistribusi yang sebagian anggotanya tidak bisa dihubungi. Rancang untuk itu — bukan untuk armada ideal yang selalu online.",
      ],
      tasks: [],
      note: {
        title: "Versi adalah identitas perangkat",
        body: "Setiap prediksi edge harus mencatat versi model yang menjawab — di log lokal maupun di hasil yang dikirim ke server. Tanpa versi, insiden tidak bisa diatribusikan: 'skor ini dari model lama atau baru?' adalah pertanyaan yang harus terjawab dalam 1 menit, bukan 1 hari.",
      },
      reference: "Delta + bertahap untuk armada besar; full langsung untuk armada kecil.",
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
        "Full 400 GB vs delta 60 GB — hemat 340 GB (85 persen).",
        "Rollout: 5 persen (2.500) → 25 persen → 100 persen, 24 jam tiap tahap.",
        "Telemetri 1 persen = 500 perangkat, dipilih acak.",
        "Rollback edge = pointer ke model cadangan, tanpa internet.",
        "Perangkat tertinggal 2 versi: paksa update atau fallback ke server.",
      ],
      next: { label: "MLOps26 — Progressive Delivery & Rollback: Rilis Tanpa Drama", href: "/v2/learn/mlops26-progressive-delivery-rollback" },
      quiz: [
        {
          q: "50.000 perangkat x model 8 MB full vs delta 1,2 MB. Berapa hematnya?",
          options: [
            { text: "340 GB (85 persen)", why: "Tepat: full 400 GB, delta 60 GB, hemat 340 GB.", correct: true },
            { text: "60 GB (15 persen)", why: "Salah: 60 GB adalah biaya delta, bukan hematnya." },
            { text: "400 GB (100 persen)", why: "Salah: delta tetap butuh transfer 60 GB; hematnya 85 persen, bukan 100." },
            { text: "6,8 GB — selisih per perangkat saja", why: "Salah: itu per perangkat; total armada 50.000 x 6,8 MB = 340 GB." },
          ],
        },
        {
          q: "Mengapa rollback edge memakai model cadangan di perangkat, bukan download ulang?",
          options: [
            { text: "Karena download lebih cepat", why: "Salah: download justru lebih lambat dan butuh internet." },
            { text: "Karena perangkat mungkin offline — pointer ke cadangan bekerja tanpa internet", why: "Tepat: rollback harus bekerja di kondisi terburuk, bukan terbaik.", correct: true },
            { text: "Karena model cadangan lebih akurat", why: "Salah: cadangan adalah versi lama yang lolos uji — bukan yang lebih akurat." },
            { text: "Karena server tidak menyimpan model lama", why: "Salah: server menyimpan; masalahnya perangkat tidak bisa menjangkaunya saat offline." },
          ],
        },
        {
          q: "Telemetri 1 persen dari 50.000 perangkat. Berapa perangkat, dan apa syaratnya?",
          options: [
            { text: "500 perangkat, dipilih acak dan representatif", why: "Tepat: 1 persen dari 50.000 = 500; sampel flagship saja berbohong.", correct: true },
            { text: "500 perangkat flagship saja — yang paling penting", why: "Salah: flagship tidak mewakili HP kentang; sampel harus acak." },
            { text: "5.000 perangkat — 1 persen dari 500.000", why: "Salah: armadanya 50.000, bukan 500.000." },
            { text: "50 perangkat — cukup untuk gambaran", why: "Salah: 50 dari 50.000 adalah 0,1 persen — terlalu kecil untuk mendeteksi pergeseran." },
          ],
        },
        {
          q: "Canary 5 persen gagal (error 2x baseline). Apa yang benar?",
          options: [
            { text: "Lanjutkan ke 25 persen sambil diperbaiki", why: "Salah: melanjutkan rollout yang gagal memperbesar blast radius." },
            { text: "Hentikan rollout, kembali ke cadangan, analisis", why: "Tepat: canary yang gagal adalah canary yang bekerja.", correct: true },
            { text: "Coba lagi canary yang sama besok — mungkin fluke", why: "Salah: mengulang tanpa perubahan dan berharap hasil berbeda adalah ritual, bukan engineering." },
            { text: "Naikkan ambang error agar canary lolos", why: "Salah: mengubah ambang untuk meloloskan angka adalah manipulasi." },
          ],
        },
        {
          q: "Perangkat tertinggal 2 versi model. Apa yang benar?",
          options: [
            { text: "Biarkan memakai model lama — masih berfungsi", why: "Salah: model usang yang tetap dipakai adalah model yang salah dengan percaya diri." },
            { text: "Paksa update sebelum keputusan kritis, atau fallback ke server", why: "Tepat: keputusan kritis butuh model yang didukung.", correct: true },
            { text: "Hapus modelnya agar perangkat tidak memberi skor", why: "Salah: menghapus model mematikan fungsi; fallback lebih baik dari mati total." },
            { text: "Tidak ada yang perlu dilakukan — update akan datang sendiri", why: "Salah: perangkat yang tidak pernah online tidak akan pernah update sendiri." },
          ],
        },
      ],
    },
  ],
};
