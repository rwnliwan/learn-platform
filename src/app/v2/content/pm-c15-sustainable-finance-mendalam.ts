import type { V2Lesson } from "../lib/types";

export const pmc15: V2Lesson = {
  slug: "pm-c15-sustainable-finance-mendalam",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C15 — Sustainable Finance Mendalam: Taksonomi, SFDR, dan Skenario Iklim",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dana 'hijau' yang berisi batubara — dan regulator yang akhirnya bertindak",
      prose: [
        "Tahun 2023, sebuah dana bernama 'Green Future' mengklaim portofolionya 100 persen berkelanjutan. Audit menemukan 30 persen isinya adalah perusahaan batubara — dengan alasan 'mereka punya rencana transisi'. Investor menuntut. Regulator Uni Eropa mendenda manajernya. Dana itu bukan penipu amatir — ia memakai celah definisi: 'berkelanjutan' tidak punya arti hukum yang mengikat. Sampai taksonomi datang.",
        "Taksonomi Uni Eropa (2020) adalah kamus hukum pertama untuk 'hijau': aktivitas ekonomi disebut berkelanjutan hanya bila memenuhi kriteria teknis yang terukur — misalnya pembangkit listrik di bawah 100 gram CO2 per kWh. SFDR (2021) memaksa dana mengklasifikasikan diri: Artikel 6 (tidak peduli ESG), Artikel 8 (mempromosikan ESG), Artikel 9 (tujuan berkelanjutan). Tiba-tiba 'hijau' punya arti — dan dana yang salah klaim bisa dituntut.",
        "Lesson ini mendalami sustainable finance di luar PM-C11 (skor ESG, integrasi, greenwashing) dan PM-E2 (skor, greenwashing, integrasi praktis) — keduanya tidak pernah menyentuh taksonomi, SFDR, TCFD/ISSB, green bond, atau skenario iklim. Setelah lesson ini kamu bisa: (1) menjelaskan taksonomi UE dan kriteria teknisnya; (2) membedakan dana Artikel 6, 8, dan 9 SFDR; (3) membaca pengungkapan TCFD/ISSB; (4) menghitung greenium dan weighted average carbon intensity; (5) memakai skenario iklim NGFS untuk stress test portofolio.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "PM-C11 membahas etika dan ESG (skor ESG empat provider, integrasi vs screening, greenwashing, dilema fidusia) dan PM-E2 membahas ESG praktis (skor tertimbang, greenwashing, integrasi). Grep menyeluruh: taksonomi, SFDR, TCFD, dan ISSB mendapat NOL hit di seluruh track Portfolio Management. Lesson ini membangun kerangka regulasi dan kuantifikasi iklim itu dari nol.",
      },
      reference: "Greenium 20 bps (green bond 6,8 persen vs konvensional 7,0 persen). WACI portofolio 122 ton CO2e per juta rupiah pendapatan. Taksonomi UE: listrik hijau di bawah 100 gram CO2 per kWh.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membedakan dana yang benar-benar hijau dari dana yang hanya memakai cat hijau.",
        "(1) Menjelaskan taksonomi UE dan kriteria teknis aktivitas berkelanjutan;",
        "(2) Membedakan dana SFDR Artikel 6, 8, dan 9;",
        "(3) Membaca pengungkapan iklim TCFD/ISSB (tata kelola, strategi, manajemen risiko, metrik);",
        "(4) Menghitung greenium dan weighted average carbon intensity (WACI);",
        "(5) Memakai skenario iklim NGFS untuk stress test portofolio.",
      ],
      tasks: [],
    },
    {
      id: "taksonomi-sfdr",
      eyebrow: "Langkah 3 · Teori",
      title: "Taksonomi dan SFDR: kamus dan label yang mengikat",
      prose: [
        "Taksonomi Uni Eropa adalah sistem klasifikasi aktivitas ekonomi berkelanjutan. Aktivitas disebut 'selaras taksonomi' bila memenuhi tiga syarat: berkontribusi substansial pada satu dari enam tujuan lingkungan (mitigasi iklim, adaptasi, air, ekonomi sirkular, polusi, keanekaragaman hayati); tidak merugikan secara signifikan (do no significant harm) tujuan lainnya; dan memenuhi pengaman minimum (hak asasi, ketenagakerjaan). Kriteria teknisnya kuantitatif: pembangkit listrik harus di bawah 100 gram CO2 per kWh; bangunan baru harus memakai energi primer 10 persen di bawah standar nasional.",
        "SFDR (Sustainable Finance Disclosure Regulation) adalah aturan labelnya. Dana Artikel 6: tidak mengintegrasikan ESG — boleh, tetapi harus mengakuinya. Dana Artikel 8 ('light green'): mempromosikan karakteristik lingkungan atau sosial — harus mengungkapkan bagaimana. Dana Artikel 9 ('dark green'): tujuan investasi berkelanjutan — harus membuktikan dampaknya dengan metrik. Konsekuensinya nyata: dana Artikel 9 yang ternyata memegang batubara bisa dituntut investor dan didenda regulator — seperti 'Green Future' di cerita pembuka.",
        "Kenapa ini penting bagi investor Indonesia? Tiga alasan. Pertama, dana global yang masuk ke Indonesia memakai label ini — dana Artikel 9 tidak bisa membeli perusahaanmu bila tidak selaras taksonomi. Kedua, OJK mengadopsi logika yang sama lewat Taksonomi Keuangan Berkelanjutan Indonesia (TKBI) — CR34 membahasnya dari sisi kredit. Ketiga, biaya modal: perusahaan yang selaras taksonomi mendapat akses ke green bond dengan greenium — yield lebih rendah 20 bps — sementara yang tidak selaras membayar lebih mahal.",
        "Batas taksonomi yang jujur: ia mengukur aktivitas, bukan perusahaan. Perusahaan batubara dengan satu pembangkit surya bisa mengklaim sebagian pendapatannya 'selaras' — sementara 90 persen pendapatannya dari batubara. Investor harus membaca PERSENTASE keselarasan (taxonomy alignment), bukan sekadar klaim 'memiliki aktivitas hijau'. Dan taksonomi sosial masih dalam pengembangan — 'berkelanjutan' hari ini sebagian besar berarti 'hijau', bukan 'adil'.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira dana Artikel 8 berarti dana itu 'baik'. Artikel 8 hanya berarti dana itu MEMPROMOSIKAN karakteristik ESG — bukan bahwa portofolionya berkelanjutan. Selalu baca pengungkapan dan metriknya, bukan labelnya.",
      },
      reference: "Taksonomi UE: listrik hijau di bawah 100 gram CO2 per kWh. SFDR: Artikel 6 (tidak peduli), 8 (mempromosikan), 9 (tujuan berkelanjutan).",
    },
    {
      id: "tcfd-issb-metrik",
      eyebrow: "Langkah 4 · Teori",
      title: "TCFD/ISSB dan metrik: dari janji ke angka",
      prose: [
        "TCFD (Task Force on Climate-related Financial Disclosures) menetapkan empat pilar pengungkapan iklim: tata kelola (siapa di direksi yang bertanggung jawab), strategi (bagaimana iklim memengaruhi bisnis dalam skenario berbeda), manajemen risiko (bagaimana risiko iklim diidentifikasi dan dikelola), dan metrik (angka emisinya). ISSB (International Sustainability Standards Board) mengadopsi kerangka ini menjadi standar global IFRS S1/S2 — yang diadopsi banyak yurisdiksi termasuk Indonesia secara bertahap.",
        "Dua metrik yang wajib dikuasai investor. Greenium: selisih yield green bond terhadap obligasi konvensional sejenis. Contoh: green bond 6,8 persen vs konvensional 7,0 persen → greenium 20 bps. Greenium positif berarti investor membayar lebih (menerima yield lebih rendah) untuk obligasi hijau — harga dari preferensi. Greenium yang besar bisa berarti permintaan hijau melebihi pasokan — atau berarti green bond itu sebenarnya tidak lebih hijau (greenwashing premium terbalik). Weighted Average Carbon Intensity (WACI): rata-rata tertimbang intensitas karbon portofolio. Contoh: saham A Rp200 juta dengan intensitas 80 ton CO2e per juta rupiah pendapatan, saham B Rp300 juta dengan 150 → WACI = (200×80 + 300×150) dibagi 500 = 122 ton per juta rupiah.",
        "WACI bukan jejak karbon absolut — ia intensitas per pendapatan. Perusahaan besar dengan pendapatan besar bisa punya WACI rendah meski emisinya raksasa. Selalu baca WACI bersama emisi absolut (Scope 1, 2, 3) dan target pengurangannya. Scope 1: emisi langsung (cerobong sendiri). Scope 2: emisi dari listrik yang dibeli. Scope 3: emisi rantai nilai (pemasok, penggunaan produk) — biasanya 70–90 persen dari total, dan paling sulit diukur.",
        "Skenario iklim NGFS (Network for Greening the Financial System) adalah stress test untuk portofolio. Tiga skenario utama: Orderly (transisi teratur, karbon naik bertahap — kerugian moderat), Disorderly (transisi terlambat lalu tiba-tiba — kerugian besar di aset karbon), Hot House World (tidak ada transisi — kerugian fisik besar dari banjir dan panas). Investor menjalankan portofolionya lewat ketiga skenario dan melihat kerugiannya — seperti stress test MR7, tetapi dengan suhu sebagai faktor risiko.",
      ],
      tasks: [],
      formula: String.raw`\text{WACI} = \sum w_i \times I_i \qquad \text{Greenium} = y_{konv} - y_{green}`,
      formulaNote: "WACI = weighted average carbon intensity; w = bobot portofolio; I = intensitas karbon (ton CO2e per juta rupiah pendapatan). Contoh: (200×80 + 300×150)/500 = 122. Greenium = 7,0 − 6,8 = 20 bps.",
      reference: "Greenium 20 bps. WACI 122 ton CO2e per juta rupiah pendapatan. Scope 3 biasanya 70–90 persen dari total emisi.",
    },
    {
      id: "lab-iklim",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin metrik iklim portofolio",
      prose: [
        "Lab ini membangun mesin metrik iklim: dari yield obligasi dan intensitas karbon holdings — hitung greenium dan WACI portofolio.",
        "Hitung dulu di kepala. Greenium = 7,0 − 6,8 = 0,2 persen = 20 bps. WACI = (200 × 80 + 300 × 150) dibagi 500 = (16.000 + 45.000) dibagi 500 = 61.000 dibagi 500 = 122 ton CO2e per juta rupiah pendapatan.",
        "Tugas lab: tulis fungsi yang menerima yield konvensional, yield green bond, nilai dan intensitas dua holdings — lalu mencetak greenium dalam bps dan WACI. Dua angka ini adalah ringkasan iklim satu portofolio dalam satu baris.",
        "Setelah lolos, coba eksperimen: ganti saham B dengan perusahaan intensitas 40 (energi terbarukan) dan lihat WACI jatuh ke 56 — lalu tanyakan: apakah WACI yang rendah berarti portofoliomu benar-benar hijau, atau hanya berarti kamu menjual perusahaan kotor ke orang lain?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `greenium_bps` ((yield konvensional - yield green) dikali 100)" },
        { id: "t2", text: "Hitung `waci` (rata-rata tertimbang intensitas karbon)" },
        { id: "t3", text: "Tentukan `vonis` ('HIJAU' bila WACI di bawah 100, 'KOTOR' bila tidak)" },
      ],
      expected: "greenium_bps=20.0\nwaci=122.0\nvonis=KOTOR",
      hints: [
        "Greenium bps = (yield konvensional - yield green) x 100.",
        "WACI = (nilai A x intensitas A + nilai B x intensitas B) / total nilai.",
        "Vonis HIJAU bila WACI < 100, KOTOR bila tidak.",
      ],
      code: {
        starter: `# Green bond 6,8% vs konvensional 7,0%. Holdings: A Rp200 jt (80 t/jt), B Rp300 jt (150 t/jt).\ny_konv = 7.0\ny_green = 6.8\nnilai_a = 200.0\nint_a = 80.0\nnilai_b = 300.0\nint_b = 150.0\n\n# TULIS KODEMU: hitung greenium_bps, waci, vonis.\n# Cetak, per baris: greenium_bps, waci, vonis.\n\n`,
        lockLines: 7,
        solution: `# Green bond 6,8% vs konvensional 7,0%. Holdings: A Rp200 jt (80 t/jt), B Rp300 jt (150 t/jt).\ny_konv = 7.0\ny_green = 6.8\nnilai_a = 200.0\nint_a = 80.0\nnilai_b = 300.0\nint_b = 150.0\n\n\ngreenium_bps = (y_konv - y_green) * 100\ntotal = nilai_a + nilai_b\nwaci = (nilai_a * int_a + nilai_b * int_b) / total\nvonis = "HIJAU" if waci < 100 else "KOTOR"\nprint(f"greenium_bps={greenium_bps:.1f}")\nprint(f"waci={waci:.1f}")\nprint(f"vonis={vonis}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "greenium_bps", value: 20.0, tol: 0.01, label: "Greenium 20 bps", msg: "(7,0 - 6,8) x 100 = 20. Investor membayar 20 bps untuk label hijau." },
          { kind: "equal", task: "t2", name: "waci", value: 122.0, tol: 0.01, label: "WACI 122 ton per juta rupiah", msg: "(16.000 + 45.000) / 500 = 122. Di atas ambang 100 — portofolio ini kotor." },
          { kind: "stdout_matches", task: "t3", pattern: "vonis=KOTOR", label: "Vonis KOTOR", msg: "WACI 122 di atas ambang 100. Menjual B dan membeli yang bersih akan menurunkan WACI — tetapi apakah itu mengurangi emisi dunia?" },
        ],
      },
      reference: "Greenium 20 bps; WACI 122 ton CO2e per juta rupiah; vonis KOTOR.",
    },
    {
      id: "engagement-skenario",
      eyebrow: "Langkah 6 · Teori",
      title: "Engagement vs divestasi, dan stress test skenario",
      prose: [
        "Investor yang menemukan portofolionya kotor punya dua pilihan: divestasi (jual) atau engagement (bertahan dan menekan perubahan). Divestasi bersih secara akuntansi — WACI portofolio langsung turun — tetapi emisinya tidak berkurang: saham kotor itu dibeli orang lain yang mungkin kurang peduli. Engagement lambat dan tidak pasti — tetapi bila berhasil, emisinya benar-benar turun. Bukti empiris: engagement oleh investor besar berhasil mengubah kebijakan perusahaan dalam sekitar 30 persen kasus — terutama bila didukung ancaman divestasi yang kredibel. Strategi terbaik sering gabungan: engagement dulu dengan tenggat, divestasi bila tenggat dilanggar.",
        "Stress test skenario NGFS menerjemahkan iklim menjadi kerugian portofolio. Contoh ilustratif: portofolio Rp800 juta dengan 40 persen di aset karbon-intensif (Rp320 juta). Skenario Orderly: aset karbon turun 15 persen → kerugian Rp48 juta (6 persen portofolio). Skenario Disorderly: turun 30 persen → kerugian Rp96 juta (12 persen). Skenario Hot House World: kerugian fisik (banjir, panas) memukul real estate dan infrastruktur — kerugian bisa melebihi Disorderly dalam jangka panjang. Angka-angka ini ilustratif — tetapi ordonya benar: risiko transisi adalah risiko dekade ini; risiko fisik adalah risiko dekade berikutnya.",
        "Satu peringatan tentang skenario: model iklim dan model keuangan sama-sama tidak pasti — menggabungkan keduanya melipatgandakan ketidakpastian. Skenario NGFS bukan prediksi; ia alat untuk bertanya 'bagaimana bila'. Investor yang memakai satu skenario sebagai ramalan sedang menyalahgunakan alatnya. Pakai ketiganya, bandingkan, dan rancang portofolio yang bertahan di semuanya — bukan yang optimal di satu skenario.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira menjual saham kotor berarti mengurangi emisi dunia. Divestasi hanya memindahkan kepemilikan — emisinya tetap ada di tangan pembeli baru. Pengurangan emisi yang nyata datang dari engagement yang berhasil atau dari perusahaan yang benar-benar mengubah operasinya.",
      },
      reference: "Engagement berhasil sekitar 30 persen kasus bila didukung ancaman divestasi kredibel. Disorderly: kerugian 12 persen portofolio (ilustratif).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: dana pensiun yang harus memilih",
      prose: [
        "Dana pensiun dengan Rp10 triliun diminta anggotanya menjadi '100 persen hijau dalam 3 tahun'. Manajer investasi menghitung: menjual seluruh aset karbon-intensif sekarang berarti menjual di harga diskon (pasar sudah tahu mereka harus menjual), membayar biaya transaksi besar, dan kehilangan dividen 6 persen yang mendanai pensiun anggota. WACI portofolio akan turun ke hampir nol — dan emisi dunia tidak berkurang satu ton pun, karena pembelinya adalah dana lain yang tidak peduli iklim.",
        "Alternatifnya: rencana transisi 10 tahun — engagement dengan 20 emiten terbesar (70 persen dari emisi portofolio), target pengurangan intensitas 7 persen per tahun (sesuai jalur Paris Agreement), dan divestasi bertahap hanya untuk yang menolak engagement selama 2 tahun. WACI turun 50 persen dalam 5 tahun — lebih lambat dari janji '100 persen hijau' — tetapi emisi portofolio benar-benar turun, dividen tetap mengalir, dan tidak ada fire sale.",
        "Keputusan: pilih rencana transisi — dan komunikasikan dengan jujur kepada anggota bahwa '100 persen hijau dalam 3 tahun' adalah janji yang memindahkan masalah, bukan menyelesaikannya. Dana pensiun yang jujur tentang trade-off-nya akan dipercaya lebih lama dari dana yang berjanji manis dan gagal diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, emisi dunia — bukan WACI portofolio — yang menjadi ukuran keberhasilan. Kedua, biaya transisi (fire sale, kehilangan dividen) dihitung secara eksplisit. Ketiga, janji disesuaikan dengan realitas — dan realitas dikomunikasikan dengan jujur.",
      },
      reference: "Rencana transisi 10 tahun: engagement 20 emiten, target kurang 7 persen per tahun, divestasi hanya untuk yang menolak.",
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
        "Greenium 20 bps; WACI 122 ton CO2e per juta rupiah; vonis KOTOR.",
        "Taksonomi UE: aktivitas berkelanjutan harus memenuhi kriteria teknis terukur.",
        "SFDR: Artikel 6 (tidak peduli), 8 (mempromosikan), 9 (tujuan berkelanjutan).",
        "TCFD/ISSB: tata kelola, strategi, manajemen risiko, metrik. Scope 3 biasanya 70–90 persen emisi.",
        "Engagement + tenggat + divestasi bila dilanggar mengalahkan divestasi seketika.",
      ],
      next: { label: "C16 — Goals-Based Investing dan Behavioral Coaching: Portofolio per Tujuan", href: "/v2/learn/pm-c16-goals-based-investing" },
      quiz: [
        {
          q: "Green bond yield 6,8 persen, obligasi konvensional sejenis 7,0 persen. Holdings A Rp200 juta (80 ton/juta) dan B Rp300 juta (150 ton/juta). Berapa greenium dan WACI?",
          options: [
            { text: "Greenium 20 bps; WACI 122 ton per juta rupiah", why: "Tepat: (7,0 − 6,8) × 100 = 20; (200×80 + 300×150)/500 = 122.", correct: true },
            { text: "Greenium 2 bps; WACI 115 ton per juta rupiah", why: "Salah: greenium 0,2 persen = 20 bps, bukan 2 bps. WACI memakai bobot nilai — bukan rata-rata sederhana (80+150)/2 = 115." },
            { text: "Greenium minus 20 bps; WACI 122 ton per juta rupiah", why: "Salah: greenium = yield konvensional DIKURANGI yield green = positif 20 bps. Tanda negatif berarti green bond memberi yield LEBIH TINGGI." },
            { text: "Greenium 20 bps; WACI 230 ton per juta rupiah", why: "Salah: 230 adalah JUMLAH intensitas (80+150), bukan rata-rata tertimbang. WACI menimbang dengan nilai holdings." },
          ],
        },
        {
          q: "Dana Artikel 9 SFDR ternyata memegang 30 persen saham batubara. Apa konsekuensinya?",
          options: [
            { text: "Tidak ada — Artikel 9 hanya rekomendasi", why: "Salah: SFDR adalah regulasi mengikat. Dana Artikel 9 wajib membuktikan tujuan berkelanjutannya — pelanggaran bisa dituntut dan didenda." },
            { text: "Dana bisa dituntut investor dan didenda regulator — Artikel 9 berarti tujuan berkelanjutan yang harus dibuktikan", why: "Tepat: label Artikel 9 adalah klaim hukum, bukan pemasaran. Inilah bedanya dengan era sebelum SFDR.", correct: true },
            { text: "Dana otomatis turun menjadi Artikel 8 tanpa konsekuensi", why: "Salah: tidak ada penurunan otomatis yang gratis. Reklasifikasi harus diungkapkan dan pelanggaran masa lalu tetap bisa dituntut." },
            { text: "Hanya manajernya yang didenda — investor tidak bisa menuntut", why: "Salah: investor yang dirugikan oleh klaim palsu bisa menuntut. Itulah inti perlindungan SFDR." },
          ],
        },
        {
          q: "Perusahaan melaporkan Scope 1 dan 2 kecil, tetapi Scope 3 besar. Apa yang harus disimpulkan investor?",
          options: [
            { text: "Perusahaan itu hijau — Scope 1 dan 2 yang penting", why: "Salah: Scope 3 biasanya 70–90 persen dari total emisi. Mengabaikannya berarti mengabaikan sebagian besar jejak karbon." },
            { text: "Perusahaan itu mungkin jauh lebih kotor dari yang terlihat — Scope 3 adalah sebagian besar emisi dan harus diperiksa", why: "Tepat: rantai nilai (pemasok, penggunaan produk) mendominasi emisi kebanyakan perusahaan. Scope 1+2 saja adalah potret yang menipu.", correct: true },
            { text: "Scope 3 tidak bisa diukur sehingga boleh diabaikan", why: "Salah: sulit diukur bukan berarti boleh diabaikan. ISSB mewajibkan pengungkapan Scope 3 — dengan estimasi bila perlu." },
            { text: "Perusahaan itu pasti melakukan greenwashing", why: "Salah: Scope 3 besar bukan bukti greenwashing — ia fakta struktural banyak industri. Yang dinilai adalah apakah perusahaan MENGUNGKAP dan MENGELOLANYA." },
          ],
        },
        {
          q: "Dana pensiun ingin portofolionya 'hijau'. Mana strategi yang paling mengurangi emisi dunia secara nyata?",
          options: [
            { text: "Jual semua saham kotor besok — WACI langsung nol", why: "Salah: WACI nol, emisi dunia tetap — saham kotor dibeli orang lain. Divestasi memindahkan kepemilikan, bukan mengurangi emisi." },
            { text: "Engagement dengan tenggat pada emiten terbesar + divestasi bila tenggat dilanggar", why: "Tepat: engagement yang berhasil benar-benar menurunkan emisi; ancaman divestasi yang kredibel membuatnya berhasil dalam sekitar 30 persen kasus.", correct: true },
            { text: "Beli green bond sebanyak-banyaknya tanpa memeriksa emiten", why: "Salah: green bond tanpa verifikasi bisa greenwashing. Label hijau bukan jaminan dampak." },
            { text: "Ubah definisi 'hijau' agar portofolio saat ini lolos", why: "Salah: itu greenwashing definisional — dan di bawah SFDR, klaim seperti itu bisa dituntut." },
          ],
        },
        {
          q: "Dalam skenario NGFS Disorderly, apa yang terjadi pada aset karbon-intensif?",
          options: [
            { text: "Tidak ada efek — skenario iklim hanya memengaruhi cuaca", why: "Salah: Disorderly berarti transisi terlambat lalu tiba-tiba — kebijakan karbon mendadak membuat aset karbon jatuh nilainya." },
            { text: "Nilainya jatuh tajam karena kebijakan karbon mendadak (misalnya pajak karbon tinggi) membuat asetnya stranded", why: "Tepat: transisi yang tertunda lalu dipercepat menghukum aset karbon paling keras — kerugian ilustratif 30 persen.", correct: true },
            { text: "Nilainya naik — kelangkaan karbon menaikkan harga", why: "Salah: terbalik. Pajak karbon dan regulasi menekan nilai aset karbon-intensif, bukan menaikkannya." },
            { text: "Hanya aset fisik yang terkena — portofolio keuangan aman", why: "Salah: portofolio keuangan memegang klaim atas aset fisik itu. Bila asetnya stranded, klaimnya jatuh." },
          ],
        },
      ],
    },
  ],
};
