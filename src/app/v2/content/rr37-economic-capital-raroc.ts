import type { V2Lesson } from "../lib/types";

export const rr37: V2Lesson = {
  slug: "rr37-economic-capital-raroc",
  track: "Risk Reporting",
  module: "Permodalan & KPMM",
  title: "RR37 — Economic Capital dan RAROC: Modal yang Benar-Benar Dibutuhkan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua bisnis, laba sama, modal berbeda jauh",
      prose: [
        "Bank Artha Dana punya dua bisnis: kredit korporasi dan kredit UKM. Keduanya melaba Rp20 miliar tahun ini. Direksi memberi bonus sama — sampai risk reporting menunjukkan modal ekonomi masing-masing: korporasi butuh Rp76 miliar, UKM butuh Rp120 miliar. Laba yang sama, dibiayai modal yang berbeda jauh — bisnis UKM ternyata jauh kurang menguntungkan per rupiah modal.",
        "Modal ekonomi (economic capital) adalah modal yang benar-benar dibutuhkan untuk menanggung kerugian tak terduga pada tingkat keyakinan tertentu — bukan modal minimum regulator (Pilar 1), melainkan modal menurut risiko bank sendiri. RAROC membagi laba yang disesuaikan risiko dengan modal ekonomi itu: ukuran pengembalian yang jujur.",
        "Lesson ini mengajarkan economic capital dan RAROC dari sudut pelaporan. Setelah lesson ini kamu bisa: (1) membedakan modal regulator vs modal ekonomi; (2) menghitung expected loss, unexpected loss, dan modal ekonomi; (3) menghitung RAROC; (4) membandingkan bisnis dengan RAROC; (5) menulis laporan alokasi modal yang bisa dipakai direksi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "RR16 membahas RWA dan CAR (modal regulator Pilar 1) dan RR25 membahas ICAAP — tetapi economic capital dan RAROC tidak pernah disebut di track RR (0 hit). Lesson ini membangun sudut pelaporannya: dari angka risiko ke keputusan alokasi modal.",
      },
      reference: "VaR 99,9 persen 85, expected loss 9: modal ekonomi 76. Laba disesuaikan risiko 20 dibagi 76: RAROC 26,3 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjawab pertanyaan direksi yang sebenarnya: bisnis mana yang paling menguntungkan per rupiah modal yang dipertaruhkan.",
        "(1) Membedakan modal regulator (Pilar 1) dari modal ekonomi (risiko sendiri);",
        "(2) Menghitung expected loss dan modal ekonomi dari VaR;",
        "(3) Menghitung RAROC dari laba yang disesuaikan risiko;",
        "(4) Membandingkan dua bisnis dengan RAROC, bukan dengan laba mentah;",
        "(5) Menulis laporan alokasi modal dengan hurdle rate yang eksplisit.",
      ],
      tasks: [],
    },
    {
      id: "modal-ekonomi",
      eyebrow: "Langkah 3 · Teori",
      title: "Modal ekonomi: VaR dikurangi expected loss",
      prose: [
        "Expected loss (EL) adalah kerugian rata-rata yang diharapkan — ia ditanggung lewat pencadangan (ECL) dan harga, bukan lewat modal. Unexpected loss (UL) adalah kerugian di atas rata-rata pada tingkat keyakinan tertentu — inilah yang ditanggung modal ekonomi. Rumus pelaporannya: modal ekonomi sama dengan VaR pada 99,9 persen dikurangi expected loss.",
        "Di cerita pembuka: VaR 99,9 persen sebesar 85, expected loss 9 — modal ekonomi sama dengan 85 dikurangi 9 sama dengan 76. Artinya: bank butuh Rp76 miliar modal untuk bisnis korporasi pada keyakinan 99,9 persen atas horizon SATU TAHUN — '1-dalam-1.000' berarti 1 dari 1.000 skenario setahun, bukan sekali dalam 1.000 tahun kalender; tanpa horizon yang dinyatakan, angka itu tidak berarti. Modal regulator (Pilar 1) bisa lebih kecil atau lebih besar — pada pendekatan standar ia memakai bobot standar, bukan risiko bank sendiri; tetapi bank yang disetujui regulator boleh memakai model internal (IRB) untuk modal regulatornya, jadi 'regulator = bobot standar' hanya benar untuk pendekatan standar. Bila modal ekonomi lebih besar dari modal regulator, bank yang bijak memegang yang lebih besar.",
        "Tingkat keyakinan 99,9 persen bukan angka sakral — ia adalah pilihan: seberapa jarang bank bersedia gagal. Bank dengan rating target AA memakai keyakinan lebih tinggi dari bank yang puas dengan BBB. Pilihan itu ditulis di laporan — karena modal ekonomi tanpa keyakinan yang dinyatakan adalah angka tanpa arti.",
      ],
      tasks: [],
      note: {
        title: "Modal ekonomi bukan cadangan",
        body: "Cadangan (ECL) menanggung expected loss — kerugian yang memang diharapkan terjadi. Modal ekonomi menanggung unexpected loss — kerugian yang tidak diharapkan tetapi mungkin. Mencampur keduanya berarti menghitung ganda atau menanggung kurang: laporan harus memisahkan keduanya dengan jelas.",
      },
      reference: "Modal ekonomi = VaR 99,9 persen dikurangi expected loss: 85 dikurangi 9 sama dengan 76.",
    },
    {
      id: "raroc",
      eyebrow: "Langkah 4 · Teori",
      title: "RAROC: laba per rupiah modal yang dipertaruhkan",
      prose: [
        "RAROC sama dengan laba yang disesuaikan risiko dibagi modal ekonomi. Laba yang disesuaikan risiko: pendapatan 40 dikurangi expected loss 9 dikurangi biaya operasional 11 sama dengan 20. RAROC: 20 dibagi 76 sama dengan 26,3 persen. Artinya: tiap Rp100 modal ekonomi menghasilkan Rp26,3 laba yang sudah dikurangi kerugian yang diharapkan dan biaya.",
        "Bandingkan dengan bisnis UKM: laba disesuaikan risiko juga 20, tetapi modal ekonomi 120 — RAROC 16,7 persen. Laba mentah sama (20 dan 20), tetapi RAROC berbeda jauh (26,3 vs 16,7). Direksi yang memberi bonus dari laba mentah memberi bonus sama untuk bisnis yang risikonya berbeda jauh — dan mendorong manajer mengambil risiko lebih besar demi laba yang sama.",
        "Hurdle rate adalah ambang keputusan: RAROC di atas biaya modal (misalnya 15 persen) berarti bisnis menciptakan nilai; di bawahnya berarti menghancurkan nilai meski labanya positif. Laporan RAROC yang baik menampilkan hurdle rate di samping tiap bisnis — supaya 'laba positif' tidak disalahartikan sebagai 'bisnis bagus'.",
      ],
      tasks: [],
      reference: "RAROC korporasi 26,3 persen (20 dibagi 76); UKM 16,7 persen (20 dibagi 120). Hurdle rate 15 persen: keduanya lolos, korporasi jauh lebih baik.",
    },
    {
      id: "lab-raroc",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung modal ekonomi dan RAROC",
      prose: [
        "Lab ini menghitung modal ekonomi dan RAROC dari VaR, expected loss, pendapatan, dan biaya.",
        "Hitung dulu di kepala. Modal ekonomi: 85 dikurangi 9 sama dengan 76. Laba disesuaikan risiko: 40 dikurangi 9 dikurangi 11 sama dengan 20. RAROC: 20 dibagi 76 dikali 100 sama dengan 26,3 persen (dibulatkan 1 desimal).",
        "Tugas lab: tulis fungsi yang menerima VaR, expected loss, pendapatan, dan biaya — lalu mencetak dua angka: modal_ekonomi dan raroc.",
        "Setelah lolos, coba eksperimen: naikkan expected loss menjadi 15 dan lihat RAROC turun menjadi 18,4 persen — kerugian yang diharapkan memakan laba sebelum modal dihitung.",
      ],
      tasks: [
        { id: "t1", text: "Hitung modal_ekonomi dari VaR dan expected loss" },
        { id: "t2", text: "Hitung raroc dari laba disesuaikan risiko" },
      ],
      expected: "modal_ekonomi=76\nraroc=26.3",
      hints: [
        "Modal ekonomi = VaR dikurangi expected loss.",
        "Laba disesuaikan = pendapatan dikurangi expected loss dikurangi biaya.",
        "RAROC = laba disesuaikan dibagi modal ekonomi, dikali 100, bulatkan 1 desimal.",
      ],
      code: {
        starter: `# Bisnis korporasi Bank Artha Dana (miliar rupiah).\nvar_999 = 85\nexpected_loss = 9\npendapatan = 40\nbiaya = 11\n\n# TULIS KODEMU: hitung modal_ekonomi dan raroc.\n# Cetak, per baris: modal_ekonomi, raroc.\n\n\nmesin_raroc(var_999, expected_loss, pendapatan, biaya)`,
        lockLines: 5,
        solution: `# Bisnis korporasi Bank Artha Dana (miliar rupiah).\nvar_999 = 85\nexpected_loss = 9\npendapatan = 40\nbiaya = 11\n\n\ndef mesin_raroc(var_999, expected_loss, pendapatan, biaya):\n    modal_ekonomi = var_999 - expected_loss\n    laba_disesuaikan = pendapatan - expected_loss - biaya\n    raroc = round(laba_disesuaikan / modal_ekonomi * 100, 1)\n    print(f"modal_ekonomi={modal_ekonomi}")\n    print(f"raroc={raroc}")\n\n\nmesin_raroc(var_999, expected_loss, pendapatan, biaya)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "modal_ekonomi=76", label: "Modal ekonomi 76", msg: "85 - 9 = 76 miliar." },
          { kind: "stdout_matches", task: "t2", pattern: "raroc=26.3", label: "RAROC 26,3 persen", msg: "Laba disesuaikan 20 / 76 x 100 = 26,3 persen." },
        ],
      },
      reference: "Modal ekonomi 76; RAROC 26,3 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: bonus yang akhirnya mengikuti risiko",
      prose: [
        "Kembali ke Bank Artha Dana. Laporan alokasi modal triwulanan menampilkan RAROC tiap bisnis berdampingan dengan hurdle rate 15 persen: korporasi 26,3 persen, UKM 16,7 persen. Direksi memutuskan: bonus mengikuti RAROC, bukan laba mentah — dan modal baru dialokasikan ke korporasi sampai RAROC-nya turun mendekati hurdle rate.",
        "Setahun kemudian UKM memperbaiki underwriting-nya: expected loss turun, modal ekonomi turun menjadi 100, RAROC naik menjadi 20,0 persen. Perbaikan itu terlihat di laporan — bukan karena labanya naik, melainkan karena risikonya turun. Itulah fungsi RAROC: ia memberi penghargaan pada pengurangan risiko, bukan hanya pada penambahan laba.",
        "Keputusan rapat: RAROC menjadi metrik resmi alokasi modal dan bonus, dengan hurdle rate yang ditinjau tiap tahun. Laba mentah tetap dilaporkan — tetapi tidak pernah lagi dipakai sendiri untuk keputusan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat RAROC bekerja di sini. Pertama, modal ekonomi dihitung dari risiko bank sendiri, bukan bobot standar. Kedua, hurdle rate eksplisit — 'bagus' punya definisi. Ketiga, RAROC dipakai untuk bonus dan alokasi — bukan sekadar angka di laporan.",
      },
      reference: "Korporasi 26,3 persen vs UKM 16,7 persen; hurdle 15 persen. UKM memperbaiki underwriting: RAROC naik ke 20,0 persen.",
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
        "Lab: modal ekonomi 76; RAROC 26,3 persen.",
        "Modal ekonomi = VaR 99,9 persen dikurangi expected loss.",
        "RAROC = laba disesuaikan risiko dibagi modal ekonomi.",
        "Laba mentah sama belum berarti sama baiknya — bandingkan RAROC.",
        "Hurdle rate: RAROC di atas biaya modal berarti menciptakan nilai.",
      ],
      next: { label: "RR38 — Pelaporan CVA: Saat Counterparty Bisa Gagal Bayar", href: "/v2/learn/rr38-pelaporan-cva" },
      quiz: [
        {
          q: "VaR 99,9 persen 85, expected loss 9, pendapatan 40, biaya 11. Berapa modal ekonomi dan RAROC?",
          options: [
            { text: "Modal 76, RAROC 26,3 persen", why: "Tepat: 85 - 9 = 76; laba disesuaikan 40 - 9 - 11 = 20; 20 / 76 = 26,3 persen.", correct: true },
            { text: "Modal 85, RAROC 23,5 persen — EL tidak dikurangi", why: "Salah: modal ekonomi adalah VaR dikurangi EL; EL ditanggung cadangan, bukan modal." },
            { text: "Modal 76, RAROC 52,6 persen — laba tidak dikurangi EL dan biaya", why: "Salah: laba disesuaikan harus dikurangi EL dan biaya: 40 - 9 - 11 = 20, bukan 40." },
            { text: "Modal 94, RAROC 21,3 persen — EL ditambah", why: "Salah: EL dikurangi dari VaR, bukan ditambah." },
          ],
        },
        {
          q: "Dua bisnis sama-sama laba 20, tetapi modal ekonomi 76 vs 120. Apa kesimpulannya?",
          options: [
            { text: "Keduanya sama baik — labanya sama", why: "Salah: laba mentah mengabaikan modal yang dipertaruhkan." },
            { text: "Bisnis pertama jauh lebih baik: RAROC 26,3 persen vs 16,7 persen", why: "Tepat: pengembalian per rupiah modal yang pertama hampir 10 poin lebih tinggi.", correct: true },
            { text: "Bisnis kedua lebih baik — modal lebih besar berarti lebih aman", why: "Salah: modal lebih besar untuk laba yang sama berarti kurang efisien, bukan lebih baik." },
            { text: "Tidak bisa dibandingkan tanpa tahu pendapatannya", why: "Salah: RAROC sudah membandingkan laba disesuaikan dengan modal — itulah perbandingannya." },
          ],
        },
        {
          q: "Apa beda modal regulator dan modal ekonomi?",
          options: [
            { text: "Tidak ada beda — keduanya dari regulator", why: "Salah: modal ekonomi dihitung dari risiko bank sendiri; regulator memakai bobot standar." },
            { text: "Modal ekonomi selalu lebih kecil", why: "Salah: bisa lebih besar atau lebih kecil — tergantung risiko bank vs bobot standar." },
            { text: "Regulator memakai bobot standar pada pendekatan standar Pilar 1 (bank IRB boleh memakai model internal yang disetujui); ekonomi memakai risiko bank sendiri pada keyakinan yang dinyatakan", why: "Tepat: bila ekonomi lebih besar dari regulator, bank bijak memegang yang lebih besar.", correct: true },
            { text: "Modal regulator untuk direksi, ekonomi untuk publik", why: "Salah: pembedanya cara hitung, bukan penerima." },
          ],
        },
        {
          q: "RAROC 12 persen dengan hurdle rate 15 persen. Apa artinya?",
          options: [
            { text: "Bisnis bagus karena labanya positif", why: "Salah: laba positif belum berarti menciptakan nilai — RAROC di bawah biaya modal berarti menghancurkan nilai." },
            { text: "Bisnis harus ditutup besok", why: "Salah: RAROC di bawah hurdle adalah sinyal perbaikan atau realokasi bertahap, bukan penutupan mendadak." },
            { text: "Hurdle rate salah — turunkan menjadi 10 persen", why: "Salah: mengubah hurdle untuk meloloskan bisnis adalah manipulasi." },
            { text: "Bisnis menghancurkan nilai meski laba positif — pengembaliannya di bawah biaya modal", why: "Tepat: itulah fungsi hurdle rate — memisahkan laba akuntansi dari penciptaan nilai.", correct: true },
          ],
        },
        {
          q: "Kenapa expected loss ditanggung cadangan, bukan modal ekonomi?",
          options: [
            { text: "EL adalah kerugian rata-rata yang diharapkan — dicadangkan; modal menanggung kerugian tak terduga di atas rata-rata", why: "Tepat: mencampur keduanya berarti menghitung ganda atau menanggung kurang.", correct: true },
            { text: "Karena EL terlalu kecil untuk dihitung", why: "Salah: EL bisa besar — alasan pemisahannya bukan ukuran." },
            { text: "Karena regulator melarang EL masuk modal", why: "Salah: ini soal logika risiko, bukan larangan — cadangan dan modal punya peran berbeda." },
            { text: "EL tidak pernah terjadi", why: "Salah: EL adalah rata-rata kerugian — ia terjadi secara rutin." },
          ],
        },
      ],
    },
  ],
};
