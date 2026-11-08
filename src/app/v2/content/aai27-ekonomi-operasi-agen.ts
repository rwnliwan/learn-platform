import type { V2Lesson } from "../lib/types";

export const aai27: V2Lesson = {
  slug: "aai27-ekonomi-operasi-agen",
  track: "Agentic AI Engineer",
  module: "Produksi Agen",
  title: "AAI27 — Ekonomi & Operasi Agen: Harga per Tugas yang Selesai",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Agen yang 'murah' — sampai dihitung per tugas yang SELESAI",
      prose: [
        "Agen CS NusaBank menghabiskan $1.240 untuk 10.000 tugas. Tim melaporkan 'biaya $0,124 per tugas — lebih murah dari manusia $2,50'. Lalu seseorang membagi dengan tugas yang BERHASIL: 8.200 dari 10.000 (82 persen sukses). Biaya per tugas SELESAI = $1.240 / 8.200 = $0,1512 — 94,0 persen lebih murah dari manusia per tugas selesai, tetapi 22 persen lebih mahal dari angka $0,124 yang dilaporkan. Dan 1.800 tugas gagal itu tidak hilang — mereka dikerjakan ulang manusia dengan biaya penuh ($4.500). Total operasi end-to-end = $1.240 + $4.500 = $5.740 vs $25.000 bila semua dikerjakan manusia — hemat 77,0 persen, bukan 94,0 persen. Ekonomi agen yang jujur dihitung per tugas selesai DAN total operasi, bukan per tugas dicoba.",
        "Lesson ini mengajarkan ekonomi & operasi agen: unit economics per tugas selesai, utilisasi armada, kapasitas, dan ROI. AAI15 mengajarkan kontrol biaya (budget per sesi, 3 rem) — lesson ini membangun EKONOMI-nya: apakah agen menghemat uang setelah semua biaya dihitung, dan bagaimana mengoperasikan armada agen pada skala.",
        "Setelah lesson ini kamu bisa: (1) menghitung biaya per tugas selesai; (2) menghitung penghematan vs baseline manusia; (3) menghitung utilisasi efektif armada; (4) merancang kapasitas armada dari volume; (5) memutuskan kapan agen layak secara ekonomi dan kapan tidak.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "AAI15 membahas kontrol biaya produksi (budget per sesi, 3 rem, insiden $12.000) dan AAI21 membahas automation platforms — tetapi tidak ada lesson ekonomi & operasi agen sebagai sistem (unit economics per tugas selesai, utilisasi armada, kapasitas, ROI). Lesson ini membangunnya, dengan lab yang menghitung biaya per tugas selesai dan penghematan dari angka mentah.",
      },
      reference: "$1.240 / 8.200 tugas selesai = $0,1512; hemat 94,0 persen per tugas selesai, 77,0 persen total operasi ($5.740 vs $25.000); armada 50 agen x 65 persen = 32,5 efektif.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjawab 'apakah agen ini menghemat uang' — dengan angka, bukan dengan harapan.",
        "(1) Menghitung biaya per tugas selesai (bukan per tugas dicoba);",
        "(2) Menghitung penghematan vs baseline manusia;",
        "(3) Menghitung utilisasi efektif armada agen;",
        "(4) Merancang kapasitas: berapa agen untuk volume tertentu;",
        "(5) Menjelaskan biaya tersembunyi: retry, kegagalan, dan pengawasan manusia.",
      ],
      tasks: [],
    },
    {
      id: "unit-economics",
      eyebrow: "Langkah 3 · Teori",
      title: "Unit economics: harga per tugas yang SELESAI",
      prose: [
        "Rumusnya: biaya per tugas selesai = total biaya / tugas yang berhasil. Contoh: total $1.240, 10.000 tugas dicoba, 8.200 berhasil (82 persen) — $1.240 / 8.200 = $0,1512 per tugas selesai. Bandingkan manusia: $2,50 per tugas. Penghematan per tugas selesai = (2,50 - 0,1512) / 2,50 = 94,0 persen. Angka ini jujur sebagai PERBANDINGAN PER TUGAS SELESAI — kegagalan sudah masuk hitungan lewat pembagi 8.200. Tetapi ia BUKAN penghematan total operasi: total operasi end-to-end = $1.240 (agen) + $4.500 (pengerjaan ulang manusia) = $5.740 vs $25.000 (10.000 x $2,50) — hemat 77,0 persen. Dua angka, dua pertanyaan: 94,0 persen menjawab 'berapa murah tiap tugas yang berhasil', 77,0 persen menjawab 'berapa hemat operasinya secara keseluruhan'.",
        "Biaya tersembunyi yang sering dilupakan: (1) retry — tugas gagal yang dicoba ulang 2x menggandakan tokennya; (2) pengerjaan ulang manusia — 1.800 tugas gagal dikerjakan manusia @ $2,50 = $4.500, LEBIH BESAR dari biaya agennya sendiri ($1.240); (3) pengawasan — manusia yang me-review 5 persen sampel; (4) insiden — satu loop tak terbatas semalam bisa $12.000 (AAI15). Total biaya SEBENARNYA = $1.240 + $4.500 + review + insiden. Bila total itu melebihi $25.000 (biaya manusia untuk 10.000 tugas), agen merugikan — walau 'biaya per tugas'-nya terlihat murah.",
        "Aturan: laporkan SELALU tiga angka — biaya per tugas dicoba, biaya per tugas selesai, dan biaya total termasuk pengerjaan ulang manusia. Satu angka saja adalah pemasaran; tiga angka adalah ekonomi.",
      ],
      tasks: [],
      formula: "\\mathrm{Biaya/tugas\\ selesai} = \\frac{\\mathrm{Total\\ biaya}}{\\mathrm{Tugas\\ berhasil}}",
      formulaNote: "Tugas berhasil = tugas dicoba x success rate. Pengerjaan ulang manusia dihitung terpisah sebagai biaya kegagalan.",
      note: {
        title: "Success rate adalah tuas ekonomi terbesar",
        body: "Naikkan success rate dari 82 menjadi 90 persen — DENGAN ASUMSI biaya agen tetap $1.240: tugas selesai 9.000, biaya per tugas selesai $1.240/9.000 = $0,1378, DAN pengerjaan ulang turun dari $4.500 menjadi $2.500. Angka $2.000 adalah PENURUNAN BIAYA PENGERJAAN ULANG (1.800 − 1.000 tugas × $2,50) — bukan tambahan penghematan kas yang terpisah dari penurunan biaya per tugas selesai (jangan dijumlahkan ganda), dan BUKAN manfaat bersih: biaya pengembangan/operasi untuk menaikkan kualitas (AAI24: taksonomi kegagalan, training, evaluasi) BELUM dimasukkan — manfaat bersih = $2.000 − biaya perbaikan itu. Investasi pada kualitas agen sering memberi pengembalian ekonomi lebih besar daripada negosiasi tarif token — tetapi hanya bila biaya perbaikannya lebih kecil dari $2.000 yang dihemat.",
      },
      reference: "$0,1512 per tugas selesai; hemat 94,0 persen per selesai, 77,0 persen total operasi; pengerjaan ulang $4.500.",
    },
    {
      id: "operasi-armada",
      eyebrow: "Langkah 4 · Teori",
      title: "Operasi armada: utilisasi, kapasitas, dan SLO",
      prose: [
        "Armada 50 agen dengan utilisasi 65 persen = 50 x 0,65 = 32,5 agen efektif. Utilisasi di bawah 100 persen adalah NORMAL dan sehat: agen menunggu (tugas sepi), agen gagal dan retry, agen menunggu approval manusia (AAI9). Armada dengan utilisasi 100 persen adalah armada yang tidak punya cadangan untuk lonjakan — dan akan runtuh di lonjakan pertama.",
        "Kapasitas: bila tiap agen menyelesaikan 20 tugas/jam dan volume 1.000 tugas/jam, butuh 1.000 / 20 = 50 agen efektif — dengan utilisasi 65 persen, butuh 50 / 0,65 = 77 agen terpasang. Hitungan ini menentukan anggaran: 77 agen x biaya per agen. Tanpa hitungan utilisasi, kamu akan membeli 50 dan kekurangan 27 saat lonjakan.",
        "SLO operasi agen: (1) success rate di atas 80 persen (AAI24); (2) biaya per tugas selesai di bawah ambang ($0,20); (3) waktu penyelesaian p95 di bawah 5 menit; (4) eskalasi manusia di bawah 10 persen tugas. Empat SLO ini dibaca di dashboard harian — bila satu merah 2 hari berturut-turut, investigasi; bila dua merah, hentikan deployment baru sampai pulih.",
      ],
      tasks: [],
      note: {
        title: "Armada bukan 50 agen yang sama",
        body: "Armada yang sehat punya campuran: agen cepat-murah untuk tugas mudah, agen kuat-mahal untuk tugas sulit (routing, LLMOps14), dan agen cadangan untuk lonjakan. Satu jenis agen untuk semua tugas adalah pemborosan: tugas mudah tidak butuh model termahal, tugas sulit tidak bisa dikerjakan model termurah. Routing adalah operasi, bukan optimasi.",
      },
      reference: "50 agen x 65 persen = 32,5 efektif; 77 terpasang untuk 50 efektif.",
    },
    {
      id: "lab-ekonomi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: biaya per tugas selesai dan utilisasi armada",
      prose: [
        "Lab ini menghitung ekonomi agen dari angka mentah: biaya per tugas selesai, penghematan vs manusia, dan utilisasi efektif armada.",
        "Hitung dulu di kepala. Tugas selesai: 10.000 x 0,82 = 8.200. Biaya per selesai: $1.240 / 8.200 = $0,1512. Penghematan per selesai: (2,50 - 0,1512) / 2,50 x 100 = 94,0 persen. Agen efektif: 50 x 0,65 = 32,5. Hemat total operasi: biaya semua-manusia 10.000 x 2,50 = $25.000; total operasi $1.240 + $4.500 = $5.740; hemat (25.000 - 5.740) / 25.000 x 100 = 77,0 persen.",
        "Tugas lab: hitung enam angka dan cetak masing-masing di baris sendiri: selesai, per_selesai, hemat_persen, efektif, ulang_dolar (biaya pengerjaan ulang manusia untuk tugas gagal @ $2,50), dan hemat_total (penghematan total operasi vs semua-manusia). Enam angka ini adalah laporan ekonomi agen — dengan ini 'agen menghemat uang' menjadi klaim yang bisa diaudit.",
        "Setelah lolos, coba eksperimen: naikkan success rate menjadi 90 persen dan lihat per_selesai menjadi $0,1378 dan ulang_dolar menjadi $2.500 — lalu tanyakan: berapa investasi perbaikan kualitas yang sepadan dengan penghematan itu?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selesai` (82 persen dari 10.000) dan `per_selesai`" },
        { id: "t2", text: "Hitung `hemat_persen` vs manusia $2,50" },
        { id: "t3", text: "Hitung `efektif` (50 agen @ 65 persen) dan `ulang_dolar`" },
        { id: "t4", text: "Hitung `hemat_total` (total operasi vs semua-manusia)" },
      ],
      expected: "selesai=8200\nper_selesai=0.1512\nhemat_persen=94.0\nefektif=32.5\nulang_dolar=4500.0\nhemat_total=77.0",
      hints: [
        "Selesai = total x success rate.",
        "Per selesai = total biaya / selesai; bulatkan 4 desimal.",
        "Hemat persen = (manusia - per_selesai) / manusia x 100; bulatkan 1 desimal.",
        "Ulang = tugas gagal x $2,50.",
        "Hemat total = (biaya semua-manusia - (biaya agen + ulang)) / biaya semua-manusia x 100.",
      ],
      code: {
        starter: `# Ekonomi agen: per tugas selesai + utilisasi armada.\ntotal_tugas, success_rate = 10000, 0.82\ntotal_biaya = 1240\nbiaya_manusia = 2.50\narmada, utilisasi = 50, 0.65\n\n# TULIS KODEMU: hitung enam angka di bawah ini.\nselesai = \nper_selesai = \nhemat_persen = \nefektif = \nulang_dolar = \nhemat_total = \n\nprint(f"selesai={selesai}")\nprint(f"per_selesai={round(per_selesai, 4)}")\nprint(f"hemat_persen={round(hemat_persen, 1)}")\nprint(f"efektif={efektif}")\nprint(f"ulang_dolar={ulang_dolar}")\nprint(f"hemat_total={round(hemat_total, 1)}")`,
        lockLines: 4,
        solution: `# Ekonomi agen: per tugas selesai + utilisasi armada.\ntotal_tugas, success_rate = 10000, 0.82\ntotal_biaya = 1240\nbiaya_manusia = 2.50\narmada, utilisasi = 50, 0.65\n\n# TULIS KODEMU: hitung enam angka di bawah ini.\nselesai = int(total_tugas * success_rate)\nper_selesai = total_biaya / selesai\nhemat_persen = (biaya_manusia - per_selesai) / biaya_manusia * 100\nefektif = armada * utilisasi\nulang_dolar = (total_tugas - selesai) * biaya_manusia\nhemat_total = (total_tugas * biaya_manusia - (total_biaya + ulang_dolar)) / (total_tugas * biaya_manusia) * 100\n\nprint(f"selesai={selesai}")\nprint(f"per_selesai={round(per_selesai, 4)}")\nprint(f"hemat_persen={round(hemat_persen, 1)}")\nprint(f"efektif={efektif}")\nprint(f"ulang_dolar={ulang_dolar}")\nprint(f"hemat_total={round(hemat_total, 1)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selesai", value: 8200, tol: 1e-9, label: "`selesai` seharusnya 8200", msg: "10.000 x 0,82 = 8.200." },
          { kind: "equal", task: "t1", name: "per_selesai", value: 0.1512, tol: 0.0001, label: "`per_selesai` seharusnya 0.1512", msg: "1.240/8.200 = $0,1512." },
          { kind: "equal", task: "t2", name: "hemat_persen", value: 94.0, tol: 0.1, label: "`hemat_persen` seharusnya 94.0", msg: "(2,50-0,1512)/2,50 = 94,0 persen." },
          { kind: "equal", task: "t3", name: "efektif", value: 32.5, tol: 1e-9, label: "`efektif` seharusnya 32.5", msg: "50 x 0,65 = 32,5 agen efektif." },
          { kind: "equal", task: "t3", name: "ulang_dolar", value: 4500.0, tol: 1e-9, label: "`ulang_dolar` seharusnya 4500.0", msg: "1.800 gagal x $2,50 = $4.500." },
          { kind: "equal", task: "t4", name: "hemat_total", value: 77.0, tol: 0.1, label: "`hemat_total` seharusnya 77.0", msg: "(25.000 - 5.740)/25.000 = 77,0 persen — hemat total operasi, bukan per tugas selesai." },
        ],
      },
      reference: "8.200 selesai; $0,1512; hemat 94,0 persen per selesai, 77,0 persen total operasi; 32,5 efektif; ulang $4.500.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: kapan agen layak secara ekonomi",
      prose: [
        "Skenario 1 — Volume besar, tugas berulang, success rate di atas 80 persen. → Agen layak; hitung ROI tiap kuartal. Alasan: penghematan total operasi 77 persen x volume besar = angka yang berarti (94 persen adalah per tugas selesai — vonis ekonomi memakai total operasi).",
        "Skenario 2 — Volume kecil (100 tugas/bulan). → Jangan agen; manusia lebih murah setelah biaya pembangunan + operasi. Alasan: biaya tetap (pembangunan, monitoring) tidak terbagi.",
        "Skenario 3 — Success rate di bawah 60 persen. → Jangan scale; perbaiki dulu (AAI24). Alasan: pengerjaan ulang manusia memakan semua penghematan.",
        "Skenario 4 — Tugas berisiko tinggi, kesalahan berbiaya besar. → Agen + manusia in-the-loop (AAI9). Alasan: penghematan tidak berarti bila satu kesalahan menghapus setahun penghematan.",
        "Skenario 5 — Lonjakan musiman (10x volume di promo). → Armada elastis + routing + cadangan. Alasan: kapasitas harus mengikuti volume; armada kaku runtuh di lonjakan.",
        "Aturan praktis: ROI agen = (biaya manusia - biaya total agen) / biaya total agen. Bila ROI negatif setelah semua biaya tersembunyi, matikan agen — tidak ada rasa malu dalam mematikan sistem yang merugikan.",
      ],
      tasks: [],
      note: {
        title: "Biaya yang paling sering dilupakan: manusia yang mengawasi",
        body: "Agen 'otonom' tetap butuh manusia: yang me-review sampel, yang menangani eskalasi, yang memperbaiki saat rusak, yang menjawab regulator. Bila 1.800 tugas gagal butuh 1.800 x 5 menit manusia = 150 jam — itu hampir satu orang penuh sebulan. Hitung jam pengawasan sebagai biaya; agen tanpa anggaran pengawasan adalah agen yang akan ditinggalkan saat pertama kali rusak.",
      },
      reference: "ROI = (manusia - total agen) / total agen; negatif = matikan.",
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
        "Biaya per tugas selesai $0,1512 (bukan $0,124 per dicoba).",
        "Hemat 94,0 persen per tugas selesai; 77,0 persen total operasi.",
        "Pengerjaan ulang 1.800 gagal = $4.500 — lebih besar dari biaya agen.",
        "Armada 50 x 65 persen = 32,5 efektif.",
        "ROI negatif setelah semua biaya = matikan agen.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Total $1.240, 10.000 tugas, 8.200 berhasil. Berapa biaya per tugas SELESAI?",
          options: [
            { text: "$0,1512", why: "Tepat: 1.240/8.200 = 0,1512.", correct: true },
            { text: "$0,124 — per tugas dicoba", why: "Salah: itu per DICOBA; per SELESAI membagi dengan 8.200, bukan 10.000." },
            { text: "$0,10 — dibulatkan", why: "Salah: pembulatan yang salah; 0,1512 bukan 0,10." },
            { text: "$2,50 — sama dengan manusia", why: "Salah: itu biaya manusia; agen jauh lebih murah." },
          ],
        },
        {
          q: "Mengapa pengerjaan ulang manusia ($4.500) penting dalam hitungan?",
          options: [
            { text: "Karena ia lebih besar dari biaya agen ($1.240) — total biaya sebenarnya jauh lebih tinggi", why: "Tepat: ekonomi yang mengabaikan kegagalan adalah pemasaran.", correct: true },
            { text: "Karena manusia lebih lambat dari agen", why: "Salah: kecepatan bukan masalahnya; BIAYA pengerjaan ulang yang masalah." },
            { text: "Tidak penting — tugas gagal bisa diabaikan", why: "Salah: tugas gagal tidak hilang; nasabah tetap menunggu jawaban." },
            { text: "Karena $4.500 adalah biaya pembangunan agen", why: "Salah: $4.500 adalah biaya pengerjaan ulang 1.800 tugas gagal." },
          ],
        },
        {
          q: "Armada 50 agen, utilisasi 65 persen. Berapa agen efektif?",
          options: [
            { text: "32,5", why: "Tepat: 50 x 0,65 = 32,5.", correct: true },
            { text: "50 — semua agen selalu bekerja", why: "Salah: utilisasi 100 persen tidak realistis dan tidak sehat." },
            { text: "77 — itu kebutuhan terpasang", why: "Salah: 77 adalah TERPASANG untuk 50 efektif; di sini efektifnya 32,5." },
            { text: "15 — sisanya yang menganggur", why: "Salah: 17,5 yang menganggur (50 - 32,5); efektifnya 32,5." },
          ],
        },
        {
          q: "Success rate naik 82 menjadi 90 persen. Apa dampak ekonominya?",
          options: [
            { text: "Tidak ada — biaya token tetap", why: "Salah: biaya per selesai turun DAN pengerjaan ulang turun $2.000." },
            { text: "Biaya per selesai turun + pengerjaan ulang turun $2.000 — kualitas adalah tuas ekonomi terbesar", why: "Tepat: 9.000 selesai, $0,1378; ulang $2.500 dari $4.500.", correct: true },
            { text: "Biaya naik — kualitas lebih mahal", why: "Salah: perbaikan kualitas MENURUNKAN total biaya lewat pengurangan kegagalan." },
            { text: "Hanya penghematan token — manusia tidak terpengaruh", why: "Salah: manusia justru yang paling terpengaruh (pengerjaan ulang)." },
          ],
        },
        {
          q: "ROI agen negatif setelah semua biaya tersembunyi dihitung. Apa yang benar?",
          options: [
            { text: "Teruskan — agen selalu menghemat dalam jangka panjang", why: "Salah: 'jangka panjang' tanpa angka adalah harapan, bukan rencana." },
            { text: "Matikan agen — tidak ada rasa malu mematikan sistem yang merugikan", why: "Tepat: ROI negatif berarti manusia lebih murah; matikan dan evaluasi ulang.", correct: true },
            { text: "Sembunyikan biaya tersembunyi agar ROI terlihat positif", why: "Salah: itu manipulasi laporan, bukan ekonomi." },
            { text: "Naikkan volume — biaya tetap akan terbagi", why: "Salah di kasus ini: bila kerugian berasal dari biaya variabel per tugas (pengerjaan ulang per tugas gagal), volume lebih besar berarti kerugian lebih besar. Pengecualian: bila kerugian berasal dari biaya TETAP dengan margin kontribusi positif per tugas, volume tambahan justru mendekati titik impas — tetapi di sini kerugian per tugasnya nyata, jadi menaikkan volume memperbesar kerugian." },
          ],
        },
      ],
    },
  ],
};
