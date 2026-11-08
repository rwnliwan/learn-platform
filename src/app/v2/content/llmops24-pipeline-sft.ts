import type { V2Lesson } from "../lib/types";

export const llmops24: V2Lesson = {
  slug: "llmops24-pipeline-sft",
  track: "LLMOps",
  module: "Training Ops",
  title: "LLMOps24 — Pipeline SFT End-to-End: dari Data ke Model Terlatih",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Fine-tune yang jalan 3 jam — untuk dataset yang salah",
      prose: [
        "Tim NusaBank menjalankan SFT (supervised fine-tuning) untuk chatbot CS: 5.000 contoh, 3 epoch, 7,68 juta token, 640 detik di GPU — 10,67 menit yang terasa cepat. Masalahnya ditemukan setelah training: 12 persen contoh duplikat, 300 contoh berformat salah, dan 40 contoh mengandung jawaban yang bertentangan. Model yang dihasilkan sopan, konsisten — dan konsisten salah pada 40 kasus itu. Training-nya sukses; pipeline-nya gagal.",
        "SFT bukan 'jalankan training' — ia pipeline: kurasi data → tokenisasi + packing → training → evaluasi gerbang → registry → deploy canary. Tiap tahap punya gerbang; tiap gerbang punya angka. LLMOps8 mengajarkan operasi adapter (LoRA, registry, gerbang evaluasi) — lesson ini membangun ORKESTRASI end-to-end-nya: bagaimana tahap-tahap itu dirangkai, dijadwalkan, dan diawasi sebagai satu pipeline.",
        "Setelah lesson ini kamu bisa: (1) menghitung token dan waktu training SFT; (2) menjelaskan packing dan penghematannya; (3) merancang gerbang data sebelum training; (4) menjelaskan orkestrasi pipeline (DAG, retry, checkpoint); (5) memutuskan kapan SFT tepat vs RAG vs prompt.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "LLMOps8 membahas fine-tuning sebagai operasi adapter (kapan fine-tune, LoRA, registry, gerbang evaluasi, retrain) dan LLMOps22 membahas RLHF/DPO. Tidak ada lesson pipeline SFT end-to-end TERORKESTRASI — kurasi data, tokenisasi, packing, DAG training, checkpoint, dan deploy sebagai satu alur yang dijadwalkan. Lesson ini membangunnya, dengan lab yang menghitung token, waktu, dan penghematan packing.",
      },
      reference: "5.000 contoh x 512 token = 2,56 juta token/epoch; 3 epoch = 7,68 juta token; 640 detik (10,67 menit); packing hemat 768 ribu token/epoch (23,1 persen dari total tanpa packing).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan SFT sebagai pipeline — bukan sebagai notebook yang dijalankan manual.",
        "(1) Menghitung token total dan waktu training dari ukuran dataset;",
        "(2) Menghitung penghematan packing vs padding;",
        "(3) Merancang gerbang data (dedup, format, kontradiksi);",
        "(4) Menjelaskan DAG pipeline SFT dan kebijakan retry/checkpoint;",
        "(5) Menjelaskan gerbang evaluasi pasca-training sebelum registry.",
      ],
      tasks: [],
    },
    {
      id: "data-token",
      eyebrow: "Langkah 3 · Teori",
      title: "Data & token: gerbang sebelum satu GPU menyala",
      prose: [
        "Hitung dulu anggarannya. Dataset 5.000 contoh, rata-rata 512 token per contoh = 2.560.000 token per epoch. Tiga epoch = 7.680.000 token. Pada throughput 12.000 token/detik, waktu training = 7.680.000 / 12.000 = 640 detik = 10,67 menit. Angka ini menentukan segalanya: biaya GPU, jadwal pipeline, dan apakah 3 epoch masuk akal — bila waktunya 10 jam bukan 10 menit, keputusan epoch-nya berubah.",
        "Packing menghemat token yang terbuang. Tanpa packing, tiap contoh di-padding ke panjang maksimum: rata-rata 30 persen token adalah padding — 2.560.000 x 1,3 = 3.328.000 token per epoch, boros 768.000 token per epoch. Dengan packing (gabungkan contoh-contoh pendek menjadi satu sekuens penuh dengan attention mask yang benar), padding mendekati nol. Penghematan 768.000 token per epoch adalah 23,1 persen dari total 3.328.000 token tanpa packing — 30 persen adalah overhead padding terhadap 2.560.000 token BERGUNA, bukan bagian tagihan yang dihemat. Jangan tertukar: tagihan dihitung dari total tanpa packing, jadi yang dihemat dari tagihan adalah 23,1 persen — tanpa mengubah satu bobot pun.",
        "Gerbang data sebelum training (tiga pemeriksaan, semuanya otomatis): dedup (12 persen duplikat di cerita = 600 contoh yang memberi bobot 2x pada pola yang sama — hapus), format (300 contoh berformat salah — perbaiki atau buang), kontradiksi (40 contoh dengan jawaban bertentangan untuk pertanyaan sama — audit manusia, karena model yang dilatih pada kontradiksi belajar menjawab acak). Pipeline yang melewatkan gerbang data akan melatih model yang salah dengan sangat efisien.",
      ],
      tasks: [],
      note: {
        title: "Kualitas mengalahkan kuantitas di SFT",
        body: "Untuk SFT, 1.000 contoh berkualitas mengalahkan 10.000 contoh berantakan — literatur dan praktik sepakat. Alasannya: SFT mengajarkan FORMAT dan perilaku, bukan pengetahuan baru; contoh yang salah format mengajarkan perilaku yang salah. Anggaran kurasi data SFT harus lebih besar dari anggaran komputasinya — kebalikan dari pretraining.",
      },
      reference: "2,56 juta token/epoch; 7,68 juta total; 640 detik; packing hemat 768 ribu token/epoch (23,1 persen dari total tanpa packing).",
    },
    {
      id: "orkestrasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Orkestrasi: DAG, checkpoint, dan gerbang evaluasi",
      prose: [
        "Pipeline SFT sebagai DAG (MLOps23): prepare_data (kurasi + dedup + tokenisasi) → train (dengan checkpoint tiap 500 langkah) → evaluate (golden set + forgetting check) → register (bila lolos gerbang) → deploy_canary (LLMOps10). Tiap task punya retry hanya untuk kegagalan sementara (OOM transient, network) — kegagalan gerbang data atau evaluasi TIDAK di-retry; ia butuh manusia.",
        "Checkpoint adalah asuransi training: simpan tiap 500 langkah + saat loss anomali. Bila training crash di langkah 2.400, lanjut dari checkpoint 2.000 — bukan dari nol. Biaya checkpoint: storage + waktu simpan; manfaatnya: jam GPU yang diselamatkan. Aturan: checkpoint lebih sering dari yang kamu kira perlu — crash selalu terjadi di langkah yang paling mahal.",
        "Gerbang evaluasi pasca-training (LLMOps8): skor golden set agregat di atas 85 persen DAN penurunan kategori terburuk tidak lebih dari 5 poin (anti-forgetting). Satu syarat yang membuat angka 85 persen itu berarti: golden set HARUS disjoin dari data training — bila satu contoh evaluasi bocor ke training, model menghafalnya dan skor 85 persen itu palsu. Periksa kebocoran SEBELUM training (dedup silang train vs golden set, termasuk parafrasa yang hampir sama) — gerbang yang bocor memberi lolos palsu. Bila gagal, adapter berstatus 'retired' dengan alasan — bukan dihapus, bukan di-deploy. Registry mencatat semuanya: hash dataset, hyperparameter, skor per kategori, status. Pipeline yang tidak punya gerbang ini adalah pipa yang mengalirkan apa saja ke produksi.",
      ],
      tasks: [],
      note: {
        title: "SFT vs RAG vs prompt — putuskan sebelum pipeline jalan",
        body: "Butuh nada konsisten → SFT. Butuh pengetahuan yang berubah tiap bulan → RAG (jangan SFT). Butuh perilaku baru yang bisa dijelaskan dalam instruksi → prompt. Pipeline SFT yang dijalankan untuk masalah yang seharusnya RAG adalah 10 menit GPU yang menghasilkan model usang bulan depan. Keputusan arsitektur dibuat SEBELUM DAG jalan — bukan setelah model selesai dilatih.",
      },
      reference: "DAG: data → train → evaluate → register → canary. Gerbang: 85 persen + delta_min -5.",
    },
    {
      id: "lab-sft",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: token, waktu, dan penghematan packing",
      prose: [
        "Lab ini menghitung anggaran pipeline SFT dari angka mentah: token per epoch, token total, waktu training, dan penghematan packing.",
        "Hitung dulu di kepala. Token per epoch: 5.000 x 512 = 2.560.000. Total 3 epoch: 7.680.000. Waktu: 7.680.000 / 12.000 = 640 detik = 10,67 menit. Tanpa packing: 2.560.000 x 1,3 = 3.328.000 token per epoch — boros 768.000 token per epoch.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: token_epoch, token_total, waktu_menit, tanpa_packing, hemat_token. Lima angka ini adalah anggaran training — dengan ini kamu bisa menjawab 'berapa lama dan berapa biaya' sebelum GPU dinyalakan.",
        "Setelah lolos, coba eksperimen: naikkan epoch menjadi 5 dan lihat waktu menjadi 17,78 menit — lalu tanyakan: apakah 2 epoch tambahan sepadan dengan risiko overfitting pada 5.000 contoh?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `token_epoch` dan `token_total` (3 epoch)" },
        { id: "t2", text: "Hitung `waktu_menit` pada 12.000 token/detik" },
        { id: "t3", text: "Hitung `tanpa_packing` dan `hemat_token` per epoch" },
      ],
      expected: "token_epoch=2560000\ntoken_total=7680000\nwaktu_menit=10.67\ntanpa_packing=3328000\nhemat_token=768000",
      hints: [
        "Token per epoch = contoh x token per contoh.",
        "Waktu menit = token total / throughput / 60; bulatkan 2 desimal.",
        "Tanpa packing = token_epoch x 1,3; hemat = tanpa_packing - token_epoch.",
      ],
      code: {
        starter: `# Anggaran pipeline SFT: token, waktu, packing.\ncontoh = 5000\ntoken_per_contoh = 512\nepoch = 3\nthroughput = 12000  # token/detik\nfaktor_padding = 1.3\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ntoken_epoch = \ntoken_total = \nwaktu_menit = \ntanpa_packing = \nhemat_token = \n\nprint(f"token_epoch={token_epoch}")\nprint(f"token_total={token_total}")\nprint(f"waktu_menit={round(waktu_menit, 2)}")\nprint(f"tanpa_packing={tanpa_packing}")\nprint(f"hemat_token={hemat_token}")`,
        lockLines: 5,
        solution: `# Anggaran pipeline SFT: token, waktu, packing.\ncontoh = 5000\ntoken_per_contoh = 512\nepoch = 3\nthroughput = 12000  # token/detik\nfaktor_padding = 1.3\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ntoken_epoch = contoh * token_per_contoh\ntoken_total = token_epoch * epoch\nwaktu_menit = token_total / throughput / 60\ntanpa_packing = int(token_epoch * faktor_padding)\nhemat_token = tanpa_packing - token_epoch\n\nprint(f"token_epoch={token_epoch}")\nprint(f"token_total={token_total}")\nprint(f"waktu_menit={round(waktu_menit, 2)}")\nprint(f"tanpa_packing={tanpa_packing}")\nprint(f"hemat_token={hemat_token}")`,
        checks: [
          { kind: "equal", task: "t1", name: "token_epoch", value: 2560000, tol: 1e-9, label: "`token_epoch` seharusnya 2560000", msg: "5.000 x 512 = 2.560.000." },
          { kind: "equal", task: "t1", name: "token_total", value: 7680000, tol: 1e-9, label: "`token_total` seharusnya 7680000", msg: "2.560.000 x 3 = 7.680.000." },
          { kind: "equal", task: "t2", name: "waktu_menit", value: 10.67, tol: 0.01, label: "`waktu_menit` seharusnya 10.67", msg: "7.680.000 / 12.000 / 60 = 10,67 menit." },
          { kind: "equal", task: "t3", name: "tanpa_packing", value: 3328000, tol: 1e-9, label: "`tanpa_packing` seharusnya 3328000", msg: "2.560.000 x 1,3 = 3.328.000." },
          { kind: "equal", task: "t3", name: "hemat_token", value: 768000, tol: 1e-9, label: "`hemat_token` seharusnya 768000", msg: "3.328.000 - 2.560.000 = 768.000 token/epoch." },
        ],
      },
      reference: "2,56 juta/epoch; 7,68 juta total; 10,67 menit; packing hemat 768 ribu/epoch (23,1 persen dari total tanpa packing).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: kapan pipeline SFT jalan",
      prose: [
        "Skenario 1 — 500-2.000 contoh berkualitas, butuh nada konsisten. → SFT LoRA (LLMOps8). Alasan: murah, cepat, dan cukup untuk perilaku.",
        "Skenario 2 — Pengetahuan berubah tiap bulan. → Jangan SFT; RAG. Alasan: model SFT membeku saat training selesai; RAG membaca dokumen terbaru.",
        "Skenario 3 — Dataset kotor (duplikat, kontradiksi). → Berhenti; kurasi dulu. Alasan: pipeline yang melatih data kotor menghasilkan model yang salah dengan efisien.",
        "Skenario 4 — Butuh SFT + preferensi manusia (nada + keamanan). → SFT dulu, lalu DPO/RLHF (LLMOps22). Alasan: SFT mengajarkan format; alignment mengajarkan preferensi. Urutannya tidak bisa dibalik.",
        "Skenario 5 — Training crash di tengah jalan. → Lanjut dari checkpoint terakhir, bukan dari nol. Alasan: checkpoint ada untuk dipakai; mengulang dari nol membuang jam GPU.",
        "Aturan praktis: pipeline SFT yang sehat bisa dijalankan ulang oleh orang lain dari nol — data berversi, DAG terdokumentasi, gerbang tertulis. Bila hanya satu orang yang bisa menjalankannya dari laptopnya, itu bukan pipeline — itu ritual.",
      ],
      tasks: [],
      note: {
        title: "Jadwal retrain SFT",
        body: "SFT bukan sekali jalan: jadwalkan retrain saat data baru terkumpul (misalnya 500 contoh baru berkualitas) atau saat evaluasi golden set turun di bawah ambang. Retrain SFT yang terjadwal (bulanan) mengalahkan retrain panik (saat insiden). Dan tiap retrain memakai pipeline yang sama — bukan notebook baru.",
      },
      reference: "SFT untuk perilaku; RAG untuk pengetahuan berubah; kurasi dulu bila data kotor.",
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
        "5.000 x 512 = 2,56 juta token/epoch; 3 epoch = 7,68 juta; 10,67 menit.",
        "Packing hemat 768 ribu token/epoch (23,1 persen dari total tanpa packing; 30 persen = overhead padding terhadap token berguna).",
        "Gerbang data: dedup, format, kontradiksi — sebelum GPU menyala.",
        "DAG: data → train → evaluate → register → canary; retry hanya untuk gagal sementara.",
        "Gerbang evaluasi: 85 persen + delta_min -5; gagal = retired.",
      ],
      next: { label: "LLMOps25 — Stack LLMOps Open-Source: vLLM, LiteLLM & Langfuse", href: "/v2/learn/llmops25-stack-llmops-open-source" },
      quiz: [
        {
          q: "5.000 contoh x 512 token, 3 epoch, 12.000 token/detik. Berapa waktu training?",
          options: [
            { text: "10,67 menit", why: "Tepat: 7.680.000 / 12.000 = 640 detik = 10,67 menit.", correct: true },
            { text: "640 menit — lupa konversi detik", why: "Salah: 640 adalah DETIK; dibagi 60 menjadi 10,67 menit." },
            { text: "3,2 menit — hanya 1 epoch", why: "Salah: total 3 epoch = 7,68 juta token, bukan 2,56 juta." },
            { text: "213 menit — throughput dibagi epoch", why: "Salah: throughput tidak dibagi epoch; token total dibagi throughput." },
          ],
        },
        {
          q: "Tanpa packing, token per epoch 3.328.000 vs 2.560.000 dengan packing. Berapa hematnya?",
          options: [
            { text: "768.000 token/epoch (23,1 persen dari total tanpa packing)", why: "Tepat: 3.328.000 - 2.560.000 = 768.000; 768.000/3.328.000 = 23,1 persen. Angka 30 persen adalah overhead padding terhadap token berguna (768.000/2.560.000) — bukan bagian tagihan yang dihemat.", correct: true },
            { text: "768 token — salah satuan", why: "Salah: selisihnya 768 RIBU, bukan 768." },
            { text: "Tidak ada hemat — padding gratis", why: "Salah: padding menghabiskan komputasi GPU yang dibayar per detik." },
            { text: "3.328.000 — semua token tanpa packing terbuang", why: "Salah: hanya padding-nya yang terbuang (768 ribu); token asli tetap berguna." },
          ],
        },
        {
          q: "Dataset SFT punya 12 persen duplikat dan 40 contoh berjawaban kontradiktif. Apa yang benar?",
          options: [
            { text: "Latih saja — model akan mengabaikan duplikat", why: "Salah: duplikat memberi bobot ganda; kontradiksi mengajarkan jawaban acak." },
            { text: "Gerbang data: hapus duplikat, audit kontradiksi manual sebelum training", why: "Tepat: pipeline yang melatih data kotor menghasilkan model yang salah dengan efisien.", correct: true },
            { text: "Tambah epoch agar model belajar melewati data kotor", why: "Salah: epoch tambahan justru memperkuat hafalan atas data yang salah." },
            { text: "Buang seluruh dataset dan mulai dari nol", why: "Salah: 88 persen data masih bagus; buang yang rusak, bukan semuanya." },
          ],
        },
        {
          q: "Training crash di langkah 2.400, checkpoint terakhir di 2.000. Apa yang benar?",
          options: [
            { text: "Ulang dari nol — checkpoint tidak bisa dipercaya", why: "Salah: checkpoint ada untuk dipakai; mengulang membuang jam GPU." },
            { text: "Lanjut dari checkpoint 2.000", why: "Tepat: itulah fungsi checkpoint.", correct: true },
            { text: "Turunkan learning rate dan ulang dari nol", why: "Salah: crash bukan soal learning rate; dan ulang dari nol tetap membuang waktu." },
            { text: "Lanjutkan tanpa checkpoint — hemat storage", why: "Salah: tanpa checkpoint, crash berikutnya mengulang semuanya lagi." },
          ],
        },
        {
          q: "Butuh pengetahuan produk yang berubah tiap bulan. SFT atau RAG?",
          options: [
            { text: "SFT tiap bulan — model selalu terbaru", why: "Salah: retrain bulanan mahal dan model membeku di antara retrain; RAG membaca dokumen terbaru." },
            { text: "RAG — pengetahuan berubah tidak cocok untuk SFT", why: "Tepat: SFT untuk perilaku; RAG untuk pengetahuan yang berubah.", correct: true },
            { text: "Prompt saja — paling murah", why: "Salah: prompt tidak bisa memuat seluruh katalog produk yang berubah." },
            { text: "SFT sekali dengan data 5 tahun ke depan", why: "Salah: data masa depan tidak ada; dan SFT tidak bisa meramal katalog baru." },
          ],
        },
      ],
    },
  ],
};
