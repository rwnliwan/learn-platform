import type { V2Lesson } from "../lib/types";

export const fdp16: V2Lesson = {
  slug: "fdp16-lineage-audit-trail",
  track: "Financial Data Pipeline",
  module: "Governance Data",
  title: "FDP16 — Lineage & Audit Trail: Setiap Angka Punya Silsilah",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Angka yang tidak bisa menjelaskan asal-usulnya",
      prose: [
        "Seorang auditor bertanya pertanyaan sederhana: 'Dari mana angka net income Rp120 miliar ini berasal?' Tim pipeline tidak bisa menjawab dengan pasti. Net income itu dihitung dari revenue, beban, bunga, dan pajak — tetapi revenue itu sendiri berasal dari filing mentah yang sudah diparsing, dibersihkan, dan diagregasi lewat lima langkah yang tidak tercatat. Delapan simpul hulu (filings mentah, revenue, beban pokok, laba kotor, beban operasi, EBIT, bunga, pajak) menyusun angka itu — dan tidak satu pun jejaknya terdokumentasi. Auditor itu menulis satu kalimat: 'Angka tanpa silsilah adalah angka tanpa bukti.'",
        "Lesson ini mengajarkan lineage dan audit trail: graf yang mencatat dari mana setiap angka berasal dan apa yang akan rusak bila satu sumber berubah. Lineage menjawab pertanyaan ke belakang — 'dari mana angka ini?' — dan ke depan — 'apa yang rusak bila sumber ini berubah?' Audit trail mencatat siapa yang mengubah apa dan kapan. Tanpa keduanya, pipeline adalah kotak hitam yang hanya bisa dipercaya sampai pertama kali ia salah.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Provenance disinggung di FDP4 sebagai 'kartu identitas setiap angka' — tetapi hanya sebagai satu langkah tentang asal sumber, tanpa graf lineage, tanpa analisis dampak, tanpa audit trail perubahan. Pencarian 'lineage' di track FDP menghasilkan nol. Lesson ini membangun graf dan jejaknya secara penuh.",
      },
      reference: "Net income punya 8 simpul hulu; perubahan revenue berdampak ke 6 simpul hilir; 1 simpul yatim (esg_score).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun dan membaca graf lineage serta audit trail pipeline.",
        "(1) Menjelaskan lineage hulu (upstream) dan hilir (downstream);",
        "(2) Menghitung jumlah simpul hulu dan hilir dari satu simpul;",
        "(3) Menemukan simpul yatim — data yang tidak dipakai siapa pun;",
        "(4) Menjelaskan audit trail: siapa, apa, kapan, dan kenapa berubah;",
        "(5) Menggunakan lineage untuk analisis dampak sebelum mengubah sumber.",
      ],
      tasks: [],
    },
    {
      id: "graf",
      eyebrow: "Langkah 3 · Teori",
      title: "Graf lineage: hulu, hilir, dan yatim",
      prose: [
        "Lineage adalah graf berarah: simpul adalah dataset atau kolom, panah berarti 'mengalir ke' (hulu → hilir) — A → B berarti B dihitung dari A. Membaca panah ke belakang (mengikuti arah panah secara terbalik) memberi simpul hulu; membacanya ke depan memberi simpul hilir. Net income di cerita pembuka punya 8 simpul hulu: filings mentah, revenue, beban pokok, laba kotor, beban operasi, EBIT, bunga, dan pajak — semua yang harus benar agar net income benar. Menghitung simpul hulu berarti menelusuri panah ke belakang sampai ke sumber mentah.",
        "Arah sebaliknya adalah analisis dampak (downstream). Bila definisi revenue berubah, 6 simpul hilir ikut berubah: laba kotor, piutang, EBIT, net income, kas, dan ekuitas. Inilah kenapa perubahan definisi yang terlihat kecil bisa mengguncang seluruh pipeline — dan kenapa tidak ada perubahan sumber yang boleh dilakukan tanpa memeriksa daftar hilirnya terlebih dahulu.",
        "Simpul yatim (orphan) adalah simpul yang tidak punya panah masuk atau keluar — dalam graf kita, esg_score: diambil tiap batch tetapi tidak dipakai analisis mana pun. Kasus BERBEDA adalah data yang dipakai tetapi tidak diketahui asalnya — itu bukan yatim, melainkan lineage yang HILANG (missing upstream): simpulnya punya panah keluar tetapi tidak ada panah masuk yang tercatat. Keduanya masalah, tetapi obatnya berbeda: yatim dihapus atau dipakai dengan sadar; lineage yang hilang dilacak ke sumbernya. Dalam graf cerita pembuka ada 1 simpul yatim: esg_score — diambil tiap batch, tidak pernah dipakai analisis mana pun. Simpul yatim adalah pemborosan yang terlihat (biaya pengambilan) dan risiko yang tersembunyi (bila ia dipakai diam-diam tanpa lineage, tidak ada yang tahu).",
      ],
      tasks: [],
      note: {
        title: "Lineage bukan dokumentasi — ia adalah kode",
        body: "Lineage yang ditulis di dokumen akan basi dalam seminggu. Lineage yang benar dihasilkan OTOMATIS dari kode pipeline: setiap transformasi mendaftarkan masukan dan keluarannya saat ia berjalan. Dokumentasi menjelaskan; lineage yang dihasilkan kode membuktikan.",
      },
      reference: "Hulu net income: 8 simpul. Hilir revenue: 6 simpul. Yatim: 1 (esg_score).",
    },
    {
      id: "audit-trail",
      eyebrow: "Langkah 4 · Teori",
      title: "Audit trail: siapa, apa, kapan, kenapa",
      prose: [
        "Audit trail mencatat setiap perubahan pada data dan kode pipeline: siapa yang mengubah, apa yang diubah, kapan, dan kenapa. Empat kolom itu adalah minimum — tanpa 'kenapa', jejak itu hanya daftar kejadian yang tidak bisa dinilai. Perubahan definisi revenue tanpa alasan yang tercatat adalah perubahan yang tidak bisa dipertahankan di hadapan auditor, berapa pun benar hasilnya.",
        "Tiga peristiwa yang wajib masuk audit trail. Pertama, perubahan definisi atau rumus — termasuk siapa yang menyetujuinya. Kedua, override gerbang kualitas — siapa yang meloloskan batch yang gagal floor, dan dengan alasan apa (lihat FDP13). Ketiga, perbaikan data manual — angka yang dikoreksi tangan, dengan nilai lama, nilai baru, dan buktinya. Perbaikan manual tanpa jejak adalah fabrikasi yang sopan.",
        "Audit trail juga melindungi tim itu sendiri. Saat angka dipertanyakan enam bulan kemudian, jejak itu adalah pembelaan: 'definisi berubah pada tanggal ini, disetujui orang ini, karena alasan ini'. Tanpa jejak, tim hanya bisa berkata 'kami lupa' — dan 'kami lupa' bukan jawaban yang diterima auditor mana pun.",
      ],
      tasks: [],
      note: {
        title: "Jejak yang tidak bisa diubah",
        body: "Audit trail yang bisa diedit oleh yang diaudit bukan audit trail — ia adalah catatan harian. Jejak yang serius bersifat append-only: entri baru ditambahkan, entri lama tidak dihapus atau diubah; koreksi dilakukan dengan entri baru yang merujuk entri lama. Prinsip yang sama dengan pembukuan: jurnal tidak dihapus, ia dikoreksi dengan jurnal baru.",
      },
      reference: "Empat kolom minimum: siapa, apa, kapan, kenapa. Tiga peristiwa wajib: definisi, override, perbaikan manual.",
    },
    {
      id: "lab-lineage",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menelusuri hulu dan hilir dalam graf lineage",
      prose: [
        "Lab ini menghitung tiga angka dari graf lineage cerita pembuka: jumlah simpul hulu net income, jumlah simpul hilir revenue, dan jumlah simpul yatim. Hitung dulu di kepala. Hulu net income: filings mentah, revenue, beban pokok, laba kotor, beban operasi, EBIT, bunga, pajak — 8 simpul. Hilir revenue: laba kotor, piutang, EBIT, net income, kas, ekuitas — 6 simpul. Yatim: esg_score — 1 simpul.",
        "Tugas lab: isi tiga variabel — hulu_ni, hilir_rev, yatim — lalu cetak ketiganya. Tiga angka ini adalah ringkasan graf lineage: seberapa dalam akar satu angka, seberapa luas dampak satu perubahan, dan berapa banyak data yang menganggur.",
        "Setelah lolos, coba eksperimen: tambahkan panah dari esg_score ke net income dan lihat yatim menjadi 0 — tetapi hulu net income menjadi 9. Lalu tanyakan: apakah itu perbaikan? Jawabannya: hanya bila panah itu benar — lineage yang salah lebih berbahaya daripada lineage yang tidak lengkap, karena ia memberi kepastian palsu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung simpul hulu net income" },
        { id: "t2", text: "Hitung simpul hilir revenue" },
        { id: "t3", text: "Hitung simpul yatim dalam graf" },
      ],
      expected: "hulu_ni=8\nhilir_rev=6\nyatim=1",
      hints: [
        "Hulu = semua simpul yang bisa mencapai net income dengan mengikuti panah ke belakang.",
        "Hilir = semua simpul yang bisa dicapai dari revenue dengan mengikuti panah ke depan.",
        "Yatim = simpul tanpa panah masuk dan tanpa panah keluar.",
      ],
      code: {
        starter: "# Graf lineage pipeline (panah: hulu -> hilir). JANGAN UBAH.\nedges = {\"filings_raw\": [\"revenue\"], \"revenue\": [\"gross_profit\", \"receivables\"], \"cogs\": [\"gross_profit\"], \"gross_profit\": [\"ebit\"], \"opex\": [\"ebit\"], \"ebit\": [\"net_income\"], \"interest\": [\"net_income\"], \"tax\": [\"net_income\"], \"net_income\": [\"cash\", \"equity\"], \"receivables\": [\"cash\"]}\nsemua_simpul = [\"filings_raw\", \"revenue\", \"cogs\", \"gross_profit\", \"opex\", \"ebit\", \"interest\", \"tax\", \"net_income\", \"cash\", \"equity\", \"receivables\", \"esg_score\"]\n\n# TULIS KODEMU: hulu net income, hilir revenue, simpul yatim\nhulu_ni = \nhilir_rev = \nyatim = \nprint(f\"hulu_ni={hulu_ni}\")\nprint(f\"hilir_rev={hilir_rev}\")\nprint(f\"yatim={yatim}\")",
        lockLines: 3,
        solution: "# Graf lineage pipeline (panah: hulu -> hilir). JANGAN UBAH.\nedges = {\"filings_raw\": [\"revenue\"], \"revenue\": [\"gross_profit\", \"receivables\"], \"cogs\": [\"gross_profit\"], \"gross_profit\": [\"ebit\"], \"opex\": [\"ebit\"], \"ebit\": [\"net_income\"], \"interest\": [\"net_income\"], \"tax\": [\"net_income\"], \"net_income\": [\"cash\", \"equity\"], \"receivables\": [\"cash\"]}\nsemua_simpul = [\"filings_raw\", \"revenue\", \"cogs\", \"gross_profit\", \"opex\", \"ebit\", \"interest\", \"tax\", \"net_income\", \"cash\", \"equity\", \"receivables\", \"esg_score\"]\n\n# TULIS KODEMU: hulu net income, hilir revenue, simpul yatim\nbalik = {}\nfor hulu, daftar in edges.items():\n    for hilir in daftar:\n        balik.setdefault(hilir, []).append(hulu)\n\ndef telusur_hulu(simpul):\n    ketemu = set()\n    tumpuk = list(balik.get(simpul, []))\n    while tumpuk:\n        s = tumpuk.pop()\n        if s not in ketemu:\n            ketemu.add(s)\n            tumpuk += balik.get(s, [])\n    return ketemu\n\ndef telusur_hilir(simpul):\n    ketemu = set()\n    tumpuk = list(edges.get(simpul, []))\n    while tumpuk:\n        s = tumpuk.pop()\n        if s not in ketemu:\n            ketemu.add(s)\n            tumpuk += edges.get(s, [])\n    return ketemu\n\nhulu_ni = len(telusur_hulu(\"net_income\"))\nhilir_rev = len(telusur_hilir(\"revenue\"))\nterhubung = set(edges.keys()) | {h for daftar in edges.values() for h in daftar}\nyatim = len([s for s in semua_simpul if s not in terhubung])\nprint(f\"hulu_ni={hulu_ni}\")\nprint(f\"hilir_rev={hilir_rev}\")\nprint(f\"yatim={yatim}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "hulu_ni=8", label: "Hulu net income: 8 simpul", msg: "Filings mentah, revenue, beban pokok, laba kotor, beban operasi, EBIT, bunga, pajak." },
          { kind: "stdout_matches", task: "t2", pattern: "hilir_rev=6", label: "Hilir revenue: 6 simpul", msg: "Laba kotor, piutang, EBIT, net income, kas, ekuitas." },
          { kind: "stdout_matches", task: "t3", pattern: "yatim=1", label: "Yatim: 1 simpul", msg: "esg_score — diambil tiap batch tetapi tidak dipakai siapa pun." },
        ],
      },
      reference: "Hulu net income 8; hilir revenue 6; yatim 1 (esg_score).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: perubahan definisi yang mengguncang enam simpul",
      prose: [
        "Suatu kuartal, tim akuntansi mengubah definisi revenue: penjualan konsinyasi tidak lagi diakui sebagai revenue. Perubahan itu benar secara akuntansi — tetapi tidak ada yang memeriksa daftar hilirnya. Enam simpul ikut berubah: laba kotor, piutang, EBIT, net income, kas, dan ekuitas. Dashboard menampilkan net income yang turun 12 persen tanpa penjelasan, dan direksi mengira kinerja memburuk — padahal yang berubah hanya definisi.",
        "Setelah lineage dibangun, perubahan seperti itu tidak lagi mengejutkan siapa pun. Prosedur baru: sebelum definisi diubah, daftar hilir dicetak dan dilampirkan ke pengajuan perubahan; semua pemilik dashboard yang terdampak diberi tahu; dan audit trail mencatat siapa yang menyetujui, kapan, dan kenapa. Perubahan definisi berikutnya — pengakuan pendapatan berlangganan — berjalan tanpa satu pun kejutan: semua yang terdampak sudah tahu sebelumnya.",
        "Satu temuan samping dari graf lineage: esg_score yang yatim itu ternyata dipakai diam-diam oleh satu analis lewat salinan manual di spreadsheet-nya — tanpa lineage, tanpa jejak. Salinan itu dihentikan dan esg_score dimasukkan ke pipeline resmi dengan lineage yang benar. Simpul yatim yang ditemukan graf ternyata bukan data yang menganggur — melainkan data yang dipakai di luar sistem.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, analisis dampak menjadi prosedur sebelum perubahan, bukan autopsi sesudahnya. Kedua, audit trail mencatat persetujuan dan alasan. Ketiga, simpul yatim diselidiki — bukan sekadar dihapus — karena ia bisa jadi pemakaian di luar sistem.",
      },
      reference: "Definisi revenue berubah; 6 simpul hilir ikut berubah; net income turun 12 persen tanpa penjelasan.",
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
        "Lineage: graf berarah dari sumber mentah ke angka akhir.",
        "Lab: hulu net income 8; hilir revenue 6; yatim 1 (esg_score).",
        "Analisis dampak: periksa daftar hilir sebelum mengubah sumber.",
        "Audit trail: siapa, apa, kapan, kenapa — append-only.",
        "Simpul yatim diselidiki, bukan sekadar dihapus.",
      ],
      next: { label: "FDP17 — Streaming & Real-Time Market Data: Harga yang Tak Menunggu", href: "/v2/learn/fdp17-streaming-realtime" },
      quiz: [
        {
          q: "Net income dihitung dari 8 simpul hulu; revenue memengaruhi 6 simpul hilir; ada 1 simpul yatim. Apa arti ketiganya?",
          options: [
            { text: "8 akar yang harus benar; 6 yang rusak bila revenue berubah; 1 data yang menganggur", why: "Tepat: hulu adalah akar, hilir adalah dampak, yatim adalah data tanpa pemakai.", correct: true },
            { text: "8 + 6 + 1 = 15 simpul yang semuanya sama penting", why: "Salah: ketiganya mengukur hal yang berbeda — akar, dampak, dan pengangguran." },
            { text: "8 simpul hulu berarti net income salah 8 kali", why: "Salah: jumlah hulu bukan jumlah kesalahan — ia adalah jumlah ketergantungan." },
            { text: "1 simpul yatim berarti grafnya rusak", why: "Salah: yatim bukan kerusakan graf — ia adalah temuan yang harus diselidiki." },
          ],
        },
        {
          q: "Tim ingin mengubah definisi revenue. Apa langkah pertama yang benar?",
          options: [
            { text: "Ubah dulu, lihat apa yang rusak, lalu perbaiki", why: "Salah: itu autopsi, bukan prosedur. Perubahan tanpa analisis dampak mengejutkan direksi." },
            { text: "Cetak daftar hilir revenue dan beri tahu semua pemilik dashboard yang terdampak", why: "Tepat: analisis dampak sebelum perubahan adalah fungsi utama lineage.", correct: true },
            { text: "Minta persetujuan auditor eksternal", why: "Salah: persetujuan internal dan analisis dampak dulu; auditor memeriksa jejaknya, bukan menyetujui tiap perubahan." },
            { text: "Hentikan pipeline selama perubahan", why: "Salah: menghentikan pipeline tidak diperlukan — yang diperlukan adalah pemberitahuan dan jejak." },
          ],
        },
        {
          q: "Seorang analis mengoreksi angka secara manual tanpa mencatat nilai lama dan alasan. Apa masalahnya?",
          options: [
            { text: "Tidak ada — yang penting angkanya benar", why: "Salah: perbaikan manual tanpa jejak adalah fabrikasi yang sopan. Nilai lama, nilai baru, dan bukti wajib tercatat." },
            { text: "Perbaikan itu tidak bisa diaudit — tidak ada yang bisa membuktikan kenapa angka berubah", why: "Tepat: audit trail ada untuk ini.", correct: true },
            { text: "Hanya masalah bila angkanya salah", why: "Salah: masalahnya adalah ketiadaan jejak, bukan kebenaran angka. Angka yang benar tanpa jejak tetap tidak bisa dipertahankan." },
            { text: "Masalahnya hanya administratif", why: "Salah: ini masalah substansial — auditor menolak angka tanpa silsilah." },
          ],
        },
        {
          q: "Graf lineage menunjukkan satu simpul yatim. Apa respons yang benar?",
          options: [
            { text: "Hapus segera — data yang tidak dipakai adalah pemborosan", why: "Salah: yatim harus diselidiki dulu — ia bisa jadi data yang dipakai diam-diam di luar sistem." },
            { text: "Selidiki: apakah ia benar-benar menganggur atau dipakai di luar sistem", why: "Tepat: seperti esg_score di mini-case — dipakai lewat salinan manual di spreadsheet.", correct: true },
            { text: "Abaikan — simpul yatim tidak memengaruhi apa pun", why: "Salah: pemakaian di luar sistem tanpa lineage adalah risiko yang tidak terlihat." },
            { text: "Hubungkan ke simpul mana pun agar tidak yatim", why: "Salah: lineage yang salah lebih berbahaya daripada lineage yang tidak lengkap." },
          ],
        },
        {
          q: "Kenapa audit trail harus append-only?",
          options: [
            { text: "Agar file-nya lebih kecil", why: "Salah: ukuran bukan alasannya." },
            { text: "Agar jejak tidak bisa diubah oleh yang diaudit — koreksi dilakukan dengan entri baru", why: "Tepat: seperti pembukuan — jurnal tidak dihapus, ia dikoreksi dengan jurnal baru.", correct: true },
            { text: "Agar auditor lebih mudah membaca", why: "Salah: kemudahan baca bukan alasannya — integritas jejak adalah alasannya." },
            { text: "Karena regulasi melarang database biasa", why: "Salah: tidak ada larangan seperti itu — ini soal prinsip, bukan regulasi spesifik." },
          ],
        },
      ],
    },
  ],
};
