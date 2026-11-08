import type { V2Lesson } from "../lib/types";

export const aai25: V2Lesson = {
  slug: "aai25-governance-compliance-agen",
  track: "Agentic AI Engineer",
  module: "Produksi Agen",
  title: "AAI25 — Governance & Compliance Khusus Agen",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Agen yang mengirim email ke 10.000 nasabah — tanpa satu pun manusia yang menyetujui",
      prose: [
        "Agen marketing NusaBank diberi tugas 'kirim penawaran ke nasabah yang memenuhi syarat'. Ia mengirim ke 10.000 nasabah — termasuk 400 yang sudah menutup akun, 200 yang ada di daftar 'jangan hubungi', dan 50 yang datanya berasal dari sumber yang tidak boleh dipakai untuk marketing (UU PDP). Tidak ada approval gate, tidak ada daftar larangan yang dimuat ke konteks agen, tidak ada yang tahu siapa yang bertanggung jawab — karena 'agen yang memutuskan'. Regulator bertanya tiga hal: siapa yang menyetujui, atas dasar data apa, dan bagaimana membuktikannya. Jawaban tim: tidak ada.",
        "Governance agen bukan guardrail teknis (AAI9) — ia kerangka akuntabilitas: siapa yang bertanggung jawab atas keputusan agen, data apa yang boleh dipakai, bagaimana kepatuhan dibuktikan, dan apa yang terjadi saat agen melanggar. Lesson ini mengajarkan governance & compliance khusus agen: klasifikasi risiko, residu risiko, cakupan kontrol, dan audit yang bisa menjawab regulator.",
        "Setelah lesson ini kamu bisa: (1) menghitung risiko residu setelah kontrol; (2) menghitung cakupan kontrol kepatuhan; (3) menjelaskan klasifikasi risiko EU AI Act untuk agen; (4) merancang daftar larangan dan approval untuk agen; (5) menjawab tiga pertanyaan regulator dengan bukti.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "AAI9 mengajarkan guardrail teknis (tier risiko 0-3, approval gate, audit trail, kill switch) dan AAI18 mengajarkan governance produk AI secara umum. Tidak ada lesson governance & compliance KHUSUS AGEN: klasifikasi risiko regulasi (EU AI Act), residu risiko, cakupan kontrol, daftar larangan data, dan akuntabilitas keputusan otonom. Lesson ini membangunnya, dengan lab yang menghitung risiko residu dan cakupan kontrol.",
      },
      reference: "Risiko inheren 20 → residu 6,0 (kontrol 70 persen); cakupan kontrol 11/14 = 78,6 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, keputusan agenmu bisa dipertanggungjawabkan — dengan bukti, bukan dengan 'agen yang memutuskan'.",
        "(1) Menghitung risiko residu = inheren x (1 - efektivitas kontrol);",
        "(2) Menghitung cakupan kontrol kepatuhan;",
        "(3) Menjelaskan klasifikasi risiko EU AI Act (minimal, terbatas, tinggi, tak diterima);",
        "(4) Merancang daftar larangan data dan approval gate per tier;",
        "(5) Menjelaskan akuntabilitas: manusia pemilik, bukan agen.",
      ],
      tasks: [],
    },
    {
      id: "klasifikasi",
      eyebrow: "Langkah 3 · Teori",
      title: "Klasifikasi risiko: agenmu di kelas apa",
      prose: [
        "EU AI Act mengklasifikasikan sistem AI dalam empat tingkat. Minimal (chatbot FAQ): hampir tanpa kewajiban. Terbatas (agen yang berinteraksi dengan manusia): kewajiban transparansi — pengguna harus tahu ia berbicara dengan agen. Tinggi (agen yang memutuskan kredit, rekrutmen, akses layanan): kewajiban berat — penilaian risiko, data governance, pengawasan manusia, pencatatan, dan akurasi yang teruji. Tak diterima (manipulasi subliminal, scoring sosial oleh pemerintah): dilarang.",
        "Agen marketing NusaBank yang mengirim penawaran: minimal bila hanya menjawab pertanyaan; TINGGI bila keputusannya memengaruhi akses ke layanan finansial (siapa mendapat penawaran kredit). Klasifikasi ditentukan oleh DAMPAK keputusan, bukan oleh kecanggihan teknologinya. Agen sederhana yang menolak 10.000 pengajuan kredit adalah risiko tinggi; agen canggih yang merangkum dokumen internal adalah risiko minimal.",
        "UU PDP (Indonesia) menambah lapis kedua: data pribadi hanya boleh dipakai untuk tujuan yang disetujui. Agen yang memakai data transaksi untuk marketing tanpa persetujuan melanggar — walau modelnya akurat. Daftar larangan data (do-not-use list) harus dimuat ke konteks agen SEBELUM ia bertindak, bukan diperiksa setelah ia mengirim 10.000 email.",
      ],
      tasks: [],
      note: {
        title: "Klasifikasi bukan sekali jalan",
        body: "Agen yang hari ini risiko minimal bisa menjadi risiko tinggi besok — bila ia diberi tool baru (kirim email massal) atau data baru (riwayat kredit). Setiap perubahan kapabilitas agen (tool, data, otonomi) memicu RE-klasifikasi. Governance yang tidak me-review klasifikasi saat kapabilitas berubah adalah governance yang kedaluwarsa.",
      },
      reference: "Klasifikasi dari dampak, bukan kecanggihan. Tinggi = kredit, rekrutmen, akses layanan.",
    },
    {
      id: "risiko-residu",
      eyebrow: "Langkah 4 · Teori",
      title: "Risiko residu & cakupan kontrol: angka yang menjawab regulator",
      prose: [
        "Risiko inheren dihitung seperti LLMOps9: likelihood x impact (1-5). Aksi 'kirim email massal': L=4, I=5 — risiko inheren 20 (kritis). Kontrol: approval gate manusia (efektivitas 70 persen — manusia menangkap 70 persen kesalahan) → risiko residu = 20 x (1 - 0,70) = 6,0. Residu 6,0 masuk zona sedang (6-11) — bisa diterima dengan pemantauan. Tanpa kontrol, 20 berarti 'perbaiki dalam 48 jam atau jangan jalankan'.",
        "Kontrol kedua untuk aksi yang sama: daftar larangan otomatis (efektivitas 60 persen terhadap risiko yang tersisa) — residu menjadi 15 x (1 - 0,6) = 6,0? Perhatikan: kontrol kedua diterapkan pada risiko SETELAH kontrol pertama bila independen — 6,0 x (1 - 0,6) = 2,4. Dua kontrol berlapis (manusia + otomatis) menurunkan 20 menjadi 2,4. Inilah defense in depth: tidak ada satu kontrol yang sempurna; lapisan yang menutupi kelemahan satu sama lain.",
        "Cakupan kontrol: dari 14 kontrol yang diwajibkan (EU AI Act + UU PDP + kebijakan internal), 11 sudah diimplementasikan — cakupan 11/14 = 78,6 persen. Tiga yang hilang: (1) pencatatan keputusan otomatis yang bisa di-replay; (2) review klasifikasi tiap perubahan kapabilitas; (3) pelatihan pemilik agen tentang akuntabilitas. Regulator tidak bertanya 'apakah kamu punya kontrol' — ia bertanya 'kontrol mana yang belum ada, dan kapan dipasang'. Cakupan 78,6 persen dengan rencana untuk 3 sisanya lebih baik dari klaim 100 persen yang tidak bisa dibuktikan.",
      ],
      tasks: [],
      note: {
        title: "'Agen yang memutuskan' bukan jawaban",
        body: "Akuntabilitas tidak bisa didelegasikan ke agen. Setiap keputusan agen punya PEMILIK manusia yang namanya tercatat — pemilik yang menyetujui deployment, yang merancang kontrol, yang bertanggung jawab saat kontrol gagal. Bila tidak ada nama, tidak ada akuntabilitas; bila tidak ada akuntabilitas, tidak ada deployment. Ini bukan birokrasi — ini syarat regulator.",
      },
      reference: "Inheren 20 → residu 6,0 (satu kontrol) → 2,4 (dua lapis). Cakupan 78,6 persen.",
    },
    {
      id: "lab-governance",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: risiko residu dan cakupan kontrol",
      prose: [
        "Lab ini menghitung mesin governance agen dari angka mentah: risiko residu setelah kontrol dan cakupan kontrol kepatuhan.",
        "Hitung dulu di kepala. Risiko inheren: L=4 x I=5 = 20. Residu setelah kontrol 70 persen: 20 x (1 - 0,70) = 6,0. Residu setelah kontrol kedua 60 persen: 6,0 x (1 - 0,6) = 2,4. Cakupan kontrol: 11/14 x 100 = 78,6 persen.",
        "Tugas lab: hitung empat angka dan cetak masing-masing di baris sendiri: inheren, residu1, residu2, cakupan. Empat angka ini adalah jawaban untuk regulator — dengan ini 'apakah agen ini aman' menjadi klaim yang bisa dibuktikan.",
        "Setelah lolos, coba eksperimen: turunkan efektivitas kontrol pertama menjadi 40 persen dan lihat residu1 menjadi 12,0 (zona tinggi) — lalu tanyakan: kontrol apa yang harus ditambah agar residu kembali ke zona sedang?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `inheren` (L=4, I=5) dan `residu1` (kontrol 70 persen)" },
        { id: "t2", text: "Hitung `residu2` (kontrol kedua 60 persen) dan `cakupan` (11 dari 14)" },
      ],
      expected: "inheren=20\nresidu1=6.0\nresidu2=2.4\ncakupan=78.6",
      hints: [
        "Inheren = L x I; residu = risiko x (1 - efektivitas).",
        "Kontrol kedua diterapkan pada residu pertama.",
        "Cakupan = terimplementasi / wajib x 100; bulatkan 1 desimal.",
      ],
      code: {
        starter: `# Mesin governance agen: risiko residu + cakupan kontrol.\nlikelihood, impact = 4, 5\nefektivitas1, efektivitas2 = 0.70, 0.60\nkontrol_ada, kontrol_wajib = 11, 14\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\ninheren = \nresidu1 = \nresidu2 = \ncakupan = \n\nprint(f"inheren={inheren}")\nprint(f"residu1={residu1}")\nprint(f"residu2={residu2}")\nprint(f"cakupan={round(cakupan, 1)}")`,
        lockLines: 3,
        solution: `# Mesin governance agen: risiko residu + cakupan kontrol.\nlikelihood, impact = 4, 5\nefektivitas1, efektivitas2 = 0.70, 0.60\nkontrol_ada, kontrol_wajib = 11, 14\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\ninheren = likelihood * impact\nresidu1 = inheren * (1 - efektivitas1)\nresidu2 = residu1 * (1 - efektivitas2)\ncakupan = kontrol_ada / kontrol_wajib * 100\n\nprint(f"inheren={inheren}")\nprint(f"residu1={residu1}")\nprint(f"residu2={residu2}")\nprint(f"cakupan={round(cakupan, 1)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "inheren", value: 20, tol: 1e-9, label: "`inheren` seharusnya 20", msg: "4 x 5 = 20 (kritis)." },
          { kind: "equal", task: "t1", name: "residu1", value: 6.0, tol: 1e-9, label: "`residu1` seharusnya 6.0", msg: "20 x 0,3 = 6,0 (sedang)." },
          { kind: "equal", task: "t2", name: "residu2", value: 2.4, tol: 0.1, label: "`residu2` seharusnya 2.4", msg: "6,0 x 0,4 = 2,4 (rendah)." },
          { kind: "equal", task: "t2", name: "cakupan", value: 78.6, tol: 0.1, label: "`cakupan` seharusnya 78.6", msg: "11/14 = 78,6 persen." },
        ],
      },
      reference: "Inheren 20; residu 6,0; residu lapis kedua 2,4; cakupan 78,6 persen.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: kontrol apa untuk risiko apa",
      prose: [
        "Skenario 1 — Agen risiko minimal (FAQ internal). → Transparansi + log dasar. Alasan: kewajiban ringan; jangan bebani dengan komite.",
        "Skenario 2 — Agen risiko tinggi (keputusan kredit). → Penilaian risiko + data governance + pengawasan manusia + pencatatan replay + pemilik bernama. Alasan: kewajiban EU AI Act penuh.",
        "Skenario 3 — Agen memakai data pribadi. → Daftar larangan data + persetujuan tujuan + audit pemakaian data. Alasan: UU PDP; pelanggaran = denda miliaran.",
        "Skenario 4 — Agen diberi tool baru (kirim email massal). → RE-klasifikasi + approval gate baru + uji coba terbatas. Alasan: kapabilitas baru = risiko baru.",
        "Skenario 5 — Insiden: agen melanggar kebijakan. → Hentikan agen (kill switch AAI9) + investigasi dari audit trail + laporkan ke pemilik + perbaiki kontrol. Alasan: insiden yang tidak dilaporkan adalah insiden yang akan terulang.",
        "Aturan praktis: governance proporsional dengan risiko (AAI9) — tetapi akuntabilitas tidak pernah proporsional: selalu ada nama manusia di setiap keputusan agen.",
      ],
      tasks: [],
      note: {
        title: "Tiga pertanyaan regulator — dan jawabannya",
        body: "(1) Siapa yang menyetujui? → Nama pemilik + tanggal approval di registry. (2) Atas dasar data apa? → Daftar sumber data + persetujuan tujuan + daftar larangan. (3) Bagaimana membuktikannya? → Audit trail yang bisa di-replay (AAI9) + laporan cakupan kontrol. Bila ketiganya terjawab dalam 5 menit, governance-mu bekerja. Bila satu pun tidak terjawab, governance-mu adalah dokumen — bukan sistem.",
      },
      reference: "Proporsional dengan risiko; akuntabilitas selalu bernama.",
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
        "Klasifikasi dari dampak: minimal, terbatas, tinggi, tak diterima.",
        "Inheren 20 → residu 6,0 → 2,4 (dua lapis kontrol).",
        "Cakupan kontrol 11/14 = 78,6 persen.",
        "Daftar larangan data dimuat SEBELUM agen bertindak.",
        "Akuntabilitas: selalu ada nama manusia; 'agen yang memutuskan' bukan jawaban.",
      ],
      next: { label: "AAI26 — Penalaran Agen: CoT, ToT & Self-Consistency", href: "/v2/learn/aai26-penalaran-agen" },
      quiz: [
        {
          q: "Risiko inheren 20, kontrol efektivitas 70 persen. Berapa risiko residu?",
          options: [
            { text: "6,0", why: "Tepat: 20 x (1 - 0,70) = 6,0 — zona sedang.", correct: true },
            { text: "14,0 — 70 persen dari 20", why: "Salah: itu risiko yang DIHILANGKAN; residu adalah sisanya (30 persen)." },
            { text: "20 — kontrol tidak mengubah risiko", why: "Salah: kontrol yang efektif menurunkan risiko; itulah gunanya." },
            { text: "0 — kontrol sempurna", why: "Salah: efektivitas 70 persen bukan 100 persen; residu selalu ada." },
          ],
        },
        {
          q: "Agen sederhana yang menolak 10.000 pengajuan kredit. Klasifikasi risikonya?",
          options: [
            { text: "Minimal — agennya sederhana", why: "Salah: klasifikasi dari DAMPAK, bukan kecanggihan. Menolak kredit = risiko tinggi." },
            { text: "Tinggi — keputusannya memengaruhi akses ke layanan finansial", why: "Tepat: dampak menentukan kelas.", correct: true },
            { text: "Tak diterima — semua agen kredit dilarang", why: "Salah: kredit bukan kategori tak diterima; ia risiko tinggi yang diatur, bukan dilarang." },
            { text: "Terbatas — hanya butuh transparansi", why: "Salah: transparansi saja tidak cukup untuk keputusan yang memengaruhi akses finansial." },
          ],
        },
        {
          q: "Kapan daftar larangan data (do-not-use) harus dimuat ke agen?",
          options: [
            { text: "Setelah agen mengirim 10.000 email — untuk audit", why: "Salah: setelah bertindak, kerusakannya sudah terjadi." },
            { text: "Sebelum agen bertindak — sebagai bagian konteksnya", why: "Tepat: larangan yang datang setelah tindakan adalah penyesalan, bukan kontrol.", correct: true },
            { text: "Tidak perlu — agen tahu sendiri data mana yang dilarang", why: "Salah: agen tidak tahu; ia memakai apa yang diberi." },
            { text: "Hanya bila regulator meminta", why: "Salah: kepatuhan bukan reaksi terhadap permintaan; ia desain." },
          ],
        },
        {
          q: "Agen diberi tool baru: kirim email massal. Apa yang harus terjadi?",
          options: [
            { text: "Tidak ada — tool baru tidak mengubah risiko", why: "Salah: kapabilitas baru = risiko baru = re-klasifikasi." },
            { text: "RE-klasifikasi + approval gate baru + uji coba terbatas", why: "Tepat: setiap perubahan kapabilitas memicu review governance.", correct: true },
            { text: "Langsung pakai — tool sudah diuji vendor", why: "Salah: uji vendor bukan uji risikomu; konteksmu berbeda." },
            { text: "Matikan agen selamanya", why: "Salah: berlebihan; yang dibutuhkan adalah klasifikasi ulang, bukan pembunuhan." },
          ],
        },
        {
          q: "Regulator bertanya: siapa yang menyetujui keputusan agen ini? Jawaban apa yang benar?",
          options: [
            { text: "'Agen yang memutuskan'", why: "Salah: akuntabilitas tidak bisa didelegasikan ke agen." },
            { text: "Nama pemilik manusia + tanggal approval di registry", why: "Tepat: selalu ada nama; tanpa nama, tidak ada deployment.", correct: true },
            { text: "'Tim AI secara kolektif'", why: "Salah: kolektif tanpa nama adalah cara tidak ada yang bertanggung jawab." },
            { text: "'Model yang dilatih vendor'", why: "Salah: vendor tidak bertanggung jawab atas deployment-mu." },
          ],
        },
      ],
    },
  ],
};
