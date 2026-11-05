import type { V2Lesson } from "../lib/types";

const FIG_BILATERAL = `<svg viewBox="0 0 480 280" role="img" aria-label="Bilateral vs CCP: jaring kusut vs hub.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Bilateral (kiri) vs CCP (kanan)</text>
<circle cx="60" cy="100" r="18" fill="var(--c1)" opacity="0.5"/><text x="60" y="105" font-size="11" fill="var(--chart-text)" text-anchor="middle">A</text>
<circle cx="60" cy="180" r="18" fill="var(--c1)" opacity="0.5"/><text x="60" y="185" font-size="11" fill="var(--chart-text)" text-anchor="middle">B</text>
<circle cx="160" cy="100" r="18" fill="var(--c1)" opacity="0.5"/><text x="160" y="105" font-size="11" fill="var(--chart-text)" text-anchor="middle">C</text>
<circle cx="160" cy="180" r="18" fill="var(--c1)" opacity="0.5"/><text x="160" y="185" font-size="11" fill="var(--chart-text)" text-anchor="middle">D</text>
<line x1="78" y1="100" x2="142" y2="100" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="78" y1="180" x2="142" y2="180" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="60" y1="118" x2="60" y2="162" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="160" y1="118" x2="160" y2="162" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="74" y1="114" x2="146" y2="166" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="74" y1="166" x2="146" y2="114" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="110" y="230" font-size="10" fill="var(--chart-text)" text-anchor="middle">6 eksposur bilateral</text>
<circle cx="330" cy="100" r="16" fill="var(--c3)" opacity="0.5"/><text x="330" y="104" font-size="10" fill="var(--chart-text)" text-anchor="middle">A</text>
<circle cx="330" cy="190" r="16" fill="var(--c3)" opacity="0.5"/><text x="330" y="194" font-size="10" fill="var(--chart-text)" text-anchor="middle">B</text>
<circle cx="430" cy="100" r="16" fill="var(--c3)" opacity="0.5"/><text x="430" y="104" font-size="10" fill="var(--chart-text)" text-anchor="middle">C</text>
<circle cx="430" cy="190" r="16" fill="var(--c3)" opacity="0.5"/><text x="430" y="194" font-size="10" fill="var(--chart-text)" text-anchor="middle">D</text>
<circle cx="380" cy="145" r="24" fill="var(--chart-text)" opacity="0.2" stroke="var(--chart-text)" stroke-width="2"/>
<text x="380" y="150" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">CCP</text>
<line x1="344" y1="108" x2="362" y2="132" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="344" y1="182" x2="362" y2="158" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="416" y1="108" x2="398" y2="132" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="416" y1="182" x2="398" y2="158" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="380" y="230" font-size="10" fill="var(--chart-text)" text-anchor="middle">4 eksposur ke CCP</text>
<text x="240" y="265" font-size="10" fill="var(--chart-text)" text-anchor="middle">CCP = hub: netting multilateral, risiko terkonsentrasi &amp; terkelola.</text>
</g>
</svg>`;

const FIG_WATERFALL = `<svg viewBox="0 0 480 300" role="img" aria-label="Urutan waterfall default CCP.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Waterfall default CCP: siapa bayar duluan</text>
<rect x="40" y="50" width="400" height="34" rx="6" fill="var(--c1)" opacity="0.45"/>
<text x="240" y="72" font-size="11" fill="var(--chart-text)" text-anchor="middle">1. Margin awal anggota yang gagal</text>
<rect x="40" y="92" width="400" height="34" rx="6" fill="var(--c1)" opacity="0.35"/>
<text x="240" y="114" font-size="11" fill="var(--chart-text)" text-anchor="middle">2. Kontribusi dana default anggota yang gagal</text>
<rect x="40" y="134" width="400" height="34" rx="6" fill="var(--c3)" opacity="0.4"/>
<text x="240" y="156" font-size="11" fill="var(--chart-text)" text-anchor="middle">3. Modal CCP sendiri (skin in the game)</text>
<rect x="40" y="176" width="400" height="34" rx="6" fill="var(--c4)" opacity="0.4"/>
<text x="240" y="198" font-size="11" fill="var(--chart-text)" text-anchor="middle">4. Dana default anggota lain (mutualisasi)</text>
<rect x="40" y="218" width="400" height="34" rx="6" fill="var(--c2)" opacity="0.35"/>
<text x="240" y="240" font-size="11" fill="var(--chart-text)" text-anchor="middle">5. Penarikan tambahan (assessment) ke anggota</text>
<text x="40" y="275" font-size="10" fill="var(--chart-text)">Prinsip: yang gagal bayar duluan, CCP ikut menanggung, baru dimutualisasi.</text>
</g>
</svg>`;

export const mr23: V2Lesson = {
  slug: "mr23-otc-clearing-ccp",
  track: "Market Risk",
  module: "Derivatif & Infrastruktur Pasar",
  title: "MR23 — Derivatif OTC: Clearing, Margin, dan Risiko CCP",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Senin setelah kebangkrutan",
      prose: [
        "Senin pagi, kabar: salah satu dealer derivatif terbesar dinyatakan gagal bayar. Bank Artha Dana punya 40 kontrak swap dengannya — sebagian untung Rp50 miliar, sebagian rugi Rp30 miliar. Telepon dari legal: 'Apakah kontrak kita di-clearing lewat CCP atau bilateral?' Jawabannya menentukan segalanya.",
        "Twist-nya: jika bilateral TANPA netting agreement yang kuat, bank harus membayar penuh Rp30 miliar ke kurator — sementara Rp50 miliar keuntungannya antre sebagai kreditor tanpa jaminan. Jika di-clearing via CCP, posisi neto Rp20 miliar dilindungi margin dan waterfall. Perbedaannya bukan 'teknis' — ia adalah perbedaan antara rugi Rp30 miliar dan rugi Rp0. Lesson ini tentang infrastruktur yang membuat perbedaan itu. Setelah lesson ini kamu bisa: (1) membedakan eksposur bilateral vs cleared; (2) menghitung manfaat netting; (3) menjelaskan waterfall default CCP; (4) menghitung kebutuhan margin awal dan variasi.",
        "Konteks regulasi Indonesia: OJK dan BI mengatur transaksi derivatif termasuk kewajiban pelaporan dan kerangka penyelesaian. Tren global pasca-2008 jelas: yang terstandar didorong ke CCP, yang bilateral dikenai margin wajib (aturan margin bilateral/BCBS-IOSCO yang diadopsi bertahap). Analis yang paham infrastruktur ini tidak hanya menghitung risiko — ia memahami MENGAPA aturannya ada.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pasca-2008, G20 mewajibkan derivatif OTC terstandar di-clearing via CCP (di Indonesia: kerangka OJK/BI untuk derivatif). Ini bukan teori — analis market risk wajib paham karena menentukan perhitungan eksposur counterparty (SA-CCR) dan kebutuhan modal bank.",
      },
      reference: "Bilateral vs CCP = siapa menanggung gagal bayar. Margin + waterfall = jawabannya.",
    },
    {
      id: "bilateral",
      eyebrow: "Langkah 2 · Konsep",
      title: "Bilateral: jaring kusut eksposur",
      prose: [
        "Di pasar bilateral, setiap bank bertransaksi langsung dengan setiap counterparty — A dengan B, A dengan C, B dengan C. Hasilnya jaring kusut: N peserta = N×(N-1)/2 hubungan bilateral. Setiap hubungan butuh perjanjian (ISDA Master Agreement), jaminan (CSA), dan perhitungan eksposur sendiri. Ketika satu peserta gagal, setiap counterparty-nya menghitung kerugiannya sendiri-sendiri — persis kekacauan 2008.",
        "Netting adalah penyelamat bilateral: dalam satu netting set (satu counterparty, satu perjanjian), kontrak untung dan rugi saling hapus — eksposur = max(neto, 0). Tanpa netting: bayar penuh yang rugi, antre untuk yang untung. Dengan netting: hanya selisihnya. Lab pertama menghitung persis ini.",
        "Tiga miskonsepsi. Satu: 'Bilateral = kuno, semua sudah clearing.' Derivatif non-standar (exotic, bespoke) tetap bilateral — justru yang paling berisiko. Dua: 'Netting otomatis berlaku.' Netting butuh perjanjian tertulis + opini hukum bahwa ia enforceable di yurisdiksi terkait. Tiga: 'Eksposur = nilai kontrak.' Eksposur = nilai wajar SAAT INI yang positif (plus add-on untuk masa depan) — bukan nosional.",
        "Margin period of risk (MPOR) layak dipahami sejak di sini: saat counterparty gagal, bank butuh waktu untuk menutup/mengganti posisi — selama itu pasar bergerak dan kerugian membesar. MPOR bilateral tipikal 10 hari (vs 5 hari untuk cleared) karena penutupan bilateral lebih lambat dan tidak terstandar. Inilah salah satu alasan modal untuk eksposur bilateral lebih mahal: semakin lama MPOR, semakin besar add-on eksposur masa depan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Eksposur kami ke counterparty X nol — kontraknya rugi.” Kontrak yang rugi HARI INI bisa untung BESOK. Eksposur counterparty mencakup potential future exposure — bukan hanya mark-to-market saat ini. Inilah mengapa ada add-on.",
      },
      hints: [
        "Selalu tanya: ada ISDA + CSA + opini netting? Tiga-tiganya, bukan salah satu.",
        "Pisahkan: eksposur saat ini (replacement cost) vs eksposur masa depan (add-on).",
      ],
      reference: "Netting = untung-rugi saling hapus per counterparty. Butuh perjanjian.",
    },
    {
      id: "ccp",
      eyebrow: "Langkah 3 · Konsep",
      title: "CCP: hub yang memutus penularan",
      prose: [
        "Central Counterparty (CCP) menyisipkan dirinya di tengah: setiap transaksi bilateral dipecah menjadi dua — A vs CCP dan CCP vs B. Jaring kusut menjadi bintang: N peserta = N hubungan ke CCP. Manfaatnya: netting MULTILATERAL (untung ke B menghapus rugi ke C), standarisasi margin, dan — terpenting — kegagalan satu anggota tidak menular langsung ke yang lain.",
        "Tetapi ada harga: risiko terkonsentrasi di CCP. Jika CCP-nya sendiri gagal, semua ikut. Karena itu CCP diatur super-ketat: margin harian, dana default, stress test ekstrem, dan rencana pemulihan. CCP adalah 'terlalu penting untuk gagal' — dan didesain agar tidak gagal.",
        "Dua miskonsepsi. Satu: 'Clearing menghilangkan risiko.' Tidak — ia MENGUBAH risiko counterparty bilateral menjadi risiko ke CCP + risiko likuiditas (margin call). Risiko tidak hilang; ia berpindah bentuk. Dua: 'Semua derivatif wajib clearing.' Hanya yang terstandar dan likuid; sisanya tetap bilateral dengan aturan margin bilateral (SIMM).",
      ],
      figure: {
        svg: FIG_BILATERAL,
        alt: "Bilateral vs CCP: jaring kusut vs hub.",
        caption: "CCP = hub: netting multilateral, risiko terkonsentrasi & terkelola.",
      },
      formula: String.raw`\text{VM}_t = \text{MTM}_t - \text{MTM}_{t-1}`,
      formulaNote: "VM = variation margin (margin variasi); MTM = nilai mark-to-market portofolio. VM dibayar/diterima HARIAN sebesar perubahan nilai — ia mencegah akumulasi kerugian. IM (initial margin) = bantalan di muka untuk menutup kerugian selama margin period of risk (waktu yang dibutuhkan CCP melikuidasi posisi anggota gagal, mis. 5 hari). Interpretasi: VM = bayar perubahan kemarin; IM = siapkan untuk 5 hari terburuk ke depan.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Sudah clearing = tidak perlu pantau counterparty.” Anggota clearing tetap bisa gagal (dan pernah terjadi — lihat kasus Nasdaq Clearing 2018, trader listrik Einar Aas). Pantau konsentrasi posisi anggota CCP-mu. Kasus nyata: September 2018, Aas gagal memenuhi margin call — kerugiannya menghabiskan dua pertiga dana default komoditas Nordik, sisanya ditanggung anggota lain lewat mutualisasi. Pelajaran: bahkan di CCP yang diatur ketat, satu anggota dengan posisi terkonsentrasi bisa mengguncang seluruh sistem.",
      },
      hints: [
        "Tanya CCP-mu: berapa besar default fund? Kapan stress test terakhir?",
        "Margin call di CCP = kebutuhan likuiditas mendadak — siapkan buffer kas.",
      ],
      reference: "CCP = netting multilateral. Risiko berpindah, bukan hilang.",
    },
    {
      id: "waterfall",
      eyebrow: "Langkah 4 · Konsep",
      title: "Waterfall: urutan siapa menanggung",
      prose: [
        "Ketika anggota CCP gagal bayar, kerugiannya ditanggung berlapis (waterfall): (1) margin awal anggota yang gagal — jaminannya sendiri; (2) kontribusi dana default-nya — iurannya sendiri; (3) modal CCP (skin in the game) — CCP ikut 'merasakan sakit'; (4) dana default anggota LAIN — mutualisasi, semua ikut menanggung; (5) penarikan tambahan (assessment) — iuran darurat. Urutan ini adalah kontrak sosial CCP: yang gagal bayar duluan, CCP menunjukkan komitmen, baru risiko dibagi.",
        "Kepribadian waterfall: ia adalah 'asuransi berlapis dengan deductible'. Lapis 1-2 = deductible si gagal bayar; lapis 3 = komitmen pengelola; lapis 4-5 = gotong royong. Desainnya memastikan insentif benar: anggota tidak berani ambil risiko berlebihan karena dana mereka sendiri yang pertama habis.",
        "Dua miskonsepsi. Satu: 'Dana default = dana talangan.' Bukan — ia pre-funded (sudah disetor di muka), bukan janji. Dua: 'Skin in the game CCP besar.' Biasanya KECIL relatif terhadap dana anggota — fungsinya sinyal komitmen, bukan penanggung utama. Yang menanggung utama tetap anggota (mutualisasi).",
        "Satu detail yang sering luput: margin yang disetor anggota yang gagal mungkin TIDAK CUKUP karena dihitung dari skenario normal + stres moderat — bukan dari kegagalan itu sendiri yang sering disertai lompatan pasar ekstrem (wrong-way risk: saat anggota gagal, pasar biasanya sedang kacau). Itulah mengapa waterfall punya LIMA lapis, bukan satu: tiap lapis adalah pengakuan bahwa lapis sebelumnya bisa jebol.",
      ],
      figure: {
        svg: FIG_WATERFALL,
        alt: "Urutan waterfall default CCP.",
        caption: "Yang gagal bayar duluan, CCP ikut menanggung, baru dimutualisasi.",
      },
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Sebagai anggota CCP, bankmu ikut menanggung kegagalan anggota LAIN (lapis 4-5). Artinya: risiko CCP-mu termasuk risiko anggota terbesarnya. Pantau siapa anggota dominan di CCP tempatmu clearing — kegagalan mereka = iuran darurat untukmu.",
      },
      hints: [
        "Baca disclosure CCP (quantitative disclosures CPMI-IOSCO) — datanya publik.",
        "Hitung skenario: jika 2 anggota terbesar gagal, berapa assessment untuk bankmu?",
      ],
      reference: "Waterfall: margin gagal → dana gagal → modal CCP → dana bersama → assessment.",
    },
    {
      id: "lab-netting",
      eyebrow: "Langkah 5 · Lab",
      title: "Manfaat netting per counterparty",
      prose: [
        "Lima kontrak dengan dua counterparty. Nilai positif = bank untung (counterparty berutang ke bank). Hitung eksposur BRUTO (jumlah nilai absolut) vs NETO (jumlah aljabar, floored di nol) per counterparty — selisihnya adalah 'penghematan' netting.",
        "Perhatikan counterparty B: neto negatif → eksposur NOL (bank yang berutang, bukan sebaliknya). Eksposur counterparty hanya menghitung sisi bank untung — sisi bank rugi adalah risiko likuiditas, bukan risiko counterparty.",
      ],
      tasks: [
        { id: "t1", text: "Hitung bruto (Σ|v|) dan neto (max(Σv,0)) per counterparty" },
        { id: "t2", text: "Hitung penghematan = bruto - neto, cetak per counterparty" },
      ],
      expected: "A: bruto 100, neto 40, hemat 60\nB: bruto 50, neto 0, hemat 50",
      note: {
        title: "💡 Intuisi",
        body: "Netting mengubah Rp150 miliar eksposur bruto menjadi Rp40 miliar neto — penghematan 73%. Inilah mengapa ISDA Master Agreement disebut 'dokumen paling berharga di keuangan': satu tanda tangan menghemat miliaran modal.",
      },
      hints: [
        "Gunakan dict: bruto[cp] += abs(v); neto[cp] += v.",
        "Eksposur = max(neto, 0) — tidak ada eksposur negatif.",
      ],
      code: {
        starter: "# (counterparty, nilai; + = bank untung). JANGAN UBAH.\nkontrak = [(\"A\", 50), (\"A\", -30), (\"A\", 20), (\"B\", -40), (\"B\", -10)]\n\n# TULIS KODEMU: bruto vs neto per counterparty\nbruto, neto = {}, {}\nfor cp, v in kontrak:\n    bruto[cp] = bruto.get(cp, 0) + abs(v)\n    neto[cp] = neto.get(cp, 0) + v\nfor cp in sorted(bruto):\n    eksposur = \n    hemat = \n    print(f\"{cp}: bruto {bruto[cp]:.0f}, neto {eksposur:.0f}, hemat {hemat:.0f}\")\n",
        lockLines: 9,
        solution: "# (counterparty, nilai; + = bank untung). JANGAN UBAH.\nkontrak = [(\"A\", 50), (\"A\", -30), (\"A\", 20), (\"B\", -40), (\"B\", -10)]\n\n# TULIS KODEMU: bruto vs neto per counterparty\nbruto, neto = {}, {}\nfor cp, v in kontrak:\n    bruto[cp] = bruto.get(cp, 0) + abs(v)\n    neto[cp] = neto.get(cp, 0) + v\nfor cp in sorted(bruto):\n    eksposur = max(neto[cp], 0)\n    hemat = bruto[cp] - eksposur\n    print(f\"{cp}: bruto {bruto[cp]:.0f}, neto {eksposur:.0f}, hemat {hemat:.0f}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "A neto 40", msg: "50-30+20.", pattern: "A: bruto 100, neto 40, hemat 60" },
          { kind: "stdout_matches", task: "t1", label: "B neto 0", msg: "Neto negatif -> 0.", pattern: "B: bruto 50, neto 0, hemat 50" },
          { kind: "uses", task: "t1", label: "Pakai max()", msg: "Floor di nol.", token: "max" },
        ],
      },
      reference: "Eksposur = max(Σv, 0). Hemat = bruto − eksposur.",
    },
    {
      id: "lab-waterfall",
      eyebrow: "Langkah 6 · Lab",
      title: "Simulasi waterfall default",
      prose: [
        "Anggota CCP gagal dengan kerugian Rp150 miliar. Alokasikan berurutan ke lima lapis waterfall; tiap lapis menanggung sebesar kapasitasnya sampai kerugian habis. Cetak pemakaian tiap lapis dan sisa kerugian.",
        "Perhatikan: lapis 4 (dana anggota lain) ikut tersentuh — Rp50 miliar. Inilah mutualisasi: kegagalan orang lain memakan danamu. Eksperimen: naikkan kerugian ke 250 — lapis 5 (assessment) ikut tersentuh. Berapa iuran daruratnya?",
      ],
      tasks: [
        { id: "t1", text: "Alokasikan kerugian berurutan ke tiap lapis waterfall" },
        { id: "t2", text: "Cetak pemakaian tiap lapis; nyatakan Lunas / Kurang" },
      ],
      expected: "Margin awal anggota gagal: pakai 40, sisa rugi 110\nDana default anggota gagal: pakai 25, sisa rugi 85\nModal CCP: pakai 15, sisa rugi 70\nDana default anggota lain: pakai 50, sisa rugi 20\nAssessment: pakai 20, sisa rugi 0\nLunas",
      note: {
        title: "💡 Intuisi",
        body: "Waterfall adalah algoritma keadilan: yang menyebabkan menanggung paling banyak, pengelola ikut merasakan, baru beban dibagi. Setiap lapis yang tersentuh = sinyal bahwa lapis sebelumnya tidak cukup — desainnya memang berlapis karena kegagalan berlapis.",
      },
      hints: [
        "pakai = min(sisa, kapasitas); sisa -= pakai.",
        "Berhenti bila sisa 0.",
      ],
      code: {
        starter: "# (lapis, kapasitas Rp miliar). JANGAN UBAH.\nkerugian = 150\nwaterfall = [(\"Margin awal anggota gagal\", 40), (\"Dana default anggota gagal\", 25),\n              (\"Modal CCP\", 15), (\"Dana default anggota lain\", 50), (\"Assessment\", 60)]\n\n# TULIS KODEMU: alokasi berurutan\nsisa = kerugian\nfor nama, kapasitas in waterfall:\n    pakai = \n    sisa -= pakai\n    print(f\"{nama}: pakai {pakai}, sisa rugi {sisa}\")\n    if sisa == 0:\n        break\nprint(\"Lunas\" if sisa == 0 else f\"Kurang {sisa}\")\n",
        lockLines: 10,
        solution: "# (lapis, kapasitas Rp miliar). JANGAN UBAH.\nkerugian = 150\nwaterfall = [(\"Margin awal anggota gagal\", 40), (\"Dana default anggota gagal\", 25),\n              (\"Modal CCP\", 15), (\"Dana default anggota lain\", 50), (\"Assessment\", 60)]\n\n# TULIS KODEMU: alokasi berurutan\nsisa = kerugian\nfor nama, kapasitas in waterfall:\n    pakai = min(sisa, kapasitas)\n    sisa -= pakai\n    print(f\"{nama}: pakai {pakai}, sisa rugi {sisa}\")\n    if sisa == 0:\n        break\nprint(\"Lunas\" if sisa == 0 else f\"Kurang {sisa}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Lapis 1 pakai 40", msg: "Margin gagal bayar duluan.", pattern: "Margin awal anggota gagal: pakai 40, sisa rugi 110" },
          { kind: "stdout_matches", task: "t1", label: "Lapis 4 tersentuh", msg: "Mutualisasi Rp50 miliar.", pattern: "Dana default anggota lain: pakai 50, sisa rugi 20" },
          { kind: "stdout_matches", task: "t2", label: "Lunas", msg: "150 habis di 5 lapis.", pattern: "Lunas" },
        ],
      },
      reference: "Alokasi = min(sisa, kapasitas) berurutan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kontrak derivatif baru: clearing atau bilateral",
      prose: [
        "Satu: apakah kontrak terstandar & likuid → ya = clearing via CCP (wajib regulator untuk kelas tertentu). Dua: tidak terstandar → bilateral, TETAPI wajib: ISDA + CSA + opini netting + margin bilateral (SIMM). Tiga: hitung eksposur dengan benar — cleared: eksposur ke CCP (kecil, terkolateralisasi); bilateral: SA-CCR (replacement cost + add-on). Empat: pantau konsentrasi — ke CCP (berapa % eksposurmu di satu CCP?) dan ke counterparty bilateral terbesar.",
        "Aturan praktis 10 detik: standar = clearing. Non-standar = bilateral dengan tiga dokumen + margin. Tidak ada opsi ketiga 'tanpa jaminan'. Keputusan ini didokumentasikan dan ditinjau tiap tahun — pasar berubah, kontrak berubah, keputusan harus ikut berubah. Analis junior: kuasai alur ini sampai bisa menjelaskannya tanpa catatan — ia adalah fondasi setiap diskusi risiko counterparty.",
        "Satu jebakan: 'netting set' yang salah. Netting hanya berlaku dalam satu perjanjian dengan satu counterparty — jangan campur eksposur antar counterparty atau antar perjanjian. Kesalahan ini membuat eksposur terlihat kecil padahal tidak.",
        "Lima: uji ketahanan operasional. Tanyakan: bila CCP mengumumkan peningkatan margin 50% besok pagi (seperti yang terjadi saat volatilitas ekstrem), apakah treasury-mu punya kasnya? Margin call CCP tidak bisa ditawar dan jatuh tempo dalam hitungan jam. Simulasi kebutuhan likuiditas margin — bukan hanya kecukupan modal — adalah bagian yang sering dilupakan dari manajemen risiko CCP.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan clearing vs bilateral mempengaruhi kebutuhan modal (RWA) bank secara material: eksposur ke CCP qualified berbobot risiko 2%, bilateral bisa 20-50%+. Struktur yang benar = modal yang efisien. Analis yang paham ini menghemat modal bank.",
      },
      reference: "Standar = CCP. Non-standar = ISDA+CSA+opini+margin. Pantau konsentrasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bank Artha Dana: Senin yang menentukan",
      prose: [
        "Kembali ke cerita pembuka. Fakta lengkap: 40 kontrak swap dengan dealer yang gagal — 25 kontrak untung total Rp50 miliar, 15 kontrak rugi total Rp30 miliar. Skenario A: bilateral dengan ISDA netting yang enforceable. Skenario B: bilateral TANPA netting (perjanjian kedaluwarsa, belum diperbarui). Skenario C: cleared via CCP.",
        "Pertanyaan: kerugian bank di tiap skenario? Pembahasan: (A) Neto = 50 − 30 = Rp20 miliar — bank mengklaim Rp20 miliar ke kurator (mungkin pulih sebagian). (B) Bank WAJIB bayar Rp30 miliar ke kurator, dan Rp50 miliar menjadi klaim tanpa jaminan (pulih mungkin 10-20 sen per rupiah) — rugi efektif bisa Rp40+ miliar. (C) Posisi neto Rp20 miliar dilindungi margin yang sudah disetor + waterfall CCP — rugi mendekati NOL. Pelajaran: dokumen netting yang kedaluwarsa (skenario B) adalah bom waktu Rp40 miliar. Peran analis: pastikan tidak ada perjanjian yang kedaluwarsa.",
        "Refleksi untuk karirmu: infrastruktur derivatif adalah topik yang membuat analis junior terlihat senior. Kebanyakan kandidat bisa menghitung VaR; sedikit yang bisa menjelaskan mengapa netting menghemat modal atau bagaimana waterfall bekerja. Kuasai lesson ini, dan kamu punya jawaban untuk pertanyaan wawancara tersulit di meja market risk.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Buat register perjanjian: tiap ISDA/CSA dicatat tanggal kedaluwarsa dengan peringatan 90 hari. Sederhana, membosankan, dan menyelamatkan Rp40 miliar. Banyak kegagalan risiko bukan karena model canggih yang salah — melainkan karena administrasi yang lalai.",
      },
      reference: "Netting kedaluwarsa = bom waktu. Register + peringatan 90 hari.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "Bilateral vs CCP = siapa menanggung gagal bayar: tanpa netting agreement yang kuat, bank harus membayar penuh ke kurator sementara tagihannya antre jadi kreditor.",
        "Netting menyelamatkan bilateral: kontrak untung dan rugi dalam satu netting set saling hapus per counterparty; selalu tanya ISDA + CSA + opini netting — tiga-tiganya, bukan salah satu.",
        "Kontrak yang rugi HARI INI bisa untung BESOK: eksposur counterparty berubah seiring pasar — inilah alasan margin period of risk (MPOR).",
        "Air terjun CCP (default waterfall): margin + dana default anggota yang gagal → dana CCP sendiri → assessment tambahan ke anggota; prinsipnya yang gagal bayar duluan, CCP ikut menanggung, baru dimutualisasi.",
        "Pasca-2008 G20 mewajibkan derivatif OTC terstandar di-clearing via CCP; derivatif non-standar (exotic, bespoke) tetap bilateral.",
      ],
      quiz: [
        {
          q: "Tanpa netting agreement, bank dengan kontrak untung Rp50M dan rugi Rp30M ke counterparty yang gagal akan:",
          options: [
            { text: "Membayar penuh Rp30M ke kurator, Rp50M menjadi klaim tanpa jaminan", why: "Benar: tanpa netting, kewajiban dan hak diperlakukan terpisah.", correct: true },
            { text: "Otomatis neto menjadi Rp20M", why: "Netting tidak otomatis — butuh perjanjian yang enforceable." },
            { text: "Tidak membayar apa-apa karena counterparty yang gagal", why: "Kewajiban bayarmu tetap ada; yang hilang adalah hak tagihmu." },
            { text: "Menerima Rp50M penuh dari kurator", why: "Klaim tanpa jaminan pulih sebagian kecil, bukan penuh." },
          ],
        },
        {
          q: "Urutan waterfall CCP yang benar:",
          options: [
            { text: "Margin anggota gagal → dana default-nya → modal CCP → dana anggota lain → assessment", why: "Benar: yang gagal bayar duluan, CCP tunjukkan komitmen, baru mutualisasi.", correct: true },
            { text: "Dana anggota lain → margin anggota gagal → modal CCP → assessment", why: "Terbalik: dana sendiri dulu sebelum dana bersama." },
            { text: "Modal CCP → margin anggota gagal → dana anggota lain", why: "Modal CCP (skin in the game) di lapis 3, bukan pertama." },
            { text: "Assessment → dana default → margin → modal CCP", why: "Terbalik total; assessment adalah lapis terakhir." },
          ],
        },
        {
          q: "Apa yang TIDAK dihilangkan oleh central clearing?",
          options: [
            { text: "Risiko — ia berubah menjadi eksposur ke CCP + risiko likuiditas margin call", why: "Benar: clearing memindahkan dan mengonsentrasi, bukan menghilangkan.", correct: true },
            { text: "Kebutuhan perjanjian ISDA", why: "ISDA tetap relevan untuk bilateral; clearing tidak menghapusnya sepenuhnya." },
            { text: "Kewajiban membayar margin", why: "Margin justru WAJIB di CCP — harian." },
            { text: "Risiko gagal bayar bilateral", why: "Ini yang DIUBAH menjadi risiko ke CCP — benar dihilangkan bentuk bilateralnya." },
          ],
        },
        {
          q: "Mengapa bank ikut menanggung kegagalan anggota CCP lain?",
          options: [
            { text: "Mutualisasi: dana default bersama dan assessment dibayar semua anggota", why: "Benar: lapis 4-5 waterfall = gotong royong semua anggota.", correct: true },
            { text: "Karena bank diwajibkan membeli saham CCP", why: "Bukan saham; melainkan kontribusi dana default + assessment." },
            { text: "Karena regulator memaksa bank menalangi", why: "Bukan paksaan regulator; melainkan desain kontrak CCP." },
            { text: "Tidak ikut — masing-masing anggota hanya menanggung risikonya sendiri", why: "Salah: mutualisasi adalah inti CCP." },
          ],
        },
        {
          q: "Derivatif non-standar (bespoke) yang tepat:",
          options: [
            { text: "Tetap bilateral dengan ISDA + CSA + opini netting + margin bilateral", why: "Benar: non-standar tidak bisa clearing tetapi tetap butuh pengaman.", correct: true },
            { text: "Dipaksakan clearing via CCP", why: "CCP hanya untuk yang terstandar dan likuid." },
            { text: "Tidak perlu jaminan karena nilainya kecil", why: "Tidak ada opsi tanpa jaminan; nilai kecil tetap berisiko." },
            { text: "Cukup perjanjian lisan dengan counterparty terpercaya", why: "Derivatif butuh dokumen tertulis + opini hukum." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Eksposur ke CCP = nol karena sudah dijamin margin.” Margin menutupi pergerakan normal, bukan lompatan ekstrem + kegagalan bersamaan. Eksposur ke CCP qualified memang kecil (bobot 2%) — tetapi tidak nol, dan risiko assessment tetap ada.",
      },
      hints: [
        "Uji cepat: sebutkan 5 lapis waterfall berurutan tanpa melihat catatan.",
        "Ingat angka mini-case: A=20, B=40+, C≈0 — dokumen menentukan nasib.",
      ],
      reference: "Dokumen + margin + waterfall = infrastruktur kepercayaan.",
    },
  ],
};
