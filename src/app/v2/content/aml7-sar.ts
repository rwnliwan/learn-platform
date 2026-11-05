import type { V2Lesson } from "../lib/types";

// Rubrik 6 elemen: SAR buruk (2/6, skor 33) vs SAR baik (6/6, skor 100).
const RUBRIC_SVG = `<svg viewBox="0 0 480 300" role="img" aria-label="Perbandingan kelengkapan dua SAR pada enam elemen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="90" y1="30" x2="440" y2="30"/><line x1="90" y1="90" x2="440" y2="90"/><line x1="90" y1="150" x2="440" y2="150"/><line x1="90" y1="210" x2="440" y2="210"/></g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="end" fill="var(--chart-text)">
<text x="84" y="84">who</text><text x="84" y="114">what</text><text x="84" y="144">when</text><text x="84" y="174">where</text><text x="84" y="204">why</text><text x="84" y="234">how</text>
</g>
<g>
<rect x="110" y="72" width="0" height="16" fill="var(--c4)"/><rect x="110" y="102" width="300" height="16" fill="var(--c2)"/><rect x="110" y="132" width="0" height="16" fill="var(--c4)"/><rect x="110" y="162" width="0" height="16" fill="var(--c4)"/><rect x="110" y="192" width="300" height="16" fill="var(--c2)"/><rect x="110" y="222" width="0" height="16" fill="var(--c4)"/>
<rect x="110" y="252" width="0" height="0" fill="none"/>
</g>
<g opacity="0.85">
<rect x="112" y="72" width="296" height="16" fill="none" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="112" y="102" width="296" height="16" fill="none" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="112" y="132" width="296" height="16" fill="none" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="112" y="162" width="296" height="16" fill="none" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="112" y="192" width="296" height="16" fill="none" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="112" y="222" width="296" height="16" fill="none" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="4 3"/>
</g>
<g font-size="12" font-family="var(--font-ui)" font-weight="600">
<text x="240" y="270" text-anchor="middle" fill="var(--c2)">SAR buruk: 2/6 elemen (skor 33)</text>
<text x="240" y="20" text-anchor="middle" fill="var(--c1)">SAR baik: 6/6 elemen (skor 100) — bingkai putus-putus</text>
</g>
</svg>`;

export const aml7: V2Lesson = {
  slug: "aml7-sar",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML7 — Menulis SAR/STR yang Lolos Review",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga kalimat yang ditolak, satu narasi yang membongkar Rp23 miliar",
      prose: [
        "Dua SAR masuk untuk kasus yang sama — setoran terstruktur Rp1,7 miliar. SAR pertama: \"Nasabah mencurigakan. Transaksi besar beberapa kali. Mohon ditindaklanjuti.\" Tiga kalimat. Reviewer mengembalikannya dalam 10 menit: \"Tidak ada fakta yang bisa dikerjakan.\"",
        "SAR kedua ditulis ulang oleh analis senior: who (nama, NIK, tanggal lahir, pemilik rekening 887766), what (18 setoran Rp92-99 juta, total Rp1,71 miliar), when (Selasa-Kamis, Januari-Februari 2026, pukul 10.00-11.00), where (cabang Jakarta Selatan, ATM, lalu mobile banking ke luar negeri), why (pola tidak wajar, diduga structuring — peluang kebetulan 1 banding 118 triliun), how (modus pecah setoran di bawah ambang, berulang 6 minggu).",
        "Twist-nya: PPATK menerima SAR kedua itu dan mencocokkannya dengan dua laporan dari bank lain — nama dan pola yang sama. Tiga SAR berkualitas dari tiga bank = satu jaringan Rp23 miliar terbongkar. SAR pertama tidak akan pernah tersambung ke apa pun: tidak ada identifier, tidak ada pola, tidak ada yang bisa dicocokkan. Kualitas narasi = daya tembak intelijen.",
        "Setelah lesson ini kamu bisa: menulis narasi SAR dengan kerangka 5W+1H, menilai kelengkapan SAR dengan rubrik, dan menjelaskan apa yang dicari reviewer dan regulator.",
      ],
      tasks: [],
      reference: "SAR (Suspicious Activity Report) / STR: laporan aktivitas mencurigakan ke PPATK. Narasi = senjata utamanya.",
    },
    {
      id: "lima-w",
      eyebrow: "Langkah 2 · Kerangka 5W+1H",
      title: "Enam pertanyaan yang tidak boleh kosong",
      prose: [
        "Who: identitas lengkap — nama, NIK, tanggal lahir, nomor rekening, dan beneficial owner bila korporat. Tanpa identifier, PPATK tidak bisa mencocokkan laporanmu dengan bank lain. SAR tanpa who = surat kaleng.",
        "What + When + Where: pola dan angka (18 setoran Rp92-99 juta, total Rp1,71 miliar), kronologi presisi (Selasa-Kamis, Januari-Februari 2026, pukul 10.00-11.00), dan channel/yurisdiksi (cabang, ATM, mobile banking ke luar negeri). Angka agregat wajib: reviewer tidak akan menjumlahkan 18 baris untukmu.",
        "Why + How: why = hipotesis kecurigaan yang eksplisit (\"diduga structuring: 85% setoran di band 90-100% ambang, peluang kebetulan 1:118 triliun\"); how = modus operandi (pecah setoran di bawah ambang, berulang 6 minggu). Bedakan fakta dari hipotesis — tulis keduanya, beri label yang jelas. \"Diduga\" bukan kata lemah; ia kata jujur yang melindungi dari tuntutan.",
        "Yang dicari reviewer: fakta terverifikasi (bukan \"katanya\"), kronologi yang bisa diikuti, angka agregat, hipotesis eksplisit, dan lampiran bukti (mutasi, dokumen). Yang membuatnya menolak: opini tanpa data (\"mencurigakan\"), angka tanpa agregat, dan kronologi \"beberapa kali.\"",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"SAR = laporan kejahatan, jadi harus yakin dulu baru lapor.\" Salah: SAR melaporkan KECURIGAN, bukan vonis. Standarnya \"alasan yang cukup untuk mencurigai\" — bukan \"terbukti.\" Analis yang menunggu kepastian 100% tidak akan pernah melapor; analis yang melapor tiap firasat akan diabaikan PPATK. Menulis hipotesis eksplisit (\"diduga structuring karena...\") adalah cara profesional menyeimbangkan keduanya.",
      },
      reference: "Fakta + hipotesis berlabel. \"Diduga\" = kejujuran profesional, bukan kelemahan.",
    },
    {
      id: "rubrik",
      eyebrow: "Langkah 3 · Rubrik kelengkapan",
      title: "Nilai SAR-mu sebelum reviewer menilainya",
      prose: [
        "Skor kelengkapan C = (elemen terpenuhi / 6) × 100. Enam elemen: who, what, when, where, why, how. SAR pertama di cerita: hanya what (\"transaksi besar\") dan why (\"mencurigakan\") → 2/6 = 33. SAR kedua: 6/6 = 100. Ambang internal yang sehat: <50 = tulis ulang, 50-83 = lengkapi yang kosong, ≥84 = layak kirim.",
        "Rubrik ini juga alat QA tim: sampling 10 SAR per bulan, skor, dan latih analis pada elemen yang paling sering kosong. Data industri: elemen why (hipotesis eksplisit) dan when (kronologi presisi) adalah yang paling sering hilang — analis hebat di angka tapi malas di narasi.",
        "Cara membaca diagram: enam baris = enam elemen. Batang penuh = elemen terpenuhi SAR buruk (hanya what dan why); bingkai putus-putus = cakupan SAR baik (semua enam). Interpretasi: SAR buruk bukan \"kurang panjang\" — ia kurang fakta pada 4 dari 6 dimensi. Panjang tanpa who/when/where/how = opini yang bertele-tele.",
      ],
      formula: String.raw`C = \frac{m}{6} \times 100`,
      formulaNote: "C = skor kelengkapan SAR (0-100). m = jumlah elemen 5W+1H yang terpenuhi (who, what, when, where, why, how). <50 tulis ulang; 50-83 lengkapi; ≥84 layak kirim.",
      figure: {
        svg: RUBRIC_SVG,
        alt: "Perbandingan kelengkapan dua SAR pada enam elemen.",
        caption: "SAR buruk: 2/6 elemen (skor 33). SAR baik: 6/6 (skor 100). Yang hilang = yang tidak bisa dikerjakan.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Tulis SAR untuk analis PPATK yang tidak kenal kasusmu, tidak kenal nasabahmu, dan membaca 50 SAR hari itu. Ia tidak akan meneleponmu untuk bertanya. Setiap fakta yang hanya ada di kepalamu = fakta yang tidak ada di laporan. Ujiannya: bisakah orang asing merekonstruksi kasus ini hanya dari narasimu?",
      },
      reference: "Pembaca SAR = orang asing yang sibuk. Tulis agar ia tidak perlu bertanya.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab rubrik",
      title: "Skoring dua SAR nyata",
      prose: [
        "Dua teks SAR dari cerita pembuka. Implementasikan pemeriksa kelengkapan: untuk tiap elemen, cari kata kunci penandanya (mis. who → \"nama\"/\"nik\"/\"tanggal lahir\"; when → \"2026\"/nama bulan/\"pukul\"). Hitung skor keduanya dan lihat selisihnya.",
        "Keterbatasan jujur: pemeriksa kata kunci bisa tertipu (kata \"nama\" muncul tapi tanpa nama asli). Di produksi, rubrik diisi analis manusia — lab ini melatihmu berpikir seperti rubrik, bukan menggantikan penilaiannya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `kelengkapan(teks)` → (skor, elemen_terpenuhi)" },
        { id: "t2", text: "Jalankan dan bandingkan SAR buruk vs baik" },
      ],
      expected: "SAR buruk: skor=33 (what, why) | SAR baik: skor=100 (6/6 elemen)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Makin panjang SAR makin bagus.\" SAR buruk 3 kalimat vs SAR baik ~120 kata — yang membedakan bukan panjangnya, melainkan kepadatan fakta per dimensi. SAR 500 kata tanpa who dan when tetap skor 33. Reviewer mengukur kelengkapan, bukan berat file.",
      },
      hints: [
        "t = teks.lower(); untuk tiap elemen, cek any(k in t for k in keywords).",
        "skor = round(len(ada)/6*100); kembalikan (skor, ada).",
        "SAR buruk mengandung \"transaksi\" (what) dan \"mencurigakan\" (why) saja.",
      ],
      code: {
        starter: `ELEMEN = {\n    "who": ["nama", "nik", "tanggal lahir", "pemilik", "ktp"],\n    "what": ["rp", "juta", "miliar", "transaksi", "setoran", "transfer"],\n    "when": ["2026", "januari", "februari", "maret", "tanggal", "pukul"],\n    "where": ["cabang", "atm", "mobile", "kantor", "luar negeri"],\n    "why": ["mencurigakan", "diduga", "pola", "tidak wajar", "indikasi"],\n    "how": ["melalui", "cara", "modus", "berulang", "berturut"],\n}\nburuk = "Nasabah mencurigakan. Transaksi besar beberapa kali. Mohon ditindaklanjuti."\nbaik = ("Nama: H. Sulaeman, NIK 3201010101800001, tanggal lahir 1 Januari 1980, "\n        "pemilik rekening 887766. What: 18 setoran tunai Rp92-99 juta, total Rp1,71 miliar, "\n        "melalui cabang dan ATM. When: setiap Selasa-Kamis, Januari-Februari 2026, "\n        "pukul 10.00-11.00. Where: cabang Jakarta Selatan dan mobile banking ke luar negeri. "\n        "Why: pola tidak wajar, diduga structuring, indikasi pencucian uang. "\n        "How: modus pecah setoran di bawah ambang, berulang 6 minggu berturut-turut.")\n\n# TULIS KODEMU\ndef kelengkapan(teks):\n    return\n\nfor nama, teks in [("buruk", buruk), ("baik", baik)]:\n    s, ada = kelengkapan(teks)\n    print(f"SAR {nama}: skor={s}  elemen={ada}")`,
        lockLines: 16,
        solution: `ELEMEN = {\n    "who": ["nama", "nik", "tanggal lahir", "pemilik", "ktp"],\n    "what": ["rp", "juta", "miliar", "transaksi", "setoran", "transfer"],\n    "when": ["2026", "januari", "februari", "maret", "tanggal", "pukul"],\n    "where": ["cabang", "atm", "mobile", "kantor", "luar negeri"],\n    "why": ["mencurigakan", "diduga", "pola", "tidak wajar", "indikasi"],\n    "how": ["melalui", "cara", "modus", "berulang", "berturut"],\n}\nburuk = "Nasabah mencurigakan. Transaksi besar beberapa kali. Mohon ditindaklanjuti."\nbaik = ("Nama: H. Sulaeman, NIK 3201010101800001, tanggal lahir 1 Januari 1980, "\n        "pemilik rekening 887766. What: 18 setoran tunai Rp92-99 juta, total Rp1,71 miliar, "\n        "melalui cabang dan ATM. When: setiap Selasa-Kamis, Januari-Februari 2026, "\n        "pukul 10.00-11.00. Where: cabang Jakarta Selatan dan mobile banking ke luar negeri. "\n        "Why: pola tidak wajar, diduga structuring, indikasi pencucian uang. "\n        "How: modus pecah setoran di bawah ambang, berulang 6 minggu berturut-turut.")\n\n# TULIS KODEMU\ndef kelengkapan(teks):\n    t = teks.lower()\n    ada = [e for e, kws in ELEMEN.items() if any(k in t for k in kws)]\n    return round(len(ada) / 6 * 100), ada\n\nfor nama, teks in [("buruk", buruk), ("baik", baik)]:\n    s, ada = kelengkapan(teks)\n    print(f"SAR {nama}: skor={s}  elemen={ada}")`,
        checks: [
          { kind: "defined", task: "t1", name: "kelengkapan", label: "`kelengkapan` terdefinisi", msg: "Buat fungsi kelengkapan(teks) → (skor, elemen_terpenuhi)." },
          { kind: "stdout_matches", task: "t2", pattern: "SAR buruk: skor=33", label: "SAR buruk = 33", msg: "Hanya what + why terpenuhi → 2/6 = 33." },
          { kind: "stdout_matches", task: "t2", pattern: "SAR baik: skor=100", label: "SAR baik = 100", msg: "Keenam elemen terpenuhi → 100." },
        ],
      },
      reference: "any(k in t for k in kws): satu kata kunci cukup menandai elemen.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Antrean",
      title: "Antrean SAR: mana yang ditulis dulu?",
      prose: [
        "Tiga draf SAR menunggu, satu deadline PPATK 3 hari. Mana yang ditulis dulu? Skor filing = kelengkapan×0,4 + nominal_norm×0,3 + bobot_tipologi×0,2 + urgensi×0,1. Kelengkapan dari rubrik 6 elemen; nominal dinormalisasi dengan cap Rp10 miliar; tipologi: structuring 90, TBML 85, mule 70; urgensi = 100/deadline_hari.",
        "Hasil lab: Draf A (structuring Rp1,7 M, lengkap 100, deadline 3 hari) = 66,4. Draf C (mule Rp3,6 M, lengkap 83, deadline 5 hari) = 60,0. Draf B (TBML Rp4,2 M, lengkap 67, deadline 10 hari) = 57,4. Urutan filing: A, C, B. Perhatikan: nominal terbesar (B) justru antre terakhir — karena kelengkapan rendah + deadline longgar.",
        "Skor bukan vonis — ia alokasi. Draf B tetap ditulis, hanya sesudah A dan C. Tanpa skor, analis menulis yang paling MUDAH dulu (bias kemudahan): draf pendek yang rapi, bukan draf penting yang berantakan. Skor memaksa prioritas berbasis risiko, bukan kenyamanan.",
        "Bobot bisa dituning per kebijakan bank — tetapi harus konsisten antar analis dan terdokumentasi. Yang tidak boleh: urutan filing berdasarkan 'siapa teriak paling keras' atau 'yang atasnya siapa'.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `skor` filing" },
        { id: "t2", text: "Jalankan dan pastikan urutan tercetak" },
      ],
      expected: "Draf A: skor 66.4\nDraf C: skor 60.0\nDraf B: skor 57.4\nUrutan filing: A, C, B",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Tulis yang nominalnya terbesar dulu.” Nominal tanpa kelengkapan = SAR lemah yang ditolak reviewer; tanpa urgensi = deadline terlewat = pelanggaran. Prioritas = kelengkapan × bobot + urgensi — bukan nominal saja.",
      },
      hints: [
        "Nominal dinormalisasi: min(nominal/10000, 1)*100.",
        "Urutkan menurun berdasarkan skor.",
      ],
      code: {
        starter: "# Draf SAR: (nama, kelengkapan, nominal_jt, bobot_tipologi, deadline_hari). JANGAN UBAH.\ndraf = [(\"A\", 100, 1700, 90, 3), (\"B\", 67, 4200, 85, 10), (\"C\", 83, 3600, 70, 5)]\n\n# TULIS KODEMU: skor filing + urutan\ndef skor(lengkap, nominal_jt, tipologi, deadline):\n    return\n\nhasil = sorted(((n, skor(l, m, t, d)) for n, l, m, t, d in draf), key=lambda x: -x[1])\nfor n, s in hasil:\n    print(f\"Draf {n}: skor {s:.1f}\")\nprint(f\"Urutan filing: {', '.join(n for n, _ in hasil)}\")",
        lockLines: 4,
        solution: "# Draf SAR: (nama, kelengkapan, nominal_jt, bobot_tipologi, deadline_hari). JANGAN UBAH.\ndraf = [(\"A\", 100, 1700, 90, 3), (\"B\", 67, 4200, 85, 10), (\"C\", 83, 3600, 70, 5)]\n\n# TULIS KODEMU: skor filing + urutan\ndef skor(lengkap, nominal_jt, tipologi, deadline):\n    return lengkap * 0.4 + min(nominal_jt / 10000, 1) * 100 * 0.3 + tipologi * 0.2 + (100 / deadline) * 0.1\n\nhasil = sorted(((n, skor(l, m, t, d)) for n, l, m, t, d in draf), key=lambda x: -x[1])\nfor n, s in hasil:\n    print(f\"Draf {n}: skor {s:.1f}\")\nprint(f\"Urutan filing: {', '.join(n for n, _ in hasil)}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Draf A pertama", msg: "Skor 66,4 tertinggi.", pattern: "Draf A: skor 66\\.4" },
          { kind: "stdout_matches", task: "t2", label: "Urutan A, C, B", msg: "Nominal terbesar (B) antre terakhir.", pattern: "Urutan filing: A, C, B" }
        ],
      },
      reference: "Skor filing = 0,4 kelengkapan + 0,3 nominal + 0,2 tipologi + 0,1 urgensi.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Kelengkapan narasi",
      title: "SAR tanpa 'mengapa' = laporan kosong",
      prose: [
        "Lab pertama mengurutkan antrean SAR. Lab ini menilai isi: narasi SAR wajib menjawab lima unsur — siapa, apa, kapan, berapa, dan mengapa mencurigakan. Unsur kelima paling sering hilang: analis menulis kronologi transaksi tetapi lupa menjelaskan MENGAPA pola itu mencurigakan.",
        "Draf A lengkap 4/5 tetapi kehilangan 'mengapa mencurigakan' — justru unsur yang dibaca pertama oleh PPATK. Draf B kehilangan 'kapan'. Pemeriksa kelengkapan seperti ini bisa dijalankan otomatis sebelum SAR dikirim, mencegah penolakan administratif.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor = jumlah unsur terpenuhi" },
        { id: "t2", text: "Jalankan dan pastikan unsur yang kurang tercetak" },
      ],
      expected: "SAR A: 4/5 lengkap; kurang: ['mengapa_mencurigakan']\nSAR B: 4/5 lengkap; kurang: ['kapan']",
      note: {
        title: "Lengkap ≠ jelas.",
        type: "pitfall",
        body: "“Lima unsur terpenuhi, SAR pasti bagus.” Checklist menangkap kelengkapan, bukan kualitas — 'mengapa mencurigakan: karena aneh' lolos checklist tetapi gagal sebagai narasi. Checklist = gerbang minimum, bukan jaminan mutu.",
      },
      hints: [
        "skor = sum(cek.values()).",
        "kurang = [k for k, v in cek.items() if not v].",
      ],
      code: {
        starter: "# Unsur narasi SAR (1=ada). JANGAN UBAH.\nnarasi = {\n    \"A\": {\"siapa\": 1, \"apa\": 1, \"kapan\": 1, \"berapa\": 1, \"mengapa_mencurigakan\": 0},\n    \"B\": {\"siapa\": 1, \"apa\": 1, \"kapan\": 0, \"berapa\": 1, \"mengapa_mencurigakan\": 1},\n}\n\n# TULIS KODEMU: skor + unsur yang kurang\nfor kode, cek in narasi.items():\n    skor = \n    kurang = \n    print(f\"SAR {kode}: {skor}/5 lengkap; kurang: {kurang}\")",
        lockLines: 4,
        solution: "# Unsur narasi SAR (1=ada). JANGAN UBAH.\nnarasi = {\n    \"A\": {\"siapa\": 1, \"apa\": 1, \"kapan\": 1, \"berapa\": 1, \"mengapa_mencurigakan\": 0},\n    \"B\": {\"siapa\": 1, \"apa\": 1, \"kapan\": 0, \"berapa\": 1, \"mengapa_mencurigakan\": 1},\n}\n\n# TULIS KODEMU: skor + unsur yang kurang\nfor kode, cek in narasi.items():\n    skor = sum(cek.values())\n    kurang = [k for k, v in cek.items() if not v]\n    print(f\"SAR {kode}: {skor}/5 lengkap; kurang: {kurang}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "SAR A dinilai", msg: "A kurang unsur mengapa_mencurigakan.", pattern: "SAR A: 4/5 lengkap" },
          { kind: "stdout_matches", task: "t2", label: "SAR B dinilai", msg: "B kurang unsur kapan.", pattern: "kurang: \\['kapan'\\]" }
        ],
      },
      reference: "Lima unsur: siapa, apa, kapan, berapa, mengapa mencurigakan. 'Mengapa' yang paling sering hilang — padahal dibaca pertama.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Empat ujung investigasi",
      prose: [
        "Satu: bukti kuat (pola + angka + hipotesis teruji) → tulis SAR penuh dan kirim segera: jangan tunggu \"sempurna.\" Keterlambatan pelaporan = pelanggaran tersendiri di banyak yurisdiksi.",
        "Dua: sinyal lemah (satu anomali, tanpa pola) → pantau 30-90 hari dengan catatan: tetapkan apa yang ditunggu (\"tunggu 10 setoran lagi atau 60 hari\"). Pantau tanpa batas waktu = menunda keputusan selamanya.",
        "Tiga: butuh data (pola ada, identitas/BO belum jelas) → minta dokumen/informasi dulu: EDD, kunjungan, permintaan data ke nasabah. SAR dengan who kosong = surat kaleng; lengkapi dulu.",
        "Empat: false positive jelas (penjelasan bisnis terverifikasi) → tutup dengan alasan tertulis: \"ditutup karena termin kontrak PT X terlampir.\" Penutupan tanpa alasan = lubang audit; penutupan beralasan = bukti kerja profesional.",
        "Aturan praktis 10 detik: bisa tulis who+what+when+where+why+how hari ini = tulis. Ada yang kosong = kejar yang kosong dulu. Semua kosong = pantau, bukan SAR.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "SAR yang baik membuat PPATK bisa bertindak TANPA meneleponmu. Setiap panggilan klarifikasi dari mereka = satu elemen yang gagal kamu tulis. Analis senior mengukur dirinya dengan \"rasio SAR yang langsung bisa diproses\" — bukan jumlah SAR yang dikirim.",
      },
      reference: "Kirim cepat > kirim sempurna. Tapi kirim kosong = tidak kirim.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Bedah dua narasi",
      prose: [
        "Narasi A: \"Nasabah mencurigakan. Transaksi besar beberapa kali. Mohon ditindaklanjuti.\" Narasi B: narasi lengkap H. Sulaeman dari lab (skor 100).",
        "Pertanyaan: (a) Sebutkan 4 elemen yang hilang dari Narasi A. (b) Kenapa Narasi A tidak bisa digabungkan PPATK dengan laporan bank lain, padahal kasarnya sama? (c) Tulis ulang SATU kalimat pembuka Narasi A agar menjadi why yang proper.",
        "Pembahasan: (a) who (tanpa identifier), when (\"beberapa kali\" bukan kronologi), where (channel tak disebut), how (modus tak dijelaskan). (b) Penggabungan lintas bank butuh kunci: identifier (NIK/nama+dob) dan pola yang bisa dicocokkan (nominal, waktu, channel). Narasi A tidak punya kunci — ia tidak bisa disambungkan ke apa pun. (c) Contoh: \"Diduga structuring: 18 setoran tunai Rp92-99 juta dalam 6 minggu (total Rp1,71 miliar), 85% menumpuk tepat di bawah ambang Rp100 juta — peluang kebetulan 1 banding 118 triliun.\" Satu kalimat: hipotesis + angka + bukti statistik.",
      ],
      tasks: [],
      reference: "Kunci penggabungan = identifier + pola. Tanpa keduanya, SAR-mu pulau terpencil.",
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
        "SAR = laporan kecurigaan (bukan vonis); standar: alasan cukup untuk mencurigai.",
        "Kerangka 5W+1H: who (identifier), what/when/where (pola+angka+kronologi), why (hipotesis), how (modus).",
        "Skor kelengkapan C = m/6×100; <50 tulis ulang.",
        "Reviewer mencari: fakta terverifikasi, angka agregat, hipotesis eksplisit, lampiran.",
        "Narasi berkualitas = bisa digabungkan lintas bank = daya tembak intelijen.",
      ],
      next: { label: "AML8 — Network Analysis untuk AML", href: "/v2/learn/aml8-network" },
      quiz: [
        {
          q: "Kapan SAR boleh ditulis?",
          options: [
            { text: "Setelah terbukti bersalah di pengadilan", why: "Itu vonis, bukan SAR. Menunggu ini = tidak pernah melapor." },
            { text: "Saat ada alasan yang cukup untuk mencurigai — fakta + hipotesis eksplisit, walau belum pasti", why: "Standar SAR = kecurigaan beralasan, bukan kepastian. \"Diduga\" adalah kata kerja profesional.", correct: true },
            { text: "Setiap ada firasat", why: "Firasat tanpa fakta = noise yang merusak kredibilitas tim di mata PPATK." },
            { text: "Hanya jika atasan memerintahkan", why: "Kewajiban melapor melekat pada temuan, bukan perintah." },
          ],
        },
        {
          q: "Elemen apa yang membuat SAR bisa digabungkan dengan laporan bank lain?",
          options: [
            { text: "Panjang narasi", why: "Panjang tanpa kunci = pulau terpencil yang bertele-tele." },
            { text: "Identifier (NIK/nama+dob) + pola yang bisa dicocokkan (nominal, waktu, channel)", why: "Inilah yang menyambungkan 3 SAR menjadi jaringan Rp23 miliar.", correct: true },
            { text: "Bahasa yang formal", why: "Formalitas tidak menyambungkan data." },
            { text: "Tanda tangan direksi", why: "Otorisasi ≠ kunci penggabungan." },
          ],
        },
        {
          q: "SAR dengan skor kelengkapan 33 dikirim apa adanya. Risiko terbesarnya?",
          options: [
            { text: "Tidak ada, yang penting sudah melapor", why: "\"Sudah melapor\" yang tidak bisa diproses = belum melapor, plus reputasi tim turun." },
            { text: "Ditolak reviewer / tidak bisa diproses PPATK — dan analis berikutnya mengulang kerja dari nol", why: "SAR 33 = 4 dari 6 dimensi kosong. Tidak ada yang bisa dikerjakan darinya.", correct: true },
            { text: "Denda karena terlalu pendek", why: "Tidak ada denda panjang-pendek; yang dinilai kelengkapan fakta." },
            { text: "Nasabah menuntut", why: "SAR dilindungi kerahasiaan pelapor; risikonya bukan gugatan." },
          ],
        },
        {
          q: "Mana kalimat why yang proper?",
          options: [
            { text: "\"Nasabah mencurigakan.\"", why: "Opini tanpa hipotesis dan tanpa angka — inilah SAR yang ditolak." },
            { text: "\"Diduga structuring: 18 setoran Rp92-99 jt/6 minggu (Rp1,71 M), 85% di band ambang — peluang kebetulan 1:118 triliun.\"", why: "Hipotesis eksplisit + angka agregat + bukti statistik. Inilah why yang bisa dikerjakan.", correct: true },
            { text: "\"Transaksi besar beberapa kali.\"", why: "\"Besar\" dan \"beberapa\" bukan angka — tidak bisa diverifikasi." },
            { text: "\"Mohon ditindaklanjuti.\"", why: "Permohonan, bukan hipotesis." },
          ],
        },
        {
          q: "Sinyal lemah: satu anomali tanpa pola. Keputusan yang tepat?",
          options: [
            { text: "SAR segera — lebih cepat lebih baik", why: "SAR tanpa pola = skor rendah = ditolak. Cepat tapi kosong." },
            { text: "Pantau 30-90 hari dengan target jelas (apa yang ditunggu), catat alasannya", why: "Proporsional: beri kesempatan pola terbentuk, dengan batas waktu agar tidak menunda selamanya.", correct: true },
            { text: "Abaikan", why: "Diabaikan tanpa catatan = hilang dari radar selamanya." },
            { text: "Blokir rekening", why: "Pemblokiran butuh dasar kuat — satu anomali bukan dasar." },
          ],
        },
      ],
    },
  ],
};
