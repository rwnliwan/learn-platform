import type { V2Lesson } from "../lib/types";

// Star schema: fact di tengah, dims di sekeliling.
const STAR_SVG = `<svg viewBox="0 0 560 230" role="img" aria-label="Star schema: tabel fact penjualan di tengah dikelilingi dimensi produk, waktu, pelanggan, dan toko.">
<defs><marker id="de6a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="215" y="85" width="130" height="70" rx="10" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2.5"/>
<text x="280" y="110" font-size="13" font-weight="700" fill="var(--text)">fact_penjualan</text>
<text x="280" y="130" font-size="11" fill="var(--text-muted)">qty, harga, diskon</text>
<text x="280" y="146" font-size="11" fill="var(--text-muted)">(angka = facts)</text>
<rect x="30" y="30" width="130" height="56" rx="10" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="95" y="52" font-size="12" font-weight="600" fill="var(--text)">dim_produk</text>
<text x="95" y="70" font-size="11" fill="var(--text-muted)">nama, kategori</text>
<rect x="400" y="30" width="130" height="56" rx="10" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="465" y="52" font-size="12" font-weight="600" fill="var(--text)">dim_waktu</text>
<text x="465" y="70" font-size="11" fill="var(--text-muted)">tanggal, hari, bulan</text>
<rect x="30" y="150" width="130" height="56" rx="10" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="95" y="172" font-size="12" font-weight="600" fill="var(--text)">dim_pelanggan</text>
<text x="95" y="190" font-size="11" fill="var(--text-muted)">nama, tier, kota</text>
<rect x="400" y="150" width="130" height="56" rx="10" fill="var(--c5)" opacity="0.25" stroke="var(--c5)" stroke-width="2"/>
<text x="465" y="172" font-size="12" font-weight="600" fill="var(--text)">dim_toko</text>
<text x="465" y="190" font-size="11" fill="var(--text-muted)">nama, wilayah</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.4" marker-end="url(#de6a)">
<line x1="160" y1="70" x2="212" y2="95"/><line x1="400" y1="70" x2="348" y2="95"/>
<line x1="160" y1="170" x2="212" y2="140"/><line x1="400" y1="170" x2="348" y2="140"/>
</g>
<text x="280" y="200" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">fact = angka yang dijumlah · dimensi = "potong berdasarkan apa"</text>
</svg>`;

export const de6: V2Lesson = {
  slug: "de6-modeling",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE6 — Data Modeling: Dimensional & Data Vault",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tabel 'master_final_v2_FINAL' dan 200 kolom misteri",
      prose: [
        "Di 'BankMaju' ada tabel legendaris: master_final_v2_FINAL. 200 kolom. Dibuat 2019 oleh seseorang yang sudah resign. Setiap tim query langsung ke sana — dan setiap tim punya definisi 'revenue' sendiri-sendiri, karena tidak ada yang tahu kolom revenue_bersih_v3 bedanya apa dengan revenue_netto.",
        "Suatu hari regulator bertanya: 'angka NPL di laporan kalian, definisinya apa?' Tiga tim memberi tiga jawaban. Dendanya bukan cuma uang — tapi kepercayaan.",
        "Twist-nya: masalahnya bukan kurang data, melainkan kurang model. Data modeling adalah seni memberi struktur dan makna sebelum data dipakai — agar 'revenue' hanya punya satu arti di seluruh perusahaan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: modeling = menggambar diagram ER yang bagus",
        type: "pitfall",
        body: "Diagram hanyalah dokumentasi. Modeling yang sebenarnya adalah keputusan: grain apa, fakta apa, dimensi apa, histori bagaimana, siapa boleh ubah definisi. Diagram tanpa keputusan = dekorasi.",
      },
      reference: "Modeling = memberi struktur + makna tunggal sebelum data dipakai.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memodelkan data untuk analitik tanpa jebakan.",
        "(1) Membangun star schema mini (fact + dimensi) dan menjelaskan pilihan grain-nya;",
        "(2) Mendeteksi fan trap dan menghitung faktor penggandaannya; (3) Menjelaskan kapan Data Vault lebih tepat dari star;",
        "(4) Memilih star, vault, atau flat table berdasar pola query dan laju perubahan.",
      ],
      tasks: [],
    },

    {
      id: "dimensional",
      eyebrow: "Langkah 3 · Dimensional",
      title: "Star schema: fakta di tengah, dimensi di sekeliling",
      prose: [
        "Model dimensional (Kimball) membagi dunia jadi dua: fact = angka yang bisa dijumlah (qty, harga, revenue), dimension = 'potong berdasarkan apa' (produk, waktu, pelanggan, toko). Fact di tengah seperti matahari, dimensi mengorbit — itulah star schema.",
        "Kepribadian fact: 'akuntan pendiam' — hanya menyimpan angka dan kunci asing, tidak banyak bicara. Kepribadian dimension: 'pustakawan cerewet' — penuh atribut deskriptif (kategori, tier, kota) yang membuat angka bisa diiris.",
        "Aturan emasnya: satu fact = satu grain (tingkat detail). fact_penjualan ber-grain 'per baris item' tidak boleh dicampur dengan grain 'per order' — mencampur grain adalah resep double counting.",
        "💡 Intuisi: grain adalah kontrak. Begitu grain ditetapkan ('satu baris = satu item terjual'), semua agregasi menjadi sederhana dan benar. 90% bug model dimensional berasal dari grain yang tidak disepakati.",
        "💡 Intuisi: surrogate key (sk_buatan seperti 101, 102) memisahkan identitas bisnis dari identitas teknis. Kode produk bisa berubah (merger, rebrand); surrogate key tidak — histori tetap utuh.",
        "Cara membaca: tabel fact_penjualan di tengah (kotak besar, berisi angka), dikelilingi empat tabel dimensi — produk, waktu, pelanggan, toko — masing-masing terhubung dengan satu garis (foreign key). Bentuknya seperti bintang.",
        "Interpretasi: fact = yang diukur (angka), dimensi = yang menjawab siapa/apa/kapan/di mana. Satu fact, banyak dimensi: query analitik = agregat fact, potong per dimensi. Kesederhanaan ini yang membuat star menang.",
      ],
      figure: {
        svg: STAR_SVG,
        alt: "Star schema dengan fact_penjualan di tengah dan empat dimensi.",
        caption: "Bintang: fact (angka) di tengah, dimensi (konteks) mengorbit.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: semakin banyak kolom di fact semakin lengkap",
        type: "pitfall",
        body: "Fact yang gemuk dengan atribut deskriptif (nama produk, kota) adalah dimensi yang menyamar. Akibatnya: duplikasi teks di jutaan baris, update atribut jadi mimpi buruk. Atribut deskriptif tinggal di dimensi; fact hanya angka + kunci.",
      },
      reference: "Fact = angka + kunci asing. Dimensi = konteks. Satu fact = satu grain.",
    },
    {
      id: "vault",
      eyebrow: "Langkah 4 · Data Vault",
      title: "Data Vault: untuk dunia yang selalu berubah",
      prose: [
        "Star schema hebat untuk analitik, tapi rapuh saat sumber berubah: tambah kolom baru, ganti definisi, merger perusahaan. Data Vault 2.0 dirancang untuk itu — memisahkan tiga hal: Hub (identitas bisnis: 'pelanggan 123 ada'), Link (relasi: 'pelanggan 123 beli di toko 7'), Satellite (atribut yang berubah: tier, alamat, beserta historinya).",
        "Kepribadiannya: 'arsiparis paranoid' — tidak pernah menghapus, tidak pernah menimpa, selalu mencatat kapan sesuatu diketahui. Cocok untuk enterprise dengan puluhan sumber yang berubah tiap kuartal, kebutuhan audit ketat, dan histori yang tidak boleh hilang.",
        "Harganya: lebih banyak tabel, query lebih berlapis, kurva belajar curam. Untuk startup 3 sumber, ini over-engineering — star schema menang telak.",
      ],
      formula: String.raw`\text{biaya\_model} = N_{sumber} \times f_{perubahan} \times c_{refactor}`,
      formulaNote: "biaya_model = ongkos maintenance model; N_sumber = jumlah sumber data; f_perubahan = frekuensi perubahan skema; c_refactor = biaya refactor per perubahan. Makin besar ketiganya, makin masuk akal Data Vault.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membangun Data Vault untuk 2 sumber yang stabil 'biar enterprise-grade'. Hasilnya: 40 tabel untuk kebutuhan yang cukup 6 tabel, tim menghabiskan waktu melawan kompleksitasnya sendiri. Pilih model sesuai laju perubahan, bukan gengsi.",
      },
      reference: "Vault = Hub (siapa) + Link (relasi) + Satellite (atribut berversi). Untuk sumber banyak & labil.",
    },
    {
      id: "lab-star",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: bangun star schema mini",
      prose: [
        "Lab ini membangun star schema sungguhan (versi mini, di Python): dua dimensi, satu fact, lalu agregasi revenue per kategori via join ke dimensi. Inilah query 'total penjualan per kategori' yang di produksi berjalan di warehouse.",
        "Cara membaca: fact hanya menyimpan produk_sk (surrogate key) + angka; nama kategori tinggal di dim_produk. Join-lah yang menyatukan keduanya.",
        "Interpretasi: perhatikan — agregasi dilakukan SETELAH join ke dimensi. Inilah pola semua laporan dimensional.",
      ],
      tasks: [
        { id: "t1", text: "Bangun dict `produk` (sk → baris dimensi)" },
        { id: "t2", text: "Agregasi `rev_per_kategori` via join: qty × harga per kategori" },
        { id: "t3", text: "Cetak `rev_per_kategori` dan `total`" },
      ],
      expected: "rev={'minuman': 525000, 'makanan': 144000} | total=669000",
      note: {
        title: "Sering salah",
        body: "Menjumlahkan harga tanpa dikali qty (atau sebaliknya). Revenue = qty × harga per baris fact, baru diagregasi. Lupa satu faktor = laporan meleset — dan tidak ada error yang memberitahu.",
      },
      hints: [
        "produk = {d['sk']: d for d in dim_produk}.",
        "Loop fact_jual; kat = produk[f['produk_sk']]['kategori'].",
        "Tambahkan f['qty'] * f['harga'] ke akumulator kategori.",
      ],
      code: {
        starter: `# Dimensi dan fact (star schema mini)\ndim_produk = [\n    {"sk": 101, "nama": "Kopi", "kategori": "minuman"},\n    {"sk": 102, "nama": "Teh", "kategori": "minuman"},\n    {"sk": 103, "nama": "Roti", "kategori": "makanan"},\n]\nfact_jual = [\n    {"produk_sk": 101, "waktu_sk": 201, "qty": 10, "harga": 25000},\n    {"produk_sk": 102, "waktu_sk": 201, "qty": 5, "harga": 15000},\n    {"produk_sk": 101, "waktu_sk": 202, "qty": 8, "harga": 25000},\n    {"produk_sk": 103, "waktu_sk": 202, "qty": 12, "harga": 12000},\n]\n\n# TULIS KODEMU: index dimensi\nproduk = \n\n# TULIS KODEMU: revenue per kategori via join\nrev_per_kategori = {}\n\n\nprint(f"rev={rev_per_kategori}")\nprint(f"total={sum(rev_per_kategori.values())}")`,
        lockLines: 12,
        solution: `# Dimensi dan fact (star schema mini)\ndim_produk = [\n    {"sk": 101, "nama": "Kopi", "kategori": "minuman"},\n    {"sk": 102, "nama": "Teh", "kategori": "minuman"},\n    {"sk": 103, "nama": "Roti", "kategori": "makanan"},\n]\nfact_jual = [\n    {"produk_sk": 101, "waktu_sk": 201, "qty": 10, "harga": 25000},\n    {"produk_sk": 102, "waktu_sk": 201, "qty": 5, "harga": 15000},\n    {"produk_sk": 101, "waktu_sk": 202, "qty": 8, "harga": 25000},\n    {"produk_sk": 103, "waktu_sk": 202, "qty": 12, "harga": 12000},\n]\n\n# TULIS KODEMU: index dimensi\nproduk = {d["sk"]: d for d in dim_produk}\n\n# TULIS KODEMU: revenue per kategori via join\nrev_per_kategori = {}\nfor f in fact_jual:\n    kat = produk[f["produk_sk"]]["kategori"]\n    rev_per_kategori[kat] = rev_per_kategori.get(kat, 0) + f["qty"] * f["harga"]\n\nprint(f"rev={rev_per_kategori}")\nprint(f"total={sum(rev_per_kategori.values())}")`,
        checks: [
          { kind: "equal", task: "t2", name: "rev_per_kategori", value: {"minuman": 525000, "makanan": 144000}, label: "`rev_per_kategori` tepat", msg: "minuman: 10×25rb + 5×15rb + 8×25rb = 525rb; makanan: 12×12rb = 144rb." },
          { kind: "stdout_matches", task: "t3", pattern: "total=669000", label: "`print` total=669000", msg: "525000 + 144000 = 669000." },
        ],
      },
      reference: "Join fact→dim via surrogate key, agregasi setelah join.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Grain dulu, tabel kemudian. Satu baris fact yang ambigu ('baris penjualan') menghasilkan 10 interpretasi; satu baris yang tegas ('satu item dalam satu order') menghasilkan 1.",
        "💡 Data Vault mahal di awal, murah saat berubah. Jika sumber datamu berganti skema tiap kuartal, 'mahal' itu sebenarnya diskon untuk masa depan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: grain adalah kontrak — tulis dalam satu kalimat atau jangan bangun",
        body: "Sebelum satu tabel pun dibuat, praktisi senior memaksa satu kalimat: \"satu baris tabel ini artinya ___\". Kalau kalimatnya butuh kata \"kadang\", grain-nya salah. \"Satu baris sama dengan satu item dalam satu order\" itu tegas — semua orang menghitung sama. \"Satu baris sama dengan penjualan\" itu ambigu — sepuluh analis menghasilkan sepuluh angka, dan rapat berubah jadi debat definisi. Itulah pajak grain yang buruk: bukan dibayar saat membangun, melainkan setiap hari selamanya. Aturan keputusannya: pilih grain paling detail yang masih bermakna bisnis, karena agregasi bisa naik tetapi tidak bisa turun — detail yang dibuang di awal tidak bisa direkonstruksi. Untuk pola arsitektur: star schema adalah default yang jujur untuk analitik; Data Vault baru masuk akal bila sumbermu berganti skema tiap kuartal — mahal di awal, murah saat berubah, dan \"mahal\" itu sebenarnya diskon untuk masa depan. Jebakan yang paling mahal: melewatkan conformed dimension — dua mart memakai definisi \"pelanggan aktif\" yang berbeda, dua dashboard menampilkan dua angka, dan kepercayaan bisnis runtuh bukan karena datanya salah, melainkan karena maknanya ganda. Satu fakta, satu grain, satu definisi — itu kontraknya.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: star, vault, atau flat?",
      prose: [
        "Skenario 1 — Dashboard & laporan bisnis, sumber stabil. Kondisi: 3–10 sumber, analis butuh query sederhana. Keputusan: star schema. Alasan: mudah dipahami, query cepat, tool BI suka.",
        "Skenario 2 — Enterprise 50 sumber, skema berubah tiap kuartal, audit ketat. Kondisi: histori tidak boleh hilang. Keputusan: Data Vault (raw) + star (mart). Alasan: vault menampung perubahan, mart menyajikan kesederhanaan.",
        "Skenario 3 — Eksplorasi ad-hoc data scientist. Kondisi: belum tahu pola query-nya. Keputusan: tabel flat/denormalisasi di lake. Alasan: jangan paksa model pada pertanyaan yang belum ada.",
        "Skenario 4 — Satu tabel, satu tim, satu kebutuhan. Kondisi: MVP startup. Keputusan: flat dulu. Alasan: modeling adalah investasi — bayar saat polanya sudah jelas, bukan saat menebak.",
        "Aturan praktis 10 detik: belum tahu pola baca → flat. Pola baca jelas + sumber stabil → star. Sumber banyak & labil + audit → vault.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Satu model untuk semua lapisan. Praktik terbaik: vault (atau mentah) di lapisan integrasi, star di lapisan mart. Memaksa satu model di semua lapisan = mengorbankan fleksibilitas atau kesederhanaan — pilih salah satu selalu salah.",
      },
      reference: "Flat untuk eksplorasi, star untuk serving, vault untuk integrasi yang labil.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: fan trap 2,6x lipat",
      prose: [
        "Analis menggabungkan fact_order (grain: per order) dengan fact_item (grain: per item) lalu SUM(nominal_order). Hasilnya: Rp1.300.000 — padahal total order sebenarnya Rp500.000. Setiap order terhitung sebanyak jumlah itemnya. Inilah fan trap: join dua fact beda grain tanpa jembatan.",
        "Hitung total_salah (join langsung), total_benar (dari fact_order saja), dan pengalinya. Rasio 2,6x ini adalah 'pajak' grain yang tidak disepakati.",
        "Interpretasi: solusinya bukan 'jangan join', melainkan drill across: agregasi tiap fact di grain-nya masing-masing, baru gabungkan hasilnya — atau pakai bridge table.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_salah` via join langsung order × item" },
        { id: "t2", text: "Hitung `total_benar` dan `pengali`, cetak ketiganya" },
      ],
      expected: "total_salah=1300000 | total_benar=500000 | pengali=2.6x",
      hints: [
        "total_salah: untuk tiap order, nominal dijumlah sebanyak item-nya.",
        "Gunakan nested loop dengan filter order_id sama.",
        "pengali = round(total_salah / total_benar, 1).",
      ],
      code: {
        starter: `fact_order = [{"order_id": 1, "nominal": 300000}, {"order_id": 2, "nominal": 200000}]\nfact_item = [\n    {"order_id": 1, "item": "kopi"}, {"order_id": 1, "item": "teh"}, {"order_id": 1, "item": "roti"},\n    {"order_id": 2, "item": "kopi"}, {"order_id": 2, "item": "susu"},\n]\n\n# TULIS KODEMU: join langsung (SALAH, tapi hitung untuk bukti)\ntotal_salah = sum(\n\n# TULIS KODEMU: total benar\ntotal_benar = \npengali = round(total_salah / total_benar, 1)\n\nprint(f"total_salah={total_salah}")\nprint(f"total_benar={total_benar}")\nprint(f"pengali={pengali}x")`,
        lockLines: 5,
        solution: `fact_order = [{"order_id": 1, "nominal": 300000}, {"order_id": 2, "nominal": 200000}]\nfact_item = [\n    {"order_id": 1, "item": "kopi"}, {"order_id": 1, "item": "teh"}, {"order_id": 1, "item": "roti"},\n    {"order_id": 2, "item": "kopi"}, {"order_id": 2, "item": "susu"},\n]\n\n# TULIS KODEMU: join langsung (SALAH, tapi hitung untuk bukti)\ntotal_salah = sum(\n    o["nominal"] for o in fact_order for i in fact_item if i["order_id"] == o["order_id"])\n\n# TULIS KODEMU: total benar\ntotal_benar = sum(o["nominal"] for o in fact_order)\npengali = round(total_salah / total_benar, 1)\n\nprint(f"total_salah={total_salah}")\nprint(f"total_benar={total_benar}")\nprint(f"pengali={pengali}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_salah", value: 1300000, tol: 1, label: "`total_salah` = 1.300.000", msg: "300rb×3 + 200rb×2 = 1,3jt." },
          { kind: "equal", task: "t2", name: "total_benar", value: 500000, tol: 1, label: "`total_benar` = 500.000", msg: "300rb + 200rb = 500rb." },
          { kind: "stdout_matches", task: "t2", pattern: "pengali=2\\.6x", label: "`print` pengali=2.6x", msg: "1,3jt / 500rb = 2,6." },
        ],
      },
      reference: "Jangan join dua fact beda grain lalu agregasi. Drill across: agregasi dulu, gabung kemudian.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang memberi struktur pada data.",
      ],
      tasks: [],
      summary: [
        "Modeling = keputusan struktur + makna tunggal; diagram hanyalah dokumentasi.",
        "Star schema: fact (angka + kunci, satu grain) di tengah, dimensi (konteks) mengorbit.",
        "Grain adalah kontrak; campur grain = double counting (fan trap).",
        "Data Vault = Hub + Link + Satellite untuk sumber banyak, labil, dan butuh audit.",
        "Flat untuk eksplorasi, star untuk serving, vault untuk integrasi labil.",
      ],
      next: { label: "DE7 — Orchestration: DAG & Scheduling", href: "/v2/learn/de7-orchestration" },
      quiz: [
        {
          q: "Apa akar masalah tabel 'master_final_v2_FINAL'?",
          options: [
            { text: "Tabelnya terlalu kecil", why: "200 kolom bukan kecil; masalahnya bukan ukuran." },
            { text: "Tidak ada model: definisi kolom tidak disepakati, tiap tim menafsirkan sendiri", why: "Tepat: tanpa grain, fakta, dan definisi tunggal, 'revenue' punya banyak arti.", correct: true },
            { text: "Database-nya lambat", why: "Kecepatan tidak relevan dengan tiga definisi NPL yang berbeda." },
            { text: "Kurang data", why: "Data berlimpah; yang kurang adalah struktur dan makna." },
          ],
        },
        {
          q: "Mana yang termasuk FACT (bukan dimensi)?",
          options: [
            { text: "Kategori produk", why: "Itu atribut deskriptif — dimensi." },
            { text: "Nama kota pelanggan", why: "Itu konteks — dimensi." },
            { text: "Qty terjual dan harga", why: "Tepat: angka yang bisa dijumlah = fact.", correct: true },
            { text: "Hari dalam seminggu", why: "Itu atribut waktu — dimensi." },
          ],
        },
        {
          q: "Kenapa join dua fact beda grain lalu SUM berbahaya?",
          options: [
            { text: "Query-nya lambat", why: "Bukan soal kecepatan; hasilnya salah." },
            { text: "Terjadi fan trap: baris terduplikasi sebanyak grain terendah, total membengkak", why: "Tepat: 500rb menjadi 1,3jt (2,6x) tanpa error apa pun.", correct: true },
            { text: "Database menolak join-nya", why: "Database tidak menolak; ia menghitung dengan patuh — dan salah." },
            { text: "Kunci asingnya hilang", why: "Kunci ada; masalahnya grain, bukan kunci." },
          ],
        },
        {
          q: "Kapan Data Vault lebih tepat daripada star schema?",
          options: [
            { text: "Startup dengan 2 sumber stabil", why: "Over-engineering; star schema cukup." },
            { text: "Enterprise 50 sumber, skema sering berubah, audit ketat", why: "Tepat: Hub/Link/Satellite dirancang untuk perubahan dan histori penuh.", correct: true },
            { text: "Eksplorasi ad-hoc data scientist", why: "Untuk itu tabel flat lebih cocok." },
            { text: "Dashboard sederhana satu tim", why: "Star schema lebih sederhana dan cepat." },
          ],
        },
        {
          q: "Apa fungsi surrogate key (sk buatan)?",
          options: [
            { text: "Mempercepat query 10x lipat", why: "Bukan fungsi utamanya." },
            { text: "Memisahkan identitas teknis dari kode bisnis agar histori utuh saat kode berubah", why: "Tepat: kode produk bisa rebrand; sk 101 tetap 101.", correct: true },
            { text: "Menggantikan primary key database", why: "Ia justru menjadi primary key teknis; bukan pengganti konsepnya." },
            { text: "Mengenkripsi data sensitif", why: "Tidak ada hubungannya dengan enkripsi." },
          ],
        },
        {
          q: "Fact penjualan di-join ke dim_promo (satu order, dua promo) lalu ke dim_produk. Revenue 2,6x lipat. Perbaikan yang benar?",
          options: [
            { text: "Bagi revenue per jumlah promo (alokasi) SEBELUM agregat akhir", why: "Tepat: fan trap = baris fact berlipat via relasi one-to-many ganda. Solusi: alokasi proporsional, atau agregat promo ke level order dulu baru join. Yang pasti BUKAN join mentah.", correct: true },
            { text: "Hapus dim_promo dari query", why: "Menghapus dimensi = menghapus kebutuhan bisnis. Masalahnya bukan promo-nya, melainkan cara join-nya." },
            { text: "Pakai DISTINCT", why: "DISTINCT menyembunyikan pelipatan tanpa memperbaiki alokasi — angka 'rapi' tetapi salah." },
            { text: "Ganti ke snowflake", why: "Snowflake tidak menyembuhkan fan trap; ia hanya menambah tabel di antara. Masalahnya kardinalitas join." },
          ],
        },
        {
          q: "Sumber master pelanggan berganti format ID tiap kuartal. Model yang paling tahan?",
          options: [
            { text: "Star schema dengan natural key", why: "Natural key yang berganti tiap kuartal = fact harus di-rewrite tiap kuartal. Rapuh." },
            { text: "Data Vault (hub + satelit) dengan hash key", why: "Tepat: Data Vault dirancang untuk dunia yang berubah — sumber baru = satelit baru, hub stabil. Mahal di awal, murah saat berubah. Inilah use case-nya.", correct: true },
            { text: "Flat table lebar", why: "Flat table + skema berganti = migrasi total tiap kuartal. Paling rapuh." },
            { text: "Tidak usah dimodelkan", why: "'Tidak usah' = setiap analis membuat versinya sendiri = 10 kebenaran. Itu bukan solusi." },
          ],
        },
      ],
    },
  ],
};
