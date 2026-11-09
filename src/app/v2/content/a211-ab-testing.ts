import type { V2Lesson } from "../lib/types";

export const a211: V2Lesson = {
  slug: "a211-ab-testing",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.11 Dari Hipotesis ke Keputusan Bisnis: A/B Testing End-to-End",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-tombol",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Tombol $300 juta — dan bencana tanpa disiplin",
      prose: [
        "Tahun 2010, tim kampanye Obama menguji tombol Sign Up di halaman donasi. Varian pemenang — foto keluarga + tombol Learn More — menaikkan sign-up rate dari 8,26% ke 11,6%. Kenaikan relatif 40%. Nilai tambah donasi: $60 juta.",
        "Di sisi lain, sebuah e-commerce menguji hal yang sama tanpa disiplin: mengintip hasil tiap jam, berhenti saat menang di jam ke-6, rollout ke 100% trafik. Tiga minggu kemudian revenue turun 2%. Kemenangan itu adalah noise + novelty effect — pengguna mengklik karena baru, bukan karena lebih baik. Perbedaan antara $60 juta dan bencana bukanlah ide tombolnya, melainkan disiplin metodologinya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lift_pp` = 11,6 − 8,26" },
        { id: "t2", text: "Hitung `lift_rel` = lift_pp / 8,26 × 100, dibulatkan" },
      ],
      expected: "lift_pp=3.34  lift_rel=40",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "A/B testing terlihat sederhana — bandingkan dua angka, pilih yang menang — tapi justru karena terlihat sederhana, ia menjadi sumber keputusan buruk yang paling produktif di perusahaan digital. Rollout atas kemenangan palsu bisa menurunkan revenue 2% di seluruh trafik.",
      },
      hints: [
        "lift_pp = 11,6 − 8,26.",
        "lift_rel = lift_pp/8,26 × 100.",
        "lift_rel = round(lift_pp/8.26*100)",
      ],
      code: {
        starter: `kontrol, varian = 8.26, 11.6  # % sign-up\n\n# TULIS KODEMU\nlift_pp = \nlift_rel = \n\nprint(f"lift_pp={lift_pp}  lift_rel={lift_rel}")`,
        lockLines: 1,
        solution: `kontrol, varian = 8.26, 11.6  # % sign-up\n\n# TULIS KODEMU\nlift_pp = round(varian-kontrol, 2)\nlift_rel = round(lift_pp/kontrol*100)\n\nprint(f"lift_pp={lift_pp}  lift_rel={lift_rel}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lift_pp", value: 3.34, tol: 0.01, label: "`lift_pp` seharusnya 3.34", msg: "11,6 − 8,26 = 3,34 poin." },
          { kind: "equal", task: "t2", name: "lift_rel", value: 40, tol: 1, label: "`lift_rel` seharusnya 40", msg: "3,34/8,26 × 100% ≈ 40%." },
          { kind: "stdout_matches", task: "t2", pattern: "lift_pp=3\\.34\\s+lift_rel=40", label: "`print` menampilkan keduanya", msg: "Format: lift_pp=...  lift_rel=... ." },
        ],
      },
      reference: "Laporkan lift absolut + relatif + CI — ketiganya, bukan satu.",
    },
    {
      id: "hipotesis-metrik",
      eyebrow: "Langkah 2 · Hipotesis dan metrik",
      title: "Hipotesis yang bisa salah, metrik yang ditulis di awal",
      prose: [
        "Hipotesis yang bisa diuji punya 3 komponen: perubahan → mekanisme → dampak terukur. Tombol baru lebih bagus bukan hipotesis. Mengganti teks CTA menjadi Ajukan Sekarang mengurangi keraguan sehingga klik CTA naik — adalah hipotesis: ia bisa salah, dan memberi tahu mengapa jika benar.",
        "Metrik primer — SATU metrik keputusan (biasanya di ujung funnel: konversi cair). Metrik guardrail — yang tidak boleh rusak (komplain, chargeback): kemenangan yang merusak guardrail = kekalahan. Metrik diagnostik — di tengah funnel untuk memahami di mana efek terjadi. Fleksibilitas memilih metrik setelah melihat hasil = p-hacking: peluang ≥1 menang palsu dari 10 metrik ≈ 40%.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lift hanya di klik tapi hilang di cair tetap dirayakan. Salah: itu pola clickbait internal — CTA baru menarik klik penasaran yang tidak konversi. Pola sehat: efek konsisten di sepanjang funnel sesuai hipotesis.",
      },
      reference: "Satu primer + guardrail yang ditulis di awal = kontrak kejujuranmu.",
    },
    {
      id: "desain-durasi",
      eyebrow: "Langkah 3 · Desain dan durasi",
      title: "90% kualitas test ditentukan sebelum dimulai",
      prose: [
        "Unit randomisasi: idealnya pengguna — satu pengguna selalu lihat varian yang sama. Randomisasi per kunjungan membuat pengguna melihat dua versi bergantian: membingungkan dan mencemari efek. Ukuran sampel dari A2.10 dengan MDE dari break-even bisnis.",
        "Contoh: baseline konversi 12%, MDE 1,5 pp, trafik 4.000/hari. n per varian ≈ 7.359 → total 14.716/4.000 ≈ 3,7 hari → dibulatkan 7 hari (1 minggu penuh — efek day-of-week: perilaku Senin ≠ Sabtu). Test 10 hari mencampur 2 Senin + 1 Sabtu: bias komposisi. Tulis kontrak: primer = konversi cair; guardrail = komplain & NPL 30 hari; berhenti hanya di hari ke-7.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `hari` = 14.716 / 4.000 (1 desimal)" },
        { id: "t2", text: "Tentukan `durasi` = 7 (dibulatkan ke minggu penuh)" },
      ],
      expected: "hari=3.7  durasi=7",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Berhenti lebih awal kalau sudah signifikan — hemat waktu. Salah: berhenti saat menang adalah peeking. Efek yang terlihat di awal sering melebih-lebihkan efek sebenarnya (winner's curse): hanya fluktuasi ke atas yang memicu pemberhentian dini. Komitmen pada durasi yang dihitung.",
      },
      hints: [
        "hari = 14716/4000.",
        "Bulatkan 1 desimal.",
        "durasi = 7  # kelipatan minggu penuh",
      ],
      code: {
        starter: `# TULIS KODEMU\nhari = \ndurasi = \n\nprint(f"hari={hari}  durasi={durasi}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU\nhari = round(14716/4000, 1)\ndurasi = 7  # kelipatan minggu penuh (day-of-week effect)\n\nprint(f"hari={hari}  durasi={durasi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hari", value: 3.7, tol: 0.05, label: "`hari` seharusnya 3.7", msg: "14.716/4.000 ≈ 3,7 hari." },
          { kind: "equal", task: "t2", name: "durasi", value: 7, tol: 1e-9, label: "`durasi` seharusnya 7", msg: "Dibulatkan ke 1 minggu penuh." },
          { kind: "stdout_matches", task: "t2", pattern: "hari=3\\.7\\s+durasi=7", label: "`print` menampilkan keduanya", msg: "Format: hari=...  durasi=... ." },
        ],
      },
      reference: "Durasi = n / trafik harian, dibulatkan ke kelipatan minggu.",
    },
    {
      id: "srm",
      eyebrow: "Langkah 4 · SRM",
      title: "SRM: alarm kebakaran eksperimen",
      prose: [
        "SRM (Sample Ratio Mismatch): proporsi split aktual menyimpang dari desain — misal 56/44 padahal dirancang 50/50. Penyebab: bug tracking, bot, cache, redirect gagal. SRM = bukti randomisasi rusak → hasil tidak bisa dipercaya, titik. Cek dengan chi-square goodness-of-fit: χ² = Σ(O−E)²/E.",
        "Contoh: grup A 100.200, grup B 99.800 (target 50:50). χ² = (200²+200²)/100.000 = 0,8 < 3,84 → OK, fluktuasi wajar. Tapi jika A=110.000, B=90.000: χ² = 2.000 → SRM! Tindakan: investigasi bug, buang periode rusak, atau ulangi test. Jangan adjust dan lanjut — fondasinya retak. Aturan selama berjalan: jangan intip primer; boleh pantau guardrail & SRM.",
      ],
      formula: String.raw`\chi^2 = \sum \frac{(O - E)^2}{E} \qquad \chi^2 > 3{,}84 \Rightarrow \text{waspada SRM}`,
      formulaNote: "chi-kuadrat = statistik uji kesesuaian; O = jumlah teramati per varian; E = jumlah harapan sesuai rasio desain; 3,84 = nilai kritis chi-kuadrat df=1 pada alpha 5 persen — di atas itu, curigai SRM.",
      tasks: [
        { id: "t1", text: "Hitung `chi_ok` untuk split 100.200 vs 99.800 (E = 100.000)" },
        { id: "t2", text: "Hitung `chi_rusak` untuk split 110.000 vs 90.000" },
        { id: "t3", text: "Tentukan `srm` = True jika chi_rusak > 3,84" },
      ],
      expected: "chi_ok=0.8  chi_rusak=2000.0  srm=True",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Analis yang melewatkan SRM mengambil keputusan dari data rusak. SRM check 30 detik — chi-square pada jumlah per varian — mencegah keputusan dari eksperimen yang fondasinya retak. Masukkan ke checklist setiap analisis A/B.",
      },
      hints: [
        "chi = ((O1−E)² + (O2−E)²)/E.",
        "Untuk kasus rusak: selisih = 10.000.",
        "srm = chi_rusak > 3.84",
      ],
      code: {
        starter: `E = 100000  # ekspektasi per grup\n\n# TULIS KODEMU\nchi_ok = \nchi_rusak = \nsrm = \n\nprint(f"chi_ok={chi_ok}  chi_rusak={chi_rusak}  srm={srm}")`,
        lockLines: 1,
        solution: `E = 100000  # ekspektasi per grup\n\n# TULIS KODEMU\nchi_ok = ((100200-E)**2 + (99800-E)**2)/E\nchi_rusak = ((110000-E)**2 + (90000-E)**2)/E\nsrm = chi_rusak > 3.84\n\nprint(f"chi_ok={chi_ok}  chi_rusak={chi_rusak}  srm={srm}")`,
        checks: [
          { kind: "equal", task: "t1", name: "chi_ok", value: 0.8, tol: 1e-9, label: "`chi_ok` seharusnya 0.8", msg: "(200² + 200²)/100.000 = 0,8 < 3,84 → OK." },
          { kind: "equal", task: "t2", name: "chi_rusak", value: 2000.0, tol: 1e-9, label: "`chi_rusak` seharusnya 2000.0", msg: "(10.000² × 2)/100.000 = 2.000 → SRM!" },
          { kind: "stdout_matches", task: "t3", pattern: "srm=True", label: "`print` menampilkan verdict", msg: "Format: ... srm=True." },
        ],
      },
      reference: "Cek SRM sebelum baca hasil. Untuk n besar pakai ambang p < 0,001.",
    },
    {
      id: "analisis-ci-mde",
      eyebrow: "Langkah 5 · Analisis dan keputusan",
      title: "Hakim tiga dokumen: p-value, CI, MDE",
      prose: [
        "Uji dua proporsi memberi p-value (apakah nyata?), tapi keputusan dibaca dari CI lift vs MDE (apakah cukup?). Seluruh CI > MDE → ship. CI mencakup 0 tapi batas atas > MDE → belum konklusif. Seluruh CI di (0, MDE) → jangan ship: signifikan tapi di bawah break-even. CI mencakup negatif besar → kill.",
        "Contoh: kontrol 12,0% (3.360/28.000), varian 13,1% (3.668/28.000). Lift = 1,1 pp. SE = √(0,12×0,88/28.000 × 2) ≈ 0,27 pp → 95% CI = 1,1 ± 0,53 = (0,57, 1,63). p = 0,004 signifikan — tapi seluruh CI di bawah MDE 1,5 pp kecuali ujungnya. Vonis: signifikan tapi tidak penting — jangan ship penuh.",
      ],
      formula: String.raw`z = \frac{\hat{p}_1 - \hat{p}_2}{\sqrt{\hat{p}(1-\hat{p})\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}`,
      formulaNote: "z = statistik uji beda dua proporsi; p-hat_1, p-hat_2 = konversi teramati tiap varian; p-hat = konversi gabungan (pooled); n_1, n_2 = ukuran tiap varian; penyebut = standard error selisih.",
      tasks: [
        { id: "t1", text: "Hitung `lift` = 13,1 − 12,0 (pp)" },
        { id: "t2", text: "Hitung `se_pp` = √(2×0,12×0,88/28000) × 100 (2 desimal)" },
        { id: "t3", text: "Hitung `ci_bawah` = lift − 1,96×se_pp (2 desimal)" },
      ],
      expected: "lift=1.1  se_pp=0.27  ci_bawah=0.57",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "A/B test tidak signifikan = varian tidak lebih baik, kembali ke desain lama. Salah: tidak signifikan dengan CI (−0,2, +1,8) vs MDE 1,5 berarti belum konklusif — efek 1,5 masih mungkin! Hanya jika seluruh CI di bawah MDE kamu boleh menyimpulkan tidak cukup baik. Gagal menolak ≠ terbukti sama.",
      },
      hints: [
        "se = (2*0.12*0.88/28000)**0.5.",
        "Kalikan 100 untuk jadi pp, bulatkan 2 desimal.",
        "ci_bawah = round(lift - 1.96*se_pp, 2)",
      ],
      code: {
        starter: `# TULIS KODEMU\nlift = \nse_pp = \nci_bawah = \n\nprint(f"lift={lift}  se_pp={se_pp}  ci_bawah={ci_bawah}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU\nlift = round(13.1-12.0, 2)\nse_pp = round((2*0.12*0.88/28000)**0.5*100, 2)\nci_bawah = round(lift - 1.96*se_pp, 2)\n\nprint(f"lift={lift}  se_pp={se_pp}  ci_bawah={ci_bawah}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lift", value: 1.1, tol: 0.01, label: "`lift` seharusnya 1.1", msg: "13,1 − 12,0 = 1,1 pp." },
          { kind: "equal", task: "t2", name: "se_pp", value: 0.27, tol: 0.01, label: "`se_pp` sekitar 0.27", msg: "√(2×0,12×0,88/28.000) × 100 ≈ 0,27 pp." },
          { kind: "equal", task: "t3", name: "ci_bawah", value: 0.57, tol: 0.02, label: "`ci_bawah` sekitar 0.57", msg: "1,1 − 1,96×0,27 ≈ 0,57." },
          { kind: "stdout_matches", task: "t3", pattern: "lift=1\\.1\\s+se_pp=0\\.27\\s+ci_bawah=0\\.57", label: "`print` menampilkan ketiganya", msg: "Format: lift=...  se_pp=...  ci_bawah=... ." },
        ],
      },
      reference: "Bandingkan batas bawah CI dengan MDE — bukan titik estimasi dengan nol.",
    },
    {
      id: "jebakan-ab",
      eyebrow: "Langkah 6 · Lima jebakan",
      title: "Lima jebakan yang menunggu analis lengah",
      prose: [
        "1. Novelty & primacy: pengguna bereaksi terhadap kebaruan atau menolak karena beda. Solusi: jalankan 2+ minggu; waspadai menang di minggu 1, kalah di minggu 3. 2. Multiple metrics: 10 metrik → 40% peluang ≥1 menang palsu. Solusi: satu primer + koreksi Holm untuk sekunder. 3. Simpson's paradox: varian menang di agregat tapi kalah di tiap segmen — komposisi segmen tidak seimbang (sering akibat SRM tersembunyi).",
        "4. Network/spillover: kontrol tertular perlakuan (fitur sosial, marketplace). Solusi: randomisasi per klaster (kota), bukan per individu. 5. Underpower + peeking: kombinasi paling umum — n kurang lalu kompensasi dengan mengintip tiap hari. Hasilnya: false positive + estimasi bias ke atas.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Peta situasi: trafik besar + metrik biner → A/B klasik dua proporsi. Metrik kontinu miring (revenue) → Welch atau bootstrap. Trafik kecil → MDE realistis atau jangan test (riset kualitatif lebih tepat). Banyak varian → koreksi Holm. Efek jaringan → randomisasi klaster/geo-experiment.",
      },
      reference: "Checklist pre-launch: hipotesis tertulis; primer+guardrail; n & durasi dari MDE; komitmen tidak intip; keputusan dari CI vs MDE.",
    },
    {
      id: "minicase-redesign",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Redesign alur pengajuan kredit: signifikan tapi tidak penting",
      prose: [
        "DanaKita mendesain ulang alur pengajuan (5 langkah → 3 langkah). Baseline konversi 12%, MDE 1,5 pp (break-even Rp800 jt), trafik 4.000/hari → durasi 7 hari. Primer: konversi cair; guardrail: NPL 30 hari & komplain. Hasil hari ke-7: kontrol 12,0% (3.360/28.000), varian 13,1% (3.668/28.000). p = 0,004. Guardrail aman. SRM lolos.",
        "(a) Lift = 1,1 pp, 95% CI (0,57, 1,63), lift relatif ≈ +9%. (b) Keputusan: belum ship penuh. p signifikan TAPI seluruh CI di bawah MDE 1,5 pp kecuali ujungnya — efeknya nyata tapi kemungkinan di bawah break-even. Opsi: rollout bertahap 50% sambil pantau, atau terima redesign baik tapi tidak cukup baik dan cari ide berikutnya. Ini textbook signifikan tapi tidak penting.",
        "(c) Pasca-ship: waspadai novelty effect — pantau 4 minggu, apakah lift bertahan? Dan NPL jangka panjang — guardrail 30 hari belum menangkap kualitas kredit yang sebenarnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "p = 0,004 hanya bilang efeknya nyata; CI bilang efeknya kemungkinan di bawah break-even. Keputusan ship/tidak dibaca dari CI vs MDE — bukan dari p-value. Ulangi test sampai CI di atas MDE adalah p-hacking.",
      },
      reference: "Signifikan ≠ penting. Penting = CI meyakinkan di atas MDE.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Alur: hipotesis teruji → primer+guardrail → n dari MDE → randomisasi per pengguna → durasi kelipatan minggu.",
        "SRM = randomisasi rusak: investigasi, buang periode rusak, atau ulangi — jangan adjust dan lanjut.",
        "Keputusan dari CI lift vs MDE, bukan p-value saja. Signifikan tapi di bawah MDE = jangan ship.",
        "Jangan intip primer; pantau guardrail & SRM. Novelty effect butuh 2+ minggu untuk memudar.",
        "Satu primer ditulis di awal; metrik sekunder dikoreksi Holm. Trafik kecil → jangan A/B test.",
      ],
      next: { label: "A2.12 — Bayesian Dasar", href: "/v2/learn/a212-bayesian" },
      quiz: [
        {
          q: "SRM check menunjukkan split 57/43 (dirancang 50/50), p < 0,001, dengan hasil varian menang signifikan. Tindakan tepat?",
          options: [
            { text: "Ship — hasilnya signifikan", why: "Signifikan di atas randomisasi rusak tidak berarti apa-apa." },
            { text: "Jangan ambil keputusan: SRM = bukti randomisasi rusak. Investigasi bug, buang periode rusak, atau ulangi test", why: "Kemenangan bisa murni artefak bug (misal bot masuk varian). Tidak ada analisis yang menyelamatkan data dari randomisasi rusak.", correct: true },
            { text: "Adjust angkanya secara proporsional lalu ship", why: "Adjust tidak memperbaiki fondasi yang retak." },
            { text: "Naikkan α jadi 10%", why: "α bukan masalahnya — randomisasinya." },
          ],
        },
        {
          q: "Hasil: lift 1,1 pp, 95% CI (0,57, 1,63), MDE = 1,5 pp, p = 0,004. Keputusan?",
          options: [
            { text: "Ship — p signifikan", why: "p hanya bilang efeknya nyata, bukan cukup besar." },
            { text: "Jangan ship penuh: signifikan tapi CI seluruhnya di bawah MDE — efek nyata tapi kemungkinan di bawah break-even", why: "Inti keputusan: CI vs MDE, bukan p-value.", correct: true },
            { text: "Batalkan — tidak signifikan", why: "p = 0,004 signifikan — yang kurang adalah besaran efeknya." },
            { text: "Ulangi test sampai CI di atas MDE", why: "Itu p-hacking — mengulang sampai menang." },
          ],
        },
        {
          q: "Varian menang di agregat tapi kalah di setiap segmen usia. Fenomena apa dan kemungkinan penyebabnya?",
          options: [
            { text: "Tidak mungkin terjadi", why: "Mungkin — ini Simpson's paradox yang klasik." },
            { text: "Simpson's paradox — kemungkinan komposisi segmen tidak seimbang antar varian. Cek hasil per segmen & SRM", why: "Agregat bisa berbalik jika satu varian kebetulan mendapat lebih banyak segmen mudah.", correct: true },
            { text: "Varian memang lebih baik", why: "Kalah di tiap segmen tidak konsisten dengan klaim itu." },
            { text: "Data salah input", why: "Jangan tuduh input sebelum cek komposisi segmen." },
          ],
        },
        {
          q: "Test dengan 8 metrik sekunder tanpa koreksi, 1 menang (p=0,03). Reaksi tepat?",
          options: [
            { text: "Ship berdasarkan metrik itu", why: "Peluang ≥1 menang palsu dari 8 metrik ≈ 34% — sangat mungkin palsu." },
            { text: "Curiga multiple testing: terapkan Holm; jika tidak lolos, anggap eksploratori", why: "1−0,95⁸ ≈ 34%. Disiplin: primer ditulis di awal; sekunder dikoreksi.", correct: true },
            { text: "Pilih metrik lain yang menang", why: "Memilih setelah melihat hasil = p-hacking." },
            { text: "Naikkan α", why: "Menaikkan α memperparah masalah multiple testing." },
          ],
        },
        {
          q: "Trafik hanya 200/hari, MDE butuh 6 bulan test. Saran terbaik?",
          options: [
            { text: "Jalankan 6 bulan — disiplin itu penting", why: "6 bulan rentan seasonality & perubahan produk — hasilnya tidak stabil." },
            { text: "Jangan A/B test: hanya efek raksasa yang terdeteksi. Pakai riset kualitatif / pre-post dengan kontrol", why: "Metode yang tepat > metode yang populer.", correct: true },
            { text: "Turunkan α jadi 20% agar cepat signifikan", why: "Itu menaikkan α — dan tetap pelanggaran metodologi." },
            { text: "Intip tiap hari agar bisa berhenti cepat", why: "Peeking — α efektif meledak." },
          ],
        },
      ],
      note: {
        title: "Intuisi: 90 persen kualitas A/B test ditentukan sebelum tombol start",
        body: "Enam heuristik. Satu: 90 persen kualitas test ditentukan sebelum dimulai — hipotesis yang bisa salah, satu metrik primer, MDE dari break-even bisnis, dan n yang dihitung; sisanya hanyalah eksekusi disiplin. Dua: MDE adalah kontrak dengan bisnis — tanpa itu, “signifikan” tidak menjawab “layak di-ship”; kemenangan 0,1 poin dengan p < 0,001 bisa tetap menjadi kekalahan. Tiga: cek SRM sebelum membaca hasil apa pun — randomisasi yang rusak membuat semua angka berikutnya sampah, betapa pun meyakinkannya. Empat: satu metrik primer, sisanya guardrail — sepuluh metrik berarti 40 persen peluang false positive; kemenangan yang merusak guardrail adalah kekalahan yang menyamar. Lima: untuk keputusan, CI mengalahkan p-value — bandingkan seluruh interval lift dengan MDE: seluruhnya di atas berarti ship, mencakup nol tetapi batas atas di atas MDE berarti belum konklusif, seluruhnya di bawah berarti buang tanpa penyesalan. Enam: waspadai novelty dan primacy effect — pengguna bereaksi pada kebaruan di minggu pertama; jalankan minimal dua minggu penuh agar efek kebaruan memudar sebelum keputusan.",
      },
    },
  ],
};
