import type { V2Lesson } from "../lib/types";

export const e15: V2Lesson = {
  slug: "e15-indonesia",
  track: "Financial Markets",
  module: "Konteks Indonesia",
  title: "E15. Kit Investor Indonesia",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-17-juta",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Dari 3,9 juta ke 17 juta investor",
      prose: [
        "Tahun 2020, investor pasar modal Indonesia cuma 3,9 juta — di negara 270 juta jiwa. Lalu pandemi, aplikasi sekuritas semudah pesan ojek, dan SBN ritel bisa dibeli dari HP. Lima tahun kemudian: 17+ juta investor. Salah satunya mungkin kamu.",
        "Tapi ada sisi gelapnya: lonjakan investor tanpa lonjakan literasi = ladang subur investasi bodong (kerugian triliunan rupiah per tahun), salah paham pajak, dan “dijamin LPS” yang ternyata bersyarat. Lesson ini = kit bertahan hidup investor Indonesia.",
        "IDX = satu-satunya bursa saham Indonesia. Papan pencatatan: Utama (mapan, besar), Pengembangan (bertumbuh), Ekonomi Baru (teknologi/startup), Akselerasi (UKM). Indeks: IHSG (gabungan, tertimbang kapitalisasi), LQ45, IDX30, plus syariah (ISSI, JII). Cara ritel masuk: buka rekening di sekuritas terdaftar OJK → dapat RDN.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“IHSG naik 2% = semua saham naik 2%.” IHSG didominasi saham raksasa — saham kecil bisa saja turun saat indeks naik. Bandingkan portofoliomu dengan benchmark yang sesuai.",
      },
      reference: "IDX: satu-satunya bursa; IHSG = tertimbang kapitalisasi. Verifikasi sekuritas di OJK.",
    },
    {
      id: "sbn-ritel",
      eyebrow: "Langkah 2 · SBN ritel",
      title: "Surat utang negara untuk rakyat — setelah pajak",
      prose: [
        "SBN ritel = obligasi pemerintah yang dijual langsung ke individu WNI — dijamin UU (kupon + pokok oleh negara). Keluarga: ORI (kupon tetap, tradable), Sukuk Ritel/SR (syariah, tradable), SBR (kupon mengambang mengikuti BI-Rate dengan floor, non-tradable tapi bisa early redemption), Sukuk Tabungan/ST (syariah, non-tradable).",
        "Modal Rp100 jt, 2 tahun. SBN kupon 6,4% (PPh final 10%) vs deposito 5% (PPh final 20%). Hitung duel yang adil — setelah pajak.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `akhir_sbn` dan `akhir_dep` (rupiah)" },
        { id: "t2", text: "Hitung `selisih` (keunggulan SBN)" },
      ],
      expected: "akhir_sbn=111851776  akhir_dep=108160000  selisih=3691776",
      note: {
        title: "Sering salah",
        body: "Membandingkan return pakai angka brosur. Brosur menampilkan bruto. Keputusan memakai neto setelah pajak (dan setelah inflasi = riil, E12).",
      },
      hints: [
        "Neto SBN = 6,4% × (1 − 0,10) = 5,76%. Neto deposito = 5% × (1 − 0,20) = 4%.",
        "akhir = modal × (1 + neto)^2.",
        "selisih = akhir_sbn - akhir_dep",
      ],
      code: {
        starter: `modal = 100_000_000\nneto_sbn = 0.064 * (1 - 0.10)\nneto_dep = 0.05 * (1 - 0.20)\nn = 2\n\n# TULIS KODEMU: nilai akhir keduanya dan selisihnya\nakhir_sbn = \nakhir_dep = \nselisih = \n\nprint(f"akhir_sbn={akhir_sbn:.0f}  akhir_dep={akhir_dep:.0f}  selisih={selisih:.0f}")`,
        lockLines: 4,
        solution: `modal = 100_000_000\nneto_sbn = 0.064 * (1 - 0.10)\nneto_dep = 0.05 * (1 - 0.20)\nn = 2\n\n# TULIS KODEMU: nilai akhir keduanya dan selisihnya\nakhir_sbn = modal * (1 + neto_sbn) ** n\nakhir_dep = modal * (1 + neto_dep) ** n\nselisih = akhir_sbn - akhir_dep\n\nprint(f"akhir_sbn={akhir_sbn:.0f}  akhir_dep={akhir_dep:.0f}  selisih={selisih:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "akhir_sbn", value: 111851776, tol: 1, label: "`akhir_sbn` ≈ Rp111,9 jt", msg: "100jt × 1,0576² = 111,9 jt. Neto 5,76%." },
          { kind: "equal", task: "t1", name: "akhir_dep", value: 108160000, tol: 1, label: "`akhir_dep` = Rp108,2 jt", msg: "100jt × 1,04² = 108,2 jt. Neto 4%." },
          { kind: "equal", task: "t2", name: "selisih", value: 3691776, tol: 1, label: "`selisih` ≈ Rp3,7 jt", msg: "Selisih “gratis” Rp3,7 jt dari pilihan cerdas — pajak melebarkan keunggulan SBN." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih=3691776", label: "`print` menampilkan selisih", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "SBN 10% vs deposito 20% PPh final. Bandingkan selalu NETO setelah pajak.",
    },
    {
      id: "ojk-lps",
      eyebrow: "Langkah 3 · OJK & LPS",
      title: "Wasit, pelindung, dan penjamin bersyarat",
      prose: [
        "OJK mengatur dan mengawasi seluruh sektor jasa keuangan, plus melindungi konsumen via Satgas PASTI (pemburu investasi bodong dan pinjol ilegal). Aturan praktis: cek legalitas di OJK sebelum setor dana. Prinsip 2L: Legal (izin OJK/Bappebti) dan Logis (return masuk akal).",
        "LPS menjamin simpanan bank s.d. Rp2 miliar per nasabah per bank — DENGAN SYARAT: bunga tidak melebihi tingkat bunga penjaminan LPS, simpanan tercatat, nasabah tidak ikut menyebabkan bank bermasalah. Yang TIDAK dijamin: saham, reksa dana, SBN, kripto — hanya simpanan bank. “Dijamin LPS” untuk produk non-bank = kebohongan marketing.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dijamin` untuk 3 deposito (bunga penjaminan 4,25%)" },
        { id: "t2", text: "Cetak status tiap deposito" },
      ],
      expected: "a=0  b=2000000000  c=0",
      note: {
        title: "Sering salah",
        body: "“OJK menjamin investasiku tidak rugi.” OJK menjamin aturan main dan menindak yang ilegal — bukan menjamin return. Rugi karena pasar = risikomu sendiri.",
      },
      hints: [
        "Dijamin = min(simpanan, 2M) HANYA jika bunga ≤ 4,25%; jika tidak, 0.",
        "Deposito A: 1,5M @5% → bunga di atas penjaminan → 0.",
        "Deposito B: 3M @4% → bunga OK → dijamin 2M (batas!).",
      ],
      code: {
        starter: `batas = 2_000_000_000\nbunga_jamin = 0.0425\n\ndef cek(simpanan, bunga):\n    return min(simpanan, batas) if bunga <= bunga_jamin else 0\n\n# TULIS KODEMU: yang dijamin untuk tiap deposito\na = cek(1_500_000_000, 0.05)  # Deposito A\nb = cek(3_000_000_000, 0.04)  # Deposito B\nc = cek(500_000_000, 0.06)    # Deposito C\n\nprint(f"a={a:.0f}  b={b:.0f}  c={c:.0f}")`,
        lockLines: 7,
        solution: `batas = 2_000_000_000\nbunga_jamin = 0.0425\n\ndef cek(simpanan, bunga):\n    return min(simpanan, batas) if bunga <= bunga_jamin else 0\n\n# TULIS KODEMU: yang dijamin untuk tiap deposito\na = cek(1_500_000_000, 0.05)  # Deposito A\nb = cek(3_000_000_000, 0.04)  # Deposito B\nc = cek(500_000_000, 0.06)    # Deposito C\n\nprint(f"a={a:.0f}  b={b:.0f}  c={c:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "a", value: 0, tol: 1, label: "Deposito A: Rp0 dijamin", msg: "Bunga 5% > 4,25% → jaminan HANGUS total. Bunga tinggi + “aman” = tidak bisa dua-duanya." },
          { kind: "equal", task: "t1", name: "b", value: 2000000000, tol: 1, label: "Deposito B: Rp2 M dijamin", msg: "Bunga OK, tapi batas Rp2 M — sisa Rp1 M risiko sendiri. Solusi: pecah ke 2 bank." },
          { kind: "equal", task: "t1", name: "c", value: 0, tol: 1, label: "Deposito C: Rp0 dijamin", msg: "Bunga 6% > 4,25% → tidak dijamin." },
          { kind: "stdout_matches", task: "t2", pattern: "a=0\\s+b=2000000000\\s+c=0", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "LPS = simpanan bank s.d. Rp2 M bersyarat. Saham/reksa dana/SBN = TIDAK dijamin.",
    },
    {
      id: "pajak",
      eyebrow: "Langkah 4 · Pajak investasi",
      title: "Return sebelum pajak = ilusi",
      prose: [
        "Tarif PPh final utama: bunga deposito 20%; kupon SBN 10% (lebih ringan — insentif negara!); transaksi saham 0,1% dari nilai transaksi (final, otomatis); dividen ada ketentuan khusus. Dampaknya nyata: deposito 5% → neto 4%; SBN 6,4% → neto 5,76%.",
        "Kamu menerima kupon ORI Rp6 juta/tahun dan dividen saham Rp4 juta (keduanya PPh final 10%). Hitung bersihnya — lalu bandingkan deposito Rp1 M @4% vs ORI Rp1 M @6% setelah pajak.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `bersih_kupon` dan `bersih_dividen`" },
        { id: "t2", text: "Hitung `bersih_dep1m` dan `bersih_ori1m`" },
      ],
      expected: "bersih_kupon=5400000  bersih_dividen=3600000  bersih_dep1m=32000000  bersih_ori1m=54000000",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "“Final” artinya dipotong di sumber dan tidak masuk perhitungan progresif — beda dengan gaji (PPh 21 progresif 5–35%). Salah memodelkan pajak = salah mengukur return neto = salah memilih produk.",
      },
      hints: [
        "Bersih = bruto × (1 − tarif). Kupon/dividen: tarif 10%.",
        "Deposito Rp1 M @4%: bunga 40 jt, PPh 20%.",
        "ORI Rp1 M @6%: kupon 60 jt, PPh 10%.",
      ],
      code: {
        starter: `# TULIS KODEMU: penghasilan bersih setelah PPh final\nbersih_kupon = \nbersih_dividen = \nbersih_dep1m = \nbersih_ori1m = \n\nprint(f"bersih_kupon={bersih_kupon:.0f}  bersih_dividen={bersih_dividen:.0f}")\nprint(f"bersih_dep1m={bersih_dep1m:.0f}  bersih_ori1m={bersih_ori1m:.0f}")`,
        lockLines: 1,
        solution: `# TULIS KODEMU: penghasilan bersih setelah PPh final\nbersih_kupon = 6_000_000 * (1 - 0.10)\nbersih_dividen = 4_000_000 * (1 - 0.10)\nbersih_dep1m = 1_000_000_000 * 0.04 * (1 - 0.20)\nbersih_ori1m = 1_000_000_000 * 0.06 * (1 - 0.10)\n\nprint(f"bersih_kupon={bersih_kupon:.0f}  bersih_dividen={bersih_dividen:.0f}")\nprint(f"bersih_dep1m={bersih_dep1m:.0f}  bersih_ori1m={bersih_ori1m:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bersih_kupon", value: 5400000, tol: 1, label: "`bersih_kupon` = Rp5,4 jt", msg: "6 jt × 0,9 = 5,4 jt." },
          { kind: "equal", task: "t1", name: "bersih_dividen", value: 3600000, tol: 1, label: "`bersih_dividen` = Rp3,6 jt", msg: "4 jt × 0,9 = 3,6 jt." },
          { kind: "equal", task: "t2", name: "bersih_dep1m", value: 32000000, tol: 1, label: "`bersih_dep1m` = Rp32 jt", msg: "40 jt × 0,8 = 32 jt (PPh deposito 20%)." },
          { kind: "equal", task: "t2", name: "bersih_ori1m", value: 54000000, tol: 1, label: "`bersih_ori1m` = Rp54 jt", msg: "60 jt × 0,9 = 54 jt. Selisih “4% vs 6%” jadi 3,2% vs 5,4% setelah pajak." },
        ],
      },
      reference: "Deposito 20%, SBN 10%, saham 0,1% per transaksi. Selalu bandingkan NETO.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 5 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang LPS dan investasi bodong.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Deposito Rp3 M @4% di satu bank. Yang dijamin LPS?",
          options: [
            { text: "Rp3 M penuh", why: "Salah: batasnya Rp2 M per nasabah per bank." },
            { text: "Rp2 M (batas per nasabah per bank), sisanya Rp1 M tidak dijamin", why: "Benar: dengan syarat bunga ≤ penjaminan dan tercatat. Solusi: pecah ke 2 bank.", correct: true },
            { text: "Tidak dijamin sama sekali", why: "Salah: bunga 4% ≤ penjaminan → Rp2 M dijamin." },
            { text: "Rp3 M + bunganya", why: "Salah: bunga masa depan tidak dijamin; batasnya Rp2 M." },
          ],
        },
        {
          q: "“Investasi” menawarkan 5%/BULAN, “dijamin”, tanpa izin OJK yang jelas. Respons?",
          options: [
            { text: "Ikut — mumpung", why: "Salah: 5%/bulan = ~80%/tahun — pola Ponzi klasik." },
            { text: "Tolak: gagal 2L (tidak Legal, tidak Logis) — pola investasi bodong; laporkan ke Satgas PASTI", why: "Benar: tidak logis + tidak transparan = jangan.", correct: true },
            { text: "Ikut kecil-kecilan", why: "Salah: “kecil-kecilan” di skema Ponzi tetap hilang." },
            { text: "Tanya teman dulu", why: "Salah: teman bukan verifikator legalitas — cek OJK." },
          ],
        },
      ],
    },
    {
      id: "minicase-dinda",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Portofolio pertama Rp50 juta untuk DP rumah",
      prose: [
        "Dinda, 28 tahun, punya Rp50 juta (di luar dana darurat). Tujuan: DP rumah 4 tahun lagi. Ia tergoda: (A) all-in saham gorengan yang lagi viral, (B) deposito 5%, (C) ORI kupon 6,4%.",
        "Pertanyaan: (a) Evaluasi tiap opsi untuk horizon 4 tahun. (b) Hitung perkiraan hasil neto (setelah pajak) opsi B vs C. (c) Rekomendasimu + satu peringatan untuk opsi terpilih?",
        "Pembahasan: (a) A: tolak — horizon 4 tahun terlalu pendek untuk saham spekulatif. B: aman tapi termurah — neto 4%. C: terbaik — dijamin negara, kupon di atas deposito, pajak lebih ringan. (b) B: 50 × 1,04⁴ = Rp58,5 jt. C: 50 × 1,0576⁴ = Rp62,6 jt. Selisih Rp4,1 jt — “gratis” dari pilihan cerdas. (c) Rekomendasi: ORI (tradable — bisa jual jika DP dimajukan). Peringatan: jika BI menaikkan bunga tajam, harga pasar ORI turun (harga obligasi bergerak berlawanan dengan suku bunga) — niatkan pegang sampai jatuh tempo; atau pilih SBR (non-tradable, tanpa risiko harga) jika yakin tidak butuh jual.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Horizon menentukan risiko yang relevan: 4 tahun = risiko harga pasar (jika terpaksa jual) lebih penting dari volatilitas harian. Pilih tradable vs non-tradable sesuai kepastian horizonmu.",
      },
      reference: "Horizon 4 tahun + konservatif → SBN ritel. Butuh dana 2 tahun tanpa pusing harga → SBR/ST.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Jalur investasi ritel Indonesia: empat skenario",
      prose: [
        "Dana darurat dan kas < 1 tahun → deposito/RDPU: pokok tidak boleh berkurang; cek bunga vs penjaminan LPS! Tujuan 2–5 tahun, konservatif → SBN ritel (ORI/SR/SBR/ST): kupon > deposito + pajak 10% + dijamin UU; pilih tradable jika mungkin jual di tengah jalan.",
        "Tujuan 5+ tahun, siap belajar → saham/ETF via sekuritas berizin OJK: mulai dari ETF indeks/blue chip; verifikasi di situs OJK dulu! Ditawari “investasi” return fantastis → cek 2L dulu: Legal? Logis?",
        "Aturan 10 detik: 2L sebelum setor dana. Bandingkan selalu NETO (setelah pajak) — bukan angka brosur. “Dijamin” ada macamnya: LPS = simpanan bank bersyarat; SBN = dijamin UU; saham/reksa dana = TIDAK dijamin.",
      ],
      note: {
        title: "Intuisi: main di kandang sendiri ada aturannya",
        body: "Investor Indonesia punya keunggulan kandang: SBN ritel, pajak yang jelas, dan regulator yang bisa dihubungi — tetapi keunggulan hangus kalau tidak tahu aturannya. Empat heuristik. Pertama: SBN ritel (ORI/SR) = risk-free dalam rupiah — setiap return lain harus diukur terhadapnya; deposito 4% bukan “aman”, ia kalah dari ORI 6,4% dengan risiko yang sama-sama nyaris nol; jangan bayar mahal untuk rasa aman yang gratis. Kedua: hafalkan tiga angka pajak — deposito 20%, bunga obligasi 10%, transaksi saham 0,1% final; strategi yang mengabaikan pajak = strategi yang salah hitung; PPh mengubah pemenang. Ketiga: LPS menjamin sampai plafon per bank per nasabah — sebar dana di atas plafon ke beberapa bank; dan OJK/BI/Bappebti/LPS punya yurisdiksi masing-masing — komplain ke alamat yang benar, bukan yang paling keras. Keempat: home bias yang rasional — kewajibanmu (sekolah anak, pensiun) dalam rupiah, jadi aset intimu dalam rupiah; valas = bumbu diversifikasi, bukan makanan pokok; lindungi yang perlu, jangan spekulasikan yang tidak. Aturan 10 detiknya: ukur semua return terhadap ORI, hitung setelah pajak, sebar di atas plafon LPS.",
      },
      tasks: [],
      reference: "2L: Legal (cek OJK) + Logis (return masuk akal). Infrastruktur: KSEI (kepemilikan), KPEI (settlement).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tiga pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "IDX: satu-satunya bursa; papan Utama/Pengembangan/Ekonomi Baru/Akselerasi; IHSG = tertimbang kapitalisasi.",
        "SBN ritel: ORI/SR (tradable) vs SBR/ST (non-tradable, tanpa risiko harga); dijamin UU.",
        "OJK: wasit + pelindung; 2L (Legal, Logis); laporkan bodong ke Satgas PASTI.",
        "LPS: jamin simpanan bank s.d. Rp2 M bersyarat (bunga ≤ penjaminan, tercatat).",
        "Bandingkan selalu neto setelah pajak: SBN 10% vs deposito 20%.",
      ],
      next: { label: "E16 — Efisiensi Pasar", href: "/v2/learn/e16-efisiensi-pasar" },
      quiz: [
        {
          q: "Butuh dana 2 tahun lagi, tidak mau pusing harga pasar. Pilih?",
          options: [
            { text: "ORI (tradable)", why: "Salah: ORI bisa dijual kapan saja TAPI di harga pasar yang naik-turun." },
            { text: "SBR/ST (non-tradable, tanpa risiko harga pasar, bisa early redemption)", why: "Benar: non-tradable = tidak ada harga pasar yang bergejolak.", correct: true },
            { text: "Saham gorengan", why: "Salah: horizon 2 tahun + butuh kepastian ≠ saham spekulatif." },
            { text: "Kripto", why: "Salah: volatilitas ekstrem — kebalikan dari “tidak mau pusing”." },
          ],
        },
        {
          q: "Deposito 5% vs SBN 6,4%. Keunggulan pajak SBN?",
          options: [
            { text: "Tidak ada bedanya", why: "Salah: beda tarif PPh final melebarkan selisih." },
            { text: "PPh final SBN 10% vs deposito 20% — neto SBN 5,76% vs deposito 4,00%", why: "Benar: selisih pajak melebarkan keunggulan SBN.", correct: true },
            { text: "SBN bebas pajak", why: "Salah: SBN kena PPh final 10% — lebih ringan, bukan bebas." },
            { text: "Deposito lebih ringan pajaknya", why: "Salah: terbalik — deposito 20% > SBN 10%." },
          ],
        },
        {
          q: "Saham/reksa danamu tercatat di mana sehingga aman meski sekuritas bermasalah?",
          options: [
            { text: "Di aplikasi sekuritas", why: "Salah: aplikasi = tampilan; kepemilikan tercatat di kustodian sentral." },
            { text: "Di KSEI (kustodian sentral) — tercatat atas namamu via SID; settlement dijamin KPEI", why: "Benar: dana nasabah wajib terpisah di RDN.", correct: true },
            { text: "Di OJK", why: "Salah: OJK = pengawas, bukan pencatat kepemilikan." },
            { text: "Tidak tercatat di mana-mana", why: "Salah: tercatat di KSEI — itu yang melindungimu." },
          ],
        },
      ],
    },
  ],
};
