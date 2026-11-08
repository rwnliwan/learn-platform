import type { V2Lesson } from "../lib/types";

export const de32: V2Lesson = {
  slug: "de32-framework-keputusan-arsitektur",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE32 — Framework Keputusan Arsitektur: Memilih Stack dengan Skor, Bukan Selera",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga arsitek, tiga jawaban, satu rapat yang buntu",
      prose: [
        "KirimCepat butuh platform data baru. Arsitek pertama berkata lakehouse — modern dan fleksibel. Arsitek kedua berkata warehouse — matang dan cepat untuk BI. Arsitek ketiga berkata data lake mentah — murah dan sederhana. Masing-masing benar menurut pengalamannya sendiri, dan rapat berakhir tanpa keputusan karena tidak ada yang bisa membandingkan ketiganya dengan ukuran yang sama.",
        "Masalahnya bukan kurangnya opsi, melainkan tidak adanya framework keputusan: kriteria apa yang dinilai, berapa bobotnya, dan skor siapa yang dihitung dari apa. Tanpa itu, keputusan arsitektur menjadi kontes kefasihan, dan yang menang adalah yang paling pandai berdebat — bukan yang paling cocok.",
        "Lesson ini mengajarkan framework keputusan arsitektur: tentukan kriteria dari kebutuhan bisnis, beri bobot, skor tiap opsi dengan bukti, hitung skor terbobot, lalu uji sensitivitasnya. Setelah lesson ini kamu bisa: (1) menurunkan kriteria dari kebutuhan nyata; (2) memberi bobot yang bisa dipertahankan; (3) menghitung skor terbobot tiap opsi; (4) menguji apakah pemenang berubah bila bobot digeser; (5) mendokumentasikan keputusan sebagai ADR.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Lesson DE tersebar membahas trade-off per teknologi (CDC di DE19, batch vs streaming di DE2, lakehouse di DE14) tetapi tidak ada satu pun framework keputusan arsitektur sebagai lesson — tidak ada metode menurunkan kriteria, memberi bobot, dan menghitung skor terbobot. Lesson ini membangun metodenya, dengan lab skor terbobot tiga opsi.",
      },
      reference: "Skor terbobot: lakehouse 3,9; warehouse 3,7; lake 3,5. Pemenang: lakehouse — dengan selisih tipis yang wajib diuji sensitivitasnya.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membawa rapat arsitektur ke keputusan yang bisa dipertanggungjawabkan — lengkap dengan angka dan jejak alasannya.",
        "(1) Menurunkan kriteria keputusan dari kebutuhan bisnis dan kendala tim;",
        "(2) Memberi bobot kriteria yang jumlahnya 1,0 dan bisa dijelaskan;",
        "(3) Menilai tiap opsi dengan bukti, bukan opini;",
        "(4) Menghitung skor terbobot dan menguji sensitivitasnya;",
        "(5) Menulis Architecture Decision Record (ADR) yang bisa dibaca setahun kemudian.",
      ],
      tasks: [],
    },
    {
      id: "kriteria-bobot",
      eyebrow: "Langkah 3 · Teori",
      title: "Kriteria dari kebutuhan, bobot dari rasa sakit",
      prose: [
        "Kriteria yang baik diturunkan dari kebutuhan, bukan dari brosur vendor. Empat kriteria di cerita pembuka: latensi query (dashboard direksi harus di bawah 5 detik), biaya (budget Rp50 juta per bulan), governance (jejak audit untuk regulator), dan skalabilitas (data tumbuh 2x per tahun). Tiap kriteria punya definisi operasional — latensi diukur dari query tersulit, bukan dari janji marketing.",
        "Bobot mencerminkan rasa sakit bila kriteria itu gagal. Bobot di lesson ini: latensi 0,3; biaya 0,3; governance 0,2; skalabilitas 0,2 — total 1,0. Bobot bukan tebakan: ia disepakati pemilik bisnis sebelum opsi dinilai. Menentukan bobot SETELAH melihat skor opsi adalah kecurangan yang paling umum — bobot digeser sampai opsi favorit menang.",
        "Skor tiap opsi 1 sampai 5, dan tiap skor wajib punya bukti satu kalimat: warehouse mendapat 5 untuk latensi karena benchmark query tersulit 3,2 detik di proof-of-concept, bukan karena 'warehouse memang cepat'. Skor tanpa bukti adalah opini dengan angka.",
      ],
      tasks: [],
      note: {
        title: "Kriteria yang tidak boleh masuk",
        body: "Hype, tren, dan CV tim bukan kriteria. 'Teknologi ini sedang naik daun' dan 'tim ingin belajar ini' adalah alasan yang sah untuk eksperimen — bukan untuk arsitektur produksi. Bila sebuah kriteria tidak bisa diukur atau tidak ada yang sakit bila ia gagal, keluarkan dari daftar.",
      },
      reference: "Bobot: latensi 0,3; biaya 0,3; governance 0,2; skalabilitas 0,2. Total 1,0.",
    },
    {
      id: "skor-sensitivitas",
      eyebrow: "Langkah 4 · Teori",
      title: "Skor terbobot dan uji sensitivitas",
      prose: [
        "Skor terbobot adalah jumlah bobot dikali skor per kriteria. Lakehouse: 0,3 dikali 4 tambah 0,3 dikali 3 tambah 0,2 dikali 4 tambah 0,2 dikali 5 sama dengan 1,2 tambah 0,9 tambah 0,8 tambah 1,0 sama dengan 3,9. Warehouse: 1,5 tambah 0,6 tambah 1,0 tambah 0,6 sama dengan 3,7. Lake: 0,6 tambah 1,5 tambah 0,4 tambah 1,0 sama dengan 3,5. Lakehouse menang — dengan selisih 0,2 dari warehouse.",
        "Selisih 0,2 adalah selisih tipis, dan keputusan tipis wajib diuji sensitivitasnya: geser satu bobot dan lihat apakah pemenang berubah. Bila bobot biaya naik dari 0,3 ke 0,4 (dan latensi turun ke 0,2), warehouse menjadi 0,2 dikali 5 tambah 0,4 dikali 2 tambah 0,2 dikali 5 tambah 0,2 dikali 3 sama dengan 1,0 tambah 0,8 tambah 1,0 tambah 0,6 sama dengan 3,4; lakehouse menjadi 0,8 tambah 1,2 tambah 0,8 tambah 1,0 sama dengan 3,8 — lakehouse tetap menang. Keputusan yang bertahan di beberapa skenario bobot adalah keputusan yang kokoh.",
        "Hasil akhirnya ditulis sebagai ADR: konteks, keputusan, alternatif yang dipertimbangkan dengan skornya, dan konsekuensi yang diterima (misalnya lakehouse berarti tim harus belajar format tabel terbuka). ADR dibaca setahun kemudian saat seseorang bertanya kenapa stack ini dipilih — dan jawabannya ada, bukan sekadar ingatan.",
      ],
      tasks: [],
      reference: "Lakehouse 3,9; warehouse 3,7; lake 3,5. Uji sensitivitas: geser bobot biaya ke 0,4 — lakehouse tetap menang 3,8 vs 3,4.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin skor terbobot arsitektur",
      prose: [
        "Lab ini menghitung skor terbobot tiga opsi dari bobot dan skor per kriteria.",
        "Hitung dulu di kepala. Lakehouse: 0,3 dikali 4 sama dengan 1,2; 0,3 dikali 3 sama dengan 0,9; 0,2 dikali 4 sama dengan 0,8; 0,2 dikali 5 sama dengan 1,0; total 3,9. Warehouse: 1,5 tambah 0,6 tambah 1,0 tambah 0,6 sama dengan 3,7. Lake: 0,6 tambah 1,5 tambah 0,4 tambah 1,0 sama dengan 3,5.",
        "Tugas lab: tulis fungsi yang menerima bobot dan tiga daftar skor, lalu mencetak tiga angka: skor_lakehouse, skor_warehouse, skor_lake — masing-masing dibulatkan ke 1 desimal.",
        "Setelah lolos, coba eksperimen: ubah bobot biaya menjadi 0,4 dan latensi 0,2, lalu lihat apakah pemenang berubah — itulah uji sensitivitas dalam satu baris.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor_lakehouse dari bobot dan skornya" },
        { id: "t2", text: "Hitung skor_warehouse dari bobot dan skornya" },
        { id: "t3", text: "Hitung skor_lake dan tentukan pemenangnya" },
      ],
      expected: "skor_lakehouse=3.9\nskor_warehouse=3.7\nskor_lake=3.5",
      hints: [
        "Skor terbobot = jumlah bobot dikali skor per kriteria.",
        "Bulatkan hasil ke 1 desimal.",
        "Bobot: latensi 0,3; biaya 0,3; governance 0,2; skalabilitas 0,2.",
      ],
      code: {
        starter: `# Bobot kriteria: latensi, biaya, governance, skalabilitas.\nbobot = [0.3, 0.3, 0.2, 0.2]\nlakehouse = [4, 3, 4, 5]\nwarehouse = [5, 2, 5, 3]\nlake = [2, 5, 2, 5]\n\n# TULIS KODEMU: hitung skor terbobot tiap opsi.\n# Cetak, per baris: skor_lakehouse, skor_warehouse, skor_lake.\n\n\nmesin_skor(bobot, lakehouse, warehouse, lake)`,
        lockLines: 5,
        solution: `# Bobot kriteria: latensi, biaya, governance, skalabilitas.\nbobot = [0.3, 0.3, 0.2, 0.2]\nlakehouse = [4, 3, 4, 5]\nwarehouse = [5, 2, 5, 3]\nlake = [2, 5, 2, 5]\n\n\ndef mesin_skor(bobot, lakehouse, warehouse, lake):\n    def terbobot(skor):\n        total = 0\n        for b, s in zip(bobot, skor):\n            total = total + b * s\n        return round(total, 1)\n    print(f"skor_lakehouse={terbobot(lakehouse)}")\n    print(f"skor_warehouse={terbobot(warehouse)}")\n    print(f"skor_lake={terbobot(lake)}")\n\n\nmesin_skor(bobot, lakehouse, warehouse, lake)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "skor_lakehouse=3.9", label: "Lakehouse 3,9", msg: "1,2 + 0,9 + 0,8 + 1,0 = 3,9." },
          { kind: "stdout_matches", task: "t2", pattern: "skor_warehouse=3.7", label: "Warehouse 3,7", msg: "1,5 + 0,6 + 1,0 + 0,6 = 3,7." },
          { kind: "stdout_matches", task: "t3", pattern: "skor_lake=3.5", label: "Lake 3,5 — pemenang lakehouse", msg: "0,6 + 1,5 + 0,4 + 1,0 = 3,5. Pemenang: lakehouse 3,9." },
        ],
      },
      reference: "Lakehouse 3,9; warehouse 3,7; lake 3,5. Pemenang: lakehouse.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: rapat yang akhirnya memutuskan",
      prose: [
        "Kembali ke KirimCepat. Rapat kedua dibuka dengan kriteria dan bobot yang sudah disepakati pemilik bisnis — bukan dengan slide vendor. Tiap arsitek mempresentasikan bukti skornya: benchmark query, tagihan proof-of-concept, dan jejak audit.",
        "Hasilnya: lakehouse 3,9, warehouse 3,7, lake 3,5. Arsitek warehouse sempat meminta bobot biaya dinaikkan — dan uji sensitivitas menunjukkan lakehouse tetap menang. Perdebatan berhenti karena aturannya disepakati sebelum skor dibuka.",
        "Keputusan ditulis sebagai ADR nomor 7: lakehouse dipilih, warehouse sebagai fallback bila tim gagal menguasai format tabel terbuka dalam 3 bulan. Tiga bulan kemudian ADR itu dibaca ulang — dan tidak ada yang ingat siapa yang paling pandai berdebat di rapat pertama.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat framework ini bekerja. Pertama, bobot disepakati sebelum skor — menutup celah kecurangan. Kedua, tiap skor punya bukti satu kalimat — menutup opini. Ketiga, uji sensitivitas membedakan kemenangan kokoh dari kemenangan tipis.",
      },
      reference: "ADR 7: lakehouse dipilih; warehouse fallback bila penguasaan format tabel terbuka gagal dalam 3 bulan.",
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
        "Kriteria diturunkan dari kebutuhan; bobot disepakati sebelum skor; tiap skor butuh bukti.",
        "Lab: lakehouse 3,9; warehouse 3,7; lake 3,5.",
        "Selisih tipis wajib diuji sensitivitasnya dengan menggeser bobot.",
        "Hype dan tren bukan kriteria keputusan arsitektur.",
        "Keputusan ditulis sebagai ADR dengan alternatif dan konsekuensi.",
      ],
      next: { label: "DE33 — Troubleshooting Pipeline: Mendiagnosis Job yang Gagal Jam 3 Pagi", href: "/v2/learn/de33-troubleshooting-pipeline" },
      quiz: [
        {
          q: "Bobot latensi 0,3; biaya 0,3; governance 0,2; skalabilitas 0,2. Skor lakehouse 4, 3, 4, 5. Berapa skor terbobotnya?",
          options: [
            { text: "4,0 — rata-rata skornya", why: "Salah: rata-rata mengabaikan bobot. Skor terbobot memakai bobot, bukan rata-rata biasa." },
            { text: "3,9", why: "Tepat: 1,2 + 0,9 + 0,8 + 1,0 = 3,9.", correct: true },
            { text: "16 — jumlah skornya", why: "Salah: jumlah mentah mengabaikan bobot dan skala kriteria." },
            { text: "3,5 — skor opsi lake mentah", why: "Salah: 3,5 adalah skor lake, bukan lakehouse." },
          ],
        },
        {
          q: "Kapan bobot kriteria harus disepakati?",
          options: [
            { text: "Setelah skor opsi dibuka — supaya bobot realistis", why: "Salah: itu celah kecurangan klasik — bobot digeser sampai opsi favorit menang." },
            { text: "Tidak perlu disepakati — arsitek senior yang menentukan sendiri", why: "Salah: bobot mencerminkan prioritas bisnis, bukan selera arsitek." },
            { text: "Sebelum opsi dinilai — oleh pemilik bisnis", why: "Tepat: bobot yang disepakati dulu menutup celah manipulasi dan memaksa debat soal prioritas, bukan soal opsi.", correct: true },
            { text: "Saat menulis ADR, setelah keputusan diambil", why: "Salah: ADR mencatat keputusan yang sudah dibuat dengan framework — bukan tempat menentukan bobot." },
          ],
        },
        {
          q: "Lakehouse menang 3,9 vs warehouse 3,7. Apa langkah berikut yang benar?",
          options: [
            { text: "Langsung bangun — selisih 0,2 sudah cukup", why: "Salah: selisih tipis wajib diuji sensitivitasnya sebelum berkomitmen." },
            { text: "Minta vendor lakehouse memberi diskon agar skor naik", why: "Salah: skor bukan alat negosiasi — mengubah skor demi hasil yang diinginkan adalah manipulasi." },
            { text: "Tambah kriteria baru sampai warehouse menang", why: "Salah: menambah kriteria setelah hasil keluar adalah cara lain menggeser hasil." },
            { text: "Uji sensitivitas: geser bobot dan lihat apakah pemenang berubah", why: "Tepat: kemenangan yang bertahan di beberapa skenario bobot adalah kemenangan yang kokoh.", correct: true },
          ],
        },
        {
          q: "Mana yang BUKAN kriteria keputusan arsitektur yang sah?",
          options: [
            { text: "Teknologi sedang naik daun dan bagus untuk CV tim", why: "Tepat: hype dan CV adalah alasan eksperimen, bukan kriteria arsitektur produksi.", correct: true },
            { text: "Latensi query tersulit di bawah 5 detik, diukur dari proof-of-concept", why: "Salah: ini kriteria sah — terukur dan ada yang sakit bila gagal." },
            { text: "Biaya bulanan di bawah Rp50 juta", why: "Salah: ini kriteria sah — terukur dan berbatas jelas." },
            { text: "Jejak audit lengkap untuk regulator", why: "Salah: ini kriteria sah — kebutuhan governance yang nyata." },
          ],
        },
        {
          q: "Apa isi ADR yang membuat keputusan bisa dipertanggungjawabkan setahun kemudian?",
          options: [
            { text: "Nama vendor dan harga lisensi saja", why: "Salah: harga tanpa konteks keputusan tidak menjelaskan kenapa opsi itu dipilih." },
            { text: "Konteks, keputusan, alternatif beserta skornya, dan konsekuensi yang diterima", why: "Tepat: itulah jejak alasan lengkap — pembaca masa depan bisa menilai apakah keputusannya masih berlaku.", correct: true },
            { text: "Slide presentasi vendor yang paling meyakinkan", why: "Salah: slide vendor adalah marketing, bukan jejak alasan." },
            { text: "Nama arsitek yang mengusulkan — untuk disalahkan bila gagal", why: "Salah: ADR mencatat alasan, bukan kambing hitam." },
          ],
        },
      ],
    },
  ],
};
