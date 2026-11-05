import type { V2Lesson } from "../lib/types";

// Rantai layering: A -> X -> Y -> Z -> W, tiap hop menyusut 4% ("pajak" pencucian).
const CHAIN_SVG = `<svg viewBox="0 0 480 240" role="img" aria-label="Rantai layering lima node dengan nominal menyusut tiap hop.">
<g stroke="var(--chart-text)" stroke-width="2"><line x1="70" y1="120" x2="140" y2="120"/><line x1="190" y1="120" x2="260" y2="120"/><line x1="310" y1="120" x2="380" y2="120"/><line x1="430" y1="120" x2="470" y2="120" stroke-dasharray="6 4"/></g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<circle cx="60" cy="120" r="28" fill="var(--c1)" opacity="0.85"/><text x="60" y="125" fill="var(--text)" font-weight="600">A</text>
<circle cx="150" cy="120" r="28" fill="var(--c4)" opacity="0.9"/><text x="150" y="125" fill="var(--text)" font-weight="600">X</text>
<circle cx="270" cy="120" r="28" fill="var(--c4)" opacity="0.9"/><text x="270" y="125" fill="var(--text)" font-weight="600">Y</text>
<circle cx="390" cy="120" r="28" fill="var(--c4)" opacity="0.9"/><text x="390" y="125" fill="var(--text)" font-weight="600">Z</text>
<circle cx="472" cy="120" r="24" fill="var(--c2)" opacity="0.85"/><text x="472" y="125" fill="var(--text)" font-weight="600">W</text>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">
<text x="105" y="105">1200</text><text x="225" y="105">1150</text><text x="345" y="105">1100</text><text x="452" y="105">1050</text>
<text x="105" y="165" fill="var(--text-muted)">hari 1</text><text x="225" y="165" fill="var(--text-muted)">hari 3</text><text x="345" y="165" fill="var(--text-muted)">hari 5</text><text x="452" y="165" fill="var(--text-muted)">hari 8</text>
</g>
<text x="240" y="210" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)">X, Y, Z = pass-through: masuk ≈ keluar (rasio 0,96), transit 2 hari</text>
<text x="240" y="230" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Node ungu = dompet transit, bukan bisnis. Tiap hop memotong ~4%.</text>
</svg>`;

export const aml6: V2Lesson = {
  slug: "aml6-layering",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML6 — Tipologi: Layering & Trade-Based",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kontainer yang benar-benar berlayar — dengan harga fiktif",
      prose: [
        "PT Sinar Ekspor mengekspor \"sparepart mesin\" ke Dubai: invoice Rp4,2 miliar. Harga pasar sparepart sejenis: Rp1,4 miliar. Dana lalu bergerak: Jakarta → Dubai → Singapura → Jakarta — 11 transfer dalam 9 hari, tiap transit memotong 2-4%. Total \"biaya perjalanan\": hampir Rp600 juta menguap sebagai fee dan selisih kurs.",
        "Twist-nya: barangnya benar-benar dikirim. Ada bill of lading, ada kontainer, ada bea cukai yang mencap. Investigator junior mencoret kasus ini: \"barang ada, berarti dagang beneran.\" Yang tidak ia lihat: over-invoicing tidak butuh barang fiktif — ia butuh harga fiktif. Selisih Rp2,8 miliar adalah uang haram yang \"dibayar\" sebagai harga barang, lalu kembali ke Jakarta sebagai \"hasil ekspor\" yang bersih.",
        "Dua teknik dalam satu paket: layering (rantai transfer berlapis mengaburkan asal dana) dan TBML — trade-based money laundering (manipulasi dokumen dagang). Lesson ini tentang membaca rantai dan membaca invoice: dua keterampilan yang jarang ada di satu orang, padahal penjahat selalu memakainya bersamaan.",
        "Setelah lesson ini kamu bisa: menghitung rasio pass-through untuk menemukan node transit, menghitung deviasi harga invoice vs pasar, dan menjelaskan tiga modus TBML utama.",
      ],
      tasks: [],
      reference: "Layering = mengaburkan asal lewat rantai. TBML = mengaburkan nilai lewat dagang. Sering satu paket.",
    },
    {
      id: "layering",
      eyebrow: "Langkah 2 · Anatomi layering",
      title: "Dompet transit: masuk ≈ keluar",
      prose: [
        "Layering punya tiga ciri. Satu: rantai — dana berpindah 3+ hop dalam hitungan hari, sering lintas yurisdiksi. Dua: pass-through — node transit bukan tujuan: yang masuk ≈ yang keluar (rasio 0,85-1,05), hanya dipotong fee. Bisnis normal menahan dana (bayar gaji, beli stok); dompet transit meneruskannya. Tiga: kecepatan — 11 transfer dalam 9 hari. Uang bisnis bergerak mengikuti kontrak; uang layering bergerak mengikuti ketakutan ketahuan.",
        "Rumus deteksinya sederhana: untuk tiap rekening, hitung total masuk dan keluar dalam jendela 10 hari. Rasio keluar/masuk di 0,85-1,05 + total masuk ≥ Rp500 juta + ≥2 lawan transaksi = kandidat pass-through. Di lab: X (1200→1150, rasio 0,958), Y (0,957), Z (0,955) — tiga dompet transit berderet.",
        "Cara membaca diagram rantai: lingkaran = rekening, angka di panah = nominal (juta Rp), angka bawah = hari. Ungu = pass-through. Interpretasi: tiap hop menyusut ~4% — \"pajak pencucian.\" Pelaku rela membayar Rp150 juta untuk memindahkan Rp4,2 miliar karena alternatifnya (ketahuan) jauh lebih mahal. Rantai yang menyusut teratur = direncanakan; bisnis normal tidak membayar pajak 4% per 2 hari.",
      ],
      formula: String.raw`R_{pt} = \frac{\text{keluar}}{\text{masuk}} \qquad \text{pass-through jika } 0{,}85 \le R_{pt} \le 1{,}05`,
      formulaNote: "R_pt = rasio pass-through. keluar/masuk = total dana keluar vs masuk dalam jendela 10 hari. Mendekati 1 = node hanya meneruskan (dompet transit), bukan memakai dana.",
      figure: {
        svg: CHAIN_SVG,
        alt: "Rantai layering lima node dengan nominal menyusut tiap hop.",
        caption: "Rantai A→X→Y→Z→W: X, Y, Z meneruskan ~96% dana dalam 2 hari. Dompet transit, bukan bisnis.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Layering harus rumit — puluhan rekening, banyak negara.\" Tidak. Tiga hop cepat (X→Y→Z dalam 5 hari) sudah cukup mengaburkan asal untuk bank yang hanya melihat transaksi satu per satu. Kerumitan adalah kemewahan; kecepatan adalah kebutuhan. Cari yang cepat, bukan yang rumit.",
      },
      reference: "Jendela 10 hari menangkap layering cepat. Rantai lambat (bulanan) butuh analisis graf — lihat AML8.",
    },
    {
      id: "tbml",
      eyebrow: "Langkah 3 · Trade-based ML",
      title: "Ketika invoice berbohong",
      prose: [
        "Tiga modus TBML. Satu: over/under-invoicing — harga invoice dimanipulasi vs harga pasar. Over-invoice (Rp4,2 miliar vs pasar Rp1,4 miliar): pembeli \"membayar kemahalan\" — selisihnya adalah transfer nilai terselubung ke penjual. Under-invoice: sebaliknya, barang murah di atas kertas, sisanya dibayar di bawah tangan.",
        "Dua: phantom shipment — barang tidak ada sama sekali, hanya dokumen. Tiga: multiple invoicing — satu pengiriman difakturkan berkali-kali ke bank berbeda untuk mencairkan pembiayaan ganda. Sinyal dokumen: deskripsi barang samar (\"sparepart mesin\" tanpa spesifikasi), harga menyimpang >50% dari pasar, rute dagang tidak wajar, dan perusahaan baru tanpa histori dagang menangani volume raksasa.",
        "Deviasi harga = (P_invoice − P_pasar) / P_pasar. Kasus Sinar Ekspor: (4,2 − 1,4)/1,4 = 2,0 = 200%. Ambang investigasi umum: >50% layak ditanya, >100% layak dicurigai serius. Tapi harga pasar butuh pembanding yang benar: sparepart genset ≠ sparepart turbin. Analis TBML yang baik setengahnya analis komoditas.",
      ],
      formula: String.raw`D = \frac{P_{inv} - P_{mkt}}{P_{mkt}} \qquad \text{contoh: } \frac{4{,}2 - 1{,}4}{1{,}4} = 2{,}0 = 200\%`,
      formulaNote: "D = deviasi harga invoice. P_inv = harga di invoice, P_mkt = harga pasar pembanding yang sepadan. D > 0,5 (50%) = tanya; D > 1,0 (100%) = curigai serius.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Ada barang + dokumen lengkap = dagang sah, bukan TBML.\" Inilah yang membuat investigator junior mencoret Sinar Ekspor. TBML over-invoicing justru paling nyaman dengan barang nyata — dokumen lengkap adalah kamuflase, bukan bukti kesahihan. Yang diuji bukan keberadaan barang, melainkan kewajaran harga dan rute.",
      },
      reference: "Uji TBML: harga vs pasar, rute vs logika bisnis, volume vs umur perusahaan.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab rantai",
      title: "Temukan dompet transit dari edge list",
      prose: [
        "Delapan transfer antar rekening. Hitung untuk tiap node: total masuk, total keluar, dan rasio pass-through. Node mana yang meneruskan ~96% dananya dalam hitungan hari? Itulah dompet transit — dan tiga di antaranya berderet membentuk rantai.",
        "Perhatikan noise-nya: M↔N saling transfer (bolak-balik, bukan rantai), P→Q→R nominal kecil. Rasio saja tidak cukup — gabungkan dengan nominal (≥500) dan jumlah lawan (≥2) agar tidak menangkap arisan keluarga.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `masuk`, `keluar`, dan rasio tiap node, cetak tabel" },
        { id: "t2", text: "Saring pass-through: masuk≥500, rasio 0.85-1.05, lawan≥2" },
      ],
      expected: "X: 1200→1150 (0.958), Y: 1150→1100 (0.957), Z: 1100→1050 (0.955) | pass-through: X, Y, Z",
      note: {
        title: "Intuisi",
        body: "Bisnis normal adalah spons: menyerap dana (masuk > keluar, atau keluar untuk biaya operasional yang bervariasi). Dompet transit adalah pipa: masuk ≈ keluar, cepat, teratur. Ketika kamu melihat pipa, tanyakan: bisnis apa yang tidak pernah menyimpan uangnya sendiri?",
      },
      hints: [
        "masuk[b] += n; keluar[a] += n; lawan[v].add(pasangan).",
        "rasio = keluar/masuk jika masuk>0 else 0.",
        "Saring: masuk>=500 and 0.85<=rasio<=1.05 and len(lawan)>=2.",
      ],
      code: {
        starter: `# transfer: (dari, ke, nominal_jt, hari)\nedges = [("A","X",1200,1),("X","Y",1150,3),("Y","Z",1100,5),("Z","W",1050,8),\n         ("M","N",300,2),("N","M",280,4),("P","Q",80,1),("Q","R",75,9)]\n\n# TULIS KODEMU: agregat per node\nmasuk, keluar, lawan = {}, {}, {}\nfor a,b,n,h in edges:\n    \n\nprint(f"{'node':>4s} {'masuk':>6s} {'keluar':>6s} {'ratio':>6s}")\nfor v in sorted(set(masuk)|set(keluar)):\n    mi, ko = masuk.get(v,0), keluar.get(v,0)\n    r = ko/mi if mi else 0\n    print(f"{v:>4s} {mi:6d} {ko:6d} {r:6.3f}")\n\n# TULIS KODEMU: saring pass-through\npt = []\nprint("pass-through:", sorted(pt))`,
        lockLines: 3,
        solution: `# transfer: (dari, ke, nominal_jt, hari)\nedges = [("A","X",1200,1),("X","Y",1150,3),("Y","Z",1100,5),("Z","W",1050,8),\n         ("M","N",300,2),("N","M",280,4),("P","Q",80,1),("Q","R",75,9)]\n\n# TULIS KODEMU: agregat per node\nmasuk, keluar, lawan = {}, {}, {}\nfor a,b,n,h in edges:\n    masuk[b] = masuk.get(b,0)+n; keluar[a] = keluar.get(a,0)+n\n    lawan.setdefault(b,set()).add(a); lawan.setdefault(a,set()).add(b)\n\nprint(f"{'node':>4s} {'masuk':>6s} {'keluar':>6s} {'ratio':>6s}")\nfor v in sorted(set(masuk)|set(keluar)):\n    mi, ko = masuk.get(v,0), keluar.get(v,0)\n    r = ko/mi if mi else 0\n    print(f"{v:>4s} {mi:6d} {ko:6d} {r:6.3f}")\n\n# TULIS KODEMU: saring pass-through\npt = [v for v in set(masuk)&set(keluar)\n      if masuk[v] >= 500 and 0.85 <= keluar[v]/masuk[v] <= 1.05 and len(lawan[v]) >= 2]\nprint("pass-through:", sorted(pt))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "X\\s+1200\\s+1150\\s+0\\.958", label: "Baris X benar", msg: "X: masuk 1200, keluar 1150, rasio 0.958." },
          { kind: "stdout_matches", task: "t1", pattern: "Z\\s+1100\\s+1050\\s+0\\.955", label: "Baris Z benar", msg: "Z: masuk 1100, keluar 1050, rasio 0.955." },
          { kind: "stdout_matches", task: "t2", pattern: "pass-through: \\['X', 'Y', 'Z'\\]", label: "Rantai X-Y-Z terdeteksi", msg: "Tiga node memenuhi semua syarat pass-through." },
        ],
      },
      reference: "dict.get(v,0) untuk agregat. set untuk lawan unik.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Round-trip",
      title: "Dana yang pulang: deteksi round-tripping",
      prose: [
        "Round-tripping: Jakarta → Dubai → Singapura → Jakarta. Dana kembali ke titik asal = satu putaran pencucian selesai = siap integration (beli properti, masuk bisnis sah). Prioritas tertinggi: tangkap SEBELUM menjadi aset. Setelah menjadi properti, penyitaan butuh proses hukum bertahun-tahun.",
        "Deteksi dari edge list: untuk tiap node awal, telusuri rantai maju (waktu harus maju, maks 4 hop); jika kembali ke node awal dalam ≤10 hari → round-trip. Di lab: A→B (hari 1) →C (hari 3) →A (hari 9) = kembali dalam 8 hari → ESKALASI. Rantai D→E→F dan X→Y→Z tidak kembali — bukan round-trip.",
        "Round-trip saja belum cukup untuk SAR — tetapi round-trip + deviasi harga invoice > 100% (kasus Sinar Ekspor) = eskalasi tertinggi. Kombinasi dua sinyal independen jauh lebih kuat daripada satu sinyal besar: peluang keduanya kebetulan = perkalian peluang masing-masing.",
        "Batasan: pelaku pintar memakai jeda > 10 hari atau node perantara beda nama. Jendela 10 hari adalah parameter, bukan hukum alam — tune dari data historis kasus bankmu, dan gabungkan dengan sinyal pass-through (AML6 lab utama).",
        "Kecepatan layering modern: dalam kasus nyata, Rp10 miliar bergerak melalui 14 rekening dalam 47 menit — rata-rata 3,4 menit per hop. Sistem batch yang memproses transaksi T+1 baru 'melihat' pola ini besok pagi, saat dana sudah keluar negeri. Inilah argumen untuk monitoring real-time pada koridor berisiko tinggi.",
        "Biaya layering bagi pelaku: tiap hop memakan 1–3% (biaya transfer, selisih kurs, komisi money mule). Sepuluh hop = 10–26% hilang. Pelaku menerima 'pajak' ini karena alternatifnya (terdeteksi) = 100% hilang. Paradoksnya: layering yang mahal justru sinyal — transaksi dengan 10 hop dan total biaya 20% tidak punya penjelasan bisnis yang waras.",
        "Round-tripping versi angka: Rp5 miliar keluar ke Singapura hari Senin, kembali Rp4,85 miliar hari Jumat sebagai 'investasi asing'. Selisih Rp150 juta (3%) = biaya pencucian. Detektor round-trip mencari pasangan keluar-masuk dengan nominal mirip (±5%) dalam jendela 30 hari — pola yang jarang terjadi secara kebetulan pada nominal miliaran.",
        "Trade-based layering: invoice impor 'konsultan' Rp2 miliar untuk jasa yang nilai pasarnya Rp200 juta — mark-up 10x. Red flag: deskripsi barang/jasa kabur, harga menyimpang > 3x dari pasar, dan eksportir-importir berbagi direksi. Satu invoice = sengketa bisnis; 20 invoice serupa = layering.",
        "Pertahanan berlapis: (1) velocity check — > 5 hop dalam 1 jam = tahan otomatis; (2) round-trip matcher — pasangan keluar-masuk ±5% dalam 30 hari; (3) trade price check — deviasi > 3x harga pasar = EDD. Tidak ada satu pun yang sempurna; ketiganya bersama menaikkan 'pajak' layering hingga tidak ekonomis.",
        "Statistik global: UNODC memperkirakan 2–5% PDB dunia (USD 800 miliar–2 triliun) dicuci tiap tahun. Yang terdeteksi < 1%. Artinya 99% layering berhasil — bukan karena pelaku jenius, tetapi karena sistem deteksi underinvested. Setiap analis yang lebih baik menggeser angka ini.",
        "Waktu deteksi: rata-rata 18 bulan dari layering pertama sampai terungkap. Dalam 18 bulan, pelaku sudah memutar dana 5–10x dan mengambil untung. Deteksi yang lebih cepat (real-time monitoring) tidak hanya menangkap — ia membuat layering tidak ekonomis karena 'pajak' waktu naik.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `cari` (DFS round-trip)" },
        { id: "t2", text: "Jalankan dan pastikan temuannya tercetak" },
      ],
      expected: "Round-trip: A kembali dalam 8 hari -> ESKALASI\nSelesai: rantai yang tidak kembali bukan round-trip",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Rantai panjang = pasti layering.” Distributor normal juga punya rantai berjenjang. Yang spesifik untuk pencucian = dana KEMBALI ke titik asal (putaran selesai, siap integration). Rantai tanpa kepulangan = belum tentu apa-apa.",
      },
      hints: [
        "Waktu harus maju: lewati edge dengan h < hari_awal.",
        "depth >= 2 agar A->A langsung tidak dihitung.",
      ],
      code: {
        starter: "# Edge list: (dari, ke, hari). JANGAN UBAH.\nedges = [(\"A\",\"B\",1),(\"B\",\"C\",3),(\"C\",\"A\",9),(\"D\",\"E\",2),(\"E\",\"F\",5),(\"X\",\"Y\",1),(\"Y\",\"Z\",4)]\n\n# TULIS KODEMU: deteksi round-trip (kembali ke awal dalam <=10 hari)\nfrom collections import defaultdict\ng = defaultdict(list)\nfor a, b, h in edges:\n    g[a].append((b, h))\n\ndef cari(awal):\n    return []  # list (hari_awal, hari_kembali)\n\nfor awal in sorted(g):\n    for h0, h1 in cari(awal):\n        print(f\"Round-trip: {awal} kembali dalam {h1-h0} hari -> ESKALASI\")\nprint(\"Selesai: rantai yang tidak kembali bukan round-trip\")",
        lockLines: 8,
        solution: "# Edge list: (dari, ke, hari). JANGAN UBAH.\nedges = [(\"A\",\"B\",1),(\"B\",\"C\",3),(\"C\",\"A\",9),(\"D\",\"E\",2),(\"E\",\"F\",5),(\"X\",\"Y\",1),(\"Y\",\"Z\",4)]\n\n# TULIS KODEMU: deteksi round-trip (kembali ke awal dalam <=10 hari)\nfrom collections import defaultdict\ng = defaultdict(list)\nfor a, b, h in edges:\n    g[a].append((b, h))\n\ndef cari(awal):\n    hasil = []\n    def dfs(node, hari_awal, depth, dikunjungi):\n        for nxt, h in g[node]:\n            if h < hari_awal:\n                continue\n            if nxt == awal and depth >= 2 and h - hari_awal <= 10:\n                hasil.append((hari_awal, h))\n            elif nxt not in dikunjungi and depth < 4:\n                dfs(nxt, hari_awal, depth + 1, dikunjungi | {nxt})\n    for _, h0 in g[awal]:\n        dfs(awal, h0, 1, {awal})\n    return sorted(set(hasil))\n\nfor awal in sorted(g):\n    for h0, h1 in cari(awal):\n        print(f\"Round-trip: {awal} kembali dalam {h1-h0} hari -> ESKALASI\")\nprint(\"Selesai: rantai yang tidak kembali bukan round-trip\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Round-trip A terdeteksi", msg: "A→B→C→A dalam 8 hari.", pattern: "Round-trip: A kembali dalam 8 hari -> ESKALASI" },
          { kind: "stdout_matches", task: "t2", label: "Non-round-trip dilewati", msg: "D,E,F dan X,Y,Z tidak kembali.", pattern: "Selesai: rantai yang tidak kembali bukan round-trip" }
        ],
      },
      reference: "Round-trip + deviasi harga > 100% = eskalasi tertinggi. Tangkap sebelum jadi aset.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Empat temuan, empat respons",
      prose: [
        "Satu: pass-through cepat multi-yurisdiksi (rasio ~0,96, 3+ hop, <10 hari) → SAR: rantai seperti ini hampir tidak punya penjelasan bisnis sah. Bekukan analisis, petakan ujung rantai (siapa A? siapa W?).",
        "Dua: deviasi harga >50% pada dokumen dagang → review TBML: minta kontrak, bandingkan harga komoditas independen, cek kewajaran rute. Jangan tuduh dulu — tanyakan: \"Sparepart apa persisnya? Kenapa 3x pasar?\"",
        "Tiga: pola transfer berantai tapi konsisten dengan bisnis musiman (mis. distributor membayar pemasok berjenjang) → catat + pantau: rantai bukan monopoli penjahat. Bedakan dari kecepatan dan margin: distributor normal tidak memotong 4% per 2 hari.",
        "Empat: dana kembali ke titik asal (round-tripping: Jakarta → ... → Jakarta) → eskalasi prioritas: round-trip adalah tanda \"pencucian selesai satu putaran\" — dana siap integration (beli aset). Tangkap sebelum menjadi properti.",
        "Aturan praktis 10 detik: rasio ~1 + cepat + lintas negara = SAR. Deviasi harga >100% = investigasi dokumen. Kembali ke asal = kejar sebelum jadi aset.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Tanyakan selalu: \"siapa yang membayar pajak 4% per 2 hari?\" Tidak ada bisnis sah yang melakukannya — margin dagang normal 5-20% per TRANSAKSI, bukan per 2 hari transit. Ketika ekonomi transaksinya tidak masuk akal, transaksinya bukan ekonomi — ia logistik penyamaran.",
      },
      reference: "Uji ekonomi: apakah pola ini menguntungkan sebagai bisnis? Jika tidak, ia bukan bisnis.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Audit PT Sinar Ekspor",
      prose: [
        "Data lengkap kasus pembuka. Invoice: Rp4,2 miliar untuk \"sparepart mesin\" — pembanding pasar (tiga supplier independen): Rp1,3-1,5 miliar, ambil Rp1,4 miliar. Deviasi: (4,2−1,4)/1,4 = 200%. Rantai dana: 11 transfer dalam 9 hari, Jakarta → Dubai → Singapura → Jakarta, tiap hop memotong 2-4%, total susut ~Rp600 juta. Perusahaan: berdiri 8 bulan, tidak ada histori ekspor sebelumnya, direktur juga direktur di 2 perusahaan lain.",
        "Pertanyaan: (a) Hitung deviasi harga dan klasifikasikan. (b) Apakah susut Rp600 juta \"masuk akal\" sebagai biaya dagang? (c) Tiga red flag terkuat untuk SAR?",
        "Pembahasan: (a) 200% — jauh di atas ambang curiga 100%. (b) Tidak: biaya logistik+fee wajar ekspor sejenis ~3-5% total, bukan ~14% dalam 9 hari. Susut ini \"pajak pencucian\" — pelaku membayar agar asal dana kabur. (c) Deviasi 200% + round-tripping 9 hari + perusahaan 8 bulan tanpa histori menangani Rp4,2 miliar. Masing-masing kuat; ketiganya bersama = SAR yang menulis sendiri.",
      ],
      tasks: [],
      reference: "Satu red flag = tanya. Dua = investigasi. Tiga independen = SAR.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan.",
      ],
      tasks: [],
      summary: [
        "Layering: rantai 3+ hop, pass-through (R_pt 0,85-1,05), kecepatan hari-bukan-bulan.",
        "TBML: over/under-invoicing, phantom shipment, multiple invoicing.",
        "Deviasi harga D = (P_inv−P_mkt)/P_mkt; >50% tanya, >100% curigai.",
        "Uji ekonomi: pola yang rugi sebagai bisnis = bukan bisnis, melainkan logistik penyamaran.",
        "Round-tripping = sinyal integration dekat; eskalasi sebelum jadi aset.",
      ],
      next: { label: "AML7 — Menulis SAR/STR yang Lolos Review", href: "/v2/learn/aml7-sar" },
      quiz: [
        {
          q: "Rekening X: masuk Rp1.200 jt, keluar Rp1.150 jt dalam 3 hari, 2 lawan transaksi. Kesimpulan?",
          options: [
            { text: "Bisnis normal", why: "Bisnis normal menyimpan/memutar dana, bukan meneruskan 96% dalam 3 hari." },
            { text: "Kandidat pass-through (rasio 0,958) — telusuri rantai sebelum dan sesudahnya", why: "Rasio 0,958 + cepat + multi-lawan = dompet transit. Satu node tidak cukup; petakan rantainya.", correct: true },
            { text: "Pasti money laundering, langsung blokir", why: "\"Kandidat\" ≠ vonis. Blokir butuh investigasi dan dasar hukum." },
            { text: "Abaikan, nominal wajar", why: "Nominal bukan ukurannya — rasio dan kecepatannya yang bicara." },
          ],
        },
        {
          q: "Invoice Rp900 jt, harga pasar Rp600 jt. Deviasi dan respons?",
          options: [
            { text: "50% — tepat di ambang \"layak ditanya\": minta spesifikasi barang + pembanding", why: "(900−600)/600 = 50%. Ambang tanya, bukan ambang tuduh.", correct: true },
            { text: "33% — aman", why: "Salah hitung: (900−600)/600 = 50%, bukan 33%." },
            { text: "150% — SAR segera", why: "Terlalu tinggi; 50% = investigasi dokumen dulu." },
            { text: "Tidak bisa dihitung tanpa kurs", why: "Keduanya rupiah — deviasi langsung bisa dihitung." },
          ],
        },
        {
          q: "Kenapa investigator junior salah mencoret Sinar Ekspor?",
          options: [
            { text: "Datanya kurang", why: "Data cukup — bill of lading ada, harga pasar bisa dicek." },
            { text: "Ia mengira barang nyata = dagang sah, padahal yang dimanipulasi adalah harga, bukan keberadaan barang", why: "Over-invoicing justru nyaman dengan barang nyata. Uji harga, bukan keberadaan.", correct: true },
            { text: "Ia tidak bisa bahasa Inggris", why: "Tidak relevan dengan kesalahan analisisnya." },
            { text: "Perusahaannya terlalu besar untuk dicurigai", why: "Perusahaan 8 bulan tanpa histori — justru kecil dan baru." },
          ],
        },
        {
          q: "Dana Jakarta → Dubai → Singapura → Jakarta dalam 9 hari. Sinyal terpentingnya?",
          options: [
            { text: "Jumlah negaranya", why: "Bukan jumlahnya — melainkan kembalinya ke titik asal." },
            { text: "Round-tripping: kembali ke asal = satu putaran pencucian selesai, dana siap integration — eskalasi prioritas", why: "Round-trip = garis finis layering. Tangkap sebelum menjadi properti/investasi.", correct: true },
            { text: "Dubai sebagai tujuan", why: "Dubai adalah hub dagang sah juga — bukan sinyal sendirian." },
            { text: "9 hari terlalu lambat", why: "9 hari untuk 11 transfer lintas 3 negara justru sangat cepat." },
          ],
        },
        {
          q: "Distributor sah membayar pemasok berjenjang tiap bulan (rantai 4 hop). Bedakan dari layering?",
          options: [
            { text: "Tidak bisa dibedakan", why: "Bisa: kecepatan, margin, dan konsistensi musiman." },
            { text: "Kecepatan (bulanan vs harian), margin wajar vs \"pajak 4%/2 hari\", dan pola konsisten dengan kontrak musiman", why: "Rantai sah mengikuti kontrak; rantai layering mengikuti ketakutan. Ekonomi transaksinya berbeda.", correct: true },
            { text: "Jumlah hop-nya", why: "Keduanya bisa 4 hop — hop bukan pembedanya." },
            { text: "Nominalnya", why: "Nominal bisa sama besar — bukan pembeda." },
          ],
        },
      ],
    },
  ],
};
