import type { V2Lesson } from "../lib/types";

const FIG_GOV = `<svg viewBox="0 0 600 340" role="img" aria-label="Bar chart share voting power delapan alamat teratas.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Share voting power 8 alamat teratas (total 947.000 token)</text>
<line x1="70" y1="40" x2="70" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="70" y1="260" x2="580" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="30" y="94" font-size="10" fill="var(--chart-text)">30%</text>
<text x="30" y="177" font-size="10" fill="var(--chart-text)">15%</text>
<text x="36" y="264" font-size="10" fill="var(--chart-text)">0%</text>
<rect x="90" y="88" width="48" height="172" fill="#e11d48" opacity="0.85"/>
<text x="114" y="80" font-size="10" fill="var(--chart-text)" text-anchor="middle">30,10%</text>
<rect x="152" y="142" width="48" height="118" fill="#e11d48" opacity="0.85"/>
<text x="176" y="134" font-size="10" fill="var(--chart-text)" text-anchor="middle">20,59%</text>
<rect x="214" y="174" width="48" height="86" fill="var(--c1)" opacity="0.85"/>
<text x="238" y="166" font-size="10" fill="var(--chart-text)" text-anchor="middle">14,99%</text>
<rect x="276" y="207" width="48" height="53" fill="var(--c1)" opacity="0.85"/>
<text x="300" y="199" font-size="10" fill="var(--chart-text)" text-anchor="middle">9,29%</text>
<rect x="338" y="223" width="48" height="37" fill="var(--c2)" opacity="0.85"/>
<text x="362" y="215" font-size="10" fill="var(--chart-text)" text-anchor="middle">6,44%</text>
<rect x="400" y="232" width="48" height="28" fill="var(--c2)" opacity="0.85"/>
<text x="424" y="224" font-size="10" fill="var(--chart-text)" text-anchor="middle">4,96%</text>
<rect x="462" y="239" width="48" height="21" fill="var(--c2)" opacity="0.85"/>
<text x="486" y="231" font-size="10" fill="var(--chart-text)" text-anchor="middle">3,70%</text>
<rect x="524" y="243" width="48" height="17" fill="var(--c2)" opacity="0.85"/>
<text x="548" y="235" font-size="10" fill="var(--chart-text)" text-anchor="middle">2,96%</text>
<text x="114" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A01</text>
<text x="176" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A02</text>
<text x="238" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A03</text>
<text x="300" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A04</text>
<text x="362" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A05</text>
<text x="424" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A06</text>
<text x="486" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A07</text>
<text x="548" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A08</text>
<text x="90" y="310" font-size="11" fill="var(--chart-text)">Merah = koalisi Nakamoto: A01 + A02 saja sudah 50,69% — mayoritas mutlak.</text>
</g>
</svg>`;

export const bcd27: V2Lesson = {
  slug: "bcd27-dao-governance",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD27 — DAO Governance Analytics: Membaca Kekuasaan dari Data Voting",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu transaksi, $182 juta, dan proposal yang sah secara voting",
      prose: [
        "April 2022, Beanstalk — protokol stablecoin berbasis DAO — mengesahkan sebuah proposal governance yang tampak biasa. Di dalam proposal yang sama tersembunyi perintah untuk memindahkan hampir seluruh isi treasury, sekitar $182 juta, ke dompet penyerang. Proposal itu lolos bukan karena sistem voting-nya diretas: penyerang memakai flash loan — pinjaman raksasa tanpa jaminan yang harus lunas dalam transaksi yang sama — untuk meminjam voting power mayoritas sesaat, memilih setuju atas proposalnya sendiri, lalu mengembalikan pinjaman itu, semuanya dalam satu transaksi atomik.",
        "Twist-nya: semua datanya on-chain dan publik. Saldo token penyerang sebelum dan sesudah, lonjakan voting power-nya, isi proposal, dan hasil voting-nya bisa dibaca siapa pun, kapan pun, gratis. Yang tidak ada bukanlah datanya — yang tidak ada adalah analitik pemantauannya: tidak ada dashboard yang berteriak ketika satu alamat tiba-tiba menguasai mayoritas suara, tidak ada metrik konsentrasi yang dipantau, tidak ada alarm untuk voting power pinjaman.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan anatomi governance DAO — proposal, quorum, voting power, delegation, dan snapshot; (2) menghitung share top-N holder, Gini coefficient, dan Nakamoto coefficient dari data saldo; (3) mengenali red flag partisipasi dan konsentrasi; (4) memberi vonis kesehatan governance dari angka, bukan dari klaim marketing soal desentralisasi. Prasyarat diringkas: DAO adalah organisasi yang keputusannya diambil lewat voting pemegang token governance, dan hasilnya dieksekusi otomatis oleh smart contract; semua saldo dan suara tercatat di blockchain sehingga bisa dianalisis ulang baris demi baris.",
        "Satu detail yang sering terlewat dari kisah ini: proposal jahat itu tidak menyembunyikan dirinya. Isi transfernya tertulis di data proposal yang publik — yang hilang bukan informasinya, melainkan kebiasaan membacanya dengan kacamata risiko. Analis governance yang baik membaca setiap proposal besar seperti auditor membaca jurnal yang tidak biasa: bukan hanya apa yang dipindahkan, tetapi siapa yang mengesahkan, dengan suara siapa, dan seberapa mendadak suara itu muncul.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Di DAO, kekuasaan bukan jabatan — kekuasaan adalah angka yang bisa dihitung dari distribusi token. Analis governance tidak bertanya siapa yang mengaku memimpin; ia menghitung siapa yang sebenarnya bisa memenangkan voting sendirian, dan angka itu selalu tersedia on-chain.",
      },
      reference: "Kekuasaan yang tidak dihitung akan disalahgunakan.",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Anatomi governance: proposal, quorum, voting power, snapshot",
      prose: [
        "Si Mesin Voting. Governance DAO bekerja dalam siklus yang tetap: (1) PROPOSAL — usulan perubahan diajukan, misalnya menaikkan parameter, memakai dana treasury, atau mengganti kontrak; (2) VOTING — pemegang token memberi suara setuju atau menolak selama jendela voting terbuka; (3) EKSEKUSI — bila syarat terpenuhi, smart contract menjalankan keputusan itu otomatis, tanpa rapat, tanpa notaris, tanpa ampun. Begitu lolos dan dieksekusi, hasilnya sulit dibatalkan — karena itu analisis SEBELUM voting berakhir jauh lebih berharga daripada sesudahnya.",
        "Voting power adalah bobot suara satu alamat. Di kebanyakan DAO, voting power = jumlah token governance yang dipegang, ditambah token yang DIDELEGASIKAN orang lain kepadanya (delegation). Delegation masuk akal — tidak semua holder punya waktu menilai proposal teknis — tetapi ia menciptakan kelas delegate besar yang suaranya bisa melebihi ribuan holder kecil. Snapshot adalah foto saldo pada satu block tertentu di awal voting: saldo setelah snapshot tidak dihitung, untuk mencegah orang membeli suara di tengah jalan. Kasus Beanstalk menunjukkan celahnya: bila snapshot dan eksekusi bisa terjadi dalam pola yang sama, voting power pinjaman sesaat pun bisa ikut menentukan hasil.",
        "Kenapa satu token satu suara tidak sama dengan desentralisasi: rumus itu hanya adil bila tokennya TERSEBAR. Bila tiga alamat menguasai 65% token, maka satu token satu suara berarti tiga alamat satu keputusan. Desentralisasi bukan sifat rumus voting-nya; ia sifat DISTRIBUSI token di belakang rumus itu — dan distribusi adalah data yang bisa diukur persis, bukan slogan.",
        "Pengaman yang lazim dipasang di antara voting dan eksekusi adalah timelock: jeda wajib — misalnya 48 jam sampai 7 hari — sebelum hasil voting benar-benar dijalankan. Timelock tidak mencegah voting yang buruk, tetapi ia memberi waktu bagi komunitas untuk membaca hasil, menemukan proposal tersembunyi, dan keluar atau bereaksi sebelum dana bergerak. Saat menilai sebuah DAO, catat selalu ada tidaknya timelock dan berapa lama jedanya; proposal treasury tanpa timelock adalah red flag tersendiri.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“DAO ini punya 50.000 holder, pasti terdesentralisasi.” Jumlah holder mengukur sebaran dompet, bukan sebaran KEKUASAAN. 50.000 alamat yang bersama-sama hanya menguasai 10% suara kalah oleh dua alamat yang menguasai 54%. Analis yang hanya melaporkan jumlah holder sedang melaporkan angka yang paling tidak relevan untuk risiko governance.",
      },
      reference: "Yang dihitung suara berbobot, bukan kepala.",
    },
    {
      id: "konsentrasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Metrik konsentrasi: share top-N, Gini, dan Nakamoto coefficient",
      prose: [
        "Si Timbangan Kekuasaan. Tiga metrik cukup untuk potret pertama konsentrasi voting power. Pertama, share top-N: persentase total suara yang dikuasai N alamat terbesar — top-3 dan top-10 adalah pasangan yang paling lazim dilaporkan. Kedua, Gini coefficient: angka 0 sampai 1 dari ilmu ekonomi ketimpangan — 0 berarti semua alamat sama kuat, 1 berarti satu alamat menguasai segalanya. Ketiga, Nakamoto coefficient versi governance: jumlah entitas minimum yang bila bergabung bersama-sama menguasai lebih dari 50% voting power — semakin kecil angkanya, semakin rapuh governancenya.",
        "Cara membaca ketiganya bersamaan: share top-N memberi nama dan wajah (alamat mana yang besar), Gini memberi satu angka ringkas untuk dibandingkan antar-DAO dan antar-waktu, dan Nakamoto memberi angka operasional — berapa pihak yang harus berkomplot, atau diretas, atau disuap, agar DAO ini jatuh. Untuk keputusan risiko, Nakamoto biasanya yang paling menentukan, karena ia menjawab pertanyaan penyerang, bukan pertanyaan statistikawan.",
        "Rumus kerja analis — Gini coefficient dari daftar saldo yang sudah diurutkan naik:",
      ],
      formula: String.raw`G = \frac{2\sum_{i=1}^{n} i \cdot x_{(i)}}{n \sum_{i=1}^{n} x_i} - \frac{n+1}{n}`,
      formulaNote: "G = Gini coefficient (0 = setara sempurna, mendekati 1 = sangat timpang); n = jumlah alamat; i = peringkat alamat setelah saldo diurutkan NAIK (i = 1 untuk yang terkecil); x(i) = saldo alamat peringkat ke-i; penyebut n dikali total semua saldo menormalkan hasilnya terhadap ukuran DAO. Contoh lab lesson ini: G = 0,61 — ketimpangan setara ekonomi yang sangat timpang; sebagai patokan kasar, G di atas 0,50 untuk voting power layak diperlakukan sebagai peringatan.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "Menghitung Gini dari saldo yang BELUM diurutkan naik. Rumus ini menimbang tiap saldo dengan peringkatnya — saldo besar harus mendapat peringkat besar. Mengurutkan turun, atau tidak mengurutkan sama sekali, menghasilkan angka yang tampak masuk akal tetapi salah total, dan kesalahan ini tidak berteriak: hasil tetap di antara 0 dan 1, hanya tidak berarti apa-apa.",
      },
      reference: "Tiga angka, satu potret kekuasaan.",
    },
    {
      id: "partisipasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Partisipasi & red flags: ketika voting sah tetapi rapuh",
      prose: [
        "Si Penjaga Gerbang Tidur. Proposal bisa lolos secara prosedural dan tetap berbahaya secara governance. Metrik pasangannya adalah participation rate / turnout: persentase total voting power yang benar-benar ikut memilih. Turnout 6% berarti 94% kekuasaan DAO sedang tidur — dan dalam kondisi tidur itu, siapa pun yang menguasai sedikit di atas separuh dari 6% tersebut memenangkan keputusan atas nama 100%. Quorum — ambang minimum suara yang harus ikut agar hasil sah, misalnya 40% dari total — adalah rem untuk situasi ini, tetapi rem itu lemah bila quorum pas-pasan terlampaui oleh suara segelintir whale.",
        "Empat red flag yang dicari analis: (1) TURNOUT RENDAH — di bawah 10% untuk proposal besar berarti keputusan diambil minoritas aktif yang sangat kecil; (2) DELEGASI TERPUSAT — sebagian besar suara delegasi menumpuk di 1-3 delegate, sehingga menguasai delegate sama dengan menguasai DAO; (3) QUORUM PAS-PASAN — hasil yang quorum-nya terlampaui tipis oleh satu alamat besar berarti alamat itu penentu tunggal sah tidaknya voting; (4) VOTING POWER PINJAMAN — lonjakan saldo sesaat di sekitar snapshot atau voting, pola khas flash loan dan pembelian suara jangka pendek: alamat yang kemarin kosong hari ini menentukan, besok kosong lagi.",
        "Cara berpikirnya: konsentrasi menjawab siapa yang BISA menguasai, partisipasi menjawab seberapa mudah penguasaan itu terjadi hari ini. DAO dengan Nakamoto coefficient 8 tetapi turnout rutin 5% bisa lebih rapuh daripada DAO dengan Nakamoto 4 dan turnout 45%, karena pada DAO pertama penyerang hanya perlu memobilisasi atau meminjam sebagian kecil suara untuk menang melawan mayoritas yang absen.",
        "Sumber data untuk semua ini tidak eksotis: event Transfer token untuk peta saldo, event VoteCast atau data Snapshot untuk siapa memilih apa, dan daftar delegate dari kontrak governance untuk peta delegasi. Pekerjaan analisnya adalah menggabungkan ketiganya pada block yang sama — snapshot yang dipakai proposal itu sendiri — karena konsentrasi yang dihitung dari saldo hari ini bisa berbeda dari konsentrasi pada saat voting yang sedang dinilai terjadi.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Turnout rendah adalah subsidi untuk penyerang: setiap suara yang tidak dipakai menurunkan harga untuk menguasai DAO. Itulah sebabnya analis governance melaporkan konsentrasi dan turnout selalu berpasangan — yang satu harga kekuasaan, yang satu diskonnya.",
      },
      reference: "Yang absen ikut menentukan — dengan cara kalah.",
    },
    {
      id: "lab-governance",
      eyebrow: "Langkah 5 · Lab",
      title: "Ukur konsentrasi & uji proposal dari data saldo",
      prose: [
        "Dataset: 15 alamat dengan saldo token governance, total 947.000 token. Tugasmu: (1) hitung total suara, share top-3 dan top-10 dalam persen, Gini coefficient dengan saldo terurut naik, dan Nakamoto coefficient dengan mengakumulasi saldo terbesar sampai melewati 50% total; (2) uji proposal dengan suara setuju 320.000 dan tolak 90.000 — proposal LOLOS hanya bila suara yang ikut mencapai quorum 40% dari total DAN setuju lebih besar dari tolak; (3) vonis konsentrasi: TERPUSAT bila Nakamoto coefficient 3 atau kurang, selain itu TERDISTRIBUSI.",
        "Hasil yang benar: share top-3 = 65,68% dan top-10 = 96,94% — tiga alamat menguasai hampir dua pertiga suara, sepuluh alamat menguasai hampir semuanya. Gini = 0,61 dan Nakamoto = 2: dua alamat terbesar bersama-sama sudah 480.000 token, melewati separuh total. Proposalnya sendiri LOLOS (ikut 410.000, melewati quorum 378.800, dan setuju menang) — tetapi vonis konsentrasinya TERPUSAT. Dua kalimat yang harus bisa hidup berdampingan: prosedurnya sah, kekuasaannya timpang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_suara`, `share_top3`, `share_top10`, `gini`, dan `nakamoto`" },
        { id: "t2", text: "Uji proposal terhadap quorum & mayoritas; tentukan `status_proposal` dan `vonis`" },
        { id: "t3", text: "Cetak semua hasil sesuai format" },
      ],
      expected: "total_suara=947000\nshare_top3=65.68%\nshare_top10=96.94%\ngini=0.61\nnakamoto=2\nquorum=378800 ikut=410000\nproposal=LOLOS vonis=TERPUSAT",
      note: {
        title: "💡 Intuisi",
        body: "Perhatikan siapa yang membuat proposal ini lolos: suara yang ikut hanya 410.000 dari 947.000 — turnout 43,29% — dan dua alamat teratas saja memegang 480.000, lebih besar dari seluruh suara yang ikut. Di DAO seperti ini, hasil voting praktis ditentukan sebelum jendela voting dibuka, oleh keputusan dua alamat untuk ikut atau tidak ikut.",
      },
      hints: [
        "Gini wajib dari saldo terurut NAIK: timbang saldo peringkat ke-i dengan i yang mulai dari 1.",
        "Nakamoto: urutkan TURUN, akumulasi satu per satu, berhenti saat kumulatif > total/2; hitung berapa alamat yang terpakai.",
        "Quorum dihitung dari suara yang IKUT (setuju + tolak), bukan dari setuju saja.",
      ],
      code: {
        starter: "# Dataset voting power 15 alamat. JANGAN UBAH.\nholders = [(\"A01\", 285000), (\"A02\", 195000), (\"A03\", 142000), (\"A04\", 88000), (\"A05\", 61000), (\"A06\", 47000), (\"A07\", 35000), (\"A08\", 28000), (\"A09\", 21000), (\"A10\", 16000), (\"A11\", 11000), (\"A12\", 8000), (\"A13\", 5000), (\"A14\", 3000), (\"A15\", 2000)]\nsetuju, tolak = 320000, 90000\n\n# TULIS KODEMU: metrik konsentrasi + uji proposal.\nsaldo = [s for _, s in holders]\ntotal_suara = \nurut_turun = sorted(saldo, reverse=True)\nshare_top3 = \nshare_top10 = \nurut_naik = sorted(saldo)\nn = len(urut_naik)\ngini = \nkumulatif = 0\nnakamoto = 0\n# TULIS loop Nakamoto di sini: akumulasi urut_turun sampai > total/2.\nquorum = int(0.40 * total_suara)\nikut_voting = setuju + tolak\nstatus_proposal = \nvonis = \nprint(f\"total_suara={total_suara}\")\nprint(f\"share_top3={share_top3:.2f}%\")\nprint(f\"share_top10={share_top10:.2f}%\")\nprint(f\"gini={gini:.2f}\")\nprint(f\"nakamoto={nakamoto}\")\nprint(f\"quorum={quorum} ikut={ikut_voting}\")\nprint(f\"proposal={status_proposal} vonis={vonis}\")\n",
        lockLines: 3,
        solution: "# Dataset voting power 15 alamat. JANGAN UBAH.\nholders = [(\"A01\", 285000), (\"A02\", 195000), (\"A03\", 142000), (\"A04\", 88000), (\"A05\", 61000), (\"A06\", 47000), (\"A07\", 35000), (\"A08\", 28000), (\"A09\", 21000), (\"A10\", 16000), (\"A11\", 11000), (\"A12\", 8000), (\"A13\", 5000), (\"A14\", 3000), (\"A15\", 2000)]\nsetuju, tolak = 320000, 90000\n\n# TULIS KODEMU: metrik konsentrasi + uji proposal.\nsaldo = [s for _, s in holders]\ntotal_suara = sum(saldo)\nurut_turun = sorted(saldo, reverse=True)\nshare_top3 = round(sum(urut_turun[:3]) / total_suara * 100, 2)\nshare_top10 = round(sum(urut_turun[:10]) / total_suara * 100, 2)\nurut_naik = sorted(saldo)\nn = len(urut_naik)\ngini = round((2 * sum((i + 1) * x for i, x in enumerate(urut_naik))) / (n * total_suara) - (n + 1) / n, 4)\nkumulatif = 0\nnakamoto = 0\nfor s in urut_turun:\n    kumulatif += s\n    nakamoto += 1\n    if kumulatif > total_suara / 2:\n        break\nquorum = int(0.40 * total_suara)\nikut_voting = setuju + tolak\nstatus_proposal = \"LOLOS\" if (ikut_voting >= quorum and setuju > tolak) else \"GAGAL\"\nvonis = \"TERPUSAT\" if nakamoto <= 3 else \"TERDISTRIBUSI\"\nprint(f\"total_suara={total_suara}\")\nprint(f\"share_top3={share_top3:.2f}%\")\nprint(f\"share_top10={share_top10:.2f}%\")\nprint(f\"gini={gini:.2f}\")\nprint(f\"nakamoto={nakamoto}\")\nprint(f\"quorum={quorum} ikut={ikut_voting}\")\nprint(f\"proposal={status_proposal} vonis={vonis}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "total_suara", value: 947000, tol: 0, label: "total = 947.000", msg: "Jumlah seluruh saldo 15 alamat." },
          { kind: "equal", task: "t1", name: "share_top3", value: 65.68, tol: 0.01, label: "share top-3 ≈ 65,68%", msg: "622.000 dari 947.000 dikuasai 3 alamat teratas." },
          { kind: "equal", task: "t1", name: "share_top10", value: 96.94, tol: 0.01, label: "share top-10 ≈ 96,94%", msg: "918.000 dari 947.000 dikuasai 10 alamat teratas." },
          { kind: "equal", task: "t1", name: "gini", value: 0.6144, tol: 0.001, label: "Gini ≈ 0,6144", msg: "Dihitung dari saldo terurut naik." },
          { kind: "equal", task: "t1", name: "nakamoto", value: 2, tol: 0, label: "Nakamoto = 2", msg: "A01 + A02 = 480.000 sudah melewati 50% total." },
          { kind: "stdout_matches", task: "t3", label: "share top-3 tercetak", msg: "Format persen 2 desimal.", pattern: "share_top3=65.68%" },
          { kind: "stdout_matches", task: "t3", label: "vonis tercetak", msg: "Proposal lolos tetapi konsentrasi terpusat.", pattern: "proposal=LOLOS vonis=TERPUSAT" },
        ],
      },
      reference: "Sah secara prosedur, timpang secara kekuasaan.",
    },
    {
      id: "chart",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca distribusi: dua batang yang menentukan segalanya",
      prose: [
        "Chart ini menampilkan share voting power delapan alamat teratas dari dataset lab — alamat yang sama, angka yang sama, hanya divisualkan agar pola konsentrasinya terlihat dalam sekali pandang.",
        "Cara membaca: sumbu X = alamat teratas terurut dari saldo terbesar (A01) ke lebih kecil (A08); tinggi batang = share alamat itu terhadap total 947.000 token; dua batang merah pertama adalah koalisi Nakamoto — gabungan terkecil yang sudah melewati 50%. Delapan alamat terbawah dari daftar 15 bahkan tidak muncul di chart ini karena share mereka masing-masing di bawah 2,3%.",
        "Interpretasi: kurva share-nya runtuh dengan cepat — 30,10%, lalu 20,59%, lalu 14,99%, dan sisanya ekor panjang yang tipis. A01 dan A02 bersama-sama memegang 50,69%: setiap proposal di DAO ini, apa pun isinya, menang atau kalah di dua alamat itu. Batang-batang kecil bukan tidak penting — mereka menentukan quorum dan legitimasi — tetapi mereka tidak menentukan HASIL bila dua batang merah sudah sepakat.",
        "Bandingkan bentuk ini dengan distribusi yang sehat: batang-batang yang menurun landai, tidak ada satu pun alamat di atas 5-10%, dan koalisi mayoritas baru terbentuk setelah belasan alamat. Bentuk chart adalah diagnosis visual tercepat — jurang curam di dua batang pertama berarti governance-nya, apa pun dokumen resminya, berjalan seperti perusahaan dengan dua pemegang saham pengendali.",
      ],
      tasks: [],
      figure: {
        svg: FIG_GOV,
        alt: "Bar chart share voting power delapan alamat teratas; A01 30,10% dan A02 20,59% tertinggi.",
        caption: "Dua alamat = mayoritas mutlak; sisanya ekor panjang yang menentukan quorum, bukan hasil.",
      },
      reference: "Hasil voting diputuskan di batang terpendek koalisinya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: menilai kesehatan governance sebuah DAO",
      prose: [
        "Skenario 1 — Nakamoto coefficient 3 atau kurang, untuk proposal apa pun: perlakukan DAO sebagai terpusat secara efektif. Proposal treasury besar dari DAO seperti ini dinilai seperti keputusan dua-tiga pihak, bukan keputusan komunitas — tuntut transparansi dan jeda eksekusi (timelock) yang panjang.",
        "Skenario 2 — Nakamoto sehat (misalnya 10 ke atas) tetapi turnout rutin di bawah 10%: risikonya bukan konsentrasi permanen, melainkan pengambilalihan sesaat. Periksa siapa yang aktif, apakah ada voting power pinjaman di sekitar snapshot, dan apakah quorum bisa dicapai segelintir alamat aktif saja.",
        "Skenario 3 — Gini di atas 0,50 dan share top-10 di atas 90%: distribusi sangat timpang. Setiap klaim desentralisasi dari timnya harus dibaca sebagai klaim arah masa depan, bukan kondisi hari ini; nilai token governance-nya dengan diskon risiko konsentrasi.",
        "Skenario 4 — Delegasi menumpuk di 1-3 delegate besar: analisis ulang Nakamoto di level DELEGATE, bukan di level alamat token. Tiga delegate yang masing-masing membawa suara ribuan holder bisa menghasilkan Nakamoto efektif 2 walau distribusi tokennya tampak sehat.",
        "Skenario 5 — Quorum terlampaui hanya berkat satu alamat dan marginnya tipis: catat alamat itu sebagai penentu tunggal (kingmaker). Untuk proposal berikutnya, pantau aktivitas alamat tersebut sebelum dan selama voting — pergerakannya adalah sinyal paling awal hasil akhir.",
        "Aturan 10 detik: (1) berapa Nakamoto-nya? (2) berapa turnout proposal terakhir? (3) siapa tiga pemegang suara terbesar dan apakah mereka delegate? (4) quorum-nya dicapai oleh berapa alamat? Empat jawaban itu cukup untuk vonis awal: sehat, rapuh, atau terpusat dengan kostum desentralisasi.",
        "Catatan batas peta ini: satu alamat belum tentu satu entitas — satu pihak bisa mengendalikan banyak alamat, dan satu alamat kustodian bisa mewakili banyak pemilik. Peta ini memberi vonis AWAL dari data alamat; vonis akhir untuk keputusan besar perlu pengelompokan entitas (entity clustering) dan riwayat voting, bukan sekadar saldo sesaat.",
      ],
      tasks: [],
      reference: "Nilai koalisinya, bukan jumlah holder-nya.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Proposal treasury yang menang dengan 6% turnout",
      prose: [
        "DAO fiktif bernama KiranaDAO membuka voting untuk proposal memindahkan 40% treasury ke program insentif baru. Data on-chain-nya: total voting power 10.000.000 token; turnout hanya 6% (600.000 token ikut memilih); dua whale, W1 dan W2, bersama-sama memegang 54% dari suara yang ikut — W1 memilih setuju, W2 memilih setuju; hasil akhir 71% setuju, quorum internal DAO ini hanya 5% sehingga proposal dinyatakan sah dan siap dieksekusi dalam 48 jam.",
        "Pertanyaan: (1) Berapa token yang sebenarnya menentukan hasil proposal ini, dan berapa persen dari total voting power itu? (2) Sebutkan dua red flag governance dari angka-angka di atas beserta metrik yang membuktikannya. (3) Sebagai analis, satu perubahan aturan apa yang paling kamu rekomendasikan sebelum proposal treasury sebesar ini boleh dieksekusi lagi?",
        "Pembahasan: (1) Yang menentukan adalah suara dua whale: 54% dari 600.000 = 324.000 token, hanya 3,24% dari total 10.000.000 voting power — dan karena sisanya terpecah, persetujuan keduanya praktis mengunci hasil 71% setuju. Keputusan atas 40% treasury diambil oleh sekitar tiga persen kekuasaan formal DAO. (2) Red flag pertama turnout sangat rendah (6%) — dibuktikan participation rate; red flag kedua konsentrasi suara efektif ekstrem — dua alamat menguasai mayoritas suara yang ikut, pola yang terlihat dari share top-2 terhadap suara masuk dan akan tampak sebagai Nakamoto efektif yang sangat kecil bila dihitung pada peserta voting. Quorum 5% yang terlampaui tipis (6%) adalah red flag pendamping: remnya ada, tetapi terlalu rendah untuk proposal sebesar ini. (3) Rekomendasi terkuat: quorum dan ambang persetujuan berjenjang menurut ukuran proposal — proposal yang menggerakkan porsi besar treasury wajib mencapai quorum jauh lebih tinggi (misalnya 20-30% total voting power) plus timelock lebih panjang, sehingga mayoritas yang tidur punya waktu untuk bangun dan menolak.",
      ],
      tasks: [],
      reference: "Tiga persen bisa memindahkan 40% — bila 94% tidur.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor 5 dari 5 — materi ini fondasi untuk audit governance apa pun.",
      ],
      tasks: [],
      summary: [
        "Governance DAO = siklus proposal, voting berbobot token plus delegasi, lalu eksekusi otomatis; snapshot membekukan saldo penentu di awal voting.",
        "Satu token satu suara tidak menjamin desentralisasi — yang menentukan adalah distribusi token di belakang suara itu.",
        "Share top-N, Gini coefficient (0 setara, mendekati 1 timpang, wajib dari saldo terurut naik), dan Nakamoto coefficient (entitas minimum penguasa >50%) adalah tiga metrik inti konsentrasi.",
        "Dataset lab: total 947.000, top-3 = 65,68%, top-10 = 96,94%, Gini = 0,61, Nakamoto = 2 — proposal bisa LOLOS secara prosedur sambil governancenya TERPUSAT.",
        "Red flag partisipasi: turnout rendah, delegasi terpusat, quorum pas-pasan, dan voting power pinjaman (flash loan) di sekitar snapshot.",
        "Vonis governance selalu berpasangan: konsentrasi menjawab siapa yang bisa menguasai, turnout menjawab semudah apa penguasaan itu terjadi.",
      ],
      quiz: [
        {
          q: "Pelajaran inti dari serangan governance Beanstalk (April 2022)?",
          options: [
            { text: "Voting power mayoritas bisa dipinjam sesaat lewat flash loan dan dipakai mengesahkan proposal jahat dalam satu transaksi", why: "Benar: penyerang tidak mencuri kunci — ia meminjam kekuasaan voting itu sendiri, dan datanya publik tetapi tidak terpantau.", correct: true },
            { text: "Smart contract Beanstalk diretas lewat celah kunci privat admin", why: "Salah: mekanismenya eksploitasi governance dan voting power pinjaman, bukan peretasan kunci." },
            { text: "Snapshot voting membuat serangan seperti ini mustahil", why: "Salah: justru kasus ini yang menunjukkan snapshot dan desain voting bisa diakali voting power sesaat." },
            { text: "Kerugian terjadi karena harga token jatuh di pasar", why: "Salah: treasury dipindahkan oleh proposal yang disahkan, bukan oleh pergerakan harga." },
          ],
        },
        {
          q: "DAO melaporkan 50.000 holder. Kenapa angka itu belum membuktikan desentralisasi?",
          options: [
            { text: "Karena yang menentukan hasil adalah distribusi voting power — segelintir alamat bisa menguasai mayoritas walau holder-nya puluhan ribu", why: "Benar: jumlah holder mengukur sebaran dompet, bukan sebaran kekuasaan.", correct: true },
            { text: "Karena holder di bawah 100.000 selalu dianggap terpusat", why: "Salah: tidak ada ambang jumlah holder seperti itu; ukurannya konsentrasi suara." },
            { text: "Karena sebagian holder pasti bot", why: "Tidak bisa disimpulkan dari jumlahnya — dan bot atau bukan, metrik penentunya tetap share suara." },
            { text: "Karena voting memakai delegation", why: "Delegation memperumit analisis, tetapi bukan alasan utamanya — distribusi suara tetap penentu." },
          ],
        },
        {
          q: "Saldo terurut turun: 285.000, 195.000, 142.000, dan seterusnya, total 947.000. Nakamoto coefficient-nya?",
          options: [
            { text: "2 — dua alamat teratas berjumlah 480.000, sudah melewati 50% dari 947.000", why: "Benar: akumulasi dari yang terbesar berhenti di alamat ke-2.", correct: true },
            { text: "1 — alamat terbesar selalu menjadi Nakamoto coefficient", why: "Salah: A01 sendirian 285.000, baru 30,10% — belum melewati separuh total." },
            { text: "3 — karena share top-3 sebesar 65,68%", why: "Salah: top-3 memang 65,68%, tetapi ambang 50% sudah terlampaui di alamat ke-2." },
            { text: "15 — semua alamat harus dihitung", why: "Salah: Nakamoto berhenti tepat saat kumulatif melewati 50%, bukan menghabiskan daftar." },
          ],
        },
        {
          q: "Pernyataan yang benar tentang Gini coefficient voting power:",
          options: [
            { text: "Dihitung dari saldo terurut naik; 0 berarti setara sempurna dan nilai 0,61 menandakan ketimpangan berat", why: "Benar: urutan naik adalah syarat rumusnya, dan 0,61 jauh di wilayah timpang.", correct: true },
            { text: "Dihitung dari saldo terurut turun agar whale lebih dulu terlihat", why: "Salah: urutan turun merusak penimbangan peringkat dalam rumus — hasilnya tidak valid." },
            { text: "Nilai di atas 1 berarti sangat terpusat", why: "Salah: Gini berada di rentang 0 sampai 1; di atas 1 berarti hitunganmu keliru." },
            { text: "Gini yang rendah menjamin turnout tinggi", why: "Salah: Gini mengukur distribusi, turnout mengukur partisipasi — dua hal berbeda yang harus dibaca berpasangan." },
          ],
        },
        {
          q: "Proposal: setuju 320.000, tolak 90.000, total voting power 947.000, quorum 40% dari total. Hasilnya?",
          options: [
            { text: "LOLOS — suara ikut 410.000 melewati quorum 378.800 dan setuju mengalahkan tolak", why: "Benar: quorum dinilai dari total yang ikut (410.000), bukan dari setuju saja — dan mayoritas sederhana terpenuhi.", correct: true },
            { text: "GAGAL — setuju 320.000 sendirian belum mencapai quorum 378.800", why: "Salah: quorum adalah ambang partisipasi; yang dibandingkan dengan quorum adalah setuju + tolak." },
            { text: "LOLOS hanya bila turnout mencapai 100%", why: "Salah: syaratnya quorum 40% dan mayoritas — keduanya sudah terpenuhi tanpa turnout penuh." },
            { text: "GAGAL — karena Nakamoto coefficient DAO ini hanya 2", why: "Salah: konsentrasi mengubah vonis kesehatan governance-nya (TERPUSAT), bukan sah tidaknya hasil voting ini." },
          ],
        },
      ],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "Mencampuradukkan dua vonis: sah tidaknya sebuah proposal (soal quorum dan mayoritas) dan sehat tidaknya governance (soal konsentrasi dan turnout). Proposal Beanstalk maupun proposal lab lesson ini sama-sama sah secara prosedur — bahayanya justru di situ. Analis yang hanya melaporkan LOLOS atau GAGAL melewatkan separuh pekerjaannya: melaporkan oleh berapa alamat hasil itu sebenarnya ditentukan.",
      },
      hints: [
        "Uji cepat: dari daftar saldo mentah, bisakah kamu menghasilkan total, share top-3, Gini, dan Nakamoto tanpa melihat solution?",
        "Ingat pasangan vonisnya: quorum + mayoritas untuk hasil; Nakamoto + turnout untuk kesehatan.",
      ],
      next: { label: "BCD28 — ERC-4337: Account Abstraction & Analitik UserOperation", href: "/learn/bcd28-erc4337" },
      reference: "Hitung kekuasaannya sebelum percaya desentralisasinya.",
    },
  ],
};
