import type { V2Lesson } from "../lib/types";

export const fdp8: V2Lesson = {
  slug: "fdp8-otomasi-penjadwalan",
  track: "Financial Data Pipeline",
  module: "Otomasi",
  title: "FDP8 — Otomasi & Penjadwalan: Pipeline yang Jalan Sendiri",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kuartal yang terlewat karena tidak ada yang ingat",
      prose: [
        "Riko sudah punya pipeline yang LULUS gerbang dan gudang SQLite yang rapi. Kuartal berjalan, filing baru terbit, dan... tidak ada yang terjadi. Pipeline itu hanya jalan bila Riko mengetik perintahnya. Kuartal Q3 2026 terlewat dua minggu — bukan karena kodenya rusak, melainkan karena tidak ada yang menyuruhnya jalan.",
        "Sinta bertanya: 'kapan terakhir kali kamu menjalankan pipeline dengan tangan dan hasilnya BENAR-BENAR sama seperti sebelumnya?' Riko terdiam. Menjalankan dengan tangan berarti mengingat urutan, mengingat jeda antar request, mengingat memeriksa log. Manusia lupa; jadwal tidak.",
        "Twist-nya: otomasi bukan soal 'membuat komputer bekerja untukmu' — melainkan soal 'membuat keberhasilan bisa diulang tanpa dirimu'. Pipeline yang hanya jalan dengan tangan adalah demo; pipeline yang jalan terjadwal, mencatat kegagalannya sendiri, dan bangun sendiri setelah gagal sesaat — itu infrastruktur.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: cron = otomasi selesai",
        type: "pitfall",
        body: "Menjadwalkan perintah tanpa retry, tanpa log, dan tanpa cek idempotency hanya memindahkan kegagalan dari siang hari ke tengah malam — saat tidak ada yang melihat. Jadwal adalah sepertiga otomasi; dua pertiganya adalah ketahanan dan keterlihatan.",
      },
      reference: "Pipeline sekali-jalan = demo. Pipeline terjadwal + retry + log = infrastruktur.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan pipeline berkala tanpa campur tangan — dan tahu kapan ia gagal.",
        "(1) Menjadwalkan fetch EDGAR tiap kuartal dengan pola cron yang benar;",
        "(2) Membedakan kegagalan sementara (retry) dari kegagalan permanen (berhenti dan beri tahu);",
        "(3) Membuat runner idempotent: jalan dua kali, hasilnya tetap sama;",
        "(4) Merancang log dan monitoring kegagalan yang bisa dibaca manusia dalam 30 detik.",
      ],
      tasks: [],
    },
    {
      id: "jadwal",
      eyebrow: "Langkah 3 · Konsep",
      title: "Menjadwalkan: kapan pipeline jalan",
      prose: [
        "Filing kuartalan terbit mengikuti kalender: emiten AS melaporkan sekitar 40 hari setelah kuartal berakhir; emiten Indonesia mengikuti jadwal IDX. Karena itu jadwal fetch bukan 'setiap hari' melainkan 'sekali per kuartal, beberapa minggu setelah kuartal tutup'. Pola cron yang umum: menit 0, jam 7, tanggal 20, bulan 2, 5, 8, 11 — ditulis 0 7 20 2,5,8,11 * — artinya tiap tanggal 20 di bulan Februari, Mei, Agustus, November. Lima kolom cron: menit, jam, tanggal, bulan, hari-dalam-minggu.",
        "Tiga penjadwal yang umum dipakai. Cron sistem (Linux/macOS): paling sederhana, tanpa dependensi, cukup untuk pipeline pribadi — kelemahannya tidak ada retry bawaan dan log tercecer bila tidak diatur. Penjadwal Python (schedule/APScheduler): logika jadwal tinggal di kode, mudah diuji, mudah dibawa ke mana-mana. Orkestrator (Airflow/Prefect): untuk tim — ada UI, retry, dependensi antar tugas, dan histori run; berlebihan untuk pipeline tiga emiten, tepat untuk pipeline tiga ratus emiten.",
        "Aturan fair access tetap berlaku di dalam jadwal: header User-Agent berisi nama dan email (FDP2), maksimal 10 request per detik, beri jeda antar request. Jadwal yang menembak EDGAR 500 kali dalam satu detik akan diblokir sementara — dan blokir itu terjadi di tengah malam saat tidak ada yang melihat. Jeda 0,15 detik antar request adalah harga yang murah untuk jadwal yang tidak pernah diblokir.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjadwalkan fetch pada tanggal 1 bulan berikutnya — saat filing kuartalan belum terbit. Jadwal yang benar menunggu jendela terbit (tengah bulan kedua setelah kuartal tutup), bukan awal bulan. Fetch yang terlalu dini bukan gagal — ia berhasil mengambil data lama, dan itu lebih berbahaya daripada gagal.",
      },
      reference: "Cron 0 7 20 2,5,8,11 * = tiap tanggal 20 di Feb, Mei, Agu, Nov. Tunggu jendela terbit, bukan awal bulan.",
    },
    {
      id: "ketahanan",
      eyebrow: "Langkah 4 · Konsep",
      title: "Retry, idempotency, dan kegagalan permanen",
      prose: [
        "Jaringan gagal dengan dua wajah. Kegagalan sementara: timeout, 429 rate limit, 503 server sibuk — cirinya hilang sendiri bila dicoba lagi beberapa saat kemudian. Polanya: coba lagi maksimal 3 kali, dengan jeda yang membesar (backoff): 5 detik, lalu 30 detik, lalu 5 menit. Jangan retry tanpa batas dan tanpa jeda — itu sama dengan menyerang server yang sedang sakit.",
        "Kegagalan permanen: 404 (filing tidak ada), 403 (User-Agent salah), data berubah format. Cirinya: mencoba lagi 100 kali pun hasilnya sama. Polanya: berhenti, catat, beri tahu manusia. Retry atas kegagalan permanen hanya membuang waktu dan mengotori log.",
        "Idempotency adalah janji: menjalankan pipeline dua kali menghasilkan keadaan yang sama seperti menjalankannya sekali. Kuncinya sudah kamu bangun di FDP7 — primary key (emiten, periode, pos) + INSERT OR IGNORE. Runner yang baik memeriksa dulu: bila kunci sudah ada di tabel kanonis, lewati. Tanpa itu, jadwal yang jalan dua kali karena kesalahan cron akan menggandakan data — dan gerbang reconcile FDP6 akan meneriakinya sebagai inkonsistensi.",
        "Satu aturan emas: fetch tidak pernah menghapus. Runner yang gagal di tengah jalan harus meninggalkan data lama tetap utuh — partial write yang menimpa data bagus dengan data setengah jadi adalah kerusakan yang lebih buruk daripada tidak ada update sama sekali. Tulis ke tabel staging dulu, pindahkan ke kanonis hanya bila lengkap.",
      ],
      tasks: [],
      note: {
        title: "Aturan emas",
        type: "risk",
        body: "Kegagalan sementara = retry dengan backoff (maks 3 kali). Kegagalan permanen = berhenti dan beri tahu. Fetch tidak pernah menghapus data lama.",
      },
      reference: "Sementara → retry 3x dengan backoff. Permanen → berhenti + beri tahu. Selalu idempotent.",
    },
    {
      id: "lab-runner",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: runner kuartalan dengan retry dan dedup",
      prose: [
        "Kamu menulis runner untuk 3 emiten (KLBF, BBRI, BBCA) selama 4 kuartal — total 12 job terjadwal. Fetch tiruan di lab ini punya satu kegagalan sementara yang deterministik: BBRI Q2 gagal pada percobaan pertama, lalu berhasil pada percobaan kedua. Semua job lain berhasil pada percobaan pertama.",
        "Tugasmu: tulis fungsi jalankan yang untuk tiap job mencoba maksimal 3 kali (catat tiap percobaan), berhenti saat berhasil, dan mencatat job sebagai gagal hanya bila 3 percobaan habis. Lalu jalankan runner dua kali: run pertama memproses 12 job; run kedua harus melewati semuanya karena kunci (emiten, periode) sudah ada — cetak jumlah yang dilewati.",
        "Eksperimen setelah selesai: ubah batas retry menjadi 1 dan jalankan lagi dari awal — job apa yang kini gagal, dan apa yang akan kamu lakukan sebagai manusia yang membaca log itu? (Jawaban: BBRI Q2 — dan tindakan yang benar adalah memeriksa apakah itu 429 sementara atau 404 permanen sebelum memutuskan.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis `jalankan`: tiap job maks 3 percobaan, catat sukses/retry/gagal" },
        { id: "t2", text: "Jalankan dua kali: run kedua harus melewati 12 job yang sudah ada" },
        { id: "t3", text: "Cetak ringkasan kedua run" },
      ],
      expected: "run1: jalan=12 | sukses=12 | retry=1 | gagal=0 | percobaan=13\nrun2: jalan=0 | dilewati=12",
      note: {
        title: "Kunci hitungan",
        body: "12 job, 1 retry (BBRI Q2) = 13 percobaan total, 0 gagal. Run kedua: 0 job jalan karena semua kunci sudah ada — idempotent. Bila hitunganmu berbeda, cek dulu: apakah BBRI Q2 dihitung sebagai retry, bukan sebagai gagal?",
      },
      hints: [
        "Percobaan = jumlah total panggilan fetch, termasuk yang gagal. 12 sukses + 1 gagal-sementara = 13.",
        "Dedup run kedua: simpan set kunci (emiten, kuartal) dari run pertama; job yang kuncinya ada → dilewati, bukan dijalankan.",
        "Gagal hanya bila 3 percobaan habis tanpa satu pun sukses.",
      ],
      code: {
        starter: `EMITEN = ["KLBF", "BBRI", "BBCA"]\nKUARTAL = ["Q1", "Q2", "Q3", "Q4"]\n\ndef fetch(emiten, kuartal, percobaan):\n    # Tiruan deterministik: BBRI Q2 gagal di percobaan pertama saja.\n    if emiten == "BBRI" and kuartal == "Q2" and percobaan == 1:\n        return False\n    return True\n\n# TULIS KODEMU\ndef jalankan(sudah_ada):\n    \n\nr1 = jalankan(set())\nprint(f"run1: jalan={r1['jalan']} | sukses={r1['sukses']} | retry={r1['retry']} | gagal={r1['gagal']} | percobaan={r1['percobaan']}")\nr2 = jalankan(r1["kunci"])\nprint(f"run2: jalan={r2['jalan']} | dilewati={r2['dilewati']}")`,
        lockLines: 9,
        solution: `EMITEN = ["KLBF", "BBRI", "BBCA"]\nKUARTAL = ["Q1", "Q2", "Q3", "Q4"]\n\ndef fetch(emiten, kuartal, percobaan):\n    # Tiruan deterministik: BBRI Q2 gagal di percobaan pertama saja.\n    if emiten == "BBRI" and kuartal == "Q2" and percobaan == 1:\n        return False\n    return True\n\ndef jalankan(sudah_ada):\n    jalan = sukses = retry = gagal = percobaan = dilewati = 0\n    kunci = set(sudah_ada)\n    for e in EMITEN:\n        for q in KUARTAL:\n            if (e, q) in kunci:\n                dilewati += 1\n                continue\n            jalan += 1\n            ok = False\n            for p in (1, 2, 3):\n                percobaan += 1\n                if fetch(e, q, p):\n                    ok = True\n                    if p > 1:\n                        retry += 1\n                    break\n            if ok:\n                sukses += 1\n                kunci.add((e, q))\n            else:\n                gagal += 1\n    return {"jalan": jalan, "sukses": sukses, "retry": retry, "gagal": gagal, "percobaan": percobaan, "dilewati": dilewati, "kunci": kunci}\n\nr1 = jalankan(set())\nprint(f"run1: jalan={r1['jalan']} | sukses={r1['sukses']} | retry={r1['retry']} | gagal={r1['gagal']} | percobaan={r1['percobaan']}")\nr2 = jalankan(r1["kunci"])\nprint(f"run2: jalan={r2['jalan']} | dilewati={r2['dilewati']}")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "run1: jalan=12 \\| sukses=12 \\| retry=1 \\| gagal=0 \\| percobaan=13", label: "Run 1: 12 job, 1 retry, 0 gagal", msg: "12 job (3 emiten x 4 kuartal), BBRI Q2 retry sekali = 13 percobaan, 0 gagal." },
          { kind: "stdout_matches", task: "t3", pattern: "run2: jalan=0 \\| dilewati=12", label: "Run 2: semua dilewati (idempotent)", msg: "Kunci sudah ada — run kedua melewati 12 job, tidak menggandakan." },
        ],
      },
      reference: "Retry 3x + dedup kunci = jadwal yang aman dijalankan dua kali.",
    },
    {
      id: "monitoring",
      eyebrow: "Langkah 6 · Konsep",
      title: "Monitoring: tahu ia gagal sebelum pengguna tahu",
      prose: [
        "Log yang baik menjawab tiga pertanyaan dalam 30 detik: apa yang jalan, apa yang gagal, dan apa yang harus dilakukan. Setiap baris log membawa waktu, job (emiten + periode), hasil, dan — bila gagal — jenis kegagalan (sementara vs permanen) beserta pesan error aslinya. Log tanpa jenis kegagalan sama tidak bergunanya dengan tidak ada log.",
        "Tiga sinyal yang dipantau. Pertama, run yang tidak pernah selesai: jadwal jalan tetapi tidak ada baris 'selesai' — artinya runner macet di tengah. Kedua, gagal berturut-turut: 3 kegagalan permanen beruntun hampir selalu berarti sesuatu berubah di hulu (format EDGAR berubah, taksonomi baru) — bukan nasib buruk. Ketiga, data yang tidak bertambah: run 'sukses' tetapi 0 baris baru selama dua kuartal — artinya jadwal mengambil data lama, bukan data baru.",
        "Aturan alert: beri tahu manusia hanya untuk yang butuh manusia. Kegagalan sementara yang pulih sendiri dengan retry cukup tercatat di log — bukan alert. Kegagalan permanen, 3 gagal beruntun, atau run yang tidak selesai = alert. Alert yang berbunyi untuk hal yang pulih sendiri akan diabaikan — dan saat alert yang benar datang, ia ikut diabaikan. Itulah kelelahan alert, dan ia lebih berbahaya daripada tidak ada alert.",
        "Tugas di bawah mengubah hasil runner (Langkah 5) menjadi log terstruktur dan aturan alert yang bisa diuji. Tiap percobaan menjadi satu baris log — dict dengan waktu, emiten, kuartal, nomor percobaan, hasil, jenis_gagal (sementara/permanen), dan pesan aslinya. Lalu tandai_alert memutuskan mana yang layak membangunkan manusia: (1) tiap kegagalan PERMANEN → alert (retry tidak akan menolong); (2) 3 kegagalan BERUNTUN → satu alert pola (kemungkinan format hulu berubah); (3) run yang TIDAK SELESAI → satu alert (tidak ada baris 'selesai'). Kegagalan sementara yang pulih lewat retry HANYA tercatat di log — bukan alert. Tiga run untuk diuji: run A sehat (12 job, BBRI Q2 retry 1× lalu pulih), run B sakit (4 job — KLBF Q1 sukses, lalu BBRI Q1–Q3 gagal permanen 404 beruntun), run C macet (berhenti setelah 2 baris log, tanpa 'selesai').",
      ],
      tasks: [
        { id: "t1", text: "Tulis `tandai_alert`: alert untuk gagal permanen, 3 gagal beruntun, dan run tak selesai — bukan untuk retry yang pulih" },
        { id: "t2", text: "Tulis `jalankan_log`: tiap percobaan jadi satu baris log terstruktur; retry hanya untuk gagal sementara" },
        { id: "t3", text: "Jalankan run A (sehat), B (sakit), C (macet) dan cetak jumlah log + alert ketiganya" },
      ],
      expected: "runA: log=13 | alert=0\nrunB: log=4 | alert=4\nrunC: log=2 | alert=1",
      hints: [
        "Gagal permanen = berhenti retry untuk job itu (mencoba lagi 100 kali pun hasilnya sama).",
        "Beruntun dihitung dari baris log yang berurutan: reset ke 0 tiap ada baris sukses.",
        "Run C: periksa macet_setelah di AWAL tiap job — bila log sudah sepanjang itu, kembalikan selesai=False.",
      ],
      code: {
        starter: `EMITEN = ["KLBF", "BBRI", "BBCA"]\nKUARTAL = ["Q1", "Q2", "Q3", "Q4"]\nJOBS_A = [(e, q) for e in EMITEN for q in KUARTAL]\nJOBS_B = [("KLBF", "Q1"), ("BBRI", "Q1"), ("BBRI", "Q2"), ("BBRI", "Q3")]\n\ndef fetch_sehat(emiten, kuartal, percobaan):\n    # Tiruan deterministik: BBRI Q2 gagal sementara di percobaan pertama saja.\n    if emiten == "BBRI" and kuartal == "Q2" and percobaan == 1:\n        return ("gagal", "sementara", "429 rate limit")\n    return ("sukses", None, None)\n\ndef fetch_sakit(emiten, kuartal, percobaan):\n    # Tiruan deterministik: semua fetch BBRI gagal permanen (404).\n    if emiten == "BBRI":\n        return ("gagal", "permanen", "404 filing tidak ada")\n    return ("sukses", None, None)\n\n# TULIS KODEMU\ndef tandai_alert(log, selesai):\n    ...\n\n# TULIS KODEMU\ndef jalankan_log(jobs, fetch, macet_setelah=None):\n    ...\n\na = jalankan_log(JOBS_A, fetch_sehat)\nb = jalankan_log(JOBS_B, fetch_sakit)\nc = jalankan_log(JOBS_A, fetch_sehat, macet_setelah=2)\nlog_a, alert_a = len(a["log"]), len(a["alert"])\nlog_b, alert_b = len(b["log"]), len(b["alert"])\nlog_c, alert_c = len(c["log"]), len(c["alert"])\nprint(f"runA: log={log_a} | alert={alert_a}")\nprint(f"runB: log={log_b} | alert={alert_b}")\nprint(f"runC: log={log_c} | alert={alert_c}")`,
        lockLines: 17,
        solution: `EMITEN = ["KLBF", "BBRI", "BBCA"]\nKUARTAL = ["Q1", "Q2", "Q3", "Q4"]\nJOBS_A = [(e, q) for e in EMITEN for q in KUARTAL]\nJOBS_B = [("KLBF", "Q1"), ("BBRI", "Q1"), ("BBRI", "Q2"), ("BBRI", "Q3")]\n\ndef fetch_sehat(emiten, kuartal, percobaan):\n    # Tiruan deterministik: BBRI Q2 gagal sementara di percobaan pertama saja.\n    if emiten == "BBRI" and kuartal == "Q2" and percobaan == 1:\n        return ("gagal", "sementara", "429 rate limit")\n    return ("sukses", None, None)\n\ndef fetch_sakit(emiten, kuartal, percobaan):\n    # Tiruan deterministik: semua fetch BBRI gagal permanen (404).\n    if emiten == "BBRI":\n        return ("gagal", "permanen", "404 filing tidak ada")\n    return ("sukses", None, None)\n\ndef tandai_alert(log, selesai):\n    alert = []\n    for baris in log:\n        if baris["hasil"] == "gagal" and baris["jenis_gagal"] == "permanen":\n            alert.append(f"ALERT permanen {baris['emiten']} {baris['kuartal']}: {baris['pesan']}")\n    beruntun = 0\n    for baris in log:\n        beruntun = beruntun + 1 if baris["hasil"] == "gagal" else 0\n        if beruntun == 3:\n            alert.append("ALERT 3-gagal-beruntun: kemungkinan format hulu berubah")\n            break\n    if not selesai:\n        alert.append("ALERT run-tak-selesai: tidak ada baris 'selesai'")\n    return alert\n\ndef jalankan_log(jobs, fetch, macet_setelah=None):\n    log = []\n    for e, q in jobs:\n        if macet_setelah is not None and len(log) >= macet_setelah:\n            return {"log": log, "selesai": False, "alert": tandai_alert(log, False)}\n        for p in (1, 2, 3):\n            hasil, jenis, pesan = fetch(e, q, p)\n            log.append({"waktu": f"07:00:{len(log) + 1:02d}", "emiten": e, "kuartal": q,\n                        "percobaan": p, "hasil": hasil, "jenis_gagal": jenis, "pesan": pesan})\n            if hasil == "sukses":\n                break\n            if jenis == "permanen":\n                break\n    return {"log": log, "selesai": True, "alert": tandai_alert(log, True)}\n\na = jalankan_log(JOBS_A, fetch_sehat)\nb = jalankan_log(JOBS_B, fetch_sakit)\nc = jalankan_log(JOBS_A, fetch_sehat, macet_setelah=2)\nlog_a, alert_a = len(a["log"]), len(a["alert"])\nlog_b, alert_b = len(b["log"]), len(b["alert"])\nlog_c, alert_c = len(c["log"]), len(c["alert"])\nprint(f"runA: log={log_a} | alert={alert_a}")\nprint(f"runB: log={log_b} | alert={alert_b}")\nprint(f"runC: log={log_c} | alert={alert_c}")`,
        checks: [
          { kind: "equal", task: "t3", name: "log_a", value: 13, tol: 0, label: "`log_a` = 13", msg: "12 job + 1 percobaan retry BBRI Q2 = 13 baris log." },
          { kind: "equal", task: "t3", name: "alert_b", value: 4, tol: 0, label: "`alert_b` = 4", msg: "3 gagal permanen + 1 alert pola 3-beruntun." },
          { kind: "equal", task: "t3", name: "alert_c", value: 1, tol: 0, label: "`alert_c` = 1", msg: "Run macet → 1 alert run-tak-selesai." },
          { kind: "stdout_matches", task: "t3", pattern: "runA: log=13 \\| alert=0", label: "Run A: 13 log, 0 alert", msg: "Retry yang pulih sendiri cukup tercatat di log — bukan alert." },
          { kind: "stdout_matches", task: "t3", pattern: "runB: log=4 \\| alert=4", label: "Run B: 4 log, 4 alert", msg: "3 permanen + 1 pola beruntun." },
          { kind: "stdout_matches", task: "t3", pattern: "runC: log=2 \\| alert=1", label: "Run C: 2 log, 1 alert", msg: "Macet setelah 2 baris → alert run-tak-selesai." },
        ],
      },
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memantau 'apakah cron jalan' tetapi tidak memantau 'apakah data bertambah'. Cron bisa jalan sempurna selama setahun sambil mengambil data lama yang sama — dan tidak ada yang tahu sampai seseorang bertanya kenapa rasionya tidak berubah.",
      },
      reference: "Log: waktu + job + hasil + jenis gagal. Alert hanya untuk yang butuh manusia.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: jadwal yang mengambil data lama",
      prose: [
        "Pipeline Riko dijadwalkan tiap tanggal 1. Tiga kuartal berjalan 'sukses' — log hijau semua. Lalu Sinta memeriksa: gross margin KLBF di tabel kanonis masih 39,71 — angka FY2024, padahal laporan interim terbaru sudah terbit sebulan lalu. Jadwal jalan, data tidak bertambah.",
        "Pertanyaan: dua kemungkinan penyebabnya, dan pemeriksaan apa yang membedakannya?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Kemungkinan satu: jadwal terlalu dini — fetch tanggal 1 mengambil filing terakhir yang tersedia, yaitu yang lama, karena filing baru belum terbit (lihat langkah 3: tunggu jendela terbit). Kemungkinan dua: fetch berhasil tetapi parser menolak fakta baru diam-diam (mis. concept baru atau filed terbaru tidak dikenali), sehingga tidak ada baris baru. Pembeda: cek log jumlah baris baru per run — bila 0 baris baru selama dua kuartal, periksa tanggal filed di sumber (terbit atau belum) dan hitung baris yang ditolak parser. Monitoring 'data bertambah' dari langkah 6 menangkap keduanya.",
      },
      reference: "Log hijau bukan bukti data baru. Pantau jumlah baris baru, bukan hanya status run.",
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
        "Jadwal fetch mengikuti kalender terbit filing, bukan awal bulan — cron 0 7 20 2,5,8,11 * sebagai contoh.",
        "Kegagalan sementara = retry maks 3x dengan backoff; permanen = berhenti dan beri tahu.",
        "Idempotent: kunci (emiten, periode, pos) membuat run kedua melewati semua job — 12 job, 13 percobaan, 0 gagal.",
        "Fetch tidak pernah menghapus data lama; tulis ke staging, pindah bila lengkap.",
        "Log terstruktur (satu dict per percobaan: waktu + job + hasil + jenis gagal) dan alert hanya untuk gagal permanen, 3 beruntun, atau run tak selesai — retry yang pulih cukup tercatat.",
        "Pantau tiga sinyal: run tak selesai, gagal beruntun, dan data yang tidak bertambah.",
      ],
      next: { label: "FDP9 — Market Data: Menggabungkan Harga dengan Filings", href: "/v2/learn/fdp9-market-data" },
      quiz: [
        {
          q: "Fetch EDGAR kena 429 (rate limit) sesaat. Respons runner yang benar?",
          options: [
            { text: "Berhenti total dan kirim alert darurat", why: "Salah: 429 adalah kegagalan sementara — ia pulih sendiri. Alert darurat untuk ini melatih manusia mengabaikan alert." },
            { text: "Coba lagi dengan jeda membesar, maks 3 kali — bila pulih, cukup tercatat di log", why: "Tepat: backoff + retry untuk sementara; alert hanya bila habis dan tetap gagal.", correct: true },
            { text: "Coba lagi tanpa jeda secepat mungkin sampai berhasil", why: "Salah: retry tanpa jeda atas 429 sama dengan menabrak pintu yang sama lebih keras." },
            { text: "Lewati emiten itu selamanya", why: "Salah: satu 429 bukan vonis atas emiten — ia soal laju request saat itu." },
          ],
        },
        {
          q: "Runner yang sama dijadwalkan dua kali karena kesalahan cron. Apa yang menyelamatkan data dari penggandaan?",
          options: [
            { text: "Log yang mencatat kedua run", why: "Salah: log hanya mencatat penggandaan — ia tidak mencegahnya." },
            { text: "Kunci dedup (emiten, periode, pos) + INSERT OR IGNORE — run kedua melewati semua job", why: "Tepat: idempotency di level data, bukan di level jadwal. 12 job dilewati, 0 digandakan.", correct: true },
            { text: "Cron yang hanya boleh jalan sekali sehari", why: "Salah: membatasi jadwal tidak memperbaiki runner yang tidak idempotent." },
            { text: "Menghapus tabel sebelum tiap run", why: "Salah: itu melanggar aturan emas — fetch tidak pernah menghapus data lama." },
          ],
        },
        {
          q: "Kenapa fetch kuartalan dijadwalkan tanggal 20 bulan kedua setelah kuartal tutup, bukan tanggal 1?",
          options: [
            { text: "Karena tanggal 1 server EDGAR tutup", why: "Salah: EDGAR tidak tutup tanggal 1." },
            { text: "Karena filing baru belum terbit tanggal 1 — fetch dini mengambil data lama dan terlihat sukses", why: "Tepat: fetch terlalu dini berhasil mengambil data lama; kegagalan yang diam-diam adalah yang paling berbahaya.", correct: true },
            { text: "Karena cron tidak mendukung tanggal 1", why: "Salah: cron mendukung tanggal berapa pun." },
            { text: "Karena rate limit lebih longgar tanggal 20", why: "Salah: rate limit tidak bergantung tanggal." },
          ],
        },
        {
          q: "Dalam lab, 12 job menghasilkan 13 percobaan dan 1 retry. Apa arti angka 13?",
          options: [
            { text: "Satu job gagal permanen dan dicoba 2 kali", why: "Salah: tidak ada job yang gagal — sukses 12 dari 12." },
            { text: "BBRI Q2 gagal sekali (sementara) lalu berhasil — 12 sukses + 1 percobaan gagal = 13 percobaan", why: "Tepat: retry tercatat sebagai percobaan tambahan, bukan sebagai kegagalan.", correct: true },
            { text: "Ada 13 job karena satu emiten punya kuartal ekstra", why: "Salah: 3 emiten kali 4 kuartal = 12 job. Tidak ada kuartal kelima." },
            { text: "Runner mencoba tiap job dua kali", why: "Salah: hanya job yang gagal yang dicoba ulang — 11 job cukup satu percobaan." },
          ],
        },
        {
          q: "Alert mana yang layak membangunkan manusia di tengah malam?",
          options: [
            { text: "Satu retry yang pulih sendiri", why: "Salah: itu urusan log, bukan alert — membunyikannya melatih kelelahan alert." },
            { text: "Tiga kegagalan permanen beruntun — kemungkinan format hulu berubah", why: "Tepat: pola beruntun menandakan perubahan struktural yang butuh manusia.", correct: true },
            { text: "Satu run selesai 2 detik lebih lambat dari biasanya", why: "Salah: variasi kecil bukan sinyal — ambang alert butuh makna, bukan kepekaan." },
            { text: "Log berhasil ditulis", why: "Salah: keberhasilan rutin bukan kejadian yang butuh perhatian manusia." },
          ],
        },
      ],
    },
  ],
};
