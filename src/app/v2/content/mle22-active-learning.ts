import type { V2Lesson } from "../lib/types";

// Label terbuang di gugus mudah dari Lab 1 (seed 22): random 59 vs uncertainty 10 (dari 100 label).
const FIG_WASTE = `<svg viewBox="0 0 480 270" role="img" aria-label="Label terbuang: random 59, uncertainty sampling 10.">
<text x="16" y="22" font-size="13" fill="var(--chart-text)" font-weight="600" font-family="var(--font-ui)">Label terbuang di gugus mudah (dari 100 label)</text>
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="210" x2="460" y2="210"/><line x1="60" y1="160" x2="460" y2="160"/><line x1="60" y1="110" x2="460" y2="110"/><line x1="60" y1="60" x2="460" y2="60"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="214">0</text><text x="54" y="164">20</text><text x="54" y="114">40</text><text x="54" y="64">60</text></g>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="130" y="62" width="80" height="148" fill="var(--c2)" opacity="0.9"/>
<text x="170" y="230" fill="var(--chart-text)" font-size="12">random</text>
<text x="170" y="54" fill="var(--text)" font-size="12" font-weight="600">59</text>
<text x="170" y="248" fill="var(--text-muted)" font-size="10">Rp295 rb terbuang</text>
<rect x="280" y="185" width="80" height="25" fill="var(--c1)" opacity="0.9"/>
<text x="320" y="230" fill="var(--chart-text)" font-size="12">uncertainty</text>
<text x="320" y="177" fill="var(--text)" font-size="12" font-weight="600">10</text>
<text x="320" y="248" fill="var(--text-muted)" font-size="10">Rp50 rb terbuang</text>
</g>
<text x="240" y="264" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">akurasi akhir nyaris sama (0,993 vs 0,998) — yang beda adalah uangnya</text>
</svg>`;

// Alur Snorkel: LF -> label model (tanpa ground truth) -> probabilistic labels -> model diskriminatif.
const FIG_SNORKEL = `<svg viewBox="0 0 480 300" role="img" aria-label="Alur Snorkel: labeling function, label model, probabilistic label, model diskriminatif.">
<text x="16" y="22" font-size="13" fill="var(--chart-text)" font-weight="600" font-family="var(--font-ui)">Snorkel: tulis aturan sekali, label jutaan data</text>
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="20" y="60" width="130" height="46" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="85" y="80" fill="var(--text)">LF pola</text><text x="85" y="97" fill="var(--chart-text)" font-size="10">“kanan = positif”</text>
<rect x="20" y="118" width="130" height="46" rx="8" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="85" y="138" fill="var(--text)">LF heuristik</text><text x="85" y="155" fill="var(--chart-text)" font-size="10">“jauh kiri = negatif”</text>
<rect x="20" y="176" width="130" height="46" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/><text x="85" y="196" fill="var(--text)">LF knowledge</text><text x="85" y="213" fill="var(--chart-text)" font-size="10">distant supervision</text>
<rect x="195" y="100" width="120" height="90" rx="8" fill="none" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4"/><text x="255" y="130" fill="var(--text)">label model</text><text x="255" y="150" fill="var(--chart-text)" font-size="10">timbang akurasi LF</text><text x="255" y="166" fill="var(--chart-text)" font-size="10">tanpa ground truth</text>
<rect x="355" y="100" width="105" height="90" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="407" y="130" fill="var(--text)">probabilistic</text><text x="407" y="148" fill="var(--text)">labels</text><text x="407" y="168" fill="var(--chart-text)" font-size="10">2 juta baris</text>
<g stroke="var(--chart-text)" stroke-width="2"><line x1="150" y1="110" x2="195" y2="135" marker-end="url(#ah3)"/><line x1="150" y1="145" x2="195" y2="145" marker-end="url(#ah3)"/><line x1="150" y1="185" x2="195" y2="158" marker-end="url(#ah3)"/><line x1="315" y1="145" x2="355" y2="145" marker-end="url(#ah3)"/></g>
<defs><marker id="ah3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/></marker></defs>
<rect x="195" y="225" width="265" height="44" rx="8" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="327" y="244" fill="var(--text)">model diskriminatif (deep net / GBM)</text><text x="327" y="260" fill="var(--chart-text)" font-size="10">generalisasi melampaui LF</text>
<line x1="407" y1="190" x2="407" y2="225" stroke="var(--chart-text)" stroke-width="2" marker-end="url(#ah3)"/>
</g>
<text x="240" y="292" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">LF boleh berisik &amp; berkonflik — label model yang mendamaikannya</text>
</svg>`;

export const mle22: V2Lesson = {
  slug: "mle22-active-learning",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE22 — Active Learning & Strategi Pelabelan Data",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-bayarku",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp750 juta untuk label yang tidak mengajari apa-apa",
      prose: [
        "Startup pembayaran “BayarKu” memproses 2 juta transaksi per hari — semuanya tak berlabel, dengan tingkat fraud 0,8%. Tim data memutuskan melabel 50.000 transaksi secara acak. Tiap label dikerjakan analis fraud senior: 10 menit per label, Rp15.000 per label. Total tagihan: Rp750 juta. Tiga bulan kemudian modelnya dilatih, dan F1-nya… nyaris tidak bergerak. Audit label membuka luka: 49.600 dari 50.000 label adalah transaksi normal yang mudah — yang model sudah benar sejak awal. Hanya segelintir label fraud yang benar-benar mengajari model sesuatu.",
        "Solusinya bukan “label lebih banyak”, melainkan “label yang lebih worth it”. Putaran kedua: model memilih sendiri 5.000 transaksi yang PALING membingungkan baginya, analis hanya melabel itu. Tagihan Rp75 juta — sepersepuluh — dan F1 naik 11 poin. Teknik ini bernama active learning: alih-alih menelan data acak, model menunjuk data yang paling informatif untuk dilabel berikutnya. Survei literatur Burr Settles (2009) memetakannya sebagai strategi query: uncertainty sampling, query-by-committee, expected model change.",
        "Twist-nya: label termahal bukan label yang sulit, melainkan label yang tidak informatif. Dan ada jalan pintas yang lebih radikal: jangan beli label sama sekali untuk pola yang sudah kamu pahami — tulis sebagai aturan program (labeling function ala Snorkel), label 2 juta baris semalam dengan biaya Rp0. Subtitle lesson ini: Label Mahal — Memilih Data yang Paling Worth It.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan loop active learning dan kapan ia menghemat label; (2) menghitung ketidakpastian dengan entropi dan memilih sampel least-confident; (3) membandingkan uncertainty sampling vs random dalam simulasi berbiaya; (4) menjelaskan query-by-committee, expected model change, dan jebakan outlier (density weighting); (5) merancang labeling function gaya Snorkel dan menghitung trade-off biaya label.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Loop active learning — Langkah 3 · Lab uncertainty — Langkah 4 · Strategi lanjutan + Snorkel — Langkah 5 · Lab labeling function — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Label termahal = label yang tidak informatif. AL memilih; Snorkel memprogram.",
    },
    {
      id: "konsep-al",
      eyebrow: "Langkah 2 · Loop active learning",
      title: "Active learning: bayar hanya untuk yang membingungkan",
      prose: [
        "Prasyarat ringkas — supervised learning (mle15): model belajar dari contoh berlabel (fitur → label benar); makin banyak dan bagus labelnya, makin baik modelnya — tetapi tiap label berharga waktu dan uang manusia. Active learning tidak mengubah rumus ini; ia hanya menjawab pertanyaan yang lebih tajam: dari 2 juta data tak berlabel, label mana yang paling worth it dibeli duluan?",
        "Loop-nya sederhana dan diulang sampai budget habis: (1) latih model di sedikit data berlabel awal; (2) minta model menilai seluruh pool tak berlabel dan MEMERINGKAT mana yang paling informatif; (3) kirim peringkat teratas ke oracle (manusia) untuk dilabel; (4) latih ulang dengan label baru; ulangi. Inilah pool-based active learning — skenario paling umum di industri, dirumuskan dalam survei Settles (2009).",
        "Strategi paling populer: uncertainty sampling — labeli data yang paling membingungkan model. Tiga varian klasiknya: least-confident (pilih yang probabilitas kelas terbaiknya TERKECIL), margin sampling (pilih yang selisih dua probabilitas teratasnya TERKECIL — paling dekat dengan decision boundary), dan entropy (pilih yang distribusi prediksinya paling “menyebar”). Untuk model probabilistik ketiganya murah dihitung — satu forward pass per kandidat.",
        "Kapan ia menang besar: label mahal (medis, hukum, fraud — butuh ahli), kelas minoritas langka (model acak jarang “melihat” fraud), dan redundansi tinggi (sejuta transaksi normal yang mirip). Kapan ia tidak berguna: label murah (crowdsourcing Rp500/label — label saja semuanya) atau data sudah kecil. Aturan praktis: selalu pasang baseline random sampling — active learning yang tidak mengalahkan random adalah bug, atau datamu terlalu mudah.",
      ],
      formula: String.raw`H(p) = -\sum_{i=1}^{C} p_i \log_2 p_i`,
      formulaNote: "H(p) = entropi prediksi (ketidakpastian); p_i = probabilitas model untuk kelas i; C = jumlah kelas. Contoh konkret: p = [0,5, 0,5] → H = 1,0 bit (maksimal — model 50/50, paling worth it dilabel); p = [0,9, 0,1] → H ≈ 0,469 bit (cukup yakin, lewati). Interpretasi: angka ini = 'seberapa bingung model pada data ini' — semakin tinggi, semakin mahal nilai labelnya.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "“Active learning = model belajar sendiri tanpa label.” Salah total — label tetap dibeli dari manusia (oracle); yang dihemat adalah JUMLAHNYA. AL adalah strategi belanja, bukan mesin label gratis. Kalau ada yang bilang “tanpa label sama sekali”, itu wilayah weak supervision (Snorkel) — dibahas di Langkah 4.",
      },
      reference: "Loop: latih → peringkat ketidakpastian → label top-k → ulangi. Baseline random wajib.",
    },
    {
      id: "lab-uncertainty",
      eyebrow: "Langkah 3 · Lab uncertainty",
      title: "Lab: uncertainty sampling vs random — siapa yang boros?",
      prose: [
        "Simulasi dunia BayarKu dalam 2D: 1.900 transaksi normal (termasuk satu gugus JAUH yang sangat mudah — label di sana murni terbuang) dan 100 fraud di dekat boundary. Anggaran: 20 label awal + 80 label tambahan dalam 8 putaran. Kamu menulis dua fungsi pilih: least-confident (10 titik paling tidak yakin) dan acak. Ukur dua hal: akurasi akhir dan — yang lebih penting — berapa label yang terbuang di gugus mudah.",
        "Eksplorasi wajib: (1) perhatikan akurasinya nyaris sama (0,993 vs 0,998) — kemenangan AL bukan di akurasi, melainkan di DOMPET; (2) ubah biaya label Rp5.000 → Rp50.000 — berapa rupiah yang dihemat uncertainty per 100 label? (3) pindahkan gugus mudah dari x=-7 ke x=-3 — saat gugus “mudah” makin dekat boundary, keunggulan uncertainty menyusut: ia hanya menang jika ada label yang jelas-jelas terbuang.",
        "Cara membaca chart: dua bar = jumlah label terbuang di gugus mudah dari 100 label; angka rupiah = label terbuang × Rp5.000. Interpretasi: random membuang 59 label (Rp295 ribu) untuk hal yang model sudah tahu; uncertainty hanya 10 (Rp50 ribu). Selisih Rp245 ribu per 100 label — kalikan ke 50.000 label BayarKu dan kamu dapat alasan Rp750 juta di cerita pembuka.",
      ],
      figure: {
        svg: FIG_WASTE,
        alt: "Label terbuang di gugus mudah: random 59, uncertainty sampling 10.",
        caption: "Kemenangan active learning ada di dompet, bukan cuma di akurasi.",
      },
      tasks: [
        { id: "t1", text: "Tulis `pilih_unc(pool, p, rp)` = 10 indeks least-confident; `r_unc = loop_aktif(pilih_unc)`" },
        { id: "t2", text: "Tulis `pilih_rnd(pool, p, rp)` = 10 indeks acak; `r_rnd = loop_aktif(pilih_rnd)`; UJI mencetak keduanya" },
      ],
      expected: "uncertainty -> akhir=0.998, label_terbuang=10 · random      -> akhir=0.993, label_terbuang=59",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "Uncertainty sampling = “belanja seperlunya”. Model acak seperti pembeli yang mengambil barang tanpa melihat daftar belanja — 59% keranjangnya barang yang sudah ada di rumah. Model uncertainty membawa daftar: hanya mengambil yang belum dimiliki (titik di dekat boundary). Daftarnya = peringkat ketidakpastian.",
      },
      hints: [
        "least-confident: pool[np.argsort(-(1 - np.maximum(p, 1 - p)))[:10]]",
        "acak: rp.choice(pool, 10, replace=False)",
        "loop_aktif sudah disediakan: 8 putaran × 10 label, mengembalikan (akurasi_akhir, label_terbuang)",
      ],
      code: {
        starter: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(22)
X0a = rng.normal(0, 1, (500, 2)) + [-2, 0]   # gugus dekat boundary
X0b = rng.normal(0, 1, (1400, 2)) + [-7, 0]  # gugus JAUH yang mudah -> label di sini terbuang
X1 = rng.normal(0, 1, (100, 2)) + [2, 0]     # kelas minoritas
X = np.vstack([X0a, X0b, X1])
y = np.r_[np.zeros(1900), np.ones(100)].astype(int)
idx = rng.permutation(2000)
Xtr, ytr = X[idx[:1600]], y[idx[:1600]]
Xte, yte = X[idx[1600:]], y[idx[1600:]]
i0 = rng.choice(1600, 20, replace=False)
pool0 = np.setdiff1d(np.arange(1600), i0)

def fit_logreg(X_, y_, iters=400, lr=0.5):
    w = np.random.default_rng(0).normal(0, 0.01, X_.shape[1] + 1)
    Xb = np.c_[np.ones(len(X_)), X_]
    for _ in range(iters):
        p = 1 / (1 + np.exp(-Xb @ w))
        w -= lr * (Xb.T @ (p - y_)) / len(X_)
    return w

def akurasi(w, X_, y_):
    Xb = np.c_[np.ones(len(X_)), X_]
    return float((((Xb @ w) > 0).astype(int) == y_).mean())

def loop_aktif(pilih, seed_pilih=7):
    lab = i0.copy(); pool = pool0.copy()
    rp = np.random.default_rng(seed_pilih)
    for _ in range(8):
        w = fit_logreg(Xtr[lab], ytr[lab])
        Xb = np.c_[np.ones(len(pool)), Xtr[pool]]
        p = 1 / (1 + np.exp(-Xb @ w))
        sel = pilih(pool, p, rp)
        lab = np.r_[lab, sel]; pool = np.setdiff1d(pool, sel)
    w = fit_logreg(Xtr[lab], ytr[lab])
    terbuang = int((Xtr[lab][:, 0] < -4).sum())
    return round(akurasi(w, Xte, yte), 3), terbuang

# TULIS KODEMU
# TODO t1: pilih_unc(pool, p, rp) = 10 indeks least-confident; r_unc = loop_aktif(pilih_unc)
# TODO t2: pilih_rnd(pool, p, rp) = 10 indeks acak; r_rnd = loop_aktif(pilih_rnd)

# UJI (jangan ubah)
print("uncertainty -> akhir=%.3f, label_terbuang=%d" % r_unc)
print("random      -> akhir=%.3f, label_terbuang=%d" % r_rnd)`,
        lockLines: 39,
        solution: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(22)
X0a = rng.normal(0, 1, (500, 2)) + [-2, 0]   # gugus dekat boundary
X0b = rng.normal(0, 1, (1400, 2)) + [-7, 0]  # gugus JAUH yang mudah -> label di sini terbuang
X1 = rng.normal(0, 1, (100, 2)) + [2, 0]     # kelas minoritas
X = np.vstack([X0a, X0b, X1])
y = np.r_[np.zeros(1900), np.ones(100)].astype(int)
idx = rng.permutation(2000)
Xtr, ytr = X[idx[:1600]], y[idx[:1600]]
Xte, yte = X[idx[1600:]], y[idx[1600:]]
i0 = rng.choice(1600, 20, replace=False)
pool0 = np.setdiff1d(np.arange(1600), i0)

def fit_logreg(X_, y_, iters=400, lr=0.5):
    w = np.random.default_rng(0).normal(0, 0.01, X_.shape[1] + 1)
    Xb = np.c_[np.ones(len(X_)), X_]
    for _ in range(iters):
        p = 1 / (1 + np.exp(-Xb @ w))
        w -= lr * (Xb.T @ (p - y_)) / len(X_)
    return w

def akurasi(w, X_, y_):
    Xb = np.c_[np.ones(len(X_)), X_]
    return float((((Xb @ w) > 0).astype(int) == y_).mean())

def loop_aktif(pilih, seed_pilih=7):
    lab = i0.copy(); pool = pool0.copy()
    rp = np.random.default_rng(seed_pilih)
    for _ in range(8):
        w = fit_logreg(Xtr[lab], ytr[lab])
        Xb = np.c_[np.ones(len(pool)), Xtr[pool]]
        p = 1 / (1 + np.exp(-Xb @ w))
        sel = pilih(pool, p, rp)
        lab = np.r_[lab, sel]; pool = np.setdiff1d(pool, sel)
    w = fit_logreg(Xtr[lab], ytr[lab])
    terbuang = int((Xtr[lab][:, 0] < -4).sum())
    return round(akurasi(w, Xte, yte), 3), terbuang

# TULIS KODEMU
def pilih_unc(pool, p, rp):
    return pool[np.argsort(-(1 - np.maximum(p, 1 - p)))[:10]]

def pilih_rnd(pool, p, rp):
    return rp.choice(pool, 10, replace=False)

r_unc = loop_aktif(pilih_unc)
r_rnd = loop_aktif(pilih_rnd)

# UJI (jangan ubah)
print("uncertainty -> akhir=%.3f, label_terbuang=%d" % r_unc)
print("random      -> akhir=%.3f, label_terbuang=%d" % r_rnd)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "uncertainty\\s*->\\s*akhir=0\\.998,\\s*label_terbuang=10", label: "Uncertainty: akurasi 0.998, terbuang 10", msg: "Least-confident memilih titik dekat boundary." },
          { kind: "stdout_matches", task: "t2", pattern: "random\\s*->\\s*akhir=0\\.993,\\s*label_terbuang=59", label: "Random: akurasi 0.993, terbuang 59", msg: "Baseline acak membuang 59 label di gugus mudah." },
        ],
      },
      reference: "Uncertainty vs random: akurasi setara, dompet tidak.",
    },
    {
      id: "konsep-strategi",
      eyebrow: "Langkah 4 · Strategi lanjutan",
      title: "Di balik uncertainty: komite, perubahan model, dan Snorkel",
      prose: [
        "Uncertainty sampling punya satu kelemahan bawaan: ia buta distribusi data. Titik yang paling membingungkan model bisa jadi outlier atau noise — label mahal untuk data yang tidak mewakili apa pun. Survei Settles merumuskan tiga jawaban. Pertama, query-by-committee (QBC): latih KOMITE beberapa model (mis. di bootstrap berbeda dari data berlabel), lalu labeli titik yang paling DIPERDEBATKAN komite — diukur dengan vote entropy. Titik yang semua model sepakat = tidak informatif, betapapun “sulit”-nya menurut satu model.",
        "Kedua, expected model change: pilih titik yang DIPERKIRAKAN paling mengubah model jika dilabel (diukur dari panjang gradien) — strategi yang paling “berprinsip” karena langsung menarget perbaikan model, tetapi mahal dihitung. Ketiga, density-weighted / diversity sampling: kalikan skor ketidakpastian dengan kepadatan lokal — titik tidak yakin di daerah padat (mewakili banyak data) menang atas titik tidak yakin yang menyendiri (kemungkinan outlier). Untuk pelabelan batch besar, diversity juga mencegah 100 label kembar yang isinya sama.",
        "Lalu ada jalan pintas radikal: weak supervision ala Snorkel (Ratner dkk., Stanford; paper VLDB 2017, jurnal 2020). Alih-alih melabel data, pakar menulis labeling function (LF) — aturan program berisik seperti “transaksi > Rp50 juta dari IP baru = curiga”, distant supervision dari knowledge base, atau pola regex. LF boleh tidak akurat, boleh berkonflik, boleh abstain. Snorkel lalu mempelajari label model yang menimbang akurasi tiap LF dari pola SETUJU/TIDAK SETUJU antar-LF — TANPA ground truth — dan menghasilkan probabilistic labels untuk jutaan baris. Model diskriminatif akhir dilatih di label probabilistik ini dan biasanya menggeneralisasi MELAMPAUI aturan-aturan asalnya.",
        "Angka dari paper Snorkel (studi pengguna, ekstraksi relasi teks): pakar domain membangun model 2,8x lebih cepat dan performa naik rata-rata 45,5% dibanding 7 jam hand-labeling — dan hasilnya dalam 3,6% dari performa training set besar berlabel manual. Posisinya dalam strategi: Snorkel BUKAN pengganti active learning — ia menangani pola yang bisa ditulis sebagai aturan (malam ini juga jalan, Rp0/label); active learning menangani sisanya yang benar-benar butuh mata manusia.",
      ],
      formula: String.raw`VE(x) = -\sum_{v} \frac{V(v)}{C} \log_2 \frac{V(v)}{C}`,
      formulaNote: "VE(x) = vote entropy (derajat perdebatan komite); V(v) = jumlah vote komite untuk label v; C = ukuran komite. Contoh konkret: komite 5 orang vote 3-vs-2 → VE ≈ 0,971 (sangat kontroversial → label!); vote 5-vs-0 → VE = 0 (sepakat → lewati). Interpretasi: angka ini = 'seberapa sengit komite berdebat tentang data ini' — perdebatan sengit = label mahal nilainya.",
      figure: {
        svg: FIG_SNORKEL,
        alt: "Alur Snorkel: labeling functions, label model tanpa ground truth, probabilistic labels, model diskriminatif.",
        caption: "Snorkel: aturan berisik masuk, label probabilistik keluar.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "“Uncertainty sampling selalu memilih data terbaik.” Salah — ia buta distribusi. Titik paling membingungkan bisa jadi outlier yang tidak mewakili siapa pun; budget habis untuk anomali. Inilah mengapa literatur menambahkan density weighting: ketidakpastian × kepadatan. Data yang membingungkan model BELUM TENTU data yang berguna — ia harus juga mewakili.",
      },
      reference: "QBC = perdebatan komite; expected change = dampak ke model; Snorkel = program aturan, bukan beli label.",
    },
    {
      id: "lab-snorkel",
      eyebrow: "Langkah 5 · Lab weak supervision",
      title: "Lab: tiga fungsi, 1.600 label, Rp0",
      prose: [
        "Tulis tiga labeling function untuk data lab sebelumnya — tanpa melihat label aslinya: lf1 “kanan = positif” (x > 0,5), lf2 “jauh kiri = negatif” (x < -3,5), lf3 “kiri = negatif” (x < 0, heuristik kasar). Gabungkan dengan majority vote (versi paling sederhana dari label model Snorkel), ukur cakupan (berapa % data yang tidak abstain semua) dan akurasi label hasil voting, lalu latih logistic regression di atas label lemah itu dan bandingkan akurasinya dengan model 100-label manual.",
        "Eksplorasi wajib: (1) buat lf4 yang SENGAJA buruk (“x1 > 2 = positif”) — lihat bagaimana voting meredamnya selama LF lain tidak ikut-ikutan salah (inilah intuisi mengapa label model Snorkel bekerja: kebenaran muncul dari pola agreement); (2) longgarkan lf1 menjadi x > -1,0 — cakupan naik, tapi akurasi label turun: trade-off presisi-vs-cakupan yang juga dihadapi LF dunia nyata; (3) hitung: berapa rupiah yang dihemat 1.600 label lemah vs Rp5.000/label manual?",
        "Cara membaca: cakupan_LF = fraksi data yang tersentuh minimal satu LF; akurasi_label_LF = fraksi label voting yang benar (di lab ini bisa dicek karena kita pegang ground truth — di produksi, Snorkel mengestimasi ini TANPA ground truth dari pola setuju/tidak setuju). Interpretasi: model_LF_test = 0,998 berarti tiga aturan 5-baris menandingi 100 label manusia — dan skalanya ke 2 juta baris tanpa biaya tambahan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `lf1`, `lf2`, `lf3` + majority vote → `lab_weak`, `cover`" },
        { id: "t2", text: "Latih `w_weak` di data ter-cover; print perbandingan biaya label" },
      ],
      expected: "cakupan_LF=0.993 akurasi_label_LF=1.000 · model_LF_test=0.998 · biaya_label: manual_100=Rp500000 vs 3_LF=Rp0",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "Labeling function = “karyawan magang yang murah tapi ceroboh”. Satu magang bisa salah; tiga magang yang salahnya BEDA-BEDA bisa divoting menjadi kebenaran — selama kesalahan mereka tidak berkorelasi. Snorkel adalah HRD-nya: ia mempelajari siapa magang yang paling bisa dipercaya dari pola setuju/tidak setuju mereka, tanpa pernah melihat kunci jawaban.",
      },
      hints: [
        "LF mengembalikan 1/0 atau ABSTAIN (-1) bila tidak yakin",
        "voting: untuk tiap baris ter-cover, bandingkan jumlah vote 1 vs vote 0",
        "cakupan = cover.mean(); akurasi label = (lab_weak == ytr[cover]).mean()",
      ],
      code: {
        starter: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(22)
X0a = rng.normal(0, 1, (500, 2)) + [-2, 0]
X0b = rng.normal(0, 1, (1400, 2)) + [-7, 0]
X1 = rng.normal(0, 1, (100, 2)) + [2, 0]
X = np.vstack([X0a, X0b, X1])
y = np.r_[np.zeros(1900), np.ones(100)].astype(int)
idx = rng.permutation(2000)
Xtr, ytr = X[idx[:1600]], y[idx[:1600]]
Xte, yte = X[idx[1600:]], y[idx[1600:]]
ABSTAIN = -1

def fit_logreg(X_, y_, iters=400, lr=0.5):
    w = np.random.default_rng(0).normal(0, 0.01, X_.shape[1] + 1)
    Xb = np.c_[np.ones(len(X_)), X_]
    for _ in range(iters):
        p = 1 / (1 + np.exp(-Xb @ w))
        w -= lr * (Xb.T @ (p - y_)) / len(X_)
    return w

def akurasi(w, X_, y_):
    Xb = np.c_[np.ones(len(X_)), X_]
    return float((((Xb @ w) > 0).astype(int) == y_).mean())

# TULIS KODEMU
# TODO t1: lf1/lf2/lf3 + majority vote -> lab_weak (label), cover (mask ter-cover)
# TODO t2: w_weak = fit_logreg(Xtr[cover], lab_weak); print perbandingan biaya

# UJI (jangan ubah)
print("cakupan_LF=%.3f akurasi_label_LF=%.3f" % (cover.mean(), float((lab_weak == ytr[cover]).mean())))
print("model_LF_test=%.3f" % akurasi(w_weak, Xte, yte))`,
        lockLines: 25,
        solution: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(22)
X0a = rng.normal(0, 1, (500, 2)) + [-2, 0]
X0b = rng.normal(0, 1, (1400, 2)) + [-7, 0]
X1 = rng.normal(0, 1, (100, 2)) + [2, 0]
X = np.vstack([X0a, X0b, X1])
y = np.r_[np.zeros(1900), np.ones(100)].astype(int)
idx = rng.permutation(2000)
Xtr, ytr = X[idx[:1600]], y[idx[:1600]]
Xte, yte = X[idx[1600:]], y[idx[1600:]]
ABSTAIN = -1

def fit_logreg(X_, y_, iters=400, lr=0.5):
    w = np.random.default_rng(0).normal(0, 0.01, X_.shape[1] + 1)
    Xb = np.c_[np.ones(len(X_)), X_]
    for _ in range(iters):
        p = 1 / (1 + np.exp(-Xb @ w))
        w -= lr * (Xb.T @ (p - y_)) / len(X_)
    return w

def akurasi(w, X_, y_):
    Xb = np.c_[np.ones(len(X_)), X_]
    return float((((Xb @ w) > 0).astype(int) == y_).mean())

# TULIS KODEMU
def lf1(x): return 1 if x[0] > 0.5 else ABSTAIN    # pola: kanan = positif
def lf2(x): return 0 if x[0] < -3.5 else ABSTAIN  # pola: jauh kiri = negatif
def lf3(x): return 0 if x[0] < 0.0 else ABSTAIN   # heuristik kasar: kiri = negatif

votes = np.array([[lf1(x), lf2(x), lf3(x)] for x in Xtr])
mask = votes != ABSTAIN
cover = mask.any(axis=1)
v1 = (votes[cover] == 1).sum(axis=1); v0 = (votes[cover] == 0).sum(axis=1)
lab_weak = (v1 > v0).astype(int)

# t2: latih di label lemah, bandingkan biaya
w_weak = fit_logreg(Xtr[cover], lab_weak)
print("biaya_label: manual_100=Rp500000 vs 3_LF=Rp0")

# UJI (jangan ubah)
print("cakupan_LF=%.3f akurasi_label_LF=%.3f" % (cover.mean(), float((lab_weak == ytr[cover]).mean())))
print("model_LF_test=%.3f" % akurasi(w_weak, Xte, yte))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "cakupan_LF=0\\.993\\s+akurasi_label_LF=1\\.000", label: "Cakupan 0.993, akurasi label 1.000", msg: "Tiga LF + majority vote benar." },
          { kind: "stdout_matches", task: "t2", pattern: "model_LF_test=0\\.998", label: "Model dari label lemah: 0.998", msg: "Label lemah melatih model setara label manusia." },
          { kind: "stdout_matches", task: "t2", pattern: "3_LF=Rp0", label: "Biaya LF = Rp0", msg: "Perbandingan biaya label tercetak." },
        ],
      },
      reference: "Tulis aturan sekali (LF), voting, latih — label jutaan baris tanpa beli label.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: strategi pelabelan mana untuk datamu?",
      prose: [
        "Skenario 1 — label murah dan melimpah (crowdsourcing Rp500/label) → label saja semuanya. Active learning adalah overkill.",
        "Skenario 2 — budget label terbatas + model probabilistik → uncertainty sampling (entropy/margin/least-confident). Murah, mudah, sering cukup.",
        "Skenario 3 — model non-probabilistik (SVM, tree) atau takut bias satu model → query-by-committee: perdebatan komite lebih jujur dari satu pendapat.",
        "Skenario 4 — butuh melabel batch besar sekaligus → density-weighted/diversity: hindari 100 label kembar dan jangan kejar outlier.",
        "Skenario 5 — pola domain bisa ditulis sebagai aturan (“nominal > X dari IP baru”) → Snorkel labeling functions DULU (Rp0/label, jalan malam ini), active learning untuk sisa yang tak ter-cover.",
        "Aturan praktis 10 detik: (1) hitung harga label (Rp/label × kebutuhan); (2) selalu pasang baseline random — AL yang kalah dari random = bug; (3) aturan yang bisa ditulis JANGAN dibeli sebagai label; (4) label termahal = label yang tidak informatif.",
      ],
      tasks: [],
    },
    {
      id: "minicase-bayarku",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 2 juta transaksi, budget Rp150 juta",
      prose: [
        "BayarKu kembali dengan kontrak nyata: 2 juta transaksi tak berlabel, fraud 0,8%, budget Rp150 juta = 10.000 label @Rp15.000. Tiga opsi di atas meja. Opsi A — 10.000 label acak: hanya ~80 fraud yang tertangkap (0,8% × 10.000), sisanya 9.920 transaksi normal yang sebagian besar mudah — persis kesalahan Rp750 juta di cerita pembuka, versi mini. Opsi B — tulis labeling function dari pola domain (Snorkel): 2 juta pseudo-label dalam semalam, biaya label Rp0; studi pengguna Snorkel mencatat pakar 2,8x lebih cepat dengan performa +45,5% vs 7 jam hand-labeling, dalam 3,6% dari training set manual besar. Opsi C — active learning uncertainty untuk 1.000 titik yang tak ter-cover LF: tiap label ~6x lebih tidak terbuang dibanding acak (lab: 59 vs 10).",
        "Pembahasan: keputusan BUKAN satu pemenang — melainkan urutan. Kerjakan B malam ini (pola “nominal jumbo + IP baru + jam aneh” sudah diketahui analis; tidak perlu dibeli sebagai label), lalu C untuk 1.000 titik abu-abu yang tak ter-cover aturan. Opsi A hanya dipakai sebagai baseline pembanding, bukan strategi. Total label manusia yang dibeli: 1.000, bukan 10.000 — budget Rp150 juta bahkan tidak habis.",
        "Cara membaca: susun tabel opsi × (biaya, cakupan, kualitas label). Interpretasi: sel “biaya Rp0 + cakupan 2 juta” milik weak supervision tidak bisa dilawan oleh strategi beli-label mana pun — ia bermain di liga berbeda. Active learning memenangkan liga “label manusia yang tersisa”.",
        "Jebakan yang dihindari: tim hampir memilih A “karena paling standar dan mudah dijelaskan ke manajemen” — standar yang menghabiskan Rp150 juta untuk 9.920 label terbuang bukanlah standar, melainkan kemalasan yang mahal.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Active learning = strategi belanja label: latih → peringkat informatif → label top-k → ulangi.",
        "Uncertainty sampling (entropy/margin/least-confident): labeli yang paling membingungkan model.",
        "Kemenangannya ada di label-efficiency (lab: 59 vs 10 label terbuang), bukan sihir akurasi.",
        "QBC = labeli yang diperdebatkan komite; density weighting = jangan kejar outlier.",
        "Snorkel: tulis labeling function → label model menimbang akurasi tanpa ground truth → label probabilistik.",
        "Aturan praktis: baseline random wajib; aturan yang bisa ditulis jangan dibeli sebagai label.",
      ],
      next: { label: "MLE23 — Matematika ML: Penyegar untuk Praktisi", href: "/v2/learn/mle23-matematika-ml" },
      quiz: [
        {
          q: "Model memprediksi [0,5, 0,5] untuk sebuah transaksi (entropi ≈ 1,0 bit). Artinya?",
          options: [
            { text: "Model 50/50 — kandidat paling worth it untuk dilabel berikutnya", why: "Tepat: entropi maksimal = ketidakpastian maksimal = nilai informasi label tertinggi.", correct: true },
            { text: "Model yakin transaksi ini normal", why: "Terbalik — 50/50 adalah ketidakyakinan total, bukan keyakinan.", correct: false },
            { text: "Transaksi ini pasti fraud", why: "Probabilitas 0,5 bukan vonis — ini justru titik yang butuh manusia.", correct: false },
            { text: "Lewati saja, model sudah memutuskan", why: "Model belum memutuskan apa-apa — 50/50 = belum ada keputusan.", correct: false },
          ],
        },
        {
          q: "Komite 5 model: titik A divote 3-vs-2, titik B 5-vs-0. Query-by-committee memilih?",
          options: [
            { text: "Titik A — vote entropy 0,971, komite paling berdebat", why: "Tepat: QBC memilih perdebatan tertinggi; B sudah sepakat (VE=0).", correct: true },
            { text: "Titik B — semua model yakin", why: "Kesepakatan total = tidak ada yang dipelajari dari labelnya.", correct: false },
            { text: "Keduanya sama informatifnya", why: "VE 0,971 vs 0 — jauh berbeda; hanya A yang kontroversial.", correct: false },
            { text: "Tidak ada — tunggu komite 100% sepakat dulu", why: "Menunggu kesepakatan = tidak pernah melabel; AL justru mengejar ketidaksepakatan.", correct: false },
          ],
        },
        {
          q: "Bahaya terbesar uncertainty sampling murni?",
          options: [
            { text: "Menghabiskan budget untuk outlier/noise yang tidak mewakili apa pun", why: "Tepat: ia buta distribusi — solusinya density weighting (Settles).", correct: true },
            { text: "Terlalu lambat dihitung", why: "Justru murah — satu forward pass per kandidat untuk model probabilistik.", correct: false },
            { text: "Memilih data yang terlalu mudah", why: "Terbalik — ia memilih yang tersulit/membingungkan, kadang TERLALU sulit (noise).", correct: false },
            { text: "Tidak bisa dipakai untuk deep learning", why: "Bisa — ketidakpastian dari softmax/MC-dropout/ensemble justru standar di deep AL.", correct: false },
          ],
        },
        {
          q: "Snorkel mempelajari akurasi tiap labeling function TANPA ground truth. Caranya?",
          options: [
            { text: "Dari pola setuju/tidak setuju antar-LF — LF yang sering benar bersama mayoritas dinilai akurat", why: "Tepat: label model generatif mengestimasi akurasi dari matriks agreement.", correct: true },
            { text: "Dengan menebak acak lalu mengoreksi", why: "Bukan tebakan — agreement antar sumber independen adalah sinyal statistik yang valid.", correct: false },
            { text: "Meminta manusia menilai tiap LF", why: "Itu justru yang dihindari — seluruh poinnya adalah tanpa label manusia.", correct: false },
            { text: "Majority vote buta sudah cukup, tak perlu dipelajari", why: "Majority vote menganggap semua LF sama andal — label model menimbang yang andal lebih berat.", correct: false },
          ],
        },
        {
          q: "2 juta data, pola domain jelas (“nominal jumbo + IP baru”), budget label NOL rupiah. Strategi?",
          options: [
            { text: "Tulis labeling function (Snorkel) — pola yang bisa ditulis jangan dibeli sebagai label", why: "Tepat: Rp0/label, jalan malam ini, cakupan 2 juta baris.", correct: true },
            { text: "Uncertainty sampling dengan 0 label", why: "AL butuh oracle manusia — budget nol = tidak ada yang melabel pilihannya.", correct: false },
            { text: "Label acak 100 data dengan memohon ke manajemen", why: "Melanggar budget dan tetap kalah cakupan dari LF.", correct: false },
            { text: "Tunda proyek sampai ada budget label", why: "Menyerah padahal weak supervision dirancang persis untuk situasi ini.", correct: false },
          ],
        },
      ],
    },
  ],
};
