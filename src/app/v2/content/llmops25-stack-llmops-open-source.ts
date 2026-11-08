import type { V2Lesson } from "../lib/types";

export const llmops25: V2Lesson = {
  slug: "llmops25-stack-llmops-open-source",
  track: "LLMOps",
  module: "Deployment",
  title: "LLMOps25 — Stack LLMOps Open-Source: vLLM, LiteLLM & Langfuse",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga tool open-source yang menggantikan satu vendor — dengan tagihan 57 persen lebih murah",
      prose: [
        "NusaBank membayar $2.800/bulan untuk API LLM. Tim membangun stack open-source sendiri: vLLM untuk serving (continuous batching, PagedAttention), LiteLLM sebagai gateway (satu API untuk banyak model + fallback), dan Langfuse untuk observabilitas (trace, skor judge, biaya per request). Total: $1.200/bulan untuk GPU + hosting — hemat $1.600, yaitu 57,1 persen. Latensi end-to-end: retrieval 120 ms + rerank 80 ms + generasi 900 ms + gateway 15 ms = 1.115 ms, di bawah SLO 1.500 ms dengan headroom 385 ms.",
        "Stack open-source bukan 'alternatif murah' — ia paket yang utuh: serving, gateway, observabilitas, evaluasi, dan registry, masing-masing tool terbaik di kelasnya, dirangkai dengan kontrak yang jelas. Keunggulannya: tidak ada lock-in, biaya transparan, dan tiap komponen bisa diganti tanpa membongkar semuanya. Harganya: kamu yang mengoperasikannya.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan peran tiap komponen stack; (2) menghitung anggaran latensi end-to-end; (3) menghitung penghematan vs API; (4) merancang fallback dan routing di gateway; (5) memutuskan kapan stack OSS tepat dan kapan API menang.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "LLMOps13 mengajarkan inference self-hosted (vLLM/TGI) sebagai ENGINE, LLMOps21 mengajarkan gateway & semantic caching, dan LLMOps7 mengajarkan observabilitas. Tidak ada lesson yang merangkai semuanya sebagai SATU PAKET stack open-source — serving + gateway + observabilitas + evaluasi + registry dengan anggaran latensi dan biaya end-to-end. Lesson ini membangun paket itu.",
      },
      reference: "Latensi 1.115 ms vs SLO 1.500 ms (headroom 385 ms); biaya $1.200 vs $2.800 (hemat 57,1 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merakit stack LLMOps sendiri — dan mempertahankannya dengan angka.",
        "(1) Menjelaskan peran vLLM, LiteLLM, Langfuse, dan registry;",
        "(2) Menghitung anggaran latensi end-to-end per hop;",
        "(3) Menghitung total biaya stack vs API;",
        "(4) Merancang fallback gateway (model utama gagal → cadangan);",
        "(5) Menjelaskan kapan stack OSS menang dan kapan API lebih murah.",
      ],
      tasks: [],
    },
    {
      id: "komponen",
      eyebrow: "Langkah 3 · Teori",
      title: "Lima komponen, lima kontrak",
      prose: [
        "Serving — vLLM: menjalankan model dengan continuous batching dan PagedAttention (LLMOps13). Kontraknya: menerima prompt, mengembalikan token + metrik (TTFT, throughput). Satu-satunya komponen yang menyentuh GPU — dan satu-satunya yang butuh keahlian GPU.",
        "Gateway — LiteLLM: satu API yang berbicara ke banyak backend (vLLM lokal, API vendor sebagai cadangan). Kontraknya: routing (model A ke vLLM, model B ke API), fallback (vLLM gagal → cadangan otomatis), dan rate limit per kunci. Fallback adalah alasan gateway ada: tanpa itu, satu komponen gagal mematikan seluruh sistem. Tetapi fallback ke API vendor hanya sah bila data BOLEH keluar: bila data tidak boleh meninggalkan infrastruktur sendiri (UU PDP, perbankan), fallback eksternal melanggar batas data — fallback-nya harus internal (vLLM cadangan di region yang sama) atau degraded mode yang menolak dengan sopan, bukan ke API vendor.",
        "Observabilitas — Langfuse: trace tiap request (prompt, model, token, latensi, skor judge) dalam satu ID. Kontraknya: setiap request bisa ditelusuri dari skor buruk kembali ke prompt dan retrieval-nya. Tanpa trace, debugging LLM adalah menebak.",
        "Evaluasi — skor judge berjalan + golden set (MLOps19): tiap rilis model diuji sebelum naik; tiap hari, sampel request dinilai judge. Registry — MLflow atau file berversi: model mana yang di produksi, dengan hash dataset dan skornya (LLMOps8). Lima komponen, lima kontrak — ganti satu, empat lainnya tidak peduli.",
      ],
      tasks: [],
      note: {
        title: "Stack adalah produk, bukan tumpukan tool",
        body: "Merakit lima tool tanpa kontrak antar-komponen menghasilkan lima masalah yang saling menyalahkan. Tulis kontraknya: format request/response, nama metrik, dan pemilik tiap komponen. Stack yang kontraknya tertulis bisa dioperasikan bergiliran; stack yang kontraknya 'di kepala si pembuat' mati saat ia cuti.",
      },
      reference: "vLLM = serving; LiteLLM = gateway + fallback; Langfuse = trace; judge = evaluasi; registry = versi.",
    },
    {
      id: "anggaran",
      eyebrow: "Langkah 4 · Teori",
      title: "Anggaran latensi & biaya: dua neraca stack",
      prose: [
        "Neraca latensi (SLO 1.500 ms): retrieval 120 ms + rerank 80 ms + generasi 900 ms + gateway 15 ms = 1.115 ms. Headroom = 1.500 - 1.115 = 385 ms. Headroom ini bukan sisa yang boleh dihamburkan — ia penyangga untuk lonjakan (retrieval lambat saat indeks dingin, generasi panjang saat jawaban bertele-tele). Bila satu hop membengkak 400 ms, SLO jebol. Aturan: tiap hop punya anggaran sendiri; hop yang melewati anggarannya di-alert, bukan ditoleransi diam-diam.",
        "Neraca biaya: API $2.800/bulan vs stack OSS $1.200/bulan (GPU + hosting + storage) — hemat $1.600, yaitu (2.800-1.200)/2.800 = 57,1 persen. Tetapi hitung JUGA biaya operasi: engineer yang menjaga stack (misalnya 20 persen waktu satu engineer). Bila biaya engineer melebihi $1.600/bulan, API justru lebih murah. Stack OSS menang bila: volume besar (biaya GPU terbagi), tim punya keahlian, dan data tidak boleh keluar. API menang bila: volume kecil, tim kecil, atau kecepatan rilis lebih penting dari biaya.",
        "Titik impas yang jujur: stack OSS butuh volume di atas break-even (LLMOps13) DAN tim yang bisa mengoperasikannya. Tim yang membangun stack lalu tidak punya siapa pun yang menjaganya akan membayar dua kali: biaya GPU + biaya API darurat saat stack mati.",
      ],
      tasks: [],
      note: {
        title: "Fallback API bukan pengkhianatan OSS",
        body: "Stack OSS yang sehat PUNYA fallback ke API vendor — untuk saat GPU mati atau trafik meledak. Fallback bukan kekalahan; ia asuransi. Dengan satu syarat: fallback ke API vendor hanya sah bila data request boleh keluar. Bila tidak boleh, fallback API bukan asuransi — ia pelanggaran batas data; di kasus itu fallback harus internal (cadangan di region yang sama) atau degraded mode. Yang penting: fallback diuji tiap bulan (bukan saat insiden), dan biayanya dianggarkan. Gateway yang tidak pernah menguji fallback-nya akan menemukan fallback-nya rusak di saat yang paling buruk.",
      },
      reference: "Latensi 1.115 ms, headroom 385 ms; hemat 57,1 persen ($1.600/bulan).",
    },
    {
      id: "lab-stack",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: anggaran latensi dan penghematan stack",
      prose: [
        "Lab ini menghitung dua neraca stack dari angka mentah: latensi end-to-end + headroom, dan penghematan biaya vs API.",
        "Hitung dulu di kepala. Latensi total: 120 + 80 + 900 + 15 = 1.115 ms. Headroom: 1.500 - 1.115 = 385 ms. Hemat biaya: 2.800 - 1.200 = $1.600; persen hemat: 1.600 / 2.800 x 100 = 57,1 persen.",
        "Tugas lab: hitung empat angka dan cetak masing-masing di baris sendiri: latensi_total, headroom, hemat_dolar, hemat_persen. Empat angka ini adalah neraca stack — dengan ini 'stack kami lebih murah dan cukup cepat' menjadi klaim yang bisa diaudit.",
        "Setelah lolos, coba eksperimen: naikkan generasi menjadi 1.300 ms dan lihat headroom menjadi -15 ms — SLO jebol. Lalu tanyakan: hop mana yang kamu potong duluan, dan berapa biayanya?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `latensi_total` dan `headroom` terhadap SLO 1.500 ms" },
        { id: "t2", text: "Hitung `hemat_dolar` dan `hemat_persen` vs API $2.800" },
      ],
      expected: "latensi_total=1115\nheadroom=385\nhemat_dolar=1600\nhemat_persen=57.1",
      hints: [
        "Latensi total = jumlah keempat hop.",
        "Headroom = SLO - latensi total.",
        "Hemat persen = (API - stack) / API x 100; bulatkan 1 desimal.",
      ],
      code: {
        starter: `# Neraca stack OSS: latensi + biaya.\nretrieval, rerank, generasi, gateway = 120, 80, 900, 15\nslo_ms = 1500\nbiaya_api, biaya_stack = 2800, 1200\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nlatensi_total = \nheadroom = \nhemat_dolar = \nhemat_persen = \n\nprint(f"latensi_total={latensi_total}")\nprint(f"headroom={headroom}")\nprint(f"hemat_dolar={hemat_dolar}")\nprint(f"hemat_persen={round(hemat_persen, 1)}")`,
        lockLines: 3,
        solution: `# Neraca stack OSS: latensi + biaya.\nretrieval, rerank, generasi, gateway = 120, 80, 900, 15\nslo_ms = 1500\nbiaya_api, biaya_stack = 2800, 1200\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nlatensi_total = retrieval + rerank + generasi + gateway\nheadroom = slo_ms - latensi_total\nhemat_dolar = biaya_api - biaya_stack\nhemat_persen = hemat_dolar / biaya_api * 100\n\nprint(f"latensi_total={latensi_total}")\nprint(f"headroom={headroom}")\nprint(f"hemat_dolar={hemat_dolar}")\nprint(f"hemat_persen={round(hemat_persen, 1)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "latensi_total", value: 1115, tol: 1e-9, label: "`latensi_total` seharusnya 1115", msg: "120+80+900+15 = 1.115 ms." },
          { kind: "equal", task: "t1", name: "headroom", value: 385, tol: 1e-9, label: "`headroom` seharusnya 385", msg: "1.500-1.115 = 385 ms." },
          { kind: "equal", task: "t2", name: "hemat_dolar", value: 1600, tol: 1e-9, label: "`hemat_dolar` seharusnya 1600", msg: "2.800-1.200 = $1.600." },
          { kind: "equal", task: "t2", name: "hemat_persen", value: 57.1, tol: 0.1, label: "`hemat_persen` seharusnya 57.1", msg: "1.600/2.800 = 57,1 persen." },
        ],
      },
      reference: "Latensi 1.115 ms; headroom 385 ms; hemat $1.600 (57,1 persen).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: rakit, beli, atau campur",
      prose: [
        "Skenario 1 — Volume besar, tim punya keahlian GPU, data sensitif. → Stack OSS penuh. Alasan: hemat 57 persen + kontrol penuh.",
        "Skenario 2 — Volume kecil, tim 2 orang, butuh rilis minggu ini. → API vendor. Alasan: stack OSS butuh operator; API butuh kartu kredit.",
        "Skenario 3 — Volume menengah, butuh kontrol tetapi takut downtime. → Hybrid: vLLM utama + API sebagai fallback via LiteLLM. Alasan: hemat saat normal, selamat saat darurat — dengan syarat data boleh keluar; bila tidak, fallback harus internal (lihat Langkah 3).",
        "Skenario 4 — Regulasi melarang data keluar, tetapi tim tidak punya keahlian GPU. → Managed platform (LLMOps23) atau vendor lokal. Alasan: OSS tanpa operator adalah liabilitas.",
        "Skenario 5 — Stack sudah jalan 6 bulan tanpa insiden. → Tetap uji fallback tiap bulan + review biaya tiap kuartal. Alasan: stack yang tidak diuji fallback-nya akan gagal di insiden pertama.",
        "Aturan praktis: mulai dari API, pindah ke OSS saat tagihan API melebihi biaya GPU + operator. Migrasi yang didorong angka, bukan ideologi.",
      ],
      tasks: [],
      note: {
        title: "Satu stack, satu pemilik",
        body: "Stack tanpa pemilik adalah stack yang mati pelan-pelan: tidak ada yang update vLLM, tidak ada yang membaca alert Langfuse, tidak ada yang menguji fallback. Tunjuk satu pemilik stack (bukan 'tim') dengan waktu yang dialokasikan — 20 persen waktunya untuk menjaga stack. Tanpa itu, hemat 57 persen adalah ilusi yang berakhir di insiden.",
      },
      reference: "Besar + ahli = OSS; kecil + cepat = API; menengah = hybrid.",
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
        "vLLM = serving; LiteLLM = gateway + fallback; Langfuse = trace.",
        "Latensi 1.115 ms vs SLO 1.500 ms — headroom 385 ms.",
        "Biaya $1.200 vs $2.800 — hemat 57,1 persen.",
        "Fallback API adalah asuransi, bukan pengkhianatan.",
        "Stack butuh pemilik + uji fallback bulanan + review kuartalan.",
      ],
      next: { label: "LLMOps26 — Safety Score Berkelanjutan: Keamanan yang Diukur Tiap Rilis", href: "/v2/learn/llmops26-safety-score-berkelanjutan" },
      quiz: [
        {
          q: "Latensi: retrieval 120 + rerank 80 + generasi 900 + gateway 15 ms. SLO 1.500 ms. Berapa headroom?",
          options: [
            { text: "385 ms", why: "Tepat: total 1.115; 1.500 - 1.115 = 385.", correct: true },
            { text: "1.115 ms — itu totalnya, bukan headroom", why: "Salah: 1.115 adalah total latensi; headroom adalah sisa ke SLO." },
            { text: "15 ms — hanya gateway", why: "Salah: headroom dihitung dari total, bukan satu hop." },
            { text: "0 — SLO sudah habis", why: "Salah: total 1.115 masih di bawah 1.500; sisa 385 ms." },
          ],
        },
        {
          q: "API $2.800 vs stack $1.200. Berapa hematnya?",
          options: [
            { text: "$1.600 (57,1 persen)", why: "Tepat: (2.800-1.200)/2.800 = 57,1 persen.", correct: true },
            { text: "$1.200 (42,9 persen)", why: "Salah: $1.200 adalah biaya stack, bukan hematnya." },
            { text: "$2.800 (100 persen)", why: "Salah: stack tidak gratis; hematnya selisih, bukan seluruh tagihan API." },
            { text: "$400 (14,3 persen)", why: "Salah: 400 bukan selisih 2.800 dan 1.200." },
          ],
        },
        {
          q: "Mengapa gateway (LiteLLM) penting dalam stack?",
          options: [
            { text: "Karena ia menjalankan model", why: "Salah: itu tugas vLLM; gateway merutekan dan memberi fallback." },
            { text: "Routing + fallback: vLLM gagal, request pindah ke cadangan (API bila data boleh keluar, internal bila tidak)", why: "Tepat: tanpa fallback, satu komponen gagal mematikan sistem — tetapi fallback eksternal hanya sah bila data boleh keluar.", correct: true },
            { text: "Karena ia menyimpan trace", why: "Salah: itu tugas Langfuse." },
            { text: "Karena ia melatih model", why: "Salah: gateway tidak melatih apa pun." },
          ],
        },
        {
          q: "Stack OSS hemat 57 persen tetapi tim tidak punya operator GPU. Apa yang benar?",
          options: [
            { text: "Bangun saja — hematnya sepadan", why: "Salah: OSS tanpa operator adalah liabilitas; hemat 57 persen ilusi bila stack mati." },
            { text: "API atau managed — OSS butuh pemilik dengan waktu yang dialokasikan", why: "Tepat: biaya operator harus masuk hitungan; tanpa itu, API lebih murah.", correct: true },
            { text: "Bangun stack lalu serahkan ke tim lain", why: "Salah: menyerahkan tanpa pemilik dan waktu adalah cara stack mati pelan-pelan." },
            { text: "Bangun setengah stack saja", why: "Salah: setengah stack tanpa observabilitas/fallback lebih berbahaya dari API." },
          ],
        },
        {
          q: "Kapan fallback API harus diuji?",
          options: [
            { text: "Saat insiden — saat dibutuhkan", why: "Salah: fallback yang pertama kali diuji saat insiden sering rusak." },
            { text: "Tiap bulan, terjadwal — bukan saat insiden", why: "Tepat: asuransi yang tidak pernah dites adalah harapan, bukan asuransi.", correct: true },
            { text: "Tidak perlu — API vendor selalu siap", why: "Salah: kredensial kedaluwarsa, kuota habis, format berubah — semua bisa merusak fallback diam-diam." },
            { text: "Sekali saat pembangunan", why: "Salah: sekali tidak cukup; konfigurasi dan kredensial berubah seiring waktu." },
          ],
        },
      ],
    },
  ],
};
