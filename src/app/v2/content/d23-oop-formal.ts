import type { V2Lesson } from "../lib/types";

export const d23: V2Lesson = {
  slug: "d23-oop-formal",
  track: "Python",
  module: "Rekayasa",
  title: "D23 — OOP Formal: Class, Inheritance, Polymorphism",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga jenis transaksi, satu rantai if yang tumbuh liar",
      prose: [
        "Kamu membangun agregator pembayaran untuk sebuah marketplace. Ada tiga jenis transaksi: kartu, transfer, dan QRIS — masing-masing dengan aturan biaya berbeda. Versi pertama kodenya jujur dan sederhana: satu fungsi hitung_biaya yang menerima kamus dan memakai rantai if untuk memilih rumus per jenis.",
        "Seminggu kemudian produk menambah satu jenis transaksi baru: virtual account. Kamu menambah satu cabang if lagi. Sebulan kemudian ada lagi: e-wallet, lalu paylater. Setiap jenis baru berarti mengedit fungsi yang sama, menguji ulang semua cabang lama, dan berdoa tidak ada cabang yang tertukar. Fungsi itu kini 120 baris, dan hanya kamu yang berani menyentuhnya.",
        "Lesson ini merapikan kekacauan itu dengan tiga ide OOP: class membungkus data dan perilaku jadi satu benda; inheritance memakai ulang perilaku umum tanpa menyalin kode; polymorphism membiarkan satu fungsi bekerja pada semua jenis tanpa tahu jenisnya. Setelah lesson ini kamu bisa: (1) menulis class dengan constructor dan method; (2) memakai inheritance dan super untuk memakai ulang kode; (3) merancang agar jenis baru cukup ditambah sebagai class baru tanpa mengedit kode lama.",
      ],
      tasks: [],
      note: {
        title: "Kapan OOP, kapan bukan",
        body: "OOP bukan obat untuk semua penyakit. Pipeline sekali jalan yang lurus (baca file, bersihkan, tulis hasil) lebih enak ditulis sebagai fungsi biasa. OOP bersinar saat ada BANYAK jenis benda yang perilakunya mirip tapi tidak sama — seperti jenis transaksi di sini — dan jenis baru akan terus datang.",
      },
      reference: "Class = cetak biru; object = benda yang dicetak. Inheritance = memakai ulang; polymorphism = satu panggilan, banyak perilaku.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menulis hierarki class yang rapi untuk satu domain kecil dan menjelaskannya tanpa jargon.",
        "(1) Mendefinisikan class dengan __init__ dan method, dan membedakan class dengan object;",
        "(2) Menurunkan subclass dari base class dan memanggil perilaku induk lewat super;",
        "(3) Menulis kode yang memakai polymorphism — memanggil method yang sama pada object berbeda tanpa memeriksa jenisnya;",
        "(4) Menjelaskan kapan menambah subclass baru lebih aman daripada menambah cabang if.",
      ],
      tasks: [],
    },
    {
      id: "class-dasar",
      eyebrow: "Langkah 3 · Teori",
      title: "Class: data dan perilaku dalam satu benda",
      prose: [
        "Class adalah cetak biru. Object adalah benda yang dicetak dari cetak biru itu. Sebuah transaksi kartu bukan sekadar kamus berisi id dan jumlah — ia juga tahu cara menghitung biayanya sendiri. Itu yang dibungkus class: data (atribut) dan perilaku (method) tinggal di satu tempat.",
        "Method __init__ adalah constructor: ia berjalan saat object dibuat dan menyiapkan atribut awal. Parameter pertama setiap method selalu self — rujukan ke object itu sendiri. Di dalam method, self.jumlah berarti jumlah milik object ini, bukan object lain.",
        "Contoh paling kecil: class Transaksi menyimpan id_transaksi dan jumlah, dan punya method biaya yang mengembalikan 0 — biaya default untuk transaksi yang belum punya aturan khusus. Method ini sengaja dibuat sederhana: ia adalah janji. Setiap subclass berjanji menyediakan biaya versinya sendiri.",
        "Bedakan class dengan object: Transaksi adalah class (cetak biru, tidak punya jumlah). Transaksi dengan id K1 dan jumlah 2 juta adalah object (satu benda konkret). Satu class bisa mencetak object sebanyak apa pun, masing-masing dengan datanya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Kenapa method biaya di base class mengembalikan 0",
        body: "Karena setiap jenis transaksi WAJIB punya biaya — dan lupa menulis method biaya di subclass adalah bug yang diam-diam menghasilkan 0. Di Python tidak ada pemaksaan bawaan; pola yang lebih tegas adalah melempar NotImplementedError dari base method, sehingga subclass yang lupa akan gagal berisik, bukan diam-diam benar.",
      },
      reference: "self = object ini. __init__ = menyiapkan atribut saat object dibuat.",
    },
    {
      id: "inheritance",
      eyebrow: "Langkah 4 · Teori",
      title: "Inheritance: memakai ulang tanpa menyalin",
      prose: [
        "Inheritance berarti subclass mewarisi semua yang dimiliki base class. TransaksiKartu mewarisi __init__ dari Transaksi — ia tidak perlu menulis ulang cara menyimpan id dan jumlah. Yang ia tulis hanyalah yang berbeda: rumus biayanya.",
        "Aturan biaya tiga jenis di lesson ini: kartu 1,5 persen dari jumlah ditambah 2.500; transfer gratis bila jumlah 10 juta atau lebih, selain itu 6.500; QRIS 0,7 persen dengan batas atas 5.000. Tiga rumus, tiga subclass, nol duplikasi cara menyimpan data.",
        "Method di subclass yang namanya sama dengan method induk disebut override — versi subclass menggantikan versi induk untuk object subclass itu. Saat kamu memanggil kartu.biaya(), Python memakai versi TransaksiKartu, bukan versi Transaksi. Inilah yang membuat rantai if tidak diperlukan lagi: pemilihan rumus terjadi lewat jenis object, bukan lewat pemeriksaan manual.",
        "Fungsi super() memanggil perilaku induk dari dalam subclass. Bila suatu subclass butuh __init__ tambahan — misal menyimpan nama bank penerbit — ia memanggil super().__init__ untuk bagian umum, lalu menambahkan bagiannya sendiri. Aturannya: jangan tulis ulang yang sudah ditulis induk.",
      ],
      tasks: [],
      note: {
        title: "Inheritance bukan untuk semua hubungan",
        body: "Hanya pakai inheritance untuk hubungan 'adalah': TransaksiKartu ADALAH Transaksi. Bila hubungannya 'memiliki' — misal Merchant MEMILIKI daftar transaksi — pakai atribut biasa, bukan inheritance. Inheritance yang salah (misal class Pelanggan mewarisi Transaksi karena sama-sama punya nama) adalah sumber bug paling klasik di OOP.",
      },
      reference: "Override = subclass mengganti method induk dengan versinya sendiri. super() = panggil perilaku induk.",
    },
    {
      id: "polymorphism",
      eyebrow: "Langkah 5 · Teori",
      title: "Polymorphism: satu panggilan, banyak perilaku",
      prose: [
        "Polymorphism berarti satu baris kode yang sama berperilaku berbeda tergantung object-nya. Fungsi total_biaya menerima daftar transaksi apa pun dan memanggil t.biaya() pada masing-masing — tanpa sekali pun memeriksa jenisnya. Kartu menghitung dengan rumusnya, transfer dengan rumusnya, QRIS dengan rumusnya.",
        "Inilah kebalikan dari rantai if di cerita pembuka. Dulu, menambah jenis baru berarti mengedit fungsi total_biaya. Sekarang, menambah jenis baru berarti menulis satu class baru — fungsi total_biaya tidak disentuh sama sekali. Prinsip ini bernama open-closed: kode terbuka untuk penambahan, tertutup untuk perubahan.",
        "Godaan yang harus dilawan: menulis isinstance di dalam total_biaya untuk memeriksa jenis. Begitu satu isinstance muncul, jenis kedua akan menyusul, dan kamu kembali ke rantai if — hanya dengan baju berbeda. Bila kamu merasa butuh isinstance, itu tanda method-nya belum diletakkan di tempat yang benar: pindahkan logikanya ke dalam method subclass.",
        "Satu pengecualian yang sah: isinstance untuk validasi di perbatasan sistem (misal memastikan input dari luar benar-benar sebuah Transaksi sebelum diproses). Di dalam logika bisnis, hindari.",
      ],
      tasks: [],
      note: {
        title: "Duck typing",
        body: "Python tidak memeriksa jenis object sebelum memanggil method — ia hanya memeriksa apakah method-nya ada. Inilah duck typing: bila ia berenang seperti bebek dan bersuara seperti bebek, ia diperlakukan sebagai bebek. Konsekuensinya: total_biaya bekerja pada object apa pun yang punya method biaya, bahkan yang bukan subclass Transaksi. Fleksibel, tapi menuntut disiplin penamaan.",
      },
      reference: "Polymorphism = panggil method yang sama, biarkan object yang memutuskan perilakunya.",
    },
    {
      id: "lab-oop",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: mesin biaya tiga jenis transaksi",
      prose: [
        "Sekarang tulis hierarkinya. Base class Transaksi menyimpan id_transaksi dan jumlah, dengan method biaya mengembalikan 0. Tiga subclass meng-override biaya: kartu 1,5 persen ditambah 2.500; transfer gratis bila jumlah 10 juta atau lebih, selain itu 6.500; QRIS 0,7 persen dengan batas atas 5.000.",
        "Daftar ujinya enam transaksi: kartu 2.000.000, kartu 500.000, transfer 12.000.000, transfer 3.000.000, QRIS 1.000.000, dan QRIS 400.000. Hitung di kepala dulu sebelum menjalankan: kartu pertama 32.500, kartu kedua 10.000, transfer pertama 0 (gratis), transfer kedua 6.500, QRIS pertama 5.000 (terkena batas atas), QRIS kedua 2.800. Total yang diharapkan 56.800.",
        "Perhatikan QRIS pertama: 0,7 persen dari 1.000.000 adalah 7.000 — di atas batas 5.000, jadi yang dipakai 5.000. Inilah gunanya min: rumus yang sama berlaku untuk semua nilai, tanpa cabang if di luar method.",
        "Setelah lolos, coba eksperimen: tambah satu transaksi kartu 100.000.000 dan lihat totalnya berubah tanpa satu baris pun berubah di total_biaya. Itulah polymorphism yang bekerja.",
      ],
      tasks: [
        { id: "t1", text: "Tulis class Transaksi dengan __init__ dan method biaya mengembalikan 0" },
        { id: "t2", text: "Tulis tiga subclass dengan rumus biayanya masing-masing (override biaya)" },
        { id: "t3", text: "Tulis total_biaya yang memanggil t.biaya() tanpa memeriksa jenis, lalu cetak total enam transaksi" },
      ],
      expected: "56800",
      hints: [
        "Kartu: round(jumlah * 0.015) + 2500 — round untuk menghindari pecahan rupiah.",
        "Transfer: 0 bila jumlah >= 10_000_000, selain itu 6500.",
        "QRIS: min(round(jumlah * 0.007), 5000) — batas atas lewat min, bukan if.",
        "total_biaya: sum(t.biaya() for t in daftar) — tanpa isinstance, tanpa if jenis.",
      ],
      code: {
        starter: `# Base class: simpan id dan jumlah; biaya default 0.\nclass Transaksi:\n    def __init__(self, id_transaksi, jumlah):\n        self.id_transaksi = id_transaksi\n        self.jumlah = jumlah\n\n    def biaya(self):\n        return 0\n\n# TULIS KODEMU: tiga subclass di bawah ini.\n# Kartu: 1,5 persen + 2500. Transfer: gratis bila >= 10 juta, selain itu 6500.\n# QRIS: 0,7 persen, batas atas 5000.\n\n\ndef total_biaya(daftar):\n    return 0\n\n\ndaftar = [\n    TransaksiKartu("K1", 2_000_000),\n    TransaksiKartu("K2", 500_000),\n    TransaksiTransfer("T1", 12_000_000),\n    TransaksiTransfer("T2", 3_000_000),\n    TransaksiQRIS("Q1", 1_000_000),\n    TransaksiQRIS("Q2", 400_000),\n]\n\nprint(total_biaya(daftar))`,
        lockLines: 9,
        solution: `# Base class: simpan id dan jumlah; biaya default 0.\nclass Transaksi:\n    def __init__(self, id_transaksi, jumlah):\n        self.id_transaksi = id_transaksi\n        self.jumlah = jumlah\n\n    def biaya(self):\n        return 0\n\n\nclass TransaksiKartu(Transaksi):\n    def biaya(self):\n        return round(self.jumlah * 0.015) + 2500\n\n\nclass TransaksiTransfer(Transaksi):\n    def biaya(self):\n        if self.jumlah >= 10_000_000:\n            return 0\n        return 6500\n\n\nclass TransaksiQRIS(Transaksi):\n    def biaya(self):\n        return min(round(self.jumlah * 0.007), 5000)\n\n\ndef total_biaya(daftar):\n    return sum(t.biaya() for t in daftar)\n\n\ndaftar = [\n    TransaksiKartu("K1", 2_000_000),\n    TransaksiKartu("K2", 500_000),\n    TransaksiTransfer("T1", 12_000_000),\n    TransaksiTransfer("T2", 3_000_000),\n    TransaksiQRIS("Q1", 1_000_000),\n    TransaksiQRIS("Q2", 400_000),\n]\n\nprint(total_biaya(daftar))`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "56800", label: "Total biaya enam transaksi 56.800", msg: "Hitung per transaksi: 32.500 + 10.000 + 0 + 6.500 + 5.000 + 2.800 = 56.800. Periksa rumus tiap subclass, terutama batas atas QRIS." },
          { kind: "defined", task: "t2", name: "TransaksiKartu", label: "Subclass kartu ditulis", msg: "Tulis class TransaksiKartu(Transaksi) dengan method biaya yang di-override." },
          { kind: "defined", task: "t2", name: "TransaksiQRIS", label: "Subclass QRIS ditulis", msg: "Tulis class TransaksiQRIS(Transaksi) dengan method biaya yang di-override." },
          { kind: "forbids", task: "t3", token: "isinstance", label: "Tanpa isinstance di total_biaya", msg: "Polymorphism berarti tidak memeriksa jenis. Panggil t.biaya() langsung — biarkan object yang memutuskan." },
        ],
      },
      reference: "Total 56.800 = 32.500 + 10.000 + 0 + 6.500 + 5.000 + 2.800. QRIS 1 juta terkena batas atas 5.000.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: jenis keempat datang — virtual account",
      prose: [
        "Produk menambah jenis keempat: virtual account (VA). Aturannya: biaya 4.000 ditambah 0,1 persen dari jumlah. Satu transaksi VA 5.000.000 berarti biaya 4.000 ditambah 5.000 = 9.000.",
        "Pertanyaan: apa saja yang harus berubah di kode lab tadi untuk mendukung VA? Jawabannya: satu class baru, TransaksiVA, dengan method biaya versinya. Daftar transaksi tinggal ditambah satu object. Fungsi total_biaya tidak disentuh — ia sudah tahu cara memanggil biaya pada jenis apa pun.",
        "Bandingkan dengan versi rantai if di cerita pembuka: di sana, VA berarti satu cabang if baru di dalam fungsi yang sama, plus pengujian ulang semua cabang lama. Di sini, VA berarti satu class baru yang bisa diuji sendiri, tanpa menyentuh kode yang sudah berjalan. Itulah nilai OOP yang sebenarnya: bukan class-nya, melainkan biaya perubahan yang kecil.",
        "Jebakan terakhir: jangan tergoda membuat TransaksiVA mewarisi TransaksiKartu hanya karena rumusnya mirip (keduanya punya komponen persen). Kemiripan rumus bukan hubungan 'adalah'. VA bukan kartu — warisi dari Transaksi, bukan dari sesama subclass.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "VA 5.000.000: 0,1 persen = 5.000, ditambah 4.000 = 9.000. Total baru bila ditambah ke daftar lab: 56.800 + 9.000 = 65.800. Dan ingat: subclass baru mewarisi dari Transaksi langsung — bukan dari TransaksiKartu, walau rumusnya mirip.",
      },
      reference: "Jenis baru = satu class baru. Kode lama tidak disentuh. Itulah open-closed.",
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
        "Class membungkus data dan perilaku; __init__ menyiapkan atribut saat object dibuat.",
        "Inheritance memakai ulang perilaku induk; override mengganti method dengan versi subclass.",
        "Polymorphism: satu panggilan method yang sama berperilaku berbeda per jenis object — tanpa isinstance.",
        "Jenis baru = satu subclass baru; kode pemakai (total_biaya) tidak disentuh — open-closed.",
        "Lab: total biaya enam transaksi 56.800; QRIS 1 juta terkena batas atas 5.000.",
      ],
      next: { label: "D24 — Web Scraping: requests, BeautifulSoup, dan Etika", href: "/v2/learn/d24-web-scraping" },
      quiz: [
        {
          q: "Kenapa TransaksiKartu tidak perlu menulis __init__ sendiri?",
          options: [
            { text: "Karena Python otomatis membuat __init__ untuk semua class", why: "Salah: Python tidak membuat __init__ yang menyimpan atribut. Yang terjadi di sini adalah pewarisan." },
            { text: "Karena ia mewarisi __init__ dari Transaksi lewat inheritance", why: "Tepat: subclass mewarisi semua method induk yang tidak di-override, termasuk __init__.", correct: true },
            { text: "Karena atribut id dan jumlah disimpan di class, bukan di object", why: "Salah: id dan jumlah disimpan per object lewat self di __init__. Class hanya menyimpan cetak birunya." },
            { text: "Karena TransaksiKartu tidak punya atribut sendiri", why: "Salah: ia punya — id dan jumlah diwarisi, dan itulah yang dipakai rumus biayanya." },
          ],
        },
        {
          q: "Apa yang terjadi saat total_biaya memanggil t.biaya() untuk object TransaksiQRIS?",
          options: [
            { text: "Python memakai method biaya dari Transaksi (base class)", why: "Salah: method subclass yang meng-override selalu menang atas versi induk untuk object subclass itu." },
            { text: "Python memakai method biaya dari TransaksiQRIS — versi subclass menang", why: "Tepat: override berarti versi subclass yang dipakai. Inilah inti polymorphism.", correct: true },
            { text: "Python menjalankan kedua versi lalu menjumlahkannya", why: "Salah: hanya satu versi yang berjalan — versi subclass. Versi induk tidak ikut dihitung." },
            { text: "Python error karena biaya didefinisikan dua kali", why: "Salah: mendefinisikan ulang method di subclass adalah override yang sah, bukan error." },
          ],
        },
        {
          q: "Fungsi total_biaya ditulis dengan isinstance untuk memeriksa jenis tiap transaksi. Apa masalahnya?",
          options: [
            { text: "Tidak ada masalah — isinstance adalah cara standar menulis polymorphism", why: "Salah: isinstance justru membunuh polymorphism. Setiap jenis baru berarti satu cabang baru di fungsi itu." },
            { text: "Kode menjadi rapuh: jenis baru berarti mengedit fungsi lama, dan logika tersebar di dua tempat", why: "Tepat: itulah rantai if dengan baju berbeda. Logika biaya seharusnya tinggal di dalam method tiap subclass.", correct: true },
            { text: "isinstance tidak bisa dipakai pada subclass", why: "Salah: isinstance bekerja pada subclass. Masalahnya bukan kemampuan, melainkan desain." },
            { text: "isinstance membuat program lebih lambat secara signifikan", why: "Salah: biaya performanya tidak berarti. Masalahnya adalah biaya perubahan dan keterbacaan." },
          ],
        },
        {
          q: "TransaksiVA baru harus ditambahkan. Mana yang benar?",
          options: [
            { text: "Buat class TransaksiVA(Transaksi) dengan method biaya sendiri; total_biaya tidak disentuh", why: "Tepat: satu class baru, nol perubahan pada kode pemakai. Inilah open-closed.", correct: true },
            { text: "Tambah satu cabang if di total_biaya untuk jenis VA", why: "Salah: itu kembali ke rantai if di cerita pembuka — setiap jenis baru mengedit fungsi yang sama." },
            { text: "Buat TransaksiVA mewarisi TransaksiKartu karena rumusnya mirip", why: "Salah: kemiripan rumus bukan hubungan 'adalah'. VA bukan kartu — warisi dari Transaksi langsung." },
            { text: "Ubah base class Transaksi agar biayanya menghitung rumus VA", why: "Salah: base class adalah perilaku umum. Menaruh rumus VA di sana merusak semua subclass lain." },
          ],
        },
        {
          q: "Biaya QRIS untuk transaksi 1.000.000 adalah 5.000, bukan 7.000. Kenapa?",
          options: [
            { text: "Karena tarif QRIS adalah 0,5 persen, bukan 0,7 persen", why: "Salah: tarifnya 0,7 persen — 0,7 persen dari 1 juta adalah 7.000. Yang membatasi adalah batas atas." },
            { text: "Karena rumus memakai min(0,7 persen, batas atas 5.000) — 7.000 di atas batas, jadi dipakai 5.000", why: "Tepat: min memilih yang lebih kecil. Batas atas melindungi pembeli dari biaya yang membengkak.", correct: true },
            { text: "Karena QRIS di atas 1 juta digratiskan", why: "Salah: tidak ada aturan gratis untuk QRIS. Yang ada adalah batas atas 5.000." },
            { text: "Karena ada diskon 2.000 untuk transaksi pertama", why: "Salah: tidak ada diskon dalam aturan ini. Selisih 2.000 adalah efek batas atas, bukan diskon." },
          ],
        },
      ],
    },
  ],
};
