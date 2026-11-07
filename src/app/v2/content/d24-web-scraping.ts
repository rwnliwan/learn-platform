import type { V2Lesson } from "../lib/types";

export const d24: V2Lesson = {
  slug: "d24-web-scraping",
  track: "Python",
  module: "Integrasi",
  title: "D24 — Web Scraping: requests, BeautifulSoup, dan Etika",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Harga kompetitor ada di web — tapi tidak ada API-nya",
      prose: [
        "Tim pricing sebuah marketplace ingin memantau harga lima produk kompetitor setiap pagi. Kompetitor itu tidak menyediakan API. Datanya ada — terpampang di halaman web mereka — tapi tidak ada tombol unduh, tidak ada feed, tidak ada endpoint.",
        "Analis junior mengusulkan: buka halamannya satu per satu dan salin harganya ke spreadsheet. Lima produk, lima menit — masih masuk akal. Tapi minggu depan produknya menjadi lima puluh, dan bulan depan lima ratus. Salin-tempel manual berubah dari tugas lima menit menjadi pekerjaan penuh waktu yang membosankan dan rawan salah ketik.",
        "Web scraping adalah jawabannya — dengan syarat. Lesson ini mengajarkan alurnya: minta halaman (request), baca strukturnya (parse), ambil yang diperlukan (extract), dan susun jadi tabel (structure). Dan sama pentingnya: kapan scraping BOLEH dilakukan, kapan harus berhenti, dan kapan API adalah jawaban yang benar. Setelah lesson ini kamu bisa: (1) menjelaskan alur scraping empat langkah; (2) memakai requests dan BeautifulSoup; (3) menulis parser dengan html.parser bawaan Python; (4) menilai apakah sebuah scraping etis dan legal.",
      ],
      tasks: [],
      note: {
        title: "API dulu, scraping belakangan",
        body: "Aturan pertama scraping: periksa apakah ada API resmi sebelum menulis satu baris scraper. API stabil, terdokumentasi, dan legal — scraping rapuh, tidak terdokumentasi, dan abu-abu. Scraping adalah jalan terakhir, bukan jalan pertama.",
      },
      reference: "Scraping = request, parse, extract, structure. API selalu didahulukan.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengambil data dari halaman web yang sederhana — dan tahu batas-batasnya.",
        "(1) Menjelaskan empat langkah scraping dan peran masing-masing;",
        "(2) Memakai requests untuk mengambil halaman dan BeautifulSoup untuk mengekstrak isinya;",
        "(3) Menulis parser tabel dengan html.parser bawaan Python dan menghitung agregat dari hasilnya;",
        "(4) Memeriksa robots.txt, menerapkan rate limiting, dan mengenali data yang tidak boleh di-scrape.",
      ],
      tasks: [],
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 3 · Teori",
      title: "Anatomi scraping: request, parse, extract, structure",
      prose: [
        "Langkah pertama adalah request: programmu meminta halaman ke server, seperti browser meminta halaman saat kamu mengetik alamat. Server menjawab dengan HTML — teks mentah berisi struktur halaman. Library requests melakukan ini dalam dua baris: get untuk meminta, lalu periksa status code. Status 200 berarti halaman didapat; 404 berarti tidak ada; 403 berarti server menolak — dan penolakan itu harus dihormati, bukan diakali.",
        "Langkah kedua adalah parse: mengubah teks HTML menjadi struktur yang bisa ditelusuri. BeautifulSoup membaca HTML dan membangun pohon tag: tabel berisi baris, baris berisi sel, sel berisi teks. Parser tidak peduli tampilannya — ia peduli strukturnya.",
        "Langkah ketiga adalah extract: memilih bagian yang diperlukan. Dari sebuah tabel produk, kamu hanya butuh dua kolom: nama dan harga. Selector yang baik menunjuk ke struktur yang stabil — misal tabel dengan id yang jelas — bukan ke posisi yang kebetulan, seperti baris ketiga dari atas.",
        "Langkah keempat adalah structure: mengubah hasil ekstraksi menjadi tabel yang rapi — nama produk, harga sebagai angka, bukan teks. Di sinilah sebagian besar bug scraping bersembunyi: harga tertulis Rp85.000 sebagai teks, dan harus dibersihkan menjadi angka 85000 sebelum bisa dihitung.",
      ],
      tasks: [],
      note: {
        title: "Kenapa harga selalu jadi teks",
        body: "HTML tidak punya tipe data. Semua yang tampil di halaman adalah teks — termasuk angka. 'Rp85.000' harus dibersihkan dari 'Rp' dan titik pemisah ribuan sebelum diubah jadi integer. Lupa membersihkan berarti '85.000' dibaca sebagai 85 (titik dianggap desimal) atau gagal diubah sama sekali. Selalu verifikasi tipe setelah ekstraksi.",
      },
      reference: "Request ambil halaman, parse bangun struktur, extract pilih bagian, structure rapikan jadi tabel.",
    },
    {
      id: "tools",
      eyebrow: "Langkah 4 · Teori",
      title: "requests dan BeautifulSoup: dua alat utama",
      prose: [
        "Dua library membentuk pasangan standar scraping Python. requests mengurus sisi jaringan: mengirim GET, membawa header seperti User-Agent yang jujur, mengikuti redirect, dan melaporkan status code. BeautifulSoup mengurus sisi parsing: mencari tag berdasarkan nama, class, atau id, lalu mengambil teksnya.",
        "Pola kerja yang benar selalu memisahkan keduanya. Satu fungsi mengambil halaman dan mengembalikan HTML mentah. Fungsi lain menerima HTML dan mengembalikan daftar produk. Bila situs berubah tampilan, yang rusak hanya fungsi kedua — fungsi pertama tetap jalan. Bila server memblokir, yang diperbaiki hanya fungsi pertama — parser tidak disentuh.",
        "Satu detail yang membedakan scraper amatir dan profesional: header User-Agent. Scraper yang baik memperkenalkan diri dengan jujur (nama proyek dan kontak), bukan menyamar sebagai browser. Server yang baik hati membiarkan scraper jujur lewat — dan memblokir yang menyamar.",
        "Di lab lesson ini kamu memakai html.parser bawaan Python, bukan BeautifulSoup — supaya lab bisa jalan di browser tanpa mengunduh package tambahan. Polanya sama: parser membaca tag, mengumpulkan isi sel, dan menyusun baris. Setelah paham polanya, berpindah ke BeautifulSoup tinggal mengganti alat, bukan cara berpikir.",
      ],
      tasks: [],
      note: {
        title: "User-Agent yang jujur",
        body: "Jangan meniru User-Agent browser untuk menyamar. Selain tidak etis, penyamaran membuatmu tidak bisa dibedakan dari bot jahat — dan diblokir bersama mereka. Scraper yang memperkenalkan diri dengan jelas justru lebih sering dibiarkan lewat.",
      },
      reference: "requests = jaringan; BeautifulSoup = parsing. Pisahkan pengambil halaman dari pengekstrak isi.",
    },
    {
      id: "etika",
      eyebrow: "Langkah 5 · Teori",
      title: "Etika dan hukum: robots.txt, jeda, dan batas",
      prose: [
        "Sebelum menulis scraper, buka robots.txt di situs target — file kecil yang menyatakan bagian mana yang boleh dan tidak boleh dikunjungi bot. Bila halaman yang kamu incar dilarang di sana, berhenti. Melanggar robots.txt bukan sekadar tidak sopan: itu sinyal niat buruk yang bisa berujung pemblokiran permanen atau tuntutan.",
        "Kedua, beri jeda antar request. Scraper yang menembak 1.000 halaman tanpa jeda sama dengan serangan denial-of-service kecil. Jeda 2 detik antar halaman berarti 1.000 halaman selesai dalam 2.000 detik — sekitar 33 menit. Lambat, tapi server tetap berdiri dan kamu tidak diblokir. Kecepatan yang membuatmu diblokir di halaman ke-50 adalah kecepatan yang tidak berguna.",
        "Ketiga, periksa syarat layanan situs. Sebagian situs melarang scraping eksplisit di ketentuannya, walau robots.txt mengizinkan. Keempat, jangan pernah mengambil data pribadi: nama, alamat, nomor telepon, dan sejenisnya — sekali pun bisa diakses publik, mengumpulkannya bisa melanggar hukum perlindungan data.",
        "Terakhir, hormati jawaban 403 dan 429. Kode 403 berarti tidak boleh — jangan coba-coba header lain untuk mengelabui. Kode 429 berarti terlalu cepat — perlambat, jangan mempercepat. Server yang menolakmu sedang berbicara; dengarkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Data hasil scraping yang melanggar ketentuan bisa menjadi liabilitas: tidak bisa dipakai sebagai bukti, bisa memicu tuntutan, dan bisa membuat seluruh pipeline diblokir saat paling dibutuhkan. Analis risiko yang baik mencatat sumber dan izin setiap dataset — termasuk yang di-scrape.",
      },
      reference: "robots.txt dulu, jeda antar request, hormati 403 dan 429, jangan sentuh data pribadi.",
    },
    {
      id: "lab-scraping",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: parser tabel harga dengan html.parser",
      prose: [
        "Lab ini memakai html.parser bawaan Python — tanpa unduhan package. Datanya sudah disiapkan sebagai string HTML: satu tabel lima produk dengan kolom nama dan harga. Tugasmu: tulis subclass HTMLParser yang mengumpulkan isi setiap sel td, menyusunnya jadi baris, lalu hitung jumlah produk, total harga, dan rata-rata harga.",
        "Parser bekerja lewat tiga method: handle_starttag dipanggil saat tag pembuka dibaca (di sini, tandai sedang di dalam td); handle_data dipanggil untuk teks di dalam tag (simpan teksnya bila sedang di dalam td); handle_endtag dipanggil saat tag penutup dibaca (tutup penanda td, dan bila baris tr selesai, simpan barisnya).",
        "Lima produknya: Kopi Arabika 250g 85.000, Teh Melati 100g 32.000, Gula Aren 500g 45.000, Susu UHT 1L 21.000, Madu Hutan 300ml 145.000. Total yang diharapkan 328.000 dan rata-rata 65.600. Hitung di kepala dulu: 85.000 tambah 32.000 tambah 45.000 tambah 21.000 tambah 145.000 sama dengan 328.000; dibagi 5 sama dengan 65.600.",
        "Perhatikan harga sudah berupa angka dalam HTML fixture ini. Di situs nyata, harga datang sebagai teks seperti Rp85.000 — membersihkannya adalah pekerjaanmu di langkah structure. Lab ini sengaja memakai angka bersih supaya fokusnya pada parsing, bukan pembersihan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis subclass HTMLParser: tandai saat masuk td, kumpulkan teks, susun baris saat tr ditutup" },
        { id: "t2", text: "Jalankan parser pada string HTML dan ambil kolom harga sebagai integer" },
        { id: "t3", text: "Cetak jumlah produk, total harga, dan rata-rata harga" },
      ],
      expected: "5\n328000\n65600.0",
      hints: [
        "handle_starttag: bila tag == 'td', set self.dalam = True.",
        "handle_data: bila self.dalam, tambahkan data.strip() ke baris berjalan.",
        "handle_endtag: bila tag == 'td', set self.dalam = False; bila tag == 'tr' dan baris tidak kosong, simpan barisnya.",
        "Harga ada di kolom kedua tiap baris: int(baris[1]). Rata-rata = total dibagi jumlah.",
      ],
      code: {
        starter: `from html.parser import HTMLParser\n\nHTML = \"\"\"<table>\n<tr><th>Produk</th><th>Harga</th></tr>\n<tr><td>Kopi Arabika 250g</td><td>85000</td></tr>\n<tr><td>Teh Melati 100g</td><td>32000</td></tr>\n<tr><td>Gula Aren 500g</td><td>45000</td></tr>\n<tr><td>Susu UHT 1L</td><td>21000</td></tr>\n<tr><td>Madu Hutan 300ml</td><td>145000</td></tr>\n</table>\"\"\"\n\n# TULIS KODEMU: subclass HTMLParser di bawah ini.\n# - handle_starttag: tandai saat masuk <td>\n# - handle_data: kumpulkan teks bila sedang di dalam <td>\n# - handle_endtag: tutup penanda </td>; bila </tr> dan baris tidak kosong, simpan barisnya\n\n\np = TabelParser()\np.feed(HTML)\n# TULIS KODEMU: ambil kolom harga, hitung jumlah, total, rata-rata, lalu cetak ketiganya.`,
        lockLines: 11,
        solution: `from html.parser import HTMLParser\n\nHTML = \"\"\"<table>\n<tr><th>Produk</th><th>Harga</th></tr>\n<tr><td>Kopi Arabika 250g</td><td>85000</td></tr>\n<tr><td>Teh Melati 100g</td><td>32000</td></tr>\n<tr><td>Gula Aren 500g</td><td>45000</td></tr>\n<tr><td>Susu UHT 1L</td><td>21000</td></tr>\n<tr><td>Madu Hutan 300ml</td><td>145000</td></tr>\n</table>\"\"\"\n\n\nclass TabelParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.dalam = False\n        self.sel = []\n        self.baris = []\n\n    def handle_starttag(self, tag, attrs):\n        if tag == \"td\":\n            self.dalam = True\n\n    def handle_endtag(self, tag):\n        if tag == \"td\":\n            self.dalam = False\n        if tag == \"tr\" and self.sel:\n            self.baris.append(self.sel)\n            self.sel = []\n\n    def handle_data(self, data):\n        if self.dalam:\n            self.sel.append(data.strip())\n\n\np = TabelParser()\np.feed(HTML)\nharga = [int(b[1]) for b in p.baris]\nprint(len(harga))\nprint(sum(harga))\nprint(sum(harga) / len(harga))`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "328000", label: "Total harga 328.000", msg: "Total lima harga: 85.000 + 32.000 + 45.000 + 21.000 + 145.000 = 328.000. Periksa pengambilan kolom kedua tiap baris." },
          { kind: "stdout_matches", task: "t3", pattern: "65600", label: "Rata-rata harga 65.600", msg: "Rata-rata = 328.000 dibagi 5 = 65.600. Periksa pembaginya (jumlah produk, bukan jumlah baris header)." },
          { kind: "uses", task: "t1", token: "HTMLParser", label: "Subclass HTMLParser ditulis", msg: "Tulis class TabelParser(HTMLParser) dengan tiga method handler." },
          { kind: "uses", task: "t1", token: "baris", label: "Baris hasil parse dipakai", msg: "Ambil kolom harga dari p.baris — tanpa baris yang tersimpan, tidak ada yang bisa dihitung." },
        ],
      },
      reference: "5 produk, total 328.000, rata-rata 65.600. Parser: tandai td, kumpulkan teks, susun baris saat tr ditutup.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: situs berubah, scraper diam-diam salah",
      prose: [
        "Scraper harga di lab berjalan dua minggu tanpa masalah. Lalu suatu pagi, total harga harian turun 40 persen tanpa ada penurunan harga sungguhan. Penyelidikan menemukan: situs mengubah struktur tabel — kolom harga pindah dari kolom kedua ke kolom ketiga, dan kolom baru 'Diskon' masuk di tengah. Scraper yang mengambil kolom kedua kini membaca kolom diskon sebagai harga.",
        "Tidak ada error. Tidak ada exception. Scraper berjalan 'sukses' dan menghasilkan angka yang salah. Inilah kegagalan scraping yang paling berbahaya: kegagalan diam-diam. Solusinya bukan selector yang lebih pintar, melainkan validasi: setelah scraping, periksa jumlah baris, rentang harga, dan total terhadap hari sebelumnya. Bila total berubah lebih dari ambang — misal 10 persen dalam sehari — tahan hasilnya dan beri peringatan, jangan teruskan ke laporan.",
        "Dua pelajaran: pertama, pilih selector berdasarkan struktur yang stabil (nama kolom di header, bukan posisi kolom). Kedua, jangan pernah percaya hasil scraping tanpa validasi — angka yang salah dan tidak terdeteksi lebih buruk daripada scraper yang gagal berisik.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Validasi minimal tiga lapis: (1) jumlah baris sesuai harapan (5 produk, bukan 4 atau 6); (2) harga dalam rentang wajar (di atas 0, di bawah batas yang masuk akal); (3) perubahan total harian di bawah ambang (misal 10 persen). Bila satu lapis gagal, tahan hasil dan beri peringatan. Scraper yang gagal berisik bisa diperbaiki; scraper yang salah diam-diam meracuni keputusan.",
      },
      reference: "Kegagalan diam-diam adalah musuh scraping. Validasi jumlah, rentang, dan perubahan harian.",
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
        "Scraping = request, parse, extract, structure. API selalu didahulukan.",
        "requests mengambil halaman; BeautifulSoup (atau html.parser) mengekstrak isinya.",
        "Periksa robots.txt, beri jeda antar request, hormati 403 dan 429, jangan sentuh data pribadi.",
        "Harga dari HTML selalu teks — bersihkan sebelum dihitung.",
        "Lab: 5 produk, total 328.000, rata-rata 65.600.",
        "Validasi hasil scraping: jumlah baris, rentang harga, perubahan harian — jangan percaya tanpa cek.",
      ],
      next: { label: "A1.10 Capstone Track 10: Pipeline Kredit dari SQL ke Python", href: "/v2/learn/a110-capstone-track-10" },
      quiz: [
        {
          q: "Sebelum menulis scraper untuk sebuah situs, langkah pertama yang benar adalah?",
          options: [
            { text: "Langsung menulis requests.get dan melihat HTML-nya", why: "Salah: itu melompati pemeriksaan paling penting — apakah ada API dan apakah scraping diizinkan." },
            { text: "Memeriksa apakah ada API resmi, lalu membaca robots.txt dan syarat layanan situs", why: "Tepat: API didahulukan; robots.txt dan syarat layanan menentukan apakah scraping boleh dilakukan.", correct: true },
            { text: "Meniru User-Agent browser agar tidak terdeteksi", why: "Salah: penyamaran bukan langkah pertama — dan bukan praktik yang baik sama sekali." },
            { text: "Mengunduh seluruh situs sekaligus secepat mungkin", why: "Salah: itu membebani server dan hampir pasti berujung pemblokiran." },
          ],
        },
        {
          q: "Scraper menembak 1.000 halaman tanpa jeda dan diblokir di halaman ke-50. Berapa lama seharusnya 1.000 halaman itu diambil dengan jeda 2 detik?",
          options: [
            { text: "Sekitar 33 menit — 1.000 kali 2 detik = 2.000 detik", why: "Tepat: lambat tapi selesai. Kecepatan yang membuatmu diblokir di halaman ke-50 tidak ada gunanya.", correct: true },
            { text: "Sekitar 2 menit — jeda tidak menambah waktu total", why: "Salah: jeda 2 detik kali 1.000 halaman adalah 2.000 detik, bukan 120 detik." },
            { text: "Sekitar 17 jam — jeda 2 detik terlalu lama", why: "Salah: 2.000 detik adalah 33 menit, bukan 17 jam." },
            { text: "Tidak bisa dihitung tanpa tahu ukuran halamannya", why: "Salah: waktu jeda mendominasi perhitungan ini; ukuran halaman tidak mengubah orde waktunya." },
          ],
        },
        {
          q: "Harga di halaman tertulis 'Rp85.000'. Apa yang harus dilakukan sebelum menghitung rata-rata?",
          options: [
            { text: "Langsung ubah ke float — titik dianggap pemisah desimal oleh Python", why: "Salah: '85.000' sebagai float dibaca 85,0 — seribu kali lebih kecil. Titik di sini pemisah ribuan." },
            { text: "Buang 'Rp' dan titik pemisah ribuan, lalu ubah jadi integer 85000", why: "Tepat: HTML hanya punya teks. Bersihkan dulu, baru hitung.", correct: true },
            { text: "Biarkan sebagai teks — Python bisa menjumlahkan teks angka", why: "Salah: menjumlahkan teks menggabungkan string ('85' + '32' = '8532'), bukan menjumlahkan angka." },
            { text: "Ganti titik dengan koma, lalu ubah ke float", why: "Salah: mengganti titik dengan koma tidak menyelesaikan apa pun — '85,000' tetap bukan angka yang valid di Python." },
          ],
        },
        {
          q: "Situs memindahkan kolom harga dari kolom kedua ke kolom ketiga. Scraper yang mengambil kolom kedua akan?",
          options: [
            { text: "Error dan berhenti — mudah ketahuan", why: "Salah: itulah bahayanya — scraper tidak error. Ia membaca kolom lain sebagai harga dan menghasilkan angka salah diam-diam." },
            { text: "Berjalan 'sukses' dengan angka yang salah — kegagalan diam-diam", why: "Tepat: tidak ada exception, tidak ada peringatan. Hanya validasi (jumlah, rentang, perubahan harian) yang bisa menangkapnya.", correct: true },
            { text: "Otomatis mengikuti kolom harga yang baru", why: "Salah: scraper tidak tahu kolom mana yang benar — ia hanya mengikuti instruksi posisi yang kamu tulis." },
            { text: "Mengembalikan daftar kosong", why: "Salah: kolom kedua masih ada dan berisi data — hanya bukan harga lagi." },
          ],
        },
        {
          q: "Server menjawab 429 pada request-mu. Tindakan yang benar adalah?",
          options: [
            { text: "Mengirim ulang secepat mungkin sampai berhasil", why: "Salah: 429 berarti terlalu cepat. Mengirim ulang lebih cepat justru memperpanjang pemblokiran." },
            { text: "Berhenti sejenak, perlambat ritme, lalu lanjutkan dengan jeda lebih panjang", why: "Tepat: 429 adalah server yang meminta jeda. Hormati, perlambat, lanjutkan.", correct: true },
            { text: "Mengganti User-Agent dan mencoba lagi segera", why: "Salah: mengganti identitas untuk mengelabui pembatasan adalah penyamaran — tidak etis dan bisa berujung blokir permanen." },
            { text: "Mengabaikan kode itu karena data sudah sebagian didapat", why: "Salah: mengabaikan 429 berarti mengabaikan sinyal server. Dataset setengah jalan yang tidak lengkap juga tidak berguna." },
          ],
        },
      ],
    },
  ],
};
