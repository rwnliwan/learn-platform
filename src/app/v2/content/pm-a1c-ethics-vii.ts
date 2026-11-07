import type { V2Lesson } from "../lib/types";

export const pma1c: V2Lesson = {
  slug: "pm-a1c-ethics-vii",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A1C Standard VII & Integritas Program CFA",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-gelar",
      eyebrow: "Langkah 1 · Cerita",
      title: "Gelar yang belum dimiliki",
      prose: [
        "Raka baru lulus Level II Program CFA. Semangatnya meluap: kartu namanya kini bertuliskan “Raka Wijaya, CFA”. Di wawancara kerja ia memperkenalkan diri sebagai “CFA”. Klien mengira ia charterholder — seseorang yang sudah menyelesaikan tiga level, empat tahun pengalaman, dan disumpah oleh CFA Institute. Padahal Raka baru menempuh dua pertiga jalan.",
        "Di tempat lain, Dina baru selesai ujian Level III. Sorenya ia menulis di forum online: “Soal ujian kemarin banyak tentang atribusi Brinson, ini bocoran topiknya…” — lengkap dengan detail soal yang ia ingat. Ia pikir itu membantu teman-temannya. Yang terjadi: CFA Institute mencabut haknya mengikuti program, dan gelar yang ia kejar bertahun-tahun hilang sebelum sempat diraih.",
        "Dua cerita, satu standar: Standard VII — tanggung jawab sebagai peserta program CFA. Lesson ini menguji standar yang paling sering dianggap sepele karena “bukan soal uang klien” — padahal inilah standar yang menjaga nilai gelar itu sendiri. Bila gelar bisa diklaim siapa saja dan soal bisa dibocorkan siapa saja, gelar itu tidak bernilai apa-apa.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira Standard VII hanya soal ujian. VII mencakup seluruh hubunganmu dengan CFA Institute: ujian, gelar, keanggotaan, dan cara kamu menyebut dirimu di depan publik. Pelanggaran VII bisa menghapus charter yang sudah kamu peroleh.",
      },
      reference: "Standard VII: jaga integritas program dan gelar — jangan klaim yang belum dimiliki, jangan bocorkan ujian.",
    },
    {
      id: "vii-a",
      eyebrow: "Langkah 2 · Standard VII(A)",
      title: "Conduct as Participants: aturan main program",
      prose: [
        "Standard VII(A) berbunyi: anggota dan kandidat tidak boleh melakukan perbuatan apa pun yang mengorbankan reputasi atau integritas CFA Institute atau gelar CFA, maupun integritas, validitas, atau keamanan program CFA Institute. Sederhananya: jangan merusak permainan yang sedang kamu mainkan.",
        "Bentuk pelanggaran yang paling sering diuji: mencontek saat ujian; membocorkan isi soal ujian — termasuk “hanya topiknya” atau “hanya ke teman dekat”; melanggar aturan ujian (membawa catatan, memakai perangkat terlarang, tidak berhenti saat waktu habis); dan mengganggu peserta lain. “Membantu teman” bukan pembelaan: membocorkan soal merugikan semua kandidat lain yang belajar jujur, karena kurva kelulusan menjadi tidak adil.",
        "Sanksinya nyata dan berat: diskualifikasi dari ujian, pencabutan hak mengikuti program, hingga pencabutan keanggotaan dan gelar bagi charterholder. CFA Institute menganggap pelanggaran VII(A) sebagai pelanggaran terhadap profesi itu sendiri, bukan sekadar pelanggaran administratif. Alasannya sederhana: ujian yang bocor menghasilkan gelar yang tidak bisa dipercaya pasar.",
        "Perhatikan batasnya: mendiskusikan topik umum yang dipelajari (misal “aku belajar atribusi Brinson minggu ini”) adalah hal biasa dan diperbolehkan. Yang dilarang adalah mengungkapkan isi soal ujian yang sebenarnya — pertanyaan spesifik, angka, atau vignette yang muncul di ujian. Garisnya: topik boleh, soal tidak boleh.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dina menulis detail soal ujian Level III di forum online “untuk membantu teman”. Ini?",
          options: [
            { text: "Boleh — niatnya membantu", why: "Salah: niat baik tidak menghapus pelanggaran. Membocorkan isi soal merusak validitas ujian bagi semua kandidat.", },
            { text: "Pelanggaran VII(A) — membocorkan konten ujian", why: "Benar: mengungkapkan isi soal ujian melanggar integritas program, apapun niatnya dan kepada siapa pun.", correct: true },
            { text: "Hanya pelanggaran bila temannya lulus karena bocoran itu", why: "Salah: pelanggarannya terjadi saat konten dibocorkan, bukan saat seseorang diuntungkan olehnya.", },
          ],
        },
        {
          q: "Kandidat membawa catatan kecil ke ruang ujian tetapi tidak sempat memakainya. Ini?",
          options: [
            { text: "Tidak melanggar — kan tidak dipakai", why: "Salah: membawa perangkat terlarang ke ruang ujian sudah melanggar aturan program, terlepas dari dipakai atau tidak.", },
            { text: "Pelanggaran VII(A) — melanggar aturan ujian", why: "Benar: aturan ujian dilanggar saat catatan dibawa masuk; pemakaian bukan syarat pelanggaran.", correct: true },
            { text: "Hanya pelanggaran bila pengawas menemukannya", why: "Salah: pelanggaran terjadi saat perbuatan dilakukan, bukan saat ketahuan.", },
          ],
        },
      ],
      reference: "VII(A): jangan mencontek, jangan membocorkan soal, jangan melanggar aturan ujian. Topik boleh dibahas, soal tidak boleh.",
    },
    {
      id: "vii-b",
      eyebrow: "Langkah 3 · Standard VII(B)",
      title: "Reference to CFA: menyebut gelar dengan benar",
      prose: [
        "Standard VII(B) berbunyi: anggota dan kandidat tidak boleh menyalahartikan atau membesar-besarkan makna atau implikasi keanggotaan, pemegang gelar CFA, atau status kandidat. Gelar CFA adalah sinyal yang dipercaya pasar — sinyal itu hanya berfungsi bila tidak ada yang memalsukannya.",
        "Aturan praktisnya ada empat. Satu: “CFA” hanya dipakai sebagai kata sifat, bukan kata benda. Benar: “saya CFA charterholder” atau “saya pemegang gelar Chartered Financial Analyst”. Salah: “saya seorang CFA” atau “tim kami terdiri dari 5 CFA”. Dua: jangan menyiratkan gelar yang belum dimiliki. Lulus Level II bukan “CFA Level II” — yang benar: “lulus Level II Program CFA”. Tidak ada gelar parsial. Tiga: jangan memakai gelar setelah keanggotaan dicabut atau sebelum charter diberikan — gelar melekat pada status keanggotaan yang aktif. Empat: jangan membesar-besarkan — “CFA” tidak berarti “dijamin kompeten” atau “pasti untung”; ia berarti kamu lulus tiga level dan memenuhi syarat pengalaman.",
        "Kenapa pemeriksa suka menguji ini? Karena jawabannya bersifat mekanis: ada pola benar dan pola salah yang bisa dikenali dalam sekejap, tanpa perlu menimbang niat. Bila sebuah klaim memakai “CFA” sebagai kata benda, atau menempelkan level sebagai gelar, atau mengklaim charter yang belum ada — itu pelanggaran, titik.",
        "Contoh yang benar dan lazim di CV: “CFA charterholder sejak 2024” atau “Kandidat Level III Program CFA”. Contoh yang salah: “CFA, Level II” atau “CFA (Level III)” di kartu nama. Perhatikan: frasa “Level II” itu sendiri tidak salah — yang salah adalah menempelkannya pada “CFA” seolah menjadi gelar.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Raka baru lulus Level II dan menulis “Raka Wijaya, CFA” di kartu nama. Ini?",
          options: [
            { text: "Boleh — ia sudah lulus dua level", why: "Salah: lulus Level II bukan charterholder. Gelar CFA hanya boleh dipakai setelah charter diberikan.", },
            { text: "Pelanggaran VII(B) — mengklaim gelar yang belum dimiliki", why: "Benar: “CFA” setelah nama menyiratkan charterholder. Yang benar: “lulus Level II Program CFA”.", correct: true },
            { text: "Hanya pelanggaran bila klien tertipu", why: "Salah: pelanggarannya terjadi saat klaim menyesatkan dibuat, bukan saat seseorang tertipu olehnya.", },
          ],
        },
        {
          q: "Brosur manajer investasi menulis “tim kami terdiri dari 5 CFA”. Ini?",
          options: [
            { text: "Boleh — kelimanya memang charterholder", why: "Salah: “CFA” sebagai kata benda untuk orang adalah pemakaian yang salah, meski kelimanya memang charterholder.", },
            { text: "Pelanggaran VII(B) — “CFA” dipakai sebagai kata benda", why: "Benar: yang benar adalah “5 CFA charterholder”. Gelar dipakai sebagai kata sifat, bukan kata benda.", correct: true },
            { text: "Hanya soal gaya bahasa", why: "Salah: ini aturan standar yang ditegakkan, bukan preferensi gaya.", },
          ],
        },
      ],
      reference: "VII(B): “CFA” sebagai kata sifat saja; tidak ada gelar parsial; jangan klaim charter yang belum ada; jangan memakai gelar setelah dicabut.",
    },
    {
      id: "i-d-misconduct",
      eyebrow: "Langkah 4 · Standard I(D)",
      title: "Misconduct: ketidakjujuran yang merusak kepercayaan",
      prose: [
        "Standard I(D) berbunyi: anggota dan kandidat tidak boleh terlibat dalam perbuatan profesional apa pun yang melibatkan ketidakjujuran, penipuan, atau tipu daya, atau melakukan perbuatan apa pun yang berdampak buruk pada reputasi profesional, integritas, atau kompetensi mereka. Ini adalah “pasal keranjang” untuk perilaku tidak jujur yang belum tentu melanggar hukum pidana.",
        "Bentuk yang paling sering diuji: plagiarisme — menyalin analisis, laporan, atau model orang lain tanpa atribusi dan menyajikannya sebagai karya sendiri. Bukan soal hak cipta semata; ini soal kejujuran profesional: klien membayar untuk penilaian independenmu, bukan untuk fotokopi. Bentuk lain: berbohong di CV (gelar palsu, pengalaman yang dibesar-besarkan), memalsukan dokumen, dan tindak pidana yang memengaruhi integritas profesional.",
        "Bedakan I(D) dari I(A) Knowledge of Law. I(A) dilanggar bila kamu melanggar hukum yang berlaku. I(D) dilanggar bila perbuatanmu tidak jujur atau merusak kepercayaan profesi — meski belum tentu melanggar hukum pidana. Menyalin laporan pesaing tanpa atribusi mungkin bukan tindak pidana, tetapi tetap pelanggaran I(D). Sebaliknya, pelanggaran hukum yang tidak terkait integritas profesional (misal tilang lalu lintas) umumnya bukan pelanggaran I(D).",
        "Kaitannya dengan Standard V(A): rekomendasi tanpa basis riset yang memadai melanggar V(A); rekomendasi yang menyalin karya orang lain tanpa atribusi melanggar I(D) sekaligus V(A). Dalam vignette, bila kamu melihat “menyalin tanpa atribusi”, jawabannya hampir selalu I(D) — dan bila pertanyaannya menekankan “tanpa basis”, jawabannya V(A).",
      ],
      tasks: [],
      quiz: [
        {
          q: "Analis menyalin laporan riset pesaing, mengganti logo, dan menyajikannya ke klien sebagai karyanya. Ini?",
          options: [
            { text: "Boleh — laporan itu sudah dipublikasikan", why: "Salah: publikasi tidak menghapus kewajiban atribusi. Menyajikan karya orang lain sebagai karya sendiri adalah plagiarisme.", },
            { text: "Pelanggaran I(D) — plagiarisme dan ketidakjujuran profesional", why: "Benar: menyalin tanpa atribusi adalah perbuatan tidak jujur yang merusak kepercayaan profesi, meski mungkin bukan tindak pidana.", correct: true },
            { text: "Hanya pelanggaran hak cipta, bukan standar CFA", why: "Salah: standar CFA menilai kejujuran profesional, bukan hanya hukum hak cipta.", },
          ],
        },
        {
          q: "Kandidat menulis di CV bahwa ia “CFA charterholder” padahal belum lulus Level III. Standar yang paling tepat?",
          options: [
            { text: "I(D) saja", why: "Salah: memang ada unsur ketidakjujuran, tetapi ada standar yang lebih spesifik untuk klaim gelar.", },
            { text: "VII(B) — klaim gelar yang menyesatkan", why: "Benar: bila satu standar lebih spesifik, pilih yang paling spesifik. Klaim gelar diatur VII(B); I(D) adalah pasal keranjang bila tidak ada pasal lain yang cocok.", correct: true },
            { text: "Tidak melanggar — CV adalah dokumen pribadi", why: "Salah: CV yang diserahkan ke employer atau klien adalah representasi profesional dan tunduk pada standar.", },
          ],
        },
      ],
      reference: "I(D): plagiarisme dan ketidakjujuran profesional. Pilih standar paling spesifik: klaim gelar = VII(B), salinan tanpa atribusi = I(D).",
    },
    {
      id: "tugas-audit",
      eyebrow: "Langkah 5 · Tugas terpandu",
      title: "Audit kartu nama dan brosur: enam klaim, enam vonis",
      prose: [
        "Tugasmu: menjadi auditor kepatuhan selama 15 menit. Di bawah ini ada enam klaim nyata yang diambil dari kartu nama, LinkedIn, brosur, dan forum. Untuk setiap klaim, putuskan: PATUH atau MELANGGAR — dan bila melanggar, pasal apa. Kerjakan keenamnya sebelum melihat pembahasan di langkah checkpoint.",
        "Gunakan tiga pertanyaan saring: (1) Apakah klaim ini memakai “CFA” sebagai kata benda atau menempelkan level sebagai gelar? (2) Apakah klaim ini menyiratkan status yang belum dimiliki? (3) Apakah ada karya orang lain yang disajikan sebagai karya sendiri, atau isi ujian yang dibocorkan? Satu “ya” saja sudah cukup untuk vonis melanggar — lalu tentukan pasalnya.",
        "Perhatian: satu dari enam klaim di bawah ini PATUH. Jangan terjebak pola “semuanya melanggar” — pemeriksa CFA sengaja menyelipkan klaim yang benar untuk menguji apakah kamu membaca, bukan menebak pola.",
      ],
      tasks: [
        { id: "t1", text: "Nilai keenam klaim di kuis bawah: patuh atau melanggar, dan pasalnya" },
        { id: "t2", text: "Tulis ulang dua klaim yang melanggar menjadi versi yang patuh" },
      ],
      quiz: [
        {
          q: "Klaim 1 — Kartu nama: “Raka Wijaya, CFA” (baru lulus Level II). Vonis?",
          options: [
            { text: "MELANGGAR VII(B) — mengklaim gelar yang belum dimiliki", why: "Benar: “CFA” setelah nama menyiratkan charterholder. Versi patuh: “Lulus Level II Program CFA”.", correct: true },
            { text: "PATUH — lulus Level II sudah cukup untuk memakai CFA", why: "Salah: gelar CFA hanya boleh dipakai setelah charter diberikan, bukan setelah lulus satu level.", },
            { text: "MELANGGAR VII(A)", why: "Salah: VII(A) soal perilaku dalam program (ujian), bukan soal klaim gelar — itu VII(B).", },
          ],
        },
        {
          q: "Klaim 2 — LinkedIn: “CFA charterholder sejak 2024” (memang charterholder aktif). Vonis?",
          options: [
            { text: "MELANGGAR VII(B) — tidak boleh mencantumkan tahun", why: "Salah: mencantumkan tahun charter adalah informasi faktual yang benar dan diperbolehkan.", },
            { text: "PATUH — gelar dipakai sebagai kata sifat dan statusnya benar", why: "Benar: “CFA charterholder” adalah pemakaian yang tepat, dan statusnya memang benar.", correct: true },
            { text: "MELANGGAR I(D)", why: "Salah: tidak ada ketidakjujuran di sini — klaimnya benar dan formatnya tepat.", },
          ],
        },
        {
          q: "Klaim 3 — Brosur: “Tim riset kami: 5 CFA, 3 analis senior”. Vonis?",
          options: [
            { text: "PATUH — kelimanya memang charterholder", why: "Salah: “CFA” sebagai kata benda untuk orang adalah pemakaian yang salah, meski statusnya benar.", },
            { text: "MELANGGAR VII(B) — “CFA” dipakai sebagai kata benda", why: "Benar: versi patuh adalah “5 CFA charterholder”.", correct: true },
            { text: "MELANGGAR I(C) misrepresentation", why: "Salah: masalahnya bukan isi klaim yang menyesatkan, melainkan format pemakaian gelar — itu VII(B).", },
          ],
        },
        {
          q: "Klaim 4 — Email: “Saya CFA Level III, siap membantu portofoliomu”. Vonis?",
          options: [
            { text: "PATUH — ia memang kandidat Level III", why: "Salah: “CFA Level III” menempelkan level sebagai gelar — tidak ada gelar parsial.", },
            { text: "MELANGGAR VII(B) — level ditempel sebagai gelar", why: "Benar: versi patuh adalah “Kandidat Level III Program CFA”.", correct: true },
            { text: "MELANGGAR VII(A)", why: "Salah: VII(A) soal perilaku dalam program, bukan soal cara menyebut status kandidat.", },
          ],
        },
        {
          q: "Klaim 5 — Forum: “Soal ujian kemarin banyak tentang atribusi Brinson, ini detail soalnya…” Vonis?",
          options: [
            { text: "PATUH — berbagi ilmu itu baik", why: "Salah: membocorkan isi soal ujian merusak validitas ujian bagi semua kandidat.", },
            { text: "MELANGGAR VII(A) — membocorkan konten ujian", why: "Benar: mengungkapkan soal ujian yang sebenarnya dilarang; membahas topik umum saja yang diperbolehkan.", correct: true },
            { text: "MELANGGAR II(A)", why: "Salah: II(A) soal info material nonpublik pasar modal, bukan soal konten ujian.", },
          ],
        },
        {
          q: "Klaim 6 — Presentasi: “Rekomendasi ini hasil riset tim kami” — padahal menyalin laporan pesaing tanpa atribusi. Vonis?",
          options: [
            { text: "PATUH — laporan pesaing sudah publik", why: "Salah: publikasi tidak menghapus kewajiban atribusi.", },
            { text: "MELANGGAR I(D) — plagiarisme", why: "Benar: menyajikan karya orang lain sebagai karya sendiri adalah ketidakjujuran profesional.", correct: true },
            { text: "MELANGGAR VII(B)", why: "Salah: tidak ada soal klaim gelar di sini — masalahnya adalah atribusi karya.", },
          ],
        },
      ],
      reference: "Audit: 5 melanggar (VII(B) × 3, VII(A) × 1, I(D) × 1), 1 patuh (klaim 2).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tiga pertanyaan campuran dari semua langkah. Ingat pola pemeriksa: klaim gelar yang salah format = VII(B); bocoran soal = VII(A); karya orang lain tanpa atribusi = I(D). Bila dua standar tampak relevan, pilih yang paling spesifik.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Charterholder yang keanggotaannya dicabut tetap memakai “CFA” di kartu nama. Ini?",
          options: [
            { text: "Boleh — ia pernah lulus tiga level", why: "Salah: gelar melekat pada status keanggotaan yang aktif; setelah dicabut, gelar tidak boleh dipakai.", },
            { text: "Pelanggaran VII(B) — memakai gelar tanpa status yang sah", why: "Benar: gelar hanya boleh dipakai selama charter dan keanggotaan aktif.", correct: true },
            { text: "Pelanggaran VII(A)", why: "Salah: VII(A) soal perilaku dalam program, bukan soal pemakaian gelar.", },
          ],
        },
        {
          q: "Kandidat bercerita ke temannya: “Aku lagi belajar atribusi Brinson minggu ini.” Ini?",
          options: [
            { text: "Pelanggaran VII(A) — membocorkan materi ujian", why: "Salah: membahas topik umum yang dipelajari diperbolehkan; yang dilarang adalah isi soal ujian yang sebenarnya.", },
            { text: "Boleh — topik umum bukan isi soal", why: "Benar: garisnya adalah topik boleh, soal tidak boleh.", correct: true },
            { text: "Pelanggaran II(A)", why: "Salah: II(A) soal info material nonpublik pasar modal, bukan soal topik belajar.", },
          ],
        },
        {
          q: "Analis mengutip satu paragraf laporan pesaing dengan atribusi jelas dan izin. Ini?",
          options: [
            { text: "Pelanggaran I(D)", why: "Salah: mengutip dengan atribusi yang jelas bukan plagiarisme — justru itulah cara yang benar.", },
            { text: "Boleh — kutipan ber-atribusi bukan plagiarisme", why: "Benar: I(D) dilanggar bila karya orang lain disajikan sebagai karya sendiri; atribusi yang jelas menyembuhkannya.", correct: true },
            { text: "Pelanggaran V(A)", why: "Salah: mengutip dengan atribusi tidak melanggar basis riset — selama analis memverifikasi dan memahami isinya.", },
          ],
        },
      ],
      summary: [
        "VII(A): jangan mencontek, jangan membocorkan soal ujian, jangan melanggar aturan program.",
        "VII(B): “CFA” hanya sebagai kata sifat; tidak ada gelar parsial; jangan klaim charter yang belum ada.",
        "I(D): plagiarisme dan ketidakjujuran profesional — karya orang lain tanpa atribusi = pelanggaran.",
        "Topik umum boleh dibahas; isi soal ujian tidak boleh.",
        "Bila dua standar tampak relevan, pilih yang paling spesifik.",
      ],
      next: { label: "PM-A1D — Standard V & Suitability: Basis Riset yang Layak", href: "/v2/learn/pm-a1d-ethics-basis-suitability" },
    },
  ],
};
