import type { V2Lesson } from "../lib/types";

const FIG_WAVE = `<svg viewBox="0 0 520 300" role="img" aria-label="Arsitektur wave: tiga kolam, target vs lolos ambang.">
<g font-family="var(--font-ui)">
<text x="10" y="52" font-size="12" fill="var(--chart-text)">Puncak (±70)</text>
<rect x="150" y="36" width="280" height="26" fill="var(--c1)" opacity="0.35"/>
<rect x="150" y="36" width="180" height="26" fill="var(--c1)" opacity="0.95"/>
<text x="155" y="30" font-size="11" fill="var(--chart-text)">target 70 → lolos 45</text>
<text x="10" y="122" font-size="12" fill="var(--chart-text)">Lebar (±76)</text>
<rect x="150" y="106" width="304" height="26" fill="var(--c2)" opacity="0.35"/>
<rect x="150" y="106" width="160" height="26" fill="var(--c2)" opacity="0.95"/>
<text x="155" y="100" font-size="11" fill="var(--chart-text)">target 76 → lolos 40</text>
<text x="10" y="192" font-size="12" fill="var(--chart-text)">Penyelamatan (±18)</text>
<rect x="150" y="176" width="72" height="26" fill="var(--c4)" opacity="0.35"/>
<rect x="150" y="176" width="68" height="26" fill="var(--c4)" opacity="0.95"/>
<text x="155" y="170" font-size="11" fill="var(--chart-text)">target 18 → lolos 17</text>
<text x="150" y="240" font-size="11" fill="var(--chart-text)">Total: target ±164 → lolos 102 (62%). Kekurangan 62 DITERIMA — ambang tidak diturunkan.</text>
<text x="10" y="272" font-size="11" fill="var(--chart-text)">Batang pucat = target; batang penuh = lolos ambang predictor 0,65.</text>
</g>
</svg>`;

const FIG_DISIPLIN = `<svg viewBox="0 0 520 220" role="img" aria-label="Menurunkan ambang menambah sim tetapi juga menambah false positive.">
<g font-family="var(--font-ui)">
<text x="10" y="40" font-size="12" fill="var(--chart-text)">ambang 0,65</text>
<rect x="150" y="22" width="204" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="150" y="16" font-size="11" fill="var(--chart-text)">102 sim, FP rendah</text>
<text x="10" y="110" font-size="12" fill="var(--chart-text)">ambang 0,55</text>
<rect x="150" y="92" width="260" height="26" fill="var(--c4)" opacity="0.9"/>
<rect x="354" y="92" width="90" height="26" fill="#e5484d" opacity="0.85"/>
<text x="150" y="86" font-size="11" fill="var(--chart-text)">+28 sim…</text>
<text x="358" y="86" font-size="11" fill="#e5484d">~11 di antaranya sampah</text>
<text x="10" y="170" font-size="11" fill="var(--chart-text)">Menurunkan ambang = membeli jumlah dengan mata uang kualitas.</text>
</g>
</svg>`;

export const wqb17: V2Lesson = {
  slug: "wqb17-merancang-wave",
  track: "WorldQuant Brain",
  module: "Strategi Riset Alpha",
  title: "WQB17 — Merancang Wave: Kolam Puncak, Kolam Lebar, Kolam Penyelamatan",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Wave yang “gagal” mencapai target — dan itu keputusan terbaiknya",
      prose: [
        "Tim merancang wave baru dengan arsitektur tiga kolam. Kolam Puncak: ±70 simulasi varian di sekitar juara-juara yang sudah terbukti — eksploitasi. Kolam Lebar: ±76 simulasi family baru yang ortogonal terhadap bank — eksplorasi. Kolam Penyelamatan: ±18 simulasi untuk struktur bagus yang turnover-nya ketinggian — operasi penyelamatan murah. Total target: ±164 sim.",
        "Predictor ML tim (akan dibedah di WQB18) menilai setiap kandidat dengan ambang 0,65. Hasilnya: 102 lolos. Puncak 45/70, Lebar 40/76, Penyelamatan 17/18. Kekurangan 62 sim dari target. Tekanan datang cepat: “Turunkan ambang ke 0,55 — biar 164 tercapai, wave terlihat penuh.”",
        "Keputusan tim: tidak. Ambang tetap 0,65. Kekurangan 62 diterima apa adanya, wave berjalan dengan 102 sim. Twist-nya terungkap dua wave kemudian, saat audit bank: kandidat-kandidat “tambahan” dari wave-wave lama — yang ambangnya pernah diturunkan demi target jumlah — punya tingkat kematian 3× lipat di bank dan tidak satu pun mencapai antrean submit. Yang “gagal” mencapai 164 ternyata adalah filter kualitas yang bekerja dengan benar.",
        "Setelah lesson ini kamu bisa: (1) merancang arsitektur wave tiga kolam dari kondisi stok; (2) menjelaskan kenapa ambang predictor tidak boleh diturunkan demi jumlah; (3) menghitung biaya false positive dari ambang yang dilonggarkan; (4) menempatkan kandidat ke kolam yang tepat.",
      ],
      tasks: [],
      note: {
        title: "Prasyarat ringkas",
        body: "Wave = satu batch simulasi yang dirancang sekaligus. Predictor = model ML penilai kandidat (skor 0–1; lolos bila ≥ ambang). Kolam = sub-batch dengan misi berbeda. Ingat gerbang kualitas: S ≥ 1,25 dan F ≥ 1; penalti bila TO > 0,4.",
      },
      reference: "Target jumlah itu keinginan; ambang itu kontrak kualitas.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga kolam, tiga misi",
      prose: [
        "Kolam Puncak (±70) = eksploitasi. Isinya varian di sekitar ekspresi juara: ganti operator sejenis, geser decay (lihat WQB16), tambah/buang satu filter. Hit rate-nya tertinggi karena berangkat dari struktur terbukti — tetapi korelasinya juga tinggi terhadap bank, jadi ia tidak menambah diversifikasi. Misi kolam ini: memeras juara sampai tetes terakhir.",
        "Kolam Lebar (±76) = eksplorasi. Isinya family baru yang ortogonal: korelasi rendah terhadap semua yang ada di bank. Hit rate-nya paling rendah — sebagian besar mati — tetapi satu yang hidup bernilai besar karena ia taruhan independen. Misi kolam ini: membeli tiket lotre yang tidak berkorelasi satu sama lain.",
        "Kolam Penyelamatan (±18) = operasi murah. Isinya kandidat ber-S/F baik yang gagal hanya karena TO > 0,4: struktur sudah terbukti, yang diperbaiki hanya biaya transaksi (decay lebih besar, filter turnover, delay). Hit rate-nya mengejutkan tingginya karena yang “rusak” bukan mesinnya, melainkan knalpotnya.",
        "Proporsi 70/76/18 bukan kitab suci — ia cerminan kondisi stok saat itu: juara segar masih banyak (Puncak besar), kebutuhan diversifikasi tinggi (Lebar terbesar), dan antrean kandidat ber-TO-tinggi menumpuk (Penyelamatan kecil tapi ada). Cara membaca figur: batang pucat = target, batang penuh = yang lolos ambang 0,65. Interpretasi: Penyelamatan hampir sempurna (17/18) — karena kandidatnya memang sudah setengah jadi; Lebar paling bocor (40/76) — wajar, itu sifat eksplorasi.",
      ],
      formula: String.raw`\text{Tingkat terima} = \frac{\text{lolos ambang}}{\text{target kolam}} \times 100\%`,
      formulaNote: "Wave nyata: 102/164 × 100% = 62,2%. Per kolam: Puncak 45/70 = 64%, Lebar 40/76 = 53%, Penyelamatan 17/18 = 94%. Angka ini BUKAN nilai rapor — ia sidik jari misi tiap kolam.",
      figure: {
        svg: FIG_WAVE,
        alt: "Batang target vs lolos untuk tiga kolam: Puncak 70→45, Lebar 76→40, Penyelamatan 18→17.",
        caption: "Target vs lolos ambang per kolam. Kekurangan 62 diterima — ambang tidak diturunkan.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kolam Penyelamatan = mengais sampah.” Bukan. Kandidatnya lolos S dan F — ia gagal di TO, yang justru paling bisa diperbaiki (WQB16 menunjukkan smoothing memangkas turnover). Di wave nyata, 17 dari 18 kandidat penyelamatan lolos ambang: tingkat terima 94%, tertinggi dari tiga kolam.",
      },
      hints: [
        "Puncak = varian juara; Lebar = family baru ortogonal; Penyelamatan = S/F baik + TO > 0,4.",
        "Tingkat terima rendah di Lebar itu wajar — eksplorasi memang bocor.",
      ],
      reference: "Puncak memeras, Lebar menjelajah, Penyelamatan memperbaiki.",
    },
    {
      id: "disiplin",
      eyebrow: "Langkah 3 · Konsep",
      title: "Disiplin ambang: jumlah boleh kurang, kualitas tidak",
      prose: [
        "Ambang predictor 0,65 adalah definisi operasional “kandidat yang layak disimulasikan”. Menurunkannya ke 0,55 demi mencapai 164 bukan “fleksibilitas” — ia mengubah definisi layak itu sendiri, diam-diam, tanpa mengubah ekspektasi kualitasnya. Wave terlihat penuh; bank diam-diam terpolusi.",
        "Hitung biayanya dengan angka. Menurunkan ambang menambah ±28 sim. Dari pengalaman tim, kandidat di rentang skor 0,55–0,65 punya tingkat false positive ~40%: ≈11 sim di antaranya tidak akan pernah lolos gerbang S/F. Itu 11 sim yang membakar budget komputasi, mengotori bank dengan baris mati, dan — paling mahal — memakan perhatian reviewer yang seharusnya membaca kandidat sungguhan.",
        "Ada asimetri yang jarang disadari: kekurangan 62 sim hanya berarti wave lebih kecil (rugi kesempatan yang terukur), sedangkan 11 false positive berarti bank lebih kotor (rugi kualitas yang menjalar ke semua keputusan berikutnya — triage, klaster, submit). Kesempatan yang hilang bisa dibeli kembali wave depan; kepercayaan pada bank yang rusak sulit dipulihkan.",
        "Cara membaca figur kedua: dua batang ambang. Interpretasi: batang bawah lebih panjang (+28 sim) tetapi ekor merahnya — ±11 sim sampah — adalah harga yang dibayar. Disiplin ambang = menolak membayar harga itu.",
      ],
      formula: String.raw`\text{Sampah ekspektasi} = n_{\text{tambahan}} \times P(\text{false positive} \mid \text{skor di } [0{,}55, 0{,}65))`,
      formulaNote: "Contoh: 28 × 0,40 ≈ 11 sim. Setiap poin ambang yang diturunkan membeli jumlah dengan mata uang kualitas — kursnya memburuk semakin rendah ambang digeser.",
      figure: {
        svg: FIG_DISIPLIN,
        alt: "Perbandingan ambang 0,65 (102 sim, FP rendah) vs 0,55 (+28 sim dengan ekor merah ~11 sim sampah).",
        caption: "Menurunkan ambang menambah sim — dan menanam sampah di bank.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Lebih banyak simulasi = lebih baik.” Tidak — lebih banyak simulasi BERKUALITAS = lebih baik. Simulasi adalah klaim atas perhatian: tiap baris di bank harus dibaca saat triage, dihitung saat klaster, dipertimbangkan saat submit. Baris sampah bukan netral; ia pajak atas semua baris bagus.",
      },
      hints: [
        "Kekurangan jumlah = rugi kesempatan (terukur, bisa ditebus). Polusi bank = rugi kualitas (menjalar).",
        "Ambang = definisi “layak”. Menggesernya = mengganti definisi diam-diam.",
      ],
      reference: "Ambang tetap, jumlah boleh kurang — jangan pernah sebaliknya.",
    },
    {
      id: "praktik",
      eyebrow: "Langkah 4 · Praktik",
      title: "Menempatkan kandidat & mengukur kolam",
      prose: [
        "Aturan penempatan tiga detik: (1) ekspresi ini varian dari juara yang sudah ada di bank? → Puncak; (2) family-nya belum ada di bank dan korelasinya rendah? → Lebar; (3) S ≥ 1,25, F ≥ 1, tetapi TO > 0,4? → Penyelamatan; (4) tidak masuk ketiganya? → bukan kandidat wave ini, kembalikan ke meja riset.",
        "Dua kebiasaan perancang wave yang baik. Pertama: ukur kolam dari stok, bukan dari harapan. Stok juara segar menipis? Kecilkan Puncak, besarkan Lebar. Antrean TO-tinggi menumpuk? Tambah slot Penyelamatan — ia kolam termurah per sim lolos. Kedua: tetapkan ambang SEBELUM melihat skor, dan tulis alasannya satu kalimat (“0,65 = presisi historis 80%”). Ambang yang ditetapkan setelah melihat distribusi skor bukan ambang — ia target jumlah yang menyamar.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Wave yang baik seperti portofolio: Puncak = obligasi (return stabil, korelasi tinggi), Lebar = saham spekulatif (banyak gagal, satu berhasil membayar semua), Penyelamatan = obligasi diskon (murah karena cacat kecil yang bisa diperbaiki). Jangan minta obligasi bertingkah seperti lotre.",
      },
      reference: "Tempatkan by sifat kandidat; ukur kolam by kondisi stok.",
    },
    {
      id: "lab-kolam",
      eyebrow: "Langkah 5 · Lab",
      title: "Tempatkan 10 kandidat ke kolam yang tepat",
      prose: [
        "Terapkan aturan penempatan dalam kode. Setiap kandidat punya tiga atribut struktural — `varian_juara`, `family_baru` — plus metrik S/F/TO dari sim sebelumnya. Urutan ceknya penting: Penyelamatan dulu (paling spesifik: S/F baik + TO > 0,4), lalu Puncak (varian juara), lalu Lebar (family baru dengan bar kualitas minimum S ≥ 1,10), sisanya “ditolak — kembalikan ke riset”.",
        "Hasil yang benar: Puncak 3, Lebar 3, Penyelamatan 2, ditolak 2. Dua yang ditolak: k5 — family baru tetapi kualitasnya di bawah bar minimum (kembali ke riset, bukan ke Lebar); k8 — bukan varian juara, bukan family baru, dan S/F-nya gagal (sampah — jangan ditempatkan di kolam mana pun).",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `kolam(k)` sesuai urutan aturan penempatan" },
        { id: "t2", text: "Jalankan: pastikan hitungan per kolam tercetak benar" },
      ],
      expected: "Lebar: 3\nPenyelamatan: 2\nPuncak: 3\nditolak: 2",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Semua kandidat harus masuk salah satu kolam.” Tidak — kolam keempat yang tak terlihat adalah “kembalikan ke riset”. Memaksa kandidat tanggung masuk wave = menurunkan ambang lewat pintu belakang.",
      },
      hints: [
        "Cek Penyelamatan dulu: S>=1.25 and F>=1 and TO>0.4.",
        "Lalu: varian_juara → Puncak; family_baru dan S>=1.10 → Lebar; else “ditolak”.",
      ],
      code: {
        starter: "# (nama, varian_juara, family_baru, S, F, TO) — JANGAN UBAH\nkandidat = [\n    (\"k1\", True, False, 1.42, 1.10, 0.30), (\"k2\", False, True, 1.20, 1.00, 0.25),\n    (\"k3\", False, False, 1.31, 1.05, 0.52), (\"k4\", True, False, 1.36, 1.02, 0.28),\n    (\"k5\", False, True, 0.90, 0.80, 0.20), (\"k6\", True, False, 1.38, 1.08, 0.31),\n    (\"k7\", False, True, 1.15, 1.00, 0.33), (\"k8\", False, False, 1.10, 0.95, 0.30),\n    (\"k9\", False, True, 1.33, 1.08, 0.29), (\"k10\", False, False, 1.27, 1.00, 0.55),\n]\n\n# TULIS KODEMU\ndef kolam(k):\n    nama, vj, fb, s, f, to = k\n    return \"ditolak\"\n\nfrom collections import Counter\nprint(\"\\n\".join(f\"{k}: {v}\" for k, v in sorted(Counter(kolam(k) for k in kandidat).items())))\n",
        lockLines: 12,
        solution: "# (nama, varian_juara, family_baru, S, F, TO) — JANGAN UBAH\nkandidat = [\n    (\"k1\", True, False, 1.42, 1.10, 0.30), (\"k2\", False, True, 1.20, 1.00, 0.25),\n    (\"k3\", False, False, 1.31, 1.05, 0.52), (\"k4\", True, False, 1.36, 1.02, 0.28),\n    (\"k5\", False, True, 0.90, 0.80, 0.20), (\"k6\", True, False, 1.38, 1.08, 0.31),\n    (\"k7\", False, True, 1.15, 1.00, 0.33), (\"k8\", False, False, 1.10, 0.95, 0.30),\n    (\"k9\", False, True, 1.33, 1.08, 0.29), (\"k10\", False, False, 1.27, 1.00, 0.55),\n]\n\n# TULIS KODEMU\ndef kolam(k):\n    nama, vj, fb, s, f, to = k\n    if s >= 1.25 and f >= 1 and to > 0.4:\n        return \"Penyelamatan\"\n    if vj:\n        return \"Puncak\"\n    if fb and s >= 1.10:\n        return \"Lebar\"\n    return \"ditolak\"\n\nfrom collections import Counter\nprint(\"\\n\".join(f\"{k}: {v}\" for k, v in sorted(Counter(kolam(k) for k in kandidat).items())))\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Puncak = 3", msg: "k1, k4, k6: varian juara dengan TO aman.", pattern: "Puncak: 3" },
          { kind: "stdout_matches", task: "t2", label: "Penyelamatan = 2", msg: "k3 dan k10 (S/F baik, TO > 0,4).", pattern: "Penyelamatan: 2" },
          { kind: "stdout_matches", task: "t2", label: "ditolak = 2", msg: "k5 (family baru di bawah bar kualitas) dan k8 (S/F gagal).", pattern: "ditolak: 2" }
        ],
      },
      reference: "Urutan cek: Penyelamatan → Puncak → Lebar → tolak.",
    },
    {
      id: "lab-ambang",
      eyebrow: "Langkah 6 · Lab",
      title: "Harga menurunkan ambang: hitung sampahnya",
      prose: [
        "Simulasikan keputusan menurunkan ambang 0,65 → 0,55 pada 12 kandidat berskor predictor, masing-masing berlabel benar (`1` = memang layak). Hitung: berapa tambahan sim yang “lolos”, dan berapa di antaranya false positive (label 0). Inilah matematika di balik figur disiplin.",
        "Hasil: ambang 0,65 meloloskan 7 kandidat dengan 1 FP; ambang 0,55 meloloskan 10 dengan 4 FP. Tiga sim tambahan “membeli” 3 FP — rasio 1:1. Itulah kurs mata uang kualitas saat ambang digeser turun.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lolos` dan `fp` untuk tiap ambang" },
        { id: "t2", text: "Jalankan: pastikan perbandingannya tercetak" },
      ],
      expected: "ambang 0.65: lolos 7, FP 1\nambang 0.55: lolos 10, FP 4\ntambahan: 3 sim, 3 di antaranya FP",
      hints: [
        "lolos = skor >= ambang; fp = lolos dan label == 0.",
        "tambahan = selisih lolos; FP tambahan = selisih fp.",
      ],
      code: {
        starter: "# (skor predictor, label benar 1=layak) — JANGAN UBAH\ndata = [(0.91,1),(0.83,1),(0.77,1),(0.71,1),(0.68,1),(0.66,1),\n        (0.65,0),(0.63,0),(0.58,0),(0.55,0),(0.52,1),(0.49,0)]\n\n# TULIS KODEMU\ndef stats(ambang):\n    return (0, 0)  # (lolos, FP)\n\nl1, f1 = stats(0.65)\nl2, f2 = stats(0.55)\nprint(f\"ambang 0.65: lolos {l1}, FP {f1}\")\nprint(f\"ambang 0.55: lolos {l2}, FP {f2}\")\nprint(f\"tambahan: {l2-l1} sim, {f2-f1} di antaranya FP\")\n",
        lockLines: 9,
        solution: "# (skor predictor, label benar 1=layak) — JANGAN UBAH\ndata = [(0.91,1),(0.83,1),(0.77,1),(0.71,1),(0.68,1),(0.66,1),\n        (0.65,0),(0.63,0),(0.58,0),(0.55,0),(0.52,1),(0.49,0)]\n\n# TULIS KODEMU\ndef stats(ambang):\n    lolos = [label for skor, label in data if skor >= ambang]\n    fp = sum(1 for label in lolos if label == 0)\n    return (len(lolos), fp)\n\nl1, f1 = stats(0.65)\nl2, f2 = stats(0.55)\nprint(f\"ambang 0.65: lolos {l1}, FP {f1}\")\nprint(f\"ambang 0.55: lolos {l2}, FP {f2}\")\nprint(f\"tambahan: {l2-l1} sim, {f2-f1} di antaranya FP\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "ambang 0,65: 7 lolos, 1 FP", msg: "Skor ≥ 0,65: 7 kandidat, 1 berlabel 0.", pattern: "ambang 0\\.65: lolos 7, FP 1" },
          { kind: "stdout_matches", task: "t2", label: "tambahan 3 sim, 3 FP", msg: "Menurunkan ambang menambah 3 sim — semuanya FP.", pattern: "tambahan: 3 sim, 3 di antaranya FP" }
        ],
      },
      reference: "Setiap poin ambang yang turun = kurs kualitas yang memburuk.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Merancang wave dari kondisi stok",
      prose: [
        "Satu: stok juara segar banyak → perbesar Puncak; eksploitasi selagi panas. Dua: juara menipis, bank itu-itu saja → perbesar Lebar; diversifikasi jadi prioritas. Tiga: antrean kandidat TO > 0,4 ber-S/F baik menumpuk → tambah slot Penyelamatan; ia kolam termurah per sim lolos. Empat: lolos ambang < target → terima kekurangan, JANGAN turunkan ambang; catat kekurangannya sebagai utang eksplorasi wave depan. Lima: lolos > target → ambang tetap; surplus = cadangan, bukan alasan melonggarkan.",
        "Aturan praktis 10 detik: ambang ditetapkan sebelum skor dilihat; jumlah boleh kurang, kualitas tidak.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Perancang wave yang baik seperti koki yang belanja sesuai isi kulkas (stok), bukan sesuai foto di majalah (target 164). Kolam mengikuti stok; ambang mengikuti sejarah presisi — keduanya tidak mengikuti keinginan.",
      },
      reference: "Kolam by stok, ambang by sejarah, jumlah by hasil — bukan by keinginan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Tekanan 0,55: simulasi keputusannya",
      prose: [
        "Data wave nyata: target ±164 (Puncak 70, Lebar 76, Penyelamatan 18), ambang 0,65 → lolos 102 (45/40/17). Seorang pemangku kepentingan mengusulkan ambang 0,55: proyeksi +28 sim (mayoritas dari Lebar), estimasi FP 40% → ±11 sim sampah masuk bank. Argumennya: “wave terlihat penuh, moral tim terjaga.”",
        "Pertanyaan: turunkan atau tidak? Pembahasan: (1) 28 sim tambahan × 40% FP = 11 baris mati di bank — pajak perhatian untuk semua triage berikutnya; (2) moral tim yang dibangun di atas angka semu runtuh saat audit bank menunjukkan tingkat kematian 3× lipat — kepercayaan lebih mahal dari moral sesaat; (3) kekurangan 62 sim = utang eksplorasi yang bisa dibayar wave depan dengan stok lebih baik, bukan dengan standar lebih rendah. Keputusan: ambang tetap 0,65; wave berjalan dengan 102 sim; kekurangan dicatat sebagai backlog Lebar prioritas wave berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke riset",
        type: "risk",
        body: "Menurunkan ambang demi target jumlah adalah Goodhart's Law versi riset alpha: ketika ukuran (jumlah sim) menjadi target, ia berhenti menjadi ukuran yang baik (kualitas bank). Lindungi ukuran kualitasmu dari target kuantitas.",
      },
      reference: "102 sim jujur > 164 sim semu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang arsitektur dan disiplin wave.",
      ],
      tasks: [],
      summary: [
        "Wave tiga kolam: Puncak (eksploitasi juara), Lebar (eksplorasi ortogonal), Penyelamatan (perbaiki TO).",
        "Proporsi kolam mengikuti kondisi stok, bukan angka keramat.",
        "Ambang predictor = definisi “layak”; menurunkannya = mengganti definisi diam-diam.",
        "Kekurangan jumlah = rugi kesempatan; polusi bank = rugi kualitas yang menjalar.",
        "Aturan 10 detik: ambang ditetapkan sebelum skor dilihat; jumlah boleh kurang.",
      ],
      next: { label: "WQB18 — ML Predictor: Mesin Penilai Kandidat", href: "/v2/learn/wqb18-ml-predictor" },
      quiz: [
        {
          q: "Kolam Puncak berisi…",
          options: [
            { text: "Varian di sekitar juara yang sudah terbukti", why: "Benar — eksploitasi struktur yang sudah hidup.", correct: true },
            { text: "Family baru yang belum pernah dicoba", why: "Itu Kolam Lebar — misi eksplorasi, bukan eksploitasi." },
            { text: "Kandidat gagal yang diuji ulang", why: "Itu Kolam Penyelamatan — spesifik untuk S/F baik + TO > 0,4." }
          ],
        },
        {
          q: "Kenapa ambang predictor tidak diturunkan saat lolos < target?",
          options: [
            { text: "Ambang = definisi “layak”; menggesernya mempolusi bank dengan false positive", why: "Tepat — 28 sim tambahan ≈ 11 sampah di kasus nyata.", correct: true },
            { text: "Karena 102 sudah cukup untuk semua kebutuhan", why: "Bukan soal cukup — soal tidak membeli jumlah dengan kualitas." },
            { text: "Karena komputasi tidak cukup untuk 164 sim", why: "Komputasi bukan masalahnya; kualitas bank-lah masalahnya." }
          ],
        },
        {
          q: "Kandidat S=1,31, F=1,05, TO=0,52 masuk kolam…",
          options: [
            { text: "Penyelamatan — S/F baik, hanya TO yang bermasalah", why: "Benar. Struktur terbukti + cacat yang bisa diperbaiki.", correct: true },
            { text: "Puncak — karena S-nya tinggi", why: "Puncak khusus varian juara; TO 0,52 butuh diperbaiki dulu." },
            { text: "Lebar — karena perlu diversifikasi", why: "Lebar untuk family baru ortogonal, bukan untuk kandidat cacat TO." }
          ],
        },
        {
          q: "“Lebih banyak simulasi = lebih baik” salah karena…",
          options: [
            { text: "Tiap baris bank memakan perhatian triage; baris sampah = pajak atas baris bagus", why: "Benar — kualitas bank menentukan kualitas semua keputusan hilir.", correct: true },
            { text: "Simulasi itu gratis sehingga jumlah tidak penting", why: "Simulasi tidak gratis: budget komputasi dan perhatian reviewer terbatas." },
            { text: "Predictor tidak bisa menilai banyak kandidat", why: "Predictor justru dibuat untuk menilai banyak kandidat — masalahnya ambang, bukan volume." }
          ],
        },
        {
          q: "Tingkat terima Kolam Lebar (53%) lebih rendah dari Penyelamatan (94%). Artinya…",
          options: [
            { text: "Wajar — eksplorasi memang bocor, penyelamatan memang hampir jadi", why: "Benar. Angka ini sidik jari misi kolam, bukan rapor.", correct: true },
            { text: "Kolam Lebar gagal dan harus dihapus", why: "Menghapus eksplorasi = bank berhenti terdiversifikasi = bunuh diri jangka panjang." },
            { text: "Semua budget harus dipindah ke Penyelamatan", why: "Penyelamatan hanya sebesar antrean TO-tingginya; ia tidak menghasilkan family baru." }
          ],
        }
      ],
      reference: "Rancang wave dari stok, jaga ambang dari tekanan.",
    },
  ],
};
