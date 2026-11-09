import type { V2Lesson } from "../lib/types";

export const hd4: V2Lesson = {
  slug: "hd4-desain-studi",
  track: "Health Data Science",
  module: "Epidemiologi & Uji Klinis",
  title: "HD4 Kohort vs Case-Control: Desain Studi dan Jebakan Bias",
  estMinutes: 50,
  steps: [
    {
      id: "kopi-rokok",
      eyebrow: "Langkah 1 · Confounding",
      title: "Kopi, rokok, dan kanker: penari latar",
      prose: [
        "Tahun 1980-an, studi observasional menemukan peminum kopi berisiko lebih tinggi terkena kanker pankreas. Media heboh. Lalu seseorang mengecek: peminum kopi berat ternyata juga lebih banyak merokok — dan rokoklah penyebab sebenarnya. Setelah memperhitungkan rokok, asosiasi kopi-kanker lenyap total.",
        "Inilah confounding: variabel ketiga yang menari di belakang layar, membuat dua hal yang tidak berhubungan terlihat berhubungan. Twist-nya: kopi tidak bersalah — tapi studi yang menuduhnya juga tidak salah hitung. Angkanya benar, statistiknya valid, kesimpulannya fatal. Confounding bukan kesalahan aritmetika; ia adalah kesalahan bertanya.",
        "Empat desain, empat cara bertanya. Kohort: dari paparan maju ke outcome (hitung RR) — mahal, lama, tapi alur waktu jelas. Case-control: dari outcome mundur ke paparan (hitung OR) — cepat, murah, tapi ingatan bisa bias. Cross-sectional: potret satu titik waktu (prevalensi) — tidak tahu mana dulu, ayam atau telur. RCT: paparan diacak peneliti — standar emas kausalitas, tapi tidak etis untuk rokok vs kanker. Penyakit jarang → case-control; paparan jarang → kohort; butuh cepat → cross-sectional; butuh bukti kausal dan etis → RCT.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira cross-sectional bisa menentukan sebab-akibat kalau sampelnya besar. Masalahnya bukan ukuran sampel, melainkan waktu: paparan dan outcome diukur bersamaan, jadi tidak tahu mana yang dulu. Sampel 1 juta tidak memperbaiki ini.",
        type: "pitfall",
      },
      reference: "Pertanyaan dulu, desain kemudian, data terakhir.",
    },
    {
      id: "lab-confounding",
      eyebrow: "Langkah 2 · Lab simulasi",
      title: "Kopi yang tidak bersalah (simulasi)",
      prose: [
        "Buktikan sendiri: bangkitkan populasi di mana kopi TIDAK berpengaruh sama sekali terhadap penyakit, tapi perokok lebih suka kopi dan rokok menyebabkan penyakit. Lalu hitung asosiasi mentah vs asosiasi per strata rokok.",
        "Kode memakai seed tetap (random.seed(7)) agar hasilnya reproduksibel. Perhatikan: RR mentah akan terlihat “berbahaya” (>1), sementara RR di dalam tiap strata rokok kembali mendekati 1,0 — efek kopi yang sebenarnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rr_mentah` kopi vs penyakit (tanpa stratifikasi)" },
        { id: "t2", text: "Hitung `rr_bukan_perokok` dan `rr_perokok` per strata rokok" },
      ],
      expected: "rr_mentah=2.01  rr_bukan_perokok=1.03  rr_perokok=1.09",
      note: {
        title: "Sering salah",
        body: "Mengira stratifikasi “menghilangkan data” sehingga hasilnya tidak valid. Justru sebaliknya: stratifikasi memisahkan efek paparan dari efek confounder — OR/RR kasar adalah rumor, yang terkoreksi adalah hasil investigasi.",
        type: "pitfall",
      },
      hints: [
        "RR = (kasus/populasi kelompok kopi) / (kasus/populasi kelompok bukan-kopi).",
        "Untuk tiap strata, ambil a, na dari strata[(True, rokok)] dan c, nc dari strata[(False, rokok)].",
        "rr_mentah = (mentah['kopi_sakit']/mentah['kopi']) / (mentah['nokopi_sakit']/mentah['nokopi'])",
      ],
      code: {
        starter: `import random\nrandom.seed(7)\nn = 5000\nrisk_dasar, risk_rokok = 0.05, 0.25  # rokok menaikkan risiko; kopi: NOL efek\nmentah = {'kopi_sakit': 0, 'kopi': 0, 'nokopi_sakit': 0, 'nokopi': 0}\nstrata = {}  # (kopi, rokok) -> [sakit, total]\nfor _ in range(n):\n    rokok = random.random() < 0.3\n    kopi = random.random() < (0.7 if rokok else 0.3)  # perokok lbh suka kopi\n    r = risk_dasar + (risk_rokok if rokok else 0.0)    # kopi: NOL efek\n    sakit = random.random() < r\n    k = 'kopi' if kopi else 'nokopi'\n    mentah[k+'_sakit'] += sakit; mentah[k] += 1\n    s = (kopi, rokok)\n    strata.setdefault(s, [0, 0])\n    strata[s][0] += sakit; strata[s][1] += 1\n\n# TULIS KODEMU: RR mentah dan RR per strata rokok\nrr_mentah = \nrr_bukan_perokok = \nrr_perokok = \n\nprint(f"rr_mentah={rr_mentah:.2f}  rr_bukan_perokok={rr_bukan_perokok:.2f}  rr_perokok={rr_perokok:.2f}")`,
        lockLines: 16,
        solution: `import random\nrandom.seed(7)\nn = 5000\nrisk_dasar, risk_rokok = 0.05, 0.25  # rokok menaikkan risiko; kopi: NOL efek\nmentah = {'kopi_sakit': 0, 'kopi': 0, 'nokopi_sakit': 0, 'nokopi': 0}\nstrata = {}  # (kopi, rokok) -> [sakit, total]\nfor _ in range(n):\n    rokok = random.random() < 0.3\n    kopi = random.random() < (0.7 if rokok else 0.3)  # perokok lbh suka kopi\n    r = risk_dasar + (risk_rokok if rokok else 0.0)    # kopi: NOL efek\n    sakit = random.random() < r\n    k = 'kopi' if kopi else 'nokopi'\n    mentah[k+'_sakit'] += sakit; mentah[k] += 1\n    s = (kopi, rokok)\n    strata.setdefault(s, [0, 0])\n    strata[s][0] += sakit; strata[s][1] += 1\n\n# TULIS KODEMU: RR mentah dan RR per strata rokok\nrr_mentah = (mentah['kopi_sakit']/mentah['kopi']) / (mentah['nokopi_sakit']/mentah['nokopi'])\na, na = strata[(True, False)]; c, nc = strata[(False, False)]\nrr_bukan_perokok = (a/na)/(c/nc)\na, na = strata[(True, True)]; c, nc = strata[(False, True)]\nrr_perokok = (a/na)/(c/nc)\n\nprint(f"rr_mentah={rr_mentah:.2f}  rr_bukan_perokok={rr_bukan_perokok:.2f}  rr_perokok={rr_perokok:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rr_mentah", value: 2.0134, tol: 0.01, label: "`rr_mentah` sekitar 2.01", msg: "Tanpa stratifikasi kopi terlihat berbahaya (RR ≈ 2). Itu ilusi confounding." },
          { kind: "equal", task: "t2", name: "rr_bukan_perokok", value: 1.0347, tol: 0.03, label: "`rr_bukan_perokok` sekitar 1.03", msg: "Di strata bukan-perokok, ambil a, na dari strata[(True, False)]." },
          { kind: "equal", task: "t2", name: "rr_perokok", value: 1.0912, tol: 0.03, label: "`rr_perokok` sekitar 1.09", msg: "Di strata perokok, ambil a, na dari strata[(True, True)]." },
          { kind: "stdout_matches", task: "t2", pattern: "rr_mentah=2\\.01\\s+rr_bukan_perokok=1\\.0[34]\\s+rr_perokok=1\\.09", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "RR mentah ≈ 2 (palsu); RR per strata ≈ 1 (benar). Stratifikasi membunuh asosiasi palsu.",
    },
    {
      id: "lab-stratifikasi",
      eyebrow: "Langkah 3 · Lab OR",
      title: "OR mentah vs OR per strata",
      prose: [
        "Diberikan dua tabel 2×2 (perokok vs bukan). Hitung OR per strata dan OR mentah (gabungan). Perhatikan bagaimana penggabungan tanpa stratifikasi menipu — versi epidemiologi dari paradoks Simpson.",
        "Contoh angkanya: strata perokok (a=36, b=144, c=8, d=152) dan bukan perokok (a=4, b=196, c=2, d=198). OR = (a×d)/(b×c).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `or_perokok` dan `or_bukan` per strata" },
        { id: "t2", text: "Hitung `or_mentah` dari tabel gabungan" },
      ],
      expected: "or_perokok=4.75  or_bukan=2.02  or_mentah=4.12",
      note: {
        title: "Sering salah",
        body: "Mengira OR mentah adalah “rata-rata” OR strata. Bukan — OR mentah bisa jauh dari keduanya karena pembobotan ukuran strata yang tidak setara. Selalu laporkan per strata bila ada confounding.",
        type: "pitfall",
      },
      hints: [
        "OR = (a×d)/(b×c) untuk tiap tabel.",
        "Tabel gabungan = jumlahkan tiap sel dari kedua strata.",
        "or_mentah memakai A, B, C, D yang sudah dijumlahkan di starter.",
      ],
      code: {
        starter: `# (a=sakit terpapar, b=sehat terpapar, c=sakit tak terpapar, d=sehat tak terpapar)\nstrata = {'perokok': (36, 144, 8, 152), 'bukan': (4, 196, 2, 198)}\n\ndef OR(a, b, c, d):\n    return (a*d)/(b*c)\n\n# TULIS KODEMU: OR per strata dan OR mentah\nor_perokok = \nor_bukan = \nor_mentah = \n\nprint(f"or_perokok={or_perokok:.2f}  or_bukan={or_bukan:.2f}  or_mentah={or_mentah:.2f}")`,
        lockLines: 6,
        solution: `# (a=sakit terpapar, b=sehat terpapar, c=sakit tak terpapar, d=sehat tak terpapar)\nstrata = {'perokok': (36, 144, 8, 152), 'bukan': (4, 196, 2, 198)}\n\ndef OR(a, b, c, d):\n    return (a*d)/(b*c)\n\n# TULIS KODEMU: OR per strata dan OR mentah\nor_perokok = OR(*strata['perokok'])\nor_bukan = OR(*strata['bukan'])\nA = sum(v[0] for v in strata.values()); B = sum(v[1] for v in strata.values())\nC = sum(v[2] for v in strata.values()); D = sum(v[3] for v in strata.values())\nor_mentah = OR(A, B, C, D)\n\nprint(f"or_perokok={or_perokok:.2f}  or_bukan={or_bukan:.2f}  or_mentah={or_mentah:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "or_perokok", value: 4.75, tol: 1e-9, label: "`or_perokok` seharusnya 4.75", msg: "(36×152)/(144×8) = 4,75." },
          { kind: "equal", task: "t1", name: "or_bukan", value: 2.0204, tol: 0.01, label: "`or_bukan` sekitar 2.02", msg: "(4×198)/(196×2) ≈ 2,02." },
          { kind: "equal", task: "t2", name: "or_mentah", value: 4.1176, tol: 0.01, label: "`or_mentah` sekitar 4.12", msg: "Jumlahkan tiap sel kedua strata dulu, baru hitung OR gabungannya." },
        ],
      },
      reference: "OR perokok 4,75; bukan-perokok 2,02; mentah 4,12 — gabungan menipu.",
    },
    {
      id: "tiga-bias-hill",
      eyebrow: "Langkah 4 · Bias & Hill",
      title: "Tiga bias besar dan dewan juri Hill",
      prose: [
        "Tiga bias besar: bias seleksi (sampel tidak mewakili — mis. healthy worker effect), bias informasi (pengukuran salah — recall bias, misclassification), dan confounding (variabel ketiga terkait paparan dan outcome). Rumus konseptualnya: angka yang kamu hitung = efek sebenarnya + bias. Tugas analis adalah memperkecil suku kedua, bukan berpura-pura ia nol.",
        "Bradford Hill (1965) memberi sembilan kriteria untuk menilai apakah asosiasi observasional layak dianggap kausal: kekuatan, konsistensi, spesifisitas, temporalitas, gradien dosis-respons, plausibilitas, koherensi, eksperimen, analogi. Contoh rokok → kanker paru: RR 10–20 (kekuatan), ditemukan di banyak negara (konsistensi), merokok mendahului kanker puluhan tahun (temporalitas — satu-satunya kriteria yang wajib), makin banyak batang makin tinggi risiko (gradien), berhenti merokok menurunkan risiko (eksperimen).",
        "Bedakan confounder vs mediator: confounder (rokok) harus dikontrol; mediator (tekanan darah di jalur obat → stroke) JANGAN dikontrol kalau ingin efek total — mengontrol mediator membunuh efek yang ingin diukur. Saat membaca jurnal, lompat ke metode rekrutmen dan pengukuran dulu, baru hasil: bias lahir di desain, bukan di tabel hasil.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira “kalau sudah dikontrol banyak variabel, pasti bebas confounding”. Kontrol hanya bekerja untuk confounder yang diukur dengan benar. Confounding residual (variabel tak terukur atau salah ukur) selalu tersisa — klaim “sudah di-adjust” bukan sertifikat bebas bias.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Dalam studi obat → tekanan darah → stroke, tekanan darah adalah mediator. Jika ingin efek TOTAL obat, maka…",
          options: [
            { text: "Jangan mengontrol tekanan darah", why: "Benar: mengontrol mediator memblokir jalur kausal yang ingin diukur (over-adjustment).", correct: true },
            { text: "Wajib mengontrol tekanan darah", why: "Salah: itu membunuh efek yang ingin diukur — seperti menilai jalan tol tapi menutup gerbangnya." },
            { text: "Hapus data tekanan darah", why: "Tidak perlu dihapus — cukup jangan dimasukkan sebagai kovariat untuk efek total." },
            { text: "Ganti outcome", why: "Outcome-nya sudah benar (stroke); masalahnya adalah pilihan variabel kontrol." },
          ],
        },
      ],
      reference: "Kontrol confounder; jangan sentuh mediator (efek total) dan collider.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: desain apa untuk pertanyaan apa",
      prose: [
        "Lima situasi keputusan yang dihadapi peneliti dan analis kesehatan — dengan desain dan alat yang tepat untuk tiap pertanyaan:",
        "Skenario 1 — “Apakah paparan ini menyebabkan penyakit langka?” (outcome jarang, waktu laten panjang). → Case-control: mulai dari outcome, telusuri paparan ke belakang. Efisien untuk penyakit langka; tetapi hanya OR yang valid — jangan klaim RR atau risiko absolut.",
        "Skenario 2 — “Berapa besar risiko absolutnya? / butuh bukti kausal yang kuat?” → Kohort prospektif: ikuti kelompok terpapar dan tidak terpapar ke depan. Mahal dan lama — tetapi satu-satunya desain observasional yang menghitung RR dan insidens langsung. Contoh: klaim jamu OR 0,6 hanya bisa diuji serius dengan kohort prospektif.",
        "Skenario 3 — “Efek sudah terlihat, tapi mungkinkah ini confounding?” → Stratifikasi untuk yang terukur; E-value untuk yang tak terukur. Contoh: kopi–kanker runtuh setelah stratifikasi rokok; E-value 1,3 berarti confounder lemah pun bisa meruntuhkan temuanmu.",
        "Skenario 4 — “Klaim kausal dari studi cross-sectional / iklan produk?” → Tolak dulu, audit kemudian: cek temporalitas (Hill — mana yang duluan?), bias seleksi (sampel = populasi?), confounding tak terkontrol, bias informasi. Contoh: studi jamu gagal di keempatnya — larang klaimnya.",
        "Skenario 5 — “Variabel ini boleh dikontrol atau tidak?” → Gambar DAG, tanya arah panah: confounder (panah masuk ke paparan DAN outcome) = kontrol untuk memblokir backdoor; mediator (panah di jalur paparan→outcome) = JANGAN sentuh untuk efek total; collider (dua panah masuk, mis. “hanya pasien RS”) = JANGAN sentuh — mengontrolnya justru membuka bias Berkson.",
        "Aturan praktis 10 detik: pertanyaan → desain (jarang→case-control, butuh RR→kohort, klaim iklan→audit Hill) → gambar DAG sebelum menghitung → kontrol confounder, jangan sentuh mediator/collider → E-value untuk yang tak terukur.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengontrol mediator lalu menyimpulkan “tidak ada efek” — padahal efeknya dibunuh sendiri oleh kontrol yang salah. Dan kebalikannya: meneliti hanya pasien RS (collider) lalu mengumumkan dua penyakit “berhubungan” — Berkson's paradox klasik. Keduanya dicegah oleh satu kebiasaan: gambar DAG dulu.",
        type: "pitfall",
      },
      reference: "Pertanyaan → desain → data. DAG menentukan siapa boleh dikontrol; E-value menguji ketahanan.",
    },
    {
      id: "minicase-jamu",
      eyebrow: "Langkah 6 · Mini-case",
      title: "\u201CMinum jamu menurunkan risiko diabetes 40%\u201D",
      prose: [
        "Studi cross-sectional 10.000 orang: peminum jamu rutin punya prevalensi diabetes 40% lebih rendah (OR=0,6). Produsen jamu ingin memakai hasil ini di iklan. Kamu diminta Dinkes memberi second opinion. Detail metode: sampel dari pengunjung puskesmas (bukan populasi umum); status jamu dan diabetes diukur pada hari yang sama via kuesioner; tidak ada data aktivitas fisik, diet, atau pendapatan.",
        "Tiga masalah desain minimal. Pertama, cross-sectional: tidak tahu mana dulu — bisa jadi penderita diabetes BERHENTI minum jamu manis setelah diagnosis (reverse causality). Kedua, bias seleksi: pengunjung puskesmas bukan populasi umum. Ketiga, confounding tak terkontrol: peminum jamu rutin mungkin lebih aktif, diet lebih baik, atau lebih kaya — semua terkait diabetes. Keempat, bias informasi: kuesioner sekali ukur untuk kebiasaan bertahun-tahun.",
        "Kesimpulan untuk Dinkes: studi ini TIDAK mendukung klaim kausal; larang klaim iklan tersebut; sarankan kohort prospektif bila produsen serius. OR 0,6 yang menggiurkan runtuh setelah tiga pertanyaan desain.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Meneruskan klaim “jamu menurunkan risiko 40%” ke publik tanpa audit desain berarti Dinkes ikut menyebarkan klaim kesehatan yang tidak berdasar — dengan konsekuensi ke produk yang dikonsumsi jutaan orang. Second opinion analis adalah remnya.",
        type: "risk",
      },
      reference: "Urutan kerja yang benar: pertanyaan → desain → data. Bukan sebaliknya.",
    },
    {
      id: "dag-backdoor",
      eyebrow: "Langkah 7 · DAG",
      title: "Gambar dulu, hitung kemudian: DAG & backdoor",
      prose: [
        "Stratifikasi membunuh confounding yang TERUKUR — tetapi bagaimana memutuskan variabel mana yang boleh dikontrol? Jawabannya digambar, bukan ditebak: DAG (Directed Acyclic Graph). Tiap simpul = variabel, tiap panah = hubungan kausal yang diasumsikan (A → B berarti A memengaruhi B). Prinsipnya: kontrol variabel yang memblokir “jalur belakang” (backdoor path) antara paparan dan outcome — dan JANGAN sentuh yang lain.",
        "Tiga peran dalam satu gambar. Confounder: rokok → kopi dan rokok → kanker — panah masuk ke paparan DAN outcome; jalur belakang kopi ← rokok → kanker harus diblokir dengan mengontrol rokok. Mediator: obat → tekanan darah → stroke — panah di JALUR kausal paparan ke outcome; mengontrolnya membunuh efek yang ingin diukur. Collider: kecemasan → datang ke RS ← penyakit jantung — DUA panah masuk ke satu simpul; mengontrol collider (mis. hanya meneliti pasien RS) justru MEMBUKA jalur bias yang tadinya tertutup — inilah Berkson's paradox: di dalam RS, dua penyakit yang tak berhubungan terlihat berhubungan.",
        "Kriteria praktisnya bernama backdoor criterion: himpunan variabel yang (a) memblokir semua jalur belakang paparan–outcome dan (b) tidak mengandung mediator, collider, atau turunan keduanya, adalah himpunan kontrol yang valid. Dan untuk confounding yang TAK TERUKUR, ada E-value: seberapa kuat confounder tak terukur harus berhubungan dengan paparan DAN outcome untuk menjelaskan habis efek yang teramati. E-value 1,3 berarti confounder yang lemah pun bisa meruntuhkan temuanmu — E-value 4 berarti butuh confounder raksasa. Ia tidak membuktikan apa-apa, tetapi mengubah “bagaimana jika ada confounding tak terukur?” dari kekhawatiran kabur menjadi angka yang bisa didiskusikan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: gambar dulu, hitung kemudian",
        body: "Analis kausal yang senior selalu menggambar DAG di kertas sebelum membuka laptop — dan gambar itu menentukan seluruh analisisnya. Heuristik lapangannya tiga langkah. Pertama: untuk setiap variabel kandidat kontrol, tanyakan “panahnya ke mana?” — panah masuk ke paparan dan outcome (confounder) berarti kontrol; panah di jalur paparan→outcome (mediator) berarti jangan sentuh untuk efek total; dua panah masuk (collider) berarti jangan sentuh, titik. Kedua: curigai setiap seleksi sampel sebagai collider potensial — “hanya pasien RS”, “hanya yang punya BPJS”, “hanya yang mengisi survei” semuanya adalah kondisi pada simpul yang bisa membuka jalur bias Berkson. Ketiga: untuk hasil observasional yang kamu percaya, hitung E-value-nya dan tanyakan dengan jujur — “apakah confounder tak terukur sebesar ini masuk akal di bidangku?” Di epidemiologi gizi, E-value 1,5 runtuh oleh gaya hidup yang tak tercatat; di farmakoepidemiologi dengan data klaim kaya, E-value 3 butuh penjelasan serius. DAG membuat asumsimu terlihat — dan asumsi yang terlihat bisa diperdebatkan, diuji, dan diperbaiki. Asumsi yang tidak digambar hanya akan menghantuimu di sesi tanya jawab.",
      },
      reference: "Kontrol confounder (blokir backdoor); jangan sentuh mediator & collider. E-value = uji ketahanan terhadap yang tak terukur.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Kohort: paparan → outcome (RR). Case-control: outcome → paparan (OR). Cross-sectional: potret prevalensi. RCT: acak, standar emas.",
        "Tiga bias: seleksi (siapa masuk), informasi (bagaimana diukur), confounding (variabel ketiga).",
        "Kontrol confounder; jangan kontrol mediator untuk efek total.",
        "Bradford Hill: 9 kriteria menilai klaim kausal; temporalitas adalah kunci.",
        "RCT tak etis bukan berarti tak ada bukti — triangulasi observasional bisa memvonis.",
        "DAG: kontrol confounder (blokir backdoor), jangan sentuh mediator & collider; E-value = seberapa kuat confounder tak terukur harus ada untuk meruntuhkan temuan.",
      ],
      next: { label: "HD5 — RCT, ITT & Non-Inferiority", href: "/v2/learn/hd5-uji-klinis" },
      quiz: [
        {
          q: "Studi merekrut 200 pasien TB dan 200 kontrol sehat, lalu menelusuri riwayat merokok. Ini desain…",
          options: [
            { text: "Case-control", why: "Benar: berangkat dari outcome (kasus vs kontrol), mundur ke paparan = case-control. Ukuran valid: OR.", correct: true },
            { text: "Kohort", why: "Kohort berangkat dari paparan lalu maju ke outcome — kebalikan dari ini." },
            { text: "Cross-sectional", why: "Cross-sectional mengukur paparan dan outcome sekaligus dalam satu potret." },
            { text: "RCT", why: "RCT mengacak paparan oleh peneliti — di sini tidak ada randomisasi." },
          ],
        },
        {
          q: "Peminum kopi terlihat berisiko kanker pankreas, tapi setelah mengontrol rokok asosiasi hilang. Rokok adalah…",
          options: [
            { text: "Confounder", why: "Benar: rokok terkait kopi (paparan) dan kanker (outcome), bukan di jalur kausal kopi→kanker.", correct: true },
            { text: "Mediator", why: "Mediator ada di jalur kausal paparan→outcome; rokok bukan akibat minum kopi." },
            { text: "Collider", why: "Collider adalah akibat bersama paparan dan outcome; rokok adalah penyebab bersama." },
            { text: "Effect modifier", why: "Effect modifier mengubah besar efek antar strata, bukan menciptakan asosiasi palsu." },
          ],
        },
        {
          q: "RCT tidak etis untuk meneliti efek rokok. Alternatif bukti kausal terkuat?",
          options: [
            { text: "Konsistensi multi-studi observasional + kriteria Bradford Hill", why: "Benar: triangulasi — banyak desain, banyak populasi, kriteria Hill. Vonis rokok-kanker dijatuhkan persis dengan cara ini.", correct: true },
            { text: "Satu cross-sectional besar", why: "Cross-sectional gagal di temporalitas — ukuran sampel tidak memperbaikinya." },
            { text: "Studi kasus tunggal", why: "Satu kasus tidak bisa memisahkan efek dari kebetulan." },
            { text: "Opini ahli", why: "Opini tanpa data adalah level bukti terendah." },
          ],
        },
        {
          q: "Kelemahan utama cross-sectional untuk klaim kausal?",
          options: [
            { text: "Paparan dan outcome diukur bersamaan — temporalitas tidak jelas", why: "Benar: masalahnya waktu, bukan ukuran. Ayam-telur tidak terselesaikan oleh n besar.", correct: true },
            { text: "Sampel selalu kecil", why: "Cross-sectional justru sering bersampel besar (survei nasional)." },
            { text: "Tidak bisa hitung prevalensi", why: "Terbalik: prevalensi adalah kekuatan utama cross-sectional." },
            { text: "Terlalu mahal", why: "Cross-sectional termasuk desain termurah dan tercepat." },
          ],
        },
        {
          q: "Recall bias termasuk jenis…",
          options: [
            { text: "Bias informasi", why: "Benar: kesalahan pengukuran/ingatan = bias informasi. Kasus mengingat paparan lebih baik dari kontrol → OR terdistorsi.", correct: true },
            { text: "Bias seleksi", why: "Bias seleksi soal siapa masuk studi, bukan soal kualitas ingatan." },
            { text: "Confounding", why: "Confounding soal variabel ketiga, bukan soal salah ukur." },
            { text: "Bukan bias", why: "Recall bias adalah bias klasik yang sistematis menguntungkan kelompok kasus." },
          ],
        },
        {
          q: "Studi meneliti efek olahraga terhadap jantung HANYA pada pasien rawat inap. Kecemasan → dirawat di RS ← penyakit jantung. Risiko utamanya?",
          options: [
            { text: "Collider bias (Berkson's paradox) — membatasi sampel pada RS membuka jalur bias antara olahraga dan jantung", why: "Benar: 'dirawat di RS' adalah collider (dua panah masuk). Mengondisikan pada collider menciptakan asosiasi palsu antara penyebab-penyebabnya.", correct: true },
            { text: "Confounding oleh kecemasan — harus dikontrol", why: "Salah: kecemasan di sini bukan confounder (ia tidak memengaruhi olahraga DAN jantung secara bersamaan) — masalahnya adalah seleksi sampel pada collider." },
            { text: "Tidak ada masalah — pasien RS mewakili populasi", why: "Salah: pasien RS adalah populasi terseleksi; generalisasi darinya butuh asumsi seleksi yang jarang terpenuhi." },
            { text: "Mediator — sehingga olahraga tidak boleh diteliti", why: "Salah: mediator ada di jalur kausal paparan→outcome; 'dirawat di RS' bukan di jalur olahraga→jantung." },
          ],
        },
        {
          q: "Sebuah temuan observasional punya E-value = 1,4. Interpretasi yang tepat?",
          options: [
            { text: "Rapuh — confounder tak terukur yang cukup lemah (berhubungan 1,4× dengan paparan dan outcome) sudah bisa menjelaskan habis temuan ini", why: "Benar: E-value kecil = ambang runtuhnya rendah. Di bidang dengan banyak confounder tak terukur (mis. gizi, perilaku), 1,4 mudah dilampaui.", correct: true },
            { text: "Sangat kokoh — butuh confounder raksasa untuk meruntuhkannya", why: "Salah: itu interpretasi E-value BESAR (mis. 4+). 1,4 adalah ambang yang rendah." },
            { text: "Confounding sudah terkontrol sepenuhnya", why: "Salah: E-value justru mengukur kerentanan terhadap confounding yang BELUM terkontrol." },
            { text: "Butuh sampel 1,4× lebih besar", why: "Salah: E-value bukan tentang ukuran sampel — ia tentang kekuatan confounder tak terukur." },
          ],
        },
      ],
    },
  ],
};
