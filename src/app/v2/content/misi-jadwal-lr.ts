import type { V2Mission } from "../lib/types";

// ── MISI LEARNING RATE: Jadwal yang Membunuh Training ────────────────────
// M2 — Deep Learning Engineer Misi B (core). Dataset: SINTETIS, seed 42
// (bukan log training nyata) — dinyatakan di briefing + METODE.md + data room.
// File: public/misi/misi-jadwal-lr/lr_schedules.csv (800 baris =
// 200 step × 4 jadwal). Metode: METODE.md.

const BASE = "/misi/misi-jadwal-lr";

export const misiLrSched: V2Mission = {
  slug: "misi-jadwal-lr",
  track: "Deep Learning Engineer",
  module: "Misi",
  title: "Misi Learning Rate: Jadwal yang Membunuh Training",
  estMinutes: 135,
  role: "Deep learning engineer — penanggung jawab jadwal learning rate",
  client:
    "Head of ML — training besar berikutnya (8 GPU, 2 minggu) butuh satu LR schedule yang diputuskan minggu ini dari 4 kandidat hasil uji coba 200 step",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Empat kurva, satu keputusan mahal",
      prose: [],
      tasks: [],
      briefing: {
        role: "Deep learning engineer — penanggung jawab jadwal learning rate",
        client:
          "Head of ML. Training besar berikutnya: 8 GPU selama 2 minggu, biaya puluhan ribu dolar. Empat jadwal learning rate sudah diuji coba 200 step — dan kamu harus memilih SATU untuk training besar itu. Salah pilih = uang hangus + dua minggu hilang.",
        story: [
          "Senin, 09:00. Head of ML menaruh empat kurva loss di layar: hasil uji coba 200 step untuk empat jadwal learning rate. “Pilih satu untuk training besar,” katanya. “Dua minggu, delapan GPU. Salah pilih = uang hangus.” Di kertas, pilihannya tampak mudah: satu kurva turun mulus, satu turun bertangga, satu nyaris datar, satu… hilang di tengah jalan.",
          "Tapi kamu sudah belajar dari misi neuron mati: kurva yang “terlihat bagus” belum tentu jujur. Engineer senior mengklaim sudah memakai “cosine dengan warmup — standar industri”, dan laporannya menyebut loss akhir 0,30 untuk kandidat itu. Kamu meminta log mentah per step — dan menemukan bahwa “mulus” bisa dibuat dengan duplikasi, “warmup” bisa cuma klaim, dan satu kandidat yang divergen tidak muncul sama sekali di laporan.",
          "Data misi ini sintetis (seed 42): loss per step untuk 4 jadwal — konstan-tinggi (divergen), konstan-rendah (macet), cosine dengan warmup, dan step-decay. Tugasmu: bandingkan kecepatan konvergensi dari log mentah, deteksi divergensi, putuskan jadwal untuk training besar, temukan 4 sabotase di laporan eksperimen, dan tulis rekomendasi yang dipertahankan angka.",
        ],
        objectives: [
          "Membandingkan kecepatan konvergensi 4 jadwal LR dari log mentah (loss akhir, langkah pertama mencapai loss < 1,0) dan mendeteksi divergensi (NaN/lonjakan).",
          "Meringkas hasil eksperimen per jadwal dengan SQL.",
          "Menemukan 4 sabotase di laporan eksperimen dan menulis rekomendasi jadwal untuk training besar yang dipertahankan angka.",
        ],
        prereqSummary:
          "Learning rate (LR) = seberapa besar langkah update bobot di tiap step; jadwal LR mengatur besar langkah itu sepanjang training. LR terlalu besar = loss meledak (divergen); terlalu kecil = training macet di tempat. Cosine decay menurunkan LR mengikuti kurva cosinus, warmup menaikkan LR perlahan di awal agar stabil. Yang penting di sini: jadwal terbaik bukan yang “terlihat mulus”, melainkan yang loss-nya turun tercepat tanpa divergen — dan itu harus dihitung dari log mentah, bukan dari gambar kurvanya.",
        datasetNote:
          "Sumber: SINTETIS — digenerasi dengan NumPy seed 42 khusus untuk misi ini (bukan log training nyata).\nCakupan: 200 step × 4 jadwal (konstan_tinggi, konstan_rendah, cosine_warmup, step_decay) → 800 baris (file lr_schedules.csv: step, schedule, loss).\nPola yang ditanam: konstan_tinggi divergen (NaN dari step 170), konstan_rendah macet (~2,0), cosine_warmup konvergen tercepat, step_decay konvergen bertangga.\nKejujuran: pola disederhanakan agar perbandingan bisa direproduksi persis — uji coba LR nyata lebih berisik. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "800 baris, 4 nasib",
      prose: [
        "`lr_schedules.csv` adalah kebenaran mentah: 800 baris, satu baris per step per jadwal. Kolom `schedule` berisi empat nilai: `konstan_tinggi` (LR besar konstan), `konstan_rendah` (LR kecil konstan), `cosine_warmup` (warmup 10 step + peluruhan cosinus), `step_decay` (LR turun bertangga di step 70 dan 140). Kolom `loss` = loss training pada step itu.",
        "Empat nasib menunggumu di file ini. Satu jadwal turun cepat dan selamat sampai step 200. Satu turun bertangga — lebih lambat tapi selamat. Satu nyaris tidak bergerak selama 200 step — GPU dibakar untuk tidak belajar apa-apa. Satu turun dulu, lalu meledak, lalu hilang menjadi NaN — divergensi yang tidak ditangani.",
        "Aturan main: (1) perbandingan dibangun dari log mentah per step, bukan dari gambar kurva di laporan; (2) divergensi = NaN atau lonjakan yang dihitung, bukan “kelihatannya aneh”; (3) “warmup” hanya diakui bila ada di data — klaim tanpa jejak di log = tidak terjadi.",
      ],
      tasks: [
        { id: "t1", text: "Buka `lr_schedules.csv`: catat jumlah baris dan daftar schedule" },
        { id: "t2", text: "Cari baris dengan loss NaN — schedule apa, mulai step berapa?" },
      ],
      note: {
        title: "Miskonsepsi #1: kurva mulus = training bagus",
        type: "pitfall",
        body: "“Kurvanya mulus, berarti jadwalnya bagus.” BELUM TENTU. Kurva mulus bisa berarti konvergen — atau hasil moving average, atau segmen yang diduplikasi. Selalu verifikasi ke log mentah: adakah NaN? Adakah lonjakan yang “diratakan”? Apakah warmup yang diklaim benar-benar ada di data? Di misi ini, kurva “paling mulus” di laporan ternyata lahir dari segmen duplikat — dan kamu akan membuktikannya di Langkah 7.",
      },
      reference:
        "lr_schedules.csv (800 baris, sintetis seed 42). Perbandingan dari log mentah per step; vonis untuk klaim laporan eksperimen.",
    },
    {
      id: "lab-lr",
      eyebrow: "Langkah 3 · Lab 1 — Adu jadwal",
      title: "Jadwal mana yang selamat sampai step 200?",
      prose: [
        "Sekarang adu keempat jadwal dengan tanganmu sendiri. Dari `lr_schedules.csv`: hitung loss akhir (step 200) per jadwal, loss minimum per jadwal, jumlah NaN per jadwal, dan — metrik kecepatan — step pertama di mana loss turun di bawah 1,0 untuk tiap jadwal.",
        "Rumus cosine decay sudah disiapkan di bawah — kamu tidak perlu mengimplementasikannya, tapi pahami: “mulus” yang sesungguhnya lahir dari rumus, bukan dari duplikasi data. Fokus lab ini: angka perbandingan, bukan gambarnya.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris` dan `daftar_schedule`" },
        { id: "t2", text: "Hitung per jadwal: `akhir_*` (loss step 200), `loss_min_*`, `n_nan_*`" },
        { id: "t3", text: "Hitung `pertama_cosine` dan `pertama_step`: step pertama loss < 1,0" },
      ],
      expected:
        "800 baris, 4 jadwal; loss akhir: cosine_warmup=0,3389, step_decay=0,7438, konstan_rendah=2,0008, konstan_tinggi=NaN (divergen — 31 NaN dari step 170); pertama capai loss<1,0: cosine_warmup step 125, step_decay step 140, dua lainnya tidak pernah; loss minimum cosine_warmup=0,3213",
      formula: String.raw`\eta_t = \eta_{\min} + \tfrac{1}{2}(\eta_{\max} - \eta_{\min})\left(1 + \cos\left(\frac{t\pi}{T}\right)\right)`,
      formulaNote:
        "η_t = learning rate di step t; η_max/η_min = LR tertinggi/terendah; T = total step. Cosinus menurunkan LR secara mulus dari η_max ke η_min — “mulus” yang sesungguhnya, dari rumus, bukan dari data yang diduplikasi. Warmup = fase awal (di sini 10 step) di mana LR dinaikkan perlahan dari kecil agar training stabil sebelum decay dimulai.",
      note: {
        title: "Miskonsepsi #2: divergensi selalu terlihat jelas",
        type: "pitfall",
        body: "Divergensi tidak selalu meledak dramatis di depan mata. Di sini konstan_tinggi turun dengan baik sampai step 60, lalu merayap naik, lalu meledak, lalu NaN dari step 170. Tanpa pengecekan NaN eksplisit (`isna().sum()`), run yang “hilang di tengah jalan” mudah terlewat — apalagi bila laporannya diam-diam menghapus jadwal itu dari tabel ringkasan.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — kolom loss bertipe float, NaN terbaca otomatis.",
        "Per jadwal: filter `df[df[\"schedule\"]==s].sort_values(\"step\")`, lalu ambil baris terakhir `.iloc[-1]`, minimum `.min()`, dan NaN via `.isna().sum()`.",
        "Step pertama di bawah ambang: `hit = sub[sub[\"loss\"] < 1.0]` lalu `hit.iloc[0][\"step\"]` — tangani kasus tidak pernah tercapai.",
        "Loss akhir konstan_tinggi = NaN — jangan bandingkan NaN dengan angka; laporkan lewat `n_nan_tinggi`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-jadwal-lr/lr_schedules.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "daftar_schedule = ...",
          "",
          "akhir = ...      # dict: schedule -> loss step 200",
          "loss_min = ...   # dict: schedule -> loss minimum",
          "n_nan = ...      # dict: schedule -> jumlah NaN",
          "",
          "akhir_cosine = ...",
          "akhir_step = ...",
          "akhir_rendah = ...",
          "n_nan_tinggi = ...",
          "loss_min_cosine = ...",
          "",
          "def pertama_dibawah(s, ambang=1.0):",
          "    ...   # step pertama loss < ambang, atau None",
          "",
          "pertama_cosine = ...",
          "pertama_step = ...",
          "",
          "print(\"baris:\", n_baris, \"| jadwal:\", daftar_schedule)",
          "print(\"loss akhir:\", round(akhir_cosine,4), round(akhir_step,4), round(akhir_rendah,4), \"| NaN konstan_tinggi:\", n_nan_tinggi)",
          "print(\"pertama <1.0:\", pertama_cosine, pertama_step, \"| min cosine:\", round(loss_min_cosine,4))",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-jadwal-lr/lr_schedules.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "daftar_schedule = sorted(df[\"schedule\"].unique())",
          "",
          "akhir = {}      # dict: schedule -> loss step 200",
          "loss_min = {}   # dict: schedule -> loss minimum",
          "n_nan = {}      # dict: schedule -> jumlah NaN",
          "for s in daftar_schedule:",
          "    sub = df[df[\"schedule\"] == s].sort_values(\"step\")",
          "    akhir[s] = float(sub.iloc[-1][\"loss\"])",
          "    loss_min[s] = float(sub[\"loss\"].min())",
          "    n_nan[s] = int(sub[\"loss\"].isna().sum())",
          "",
          "akhir_cosine = akhir[\"cosine_warmup\"]",
          "akhir_step = akhir[\"step_decay\"]",
          "akhir_rendah = akhir[\"konstan_rendah\"]",
          "n_nan_tinggi = n_nan[\"konstan_tinggi\"]",
          "loss_min_cosine = loss_min[\"cosine_warmup\"]",
          "",
          "def pertama_dibawah(s, ambang=1.0):",
          "    sub = df[df[\"schedule\"] == s].sort_values(\"step\")",
          "    hit = sub[sub[\"loss\"] < ambang]",
          "    return int(hit.iloc[0][\"step\"]) if len(hit) else None   # step pertama loss < ambang, atau None",
          "",
          "pertama_cosine = pertama_dibawah(\"cosine_warmup\")",
          "pertama_step = pertama_dibawah(\"step_decay\")",
          "",
          "print(\"baris:\", n_baris, \"| jadwal:\", daftar_schedule)",
          "print(\"loss akhir:\", round(akhir_cosine,4), round(akhir_step,4), round(akhir_rendah,4), \"| NaN konstan_tinggi:\", n_nan_tinggi)",
          "print(\"pertama <1.0:\", pertama_cosine, pertama_step, \"| min cosine:\", round(loss_min_cosine,4))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 800", name: "n_baris", value: 800, msg: "File punya 800 baris (200 step × 4 jadwal)." },
          { kind: "equal", task: "t2", label: "`akhir_cosine` ≈ 0,3389", name: "akhir_cosine", value: 0.3389, tol: 0.001, msg: "Loss cosine_warmup pada step 200." },
          { kind: "equal", task: "t2", label: "`akhir_step` ≈ 0,7438", name: "akhir_step", value: 0.7438, tol: 0.001, msg: "Loss step_decay pada step 200." },
          { kind: "equal", task: "t2", label: "`akhir_rendah` ≈ 2,0008", name: "akhir_rendah", value: 2.0008, tol: 0.001, msg: "Loss konstan_rendah pada step 200 — nyaris tidak bergerak." },
          { kind: "equal", task: "t2", label: "`n_nan_tinggi` = 31", name: "n_nan_tinggi", value: 31, msg: "konstan_tinggi: NaN dari step 170 s.d. 200 = 31 step." },
          { kind: "equal", task: "t3", label: "`pertama_cosine` = 125", name: "pertama_cosine", value: 125, msg: "Step pertama cosine_warmup mencapai loss < 1,0." },
          { kind: "equal", task: "t3", label: "`pertama_step` = 140", name: "pertama_step", value: 140, msg: "Step pertama step_decay mencapai loss < 1,0 — 15 step lebih lambat." },
          { kind: "equal", task: "t2", label: "`loss_min_cosine` ≈ 0,3213", name: "loss_min_cosine", value: 0.3213, tol: 0.001, msg: "Loss minimum cosine_warmup selama 200 step." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Ringkasan eksperimen",
      title: "Satu tabel untuk Head of ML",
      prose: [
        "Head of ML tidak mau membaca 800 baris log — ia mau satu tabel ringkas per jadwal: loss awal, loss minimum, dan berapa step yang NaN. Di sinilah agregasi SQL bekerja: dari log mentah menjadi tabel keputusan.",
        "Tabel `schedule_summary(schedule TEXT, n_steps INT, loss_awal REAL, loss_min REAL, n_nan INT)` sudah berisi ringkasan per jadwal dari file mentah. Tampilkan schedule, loss_min, dan n_nan untuk semua jadwal, urut dari `loss_min` terkecil — kandidat terbaik duluan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query: schedule + loss_min + n_nan, urut loss_min menaik" },
      ],
      expected: "4 baris — cosine_warmup (min 0,3213, 0 NaN), step_decay (0,7213, 0), konstan_tinggi (1,7556, 31 NaN), konstan_rendah (1,9910, 0)",
      sqlLab: {
        task: "Tampilkan schedule, loss_min, n_nan untuk SEMUA jadwal, urut dari loss_min TERKECIL (kandidat terbaik duluan).",
        schema: "CREATE TABLE schedule_summary (schedule TEXT, n_steps INT, loss_awal REAL, loss_min REAL, n_nan INT);",
        seedData: [
          "INSERT INTO schedule_summary VALUES",
          "('cosine_warmup',200,2.3200,0.3213,0),",
          "('konstan_rendah',200,2.2881,1.9910,0),",
          "('konstan_tinggi',200,2.3011,1.7556,31),",
          "('step_decay',200,2.3282,0.7213,0);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT schedule, loss_min, n_nan\nFROM schedule_summary\n",
        solution: [
          "SELECT schedule, loss_min, n_nan",
          "FROM schedule_summary",
          "ORDER BY loss_min;",
        ].join("\n"),
        expectedColumns: ["schedule", "loss_min", "n_nan"],
        expectedRows: [
          ["cosine_warmup", 0.3213, 0],
          ["step_decay", 0.7213, 0],
          ["konstan_tinggi", 1.7556, 31],
          ["konstan_rendah", 1.991, 0],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiLrSched;

// ── lanjutan misiLrSched: langkah 5–10 ───────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_LR: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Jadwal mana untuk 8 GPU selama 2 minggu?",
    prose: [
      "Angkanya tidak berbohong: cosine_warmup mencapai loss < 1,0 di step 125 dan berakhir di 0,34 tanpa satu pun NaN; step_decay 15 step lebih lambat dan berakhir 2× lebih buruk; konstan_rendah membakar 200 step untuk turun 0,3; konstan_tinggi divergen dan hilang menjadi NaN. Tapi “jadwal terbaik di uji coba” dan “jadwal untuk training besar” tetap keputusan berbeda — dan Head of ML menunggumu memilih. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Jadwal mana yang kamu pakai untuk training besar 2 minggu itu? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-cosine",
          label: "Cosine + warmup — konvergen tercepat, tanpa divergensi",
          rationale:
            "Angka mentah: loss akhir 0,34, pertama capai < 1,0 di step 125, nol NaN. Standar industri — dan kali ini didukung bukti dari log mentah, bukan dari klaim.",
          nextStepId: "temuan-cosine",
          consequenceNote:
            "Training besar berjalan mulus; loss akhir 0,31 — sesuai prediksi uji coba. Head of ML mencatat di review: keputusan berbasis log mentah, bukan gambar kurva. Dua minggu GPU terbayar lunas.",
        },
        {
          id: "opt-step",
          label: "Step-decay — lebih mudah dijelaskan ke tim",
          rationale:
            "Konvergen juga (loss akhir 0,74), dan “LR turun tiap 70 step” lebih gampang dijelaskan ke stakeholder non-teknis daripada kurva cosinus.",
          nextStepId: "temuan-step",
          consequenceNote:
            "Training selesai dengan loss 0,72 — 2× lebih buruk dari cosine, sesuai prediksi. Stakeholder paham penjelasannya, tapi modelnya kalah. Pelajaran: “mudah dijelaskan” bukan metrik kualitas model.",
        },
        {
          id: "opt-tuning",
          label: "Ulangi tuning — data 200 step belum cukup meyakinkan",
          rationale:
            "200 step itu pendek untuk memutuskan training 2 minggu. Minta uji 500 step dulu sebelum komit 8 GPU — kehati-hatian di atas kecepatan.",
          nextStepId: "temuan-tuning",
          consequenceNote:
            "Tuning tambahan 3 hari mengonfirmasi cosine tetap terbaik — tapi slot GPU keburu diambil tim lain dan training molor 2 minggu. Kehati-hatian punya harga: kadang “data lebih banyak” = “kesempatan hilang”.",
        },
      ],
    },
  },
  {
    id: "temuan-cosine",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: cosine + warmup",
    prose: [
      "Training besar dijalankan dengan cosine + warmup. Dua minggu kemudian: loss akhir 0,31 — nyaris persis seperti prediksi uji coba 200 step. Tidak ada NaN tengah malam, tidak ada kejutan. Head of ML mencatat di performance review-mu satu kalimat: “keputusan berbasis log mentah, bukan gambar kurva.”",
      "Ini opsi yang “benar” — dan ia benar bukan karena cosine itu “standar industri”, melainkan karena angkanya memang terbaik: tercepat mencapai < 1,0, loss akhir terendah, nol divergensi. Standar industri tanpa bukti = argumen otoritas; standar industri DENGAN bukti = engineering.",
    ],
    tasks: [],
    note: {
      title: "Bukti > otoritas, selalu",
      body: "“Standar industri” adalah alasan yang lemah bila berdiri sendiri — standar bisa kedaluwarsa, dan konteksmu belum tentu konteks si pembuat standar. Yang membuat keputusanmu kuat bukan label “cosine”, melainkan empat angka: 125, 0,34, 0, 31. Di memo-mu, setiap klaim “terbaik” wajib ditemani angka yang membuatnya terbaik.",
    },
  },
  {
    id: "temuan-step",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: step-decay",
    prose: [
      "Training besar dijalankan dengan step-decay — dan presentasimu ke stakeholder memang lancar: “LR turun tiap 70 step, sederhana dan terkontrol.” Dua minggu kemudian: loss akhir 0,72. Modelnya bekerja, tapi 2× lebih buruk dari yang bisa dicapai cosine — persis seperti prediksi uji coba.",
      "Tidak ada yang rusak — hanya opportunity cost yang tidak terlihat di dashboard mana pun. Stakeholder puas dengan penjelasannya; kamu tahu ada 0,4 loss yang hilang karena memilih “mudah dijelaskan” di atas “terbukti terbaik”.",
    ],
    tasks: [],
    note: {
      title: "Komunikasi penting — tapi bukan metrik model",
      body: "Menjelaskan ke stakeholder itu keterampilan nyata, dan step-decay memang lebih mudah diceritakan. Tapi urutannya: pilih yang terbaik DARI angka, lalu cari cara menjelaskannya — bukan pilih yang mudah dijelaskan lalu berharap angkanya ikut. Cosine pun bisa dijelaskan: “LR turun perlahan seperti mengerem, bukan menginjak rem mendadak.”",
    },
  },
  {
    id: "temuan-tuning",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: tuning ulang dulu",
    prose: [
      "Kamu meminta uji 500 step sebelum komit GPU. Tiga hari kemudian hasilnya keluar: cosine tetap terbaik, dengan margin yang sama. Data tambahan mengonfirmasi apa yang sudah jelas — tapi slot 8 GPU keburu diambil tim lain, dan training besarmu molor dua minggu.",
      "Kehati-hatianmu tidak salah secara teknis — hanya mahal secara organisasi. Pelajaran: “butuh data lebih banyak” adalah keputusan juga, dengan harganya sendiri. Tanyakan selalu: apa yang BERUBAH bila datanya 2,5× lebih banyak? Kalau jawabannya “kemungkinan besar tidak ada”, maka penundaan = biaya tanpa informasi.",
    ],
    tasks: [],
    note: {
      title: "Nilai informasi vs harga penundaan",
      body: "Setiap permintaan “data dulu” harus lolos uji: berapa nilai informasi tambahannya, dan berapa harga menunggunya? Di sini nilai informasinya ≈ nol (hasilnya sama) dan harganya = 2 minggu. Engineer senior menimbang keduanya; engineer junior hanya menimbang yang pertama.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 16 baris: laporan eksperimen yang “rapi” itu bohong",
    prose: [
      "Sebelum menulis rekomendasi, satu misi audit. Di bawah ini 16 baris “Kutipan Laporan Eksperimen LR”, dokumen internal yang merekomendasikan cosine_warmup karena “kurva paling mulus”. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — angka tidak bisa berbohong dua kali.",
      "Senjatamu: loss akhir per jadwal (0,34 / 0,74 / 2,00 / NaN), 31 NaN konstan_tinggi, dan step pertama < 1,0 (125 vs 140).",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-jadwal-lr-m2b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai kutipan Laporan Eksperimen LR tim yang merekomendasikan cosine_warmup karena “kurva paling mulus”.",
      columns: ["No", "Pernyataan", "Nilai"],
      rows: [
        { rowId: 1, cells: { "No": "1", "Pernyataan": "Kandidat diuji", "Nilai": "4 jadwal × 200 step" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I3: moving average tanpa dinyatakan ──
        { rowId: 2, cells: { "No": "2", "Pernyataan": "cosine_warmup — loss akhir", "Nilai": "0,30" }, claims: [{ label: "Tercatat", value: "Ya — terbaik" }] },
        { rowId: 3, cells: { "No": "3", "Pernyataan": "cosine_warmup — metode loss", "Nilai": "Rata-rata bergerak 20 step" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 4, cells: { "No": "4", "Pernyataan": "cosine_warmup — loss mentah step 200", "Nilai": "0,34" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I2: warmup fiktif ──
        { rowId: 5, cells: { "No": "5", "Pernyataan": "cosine_warmup — warmup", "Nilai": "10 step" }, claims: [{ label: "Tercatat", value: "Ya — standar" }] },
        { rowId: 6, cells: { "No": "6", "Pernyataan": "Log LR step 1–10", "Nilai": "Konstan 0,01 (tidak ada warmup)" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 7, cells: { "No": "7", "Pernyataan": "step_decay — loss akhir", "Nilai": "0,74" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 8, cells: { "No": "8", "Pernyataan": "konstan_rendah — loss akhir", "Nilai": "2,00 (macet)" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I1: segmen duplikat ──
        { rowId: 9, cells: { "No": "9", "Pernyataan": "Segmen step 100–120 (cosine)", "Nilai": "Mulus" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 10, cells: { "No": "10", "Pernyataan": "Segmen step 120–140 (cosine)", "Nilai": "Identik dengan 100–120" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I4: run divergen disembunyikan ──
        { rowId: 11, cells: { "No": "11", "Pernyataan": "konstan_tinggi — di tabel ringkasan", "Nilai": "Tidak ada" }, claims: [{ label: "Tercatat", value: "Tidak" }] },
        { rowId: 12, cells: { "No": "12", "Pernyataan": "konstan_tinggi — kenyataan", "Nilai": "Divergen, NaN dari step 170" }, claims: [{ label: "Tercatat", value: "Ya — 31 NaN" }] },
        { rowId: 13, cells: { "No": "13", "Pernyataan": "Rekomendasi laporan", "Nilai": "cosine_warmup" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 14, cells: { "No": "14", "Pernyataan": "Alasan rekomendasi", "Nilai": "Kurva paling mulus" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 15, cells: { "No": "15", "Pernyataan": "Catatan kaki metode", "Nilai": "— (tidak ada)" }, claims: [{ label: "Tercatat", value: "Tidak ada" }] },
        { rowId: 16, cells: { "No": "16", "Pernyataan": "Disetujui", "Nilai": "Ya" }, claims: [{ label: "Keputusan", value: "Disetujui" }] },
      ],
      injections: [
        { key: "segmen-duplikat", rowIds: [9, 10], title: "Kurva “mulus” hasil segmen duplikat", clue: "Dua segmen 20 step identik persis — “mulus” karena copy-paste, bukan karena training. Uji: selisih absolut kedua segmen = 0 di semua 20 step.", danger: "Kurva yang diduplikat membuat jadwal terlihat lebih stabil dari kenyataannya. Di training besar, “stabilitas” palsu ini berubah menjadi kejutan yang mahal." },
        { key: "warmup-fiktif", rowIds: [5, 6], title: "Warmup diklaim tapi tak ada di log", clue: "Laporan mengklaim warmup 10 step, tapi log LR menunjukkan 0,01 konstan dari step 1. Warmup yang tidak ada di log = tidak pernah terjadi.", danger: "Klaim tanpa jejak di data adalah fiksi — dan fiksi ini dipakai untuk menjual “standar industri” ke pengambil keputusan." },
        { key: "ma-tanpa-dinyatakan", rowIds: [2, 3, 15], title: "Loss dilaporkan sebagai moving average tanpa dinyatakan", clue: "0,30 adalah rata-rata bergerak 20-step — dan ringkasan tidak menyatakannya (catatan kaki metode: tidak ada). MA selalu terlihat lebih mulus DAN lebih rendah dari loss mentah 0,34.", danger: "Moving average tanpa label membuat angka terlihat lebih baik dari kenyataan. Aturannya sederhana: setiap agregat wajib menyebut metodenya — “loss akhir (MA-20)” bukan “loss akhir”." },
        { key: "run-disembunyikan", rowIds: [11, 12], title: "Satu run divergen disembunyikan", clue: "Tabel ringkasan hanya memuat 3 jadwal — konstan_tinggi yang divergen (31 NaN dari step 170) hilang. Laporan yang menyembunyikan kegagalan membuat “semua kandidat bagus”.", danger: "Menyembunyikan run yang gagal = menyembunyikan informasi tentang batas aman LR. Di training besar, batas itulah yang memisahkan sukses dari NaN tengah malam." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Rekomendasi jadwal untuk training besar",
    prose: [
      "Semua bukti di tangan. Tulis rekomendasi satu halaman untuk Head of ML — artefak portofoliomu. Rekomendasi yang baik tidak hanya bilang “pakai cosine”, tapi menunjukkan ANGKA perbandingannya, apa yang disembunyikan laporan eksperimen, dan apa yang dimonitor saat training besar berjalan.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): jadwal yang dipilih, angka kunci perbandingan, vonis atas 3 kandidat lain.",
        "Bukti kuantitatif: loss akhir, loss minimum, dan NaN per jadwal + step pertama mencapai loss < 1,0 — dari log mentah.",
        "Temuan audit laporan: 4 sabotase di laporan eksperimen, baris per baris.",
        "Rencana eksekusi: jadwal yang dipakai di training besar + apa yang dimonitor (cek NaN per N step, ambang henti) — rujuk pilihanmu di Langkah 5.",
        "Batas & risiko sisa: apa yang TIDAK dibuktikan uji 200 step ini (mis. data sintetis; perilaku di 2 minggu training nyata bisa berbeda; warmup 10 step belum tentu optimal).",
      ],
      rubric: [
        { criterion: "Kebenaran perbandingan", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "Loss akhir 0,34/0,74/2,00/NaN + pertama <1,0 di 125 vs 140 — semua tepat"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa nomor baris", "Keempat sabotase disebut dengan nomor baris"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa angka pendukung", "Ada angka, tanpa rencana monitoring", "Rekomendasi + angka + monitoring NaN & ambang henti eksplisit"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim uji 200 step membuktikan segalanya", "Menyebut sebagian batas", "Batas (sintetis, 200 step ≠ 2 minggu) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan eksperimen:",
      "1) **Segmen duplikat** (baris 9–10): step 100–120 dan 120–140 identik persis. “Mulus” karena copy-paste. Uji duplikasi semurah membandingkan selisih — tapi tidak ada yang melakukannya sebelum laporan disetujui.",
      "2) **Warmup fiktif** (baris 5–6): diklaim 10 step, log menunjukkan LR konstan 0,01 dari step 1. Klaim tanpa jejak di data = fiksi yang dipakai menjual “standar industri”.",
      "3) **MA tanpa dinyatakan** (baris 2–3, 15): “loss akhir 0,30” adalah moving average 20-step; loss mentah 0,34. Tanpa catatan kaki metode, pembaca tidak bisa tahu angka apa yang sedang dibaca.",
      "4) **Run disembunyikan** (baris 11–12): konstan_tinggi (31 NaN) tidak ada di tabel ringkasan. Laporan yang hanya memuat kandidat yang “bagus” bukan laporan — itu brosur.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim laporan terhadap log mentah, atau memercayai gambar kurvanya. Dan ingat keputusan bercabangmu: bahkan opsi “benar” (cosine) benar karena ANGKAnya, bukan karena label “standar industri”. Engineer terbaik bukan yang paling hafal best practice, melainkan yang paling rajin memverifikasi.",
      "Bahaya nyata terakhir: training besar yang divergen di tengah malam tidak membangunkan siapa-siapa — ia hanya membakar GPU sampai pagi, lalu menyerahkan tagihan. Itulah kenapa rekomendasi yang baik selalu ditemani monitoring: cek NaN tiap N step + ambang henti otomatis. Jadwal yang baik tanpa monitoring = harapan, bukan engineering.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: “standar industri” = pasti cocok",
      type: "risk",
      body: "Cosine + warmup memang standar industri — tapi standar adalah titik AWAL, bukan vonis. Standar bisa kedaluwarsa, dan konteksmu (data, model, budget step) belum tentu konteks si pembuat standar. Di misi ini cosine memang menang — tapi ia menang karena angka (125, 0,34, 0 NaN), bukan karena gelarnya. Selalu uji standar di datamu sendiri sebelum komit 8 GPU.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Perbandingan kuantitatif: cosine_warmup (akhir 0,34, <1,0 di step 125, 0 NaN) > step_decay (0,74, step 140) > konstan_tinggi (divergen, 31 NaN) > konstan_rendah (macet di 2,00).",
      "Empat pola sabotase laporan eksperimen: segmen duplikat, warmup fiktif, moving average tanpa dinyatakan, run divergen disembunyikan.",
      "Keputusan atas training besar selalu punya harga: cosine (terbaik berdasar angka), step-decay (mudah dijelaskan, 2× lebih buruk), tuning ulang (konfirmasi tanpa informasi baru, slot GPU hilang).",
      "Divergensi tidak selalu dramatis — turun dulu, merayap naik, lalu NaN; tanpa cek NaN eksplisit ia terlewat.",
      "Data: SINTETIS seed 42 (bukan log nyata), 800 baris, dibekukan 2026-10-15; 200 step ≠ 2 minggu training nyata.",
    ],
  },
];

(misiLrSched.steps as V2Step[]).push(...LANJUTAN_LR);
