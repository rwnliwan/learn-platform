import type { V2Lesson } from "../lib/types";

export const mk19: V2Lesson = {
  slug: "mk19-capstone",
  track: "Marketing Analytics",
  module: "Capstone",
  title: "MK19 — Capstone: Churn + CLV + Uplift + Alokasi Budget",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-majumart",
      eyebrow: "Langkah 1 · Hari pertama",
      title: "Satu file, satu kalimat, satu minggu",
      prose: [
        "Hari pertama sebagai marketing analyst di MajuMart. Atasan memberi satu file: transaksi 2 tahun, 50.000 pelanggan. Satu kalimat: \u201CMinggu depan presentasi ke direksi: pelanggan kita siapa, siapa yang pergi, berapa nilainya, dan ke mana budget Rp2 miliar.\u201D",
        "Senjatamu: MK1–MK18. Funnel untuk diagnosis, cohort untuk tren, RFM untuk segmentasi, CLV untuk nilai, churn untuk risiko, uplift untuk targeting, MMM/atribusi untuk alokasi, storytelling agar didengar.",
        "Data sengaja dibuat berantakan seperti aslinya: ada segmen yang terlihat bagus tapi beracun, channel yang terlihat murah tapi membunuh margin. Yang diminta bukan model tercanggih — melainkan keputusan yang bisa dipertanggungjawabkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Hari 0 sebelum semua fase: audit definisi & tracking (MK2). Satu definisi \u201Caktif\u201D yang salah = semua fase salah.",
        type: "risk",
      },
      reference: "Empat fase: diagnosis → nilai → targeting → alokasi.",
    },
    {
      id: "fase12-lab",
      eyebrow: "Langkah 2 · Fase 1–2 & lab",
      title: "Diagnosis + nilai: tabel batas CAC",
      prose: [
        "Fase 1 (diagnosis): funnel & cohort (di mana bocor?), RFM + skor churn (siapa berisiko?). Fase 2 (nilai): CLV per segmen → batas CAC = CLV/3. Deliverable: tabel 1 halaman.",
        "Tabel MajuMart: Champions (8%, churn 5%, CLV Rp6jt) → batas Rp2jt. Loyal (20%, 12%, Rp2,5jt) → Rp833rb. At Risk (15%, 45%, Rp1,2jt) → Rp400rb. Hibernating (25%, 80%, Rp300rb) → Rp100rb. Lost (32%, CLV ~0) → Rp0, jangan akuisisi ulang.",
        "Keputusan langsung: channel CAC Rp600rb hanya untuk Champions & Loyal. Untuk At Risk (batas Rp400rb) = potong atau cari yang lebih murah.",
      ],
      formula: String.raw`\text{Batas CAC}_{\text{segmen}} = \frac{\text{CLV}_{\text{segmen}}}{3}`,
      formulaNote: "Batas CAC per segmen: CLV_segmen = customer lifetime value segmen itu (nilai masa depan, bukan historis); dibagi 3 = aturan LTV:CAC ≥ 3 (buffer atas ketidakpastian model, biaya retensi, dan nilai referral yang tak terhitung). Channel dengan CAC di atas batas segmen = coret untuk segmen itu. Aturan keras, bukan saran.",
      tasks: [
        { id: "t1", text: "Hitung `rec`, `fre`, `mon` tiap pelanggan" },
        { id: "t2", text: "Hitung `churn_m`, `clv`, `batas_cac`, cetak" },
      ],
      expected: "Citra: batas_cac=697346 | Dodi: batas_cac=29908",
      hints: [
        "rec = hari sejak transaksi terakhir (sudah dalam hari).",
        "churn_m = 1 - math.exp(-rec/90); clv = mon*MARGIN/max(churn_m, 0.02).",
        "batas_cac = clv / 3.",
      ],
      code: {
        starter: `import math\nMARGIN = 0.4\n# (nama, [nilai transaksi], hari sejak transaksi terakhir)\npelanggan = [("Citra", [500000, 600000, 550000], 10),\n             ("Dodi", [200000], 200)]\n\n# TULIS KODEMU: RFM -> churn heuristik -> CLV -> batas CAC\nfor nama, nilai, rec in pelanggan:\n    fre =\n    mon =\n    churn_m =\n    clv =\n    batas_cac =\n    print(f"{nama}: batas_cac={batas_cac:.0f}")`,
        lockLines: 5,
        solution: `import math\nMARGIN = 0.4\n# (nama, [nilai transaksi], hari sejak transaksi terakhir)\npelanggan = [("Citra", [500000, 600000, 550000], 10),\n             ("Dodi", [200000], 200)]\n\n# TULIS KODEMU: RFM -> churn heuristik -> CLV -> batas CAC\nfor nama, nilai, rec in pelanggan:\n    fre = len(nilai)\n    mon = sum(nilai) / len(nilai)\n    churn_m = 1 - math.exp(-rec / 90)\n    clv = mon * MARGIN / max(churn_m, 0.02)\n    batas_cac = clv / 3\n    print(f"{nama}: batas_cac={batas_cac:.0f}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "Citra: batas_cac=697346", label: "Citra batas_cac = 697346", msg: "churn_m=0,1052; clv=2.092.038; /3 = 697.346." },
          { kind: "stdout_matches", task: "t2", pattern: "Dodi: batas_cac=29908", label: "Dodi batas_cac = 29908", msg: "churn_m=0,8916; clv=89.723; /3 = 29.908." },
        ],
      },
      reference: "Fase 1–2 = fondasi semua keputusan. Jangan alokasi sebelum tahu nilai.",
    },
    {
      id: "fase3-lab",
      eyebrow: "Langkah 3 · Fase 3 & lab",
      title: "Targeting: dari berisiko ke persuadable",
      prose: [
        "Fase 3: untuk At Risk, jangan target semua — bangun uplift (MK11) dari data pilot. Kebijakan: target jika uplift × CLV − biaya > 0; pilih NBA per sub-segmen (MK7): voucher vs telepon vs diam.",
        "Worked MajuMart: At Risk 7.500 orang. Pilot 1.000: uplift voucher +8% (persuadables ~40%), telepon +12% tapi biaya 10x. Kebijakan: persuadables + CLV tinggi → telepon (net +Rp180rb/orang); CLV sedang → voucher (net +Rp90rb); sisanya → diam.",
        "Hasil proyeksi: biaya Rp85jt, ~450 terselamatkan, net +Rp390jt. Vs blast ke semua: biaya Rp375jt, net +Rp120jt (plus membangunkan sleeping dogs).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `net_v` dan `net_t` untuk segmen risk" },
        { id: "t2", text: "Pilih aksi, hitung `target` & `net_tot`, cetak" },
      ],
      expected: "aksi=voucher target=6000 net_tot=276000000",
      hints: [
        "net_v = 0.08*1200000 - 50000 = 46000.",
        "net_t = 0.12*1200000 - 500000 = negatif → pilih voucher.",
        "target = min(7500, 300jt//50000) = 6000.",
      ],
      code: {
        starter: `# (n, uplift_voucher, uplift_telp, clv)\nn, uv, ut, clv = 7500, 0.08, 0.12, 1200000\nBIAYA_V, BIAYA_T = 50000, 500000\nBUDGET = 300_000_000\n\n# TULIS KODEMU: pilih aksi by net, alokasikan budget\nnet_v =\nnet_t =\nif net_v >= net_t:\n    aksi, net, biaya = "voucher", net_v, BIAYA_V\nelse:\n    aksi, net, biaya = "telepon", net_t, BIAYA_T\ntarget =\nnet_tot =\n\nprint(f"aksi={aksi} target={target} net_tot={net_tot:.0f}")`,
        lockLines: 4,
        solution: `# (n, uplift_voucher, uplift_telp, clv)\nn, uv, ut, clv = 7500, 0.08, 0.12, 1200000\nBIAYA_V, BIAYA_T = 50000, 500000\nBUDGET = 300_000_000\n\n# TULIS KODEMU: pilih aksi by net, alokasikan budget\nnet_v = uv * clv - BIAYA_V\nnet_t = ut * clv - BIAYA_T\nif net_v >= net_t:\n    aksi, net, biaya = "voucher", net_v, BIAYA_V\nelse:\n    aksi, net, biaya = "telepon", net_t, BIAYA_T\ntarget = min(n, BUDGET // biaya)\nnet_tot = target * net\n\nprint(f"aksi={aksi} target={target} net_tot={net_tot:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "net_v", value: 46000, tol: 1, label: "`net_v` seharusnya 46000", msg: "0,08 × 1,2jt − 50rb." },
          { kind: "equal", task: "t2", name: "net_tot", value: 276000000, tol: 1, label: "`net_tot` seharusnya 276000000", msg: "6.000 × 46.000. Telepon net negatif → tidak dipilih." },
          { kind: "stdout_matches", task: "t2", pattern: "aksi=voucher", label: "`print` menampilkan aksi", msg: "Voucher menang: net 46rb vs telepon −356rb." },
        ],
      },
      reference: "Fase 3 = triase UGD: siapa tertolong, siapa jangan disentuh.",
    },
    {
      id: "fase4",
      eyebrow: "Langkah 4 · Fase 4",
      title: "Rp2 miliar dibagi dengan matematika",
      prose: [
        "Fase 4: alokasikan Rp2M antar-channel × segmen dengan dua batas: (1) batas CAC per segmen — channel-segmen di atas batas = coret; (2) marginal ROI — samakan di semua yang lolos. Sisa 10% untuk eksperimen channel baru (bandit mindset, MK9).",
        "Matriks MajuMart: Champions (batas Rp2jt): search (CAC 800rb, marginal ROAS 4) → Rp600jt; referral (CAC 300rb) → Rp200jt. Loyal (batas Rp833rb): sosmed (CAC 500rb, marginal 3,5) → Rp500jt. At Risk: retensi voucher (fase 3) → Rp300jt. Eksperimen TikTok Shop → Rp200jt. Hibernating/Lost: Rp0.",
        "Total Rp2M. Setiap rupiah punya alasan: batas CAC (mengapa boleh) + marginal ROAS (mengapa sebesar ini).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengalokasikan by ROI rata-rata atau by \u201Cchannel favorit\u201D. Dua batas (batas CAC + marginal ROI) tidak bisa ditawar — langgar satu = bakar uang.",
        type: "pitfall",
      },
      reference: "Setiap rupiah: alasan batas CAC + alasan marginal.",
    },
    {
      id: "exec-summary",
      eyebrow: "Langkah 5 · Deliverable",
      title: "Executive summary 1 halaman",
      prose: [
        "Deliverable capstone: 1 halaman what–so what–now what (MK18); detail di appendix. Contoh \u201CModeKita\u201D: 3 keputusan — (1) geser Rp600jt/tahun TV (marginal ROAS 0,6) ke digital (1,8) → +Rp720jt incremental/tahun; (2) promo 12x→4x/tahun + voucher hanya persuadable → +Rp1,1M margin/tahun; (3) win-back 220rb At Risk (biaya Rp3,3M) → +Rp12M margin/tahun.",
        "Total: +Rp13,8M margin/tahun dengan budget tetap Rp2M — murni realokasi + efisiensi. Bukti 1 baris per fase; risiko dinyatakan (±25%, eksekusi butuh tim CS 5 orang); ask konkret: persetujuan 3 keputusan + tim, 90 hari ke dampak pertama.",
        "Rubrik penilaian (ingat-ingat): diagnosis 25%, keputusan 25%, metodologi 20%, kejujuran 15%, komunikasi 15%. Lulus = total ≥ 14, tidak ada dimensi bernilai 1. 50% nilai = bisnis, bukan teknik.",
      ],
      tasks: [],
      reference: "Keputusan di 10 detik pertama. Setiap rekomendasi punya angka Rp.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek kesiapan capstone-mu",
      prose: [
        "Tiga soal cepat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Segmen CLV Rp1,2jt. Channel A CAC Rp500rb, B Rp300rb. Keputusan?",
          options: [
            { text: "Hanya B — batas CAC = Rp400rb", why: "1,2jt/3 = 400rb. A di atas batas = rugi.", correct: true },
            { text: "Keduanya — diversifikasi", why: "Diversifikasi tidak membenarkan CAC di atas batas." },
            { text: "Hanya A — jangkauan luas", why: "Jangkauan luas dengan unit economics negatif = bakar uang." },
          ],
        },
        {
          q: "Sisa budget Rp200jt dari Rp2M. Alokasi terbaik?",
          options: [
            { text: "Eksperimen channel baru (bandit mindset 10%)", why: "Alokasi \u201Coptimal\u201D hari ini = lokal optimum. 10% = premi menemukan channel berikutnya.", correct: true },
            { text: "Habiskan ke channel terbaik", why: "Itu memaksimalkan lokal optimum, bukan menemukan yang global." },
            { text: "Simpan", why: "Uang diam = peluang hilang." },
          ],
        },
        {
          q: "Slide 1 presentasi direksi berisi?",
          options: [
            { text: "3 keputusan + tabel segmen (what–so what–now what)", why: "Direksi mengeksekusi keputusan, bukan metodologi.", correct: true },
            { text: "Metodologi lengkap", why: "Itu appendix. Slide 1 = keputusan." },
            { text: "50 chart", why: "Kisah Budi: direksi tidur." },
          ],
        },
      ],
    },
    {
      id: "adv-fase0",
      eyebrow: "Langkah 7 · Fase 0",
      title: "Fase yang hilang: audit data sebelum fase 1",
      prose: [
        "Capstone punya fase 0 yang tidak tertulis di brief: audit definisi & tracking SEBELUM diagnosis. Daftar periksa hari pertama: (1) definisi 'aktif', 'churn', 'pelanggan' — samakan dengan finance & ops; (2) tracking — event purchase server-side + dedup? UTM disiplin? (3) anomali — spike/drop yang tidak masuk akal di data 2 tahun; (4) kontrak metrik — tulis sebelum query pertama.",
        "Worked MajuMart: audit menemukan 'transaksi' mencakup refund yang belum di-net-off (revenue +8% fiktif) dan 'aktif' = login (bukan transaksi) — membuat retention terlihat 2x lipat. Dua jam audit menghemat satu minggu analisis di atas data salah.",
        "Aturan: tidak ada fase 1 sebelum fase 0 lolos. Analis yang melewatkan fase 0 = arsitek yang membangun di atas tanah yang belum diukur.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Audit MajuMart: revenue +8% fiktif (refund tak di-net-off), retention 2x (definisi 'aktif' = login). Tindakan?",
          options: [
            { text: "Perbaiki definisi + net-off refund DULU — baru fase 1", why: "Semua fase di atasnya (CLV, churn, alokasi) terkontaminasi jika fondasi salah.", correct: true },
            { text: "Lanjut — 8% kecil", why: "8% fiktif mengubah batas CAC semua segmen; tidak kecil." },
            { text: "Catat sebagai catatan kaki", why: "Catatan kaki tidak memperbaiki angka yang dipakai direksi." },
            { text: "Minta data baru", why: "Datanya ada; yang salah definisinya." },
          ],
        },
        {
          q: "Mengapa fase 0 tidak boleh dilewatkan walau deadline mepet?",
          options: [
            { text: "Kesalahan fondasi melipatgandakan di semua fase — 2 jam audit vs 1 minggu sia-sia", why: "Leverage audit tertinggi di seluruh proyek.", correct: true },
            { text: "Agar terlihat teliti", why: "Bukan soal penampilan — soal kebenaran semua angka." },
            { text: "Boleh dilewatkan jika data dari BI", why: "Data BI pun punya definisi yang harus diverifikasi." },
            { text: "Tidak penting untuk capstone", why: "Justru capstone menguji disiplin ini (rubrik kejujuran 15%)." },
          ],
        },
      ],
      reference: "Fase 0: definisi + tracking + anomali + kontrak metrik. Dulu.",
    },
    {
      id: "adv-jebakan-capstone",
      eyebrow: "Langkah 8 · Jebakan capstone",
      title: "Lima cara menggagalkan capstone yang 'teknisnya benar'",
      prose: [
        "(1) Analisis tanpa keputusan — 30 chart, nol rekomendasi. Rubrik: 50% nilai = bisnis. (2) Alokasi by rata-rata — blended CAC menyembunyikan segmen beracun (pelajaran MK1). (3) Mengabaikan guardrail — scale tanpa batas CAC = bakar uang sistematis. (4) Targeting by risiko bukan uplift — membangunkan sleeping dogs (pelajaran MK11). (5) Satu angka tanpa interval — 'CLV Rp2,5jt' tanpa sensitivitas = klaim yang rapuh.",
        "Setiap jebakan punya penawar yang sudah dipelajari di MK1–MK18. Capstone menguji apakah kamu MEMAKAI semuanya — bukan apakah kamu HAFAL semuanya.",
        "Checklist sebelum presentasi: tiap rekomendasi punya angka Rp + batas + risiko yang dinyatakan + ask konkret. Yang tidak punya = belum rekomendasi, masih opini.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Capstone 'teknis sempurna' tetapi nol rekomendasi konkret. Nilai?",
          options: [
            { text: "Gagal — 50% rubrik = bisnis/keputusan", why: "Analisis tanpa keputusan = hiburan, bukan pekerjaan analis.", correct: true },
            { text: "Lulus — tekniknya benar", why: "Rubrik eksplisit: keputusan 25% + diagnosis 25%." },
            { text: "Nilai penuh", why: "Jauh dari itu." },
            { text: "Tergantung presenter", why: "Presentasi bagus tidak menyelamatkan nol keputusan." },
          ],
        },
        {
          q: "Rekomendasi 'naikkan budget digital 50%' tanpa angka Rp, batas, atau risiko. Status?",
          options: [
            { text: "Opini, bukan rekomendasi — belum layak presentasi", why: "Checklist: angka Rp + batas + risiko + ask. Empat-empatnya wajib.", correct: true },
            { text: "Cukup — arahnya benar", why: "'Arah benar' tanpa angka = tidak bisa dieksekusi." },
            { text: "Bagus — sederhana", why: "Sederhana ≠ lengkap. Direksi butuh angka untuk memutuskan." },
            { text: "Tergantung konteks", why: "Konteks tidak menggantikan angka." },
          ],
        },
      ],
      reference: "Checklist: Rp + batas + risiko + ask. Lima jebakan dihindari.",
    },
    {
      id: "intuisi-hari-pertama",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Capstone = hari pertama kerja, bukan ujian akhir",
      prose: [
        "Bedakan dua mindset: 'ujian' (tunjukkan yang kupelajari) vs 'hari pertama kerja' (selesaikan masalah atasan). Capstone menilai yang kedua. Tiga heuristik pekerjanya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: atasan tidak membayar model — ia membayar keputusan yang bisa dipertanggungjawabkan",
        body: "Heuristik pertama: mulai dari keputusan, mundur ke analisis. 'Ke mana Rp2 miliar?' → butuh batas CAC → butuh CLV → butuh data bersih. Analis 'ujian' mulai dari data dan berharap keputusan muncul; analis 'kerja' mulai dari keputusan dan hanya menganalisis yang dibutuhkan. Ini menghemat 70% kerja yang tidak perlu — dan 70% itulah yang membedakan senior dari junior. Heuristik kedua: kejujuran adalah strategi, bukan moralitas. Menyatakan 'efek ini ±25%, butuh tim CS 5 orang' TERDENGAR lemah tetapi MEMENANGKAN kepercayaan — direksi yang tahu risikonya akan mendukungmu saat risiko terjadi. Analis yang menjanjikan presisi palsu akan disalahkan saat angka meleset. Heuristik ketiga: selesaikan loop-nya. Analisis yang berhenti di rekomendasi = setengah pekerjaan. Tentukan: siapa pemilik tiap aksi, kapan review pertama (30-60-90 hari), metrik apa yang membuktikan berhasil. Capstone yang hebat tidak berakhir di presentasi — ia berakhir di kalender tindak lanjut. Satu file, satu kalimat, satu minggu — dan tiga heuristik ini yang mengubahnya dari tugas menjadi karier.",
      },
      reference: "Keputusan dulu; jujur = strategi; tutup loop dengan pemilik + tanggal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: hari pertama kerja sebagai analis",
      prose: [
        "Skenario satu — data kotor di depan mata (refund belum di-net-off, definisi 'aktif' = login): FASE 0 dulu — bersihkan sebelum analisis. Analisis di atas data kotor adalah presisi menuju kesimpulan salah (revenue fiktif −8%, retention 41% → 23%).",
        "Skenario dua — banyak segmen, budget terbatas: pakai tabel batas CAC per segmen (Champions Rp2jt … Lost Rp0). Satu budget untuk semua adalah subsidi silang yang tidak disadari.",
        "Skenario tiga — kampanye retensi: voucher hanya untuk persuadables (net +Rp390jt), bukan blast ke semua (net +Rp12jt). Pelajaran MK6 dan MK11 dipakai di sini.",
        "Skenario empat — alokasi budget: gabungkan semua lensa (funnel, CLV, uplift, inkrementalitas). Capstone menilai apakah lensanya dipakai bersamaan, bukan dihafal terpisah.",
        "Skenario lima — presentasi ke atasan: satu halaman, angka dulu, metodologi kemudian. Eksekutif membeli keputusan, bukan notebook.",
        "Aturan praktis 10 detik: FASE 0 selesai (data bersih)? Batas CAC per segmen? Target = persuadables? Semua lensa dipakai? Satu halaman?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mindset 'ujian' — memamerkan semua teknik yang dipelajari. Hari pertama kerja tidak menilai teknik; ia menilai apakah masalah atasan selesai. Teknik yang tidak mengubah keputusan adalah latihan mengetik.",
      },
      reference: "FASE 0 dulu → batas CAC per segmen → persuadables → satu halaman.",
    },
    {
      id: "minicase-minggukedua",
      eyebrow: "Langkah 11 · Mini-case end-to-end",
      title: "MajuMart, minggu kedua: presentasi direksi (evaluasi penuh)",
      prose: [
        "Minggu kedua tiba. Kamu presentasi 1 halaman: FASE 0 — refund di-net-off (−8% revenue fiktif), definisi 'aktif' = transaksi (retention terkoreksi 41% → 23%). FASE 1–2 — tabel batas CAC: Champions Rp2jt (8%), Loyal Rp833rb (20%), At Risk Rp400rb (15%), Hibernating Rp100rb, Lost Rp0. FASE 3 — uplift At Risk: voucher ke persuadables (net +Rp390jt proyeksi) — BUKAN blast (net +Rp120jt + risiko dogs). FASE 4 — Rp2M: search→Champions Rp600jt, sosmed→Loyal Rp500jt, referral Rp200jt, retensi voucher Rp300jt, eksperimen TikTok Rp200jt, Hibernating/Lost Rp0.",
        "Direksi bertanya tiga hal. (1) 'Kenapa Hibernating Rp0 — bukankah mereka 25% basis?' Jawab: batas CAC Rp100rb < CAC termurah Rp300rb; setiap rupiah ke mereka = rugi pasti. Win-back hanya jika channel < Rp100rb ditemukan (eksperimen 10%). (2) 'Yakin voucher > blast?' Jawab: pilot 1.000 menunjukkan net 3,25x lipat + menghindari dogs; risiko dinyatakan ±25%. (3) 'Kapan dampak terlihat?' Jawab: 30 hari (retensi), 60 hari (alokasi), 90 hari (review penuh) — dengan pemilik tiap aksi.",
        "Evaluasi end-to-end — nilai dirimu dengan rubrik: diagnosis (apakah fase 0 + segmentasi benar? 25%), keputusan (apakah tiap rupiah punya alasan Rp? 25%), metodologi (apakah uplift/MMM dipakai di tempat yang benar? 20%), kejujuran (apakah risiko ±25% dan asumsi dinyatakan? 15%), komunikasi (apakah 1 halaman what–so what–now what? 15%). Lulus = total ≥ 14, tidak ada dimensi bernilai 1.",
        "Pertanyaan refleksi: (1) Fase mana yang paling sering dilewatkan analis junior — dan berapa biayanya? (2) Jika direksi memaksa 'tambah budget Hibernating', respons profesionalmu? (3) Satu hal yang akan kamu ubah jika mengulang minggu ini?",
        "Pembahasan: (1) Fase 0 — biayanya seluruh analisis di atas data salah (kasus refund +8%). (2) Tunjukkan batas CAC Rp100rb vs CAC Rp300rb + tawarkan pilot kecil sebagai kompromi + dokumentasikan penolakan (pelajaran MK18). (3) Jawaban bervariasi — yang dinilai adalah kesadaran akan trade-off, bukan jawaban tunggal.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Direksi: 'Hibernating 25% basis, kenapa Rp0?' Jawaban terbaik?",
          options: [
            { text: "Batas CAC Rp100rb < CAC termurah Rp300rb — setiap rupiah = rugi pasti; win-back hanya via eksperimen channel murah", why: "Keputusan by angka, bukan by ukuran segmen. Tawarkan jalan (eksperimen 10%), bukan penolakan mentah.", correct: true },
            { text: "'Karena saya bilang begitu'", why: "Otoritas tanpa angka = tidak profesional." },
            { text: "Setuju tambah budget agar direksi senang", why: "Menyenangkan atasan dengan uang perusahaan = melanggar tugas analis." },
            { text: "Abaikan pertanyaan", why: "Pertanyaan direksi = kebutuhan informasi; abaikan = kehilangan kepercayaan." },
          ],
        },
        {
          q: "Kriteria 'lulus' capstone menurut rubrik?",
          options: [
            { text: "Total ≥ 14 DAN tidak ada dimensi bernilai 1", why: "Kegagalan total di satu dimensi (mis. kejujuran = 1) = gagal, berapa pun totalnya.", correct: true },
            { text: "Total ≥ 14 saja", why: "Syarat kedua eksplisit: tidak ada dimensi 1." },
            { text: "Teknik sempurna", why: "50% rubrik = bisnis, bukan teknik." },
            { text: "Presentasi memukau", why: "Komunikasi 15% — tidak bisa menutupi keputusan yang kosong." },
          ],
        },
        {
          q: "Fase 0 dilewatkan demi deadline. Konsekuensi terbesar?",
          options: [
            { text: "Seluruh fase di atas data salah — refund +8% fiktif mengubah semua batas CAC", why: "Kesalahan fondasi melipatganda; 2 jam audit vs 1 minggu sia-sia.", correct: true },
            { text: "Tidak ada — data BI pasti benar", why: "BI pun punya definisi yang harus diverifikasi." },
            { text: "Hanya fase 1 terpengaruh", why: "CLV, churn, alokasi — semua memakai angka yang sama." },
            { text: "Bisa diperbaiki nanti", why: "'Nanti' = setelah direksi memutuskan by angka salah." },
          ],
        },
      ],
      reference: "Evaluasi dengan rubrik 5 dimensi; fase 0 tidak boleh dilewatkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal terakhir track ini. Capstone = bukti kamu analis lengkap: diagnosis, nilai, targeting, alokasi — dan keberanian memutuskan.",
      ],
      tasks: [],
      summary: [
        "Fase 1–2: diagnosis + CLV → batas CAC = CLV/3 per segmen.",
        "Fase 3: uplift → persuadable; net = uplift×CLV − biaya.",
        "Fase 4: batas CAC + marginal ROI + 10% eksperimen.",
        "Deliverable: 1 halaman what–so what–now what; detail di appendix.",
        "Hari 0: audit definisi & tracking — fondasi semua fase.",
        "Fase 0 tidak boleh dilewatkan: definisi + tracking + anomali + kontrak metrik.",
        "Hindari 5 jebakan: tanpa keputusan, rata-rata, tanpa guardrail, risiko-bukan-uplift, tanpa interval.",
      ],
      next: { label: "HD1 — Sistem Kesehatan", href: "/learn/hd1-sistem-kesehatan" },
      quiz: [
        {
          q: "Urutan fase capstone dan kenapa?",
          options: [
            { text: "1 diagnosis → 2 nilai → 3 targeting → 4 alokasi (ketergantungan logis)", why: "Alokasi butuh batas CAC (fase 2). Satu aturan keras: jangan alokasi sebelum tahu nilai.", correct: true },
            { text: "4→3→2→1", why: "Terbalik total." },
            { text: "Acak — yang penting lengkap", why: "Urutan = logika ketergantungan, bukan birokrasi." },
          ],
        },
        {
          q: "Kampanye retensi: target \u201Cberisiko\u201D vs \u201Cpersuadable\u201D?",
          options: [
            { text: "Persuadable (uplift) — yang berubah karena aksi", why: "\u201CBerisiko\u201D mencakup lost causes & sleeping dogs. Kasus TelkoNusa membuktikannya.", correct: true },
            { text: "Berisiko — paling butuh", why: "\u201CButuh\u201D ≠ \u201Crespons\u201D. Itu kesalahan Rp500jt." },
            { text: "Semua — adil", why: "Adil tapi boros + berbahaya (dogs)." },
          ],
        },
        {
          q: "Channel CAC Rp600rb untuk segmen At Risk (batas Rp400rb). Keputusan?",
          options: [
            { text: "Coret untuk segmen itu — cari channel lebih murah atau terima", why: "Batas CAC = aturan keras per segmen.", correct: true },
            { text: "Pakai — rata-rata masih oke", why: "Rata-rata menyembunyikan kerugian per segmen." },
            { text: "Naikkan budget-nya", why: "Memperbesar kerugian." },
          ],
        },
        {
          q: "Stakeholder menolak rekomendasi. Respons profesional?",
          options: [
            { text: "Tunjukkan asumsi + tawarkan pilot kecil + dokumentasikan penolakan", why: "Analis = penasihat yang catatannya rapi, bukan raja.", correct: true },
            { text: "Paksa sampai setuju", why: "Bukan wewenang analis; merusak hubungan." },
            { text: "Buang rekomendasi", why: "Menyerah tanpa jejak = tidak profesional." },
          ],
        },
        {
          q: "Satu metrik pamungkas pipeline analytics menurut MK17/MK19?",
          options: [
            { text: "% temuan yang menjadi keputusan", why: "Analisis tanpa eksekusi = hiburan. Itulah nilai analis.", correct: true },
            { text: "Akurasi model tertinggi", why: "Akurasi tanpa keputusan = hobi (rubrik: analisis tanpa keputusan = gagal)." },
            { text: "Jumlah chart", why: "Bukan." },
          ],
        },
      ],
    },
  ],
};
