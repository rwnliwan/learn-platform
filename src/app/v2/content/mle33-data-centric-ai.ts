import type { V2Lesson } from "../lib/types";

export const mle33: V2Lesson = {
  slug: "mle33-data-centric-ai",
  track: "Machine Learning Engineer",
  module: "Data & Kualitas",
  title: "MLE33 — Data-Centric AI: Model Bagus Lahir dari Data Bagus",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model 87,2 persen yang naik 2,4 poin tanpa menyentuh arsitektur",
      prose: [
        "Model deteksi fraud KirimCepat mentok di akurasi 87,2 persen. Tim menghabiskan sebulan mencoba arsitektur baru: transformer, ensemble lebih besar, tuning lebih dalam — naik 0,3 poin. Lalu seorang engineer berhenti menala model dan mulai memeriksa data: dari 10.000 label training, sekitar 8 persen — 800 label — diduga salah. Audit 200 label yang dicurigai mengonfirmasi 156 memang salah (presisi deteksi 78 persen). Setelah 800 label diperbaiki, akurasi naik menjadi 89,6 persen — naik 2,4 poin tanpa satu baris arsitektur pun berubah.",
        "Itulah data-centric AI: pergeseran fokus dari 'model yang lebih baik' ke 'data yang lebih baik'. Model-centric bertanya 'arsitektur apa'; data-centric bertanya 'label mana yang salah, contoh mana yang membingungkan, kelas mana yang kurang terwakili'. Dalam banyak proyek matang, data adalah tuas yang lebih besar — dan lebih murah.",
        "Lesson ini mengajarkan data-centric AI sebagai sistem: deteksi label salah, kurasi contoh, penyeimbang kelas, dan penilaian data. Setelah lesson ini kamu bisa: (1) menghitung estimasi label salah dari audit sampel; (2) menjelaskan confident learning dalam satu paragraf; (3) menghitung dampak perbaikan label pada akurasi; (4) menilai contoh dengan data valuation; (5) memutuskan kapan memperbaiki data dan kapan mengganti model.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MLE2 membahas pipeline data dan MLE7 testing model, tetapi tidak ada lesson yang menjadikan KUALITAS DATA sebagai tuas utama perbaikan model. Lesson ini mengisi kekosongan itu: deteksi label salah dengan confident learning, audit sampel dengan presisi terukur, dan data valuation — semuanya dengan angka yang dihitung, bukan slogan 'data is king'.",
      },
      reference: "800 label diduga salah (8 persen dari 10.000); audit 200 mengonfirmasi 156 (78 persen); akurasi 87,2 menjadi 89,6 persen (+2,4 poin).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memperbaiki model dengan memperbaiki datanya — dan membuktikannya dengan angka.",
        "(1) Menghitung jumlah label yang diduga salah dari estimasi error;",
        "(2) Menghitung presisi deteksi dari audit sampel;",
        "(3) Menghitung kenaikan akurasi setelah perbaikan label;",
        "(4) Menjelaskan confident learning: prediksi silang + ambang per kelas;",
        "(5) Menilai kapan membuang contoh buruk dan kapan mempertahankannya.",
      ],
      tasks: [],
    },
    {
      id: "confident-learning",
      eyebrow: "Langkah 3 · Teori",
      title: "Confident learning: biarkan model menunjuk label yang mencurigakan",
      prose: [
        "Confident learning adalah cara sistematis menemukan label salah tanpa membaca 10.000 baris manual. Langkahnya: (1) latih model dengan validasi silang sehingga tiap contoh diprediksi oleh model yang TIDAK melihatnya saat training (out-of-sample); (2) untuk tiap kelas, hitung ambang kepercayaan dari rata-rata probabilitas contoh yang labelnya kelas itu; (3) contoh yang labelnya A tetapi model yakin B (probabilitas di atas ambang B) ditandai sebagai diduga salah label.",
        "Angkanya di cerita pembuka: estimasi error 8 persen dari 10.000 = 800 contoh diduga salah. Audit manual 200 di antaranya mengonfirmasi 156 benar-benar salah — presisi deteksi 156 / 200 = 78 persen. Artinya dari 800 yang diduga, sekitar 624 memang salah (800 x 0,78). Sisa 22 persen adalah contoh yang benar tetapi sulit — justru contoh paling berharga untuk dipertahankan, karena model yang hanya belajar dari contoh mudah menjadi rapuh.",
        "Aturan: jangan hapus semua yang dicurigai. Perbaiki yang terkonfirmasi salah, pertahankan yang sulit tetapi benar, dan hapus hanya yang duplikat atau rusak (teks kosong, gambar korup). Menghapus contoh sulit karena 'mengganggu training' sama dengan menghapus soal sulit dari ujian lalu mengklaim murid jadi pintar.",
      ],
      tasks: [],
      note: {
        title: "Label salah vs contoh sulit",
        body: "Keduanya membuat loss tinggi saat training — tetapi obatnya berlawanan. Label salah: perbaiki atau hapus. Contoh sulit yang benar: PERTAHANKAN, bahkan perbanyak contoh sejenisnya. Cara membedakan: audit manusia atas sampel yang dicurigai. Tidak ada jalan pintas statistik yang menggantikan mata manusia di sini — audit 200 contoh hanya butuh 2 jam dan menyelamatkan model dari keputusan buta.",
      },
      reference: "800 diduga salah; audit 200, 156 terkonfirmasi (78 persen).",
    },
    {
      id: "kurasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Kurasi: seimbang, bersih, dan bernilai",
      prose: [
        "Tiga operasi kurasi setelah label diperbaiki. Pertama, penyeimbang kelas: bila kelas fraud hanya 2 persen dari data, model belajar 'selalu jawab bukan fraud' dan mendapat akurasi 98 persen yang menipu. Solusi: tambah contoh kelas minoritas (oversampling, data sintetis) atau beri bobot kelas — lalu ukur dengan metrik per kelas, bukan akurasi global. Kedua, deduplikasi: contoh yang sama muncul 50 kali memberi bobot 50x pada satu pola — model menghafal, bukan menggeneralisasi.",
        "Ketiga, data valuation: tidak semua contoh sama berharganya. Metode sederhana: latih model tanpa 10 persen contoh bernilai terendah (misalnya contoh yang tidak pernah memengaruhi prediksi) — bila akurasi tetap 89,6 persen dengan 9.000 contoh dari 10.000, 1.000 contoh itu tidak menambah apa-apa dan boleh dibuang untuk training yang lebih cepat. Metode formal (Shapley value untuk data) menghitung kontribusi tiap contoh — mahal, tetapi memberi jawaban per contoh, bukan per kelompok.",
        "Siklus data-centric yang benar: ukur kualitas data (label error, duplikat, keseimbangan) → perbaiki seperlunya → latih → analisis kesalahan model per slice (kelas, wilayah, waktu) → kembali ke data dengan daftar perbaikan spesifik. Model yang mentok biasanya bukan kehabisan arsitektur — ia kehabisan data yang benar.",
      ],
      tasks: [],
      note: {
        title: "Kapan berhenti memperbaiki data",
        body: "Perbaikan data punya diminishing return: 800 label pertama memberi +2,4 poin; 800 berikutnya mungkin memberi +0,4 poin. Berhenti bila: audit berikutnya menemukan error di bawah 1 persen, atau kesalahan model terkonsentrasi pada contoh yang secara inheren ambigu (bahkan manusia tidak sepakat). Pada titik itu, tuasnya kembali ke model — atau ke definisi masalahnya.",
      },
      reference: "9.000 contoh bernilai = akurasi tetap 89,6 persen; 1.000 contoh terbuang tanpa kerugian.",
    },
    {
      id: "lab-data-centric",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: audit label dan dampaknya pada akurasi",
      prose: [
        "Lab ini menghitung mesin data-centric dari angka mentah: estimasi label salah, presisi audit, kenaikan akurasi, dan penghematan dari pembuangan contoh tak bernilai.",
        "Hitung dulu di kepala. Label diduga salah: 10.000 x 0,08 = 800. Presisi audit: 156 / 200 = 0,78 (78 persen). Kenaikan akurasi: 89,6 - 87,2 = 2,4 poin. Contoh dipertahankan: 10.000 - 1.000 = 9.000 dengan akurasi tetap 89,6 persen.",
        "Tugas lab: hitung empat angka dan cetak masing-masing di baris sendiri: diduga_salah, presisi_audit, kenaikan_poin, dipertahankan. Empat angka ini adalah laporan kualitas data — lampirkan ke setiap review model, supaya 'modelnya mentok' tidak pernah lagi dijawab dengan 'coba arsitektur baru' sebelum data diperiksa.",
        "Setelah lolos, coba eksperimen: ubah estimasi error menjadi 3 persen dan lihat diduga salah menjadi 300 — lalu tanyakan: pada estimasi berapa audit manual berhenti sepadan? Jawabannya menentukan anggaran kurasi tiap kuartal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `diduga_salah` dari 10.000 label @ error 8 persen" },
        { id: "t2", text: "Hitung `presisi_audit` dari 156 terkonfirmasi dari 200 diaudit" },
        { id: "t3", text: "Hitung `kenaikan_poin` dan `dipertahankan` setelah kurasi" },
      ],
      expected: "diduga_salah=800\npresisi_audit=0.78\nkenaikan_poin=2.4\ndipertahankan=9000",
      hints: [
        "Diduga salah = total x estimasi error.",
        "Presisi = terkonfirmasi / diaudit.",
        "Kenaikan = akurasi sesudah - akurasi sebelum.",
        "Dipertahankan = total - contoh tak bernilai.",
      ],
      code: {
        starter: `# Mesin data-centric: audit label + dampak kurasi.\ntotal = 10000\nestimasi_error = 0.08\ndiaudit = 200\nterkonfirmasi = 156\nakurasi_sebelum = 87.2\nakurasi_sesudah = 89.6\ntak_bernilai = 1000\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\ndiduga_salah = \npresisi_audit = \nkenaikan_poin = \ndipertahankan = \n\nprint(f"diduga_salah={diduga_salah}")\nprint(f"presisi_audit={presisi_audit}")\nprint(f"kenaikan_poin={kenaikan_poin}")\nprint(f"dipertahankan={dipertahankan}")`,
        lockLines: 8,
        solution: `# Mesin data-centric: audit label + dampak kurasi.\ntotal = 10000\nestimasi_error = 0.08\ndiaudit = 200\nterkonfirmasi = 156\nakurasi_sebelum = 87.2\nakurasi_sesudah = 89.6\ntak_bernilai = 1000\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\ndiduga_salah = int(total * estimasi_error)\npresisi_audit = terkonfirmasi / diaudit\nkenaikan_poin = round(akurasi_sesudah - akurasi_sebelum, 1)\ndipertahankan = total - tak_bernilai\n\nprint(f"diduga_salah={diduga_salah}")\nprint(f"presisi_audit={presisi_audit}")\nprint(f"kenaikan_poin={kenaikan_poin}")\nprint(f"dipertahankan={dipertahankan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "diduga_salah", value: 800, tol: 1e-9, label: "`diduga_salah` seharusnya 800", msg: "10.000 x 0,08 = 800." },
          { kind: "equal", task: "t2", name: "presisi_audit", value: 0.78, tol: 1e-9, label: "`presisi_audit` seharusnya 0.78", msg: "156 / 200 = 0,78." },
          { kind: "equal", task: "t3", name: "kenaikan_poin", value: 2.4, tol: 1e-9, label: "`kenaikan_poin` seharusnya 2.4", msg: "89,6 - 87,2 = 2,4 poin — tanpa mengubah arsitektur." },
          { kind: "equal", task: "t3", name: "dipertahankan", value: 9000, tol: 1e-9, label: "`dipertahankan` seharusnya 9000", msg: "10.000 - 1.000 = 9.000 contoh bernilai." },
        ],
      },
      reference: "800 diduga salah; presisi audit 0,78; kenaikan 2,4 poin; 9.000 dipertahankan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: data dulu atau model dulu",
      prose: [
        "Skenario 1 — Model mentok, error terkonsentrasi di satu slice (misalnya wilayah tertentu). → Data dulu: audit label slice itu. Alasan: kesalahan berkelompok hampir selalu soal data, bukan arsitektur.",
        "Skenario 2 — Akurasi naik-turun liar antar lipatan validasi. → Data dulu: periksa duplikat dan kebocoran split. Alasan: varians liar = data tidak stabil, bukan model tidak stabil.",
        "Skenario 3 — Data sudah diaudit (error di bawah 1 persen), slice seimbang, tetapi skor tetap rendah. → Model dulu: arsitektur atau fitur baru. Alasan: tuas data sudah habis; saatnya tuas model.",
        "Skenario 4 — Kelas minoritas hampir tidak pernah terprediksi benar. → Data dulu: oversampling atau bobot kelas + metrik per kelas. Alasan: model tidak bisa belajar dari 2 persen contoh tanpa bantuan.",
        "Aturan praktis: sebelum satu jam tuning, habiskan satu jam memeriksa data — label, duplikat, keseimbangan, slice error. Satu jam itu hampir selalu memberi lebih banyak poin daripada satu jam tuning.",
      ],
      tasks: [],
      note: {
        title: "Slice error adalah kompas",
        body: "Jangan hanya melihat akurasi global 89,6 persen. Pecah per slice: kelas, wilayah, periode, segmen pelanggan. Bila satu slice 62 persen sementara global 89,6 persen, masalahmu bukan model — masalahmu adalah data slice itu. Slice error mengubah 'modelnya kurang bagus' menjadi 'data wilayah X bermasalah' — masalah yang bisa diperbaiki.",
      },
      reference: "Data dulu bila error berkelompok atau varians liar; model dulu bila data sudah bersih.",
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
        "800 label diduga salah (8 persen); audit 200 mengonfirmasi 156 (78 persen).",
        "Perbaikan label: akurasi 87,2 menjadi 89,6 persen (+2,4 poin).",
        "Confident learning: prediksi silang + ambang per kelas.",
        "9.000 contoh bernilai = akurasi tetap; 1.000 boleh dibuang.",
        "Berhenti memperbaiki data bila error audit di bawah 1 persen.",
      ],
      next: { label: "MLE34 — Survival Analysis: Memprediksi Kapan, Bukan Hanya Apakah", href: "/v2/learn/mle34-survival-analysis" },
      quiz: [
        {
          q: "10.000 label, estimasi error 8 persen. Berapa label diduga salah?",
          options: [
            { text: "800", why: "Tepat: 10.000 x 0,08 = 800.", correct: true },
            { text: "80 — 8 persen dari 1.000", why: "Salah: totalnya 10.000, bukan 1.000." },
            { text: "8.000 — 80 persen", why: "Salah: 8 persen, bukan 80 persen." },
            { text: "156 — jumlah yang terkonfirmasi", why: "Salah: 156 adalah hasil audit 200 sampel, bukan estimasi total." },
          ],
        },
        {
          q: "Audit 200 label yang dicurigai, 156 terkonfirmasi salah. Berapa presisi deteksi?",
          options: [
            { text: "0,78", why: "Tepat: 156 / 200 = 0,78.", correct: true },
            { text: "0,156 — 156 dari 1.000", why: "Salah: penyebutnya 200 yang diaudit, bukan 1.000." },
            { text: "0,80 — dibulatkan dari 800", why: "Salah: 800 adalah estimasi total, bukan hasil audit." },
            { text: "1,28 — 200 dibagi 156", why: "Salah: terbalik. Presisi = benar / diperiksa." },
          ],
        },
        {
          q: "Mengapa contoh yang dicurigai tetapi ternyata benar harus DIPERTAHANKAN?",
          options: [
            { text: "Karena menghapusnya tidak mengubah akurasi", why: "Salah: menghapus contoh sulit justru menurunkan ketahanan model." },
            { text: "Karena contoh sulit yang benar adalah yang paling berharga — model belajar dari kesulitan", why: "Tepat: 22 persen yang 'salah deteksi' adalah contoh sulit yang benar; menghapusnya = menghapus soal sulit dari ujian.", correct: true },
            { text: "Karena audit manusia tidak bisa dipercaya", why: "Salah: audit adalah sumber kebenaran di sini; yang tidak dipercaya adalah deteksi otomatisnya." },
            { text: "Karena jumlah data harus selalu 10.000", why: "Salah: jumlah bukan target; kualitas dan keterwakilan yang penting." },
          ],
        },
        {
          q: "Model tanpa 10 persen contoh terendah tetap 89,6 persen dengan 9.000 contoh. Kesimpulannya?",
          options: [
            { text: "1.000 contoh itu tidak menambah apa-apa — boleh dibuang untuk training lebih cepat", why: "Tepat: data valuation membuktikan 1.000 contoh itu tak bernilai.", correct: true },
            { text: "Model rusak — akurasi harus turun bila data dikurangi", why: "Salah: tidak semua data bernilai; data yang tak bernilai memang tidak memengaruhi skor." },
            { text: "10 persen adalah angka ajaib untuk semua dataset", why: "Salah: angka ini hasil ukur dataset ini; dataset lain bisa 2 persen atau 30 persen." },
            { text: "Contoh yang dibuang pasti labelnya salah", why: "Salah: tak bernilai bukan berarti salah label — bisa jadi duplikat atau terlalu mudah." },
          ],
        },
        {
          q: "Kapan berhenti memperbaiki data dan kembali ke model?",
          options: [
            { text: "Bila akurasi sudah 100 persen", why: "Salah: 100 persen hampir selalu berarti kebocoran, bukan kesempurnaan." },
            { text: "Bila audit menemukan error di bawah 1 persen atau kesalahan terkonsentrasi pada contoh yang inheren ambigu", why: "Tepat: tuas data sudah habis; diminishing return.", correct: true },
            { text: "Tidak pernah — data selalu bisa diperbaiki", why: "Salah: perbaikan data punya diminishing return; 800 label berikutnya mungkin hanya +0,4 poin." },
            { text: "Setelah tepat 800 label diperbaiki", why: "Salah: 800 adalah angka kasus ini, bukan aturan umum." },
          ],
        },
      ],
    },
  ],
};
