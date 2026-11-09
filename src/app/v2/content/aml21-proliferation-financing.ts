import type { V2Lesson } from "../lib/types";

const FIG_ALIR = `<svg viewBox="0 0 520 300" role="img" aria-label="Tipologi proliferation financing: front company, shipping, pembayar ganda.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Tiga jalur dana proliferasi</text>
<rect x="20" y="60" width="150" height="70" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="95" y="88" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Front company</text>
<text x="95" y="106" font-size="10" fill="var(--chart-text)" text-anchor="middle">importir alat</text>
<text x="95" y="122" font-size="10" fill="var(--chart-text)" text-anchor="middle">'laboratorium'</text>
<rect x="185" y="60" width="150" height="70" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="260" y="88" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Shipping gelap</text>
<text x="260" y="106" font-size="10" fill="var(--chart-text)" text-anchor="middle">AIS dimatikan,</text>
<text x="260" y="122" font-size="10" fill="var(--chart-text)" text-anchor="middle">transfer tengah laut</text>
<rect x="350" y="60" width="150" height="70" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="425" y="88" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Pembayar ganda</text>
<text x="425" y="106" font-size="10" fill="var(--chart-text)" text-anchor="middle">invoice ganda,</text>
<text x="425" y="122" font-size="10" fill="var(--chart-text)" text-anchor="middle">pihak ketiga bayar</text>
<rect x="185" y="180" width="150" height="60" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="260" y="205" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Program WMD</text>
<text x="260" y="223" font-size="10" fill="var(--chart-text)" text-anchor="middle">DPRK / Iran networks</text>
<line x1="95" y1="130" x2="220" y2="190" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="260" y1="130" x2="260" y2="180" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="425" y1="130" x2="300" y2="190" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="260" y="272" font-size="10" fill="var(--chart-text)" text-anchor="middle">Barang terlihat sipil. Uang terlihat dagang. Tujuannya militer.</text>
</g>
</svg>`;

export const aml21: V2Lesson = {
  slug: "aml21-proliferation-financing",
  track: "Fraud & AML Analytics",
  module: "Sanksi & Proliferasi",
  title: "AML21 — Proliferation Financing: Tipologi & Sanksi Target PBB",
  estMinutes: 52,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Faktur ganda untuk 'sparepart pompa'",
      prose: [
        "Petugas trade finance memeriksa LC untuk PT Samudra Niaga: impor 'sparepart pompa industri' senilai USD 2,4 juta dari pemasok di negara transit. Kejanggalan pertama: ada DUA invoice untuk barang yang sama — satu USD 2,4 juta, satu USD 4,1 juta. Kejanggalan kedua: pembayaran datang bukan dari PT Samudra, melainkan dari perusahaan ketiga di yurisdiksi lain. Kejanggalan ketiga: 'sparepart pompa' itu, menurut daftar kontrol ekspor, adalah komponen dual-use yang bisa dipakai untuk program pengayaan uranium.",
        "Twist-nya: ini bukan fraud biasa — selisih USD 1,7 juta dan pihak ketiga adalah mekanisme PEMBIAYAAN, dan barangnya adalah calon senjata pemusnah massal. Proliferation financing (PF) jarang terlihat seperti 'uang untuk bom'; ia terlihat seperti dagang biasa dengan dokumen yang sedikit salah. Analis yang hanya memeriksa 'apakah dokumen lengkap' akan meloloskan semuanya — dokumennya memang lengkap.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan apa itu proliferation financing dan bedanya dengan terrorist financing; (2) menjelaskan UNSCR 1737, snapback 2025, dan targeted financial sanctions; (3) mengenali tiga tipologi utama PF; (4) menerapkan red flags dan kewajiban pelaporan. Konteks karir: PF adalah topik yang hampir tidak dikuasai analis AML junior — menguasainya membuatmu menonjol di wawancara bank internasional dan lembaga multilateral.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "FATF Recommendation 7 mewajibkan negara menerapkan targeted financial sanctions untuk proliferasi — setara dengan kewajiban untuk terrorist financing (R.6). Bank yang memproses transaksi PF melanggar sanksi PBB: risikonya bukan denda administratif, melainkan kriminal dan pencabutan izin di banyak yurisdiksi.",
      },
      reference: "PF = dagang biasa di permukaan, WMD di ujungnya.",
    },
    {
      id: "definisi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Apa itu proliferation financing",
      prose: [
        "Proliferation financing = penyediaan dana atau jasa keuangan untuk program senjata pemusnah massal (WMD: nuklir, kimia, biologi) dan sistem pengirimnya (rudal). Bedakan dari terrorist financing (TF): TF mendanai AKSI teror; PF mendanai PROGRAM SENJATA negara/jaringan — pelakunya bisa negara (DPRK, Iran) beserta jaringan proksinya, bukan hanya kelompok non-negara.",
        "Dua rezim sanksi PBB yang wajib dikenal. DPRK: UNSCR 1718 (2006) + 9 resolusi lanjutan — rezim sanksi PBB paling komprehensif, mencakup TFS + sanksi sektoral. Iran: UNSCR 1737 (2006) dkk sempat 'dibekukan' oleh UNSCR 2231 (2015, kesepakatan JCPOA); setelah 2231 kedaluwarsa, mekanisme SNAPBACK mengaktifkan kembali 1737, 1747, 1803, 1835, dan 1929 — diingatkan resmi ke industri oleh regulator keuangan (contoh: FCCP Notice No. 183/2025, 18 Desember 2025, mewajibkan re-screening nasabah dan pembekuan tanpa tunda).",
        "Tiga miskonsepsi. Satu: 'PF = masalah pemerintah, bukan bank.' Justru bank adalah titik choke-nya: tanpa sistem keuangan, jaringan proliferasi tidak bisa membayar pemasok. Dua: 'Hanya soal senjata jadi.' PF mencakup barang DUAL-USE — komponen sipil yang bisa dialihkan ke militer; inilah yang membuatnya sulit dideteksi. Tiga: 'Negara saya tidak berdagang dengan DPRK/Iran, jadi aman.' Jaringan PF sengaja memakai negara transit, front company, dan pihak ketiga — nasabahmu bisa menjadi perantara tanpa sadar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ringkas fondasi sanksi (prasyarat yang diasumsikan lesson ini): sanctions = larangan bertransaksi dengan pihak/negara tertentu yang ditetapkan PBB, AS (OFAC), UE, atau otoritas nasional; bank wajib melakukan screening nasabah dan transaksi terhadap sanctions list, membekukan aset pihak yang ditetapkan, dan melaporkan — pelanggaran = sanksi pidana/perdata berat. Sanctions evasion = teknik menghindari deteksi itu (jaringan proksi, pemalsuan dokumen). Lesson ini membahas kasus khususnya: pendanaan proliferasi senjata.",
      },
      hints: [
        "Hafalkan: 1718 = DPRK; 1737 = Iran (snapback 2025).",
        "Dual-use = kata kunci PF; selalu cek daftar kontrol ekspor untuk barang 'teknis'.",
      ],
      reference: "PF = dana untuk program WMD. 1718 DPRK, 1737 Iran.",
    },
    {
      id: "tfs",
      eyebrow: "Langkah 3 · Konsep",
      title: "Targeted financial sanctions: bekukan, jangan beri",
      prose: [
        "Targeted financial sanctions (TFS) = sanksi yang ditargetkan ke orang/entitas spesifik (bukan seluruh negara): (1) pembekuan aset TANPA TUNDA — begitu nama masuk daftar, asetnya dibekukan segera, tanpa pemberitahuan dulu; (2) larangan menyediakan dana/aset — langsung maupun tidak langsung — kepada pihak yang ditetapkan. Beda dengan sanksi luas (embargo dagang sektoral): TFS presisi ke nama, embargo ke sektor/negara.",
        "Kewajiban bank, berurutan: SCREENING — cek nasabah, BO, dan pihak transaksi terhadap UN Consolidated List (dan daftar nasional) saat onboarding, tiap ada update daftar, dan sebelum transaksi; FREEZE — bekukan tanpa tunda bila cocok; REPORT — laporkan confirmed/partial name matches ke otoritas (di UEA via sistem GoAML ke Executive Office; di Indonesia ke PPATK) — JANGAN tipping-off nasabah.",
        "Contoh snapback Iran: setelah 2231 kedaluwarsa, bank harus me-RE-SCREENING seluruh nasabah terhadap daftar yang diaktifkan kembali — nasabah yang 'bersih' kemarin bisa menjadi 'designated' hari ini. Inilah mengapa FCCP Notice 183/2025 menekankan immediate re-screening + update kebijakan internal + pelatihan staf. Daftar sanksi adalah dokumen HIDUP.",
        "Dua miskonsepsi. Satu: 'Partial match = bukan urusan saya.' Partial name match WAJIB ditindaklanjuti (investigasi + lapor) — mengabaikannya = pelanggaran. Dua: 'Bekukan setelah konfirmasi ke nasabah.' TIDAK — freeze dulu tanpa tunda; konfirmasi nasabah = tipping-off yang dilarang.",
      ],
      formula: String.raw`\text{rasio hit} = \frac{\text{match terkonfirmasi}}{\text{total alert screening}}`,
      formulaNote: "Proporsi alert screening yang terbukti match sanksi. Contoh lab: 3 terkonfirmasi dari 120 alert → 2,5%. Interpretasi: rasio SANGAT rendah (<1%) = screening terlalu longgar (banjir false positive, analis kelelahan); rasio terlalu tinggi (>20%) = ambang terlalu ketat (risiko match lolos). Angka sehat tipikal 2-10% — metrik ini mengkalibrasi mesin screening, bukan menghakimi analis.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CKita screening saat onboarding saja.\u201D Daftar berubah (snapback!), nasabah berubah (ganti direksi/BO), transaksi berubah. Screening SATU KALI = snapshot basi. Standarnya: onboarding + update daftar + review berkala + pre-transaction untuk risiko tinggi.",
      },
      hints: [
        "Urutan wajib: screen → freeze (tanpa tunda) → report. Jangan dibalik.",
        "Re-screening pasca-snapback = contoh nyata 'daftar hidup'.",
      ],
      reference: "TFS: bekukan tanpa tunda, jangan beri dana, laporkan.",
    },
    {
      id: "tipologi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Tiga tipologi utama",
      prose: [
        "Satu: FRONT COMPANY — perusahaan dagang 'normal' (impor alat lab, elektronik) yang pesanan sebenarnya untuk program senjata; ciri: bisnis tidak sesuai profil pemilik, pemasok dari negara risiko, barang dual-use. Dua: SHIPPING GELAP — mematikan AIS (sistem pelacakan kapal), transfer barang tengah laut (ship-to-ship), ganti nama/bendera kapal; ciri: rute tak logis, kapal tua berganti pemilik cepat, pelabuhan transit aneh.",
        "Tiga: PEMBAYAR GANDA / PIHAK KETIGA — invoice ganda dengan selisih (selisihnya = fee/marjin jaringan), pembayaran dari perusahaan yang tidak ada di kontrak, over/under-invoicing untuk menggerakkan nilai; ciri: payer ≠ buyer di kontrak, nilai tak wajar untuk barangnya, pembayaran berputar via beberapa yurisdiksi.",
        "Benang merahnya: KETIDAKSESUAIAN. Barang vs bisnis nasabah tidak cocok; dokumen vs dokumen tidak cocok; uang vs kontrak tidak cocok. PF jarang gagal di satu dokumen — ia gagal di KONSISTENSI antar dokumen. Analis PF adalah auditor konsistensi.",
        "Dua miskonsepsi. Satu: 'Tipologi PF terlalu canggih untuk bank komersial.' Tiga tipologi di atas terdeteksi dari DOKUMEN DAGANG biasa — LC, invoice, bill of lading — yang memang dilewati bank. Dua: 'Ini urusan intelijen.' Intelijen menemukan jaringannya; bank melihat UANG-nya — dan uang selalu lewat bank.",
      ],
      figure: {
        svg: FIG_ALIR,
        alt: "Tipologi proliferation financing: front company, shipping, pembayar ganda.",
        caption: "Cara membaca: tiga kotak atas = tiga tipologi; panah ke kotak bawah = tujuan akhir yang sama. Interpretasi: ketiganya menyamarkan dana proliferasi sebagai dagang normal — analis mencari ketidakcocokan di tiap jalur.",
      },
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan tumpang tindih dengan sanctions evasion: jaringan PF memakai teknik evasion yang sama (proksi, pemalsuan dokumen). Bedanya di TUJUAN AKHIR: evasion = menghindari sanksi; PF = mendanai senjata. Bila menemukan evasion dengan barang dual-use, naikkan ke PF — level responsnya berbeda.",
      },
      hints: [
        "Hafalkan 3 tipologi + 1 ciri dokumen masing-masing.",
        "Pertanyaan emas: 'apakah barangnya masuk akal untuk bisnis nasabah ini?'",
      ],
      reference: "Front company, shipping gelap, pembayar ganda. Cari ketidakcocokan.",
    },
    {
      id: "redflags",
      eyebrow: "Langkah 5 · Konsep",
      title: "Red flags untuk bank",
      prose: [
        "Tujuh red flags. (1) Barang dual-use / teknis tanpa alasan bisnis yang jelas. (2) Payer ≠ buyer dalam kontrak dagang. (3) Invoice ganda / nilai tak wajar untuk barangnya. (4) Rute pelayaran tak logis, AIS mati, ship-to-ship transfer. (5) Negara transit yang tidak ada kaitannya dengan rantai pasok normal. (6) Perusahaan baru, modal kecil, tetapi transaksi jutaan dolar barang teknis. (7) Keengganan memberikan detail teknis barang / dokumen asal barang.",
        "Kewajiban pelaporan: temuan PF = SAR/STR SEGERA ke PPATK (Indonesia) dengan narasi PF — bukan SAR generik. Narasi harus menyebut: barang, tipologi yang dicurigai, pihak-pihak, dan kaitan sanksi (misal 'diduga terkait jaringan proliferasi UNSCR 1737'). Kualitas narasi menentukan apakah intelijen keuangan bisa menindaklanjuti.",
        "Dua miskonsepsi. Satu: 'Lapor = menuduh nasabah bersalah.' SAR adalah PELAPORAN KECURIGAAN, bukan vonis — analis melaporkan fakta + alasan curiga; pembuktian urusan penegak hukum. Dua: 'Tunggu bukti kuat dulu.' Standar pelaporan = kecurigaan yang beralasan (reasonable suspicion), bukan pembuktian. Menunggu 'pasti' = memberi waktu jaringan memindahkan dana.",
        "Satu prinsip: bila ragu antara 'transaksi dagang aneh' vs 'PF' — eskalasi ke tim sanksi/financial crime. Biaya false positive (investigasi internal) jauh lebih kecil dari biaya miss (memfasilitasi WMD + sanksi pidana bank).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CNilai transaksinya kecil — bukan PF.\u201D Komponen dual-use bisa murah (ribuan dolar) tetapi kritis untuk program senjata. PF bukan soal NILAI, melainkan soal BARANG + TUJUAN. Jangan filter PF dengan ambang nominal.",
      },
      hints: [
        "Hafalkan 7 red flags; tempel di meja tim trade finance.",
        "Narasi SAR-PF: barang + tipologi + pihak + kaitan resolusi PBB.",
      ],
      reference: "7 red flags. Lapor = kecurigaan beralasan, bukan vonis.",
    },
    {
      id: "lab-screening",
      eyebrow: "Langkah 6 · Lab",
      title: "Screening daftar sanksi sederhana",
      prose: [
        "Lima nama pihak transaksi vs daftar sanksi (4 nama). Lakukan pencocokan sederhana: normalisasi (huruf kecil, hapus spasi) lalu cek kecocokan. Tandai MATCH bila cocok; hitung rasio hit = match terkonfirmasi / total pihak.",
        "Hasil: 2 match dari 5 → rasio 40% (tinggi — karena dataset latihan kecil; di produksi sehatnya 2-10%). Perhatikan 'PT Samudra Niaga' vs 'samudra niaga ltd' — normalisasi menangkap varian penulisan; tetapi 'Hendra Wijaya' vs 'Hendrawijaya Corp' TIDAK match — batasan pencocokan sederhana, di produksi dipakai fuzzy matching. Eksperimen: tambah varian 'SAMUDRA-NIAGA' — apakah tertangkap?",
      ],
      tasks: [
        { id: "t1", text: "Normalisasi nama lalu tandai MATCH vs daftar sanksi" },
        { id: "t2", text: "Hitung & cetak rasio hit (match/total)" },
      ],
      expected: "pt samudra niaga: MATCH\npt cahaya abadi: bersih\ncv berkat jaya: bersih\nhendra wijaya: bersih\nsamudra niaga ltd: MATCH\nRasio hit: 40.0% (2 dari 5)",
      note: {
        title: "💡 Intuisi",
        body: "Screening = pencocokan nama berskala industri. Lab ini menunjukkan DUA sisinya: normalisasi yang baik menangkap varian ('PT' vs 'Ltd'), tetapi pencocokan persis buta terhadap kemiripan parsial — di sanalah fuzzy matching dan analis manusia masuk.",
      },
      hints: [
        "norm = nama.lower().replace(' ', '').replace('-','').replace('pt','').",
        "MATCH bila norm(pihak) == norm(sanksi) untuk salah satu daftar.",
      ],
      code: {
        starter: "# Pihak transaksi & daftar sanksi. JANGAN UBAH.\npihak = [\"PT Samudra Niaga\", \"PT Cahaya Abadi\", \"CV Berkat Jaya\", \"Hendra Wijaya\", \"Samudra Niaga Ltd\"]\nsanksi = [\"Samudra Niaga\", \"Kim Hyok\", \"Iran Oil Trading\", \"Samudra Niaga Ltd\"]\n\n# TULIS KODEMU: normalisasi + tandai MATCH + rasio hit\ndef norm(nama):\n    return \nmatch = 0\nfor p in pihak:\n    kena = any(norm(p) == norm(s) for s in sanksi)\n    match += 1 if kena else 0\n    print(f\"{p.lower()}: {'MATCH' if kena else 'bersih'}\")\nprint(f\"Rasio hit: {match/len(pihak)*100:.1f}% ({match} dari {len(pihak)})\")\n",
        lockLines: 9,
        solution: "# Pihak transaksi & daftar sanksi. JANGAN UBAH.\npihak = [\"PT Samudra Niaga\", \"PT Cahaya Abadi\", \"CV Berkat Jaya\", \"Hendra Wijaya\", \"Samudra Niaga Ltd\"]\nsanksi = [\"Samudra Niaga\", \"Kim Hyok\", \"Iran Oil Trading\", \"Samudra Niaga Ltd\"]\n\n# TULIS KODEMU: normalisasi + tandai MATCH + rasio hit\ndef norm(nama):\n    n = nama.lower().replace(\" \", \"\").replace(\"-\", \"\")\n    for awalan in (\"pt\", \"cv\"):\n        if n.startswith(awalan):\n            n = n[len(awalan):]\n    if n.endswith(\"ltd\"):\n        n = n[:-3]\n    return n\nmatch = 0\nfor p in pihak:\n    kena = any(norm(p) == norm(s) for s in sanksi)\n    match += 1 if kena else 0\n    print(f\"{p.lower()}: {'MATCH' if kena else 'bersih'}\")\nprint(f\"Rasio hit: {match/len(pihak)*100:.1f}% ({match} dari {len(pihak)})\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Samudra MATCH", msg: "Varian PT tertangkap.", pattern: "pt samudra niaga: MATCH" },
          { kind: "stdout_matches", task: "t1", label: "Ltd MATCH", msg: "Varian Ltd tertangkap.", pattern: "samudra niaga ltd: MATCH" },
          { kind: "stdout_matches", task: "t2", label: "Rasio 40%", msg: "2 dari 5.", pattern: "Rasio hit: 40.0% .2 dari 5." },
        ],
      },
      reference: "Normalisasi → cocokkan → rasio hit untuk kalibrasi.",
    },
    {
      id: "lab-tipologi",
      eyebrow: "Langkah 7 · Lab",
      title: "Deteksi anomali dokumen dagang",
      prose: [
        "Enam transaksi dagang: tiap transaksi punya buyer kontrak, payer aktual, nilai invoice, dan flag barang dual-use. Tandai MENCURIGAKAN bila: payer ≠ buyer (pembayar pihak ketiga) ATAU (dual-use DAN nilai > USD 1 juta).",
        "Hasil: 3 dari 6 mencurigakan — dua karena payer pihak ketiga, satu karena dual-use bernilai besar. Perhatikan transaksi 4: dual-use tetapi USD 50 ribu → tidak tertangkap aturan ini (ingat: PF bisa bernilai kecil — aturan ini hanya saringan pertama, bukan vonis bersih). Eksperimen: apa yang terjadi bila ambang dual-use dihapus?",
      ],
      tasks: [
        { id: "t1", text: "Tandai MENCURIGAKAN per aturan (payer≠buyer ATAU dual-use>1jt)" },
        { id: "t2", text: "Cetak tiap transaksi + total mencurigakan" },
      ],
      expected: "TX1: MENCURIGAKAN (payer pihak ketiga)\nTX2: bersih\nTX3: MENCURIGAKAN (payer pihak ketiga)\nTX4: bersih\nTX5: MENCURIGAKAN (dual-use nilai besar)\nTX6: bersih\nTotal mencurigakan: 3 dari 6",
      note: {
        title: "💡 Intuisi",
        body: "Aturan ini menangkap KETIDAKCOCOKAN, bukan kejahatan — outputnya adalah daftar untuk diselidiki analis, bukan daftar penjahat. Saringan pertama boleh kasar; yang tidak boleh adalah tidak punya saringan.",
      },
      hints: [
        "curiga = (payer != buyer) or (dual_use and nilai > 1_000_000).",
        "Sertakan alasan singkat di tiap baris.",
      ],
      code: {
        starter: "# (id, buyer kontrak, payer aktual, nilai USD, dual-use). JANGAN UBAH.\ntx = [(\"TX1\", \"PT Samudra\", \"Orion Ltd\", 2400000, False),\n      (\"TX2\", \"PT Samudra\", \"PT Samudra\", 800000, False),\n      (\"TX3\", \"CV Berkat\", \"Pacific Trade\", 1500000, False),\n      (\"TX4\", \"PT Cahaya\", \"PT Cahaya\", 50000, True),\n      (\"TX5\", \"PT Cahaya\", \"PT Cahaya\", 4100000, True),\n      (\"TX6\", \"PT Maju\", \"PT Maju\", 300000, False)]\n\n# TULIS KODEMU: tandai transaksi mencurigakan\ncuriga = 0\nfor tid, buyer, payer, nilai, dual in tx:\n    alasan, flag = \n\n    curiga += 1 if flag else 0\n    print(f\"{tid}: {'MENCURIGAKAN (' + alasan + ')' if flag else 'bersih'}\")\nprint(f\"Total mencurigakan: {curiga} dari {len(tx)}\")\n",
        lockLines: 15,
        solution: "# (id, buyer kontrak, payer aktual, nilai USD, dual-use). JANGAN UBAH.\ntx = [(\"TX1\", \"PT Samudra\", \"Orion Ltd\", 2400000, False),\n      (\"TX2\", \"PT Samudra\", \"PT Samudra\", 800000, False),\n      (\"TX3\", \"CV Berkat\", \"Pacific Trade\", 1500000, False),\n      (\"TX4\", \"PT Cahaya\", \"PT Cahaya\", 50000, True),\n      (\"TX5\", \"PT Cahaya\", \"PT Cahaya\", 4100000, True),\n      (\"TX6\", \"PT Maju\", \"PT Maju\", 300000, False)]\n\n# TULIS KODEMU: tandai transaksi mencurigakan\ncuriga = 0\nfor tid, buyer, payer, nilai, dual in tx:\n    if payer != buyer:\n        alasan, flag = \"payer pihak ketiga\", True\n    elif dual and nilai > 1000000:\n        alasan, flag = \"dual-use nilai besar\", True\n    else:\n        alasan, flag = \"\", False\n    curiga += 1 if flag else 0\n    print(f\"{tid}: {'MENCURIGAKAN (' + alasan + ')' if flag else 'bersih'}\")\nprint(f\"Total mencurigakan: {curiga} dari {len(tx)}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "TX1 pihak ketiga", msg: "Payer Orion Ltd.", pattern: "TX1: MENCURIGAKAN .payer pihak ketiga." },
          { kind: "stdout_matches", task: "t1", label: "TX5 dual-use", msg: "4,1jt dual-use.", pattern: "TX5: MENCURIGAKAN .dual-use nilai besar." },
          { kind: "stdout_matches", task: "t2", label: "Total 3 dari 6", msg: "TX1, TX3, TX5.", pattern: "Total mencurigakan: 3 dari 6" },
        ],
      },
      reference: "Payer≠buyer ATAU dual-use besar = selidiki.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Alert PF: respons apa?",
      prose: [
        "Satu: screening match (confirmed) → BEKUKAN tanpa tunda + laporkan ke otoritas; jangan hubungi nasabah dulu. Dua: partial match → investigasi segera (cocokkan DOB, alamat, BO); bila menguat → freeze + lapor; bila terbantahkan → dokumentasikan alasan penutupan. Tiga: red flag dokumen dagang (tanpa match sanksi) → EDD trade: verifikasi barang ke daftar kontrol ekspor, telusuri payer pihak ketiga; bila mengarah PF → SAR bernarasi PF.",
        "Empat: temuan pasca-snapback (nasabah lama tiba-tiba designated) → freeze eksposur berjalan + re-screening portofolio + laporkan. Lima: keraguan → eskalasi ke tim financial crime/sanksi dalam 24 jam; dokumentasikan.",
        "Aturan praktis 10 detik: match = bekukan; partial = selidiki; anomali dagang = EDD; ragu = eskalasi. Jangan pernah 'tunggu sampai jelas' untuk freeze — kewajiban bekunya TANPA TUNDA.",
        "Satu jebakan: 'kita lapor saja, tidak perlu bekukan — kan belum pasti.' Salah urutan dan salah hukum: kewajiban freeze tidak menunggu kepastian; melapor tanpa membekukan = membiarkan dana bergerak setelah kamu tahu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dokumentasi keputusan partial-match adalah tamengmu: 'match ditutup karena DOB berbeda 20 tahun + alamat beda negara, diverifikasi via paspor' = keputusan profesional. 'Match ditutup' tanpa alasan = temuan audit yang berujung denda.",
      },
      reference: "Match=beku; partial=selidiki; anomali=EDD; ragu=eskalasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "PT Samudra Niaga, jilid lengkap",
      prose: [
        "Kembali ke cerita pembuka dengan data penuh. PT Samudra Niaga (berdiri 8 bulan lalu, modal Rp2 miliar) mengajukan LC kedua: USD 4,1 juta 'sparepart pompa' dari pemasok negara transit. Dokumen: invoice A USD 2,4 juta + invoice B USD 4,1 juta untuk barang sama; payer = Orion Ltd (tidak ada di kontrak); kapal pengangkut mematikan AIS 3 hari di rute; BO PT Samudra = nominee yang juga direktur 60 perusahaan.",
        "Pertanyaan: (a) Tipologi apa? (b) Langkah respons? Pembahasan: (a) Kombinasi front company (perusahaan baru + barang dual-use) + pembayar ganda/pihak ketiga (invoice ganda, payer asing) + indikasi shipping gelap (AIS mati) — pola PF klasik, bukan satu tipologi. (b) TOLAK LC; bekukan dana terkait bila ada indikasi designated party; SAR bernarasi PF ke PPATK (sebut: barang dual-use, invoice ganda USD 1,7 juta, payer pihak ketiga, AIS mati, kaitan potensi UNSCR 1737/1718); eskalasi ke penegak hukum. Pelajaran: satu red flag = selidiki; LIMA red flag yang saling menguatkan = hentikan dan laporkan. Jangan menunggu red flag keenam.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan modal Rp2 miliar vs LC USD 4,1 juta (±Rp65 miliar): 32x modal. Ketidakseimbangan skala-vs-modal adalah red flag mandiri yang sering luput — perusahaan sekecil ini tidak wajar memesan barang teknis puluhan miliar tanpa penjelasan.",
      },
      reference: "Lima red flag menguatkan = hentikan + laporkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 4 dari 5.",
      ],
      summary: [
        "Proliferation financing = dana/jasa keuangan untuk program WMD (nuklir, kimia, biologi) + sistem pengirimnya; pelakunya bisa negara (DPRK: UNSCR 1718; Iran: UNSCR 1737 via snapback 2025) beserta jaringannya.",
        "Targeted financial sanctions = bekukan aset TANPA TUNDA + larang penyediaan dana ke pihak designated; urutan wajib: screen → freeze → report (tanpa tipping-off); daftar sanksi hidup — snapback memaksa re-screening.",
        "Tiga tipologi: front company (dagang normal, barang dual-use), shipping gelap (AIS mati, ship-to-ship), pembayar ganda/pihak ketiga (invoice ganda, payer ≠ buyer) — benang merahnya KETIDAKCOCOKAN antar dokumen.",
        "Tujuh red flags bank; PF tidak difilter nominal — komponen dual-use murah bisa kritis; temuan = SAR bernarasi PF (barang + tipologi + pihak + kaitan resolusi PBB).",
        "Standar lapor = kecurigaan beralasan, bukan pembuktian; biaya miss (fasilitasi WMD + pidana) jauh melampaui biaya false positive.",
      ],
      next: { label: "AML22 — Travel Rule (FATF Recommendation 16)", href: "/v2/learn/aml22-travel-rule" },
      quiz: [
        {
          q: "Perbedaan utama proliferation financing vs terrorist financing:",
          options: [
            { text: "PF mendanai program senjata (bisa oleh negara); TF mendanai aksi teror", why: "Benar: itulah pembeda definisinya.", correct: true },
            { text: "PF hanya memakai kripto", why: "PF memakai dagang, shipping, dan bank konvensional." },
            { text: "Keduanya identik, hanya beda nama", why: "Rezim sanksi dan tipologinya berbeda (R.7 vs R.6)." },
            { text: "PF tidak diatur FATF", why: "Diatur: FATF Recommendation 7." },
          ],
        },
        {
          q: "Setelah UNSCR 2231 kedaluwarsa (snapback), bank WAJIB:",
          options: [
            { text: "Re-screening nasabah terhadap daftar yang diaktifkan kembali + update kebijakan", why: "Benar: persis isi FCCP Notice 183/2025.", correct: true },
            { text: "Menunggu instruksi nasabah sebelum bertindak", why: "Kewajiban TFS tanpa tunda; tidak menunggu nasabah." },
            { text: "Menutup semua nasabah Timur Tengah", why: "TFS presisi ke nama designated, bukan geografi membabi buta." },
            { text: "Tidak perlu apa-apa sampai ada kasus", why: "Re-screening adalah kewajiban proaktif." },
          ],
        },
        {
          q: "Screening menemukan partial name match. Tindakan benar:",
          options: [
            { text: "Investigasi segera (DOB, alamat, BO); menguat → freeze + lapor", why: "Benar: partial match wajib ditindaklanjuti.", correct: true },
            { text: "Abaikan — bukan confirmed match", why: "Mengabaikan partial match = pelanggaran." },
            { text: "Telepon nasabah untuk konfirmasi dulu", why: "Itu tipping-off; investigasi internal dulu." },
            { text: "Bekukan tanpa investigasi apa pun", why: "Freeze untuk confirmed; partial butuh investigasi dulu." },
          ],
        },
        {
          q: "Invoice ganda (USD 2,4 jt & 4,1 jt, barang sama) + payer pihak ketiga mengindikasikan tipologi:",
          options: [
            { text: "Pembayar ganda/pihak ketiga — selisih sebagai mekanisme pembiayaan", why: "Benar: pola klasik lab langkah 7.", correct: true },
            { text: "Diskon dagang biasa", why: "Selisih 70% + payer asing bukan diskon normal." },
            { text: "Kesalahan administrasi", why: "Dua invoice + payer ketiga bukan kebetulan ganda." },
            { text: "Hedging nilai tukar", why: "Hedging tidak memakai payer pihak ketiga." },
          ],
        },
        {
          q: "Standar untuk mengajukan SAR terkait PF:",
          options: [
            { text: "Kecurigaan yang beralasan — tidak perlu pembuktian", why: "Benar: menunggu 'pasti' = memberi waktu jaringan kabur.", correct: true },
            { text: "Bukti pengadilan yang sudah inkracht", why: "Itu standar vonis, bukan standar lapor." },
            { text: "Nilai transaksi di atas USD 10 juta", why: "PF tidak difilter nominal; komponen murah bisa kritis." },
            { text: "Persetujuan nasabah terlebih dahulu", why: "Itu tipping-off yang dilarang." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CPF = urusan senjata jadi seperti rudal utuh.\u201D Justru komponen DUAL-USE (sparepart pompa, katup presisi, software simulasi) yang menjadi medan PF sehari-hari — barang sipil yang sah diperdagangkan, tetapi mematikan di tangan yang salah. Fokus pada dual-use, bukan hanya senjata jadi.",
      },
      hints: [
        "Uji cepat: sebutkan 3 tipologi + 1 ciri dokumen masing-masing tanpa catatan.",
        "Ingat urutan: screen → freeze → report; snapback = re-screen.",
      ],
      reference: "PF = dagang + dokumen + dana untuk WMD. Hentikan di bank.",
    },
  ],
};
