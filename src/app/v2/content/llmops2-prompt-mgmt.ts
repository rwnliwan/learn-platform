import type { V2Lesson } from "../lib/types";

const TIMELINE_SVG = `<svg viewBox="0 0 480 190" role="img" aria-label="Timeline tiga versi prompt: v1.0 resolusi 80 persen, v1.1 turun ke 68 persen, rollback ke v1.0 mengembalikan 80 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="40" y1="150" x2="460" y2="150"/><line x1="40" y1="110" x2="460" y2="110"/><line x1="40" y1="70" x2="460" y2="70"/><line x1="40" y1="30" x2="460" y2="30"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)"><text x="30" y="153">60%</text><text x="30" y="113">70%</text><text x="30" y="73">80%</text><text x="30" y="33">90%</text></g>
<polyline points="90,70 240,118 390,70" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<circle cx="90" cy="70" r="6" fill="var(--c1)"/><circle cx="240" cy="118" r="6" fill="var(--c4)"/><circle cx="390" cy="70" r="6" fill="var(--c2)"/>
<g font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">
<text x="90" y="172" font-weight="600">v1.0</text><text x="90" y="186">resolusi 80%</text>
<text x="240" y="172" font-weight="600">v1.1 "lebih ramah"</text><text x="240" y="186">resolusi 68% &#8595;</text>
<text x="390" y="172" font-weight="600">rollback v1.0</text><text x="390" y="186">resolusi 80% &#8593;</text>
</g></svg>`;

const LLMOPS2_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Pass rate golden set: v14 94 persen, v15 81 persen setelah penambahan kata ramah."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text><rect x="85.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c1)"/><text x="150.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">94%: SEHAT</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">v14</text><rect x="294.7" y="42.1" width="129.6" height="137.9" rx="3" fill="var(--c4)"/><text x="359.5" y="36.1" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">81%: REGRESI</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">v15</text><line x1="46" y1="26.8" x2="464" y2="26.8" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="20.8" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">ambang 90%</text></svg>`;

export const llmops2: V2Lesson = {
  slug: "llmops2-prompt-mgmt",
  track: "LLMOps",
  module: "Fondasi",
  title: "LLMOps2 — Prompt Management & Versioning",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Prompt `final-final-2` yang tidak bisa di-rollback",
      prose: [
        "KopiChain, startup kopi langganan, punya chatbot CS yang lumayan. Suatu Senin, tim support mengedit prompt langsung di dashboard vendor — menambahkan `sebutkan nama pelanggan agar terasa personal`. Terasa lebih baik saat dibaca. Dua minggu kemudian, metrik bicara: tingkat resolusi tiket turun dari 80% ke 68%. Seseorang pasti mengubah sesuatu. Tapi siapa, kapan, dan apa tepatnya yang berubah — tidak ada yang tahu. Tidak ada versioning, tidak ada changelog, tidak ada tombol rollback.",
        "Twist-nya: prompt yang `terasa lebih baik` bagi manusia justru menurunkan metrik. Menyebut nama pelanggan membuat jawaban lebih panjang, melewati batas token, dan bagian instruksi penting terpotong. Intuisi manusia tentang `prompt yang bagus` ternyata berkorelasi buruk dengan metrik produksi — tanpa versioning dan evaluasi, tim buta terhadap regresi yang mereka buat sendiri.",
        "Lesson ini membangun fondasi operasionalnya: prompt sebagai artefak berversi — apa saja yang masuk ke dalam satu versi, bagaimana men-diff dua versi, dan kapan sebuah perubahan layak disebut `rilis`.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa prompt harus diperlakukan sebagai kode (versioning, review, rollback); (2) menghitung biaya ekspektasi regresi dari sebuah perubahan prompt; (3) merancang regression test untuk prompt dengan checker yang tepat; (4) memutuskan kapan perubahan prompt boleh auto-deploy vs butuh persetujuan.",
      ],
      tasks: [],
      note: {
        title: "Mitos: prompt bagus = prompt yang enak dibaca manusia",
        type: "pitfall",
        body: "Yang benar: kualitas prompt diukur dari metrik perilaku sistem (resolusi, format, kepatuhan), bukan dari kesan membaca. Prompt v1.1 KopiChain terbaca lebih ramah — dan menurunkan resolusi 12 poin. Selalu uji perubahan prompt terhadap golden set sebelum menilai.",
      },
      reference: "Satu versi prompt = system prompt + template + config + metadata (siapa, kapan, mengapa).",
    },
    {
      id: "artefak",
      eyebrow: "Langkah 2 · Konsep",
      title: "Anatomi satu versi prompt",
      prose: [
        "Satu `versi prompt` bukan sekadar string. Ia paket berisi empat komponen. Pertama, `system prompt`: instruksi peran dan aturan main. Kedua, template: bagian yang diisi variabel (`nama`, `riwayat chat`, `konteks dokumen`). Ketiga, konfigurasi: `temperature`, `max_tokens`, `top_p`, dan pilihan model. Keempat, metadata: siapa mengubah, kapan, mengapa (tiket/hipotesis), dan hasil evaluasinya.",
        "Keempatnya harus di-version bersama. Mengubah `temperature` dari 0,2 ke 0,7 tanpa mencatat sama berbahayanya dengan mengubah teks prompt — perilakunya bergeser tapi tidak ada yang tahu penyebabnya. Registry prompt yang baik menyimpan snapshot lengkap keempat komponen untuk setiap versi, sehingga setiap perilaku produksi bisa ditelusur ke tepat satu versi.",
        "💡 Intuisi: versioning prompt mengikuti semver secara longgar — `major` = perilaku bisa berubah (ubah instruksi inti), `minor` = penajaman tanpa mengubah kontrak (perbaiki contoh), `patch` = typo/format. Yang penting bukan angkanya, melainkan jujur soal ekspektasi dampak.",
      ],
      formula: String.raw`\text{versi} = (\text{system}, \text{template}, \text{config}, \text{metadata})`,
      formulaNote: "Satu versi = tuple lengkap. Mengubah satu elemen = versi baru. Tidak ada `edit kecil yang tidak perlu dicatat`.",
      tasks: [],
      note: {
        title: "Mitos: cukup simpan teks prompt-nya saja",
        type: "pitfall",
        body: "Yang benar: teks yang sama dengan temperature berbeda adalah sistem yang berbeda. Insiden klasik: teks prompt di-rollback ke v1.0 tapi temperature tetap 0,7 (dari eksperimen v1.1) — regresi tidak hilang dan tim menyimpulkan `rollback tidak mempan`, padahal yang di-rollback tidak lengkap.",
      },
      reference: "Snapshot = system + template + config + metadata. Selalu lengkap, selalu bersama.",
    },
    {
      id: "diff-rollback",
      eyebrow: "Langkah 3 · Konsep",
      title: "Diff, changelog, dan rollback",
      prose: [
        "Tiga operasi inti registry prompt. `Diff`: bandingkan dua versi baris per baris — seperti `git diff` untuk prompt — sehingga reviewer melihat tepat apa yang berubah sebelum menyetujui. `Changelog`: setiap versi mencatat hipotesis (`mengapa diubah`) dan hasil evaluasi (`apa dampaknya`), bukan sekadar `update prompt`. `Rollback`: kemampuan mengembalikan produksi ke versi sebelumnya dalam hitungan menit, bukan hari.",
        "Aturan promosi yang sehat: tidak ada versi yang naik ke produksi tanpa (a) diff yang di-review manusia, (b) lolos regression test golden set, dan (c) pemilik yang jelas. KopiChain melanggar ketiganya — edit langsung di dashboard, tanpa review, tanpa test.",
        "💡 Intuisi: rollback adalah fitur keselamatan, bukan pengakuan gagal. Tim yang takut rollback akan menunda perbaikan; tim yang bisa rollback dalam 5 menit berani bereksperimen lebih agresif — paradoksnya, mereka justru lebih aman.",
        "💡 Intuisi: changelog prompt yang baik menjawab `mengapa`, bukan `apa`. `Apa`-nya sudah terlihat di diff; `mengapa`-nya (`hipotesis: menyebut nama menaikkan kepuasan`) adalah pengetahuan yang hilang jika tidak dicatat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyimpan 47 versi tanpa tahu mana yang di produksi. Registry tanpa penanda `current production version` sama dengan tidak punya registry — saat incident, tim tetap menebak. Setiap registry wajib punya pointer eksplisit ke versi yang sedang live.",
      },
      reference: "Diff untuk review, changelog untuk alasan, pointer produksi untuk incident response.",
    },
    {
      id: "lab-registry",
      eyebrow: "Langkah 4 · Lab",
      title: "Bangun registry prompt mini + diff",
      prose: [
        "Lab ini mensimulasikan registry prompt KopiChain: tiga versi tersimpan sebagai dictionary. Kamu akan menghitung diff antara v1.0 dan v1.1 (berapa baris berubah), lalu melakukan rollback produksi dari v1.2 kembali ke v1.0.",
        "Coba eksplorasi: hitung juga diff v1.1 vs v1.2. Versi mana yang perubahannya paling berisiko menurutmu — dan apakah jumlah baris diff berkorelasi dengan tingkat risiko?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_diff` = baris tambah/hapus antara v1.0 dan v1.1" },
        { id: "t2", text: "Lakukan rollback: set `current` ke `\"v1.0\"`" },
        { id: "t3", text: "Cetak `n_diff` dan `current` dengan `print`" },
      ],
      expected: "n_diff=3  current=v1.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung baris `@@` dan `---`/`+++` sebagai perubahan. Header diff bukan perubahan konten — saring hanya baris yang diawali `+`/`-` konten, bukan marker file.",
      },
      hints: [
        "Pakai difflib.unified_diff lalu saring baris yang diawali + atau -.",
        "Abaikan baris penanda file (+++ dan ---).",
        "n_diff = len([l for l in diff if (l.startswith('+') or l.startswith('-')) and not l.startswith(('+++','---'))])",
      ],
      code: {
        starter: `import difflib\n\nregistry = {\n    "v1.0": "Kamu asisten CS Bank Nusa.\\nJawab singkat dan sopan.\\nGunakan Bahasa Indonesia.",\n    "v1.1": "Kamu asisten CS Bank Nusa.\\nJawab singkat, sopan, dan sebutkan nama nasabah.\\nGunakan Bahasa Indonesia.\\nJangan mengarang nomor rekening.",\n    "v1.2": "Kamu adalah asisten CS Bank Nusa yang ramah.\\nJawab singkat, sopan, dan sebutkan nama nasabah.\\nGunakan Bahasa Indonesia.\\nJangan mengarang nomor rekening.",\n}\ncurrent = "v1.2"\n\n# TULIS KODEMU: diff v1.0 vs v1.1, lalu rollback ke v1.0\ndiff = list(difflib.unified_diff(registry["v1.0"].splitlines(), registry["v1.1"].splitlines(), lineterm=""))\nn_diff = \ncurrent = \n\nprint(f"n_diff={n_diff}  current={current}")`,
        lockLines: 11,
        solution: `import difflib\n\nregistry = {\n    "v1.0": "Kamu asisten CS Bank Nusa.\\nJawab singkat dan sopan.\\nGunakan Bahasa Indonesia.",\n    "v1.1": "Kamu asisten CS Bank Nusa.\\nJawab singkat, sopan, dan sebutkan nama nasabah.\\nGunakan Bahasa Indonesia.\\nJangan mengarang nomor rekening.",\n    "v1.2": "Kamu adalah asisten CS Bank Nusa yang ramah.\\nJawab singkat, sopan, dan sebutkan nama nasabah.\\nGunakan Bahasa Indonesia.\\nJangan mengarang nomor rekening.",\n}\ncurrent = "v1.2"\n\n# TULIS KODEMU: diff v1.0 vs v1.1, lalu rollback ke v1.0\ndiff = list(difflib.unified_diff(registry["v1.0"].splitlines(), registry["v1.1"].splitlines(), lineterm=""))\nn_diff = len([l for l in diff if (l.startswith("+") or l.startswith("-")) and not l.startswith(("+++", "---"))])\ncurrent = "v1.0"\n\nprint(f"n_diff={n_diff}  current={current}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_diff", value: 3, tol: 1e-9, label: "`n_diff` seharusnya 3", msg: "1 baris diubah + 1 baris ditambah = 3 baris diff konten (1 hapus, 2 tambah)." },
          { kind: "equal", task: "t2", name: "current", value: "v1.0", label: "`current` seharusnya v1.0", msg: "Rollback = set pointer produksi ke v1.0." },
          { kind: "stdout_matches", task: "t3", pattern: "n_diff=3\\s+current=v1\\.0", label: "`print` menampilkan diff dan versi", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "difflib.unified_diff untuk diff; pointer `current` untuk versi produksi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan edit langsung boleh, kapan harus lewat registry",
      prose: [
        "Lima skenario. Satu: eksperimen di sandbox pribadi, belum ada user → edit langsung boleh, tapi catat yang menjanjikan ke registry. Dua: staging dengan traffic tiruan → wajib lewat registry + regression test; ini gerbang terakhir sebelum produksi. Tiga: produksi live → tidak ada edit langsung; semua perubahan = versi baru + review + test + canary.",
        "Empat: hotfix incident (jawaban bocor, format rusak) → boleh bypass antrean review, tapi tetap buat versi baru di registry (jangan edit versi lama!) dan tulis postmortem. Lima: perubahan hanya config (`temperature` 0,2 → 0,3) → tetap versi baru; config adalah bagian dari paket versi.",
        "Aturan praktis 10 detik: `kalau user bisa merasakannya, itu rilis`. Rilis butuh versi, review, dan test — tanpa kecuali. Satu-satunya yang boleh tanpa versi adalah coretan di sandbox yang tidak pernah menyentuh traffic.",
      ],
      figure: {
        svg: TIMELINE_SVG,
        alt: "Timeline tiga versi prompt: v1.0 resolusi 80 persen, v1.1 turun ke 68 persen, rollback ke v1.0 mengembalikan 80 persen.",
        caption: "Cara membaca: sumbu X = urutan versi, sumbu Y = tingkat resolusi tiket. Titik v1.1 turun 12 poin setelah perubahan `lebih ramah`. Interpretasi: tanpa versioning, tim tidak akan tahu versi mana yang menyebabkan penurunan — dengan versioning, rollback satu langkah mengembalikan metrik dalam hitungan menit.",
      },
      tasks: [],
      note: {
        title: "Mitos: hotfix boleh edit versi lama langsung",
        type: "pitfall",
        body: "Yang benar: hotfix = versi BARU yang dipromosikan cepat, bukan edit versi lama. Mengedit versi lama merusak audit trail: dua perilaku berbeda mengklaim nomor versi yang sama, dan kamu tidak akan pernah bisa mereproduksi incident-nya.",
      },
      reference: "Sandbox bebas; staging wajib registry+test; produksi wajib versi+review+canary; hotfix = versi baru yang cepat.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Harga 12 poin resolusi yang hilang",
      prose: [
        "KopiChain memproses 5.000 tiket per bulan. Resolusi turun dari 80% ke 68%: selisih 12 poin = 600 tiket tambahan yang gagal diselesaikan bot dan harus dieskalasi ke agen manusia. Biaya eskalasi Rp15.000 per tiket → 600 × 15.000 = Rp9.000.000 per bulan. Selama dua minggu sebelum regresi disadari, sekitar Rp4.500.000 terbuang — ditambah dua minggu waktu tim menebak-nebak penyebabnya.",
        "Pertanyaan analisis: (a) jika tim punya registry + regression test, pada titik mana Rp9 juta/bulan ini bisa dicegah? (b) tim berargumen `toh cuma 12%, masih 68% kok` — apa yang salah dari argumen ini? (c) rancang aturan promosi 3 baris untuk KopiChain.",
        "Jawaban yang defensibel: (a) di gerbang staging — regression test akan menangkap penurunan sebelum menyentuh produksi, biaya pencegahan mendekati nol. (b) 12 poin dari 5.000 tiket = 600 manusia yang kecewa tiap bulan; metrik relatif menyembunyikan dampak absolut. (c) contoh: `1) semua perubahan = versi baru di registry; 2) lolos golden set + review sebelum produksi; 3) pointer produksi selalu eksplisit dan bisa di-rollback 5 menit.`",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regresi prompt adalah risiko operasional yang tidak terlihat di laporan keuangan — ia muncul sebagai `biaya CS naik` atau `kepuasan turun`, bukan `prompt rusak`. Analis yang bisa menghubungkan metrik produk ke artefak (versi prompt) adalah jembatan antara engineering dan bisnis.",
      },
      reference: "600 tiket × Rp15.000 = Rp9 juta/bulan. Pencegah termurah = gerbang staging.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Biaya perubahan prompt: regresi yang bisa dihitung",
      prose: [
        "Tim NusaBank mengubah satu kalimat system prompt (`jawab singkat` → `jawab singkat dan ramah`) — dan 3 hari kemudian CS melaporkan format tanggal rusak di 12% sesi. Tidak ada yang menghubungkan keduanya selama 3 hari, karena `hanya mengubah prompt`. Mari hitung biaya `hanya` itu: 12% × 1.200 sesi/hari × 72 jam = 10.368 sesi terdampak; 15% di antaranya butuh penanganan manual Rp12.000 → Rp18,7 juta. Satu kalimat = Rp18,7 juta. Inilah mengapa prompt adalah kode: perubahannya punya blast radius.",
        "Setiap perubahan prompt punya EKSPEKTASI BIAYA REGRESI: E = p_regresi × dampak. p_regresi untuk perubahan `kecil` (1 kalimat): dari data historis tim, ~8% perubahan kecil menyebabkan regresi terdeteksi. Dampak rata-rata regresi: Rp18,7 juta (contoh di atas). E = 0,08 × Rp18,7jt ≈ Rp1,5 juta per perubahan kecil. Biaya regression test penuh (200 kasus golden × Rp500): Rp100 ribu. Rp100 ribu untuk mengasuransikan Rp1,5 juta ekspektasi — dan mencegah Rp18,7 juta realisasi. Test yang `mahal` ternyata murah.",
        "Klasifikasikan perubahan prompt by risiko, seperti klasifikasi kode. RISIKO RENDAH: typo, contoh tambahan yang tidak mengubah instruksi → regression ringan (50 kasus) + auto-deploy boleh. RISIKO SEDANG: kalimat instruksi baru, urutan diubah → regression penuh (200 kasus) + butuh 1 reviewer. RISIKO TINGGI: system prompt, format output, bahasa → regression penuh + canary 5% (LLMOps10) + 2 reviewer. Tanpa klasifikasi, semua perubahan diperlakukan sama: yang kecil terhambat birokrasi, yang besar lolos tanpa pengawalan.",
        "Contoh penerapan klasifikasi: perubahan `jawab singkat` → `jawab singkat dan ramah` = RISIKO SEDANG (kalimat instruksi). Seharusnya: regression penuh 200 kasus. Jika dijalankan, kasus `format tanggal YYYY-MM-DD` akan MERAH — karena `ramah` membuat model menambahkan kata pengantar (`Tentu, tanggalnya adalah...`) yang merusak parser. Rp100 ribu test menangkap Rp18,7 juta insiden SEBELUM deploy. Klasifikasi bukan birokrasi; ia adalah cara murah mengarahkan test ke tempat yang paling mungkin berdarah.",
      ],
      formula: String.raw`E[\text{regresi}] = p_{regresi} \times \text{dampak}`,
      formulaNote: "E[regresi] = ekspektasi biaya per perubahan prompt; p_regresi = peluang perubahan menyebabkan regresi (dari data historis, ~8% untuk perubahan kecil); dampak = biaya rata-rata satu insiden regresi. Bandingkan dengan biaya regression test — jika test < E, test selalu layak.",
      tasks: [],
      note: {
        title: "💡 Intuisi: `hanya prompt` adalah `hanya kode` yang tidak diakui",
        body: "Tidak ada engineer yang deploy `hanya satu baris kode` tanpa test. Tapi `hanya satu kalimat prompt` sering lolos tanpa apa pun — padahal blast radius-nya sama. Perlakukan prompt dengan disiplin yang sama: version, test, review, canary. Bedakan hanya pada BIAYA test-nya (murah untuk LLM).",
      },
      reference: "Klasifikasikan perubahan by risiko; arahkan test termahal ke risiko tertinggi.",
    },
    {
      id: "pendalaman-angka",
      eyebrow: "Langkah 8 · Membaca Angka",
      title: "Pass rate per versi: membaca riwayat prompt",
      prose: [
        "Prompt `v14` (sebelum `ramah`): pass rate 94% (188/200). Prompt `v15` (sesudah): 81% (162/200). Selisih 26 kasus. Tapi JANGAN hanya lihat total — lihat POLANYA. Dari 26 regresi: 19 kasus format tanggal/angka (sistematis!), 4 kasus gaya bahasa, 3 kasus flaky (lolos-gagal acak antar run). Pola 19 kasus format = satu akar masalah (kata pengantar `ramah`), diperbaiki dengan satu baris (`langsung jawab tanpa pengantar`). Tanpa breakdown pola, tim akan `memperbaiki` 26 kasus satu per satu — 26x kerja untuk 1 akar masalah.",
        "Flaky 3 kasus itu penting dikenali: kasus yang lolos di v14-run-1 tapi gagal di v14-run-2 (tanpa perubahan apa pun) = nondeterminisme (LLMOps1), bukan regresi. Aturan: jalankan golden set 3x per versi; kasus yang hasilnya tidak konsisten = tandai FLAKY, keluarkan dari hitungan regresi (tapi catat untuk diperketat checker-nya). Jika tidak, setiap perbandingan versi akan `menemukan` regresi palsu dan tim berhenti percaya pada regression test.",
        "Angka yang sehat untuk dashboard prompt: pass rate per versi (tren!), jumlah regresi sistematis vs flaky, dan `waktu dari perubahan ke deteksi`. Target: regresi terdeteksi < 10 menit setelah commit prompt (regression otomatis di CI). NusaBank sebelum disiplin ini: 3 hari. Sesudah: 8 menit. Selisih 3 hari = Rp18,7 juta vs Rp100 ribu. Dashboard ini yang membuat `prompt adalah kode` menjadi nyata, bukan slogan.",
      ],
      figure: {
        svg: LLMOPS2_DEEP_SVG,
        alt: "Diagram batang pass rate: v14 94% (sehat), v15 81% (regresi, di bawah ambang 90%).",
        caption: "Cara membaca: tinggi batang = pass rate 200 kasus golden set; garis putus-putus = ambang minimum 90%. Interpretasi: satu kata (`ramah`) menjatuhkan 13pp — dan 19 dari 26 regresi berpola sama (format), artinya satu akar masalah. Jangan perbaiki 26 kasus; perbaiki 1 akar.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: baca polanya, bukan totalnya",
        body: "Selisih 26 kasus terlihat seperti 26 masalah. Breakdown pola (19 format + 4 gaya + 3 flaky) menunjukkan hanya 1 masalah nyata + 1 perbaikan checker. Total menakut-nakuti; pola menunjukkan jalan. Selalu tampilkan regresi per kategori di dashboard, bukan angka tunggal.",
      },
      reference: "3x run per versi untuk pisahkan flaky vs regresi. Target deteksi < 10 menit.",
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
        "Satu versi prompt = system + template + config + metadata; ubah satu elemen = versi baru.",
        "Kualitas prompt diukur dari metrik perilaku, bukan kesan membaca manusia.",
        "Diff untuk review, changelog untuk alasan (`mengapa`), pointer produksi untuk rollback cepat.",
        "Hotfix = versi baru yang dipromosikan cepat, bukan edit versi lama.",
        "Aturan 10 detik: kalau user bisa merasakannya, itu rilis — butuh versi, review, test.",
      ],
      next: { label: "LLMOps3 — Evaluasi Berkelanjutan", href: "/learn/llmops3-eval" },
      quiz: [
        {
          q: "Apa saja komponen wajib dalam satu versi prompt?",
          options: [
            { text: "Teks prompt saja sudah cukup", why: "Teks yang sama dengan temperature berbeda adalah sistem yang berbeda — config wajib ikut." },
            { text: "System prompt + template + config + metadata (siapa, kapan, mengapa)", why: "Keempatnya menentukan perilaku dan ketertelusuran. Mengubah satu elemen = versi baru.", correct: true },
            { text: "Teks prompt + nama model", why: "Kurang template variabel, config sampling, dan metadata perubahan." },
            { text: "Template + contoh few-shot", why: "Itu hanya sebagian dari paket versi yang lengkap." },
          ],
        },
        {
          q: "Tim mengubah temperature 0,2 → 0,7 tanpa mencatat, lalu metrik turun. Apa pelajarannya?",
          options: [
            { text: "Temperature tidak berpengaruh ke metrik", why: "Justru berpengaruh besar — itu inti masalahnya." },
            { text: "Config adalah bagian dari versi; perubahan config = versi baru yang di-test", why: "Perilaku sistem ditentukan paket lengkap. Perubahan tak tercatat = regresi tak terlacak.", correct: true },
            { text: "Jangan pernah ubah temperature", why: "Mengubah boleh — yang wajib adalah mencatat dan menguji." },
            { text: "Metriknya yang salah ukur", why: "Metriknya benar menangkap regresi; yang salah adalah proses perubahannya." },
          ],
        },
        {
          q: "Incident produksi: jawaban chatbot bocor. Tim butuh hotfix dalam 15 menit. Langkah yang benar?",
          options: [
            { text: "Edit versi produksi langsung di dashboard, tercepat", why: "Merusak audit trail: dua perilaku berbeda bernomor versi sama, incident tak bisa direproduksi." },
            { text: "Buat versi baru (fix), promosikan cepat dengan review kilat, tulis postmortem", why: "Kecepatan tanpa mengorbankan ketertelusuran. Rollback tetap tersedia jika fix-nya salah.", correct: true },
            { text: "Matikan chatbot sampai rapat besok", why: "Downtime total hampir selalu lebih mahal dari hotfix berversi." },
            { text: "Tunggu vendor memperbaiki modelnya", why: "Masalahnya di prompt-mu, bukan di model vendor." },
          ],
        },
        {
          q: "Mengapa changelog prompt harus menulis `mengapa`, bukan sekadar `apa`?",
          options: [
            { text: "Karena `apa`-nya sudah terlihat di diff", why: "Diff menunjukkan perubahan teks; alasan/hipotesis di baliknya hanya ada di changelog.", correct: true },
            { text: "Agar changelog terlihat panjang", why: "Panjang bukan tujuan; pengetahuan yang bisa dipakai ulang adalah tujuannya." },
            { text: "Syarat audit ISO semata", why: "Manfaatnya operasional: 6 bulan lagi kamu tahu eksperimen mana yang sudah dicoba." },
            { text: "Tidak perlu — `apa` sudah cukup", why: "Tanpa `mengapa`, tim akan mengulang eksperimen gagal yang sama." },
          ],
        },
        {
          q: "KopiChain: resolusi turun 80% → 68% dari 5.000 tiket/bulan, eskalasi Rp15.000/tiket. Kerugian per bulan?",
          options: [
            { text: "Rp1.800.000", why: "Itu 12% × Rp15.000 — lupa dikali volume 5.000 tiket." },
            { text: "Rp9.000.000", why: "5.000 × 12% = 600 tiket × Rp15.000 = Rp9.000.000 per bulan.", correct: true },
            { text: "Rp75.000.000", why: "Itu 5.000 × Rp15.000 — seolah semua tiket dieskalasi." },
            { text: "Rp4.500.000", why: "Itu kerugian dua minggu, bukan per bulan." },
          ],
        },
        {
          q: "Perubahan 1 kalimat prompt menurunkan pass rate 94% → 81% (26 regresi): 19 format tanggal, 4 gaya bahasa, 3 flaky. Langkah TEPAT?",
          options: [
            { text: "Revert ke v14 — 26 regresi terlalu banyak untuk diperbaiki", why: "Revert memang aman, tapi 19 kasus format punya SATU akar (kata pengantar `ramah`) yang bisa diperbaiki 1 baris. Revert membuang perbaikan gaya bahasa yang valid dari v15." },
            { text: "Perbaiki akar masalah format (tambah `langsung jawab tanpa pengantar`), pisahkan flaky", why: "Tepat. Baca polanya: 1 akar masalah untuk 19 kasus + 3 flaky yang bukan regresi. Satu baris prompt + penandaan flaky menyelesaikan 22 dari 26 `masalah`.", correct: true },
            { text: "Perbaiki 26 kasus satu per satu agar teliti", why: "26x kerja untuk 1 akar masalah. Ini seperti mengobati 19 pasien demam satu per satu tanpa mencari sumber infeksinya." },
            { text: "Hapus 3 kasus flaky dari golden set agar angkanya bagus", why: "Flaky harus DITANDAI dan checker-nya diperketat, bukan dihapus agar angka bagus. Menghapus = menyembunyikan nondeterminisme yang akan menggigit di produksi." },
          ],
        },
      ],
    },
  ],
};
