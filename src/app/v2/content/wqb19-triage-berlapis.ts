import type { V2Lesson } from "../lib/types";

const FIG_FUNNEL = `<svg viewBox="0 0 520 280" role="img" aria-label="Funnel triage: 394 kandidat menjadi 56 antrean submit.">
<g font-family="var(--font-ui)">
<rect x="60" y="30" width="400" height="40" fill="var(--chart-text)" opacity="0.25"/>
<text x="260" y="55" font-size="12" fill="var(--chart-text)" text-anchor="middle">394 kandidat masuk</text>
<rect x="110" y="90" width="300" height="40" fill="#e5484d" opacity="0.55"/>
<text x="260" y="115" font-size="12" fill="var(--chart-text)" text-anchor="middle">BUANG 240 (gagal gerbang)</text>
<rect x="150" y="150" width="220" height="40" fill="var(--c4)" opacity="0.8"/>
<text x="260" y="175" font-size="12" fill="var(--chart-text)" text-anchor="middle">TAHAN 98 (marginal)</text>
<rect x="200" y="210" width="120" height="40" fill="var(--c1)" opacity="0.9"/>
<text x="260" y="235" font-size="12" fill="#fff" text-anchor="middle">SUBMIT 56</text>
<text x="260" y="268" font-size="11" fill="var(--chart-text)" text-anchor="middle">Dua lapis: gerbang dasar (lolos/tidak) × prioritas antrean (tahan/submit).</text>
</g>
</svg>`;

const FIG_LABELS = `<svg viewBox="0 0 520 230" role="img" aria-label="Batang jumlah per label triage.">
<g font-family="var(--font-ui)">
<text x="10" y="52" font-size="12" fill="var(--chart-text)">BUANG</text>
<rect x="130" y="36" width="360" height="26" fill="#e5484d" opacity="0.7"/>
<text x="496" y="55" font-size="11" fill="var(--chart-text)">240</text>
<text x="10" y="112" font-size="12" fill="var(--chart-text)">TAHAN</text>
<rect x="130" y="96" width="147" height="26" fill="var(--c4)" opacity="0.9"/>
<text x="283" y="115" font-size="11" fill="var(--chart-text)">98</text>
<text x="10" y="172" font-size="12" fill="var(--chart-text)">ANTRIAN_SUBMIT</text>
<rect x="130" y="156" width="84" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="220" y="175" font-size="11" fill="var(--chart-text)">56</text>
<text x="130" y="206" font-size="11" fill="var(--chart-text)">dari 56: 12 ber-PENALTI turnover (diperbaiki dulu / antre paling belakang)</text>
</g>
</svg>`;

export const wqb19: V2Lesson = {
  slug: "wqb19-triage-berlapis",
  track: "WorldQuant Brain",
  module: "Strategi Riset Alpha",
  title: "WQB19 — Triage Berlapis: Dari 600 Kandidat ke Antrean Submit",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Wave yang menenggelamkan timnya sendiri",
      prose: [
        "Awalnya tim punya satu lapis triage: lolos gerbang (S ≥ 1,25 & F ≥ 1) = submit. Kedengarannya adil. Suatu wave menghasilkan 154 kandidat lolos gerbang — dan tim mencoba men-submit semuanya. Hasilnya: antrean submit macet, kandidat bagus tertunda berminggu-minggu di belakang kandidat “hampir bagus”, dan separuhnya kedaluwarsa sebelum sempat diuji ulang.",
        "Pelajaran mahalnya: lolos gerbang menjawab “boleh ikut?”, bukan “didahulukan?”. Tim membangun lapis kedua: dari 154 yang lolos, hanya 56 yang kuat (S ≥ 1,4 & F ≥ 1,1) masuk ANTRIAN_SUBMIT; 98 sisanya TAHAN — menunggu penguatan (sweep decay, perbaikan turnover) atau giliran wave depan. Dari 394 kandidat awal, komposisinya menjadi: BUANG 240, TAHAN 98, ANTRIAN_SUBMIT 56.",
        "Twist-nya: 56 itu bukan “yang terbaik dari 394” — ia “yang siap dari 394”. Di antara 98 TAHAN ada calon juara yang hanya butuh decay berbeda (WQB16) atau turnover lebih rendah. Triage berlapis tidak membuang mereka; ia memberi mereka kamar tunggu dengan rencana perbaikan, bukan kamar mayat. Wave nyata berikutnya membuktikan: 11 dari 56 submit berasal dari mantan TAHAN yang diperbaiki.",
        "Setelah lesson ini kamu bisa: (1) menerapkan dua lapis kriteria — gerbang dasar vs prioritas antrean; (2) memberi label BUANG/TAHAN/ANTRIAN_SUBMIT/PENALTI dengan benar; (3) menyusun urutan antrean submit dengan penalti turnover; (4) menjelaskan kenapa “lolos gerbang = langsung submit” menenggelamkan tim.",
      ],
      tasks: [],
      note: {
        title: "Prasyarat ringkas",
        body: "Gerbang kualitas: S ≥ 1,25 dan F ≥ 1. Penalti turnover: TO > 0,4. Triage = memilah cepat sebelum sumber daya mahal (simulasi ulang, review manusia, slot submit) dikeluarkan.",
      },
      reference: "Gerbang menjawab “boleh ikut?”; antrean menjawab “didahulukan?”.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat label, dua lapis",
      prose: [
        "Lapis 1 — gerbang dasar (lolos/tidak): BUANG bila S < 1,25 ATAU F < 1. Satu syarat gagal = gagal. Tidak ada banding wave ini; kandidat boleh kembali wave depan sebagai ekspresi yang diperbaiki. Dari 394 kandidat nyata, 240 gugur di sini (61%).",
        "Lapis 2 — prioritas antrean (untuk yang lolos gerbang): TAHAN bila S < 1,4 ATAU F < 1,1 — lolos, tetapi marginal. ANTRIAN_SUBMIT bila S ≥ 1,4 DAN F ≥ 1,1 — kuat dan siap. Perhatikan logikanya: TAHAN ∪ ANTRIAN_SUBMIT = semua yang lolos gerbang; keduanya adalah pembagian prioritas, bukan vonis mati.",
        "Label keempat ortogonal terhadap ketiganya: PENALTI bila TO > 0,4. Kandidat ANTRIAN_SUBMIT ber-TO 0,55 tidak turun menjadi TAHAN — ia tetap ANTRIAN_SUBMIT + PENALTI: antre paling belakang, atau wajib diperbaiki dulu (sweep decay ala WQB16 sering memangkas TO). Dari 56 submit nyata, 12 berpenalti.",
        "Cara membaca figur funnel: corong menyempit 394 → 154 (lolos gerbang) → 56 (siap submit); 98 TAHAN adalah sabuk pengaman di tengah — bukan sampah. Interpretasi figur batang: BUANG mendominasi (240) — wajar, sebagian besar ide memang mati; TAHAN (98) adalah modal perbaikan; SUBMIT (56) kecil karena submit adalah operasi mahal.",
      ],
      formula: String.raw`\text{Lolos gerbang} \iff (S \geq 1{,}25) \land (F \geq 1), \qquad \text{Penalti} \iff TO > 0{,}4`,
      formulaNote: "Lapis 2 (di dalam yang lolos): ANTRIAN_SUBMIT ⟺ (S ≥ 1,4) ∧ (F ≥ 1,1); selain itu TAHAN. Contoh: S=1,31, F=1,05 → lolos gerbang tetapi TAHAN (S < 1,4). S=1,45, F=1,20, TO=0,55 → ANTRIAN_SUBMIT + PENALTI.",
      figure: {
        svg: FIG_FUNNEL,
        alt: "Funnel: 394 kandidat, 240 BUANG, 98 TAHAN, 56 ANTRIAN_SUBMIT.",
        caption: "Dua lapis: gerbang dasar menyaring, prioritas antrean mengurutkan.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Lolos gerbang = langsung submit.” Itulah wave yang menenggelamkan tim: 154 submit sekaligus = antrean macet = kandidat bagus kedaluwarsa. Gerbang itu SIM — antrean itu ruang UGD. Punya SIM tidak berarti didahulukan di UGD.",
      },
      hints: [
        "Cek BUANG dulu: S<1,25 atau F<1 → selesai.",
        "Yang lolos: kuat (S≥1,4 & F≥1,1) → SUBMIT; sisanya TAHAN.",
        "PENALTI menempel bila TO>0,4 — tidak mengubah label dasar.",
      ],
      reference: "BUANG/TAHAN/SUBMIT = prioritas; PENALTI = catatan kaki yang mahal.",
    },
    {
      id: "contoh",
      eyebrow: "Langkah 3 · Konsep",
      title: "Delapan kandidat, delapan nasib",
      prose: [
        "Uji matriks label pada delapan kandidat: k1 (1,52/1,30/0,28) → ANTRIAN_SUBMIT, bersih. k2 (1,31/1,05/0,31) → TAHAN — lolos gerbang, tetapi S < 1,4. k3 (1,18/1,20/0,25) → BUANG — Sharpe gagal, fitness bagus tidak menolong. k4 (1,45/0,95/0,30) → BUANG — fitness gagal, Sharpe bagus tidak menolong. Gerbang itu AND, bukan OR.",
        "k5 (1,60/1,40/0,55) → ANTRIAN_SUBMIT + PENALTI — angka terbaik di kelompok ini, tetapi TO 0,55 membuatnya antre paling belakang sampai diperbaiki. k6 (1,28/1,02/0,62) → TAHAN + PENALTI — dua masalah sekaligus: marginal DAN mahal. k7 (1,41/1,12/0,35) → ANTRIAN_SUBMIT, bersih. k8 (1,26/1,15/0,29) → TAHAN — lolos tipis, S < 1,4.",
        "Perhatikan k5 vs k1: k5 Sharpe-nya lebih tinggi (1,60 vs 1,52) tetapi k1 didahulukan karena bebas penalti. Inilah prioritas antrean bekerja — bukan “yang angkanya terbesar”, melainkan “yang siapnya paling bersih”. Dan perhatikan k2 vs k8: keduanya TAHAN, tetapi k2 (1,31/1,05) adalah kandidat sweep-decay ideal, sedangkan k8 (1,26/1,15) nyaris SUBMIT — TAHAN bukan satu nasib, ia spektrum yang butuh dibaca satu per satu.",
      ],
      tasks: [],
      figure: {
        svg: FIG_LABELS,
        alt: "Batang per label: BUANG 240, TAHAN 98, ANTRIAN_SUBMIT 56 (12 berpenalti).",
        caption: "Komposisi nyata 394 kandidat: yang siap submit hanya 56.",
      },
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“BUANG = dibuang permanen.” BUANG berarti “tidak ikut wave ini”. Ekspresinya boleh kembali setelah diperbaiki — dan 11 dari 56 submit nyata adalah mantan TAHAN/BUANG yang diperbaiki. Label triage punya tanggal kedaluwarsa: satu wave.",
      },
      hints: [
        "AND, bukan OR: satu syarat gagal = BUANG.",
        "Sharpe tertinggi belum tentu didahulukan — baca penaltinya.",
      ],
      reference: "Baca label + penalti + posisi dalam spektrum TAHAN.",
    },
    {
      id: "praktik",
      eyebrow: "Langkah 4 · Praktik",
      title: "Kebiasaan triage yang sehat",
      prose: [
        "Kebiasaan pertama: triage dalam urutan yang sama setiap wave — BUANG dulu (cepat, 61% gugur), lalu bagi sisanya ke TAHAN/SUBMIT, terakhir tempel PENALTI. Urutan tetap = tidak ada kandidat yang “lolos karena dibaca saat reviewer lelah”. Kebiasaan kedua: TAHAN selalu disertai rencana perbaikan satu baris (“sweep decay 2/6/8” atau “tambah filter turnover”) dan batas waktu dua wave — TAHAN tanpa rencana = BUANG yang ditunda.",
        "Kebiasaan ketiga: antrean submit diurutkan deterministik — tanpa penalti dulu (urut fitness menurun), lalu berpenalti (wajib perbaikan atau antre belakang). Tidak ada “feeling reviewer” dalam urutan; feeling hanya untuk kasus yang aturannya belum cover, dan itu dicatat sebagai preseden.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Triage yang baik seperti sortir bandara: BUANG = bagasi ditolak (jelas aturannya), TAHAN = pemeriksaan lanjutan (ada prosedurnya), SUBMIT = boarding prioritas (urut kursinya). Kekacauan terjadi saat petugas memutuskan berdasarkan firasat, bukan papan aturan.",
      },
      reference: "Urutan tetap, TAHAN berencana, antrean deterministik.",
    },
    {
      id: "lab-triage",
      eyebrow: "Langkah 5 · Lab",
      title: "Tulis fungsi triage delapan kandidat",
      prose: [
        "Implementasikan `triage(s, f, to)` persis mengikuti dua lapis: BUANG bila S < 1,25 atau F < 1; ANTRIAN_SUBMIT bila S ≥ 1,4 dan F ≥ 1,1; selain itu TAHAN; tempel \" + PENALTI\" bila TO > 0,4. Delapan kandidat di bawah mencakup semua kombinasi — termasuk k5, jebakan klasik “angka terbaik tetapi berpenalti”.",
        "Setelah jalan, uji batasnya: ubah k2 menjadi (1,40/1,10/0,31) — tepat di ambang — dan pastikan ia ANTRIAN_SUBMIT. Batas inklusif (≥) vs eksklusif (<) adalah tempat bug triage bersembunyi.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `triage(s, f, to)` dua lapis + penalti" },
        { id: "t2", text: "Jalankan: pastikan delapan baris label tercetak" },
      ],
      expected: "k1: ANTRIAN_SUBMIT\nk2: TAHAN\nk3: BUANG\nk4: BUANG\nk5: ANTRIAN_SUBMIT + PENALTI\nk6: TAHAN + PENALTI\nk7: ANTRIAN_SUBMIT\nk8: TAHAN",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“TAHAN bila S<1,4 DAN F<1,1.” Salah — TAHAN bila S<1,4 ATAU F<1,1 (di antara yang lolos gerbang). Dengan DAN, kandidat (1,50/1,05) akan salah masuk SUBMIT. De Morgan tidak mengenal belas kasihan.",
      },
      hints: [
        "Cek BUANG dulu: if s < 1.25 or f < 1.",
        "Lalu: ANTRIAN_SUBMIT bila s>=1.4 and f>=1.1, else TAHAN.",
        "Terakhir: if to > 0.4: label += \" + PENALTI\".",
      ],
      code: {
        starter: "# (nama, S, F, TO) — JANGAN UBAH\ndata = [(\"k1\",1.52,1.30,0.28),(\"k2\",1.31,1.05,0.31),\n        (\"k3\",1.18,1.20,0.25),(\"k4\",1.45,0.95,0.30),\n        (\"k5\",1.60,1.40,0.55),(\"k6\",1.28,1.02,0.62),\n        (\"k7\",1.41,1.12,0.35),(\"k8\",1.26,1.15,0.29)]\n\n# TULIS KODEMU\ndef triage(s, f, to):\n    return \"?\"\n\nfor nama, s, f, to in data:\n    print(f\"{nama}: {triage(s, f, to)}\")\n",
        lockLines: 7,
        solution: "# (nama, S, F, TO) — JANGAN UBAH\ndata = [(\"k1\",1.52,1.30,0.28),(\"k2\",1.31,1.05,0.31),\n        (\"k3\",1.18,1.20,0.25),(\"k4\",1.45,0.95,0.30),\n        (\"k5\",1.60,1.40,0.55),(\"k6\",1.28,1.02,0.62),\n        (\"k7\",1.41,1.12,0.35),(\"k8\",1.26,1.15,0.29)]\n\n# TULIS KODEMU\ndef triage(s, f, to):\n    if s < 1.25 or f < 1:\n        label = \"BUANG\"\n    elif s >= 1.4 and f >= 1.1:\n        label = \"ANTRIAN_SUBMIT\"\n    else:\n        label = \"TAHAN\"\n    if to > 0.4:\n        label += \" + PENALTI\"\n    return label\n\nfor nama, s, f, to in data:\n    print(f\"{nama}: {triage(s, f, to)}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "k2 = TAHAN", msg: "1,31/1,05 lolos gerbang tetapi S < 1,4.", pattern: "k2: TAHAN" },
          { kind: "stdout_matches", task: "t2", label: "k5 = SUBMIT + PENALTI", msg: "Angka terbaik tetapi TO 0,55.", pattern: "k5: ANTRIAN_SUBMIT \\+ PENALTI" },
          { kind: "stdout_matches", task: "t2", label: "k3, k4 = BUANG", msg: "k3 gagal S, k4 gagal F — AND, bukan OR.", pattern: "k3: BUANG\\nk4: BUANG" }
        ],
      },
      reference: "Fungsi ini = SOP triage yang bisa dieksekusi.",
    },
    {
      id: "lab-antre",
      eyebrow: "Langkah 6 · Lab",
      title: "Susun urutan antrean submit",
      prose: [
        "Antrean yang deterministik: tanpa penalti didahulukan (urut fitness menurun), lalu yang berpenalti (juga fitness menurun — mereka antre belakang sambil diperbaiki). Empat kandidat ANTRIAN_SUBMIT: a1 (F 1,30, bersih), a2 (F 1,40, penalti), a3 (F 1,15, bersih), a4 (F 1,22, penalti).",
        "Hasil: a1, a3, a2, a4. Perhatikan a2 — fitness tertinggi (1,40) tetapi antre ketiga karena penalti. Inilah “yang siap paling bersih didahulukan” dalam bentuk kode.",
      ],
      tasks: [
        { id: "t1", text: "Urutkan: penalti belakangan, fitness menurun" },
        { id: "t2", text: "Jalankan: pastikan urutannya tercetak" },
      ],
      expected: "urutan submit: a1, a3, a2, a4",
      hints: [
        "Kunci sort: (to > 0.4, -f) — False < True sehingga bersih dulu.",
        "sorted(data, key=lambda r: (r[3] > 0.4, -r[2])).",
      ],
      code: {
        starter: "# (nama, S, F, TO) — semua ANTRIAN_SUBMIT, JANGAN UBAH\ndata = [(\"a1\",1.52,1.30,0.28),(\"a2\",1.60,1.40,0.55),\n        (\"a3\",1.44,1.15,0.31),(\"a4\",1.48,1.22,0.47)]\n\n# TULIS KODEMU: urutkan\nurutan =\nprint(\"urutan submit: \" + \", \".join(nama for nama, s, f, to in urutan))\n",
        lockLines: 6,
        solution: "# (nama, S, F, TO) — semua ANTRIAN_SUBMIT, JANGAN UBAH\ndata = [(\"a1\",1.52,1.30,0.28),(\"a2\",1.60,1.40,0.55),\n        (\"a3\",1.44,1.15,0.31),(\"a4\",1.48,1.22,0.47)]\n\n# TULIS KODEMU: urutkan\nurutan = sorted(data, key=lambda r: (r[3] > 0.4, -r[2]))\nprint(\"urutan submit: \" + \", \".join(nama for nama, s, f, to in urutan))\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Urutan a1, a3, a2, a4", msg: "Bersih dulu (F menurun), lalu berpenalti (F menurun).", pattern: "urutan submit: a1, a3, a2, a4" }
        ],
      },
      reference: "Antrean deterministik = tidak ada feeling dalam urutan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Dari angka ke label ke tindakan",
      prose: [
        "Satu: S < 1,25 atau F < 1 → BUANG; alihkan energimu ke kandidat lain wave ini. Dua: lolos gerbang tetapi S < 1,4 atau F < 1,1 → TAHAN + tulis rencana perbaikan satu baris + tenggat dua wave. Tiga: S ≥ 1,4 dan F ≥ 1,1 → ANTRIAN_SUBMIT; masuk urutan deterministik. Empat: TO > 0,4 pada label apapun → PENALTI: perbaiki dulu (sweep decay, filter turnover) atau antre paling belakang. Lima: TAHAN yang dua wave tidak membaik → BUANG; kamar tunggu bukan kamar abadi.",
        "Aturan praktis 10 detik: gerbang dulu, kekuatan kemudian, penalti selalu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "TAHAN adalah kata kerja, bukan kata sifat: ia berarti “sedang diperbaiki”, bukan “lumayan”. Setiap TAHAN tanpa rencana perbaikan adalah BUANG yang menyamar — dan ia memakan slot perhatian yang seharusnya untuk kandidat jujur.",
      },
      reference: "Label → tindakan. Tanpa tindakan, label = dekorasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Tiga kandidat, satu slot submit hari ini",
      prose: [
        "Data: X (S=1,55, F=1,35, TO=0,30) → ANTRIAN_SUBMIT bersih. Y (S=1,62, F=1,45, TO=0,58) → ANTRIAN_SUBMIT + PENALTI. Z (S=1,38, F=1,08, TO=0,27) → TAHAN. Slot submit hari ini: satu.",
        "Pertanyaan: siapa yang berangkat? Pembahasan: insting berkata Y — angkanya terbaik (Sharpe 1,62, fitness 1,45). Triage berkata X. Alasannya: Y ber-TO 0,58 = penalti; men-submit-nya hari ini berarti membakar slot mahal pada alpha yang berdarah di biaya transaksi — dan penguatan Y (sweep decay untuk memangkas TO) butuh waktu yang tidak dimiliki slot hari ini. X bersih dan siap: berangkat sekarang. Z menunggu giliran perbaikan. Keputusan: X hari ini; Y masuk program perbaikan turnover (target TO ≤ 0,4 dalam dua wave); Z kandidat sweep-decay. Pelajaran: slot submit adalah sumber daya langka — ia diberikan kepada yang SIAP, bukan yang angkanya terbesar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke riset",
        type: "risk",
        body: "Memilih Y “karena Sharpe tertinggi” adalah keputusan satu dimensi yang mengabaikan biaya transaksi — alpha yang lolos metrik tetapi berdarah di TO gagal di dunia nyata. Triage berlapis memaksa tiga angka dibaca bersamaan.",
      },
      reference: "Slot langka → yang siap paling bersih, bukan yang angkanya terbesar.",
    },
    {
      id: "budget-sim",
      eyebrow: "Langkah 9 · Konsep",
      title: "Menganggarkan simulasi: wave dirancang di atas jatah yang terbatas",
      prose: [
        "Sejauh ini wave dirancang seolah simulasi tidak terbatas: target 164 sim di WQB17, 600 kandidat di triage lesson ini. Kenyataannya simulasi adalah sumber daya yang dijatah platform — dan wave yang tidak menganggarkan jatahnya akan kehabisan di tengah jalan, tepat saat kandidat terbaik belum dicoba.",
        "Kerangka penganggaran, tiga langkah. Pertama, ketahui jatahmu: berapa sim tersedia per hari atau per minggu di akunmu — angka ini ditentukan platform dan bisa berubah; track ini tidak menulis angkanya sebagai konstanta karena ia tidak terverifikasi dari sumber resmi. Periksa di dashboard platformmu dan catat sebagai angka kerja minggu ini, bukan sebagai hukum abadi.",
        "Kedua, alokasikan per kolam SEBELUM wave jalan, mengikuti arsitektur WQB17. Contoh ilustratif (bukan angka resmi): jatah 100 sim per minggu dialokasikan 40 ke Kolam Puncak (eksploitasi juara), 40 ke Kolam Lebar (eksplorasi ortogonal), 20 ke Kolam Penyelamatan (perbaikan turnover). Alokasi ditulis sebelum satu sim pun jalan — bila tidak, kolam yang paling berisik (biasanya Puncak) memakan seluruh jatah.",
        "Ketiga, hitung harga satu sim yang gagal. Wave WQB17: target 164 sim, 102 lolos ambang — 62 sim (37,8 persen) 'dibayar' tanpa hasil. Itu bukan pemborosan — itu harga eksplorasi yang wajar. Yang boros adalah sim yang dihabiskan untuk kandidat yang sebenarnya sudah bisa dibuang di atas kertas: loloskan dulu lewat predictor dan triage kertas (WQB18–19) sebelum sim dibakar. Aturan praktis: satu jam triage kertas menghemat satu hari jatah sim.",
        "Bila jatah habis: JANGAN turunkan ambang predictor untuk 'menghabiskan' wave (WQB17 sudah membuktikan kandidat ambang-turun mati 3 kali lebih cepat di bank). Yang dilakukan: (1) antrean TAHAN menunggu wave depan dengan rencana perbaikan; (2) riset kertas — baca literatur, tulis ekspresi, uji logikanya tanpa sim; (3) perbaiki kandidat yang sudah ada (diet turnover, ganti decay) agar saat jatah kembali, yang dicoba adalah versi terbaiknya, bukan versi pertamanya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Jatah tinggal sedikit — pakai semuanya untuk varian juara, pasti ada yang lolos.” Varian juara adalah yang paling berkorelasi dengan bank — sim yang dihabiskan di sana membeli duplikat, bukan diversifikasi. Saat jatah menipis, yang diprioritaskan justru Kolam Lebar: satu tiket ortogonal yang hidup lebih berharga dari sepuluh varian juara.",
      },
      reference: "Anggarkan dulu (Puncak/Lebar/Penyelamatan), bakar sim sesudahnya. Jatah habis = riset kertas, bukan turun ambang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang dua lapis triage.",
      ],
      tasks: [],
      summary: [
        "Lapis 1 (gerbang): BUANG ⟺ S < 1,25 atau F < 1.",
        "Lapis 2 (prioritas): ANTRIAN_SUBMIT ⟺ S ≥ 1,4 & F ≥ 1,1; sisanya TAHAN.",
        "PENALTI ⟺ TO > 0,4 — ortogonal, menempel pada label apapun.",
        "TAHAN = sedang diperbaiki (rencana + tenggat dua wave), bukan vonis.",
        "Antrean deterministik: bersih dulu (F menurun), lalu berpenalti.",
        "Budget sim: alokasikan per kolam sebelum wave jalan; 62 dari 164 sim wave WQB17 (37,8 persen) adalah harga eksplorasi — jatah habis = riset kertas, bukan turun ambang.",
      ],
      next: { label: "WQB20 — Strategi Cadangan Era Research Consultant", href: "/learn/wqb20-strategi-cadangan" },
      quiz: [
        {
          q: "Kandidat S=1,30, F=1,05, TO=0,31. Labelnya?",
          options: [
            { text: "TAHAN — lolos gerbang tetapi S < 1,4", why: "Benar. Lolos (1,30 ≥ 1,25 & 1,05 ≥ 1) tetapi marginal.", correct: true },
            { text: "ANTRIAN_SUBMIT — karena lolos gerbang", why: "Jebakan lapis-1: lolos gerbang belum berarti siap submit." },
            { text: "BUANG — karena S < 1,4", why: "Ambang BUANG = 1,25, bukan 1,4. 1,30 lolos gerbang." }
          ],
        },
        {
          q: "Kandidat S=1,50, F=1,20, TO=0,50. Labelnya?",
          options: [
            { text: "ANTRIAN_SUBMIT + PENALTI", why: "Benar: kuat (≥1,4 & ≥1,1) tetapi TO > 0,4.", correct: true },
            { text: "TAHAN — karena TO > 0,4", why: "Penalti tidak menurunkan label dasar; ia menempel sebagai catatan." },
            { text: "BUANG — turnover terlalu tinggi", why: "TO bukan syarat gerbang; ia penalti, bukan vonis." }
          ],
        },
        {
          q: "Apa beda gerbang dasar dengan prioritas antrean?",
          options: [
            { text: "Gerbang = boleh ikut atau tidak; antrean = siapa didahulukan", why: "Tepat — dua pertanyaan berbeda, dua lapis berbeda.", correct: true },
            { text: "Tidak ada beda, hanya istilah", why: "Ada: 154 lolos gerbang tetapi hanya 56 masuk antrean submit." },
            { text: "Gerbang untuk wave ini, antrean untuk wave depan", why: "Keduanya untuk wave ini — antrean mengatur urutan submit." }
          ],
        },
        {
          q: "“Lolos gerbang = langsung submit” salah karena…",
          options: [
            { text: "Antrean macet; kandidat bagus kedaluwarsa di belakang yang marginal", why: "Benar — itulah wave yang menenggelamkan tim.", correct: true },
            { text: "Gerbangnya terlalu mudah", why: "Bukan soal mudah/sulit — soal urutan prioritas." },
            { text: "Submit itu gratis", why: "Terbalik — submit mahal (slot, review, perhatian), makanya diantrekan." }
          ],
        },
        {
          q: "TAHAN yang dua wave tidak membaik sebaiknya…",
          options: [
            { text: "Dinaikkan jadi BUANG — kamar tunggu bukan kamar abadi", why: "Benar. Tenggat dua wave menjaga TAHAN tetap kata kerja.", correct: true },
            { text: "Dibiarkan — siapa tahu wave depan membaik sendiri", why: "Tanpa rencana perbaikan, ia BUANG yang menyamar." },
            { text: "Langsung dimasukkan antrean submit", why: "Itu mengkhianati seluruh sistem prioritas." }
          ],
        }
      ],
      reference: "Triage = gerbang × prioritas × penalti. Tiga dimensi, satu keputusan.",
    },
  ],
};
