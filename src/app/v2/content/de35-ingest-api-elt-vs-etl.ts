import type { V2Lesson } from "../lib/types";

export const de35: V2Lesson = {
  slug: "de35-ingest-api-elt-vs-etl",
  track: "Data Engineer",
  module: "Fondasi Pipeline",
  title: "DE35 — Pola Ingest API dan ELT vs ETL: Dari Polling Sampai Load Dulu, Transform Kemudian",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "API yang mati kena 429 di tengah malam",
      prose: [
        "KirimCepat menarik data order dari API mitra tiap menit — janji 'real-time' ke direksi. Suatu malam API itu mengembalikan 429: kuota terlampaui. Job retry membabi buta, kuota makin terkuras, dan data order berhenti 6 jam. Keesokan paginya direksi bertanya kenapa dashboard kosong — jawabannya: polling tiap menit tanpa menghitung beban kuota.",
        "Di sisi lain, tim transformasi berdebat ETL vs ELT. Tim lama membersihkan data sebelum masuk warehouse (ETL) — rapi, tetapi lambat dan kaku saat skema berubah. Tim baru me-load mentah dulu lalu transform di warehouse (ELT) — cepat, tetapi warehouse penuh data mentah yang tidak terdokumentasi.",
        "Lesson ini mengajarkan pola ingest API — polling, cursor, webhook — beserta aritmetika kuotanya, dan framework memilih ELT vs ETL. Setelah lesson ini kamu bisa: (1) menghitung beban request polling; (2) memilih cursor vs offset pagination; (3) merancang ingest yang idempoten; (4) membedakan ELT dan ETL beserta trade-off-nya; (5) memutuskan pola per sumber, bukan per perusahaan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DE19 punya satu langkah ingestion API (polling, webhook, file drop) di dalam lesson CDC, dengan rumus halaman yang sama dipakai di sini, dan DE16 mengajarkan filosofi ELT lewat dbt. Lesson ini mengambil kedua singgungan itu menjadi lesson khusus: aritmetika kuota lengkap (halaman, retry, request per jam), pagination cursor vs offset, idempotensi ingest, dan matriks keputusan ELT vs ETL per sumber.",
      },
      reference: "12.000 record, page 100: 120 halaman; retry 10 persen: 132 request per sync; sync tiap 15 menit: 528 request per jam.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang ingest API yang tidak membunuh kuota — dan memilih ELT atau ETL dengan alasan yang tertulis.",
        "(1) Menghitung beban request: halaman, retry, request per jam;",
        "(2) Memilih cursor pagination dibanding offset untuk data yang berubah;",
        "(3) Menangani 429 dan timeout dengan backoff, bukan retry membabi buta;",
        "(4) Menjelaskan ELT vs ETL dan kapan masing-masing menang;",
        "(5) Merancang ingest idempoten: rerun aman, duplikat tertangkap.",
      ],
      tasks: [],
    },
    {
      id: "pola-api",
      eyebrow: "Langkah 3 · Teori",
      title: "Polling, cursor, dan webhook: tiga kepribadian ingest",
      prose: [
        "Polling adalah si penanya yang sopan: ia menelepon API tiap interval dan bertanya ada data baru. Sederhana dan jadwal di tangan kita — tetapi data selalu basi di antara dua panggilan, dan tiap panggilan membayar kuota. Hitung bebannya sebelum menjanjikan kesegaran: 12.000 record dengan page size 100 berarti 120 halaman; retry 10 persen berarti sekitar 132 request per sync; sync tiap 15 menit berarti 528 request per jam — aman di kuota 1.000 per jam; tetapi sync tiap menit berarti 7.920 per jam, dan API itu mati kena 429.",
        "Pagination offset rapuh untuk data yang berubah: bila baris baru tersisip di halaman awal saat kamu membaca halaman 5, satu baris terlewat tanpa jejak. Cursor pagination memakai penanda stabil (misalnya updated_at plus id) sehingga tiap baris tepat dibaca sekali tanpa terlewat karena pergeseran. Tetapi hati-hati: cursor TIDAK menjamin exactly-once. Bila request timeout lalu di-retry, atau sumber mengirim ulang halaman yang sama, baris yang sama bisa masuk dua kali — cursor mencegah baris TERLEWAT karena pergeseran, bukan mencegah baris GANDA karena retry. Exactly-once butuh kunci dedup/idempotensi di sisi consumer (id sumber plus updated_at, atau event_id unik) — tanpa itu, 'tepat sekali' hanya berlaku bila tidak ada retry sama sekali.",
        "Webhook adalah si pendengar yang setia: sumber mengirim event saat sesuatu terjadi — latensi detik tanpa polling. Harganya: endpoint kita harus selalu hidup, idempoten (webhook yang timeout dikirim ulang oleh sumber), dan memverifikasi signature. Dan 429 ditangani dengan backoff eksponensial plus jitter — retry langsung setelah 429 adalah cara tercepat menghabiskan kuota yang tersisa.",
      ],
      tasks: [],
      note: {
        title: "Idempotensi ingest itu kontrak",
        body: "Ingest yang baik bisa di-rerun tanpa ganda: kunci dedup adalah id sumber plus updated_at, atau event_id yang unik. Tanpa kunci dedup, satu retry mengubah 132 request menjadi 132 baris ganda — dan dashboard revenue naik tanpa ada order baru.",
      },
      reference: "120 halaman, 132 request per sync, 528 per jam aman; 7.920 per jam mati kena 429. Cursor untuk sinkronisasi, offset hanya untuk snapshot statis. Cursor bukan exactly-once — butuh kunci dedup.",
    },
    {
      id: "elt-vs-etl",
      eyebrow: "Langkah 4 · Teori",
      title: "ELT vs ETL: load dulu atau bersihkan dulu",
      prose: [
        "ETL membersihkan sebelum masuk warehouse: extract, transform, lalu load. Kelebihannya: warehouse selalu rapi, data sensitif bisa disaring sebelum tersimpan. Kekurangannya: transformasi di luar warehouse lambat dan kaku — skema berubah berarti pipeline ETL diubah, dan data mentah hilang sehingga audit tidak bisa mengulang.",
        "ELT me-load mentah dulu ke warehouse (lapisan bronze), lalu transform di dalam warehouse dengan SQL (lapisan silver dan gold). Kelebihannya: cepat, fleksibel, dan data mentah tersimpan untuk audit dan replay. Kekurangannya: warehouse menampung data mentah yang harus digovernance — tanpa katalog, bronze menjadi tempat sampah yang mahal.",
        "Matriks keputusan per sumber: data kecil dan stabil dengan aturan bersih yang ketat — ETL boleh. Data besar, skema sering berubah, butuh audit replay — ELT menang. Data sensitif yang tidak boleh tersimpan mentah — ETL atau ELT dengan masking saat load. Dan keputusan ini per sumber, bukan per perusahaan: satu perusahaan boleh memakai ETL untuk data HR yang sensitif dan ELT untuk data order yang bervolume.",
      ],
      tasks: [],
      reference: "ETL: rapi, kaku, data mentah hilang. ELT: cepat, fleksibel, butuh governance bronze. Keputusan per sumber.",
    },
    {
      id: "lab-kuota",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung beban request polling API",
      prose: [
        "Lab ini menghitung beban request polling dari jumlah record, page size, fraksi retry, dan interval sync.",
        "Hitung dulu di kepala. Halaman: 12.000 dibagi 100 sama dengan 120 — dibulatkan ke ATAS (ceil): 12.050 record dengan page 100 butuh 121 halaman, bukan 120 — floor division (//) akan menghilangkan halaman terakhir yang terisi sebagian. Request per sync: 120 dikali 1,1 sama dengan 132 (retry 10 persen). Request per jam untuk sync tiap 15 menit: 132 dikali 4 sama dengan 528.",
        "Tugas lab: tulis fungsi yang menerima total record, page size, persen retry, dan sync per jam — lalu mencetak tiga angka: halaman, request, per_jam.",
        "Setelah lolos, coba eksperimen: ubah sync menjadi tiap menit (60 sync per jam) dan lihat per_jam menjadi 7.920 — jauh di atas kuota 1.000. Itulah bukti bahwa janji real-time harus dihitung dulu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung halaman dari total record dan page size" },
        { id: "t2", text: "Hitung request per sync termasuk retry" },
        { id: "t3", text: "Hitung per_jam dari sync per jam" },
      ],
      expected: "halaman=120\nrequest=132\nper_jam=528",
      hints: [
        "Halaman = total record dibagi page size, dibulatkan ke ATAS (ceil) — jangan floor division.",
        "Request = halaman dikali 1 ditambah fraksi retry.",
        "Per jam = request dikali sync per jam.",
      ],
      code: {
        starter: `# Ingest order dari API mitra: polling tiap 15 menit.\ntotal_record = 12000\npage_size = 100\nretry_persen = 10\nsync_per_jam = 4\n\n# TULIS KODEMU: hitung halaman, request, per_jam.\n# Cetak, per baris: halaman, request, per_jam.\n\n\nmesin_kuota(total_record, page_size, retry_persen, sync_per_jam)`,
        lockLines: 5,
        solution: `# Ingest order dari API mitra: polling tiap 15 menit.\ntotal_record = 12000\npage_size = 100\nretry_persen = 10\nsync_per_jam = 4\n\n\ndef mesin_kuota(total_record, page_size, retry_persen, sync_per_jam):\n    halaman = -(-total_record // page_size)  # ceil: halaman terakhir yang terisi sebagian tetap dihitung\n    request = int(halaman * (1 + retry_persen / 100))\n    per_jam = request * sync_per_jam\n    print(f"halaman={halaman}")\n    print(f"request={request}")\n    print(f"per_jam={per_jam}")\n\n\nmesin_kuota(total_record, page_size, retry_persen, sync_per_jam)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "halaman=120", label: "120 halaman", msg: "12.000 / 100 = 120 halaman." },
          { kind: "stdout_matches", task: "t2", pattern: "request=132", label: "132 request per sync", msg: "120 x 1,1 = 132. Retry 10 persen menambah 12 request." },
          { kind: "stdout_matches", task: "t3", pattern: "per_jam=528", label: "528 request per jam", msg: "132 x 4 sync per jam = 528. Aman di kuota 1.000 per jam." },
        ],
      },
      reference: "120 halaman, 132 request per sync, 528 per jam.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: dari tiap menit ke tiap 15 menit — dan dashboard tetap hidup",
      prose: [
        "Kembali ke KirimCepat. Setelah insiden 429, tim menghitung ulang: polling tiap menit butuh 7.920 request per jam melawan kuota 1.000. Janji real-time dicabut secara resmi — diganti sync tiap 15 menit (528 per jam) plus webhook untuk event order baru yang butuh latensi detik.",
        "Transformasi dipindah ke ELT: data mentah masuk bronze, dbt membangun silver dan gold. Saat skema API berubah dua minggu kemudian, tim tidak mengubah pipeline ingest sama sekali — hanya model dbt-nya. Backfill dari bronze memakan 20 menit, bukan 6 jam.",
        "Keputusan rapat: interval polling adalah janji bisnis yang dihitung, bukan angka yang ditebak. Setiap perubahan interval wajib melampirkan hitungan kuota.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini bertahan. Pertama, beban kuota dihitung sebelum janji kesegaran dibuat. Kedua, webhook dipakai hanya untuk event yang benar-benar butuh detik — sisanya polling 15 menit yang murah. Ketiga, ELT menyimpan mentah di bronze sehingga perubahan skema tidak menghancurkan histori.",
      },
      reference: "Polling 15 menit (528 per jam) plus webhook untuk event cepat. Skema berubah: hanya model dbt yang diubah.",
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
        "Lab: 120 halaman, 132 request per sync, 528 per jam; tiap menit menjadi 7.920 per jam.",
        "Cursor untuk sinkronisasi berkelanjutan; offset hanya untuk snapshot statis.",
        "429 ditangani backoff eksponensial plus jitter, bukan retry langsung.",
        "ELT: load mentah dulu, transform di warehouse — cepat dan bisa replay; butuh governance bronze.",
        "Keputusan ELT vs ETL dibuat per sumber, bukan per perusahaan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "12.000 record, page 100, retry 10 persen, sync tiap 15 menit. Berapa request per jam?",
          options: [
            { text: "528", why: "Tepat: 120 halaman x 1,1 = 132 per sync; 132 x 4 = 528 per jam.", correct: true },
            { text: "120 — hanya halaman yang dihitung", why: "Salah: retry menambah request, dan sync per jam mengalikannya." },
            { text: "7.920 — itu bila sync tiap menit", why: "Salah: 7.920 adalah beban sync tiap menit (132 x 60), bukan tiap 15 menit." },
            { text: "1.000 — sama dengan kuota", why: "Salah: 1.000 adalah kuota API, bukan beban yang dihitung." },
          ],
        },
        {
          q: "Kenapa cursor pagination lebih aman dari offset untuk sinkronisasi berkelanjutan?",
          options: [
            { text: "Cursor lebih cepat karena halamannya lebih besar", why: "Salah: ukuran halaman bukan pembedanya — stabilitas penanda yang membedakan." },
            { text: "Baris baru yang tersisip tidak menggeser cursor, sehingga tidak ada baris terlewat karena pergeseran", why: "Tepat: offset menggeser saat baris tersisip; cursor memakai penanda stabil. Catatan: ini mencegah TERLEWAT — bukan jaminan exactly-once; retry tetap butuh kunci dedup.", correct: true },
            { text: "Cursor tidak butuh autentikasi API", why: "Salah: autentikasi tidak ada hubungannya dengan jenis pagination." },
            { text: "Offset tidak bisa dipakai untuk data lebih dari 1.000 baris", why: "Salah: offset bisa dipakai untuk data besar — hanya saja rapuh saat data berubah." },
          ],
        },
        {
          q: "API mengembalikan 429. Apa respons yang benar?",
          options: [
            { text: "Retry secepat mungkin sampai berhasil", why: "Salah: retry membabi buta menghabiskan kuota yang tersisa — itulah penyebab insiden cerita pembuka." },
            { text: "Pindah ke polling tiap menit agar data tidak basi", why: "Salah: mempercepat polling saat kena 429 justru memperparah kehabisan kuota." },
            { text: "Backoff eksponensial plus jitter, lalu retry", why: "Tepat: jeda yang membesar memberi API ruang pulih; jitter mencegah semua klien retry serentak.", correct: true },
            { text: "Abaikan 429 — data akan datang sendiri", why: "Salah: 429 berarti request ditolak; tanpa retry terjadwal, data berhenti." },
          ],
        },
        {
          q: "Kapan ELT mengalahkan ETL?",
          options: [
            { text: "Data kecil, stabil, aturan bersih ketat", why: "Salah: itu justru kasus ETL boleh menang — volume kecil dan aturan ketat." },
            { text: "Data sensitif yang tidak boleh tersimpan mentah sama sekali", why: "Salah: itu kasus ETL (atau ELT dengan masking saat load) — ELT mentah justru berisiko." },
            { text: "Selalu — ELT adalah pengganti ETL di semua kasus", why: "Salah: keputusan dibuat per sumber; tidak ada pola yang menang di semua kasus." },
            { text: "Data besar, skema sering berubah, butuh audit replay dari data mentah", why: "Tepat: ELT menyimpan mentah di bronze sehingga perubahan skema dan replay murah.", correct: true },
          ],
        },
        {
          q: "Ingest di-rerun setelah timeout. Apa yang mencegah duplikat?",
          options: [
            { text: "Kunci dedup dari id sumber plus updated_at, atau event_id unik", why: "Tepat: rerun dengan kunci yang sama menimpa atau melewati baris yang sudah ada.", correct: true },
            { text: "Menjalankan rerun lebih cepat", why: "Salah: kecepatan tidak mencegah duplikat — kunci dedup yang mencegahnya." },
            { text: "Menghapus tabel tujuan sebelum rerun", why: "Salah: menghapus tujuan berarti kehilangan data yang sudah benar — dan downtime laporan." },
            { text: "Meminta API mengirim data lebih sedikit", why: "Salah: volume data tidak ada hubungannya dengan duplikasi saat retry." },
          ],
        },
      ],
    },
  ],
};
