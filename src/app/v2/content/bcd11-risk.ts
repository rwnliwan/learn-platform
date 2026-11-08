import type { V2Lesson } from "../lib/types";

// Skor risiko 3 dompet: 72.5 HIGH, 45 MEDIUM, 2.5 LOW + ambang.
const RISK_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Skor risiko tiga dompet: 0xw1 skor 72,5 HIGH, 0xw3 skor 45 MEDIUM, 0xw2 skor 2,5 LOW, dengan ambang 30 dan 60.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="30" x2="440" y2="30"/><line x1="60" y1="80" x2="440" y2="80"/><line x1="60" y1="130" x2="440" y2="130"/><line x1="60" y1="180" x2="440" y2="180"/></g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="34">100</text><text x="54" y="84">60</text><text x="54" y="134">30</text><text x="54" y="184">0</text></g>
<line x1="60" y1="102" x2="440" y2="102" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="436" y="96" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">ambang HIGH 60</text>
<line x1="60" y1="138" x2="440" y2="138" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="436" y="132" text-anchor="end" font-size="10" fill="var(--c1)" font-family="var(--font-ui)">ambang MEDIUM 30</text>
<rect x="110" y="65" width="70" height="115" fill="var(--c4)" opacity="0.7"/><text x="145" y="58" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">72,5</text>
<text x="145" y="198" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0xw1</text>
<rect x="230" y="117" width="70" height="63" fill="var(--c1)" opacity="0.7"/><text x="265" y="110" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">45</text>
<text x="265" y="198" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0xw3</text>
<rect x="350" y="176" width="70" height="4" fill="var(--chart-text)" opacity="0.7"/><text x="385" y="168" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2,5</text>
<text x="385" y="198" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0xw2</text>
<g font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600"><text x="145" y="214" text-anchor="middle" fill="var(--c4)">HIGH</text><text x="265" y="214" text-anchor="middle" fill="var(--c1)">MEDIUM</text><text x="385" y="214" text-anchor="middle">LOW</text></g>
</svg>`;

const BCD11_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Total biaya per ambang: T=40 Rp14 miliar, T=60 Rp51 miliar, T=80 Rp150,25 miliar."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">75</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">150</text><rect x="72.5" y="165.1" width="86.4" height="14.9" rx="3" fill="var(--c1)"/><text x="115.7" y="159.1" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp14 M</text><text x="115.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">T=40</text><rect x="211.8" y="125.7" width="86.4" height="54.3" rx="3" fill="var(--c3)"/><text x="255.0" y="119.7" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp51 M</text><text x="255.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">T=60</text><rect x="351.1" y="20.0" width="86.4" height="160.0" rx="3" fill="var(--c4)"/><text x="394.3" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp150 M</text><text x="394.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">T=80</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">miliar rupiah</text></svg>`;

export const bcd11: V2Lesson = {
  slug: "bcd11-risk",
  track: "Blockchain Data Scientist",
  module: "Investigasi & Risiko",
  title: "BCD11 — Risk Scoring Wallet & AML On-Chain",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Skor 72/100 — dan pemiliknya mungkin korban",
      prose: [
        "Exchange menerima deposit 50 ETH dari dompet 0xw1. Sistem risk scoring memberi skor 72/100: HIGH. Dana ditahan. Pemiliknya — seorang freelancer — protes keras: 'Itu bayaran klien saya!' Investigasi: kliennya membayar via mixer 'untuk privasi'. Freelancer tidak tahu apa-apa tentang mixer, sanksi, atau hop. Ia korban ketidaktahuan, bukan pelaku.",
        "Twist-nya: skornya BENAR (mixer interaction = sinyal risiko valid) DAN keputusannya SALAH (menahan dana orang tak bersalah tanpa jalur verifikasi). Risk scoring yang baik bukan tentang angka — tentang KEPUTUSAN apa yang diambil pada tiap angka. Skor tanpa playbook = senjata tanpa aturan tembak.",
        "Lesson ini: membangun skor risiko wallet dari fitur on-chain + menghubungkannya ke kerangka AML tradisional (CDD/EDD). Tujuan: (1) merancang fitur risiko address; (2) menghitung skor terbobot + ambang; (3) memetakan skor ke tindakan ala AML. Peta: cerita → fitur → lab skor → ambang & tindakan → AML tradisional → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung skor risiko terbobot dari lima fitur; (2) mengkalibrasi ambang HIGH/MEDIUM/LOW dari data; (3) memetakan skor ke playbook tindakan (CDD/EDD); (4) menjelaskan kasus freelancer: skor benar, keputusan salah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Skor tinggi = blokir.\" Skor adalah PROBABILITAS prioritas, bukan vonis. Skor 72 dengan penjelasan 'satu interaksi mixer 2 hop' butuh perlakuan berbeda dari skor 72 dengan 'langsung dari address peretasan'. Blokir otomatis berdasar angka = memblokir korban seperti freelancer di cerita. Selalu tampilkan KONTRIBUTOR skor (fitur apa yang menyumbang), bukan cuma angkanya.",
      },
      reference: "Skor = prioritas + kontributor, bukan vonis. Tampilkan 'mengapa', bukan cuma angka.",
    },
    {
      id: "fitur",
      eyebrow: "Langkah 2 · Fitur risiko",
      title: "Lima fitur yang membentuk skor",
      prose: [
        "Satu — Kedekatan sanksi/mixer (hop distance): 1 hop dari mixer yang disanksi = 40 poin; 2 hop = 20; 3 hop = 10. Ini fitur terberat — regulator peduli ini.",
        "Dua — Interaksi mixer langsung: pernah deposit/withdraw ke mixer yang diketahui = 40 poin penuh. Beda dengan kedekatan: ini perilaku SENDIRI, bukan tetangga.",
        "Tiga — Umur & pola address: address baru (< 30 hari) + volume besar + langsung ke exchange = pola 'burner' pencucian. 10 poin.",
        "Empat — Pangsa volume berisiko: % volume dari counterparty berlabel jahat. 25 poin × pangsa.",
        "Lima — Anomali perilaku: lonjakan tiba-tiba setelah dorman lama, round-trip cepat, struktur corong (bcd7, bcd10). Skor tambahan 0–15.",
        "Prinsip fitur: setiap fitur harus (a) bisa dihitung dari data on-chain + label, (b) punya penjelasan bisnis satu kalimat, (c) tidak bisa dijelaskan oleh perilaku normal yang umum. Fitur yang menghukum 'aktif di malam hari' = diskriminasi pola tidur, bukan deteksi risiko.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: fitur adalah teori kejahatan yang bisa dihitung",
        body: "Setiap fitur menjawab 'teori' tentang BAGAIMANA kejahatan bekerja: 'pencuci memecah jejak via mixer' → fitur kedekatan mixer. 'Pelaku memakai address sekali pakai' → fitur umur address. Jika kamu tidak bisa menjelaskan TEORI di balik fitur dalam satu kalimat, fitur itu tidak layak masuk skor — ia hanya korelasi yang suatu hari akan menghukummu (mis. menghukum pengguna privacy yang sah). Fitur tanpa teori = takhayul berangka.",
      },
      reference: "Fitur = teori kejahatan yang terukur. Satu kalimat penjelasan per fitur, wajib.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 3 · Lab",
      title: "Menghitung skor terbobot",
      prose: [
        "Bobot: mixer=40, sanction_hop=25, new_addr=10, highrisk_share=25. Skor = Σ bobot × nilai fitur (0–1). Ambang: ≥ 60 HIGH, ≥ 30 MEDIUM, else LOW.",
        "Tiga dompet sintetis: 0xw1 = {mixer:1.0, sanction_hop:0.0, new_addr:1.0, highrisk_share:0.9}; 0xw2 = {0,0,0,0.1}; 0xw3 = {mixer:0.0, sanction_hop:1.0, new_addr:0.5, highrisk_share:0.6}.",
        "Tugasmu: hitung skor tiap dompet (1 desimal) + labelnya, lalu cetak.",
      ],
      formula: String.raw`S = \sum_{i} w_i \cdot f_i \qquad \text{HIGH} \iff S \ge 60, \; \text{MEDIUM} \iff S \ge 30`,
      formulaNote: "w_i = bobot fitur i (total 100); f_i = nilai fitur ternormalisasi 0–1. Contoh: mixer langsung (f=1, w=40) menyumbang 40 poin penuh.",
      figure: {
        svg: RISK_SVG,
        alt: "Skor risiko tiga dompet: 0xw1 skor 72,5 HIGH, 0xw3 skor 45 MEDIUM, 0xw2 skor 2,5 LOW, dengan ambang 30 dan 60.",
        caption: "Tiga dompet, tiga zona: 72,5 (HIGH — mixer langsung), 45 (MEDIUM — dekat sanksi), 2,5 (LOW — bersih). Cara membaca: tiap kartu = satu dompet; angka = skor 0–100; warna = zona (merah/kuning/hijau); label = fitur dominan. Interpretasi: 72,5 butuh EDD manual < 24 jam (BUKAN auto-freeze — ingat freelancer 0xw1!); 45 = pantau; 2,5 = lewatkan. Skor = prioritas antrean manusia.",
      },
      tasks: [
        { id: "t1", text: "Hitung `scores` = dict address → skor (1 desimal)" },
        { id: "t2", text: "Beri `labels` = dict address → HIGH/MEDIUM/LOW" },
        { id: "t3", text: "Cetak skor + label tiap dompet" },
      ],
      expected: "0xw1: 72.5 HIGH  0xw3: 45.0 MEDIUM  0xw2: 2.5 LOW",
      note: {
        title: "💡 Intuisi: baca kontributor, bukan cuma total",
        body: "0xw1 (72,5) dan hipotetis 0xw4 (72,5 dari sanction_hop penuh + highrisk_share) punya skor SAMA tetapi makna BERBEDA: yang satu 'pernah pakai mixer' (mungkin freelancer), yang lain 'berhubungan langsung dengan sanksi' (darurat). Skor agregat menyembunyikan cerita. Dashboard yang benar menampilkan skor + 2–3 kontributor terbesar. Analis yang hanya melihat angka = pilot yang hanya melihat altimeter tanpa tahu mesin mana yang mati.",
      },
      hints: [
        "score = 40*mixer + 25*sanction_hop + 10*new_addr + 25*highrisk_share.",
        "label: >= 60 HIGH; >= 30 MEDIUM; else LOW.",
        "Bulatkan: round(score, 1).",
      ],
      code: {
        starter: `W = {"mixer": 40, "sanction_hop": 25, "new_addr": 10, "highrisk_share": 25}\naddrs = {\n    "0xw1": {"mixer": 1.0, "sanction_hop": 0.0, "new_addr": 1.0, "highrisk_share": 0.9},\n    "0xw2": {"mixer": 0.0, "sanction_hop": 0.0, "new_addr": 0.0, "highrisk_share": 0.1},\n    "0xw3": {"mixer": 0.0, "sanction_hop": 1.0, "new_addr": 0.5, "highrisk_share": 0.6},\n}\n\n# TULIS KODEMU\ndef label(s):\n    return \nscores = {}\nlabels = {}\nfor a, f in addrs.items():\n    s = \n    scores[a] = round(s, 1)\n    labels[a] = label(s)\n\nfor a in ["0xw1", "0xw3", "0xw2"]:\n    print(f"{a}: {scores[a]} {labels[a]}", end="  ")\nprint()`,
        lockLines: 7,
        solution: `W = {"mixer": 40, "sanction_hop": 25, "new_addr": 10, "highrisk_share": 25}\naddrs = {\n    "0xw1": {"mixer": 1.0, "sanction_hop": 0.0, "new_addr": 1.0, "highrisk_share": 0.9},\n    "0xw2": {"mixer": 0.0, "sanction_hop": 0.0, "new_addr": 0.0, "highrisk_share": 0.1},\n    "0xw3": {"mixer": 0.0, "sanction_hop": 1.0, "new_addr": 0.5, "highrisk_share": 0.6},\n}\n\n# TULIS KODEMU\ndef label(s):\n    return "HIGH" if s >= 60 else ("MEDIUM" if s >= 30 else "LOW")\nscores = {}\nlabels = {}\nfor a, f in addrs.items():\n    s = W["mixer"]*f["mixer"] + W["sanction_hop"]*f["sanction_hop"] + W["new_addr"]*f["new_addr"] + W["highrisk_share"]*f["highrisk_share"]\n    scores[a] = round(s, 1)\n    labels[a] = label(s)\n\nfor a in ["0xw1", "0xw3", "0xw2"]:\n    print(f"{a}: {scores[a]} {labels[a]}", end="  ")\nprint()`,
        checks: [
          { kind: "equal", task: "t1", name: "scores", value: {"0xw1": 72.5, "0xw3": 45.0, "0xw2": 2.5}, tol: 0.05, label: "Skor: 72.5 / 45.0 / 2.5", msg: "Σ w×f per dompet. 0xw1: 40+0+10+22.5." },
          { kind: "equal", task: "t2", name: "labels", value: {"0xw1": "HIGH", "0xw3": "MEDIUM", "0xw2": "LOW"}, tol: 0, label: "Label: HIGH/MEDIUM/LOW", msg: "Ambang 60 dan 30." },
          { kind: "stdout_matches", task: "t3", pattern: "0xw1: 72\\.5 HIGH\\s+0xw3: 45\\.0 MEDIUM\\s+0xw2: 2\\.5 LOW", label: "Output menampilkan ketiganya", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Skor = Σ bobot × fitur. Tampilkan kontributor terbesar bersama skor.",
    },
    {
      id: "ambang",
      eyebrow: "Langkah 4 · Ambang & tindakan",
      title: "Dari angka ke playbook",
      prose: [
        "Skor tanpa tindakan = dekorasi. Playbook standar. LOW (< 30): proses normal, catat skor. MEDIUM (30–59): enhanced review — minta sumber dana tertulis, tahan penarikan besar 24 jam, eskalasi ke analis.",
        "HIGH (≥ 60): tahan transaksi + investigasi manusia + lapor ke MLRO (Money Laundering Reporting Officer). JANGAN blokir permanen otomatis — ingat freelancer 0xw1: ia butuh JALUR VERIFIKASI (bukti invoice, KYC ulang), bukan pintu tertutup.",
        "Kalibrasi ambang: ambang 60/30 di lab adalah CONTOH. Ambang produksi dikalibrasi dari data: pilih ambang yang memberi false positive rate yang bisa ditangani tim (mis. 50 review/hari), bukan yang 'terlihat bagus'. Ambang tanpa kalibrasi = alert fatigue → analis mengabaikan SEMUA alert → sistem mati.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Ambang 60 sudah terbukti di tempat lain, pakai saja.\" Ambang TIDAK transferable: basis nasabah, yurisdiksi, dan profil risiko tiap institusi berbeda. Ambang tetangga yang 'terbukti' bisa memberimu 500 alert/hari (tim tenggelam) atau 0 alert (buta). Kalibrasi = jalankan skor di data historismu, plot distribusi, pilih ambang berdasar kapasitas review. Tidak ada jalan pintas.",
      },
      reference: "LOW = proses; MEDIUM = review + tahan 24 jam; HIGH = tahan + investigasi + MLRO. Kalibrasi ambang dari data sendiri.",
    },
    {
      id: "aml-tradisional",
      eyebrow: "Langkah 5 · Jembatan AML",
      title: "CDD, EDD, dan padanannya di chain",
      prose: [
        "AML tradisional: CDD (Customer Due Diligence) = kenali nasabah saat onboarding; EDD (Enhanced DD) = gali lebih dalam untuk risiko tinggi; monitoring ongoing; STR (Suspicious Transaction Report) ke PPATK/FIU.",
        "Padanan on-chain: CDD = screening address saat deposit (skor + label); EDD = untuk skor MEDIUM/HIGH — telusuri hop (bcd10), minta sumber dana; monitoring = scheduled query + alert lonjakan (bcd9); STR = laporan dengan bukti graf + metodologi hop yang didokumentasikan.",
        "Dua perbedaan fundamental. Satu: di bank, identitas DIBERIKAN (KTP); di chain, identitas DITURUNKAN (cluster + label) — dengan ketidakpastian. Dua: di bank, transaksi privat; di chain, bukti publik permanen — STR on-chain bisa dilampiri graf yang bisa diverifikasi siapa pun. Kekuatan dan kelemahan bertukar tempat.",
        "Untuk analis risiko yang datang dari perbankan: skill AML-mu (menilai red flag, menulis STR, berpikir seperti auditor) 80% transferable. Yang baru hanya 20%: membaca chain. Itu sebabnya track ini ada.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Travel rule (FATF) mewajibkan info pengirim/penerima menyertai transfer — di kripto ini berarti exchange harus saling bertukar data nasabah untuk transfer antar-VASP. Analis on-chain di exchange tidak hanya men-skor address, tetapi memastikan data travel rule lengkap. Transfer tanpa data = temuan audit.",
      },
      reference: "CDD→screening, EDD→telusuri hop, monitoring→alert, STR→lapor + graf. 80% skill AML transferable.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Playbook skor → tindakan",
      prose: [
        "Skenario 1 — Deposit skor LOW dari address lama bervolume wajar → proses normal. Catat skor untuk tren.",
        "Skenario 2 — Deposit skor MEDIUM (45, seperti 0xw3) → tahan penarikan 24 jam + minta sumber dana tertulis + catat. Jika dokumen masuk akal → lepas dengan catatan.",
        "Skenario 3 — Deposit skor HIGH dari mixer langsung (72,5, seperti 0xw1) → tahan + investigasi manusia. Ada jalur verifikasi (invoice/KYC) SEBELUM keputusan final. Jangan vonis otomatis.",
        "Skenario 4 — Skor HIGH + kedekatan sanksi langsung → eskalasi MLRO + pertimbangkan STR. Ini zona regulator — dokumentasi harus sempurna.",
        "Aturan praktis 10 detik: (1) lihat kontributor, bukan cuma angka; (2) cocokkan dengan playbook zona; (3) selalu ada jalur verifikasi untuk nasabah; (4) catat: skor, kontributor, keputusan, siapa. Tanpa catatan = tidak terjadi (kata auditor).",
      ],
      tasks: [],
      reference: "Kontributor → zona playbook → jalur verifikasi → catatan lengkap.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Freelancer 0xw1: skor benar, keputusan salah",
      prose: [
        "Fakta: 0xw1 skor 72,5 (mixer langsung 40 + address baru 10 + highrisk_share 22,5). Sistem menahan 50 ETH. Freelancer protes dengan invoice klien Rp800 juta. Investigasi: klien membayar via mixer 'demi privasi' — praktik umum di negaranya, bukan kejahatan. Dana dilepas setelah 6 hari. Freelancer pindah ke exchange kompetitor + menulis thread viral. Biaya: satu nasabah + reputasi.",
        "Apa yang salah? BUKAN skornya (sinyal valid) — melainkan: (a) tidak ada jalur verifikasi cepat (6 hari untuk cek invoice = tidak masuk akal); (b) keputusan 'tahan' tanpa SLA; (c) tidak ada penjelasan ke nasabah TENTANG APA yang dicurigai (ia tidak tahu mixer itu masalah).",
        "Pembahasan: (a) playbook HIGH harus punya SLA verifikasi (mis. 24 jam) + template komunikasi; (b) pertimbangkan 'skor dengan konteks': freelancer + invoice + klien teridentifikasi = turunkan ke MEDIUM dengan monitoring; (c) pelajaran desain: sistem risiko yang tidak punya jalan keluar untuk orang tak bersalah = sistem yang memproduksi musuh.",
      ],
      tasks: [],
      reference: "Skor valid ≠ keputusan valid. Playbook butuh SLA + jalur verifikasi + komunikasi.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Kalibrasi ambang: presisi vs cakupan",
      prose: [
        "Skor 72,5 = HIGH, 45 = MEDIUM, 2,5 = LOW (lesson ini). Tapi dari mana angka 60 dan 30? Jika asal tebak, begini akibatnya. Data 10.000 wallet yang sudah dilabeli (900 penjahat, 9.100 bersih): ambang HIGH=60 → 800 benar positif + 200 salah positif. Presisi = 800/1000 = 80%. Recall = 800/900 = 89%. Jika ambang dinaikkan ke 80: 600 TP + 50 FP → presisi 92%, recall 67%. Jika diturunkan ke 40: 880 TP + 800 FP → presisi 52%, recall 98%. Tiga ambang, tiga bisnis berbeda.",
        "Biaya tiap sel: FP (bersih dibekukan) = Rp5 juta (CS + kompensasi + churn). FN (penjahat lolos) = Rp500 juta (rata-rata kerugian per kasus). Total biaya ambang 60: 200×Rp5jt + 100×Rp500jt = Rp1M + Rp50M = Rp51 miliar. Ambang 80: 50×Rp5jt + 300×Rp500jt = Rp0,25M + Rp150M = Rp150,25 miliar. Ambang 40: 800×Rp5jt + 20×Rp500jt = Rp4M + Rp10M = Rp14 miliar. PEMENANG: ambang 40! Meski presisinya hanya 52% (`setengah salah`), total biayanya terkecil karena FN 100x lebih mahal dari FP. Ambang optimal = yang MEMINIMUMKAN BIAYA, bukan yang presisinya cantik.",
        "Inilah pelajaran yang melawan intuisi: ambang `longgar` (40) dengan 800 false positive MENGALAHKAN ambang `ketat` (80) yang presisi 92%. Karena di dunia AML, satu penjahat lolos (Rp500jt) = 100 user innocent dibekukan (100 × Rp5jt). Kecuali bisnis-mu adalah exchange ritel yang hidup dari kepuasan user (FP = churn massal = bangkrut!), maka hitung ulang dengan biaya FP yang lebih tinggi. Tidak ada ambang universal — hanya ada ambang yang dikalibrasi dari BIAYA-MU.",
        "Cara kalibrasi yang benar (6 langkah): (1) kumpulkan 5.000–10.000 wallet berlabel (historis investigasi + intel); (2) hitung skor untuk semua; (3) plot distribusi skor penjahat vs bersih (harusnya dua gundukan terpisah; jika menumpuk = fiturmu kurang); (4) tetapkan biaya FP dan FN dari data bisnis; (5) pilih ambang yang meminimumkan total biaya; (6) VALIDASI pada data 3 bulan berikutnya (out-of-time!) — ambang yang overfit ke masa lalu = ambang yang salah untuk masa depan. Ulangi tiap kuartal (pola penjahat berubah!).",
        "Kasus freelancer 0xw1 (mini-case lesson): skor 72,5 HIGH — tapi ia korban (menerima bayaran dari mixer tanpa tahu). Skornya BENAR (proximity ke mixer memang tinggi), keputusannya SALAH (langsung bekukan). Pelajaran kalibrasi: skor = INPUT untuk manusia, bukan VONIS otomatis. Playbook HIGH: EDD manual < 24 jam (bukan auto-freeze!). Auto-freeze hanya untuk skor > 90 + pola jelas (drain langsung). 72,5 = `periksa manusia`, bukan `hukum algoritma`. Beda 17,5 poin = beda perlakuan.",
        "Terakhir, waspadai `skor yang menua`: model yang dikalibrasi 2024 dengan pola mixer Tornado mungkin tidak menangkap pola 2026 (bridge hop + DEX aggregator). Tandanya: presisi turun 3 kuartal berturut-turut. Obatnya: retrain fitur + kalibrasi ulang (MLOps8!). Skor risiko = model ML = butuh MLOps juga. Ironis tapi benar: sistem yang menilai risiko punya risiko model-nya sendiri.",
      ],
      formula: String.raw`\text{ambang}^* = \arg\min_T \left( FP(T) \cdot C_{FP} + FN(T) \cdot C_{FN} \right)`,
      formulaNote: "ambang* = ambang optimal; FP(T)/FN(T) = jumlah salah pada ambang T (dari data berlabel); C_FP/C_FN = biaya satu kesalahan. Pilih T yang meminimumkan TOTAL BIAYA — bukan yang presisinya tertinggi. Kalibrasi ulang tiap kuartal.",
      figure: {
        svg: BCD11_DEEP_SVG,
        alt: "Diagram batang total biaya: ambang 40 = Rp14 miliar (termurah), 60 = Rp51 miliar, 80 = Rp150 miliar.",
        caption: "Cara membaca: tinggi batang = total biaya (FP×Rp5jt + FN×Rp500jt) per ambang. Interpretasi: ambang `longgar` 40 (presisi hanya 52%!) total biayanya TERKECIL — karena satu penjahat lolos 100x lebih mahal dari satu user dibekukan. Ambang optimal = minimasi biaya, bukan maksimasi presisi.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: ambang cantik ≠ ambang murah",
        body: "Presisi 92% (ambang 80) terlihat hebat di slide — dan menghabiskan Rp150 miliar. Presisi 52% (ambang 40) terlihat memalukan — dan menghemat Rp136 miliar. Pilih berdasarkan biaya, bukan estetika angka. (Kecuali FP-mu mahal — hitung dengan biaya-MU.)",
      },
      reference: "Kalibrasi 6 langkah, validasi out-of-time, ulang tiap kuartal. Skor = input manusia, bukan vonis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Fitur = teori kejahatan yang terukur; satu kalimat penjelasan per fitur.",
        "Skor = Σ bobot × fitur; tampilkan kontributor, bukan cuma angka.",
        "Playbook: LOW proses, MEDIUM review+tahan 24 jam, HIGH tahan+investigasi+MLRO.",
        "Ambang dikalibrasi dari data sendiri — tidak transferable.",
        "Padanan AML: CDD→screening, EDD→telusuri hop, STR→lapor+graf. 80% skill transferable.",
      ],
      next: { label: "BCD12 — Capstone: Investigasi Aliran Dana", href: "/v2/learn/bcd12-capstone" },
      quiz: [
        {
          q: "0xw1 skor 72,5 karena mixer langsung. Tindakan yang benar?",
          options: [
            { text: "Blokir permanen otomatis", why: "Bisa memblokir korban tak bersalah — skor bukan vonis." },
            { text: "Tahan + investigasi manusia + sediakan jalur verifikasi (invoice/KYC) dengan SLA", why: "Skor valid memicu proses, bukan hukuman; verifikasi membedakan pelaku vs korban.", correct: true },
            { text: "Abaikan — skor hanya angka", why: "Mengabaikan sinyal mixer = melanggar kehati-hatian dasar." },
            { text: "Naikkan ambang agar tidak flag", why: "Mengutak-atik ambang untuk menghindari kerja = sabotase sistem." },
          ],
        },
        {
          q: "Dua dompet sama-sama skor 72,5 tetapi kontributor berbeda (mixer vs sanksi langsung). Implikasinya?",
          options: [
            { text: "Tidak ada — skor sama = perlakuan sama", why: "Kontributor menentukan urgensi: sanksi langsung = zona regulator." },
            { text: "Skor agregat menyembunyikan cerita — baca kontributor untuk menentukan urgensi & jalur", why: "Angka sama, makna beda: dashboard harus tampilkan kontributor.", correct: true },
            { text: "Rata-ratakan kontributornya", why: "Tidak bermakna — kontributor bukan untuk dirata-rata." },
            { text: "Pilih yang lebih tinggi sebagai acuan", why: "Keduanya 72,5 — tidak ada yang lebih tinggi." },
          ],
        },
        {
          q: "Mengapa ambang 60/30 tidak bisa dicopy dari institusi lain?",
          options: [
            { text: "Karena angkanya jelek", why: "Bukan soal estetika angka." },
            { text: "Basis nasabah, yurisdiksi, dan kapasitas review berbeda — ambang harus dikalibrasi dari data sendiri", why: "Ambang tetangga bisa memberimu 500 alert/hari atau 0 alert.", correct: true },
            { text: "Karena rahasia dagang", why: "Bukan soal kerahasiaan — soal kecocokan statistik." },
            { text: "Bisa dicopy sebenarnya", why: "Tidak — ini kesalahan klasik yang menyebabkan alert fatigue." },
          ],
        },
        {
          q: "Padanan on-chain dari EDD (Enhanced Due Diligence) adalah…",
          options: [
            { text: "Memblokir semua deposit", why: "Itu bukan due diligence — itu penolakan." },
            { text: "Untuk skor MEDIUM/HIGH: telusuri hop (bcd10), minta sumber dana, pantau — sebelum putuskan", why: "EDD = gali lebih dalam untuk risiko tinggi.", correct: true },
            { text: "Menurunkan ambang skor", why: "Tidak relevan dengan EDD." },
            { text: "Menghapus label address", why: "Kebalik — EDD butuh label, bukan menghapusnya." },
          ],
        },
        {
          q: "Fitur 'aktif di malam hari' diusulkan untuk skor risiko. Penilaianmu?",
          options: [
            { text: "Bagus — penjahat begadang", why: "Tidak ada teori kejahatan yang menghubungkan jam aktif dengan risiko; ini menghukum pola tidur." },
            { text: "Tolak — tidak ada teori kejahatan satu kalimat di baliknya; fitur tanpa teori = takhayul berangka", why: "Kriteria fitur: terukur + penjelasan bisnis + tidak menghukum perilaku normal.", correct: true },
            { text: "Terima jika korelasinya tinggi", why: "Korelasi tanpa teori = diskriminasi yang menunggu waktu." },
            { text: "Terima dengan bobot kecil", why: "Bobot kecil tidak memperbaiki tidak adanya dasar teori." },
          ],
        },
        {
          q: "C_FP = Rp5jt, C_FN = Rp500jt. Ambang 80 (presisi 92%) vs ambang 40 (presisi 52%). Pilihan TEPAT?",
          options: [
            { text: "Ambang 80 — presisi 92% jauh lebih baik", why: "Presisi 92% = Rp150M total biaya (300 penjahat lolos × Rp500jt). `Terlihat baik` ≠ `murah`. Hitung total biayanya!" },
            { text: "Ambang 40 — total biaya Rp14M, terkecil meski presisi 52%", why: "Tepat. 800 FP × Rp5jt + 20 FN × Rp500jt = Rp14M < Rp51M (T=60) < Rp150M (T=80). Satu FN = 100 FP dalam rupiah.", correct: true },
            { text: "Ambang 60 — jalan tengah selalu terbaik", why: "`Jalan tengah` bukan metode kalibrasi. Rp51M > Rp14M — jalan tengah di sini 3,6x lebih mahal dari optimum." },
            { text: "Hapus skor — presisi 52% tidak layak pakai", why: "52% presisi dengan total biaya TERKECIL = sistem yang bekerja sesuai ekonomi. Membuangnya karena `tidak cantik` = membuang Rp136M penghematan." },
          ],
        },
      ],
    },
  ],
};
