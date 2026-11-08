import type { V2Lesson } from "../lib/types";

export const mr39: V2Lesson = {
  slug: "mr39-climate-risk-trading-book",
  track: "Market Risk",
  module: "Risiko Iklim",
  title: "MR39 — Climate Risk di Trading Book: Transisi, Fisik, dan Stress Test",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Saham batubara yang 'murah' — sampai pajak karbon diumumkan",
      prose: [
        "Januari 2026, desk ekuitas Bank Nusantara memegang saham perusahaan batubara Rp320 miliar — 40 persen dari portofolio trading Rp800 miliar. Alasannya: valuasi murah (PER 4x), dividen 8 persen, dan VaR harian yang kecil — saham itu 'stabil'. Maret 2026, pemerintah mengumumkan pajak karbon Rp300.000 per ton CO2e mulai 2027 — dan harga saham batubara jatuh 15 persen dalam sebulan. Kerugian Rp48 miliar — 6 persen dari seluruh portofolio. VaR harian tidak pernah melihatnya datang: risiko itu bukan volatilitas — ia kebijakan.",
        "Inilah climate risk di trading book: risiko yang tidak ada di data historis — karena pajak karbon 2027 belum pernah ada di data 2020–2025. VaR yang dihitung dari return historis mengasumsikan masa depan seperti masa lalu; risiko iklim justru adalah perubahan struktural yang membuat masa lalu tidak relevan. Bank yang hanya memakai VaR historis untuk aset karbon sedang mengukur suhu dengan termometer yang rusak.",
        "Lesson ini membangun topik yang mendapat NOL hit di seluruh track Market Risk: 'climate' dan 'iklim' tidak pernah muncul di file mr mana pun. Sisi kredit sudah punya CR28 (climate risk kredit) dan PM-C15 membahas skenario iklim dari sisi portofolio — tetapi trading book tidak punya padanannya. Setelah lesson ini kamu bisa: (1) membedakan risiko transisi dan risiko fisik; (2) menghitung kerugian skenario transisi; (3) menjelaskan stranded assets dan carbon beta; (4) merancang stress test iklim NGFS untuk trading book; (5) menjelaskan keterbatasan data iklim.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "CR28 membahas climate risk dari sisi kredit (PD/LGD debitur yang terpapar iklim) dan PM-C15 membahas skenario iklim NGFS dari sisi portofolio investasi (WACI, greenium, Orderly vs Disorderly). Di track Market Risk, grep menyeluruh tidak menemukan satu pun penyebutan climate atau iklim. Lesson ini membangun sudut trading book: risiko transisi pada harga saham dan obligasi yang diperdagangkan harian, stranded assets, carbon beta, dan stress test intraday-to-tahunan untuk trading book.",
      },
      reference: "Portofolio Rp800 juta; sleeve karbon Rp320 juta (40 persen). Skenario Orderly: turun 15 persen → rugi Rp48 juta (6 persen portofolio). Disorderly: turun 30 persen → rugi Rp96 juta (12 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengukur risiko iklim di trading book — risiko yang tidak ada di data historis.",
        "(1) Membedakan risiko transisi dan risiko fisik;",
        "(2) Menghitung kerugian skenario transisi untuk sleeve karbon-intensif;",
        "(3) Menjelaskan stranded assets dan carbon beta;",
        "(4) Merancang stress test iklim NGFS untuk trading book;",
        "(5) Menjelaskan keterbatasan data iklim dan greenwashing.",
      ],
      tasks: [],
    },
    {
      id: "transisi-fisik",
      eyebrow: "Langkah 3 · Teori",
      title: "Risiko transisi vs risiko fisik",
      prose: [
        "Risiko transisi adalah risiko dari PERUBAHAN menuju ekonomi rendah karbon: pajak karbon, larangan batubara, subsidi kendaraan listrik, dan perubahan preferensi konsumen. Ia memukul aset karbon-intensif secara tiba-tiba — seperti saham batubara di cerita pembuka yang jatuh 15 persen karena pengumuman pajak. Empat salurannya: kebijakan (pajak, regulasi), teknologi (energi surya yang lebih murah dari batubara), pasar (konsumen menolak produk kotor), dan reputasi (investor menarik dana). Risiko transisi bekerja dalam hitungan minggu — secepat pengumuman kebijakan.",
        "Risiko fisik adalah risiko dari DAMPAK iklim itu sendiri: banjir, kekeringan, panas ekstrem, dan kenaikan permukaan laut. Ia memukul aset secara langsung: pabrik yang kebanjiran, perkebunan yang kekeringan, properti pesisir yang tenggelam. Dua jenisnya: akut (banjir bandang yang menghancurkan pabrik dalam sehari) dan kronis (suhu yang naik 2 derajat selama 20 tahun dan menurunkan produktivitas pertanian). Risiko fisik bekerja dalam hitungan tahun — tetapi saat ia datang, ia tidak memberi peringatan.",
        "Stranded assets adalah jembatan antara keduanya: aset yang kehilangan nilainya sebelum umur ekonomisnya habis — karena transisi (tambang batubara yang tidak boleh ditambang lagi) atau karena fisik (pembangkit pesisir yang kebanjiran). Cadangan batubara dan minyak yang tercatat sebagai aset di neraca perusahaan bisa menjadi stranded bila kebijakan iklim melarang pembakarannya — nilai buku yang besar, nilai pasar yang kecil. Investor yang membeli saham perusahaan dengan cadangan besar sedang membeli opsi bahwa cadangan itu AKAN dibakar — opsi yang nilainya bergantung pada kebijakan.",
        "Carbon beta mengukur sensitivitas aset terhadap harga karbon: berapa persen harga saham berubah bila harga karbon naik 10 dolar per ton. Perusahaan batubara punya carbon beta negatif besar (harga karbon naik → laba turun → harga saham turun); perusahaan energi surya punya carbon beta positif (harga karbon naik → daya saing naik). Carbon beta adalah 'beta' kedua — di samping beta pasar (PM-A9) — yang menjelaskan return saham di era transisi. Portofolio dengan carbon beta agregat negatif besar sedang bertaruh melawan kebijakan iklim — taruhan yang kalah saat pajak karbon diumumkan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira risiko iklim hanya soal 'perusahaan hijau vs kotor'. Risiko iklim adalah risiko HARGA: pajak karbon mengubah laba, banjir mengubah aset, dan perubahan teknologi mengubah daya saing. Perusahaan 'kotor' dengan rencana transisi yang kredibel bisa lebih aman dari perusahaan 'bersih' yang valuasinya sudah mencerminkan kesempurnaan.",
      },
      reference: "Risiko transisi: kebijakan, teknologi, pasar, reputasi — bekerja dalam minggu. Risiko fisik: akut dan kronis — bekerja dalam tahun.",
    },
    {
      id: "skenario",
      eyebrow: "Langkah 4 · Teori",
      title: "Skenario NGFS dan kerugian portofolio",
      prose: [
        "Skenario NGFS (Network for Greening the Financial System) adalah stress test standar untuk risiko iklim — dipakai PM-C15 dari sisi portofolio dan di sini dari sisi trading book. Tiga skenario utama. Orderly (transisi teratur): harga karbon naik bertahap dan terprediksi, teknologi beradaptasi — kerugian moderat. Disorderly (transisi terlambat lalu tiba-tiba): tidak ada kebijakan bertahun-tahun, lalu pajak karbon tinggi mendadak — kerugian besar di aset karbon. Hot House World (tidak ada transisi): emisi terus naik, suhu naik 3 derajat lebih — kerugian fisik besar dari banjir, panas, dan gagal panen.",
        "Hitung kerugian skenario untuk trading book cerita pembuka. Portofolio Rp800 juta; sleeve karbon-intensif Rp320 juta (40 persen). Skenario Orderly: sleeve turun 15 persen → kerugian 320 × 0,15 = Rp48 juta — 6 persen dari portofolio. Skenario Disorderly: sleeve turun 30 persen → kerugian 320 × 0,30 = Rp96 juta — 12 persen dari portofolio. Skenario Hot House World: kerugian fisik memukul real estate dan infrastruktur di portofolio — ilustratif 10 persen dari portofolio (Rp80 juta) dalam jangka panjang, ditambah kerugian transisi yang tidak terjadi. Angka-angka ini ilustratif — tetapi ordonya benar: Disorderly adalah skenario terburuk untuk trading book jangka pendek, Hot House World terburuk untuk jangka panjang.",
        "Tiga hal yang membuat stress test iklim berbeda dari stress test biasa (MR7). Pertama, horizon: risiko iklim bekerja dalam 5–30 tahun — jauh lebih panjang dari horizon VaR 10 hari. Stress test iklim memakai horizon tahunan, bukan harian. Kedua, data: tidak ada data historis untuk pajak karbon 2027 — skenario dibangun dari model iklim dan kebijakan, bukan dari return masa lalu. Ketiga, transmisi: risiko iklim memukul lewat jalur yang tidak ada di model risiko biasa — kebijakan, teknologi, dan fisik — sehingga faktor risiko baru harus ditambahkan ke model.",
        "Keterbatasan yang jujur: data emisi perusahaan (Scope 1, 2, 3 — PM-C15) sering tidak diaudit, tidak lengkap, dan tidak sebanding antar perusahaan. Greenwashing merajalela: perusahaan mengklaim 'net zero 2050' tanpa rencana yang kredibel. Stress test yang memakai data emisi yang salah memberi rasa aman yang palsu. Aturan praktis: periksa sumber data emisi (diaudit atau self-reported?), periksa cakupan Scope 3 (70–90 persen emisi ada di sana), dan curigai klaim net zero tanpa target antara yang terukur.",
      ],
      tasks: [],
      formula: String.raw`\text{Rugi}_{skenario} = \text{Sleeve}_{karbon} \times \text{Shock}_{skenario}`,
      formulaNote: "Sleeve karbon = 320; shock Orderly 15 persen → rugi 48 (6 persen portofolio); shock Disorderly 30 persen → rugi 96 (12 persen portofolio). Portofolio total 800.",
      reference: "Orderly: rugi Rp48 juta (6 persen). Disorderly: rugi Rp96 juta (12 persen). Hot House World: kerugian fisik jangka panjang.",
    },
    {
      id: "lab-iklim",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin stress test iklim trading book",
      prose: [
        "Lab ini membangun mesin stress test iklim: dari nilai portofolio, porsi sleeve karbon, dan shock skenario — hitung kerugian Orderly, Disorderly, dan dampaknya terhadap portofolio.",
        "Hitung dulu di kepala. Sleeve karbon = 800 × 0,40 = Rp320 juta. Orderly: 320 × 0,15 = Rp48 juta; dampak portofolio = 48 dibagi 800 × 100 = 6,0 persen. Disorderly: 320 × 0,30 = Rp96 juta; dampak = 96 dibagi 800 × 100 = 12,0 persen.",
        "Tugas lab: tulis fungsi yang menerima nilai portofolio, porsi karbon, shock Orderly, dan shock Disorderly — lalu mencetak kerugian Orderly, kerugian Disorderly, dan dampak Disorderly terhadap portofolio dalam persen. Tiga angka ini adalah ringkasan stress test iklim dalam satu baris.",
        "Setelah lolos, coba eksperimen: turunkan porsi karbon menjadi 10 persen dan lihat kerugian Disorderly jatuh ke Rp24 juta (3 persen portofolio) — lalu tanyakan: berapa porsi karbon maksimum yang masih bisa kamu tanggung bila Disorderly datang besok?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rugi_orderly` (sleeve karbon dikali shock Orderly)" },
        { id: "t2", text: "Hitung `rugi_disorderly` (sleeve karbon dikali shock Disorderly)" },
        { id: "t3", text: "Hitung `dampak_persen` (rugi Disorderly dibagi portofolio, dikali 100)" },
      ],
      expected: "rugi_orderly=48.0\nrugi_disorderly=96.0\ndampak_persen=12.0",
      hints: [
        "Sleeve karbon = portofolio x porsi karbon.",
        "Rugi skenario = sleeve karbon x shock skenario.",
        "Dampak persen = rugi Disorderly / portofolio x 100.",
      ],
      code: {
        starter: `# Trading book Rp800 jt, sleeve karbon 40%, shock Orderly 15%, Disorderly 30%.\nportofolio = 800.0\nporsi_karbon = 0.40\nshock_orderly = 0.15\nshock_disorderly = 0.30\n\n# TULIS KODEMU: hitung rugi_orderly, rugi_disorderly, dampak_persen.\n# Cetak, per baris: rugi_orderly, rugi_disorderly, dampak_persen.\n\n`,
        lockLines: 5,
        solution: `# Trading book Rp800 jt, sleeve karbon 40%, shock Orderly 15%, Disorderly 30%.\nportofolio = 800.0\nporsi_karbon = 0.40\nshock_orderly = 0.15\nshock_disorderly = 0.30\n\n\nsleeve = portofolio * porsi_karbon\nrugi_orderly = sleeve * shock_orderly\nrugi_disorderly = sleeve * shock_disorderly\ndampak_persen = rugi_disorderly / portofolio * 100\nprint(f"rugi_orderly={rugi_orderly:.1f}")\nprint(f"rugi_disorderly={rugi_disorderly:.1f}")\nprint(f"dampak_persen={dampak_persen:.1f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "rugi_orderly", value: 48.0, tol: 0.01, label: "Rugi Orderly Rp48 juta", msg: "320 x 0,15 = 48. Skenario teratur masih melukai — 6 persen portofolio." },
          { kind: "equal", task: "t2", name: "rugi_disorderly", value: 96.0, tol: 0.01, label: "Rugi Disorderly Rp96 juta", msg: "320 x 0,30 = 96. Skenario terlambat lalu tiba-tiba menggandakan kerugian." },
          { kind: "equal", task: "t3", name: "dampak_persen", value: 12.0, tol: 0.01, label: "Dampak Disorderly 12,0 persen portofolio", msg: "96 / 800 x 100 = 12,0. Satu pengumuman pajak bisa menghapus seperdelapan portofolio." },
        ],
      },
      reference: "Rugi Orderly Rp48 juta; Disorderly Rp96 juta; dampak Disorderly 12,0 persen portofolio.",
    },
    {
      id: "pengelolaan",
      eyebrow: "Langkah 6 · Teori",
      title: "Pengelolaan: limit karbon, lindung nilai, dan pengungkapan",
      prose: [
        "Pengelolaan risiko iklim di trading book punya empat alat. Pertama, limit karbon: batas maksimum sleeve karbon-intensif (misalnya 20 persen portofolio) dan batas carbon beta agregat — seperti limit konsentrasi (MR17), tetapi untuk faktor iklim. Kedua, lindung nilai: membeli opsi jual (put) pada saham karbon-intensif atau menjual futures karbon — mahal, tetapi lebih murah dari kerugian Disorderly 12 persen. Ketiga, diversifikasi transisi: menyeimbangkan sleeve karbon dengan sleeve hijau (energi terbarukan) yang UNTUNG saat harga karbon naik — carbon beta portofolio mendekati nol. Keempat, pengungkapan: melaporkan WACI (PM-C15) dan hasil stress test NGFS ke direksi dan regulator — OJK dan Bank Indonesia semakin meminta ini.",
        "Satu peringatan: lindung nilai iklim yang sempurna tidak ada. Opsi jual pada saham batubara melindungi dari jatuhnya harga saham — tetapi tidak melindungi dari risiko bahwa SELURUH sektor batubara menjadi stranded dan opsi itu sendiri tidak likuid saat dibutuhkan. Diversifikasi transisi melindungi dari arah kebijakan — tetapi tidak dari risiko fisik yang memukul semua aset di wilayah yang sama. Pengelolaan iklim adalah pengurangan risiko, bukan penghapusan.",
        "Aturan penutup: risiko iklim bukan risiko masa depan — ia risiko hari ini yang harganya belum tercermin penuh. Pajak karbon 2027 diumumkan 2026; pasar yang efisien seharusnya sudah mencerminkannya — tetapi pasar tidak efisien terhadap risiko yang belum pernah terjadi (E16). Bank yang menunggu sampai harga mencerminkan risiko iklim akan membeli perlindungan saat harganya sudah mahal. Bank yang mengukur sekarang membeli saat masih murah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira portofolio tanpa saham batubara berarti bebas risiko iklim. Risiko fisik memukul real estate, infrastruktur, dan pertanian — dan risiko transisi memukul otomotif, semen, dan penerbangan. Tidak ada portofolio yang bebas iklim; yang ada hanya portofolio yang tahu eksposurnya dan yang tidak.",
      },
      reference: "Empat alat: limit karbon, lindung nilai, diversifikasi transisi, pengungkapan WACI + NGFS.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: desk yang menjual sebelum pengumuman",
      prose: [
        "Februari 2026, tim risiko Bank Nusantara menjalankan stress test NGFS pertama untuk trading book — dan menemukan sleeve karbon 40 persen dengan kerugian Disorderly 12 persen. Mereka tidak menunggu pengumuman pajak: mereka mengusulkan pengurangan sleeve menjadi 15 persen dalam 6 minggu — menjual bertahap agar tidak menggerakkan harga — dan membeli sleeve energi terbarukan 10 persen sebagai penyeimbang. Direksi bertanya: 'Kenapa menjual saham dividen 8 persen yang stabil?' Jawaban tim risiko: 'Karena stabilitasnya adalah stabilitas sebelum pajak karbon — dan pajak itu sedang dirancang sekarang.'",
        "Maret 2026, pajak karbon diumumkan. Sleeve karbon yang tersisa (15 persen) jatuh 15 persen — kerugian Rp18 juta, bukan Rp48 juta. Sleeve terbarukan naik 10 persen — keuntungan Rp8 juta. Kerugian bersih Rp10 juta — seperempat dari yang akan terjadi tanpa tindakan. Tim risiko tidak memprediksi tanggal pengumuman — mereka hanya membaca arah kebijakan (Rancangan Undang-Undang sudah dibahas di DPR sejak 2025) dan bertindak sebelum pasar mencerminkannya.",
        "Keputusan yang benar bukan 'jual semua saham batubara' — melainkan kurangi eksposur ke tingkat yang bisa ditanggung bila Disorderly datang, dan seimbangkan dengan aset yang untung dari transisi. Manajemen risiko iklim bukan tentang menjadi hijau — melainkan tentang tidak bangkrut karena perubahan yang sudah terlihat arahnya.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, stress test dijalankan SEBELUM pengumuman — bukan sesudahnya. Kedua, pengurangan bertahap menghindari fire sale. Ketiga, penyeimbang (energi terbarukan) dibeli bersamaan — bukan hanya menjual yang kotor.",
      },
      reference: "Sleeve 40 persen → 15 persen + terbarukan 10 persen. Kerugian Rp10 juta vs Rp48 juta tanpa tindakan.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Rugi Orderly Rp48 juta (6 persen); Disorderly Rp96 juta (12 persen portofolio).",
        "Risiko transisi: kebijakan, teknologi, pasar, reputasi — bekerja dalam minggu.",
        "Risiko fisik: akut (banjir) dan kronis (suhu naik) — bekerja dalam tahun.",
        "Stranded assets: aset yang kehilangan nilai sebelum umur ekonomisnya habis.",
        "Empat alat: limit karbon, lindung nilai, diversifikasi transisi, pengungkapan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Portofolio Rp800 juta, sleeve karbon 40 persen. Shock Orderly 15 persen, Disorderly 30 persen. Berapa kerugian tiap skenario?",
          options: [
            { text: "Orderly Rp48 juta; Disorderly Rp96 juta (12 persen portofolio)", why: "Tepat: sleeve 320; 320 × 0,15 = 48; 320 × 0,30 = 96; 96/800 = 12 persen.", correct: true },
            { text: "Orderly Rp120 juta; Disorderly Rp240 juta", why: "Salah: itu 15 persen dan 30 persen dari SELURUH portofolio (800) — bukan dari sleeve karbon (320)." },
            { text: "Orderly Rp48 juta; Disorderly Rp48 juta — skenario tidak berpengaruh", why: "Salah: Disorderly (transisi terlambat lalu tiba-tiba) memukul dua kali lipat Orderly." },
            { text: "Orderly Rp32 juta; Disorderly Rp64 juta", why: "Salah: 32 dan 64 berasal dari 10 persen dan 20 persen — bukan shock 15 persen dan 30 persen." },
          ],
        },
        {
          q: "Apa beda risiko transisi dan risiko fisik?",
          options: [
            { text: "Tidak ada beda — keduanya sama", why: "Salah: transisi berasal dari PERUBAHAN menuju ekonomi rendah karbon (pajak, teknologi); fisik berasal dari DAMPAK iklim (banjir, panas)." },
            { text: "Transisi: kebijakan/teknologi/pasar yang mengubah nilai aset karbon — bekerja dalam minggu. Fisik: banjir/panas yang merusak aset — bekerja dalam tahun", why: "Tepat: transisi cepat dan kebijakan; fisik lambat dan langsung merusak.", correct: true },
            { text: "Transisi memukul aset hijau; fisik memukul aset kotor", why: "Salah: terbalik. Transisi memukul aset KOTOR (pajak karbon); fisik memukul SEMUA aset di wilayah terdampak." },
            { text: "Transisi hanya untuk bank; fisik hanya untuk asuransi", why: "Salah: keduanya memukul semua lembaga keuangan — trading book, kredit, dan asuransi." },
          ],
        },
        {
          q: "Apa itu stranded assets?",
          options: [
            { text: "Aset yang tenggelam karena banjir", why: "Salah: itu risiko fisik akut. Stranded assets lebih luas — aset yang kehilangan nilai sebelum umur ekonomisnya habis, termasuk karena kebijakan." },
            { text: "Aset yang kehilangan nilai sebelum umur ekonomisnya habis — misalnya cadangan batubara yang tidak boleh ditambang lagi", why: "Tepat: nilai buku besar, nilai pasar kecil — karena transisi atau fisik membuatnya tidak bisa dipakai.", correct: true },
            { text: "Aset yang tidak likuid dan tidak bisa dijual", why: "Salah: itu illiquiditas (MR34). Stranded spesifik soal kehilangan nilai karena transisi atau fisik — bukan soal likuiditas." },
            { text: "Aset yang nilainya naik karena kelangkaan karbon", why: "Salah: terbalik. Stranded berarti nilai JATUH — cadangan yang tidak bisa dibakar menjadi tidak berharga." },
          ],
        },
        {
          q: "Portofolio tanpa saham batubara sama sekali. Apakah ia bebas risiko iklim?",
          options: [
            { text: "Ya — tanpa batubara, tidak ada risiko iklim", why: "Salah: risiko fisik memukul real estate, infrastruktur, pertanian — dan transisi memukul otomotif, semen, penerbangan. Tidak ada portofolio yang bebas iklim." },
            { text: "Tidak — risiko fisik dan transisi memukul banyak sektor; yang penting adalah mengetahui eksposurnya", why: "Tepat: bebas batubara bukan bebas iklim. Ukur WACI dan stress test NGFS untuk seluruh portofolio.", correct: true },
            { text: "Ya — selama tidak memegang saham energi apa pun", why: "Salah: energi bukan satu-satunya sektor terpapar. Semen, baja, penerbangan, pertanian, dan properti semuanya terpapar." },
            { text: "Tidak — tetapi risikonya nol bila portofolio hanya berisi obligasi pemerintah", why: "Salah: obligasi pemerintah pun terpapar — pemerintah yang wilayahnya kebanjiran atau ekonominya bergantung batubara akan tertekan fiskalnya." },
          ],
        },
        {
          q: "Skenario NGFS mana yang terburuk untuk trading book jangka pendek — dan kenapa?",
          options: [
            { text: "Orderly — karena transisi teratur paling merusak", why: "Salah: Orderly adalah yang PALING ringan — transisi bertahap memberi waktu beradaptasi." },
            { text: "Disorderly — transisi terlambat lalu tiba-tiba membuat aset karbon jatuh tajam dalam waktu singkat", why: "Tepat: kejutan kebijakan adalah yang paling merusak harga jangka pendek. Hot House World lebih buruk jangka panjang, bukan jangka pendek.", correct: true },
            { text: "Hot House World — karena tidak ada transisi sama sekali", why: "Salah: Hot House World terburuk jangka PANJANG (kerugian fisik). Jangka pendek, Disorderly lebih merusak harga." },
            { text: "Ketiganya sama buruknya", why: "Salah: ketiganya dirancang berbeda justru karena dampaknya berbeda per horizon dan per sektor." },
          ],
        },
      ],
    },
  ],
};
