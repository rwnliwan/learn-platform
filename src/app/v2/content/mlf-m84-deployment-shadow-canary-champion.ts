import type { V2Lesson } from "../lib/types";

export const mlfM84: V2Lesson = {
  slug: "mlf-m84-deployment-shadow-canary-champion",
  track: "Machine Learning Finance",
  module: "Model risk & deployment",
  title: "MLF-M8.4 — Deployment: Shadow, Canary & Champion-Challenger — Jangan Biarkan Model Baru Menyakitimu di Hari Pertama",
  estMinutes: 100,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Model baru yang «hampir sama bagusnya» — dan kerugian satu bulan penuh",
      prose: [
        "Bayangkan kamu analis kredit. Tim modeling datang dengan kabar gembira: mereka melatih model baru yang lebih sederhana, lebih cepat, dan jauh lebih mudah dijelaskan ke bisnis — regresi logistik (LR). ROC-AUC-nya 0,7426, «cuma» 0,039 di bawah champion GBM terkalibrasi (0,7816). «Hampir sama,» kata mereka. «Dan jauh lebih gampang dijelaskan.» Jumat sore, model baru itu di-deploy 100% — big-bang, tanpa shadow, tanpa canary. Senin pagi, bisnis tidak menelepon. Tidak ada yang aneh di dashboard — approval rate turun sedikit, dari 28,5% ke 20,25%, dan semua orang mengira itu «model yang lebih hati-hati». Sebulan kemudian, laporan laba datang: profit dari keputusan kredit jatuh dari +NT$8.214.000 menjadi +NT$1.823.000. Selisih NT$6.391.000 — hilang dalam satu bulan, tanpa satu pun alarm yang menyala, karena tidak ada yang memasang alarm.",
        "Itulah yang lesson ini cegah. Angka-angka di atas bukan karangan: itu hasil perbandingan champion (GBM terkalibrasi Platt) vs challenger (LR proba MENTAH — tidak terkalibrasi) pada test 6.000 yang sama, threshold operasional 0,10 yang sama [notebook, kanonis M8]. Challenger itu kalah di SEMUA metrik keputusan — approval lebih rendah (20,25% vs 28,50%), bad rate lebih tinggi (9,14% vs 6,67%), profit jauh lebih rendah (+NT$1.823.000 vs +NT$8.214.000) — dan keputusan kedua model berbeda pada 19,42% nasabah (1.165 dari 6.000). Model yang «hampir sama» itu mengubah hampir satu dari lima keputusan — dan hampir semua perubahan itu merugikan.",
        "Konteks angka lesson ini [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur [notebook]; champion GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05; challenger LR (Pipeline StandardScaler + LogisticRegression) dinilai pada proba MENTAH-nya pada threshold 0,10 yang sama. Satu peringatan jujur di depan, dan ini inti lesson ini: 0,10 LR BUKAN 0,10 champion. LR tidak terkalibrasi (Brier 0,1427 vs champion 0,1345), jadi threshold angka yang sama berarti hal yang berbeda pada kedua model — selisih profitnya sebagian artefak kalibrasi, bukan murni skill ranking. Lesson ini menulis itu eksplisit, dan mengajarkan protokol yang benar: kalibrasi dulu, baru bandingkan.",
        "Peta lesson: cerita kerugian satu bulan → pola deployment (big-bang vs bertahap) → deployment readiness (12 item, gerbang sebelum shadow) → shadow mode (harga switch sebelum membayarnya) → canary (ramp 1%→5%→25%→100%) → desain eksperimen canary (sampel efektif, hash, cohort, stopping rule) → champion-challenger (angka + McNemar) → kriteria naik yang kuantitatif → decision matrix (superiority / non-inferiority / equivalence / reject) → monitoring gates per ramp → rollback → jebakan (menang di test, kalah di live) → mini-case (putuskan: naik atau tidak?) → 3 lab → checkpoint.",
        "Nilai: deployment yang aman bukan tentang seberapa bagus model barumu di test — melainkan tentang seberapa kecil kerugianmu bila ternyata ia buruk di live. Shadow memberi tahu harga switch SEBELUM kamu membayarnya; canary membatasi kerugianmu pada 1% traffic bila kamu salah; champion-challenger memaksa model baru membuktikan dirinya melawan champion di data yang sama, bukan melawan kenangan test lamanya.",
        "Baik atau buruk: LR sebagai challenger itu «baik» sebagai ide — model sederhana yang mudah dijelaskan memang layak diuji, dan mengujinya adalah pekerjaan yang benar. Buruk bila «mudah dijelaskan» dibaca sebagai «aman di-deploy»: kesederhanaan bukan bukti kualitas keputusan. ROC-AUC 0,7426 vs 0,7816 terdengar seperti selisih kecil — tapi di keputusan uang, selisih itu bernilai NT$6.391.000 per 6.000 nasabah.",
        "Mitigasi: JANGAN PERNAH deploy model keputusan uang 100% di hari pertama. Urutannya selalu: shadow dulu (keputusan dicatat, tidak bertindak) → canary (traffic kecil, gate di tiap ramp) → champion-challenger (naik hanya bila menang di gate kuantitatif). Lesson ini memberi angka untuk tiap tahapnya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «hampir sama» di ROC-AUC berarti «hampir sama» di laba",
        type: "pitfall",
        body: "Yang benar: ROC-AUC mengukur ranking, bukan laba. Champion 0,7816 vs challenger 0,7426 — selisih 0,0390 — berubah menjadi selisih profit NT$6.391.000 (dari +NT$8.214.000 ke +NT$1.823.000) pada test 6.000 yang sama. Ranking yang «hampir sama» tetap bisa menyetujui nasabah yang sangat berbeda — dan nasabah yang berbedalah yang menentukan laba, bukan rankingnya.",
      },
    },
    {
      id: "deployment-patterns",
      eyebrow: "Langkah 2 · Pola deployment",
      title: "Big-bang vs bertahap — kapan masing-masing masuk akal",
      prose: [
        "Ada dua pola deployment, dan hanya satu yang masuk akal untuk keputusan uang. Big-bang: model baru menggantikan model lama 100% sekaligus, di hari pertama. Bertahap: model baru masuk sedikit demi sedikit — shadow dulu (0% traffic bertindak), lalu canary (1% → 5% → 25% → 100%), dengan gate di tiap tahap. Perbedaannya bukan kecepatan — melainkan seberapa besar kerugianmu bila kamu salah. Big-bang yang salah merugikan 100% nasabahmu sejak jam pertama; canary yang salah merugikan 1%.",
        "Big-bang masuk akal HANYA bila tiga syarat terpenuhi sekaligus: (1) blast radius-nya kecil — keputusan yang diambil tidak bernilai uang besar dan mudah dibatalkan; (2) reversible dalam hitungan menit — rollback sudah diuji, bukan sekadar direncanakan; (3) tidak ada yang dipertaruhkan bila modelnya salah — misal model rekomendasi konten, bukan model kredit. Bila satu syarat saja tidak terpenuhi, big-bang bukan «berani» — ia ceroboh. Model kredit tidak memenuhi satu pun: tiap keputusan bernilai limit nasabah, rollback yang belum diuji adalah harapan, dan kesalahan sebulan bernilai NT$6.391.000 per 6.000 nasabah.",
        "Bertahap masuk akal justru ketika taruhannya BESAR — dan biayanya nyata: kamu membayar dengan waktu (berminggu-minggu sampai 100%), kompleksitas operasional (dua model jalan berdampingan, routing traffic, dua dashboard), dan kesabaran bisnis («kenapa model barunya belum live semua?»). Itu harga yang benar untuk dibayar: bandingkan dengan harga big-bang yang salah — satu bulan profit hilang sebelum ada yang sadar.",
        "Nilai: memilih pola deployment adalah memilih BATAS KERUGIAN MAKSIMUM. Shadow membatasinya ke nol (keputusan tidak bertindak); canary 1% membatasinya ke 1% traffic; big-bang membatasinya ke… 100%. Tulis batas itu di dokumen keputusan sebelum deploy — bila kamu tidak sanggup menulis «kerugian maksimum yang kami terima adalah X», kamu belum siap deploy.",
        "Baik atau buruk: bertahap bagus karena ia mengubah deployment dari satu taruhan besar menjadi serangkaian taruhan kecil yang masing-masing bisa dibatalkan. Buruk bila bertahapnya tanpa gate — canary tanpa kriteria lanjut/stop hanyalah big-bang yang ditunda: model buruk yang sama akhirnya mencapai 100%, hanya lebih lambat. Gate-nya ada di langkah 6; tanpanya, ramp hanyalah jadwal, bukan pengaman.",
        "Mitigasi: untuk SETIAP deployment model keputusan uang, tulis dulu: pola apa (bertahap), ramp-nya apa (1% → 5% → 25% → 100% [kebijakan lesson ini]), gate tiap ramp (langkah 6), dan siapa yang berhak menekan tombol rollback (langkah 8). Bila salah satu belum ditulis, deployment belum disetujui — siapa pun yang mendesak.",
      ],
      tasks: [],
    },
    {
      id: "deployment-readiness",
      eyebrow: "Langkah 2a · Sebelum shadow",
      title: "Deployment readiness: dua belas item yang diperiksa SEBELUM satu keputusan pun diambil",
      prose: [
        "Shadow (langkah 3) dan canary (langkah 4) adalah pengaman untuk model yang SUDAH SIAP di-deploy — tapi «siap» itu sendiri harus diperiksa dulu. DEPLOYMENT READINESS CHECKLIST adalah daftar dua belas item yang semuanya harus lolos SEBELUM shadow dibuka: (1) input/output contract — ditulis: input apa, output apa, satuan apa, dan apa arti tiap output; (2) schema compatibility — fitur live SAMA dengan fitur latih: nama, tipe, satuan, dan definisi yang sama (bila satu fitur berubah nama di produksi, model membaca kolom yang salah); (3) feature freshness — tiap fitur tersedia TEPAT WAKTU: fitur yang telat 2 jam adalah fitur basi, dan keputusan atas data basi adalah keputusan atas masa lalu; (4) fallback behavior — bila model gagal atau lambat, apa yang terjadi: kembali ke champion atau ke keputusan manual — BUKAN error ke nasabah, dan BUKAN diam-diam memakai skor default; (5) latency/capacity test — p95 latency di bawah SLA [kebijakan organisasi] pada traffic puncak, bukan pada traffic sepi; (6) logging — tiap keputusan mencatat decision ID, model version, threshold, skor, dan fitur input — cukup untuk replay (G10) dan audit (M8.3); (7) access control — siapa yang bisa deploy dan siapa yang bisa rollback (dua orang yang berbeda, M8.5); (8) alert missing/late features — bila satu fitur hilang atau telat, alert berbunyi: sistem tidak boleh diam-diam memakai nilai default; (9) model card lengkap (M8.3) — gerbang: tidak ada kartu lengkap, tidak ada deploy; (10) approval komite ditandatangani (M8.5) — bukan «akan ditandatangani»; (11) deployment_id ditetapkan dan bundle konfigurasi dibekukan (G13, M8.3) — versi yang di-deploy adalah versi yang divalidasi; (12) rollback drill sudah dilakukan kuartal ini (G10) — tim sudah PERNAH mempraktikkan rollback, bukan hanya menulis runbook-nya.",
        "Skenario latihan [ilustrasi] — readiness review sebelum shadow challenger LR. Sepuluh item lolos. Dua gagal: (3) feature freshness — PAY_AMT1–PAY_AMT6 telat 2 jam dari sumbernya, jadi delapan fitur turunan dihitung dari tagihan yang belum lengkap; dan (6) logging — decision ID belum ditulis ke log, jadi keputusan shadow tidak bisa di-replay. Vonis: deployment DIBLOKIR sampai keduanya diperbaiki. Sepuluh yang lolos TIDAK menebus dua yang gagal — readiness adalah gerbang biner, seperti linkage (M8.3): satu item yang gagal berarti satu bagian sistem yang belum siap, dan bagian itu adalah bagian yang akan rusak di live. Yang berbahaya dari kegagalan (3) adalah ia tidak terlihat di dashboard: model tetap memberi skor, approval rate tetap normal — hanya saja skornya dihitung dari data yang salah. Yang berbahaya dari kegagalan (6) adalah ia baru ketahuan saat dibutuhkan: saat insiden terjadi dan tidak ada yang bisa membuktikan keputusan apa yang diambil model.",
        "Nilai: checklist bagus karena ia memindahkan «siap deploy» dari perasaan («kayaknya sudah siap») ke daftar yang bisa dicentang — dan tiap itemnya adalah sesuatu yang bisa diuji SEBELUM ada nasabah yang terkena. Buruk bila checklist diisi sesudah deploy («kami sudah live, mari lengkapi readiness-nya») — pada titik itu checklist bukan gerbang, melainkan dokumentasi atas risiko yang sudah diambil. Buruk juga bila satu item «hampir lolos» dianggap lolos: freshness yang «hampir tepat waktu» adalah freshness yang telat pada jam sibuk.",
        "Baik atau buruk: readiness bagus bila diperiksa oleh orang yang BUKAN tim yang membangun model — tim yang membangun cenderung melihat yang sudah beres, bukan yang belum. Buruk bila pemeriksanya adalah orang yang sama dengan yang menekan tombol deploy — ia memeriksa pekerjaannya sendiri. Dan buruk bila checklist tidak pernah diperbarui: item (5) latency yang ditulis untuk traffic 12.000/periode tidak berlaku lagi bila traffic menjadi 50.000/periode.",
        "Mitigasi: jadikan checklist ini GERBANG PERTAMA deployment (sebelum shadow): tidak ada satu pun item yang boleh «nanti diperbaiki di live». Dan ulangi checklist di TIAP ramp canary — readiness bukan sekali-per-deployment: fitur yang segar di 1% bisa telat di 25% bila sumber datanya tidak sanggup.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Arsitektur deployment: traffic masuk ke router hash, ke champion atau challenger, scoring memakai feature store, keputusan dicatat di decision log dan dipantau monitoring">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Arsitektur deployment — dari traffic ke keputusan yang tercatat</text>
<rect x="10" y="40" width="80" height="36" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="50" y="55" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Traffic</text>
<text x="50" y="68" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">12.000/periode</text>
<rect x="105" y="40" width="80" height="36" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="145" y="55" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Router</text>
<text x="145" y="68" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">hash(customer_id)</text>
<rect x="200" y="40" width="80" height="36" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="240" y="55" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Model</text>
<text x="240" y="68" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">champion/challenger</text>
<rect x="295" y="40" width="80" height="36" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="335" y="55" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Scoring</text>
<text x="335" y="68" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">31 fitur</text>
<rect x="390" y="40" width="80" height="36" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="430" y="55" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Keputusan</text>
<text x="430" y="68" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">setuju/tolak</text>
<line x1="90" y1="58" x2="105" y2="58" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="185" y1="58" x2="200" y2="58" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="280" y1="58" x2="295" y2="58" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="375" y1="58" x2="390" y2="58" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="280" y="130" width="110" height="36" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="335" y="145" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Feature store</text>
<text x="335" y="158" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">freshness dicek</text>
<rect x="390" y="130" width="80" height="36" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="430" y="145" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Decision log</text>
<text x="430" y="158" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">ID, versi, threshold</text>
<rect x="200" y="130" width="80" height="36" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="240" y="145" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Monitoring</text>
<text x="240" y="158" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">[M7.5]</text>
<line x1="335" y1="130" x2="335" y2="76" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="430" y1="76" x2="430" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="240" y1="76" x2="240" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="240" y="196" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Readiness: 12 item — 2 gagal (freshness + logging) = deployment DIBLOKIR [ilustrasi]</text>
<text x="240" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fallback: model gagal/slow → champion/manual, bukan error ke nasabah</text>
<text x="240" y="226" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Tiap keputusan tercatat (decision ID, model version, threshold) — cukup untuk replay</text>
</svg>`,
        alt: "Arsitektur deployment: traffic masuk ke router hash, ke champion atau challenger, scoring memakai feature store, keputusan dicatat di decision log dan dipantau monitoring; readiness 12 item, 2 gagal berarti deployment diblokir.",
        caption: "Cara membaca: traffic masuk → router (hash) membagi ke champion/challenger → scoring memakai 31 fitur dari feature store → keputusan setuju/tolak. Tiap keputusan dicatat di decision log (decision ID, model version, threshold) dan dipantau monitoring [M7.5]. Readiness checklist memeriksa 12 item sebelum shadow dibuka — dalam skenario [ilustrasi] lesson ini, 2 item gagal (feature freshness + logging) sehingga deployment DIBLOKIR, walau 10 item lain lolos.",
      },
      tasks: [],
    },
    {
      id: "shadow-mode",
      eyebrow: "Langkah 3 · Shadow mode",
      title: "Shadow mode — challenger memutuskan, tapi tidak bertindak",
      prose: [
        "Shadow mode adalah cara termurah untuk mengetahui harga sebuah switch: challenger diberi nasabah yang sama dengan champion, ia menghitung skor dan keputusannya — tapi keputusannya hanya DICATAT, tidak ditindaklanjuti. Nasabah tetap menerima keputusan champion. Yang kamu dapatkan: perbandingan apel-dengan-apel atas nasabah yang sama, tanpa satu rupiah pun dipertaruhkan. Yang tidak kamu dapatkan: reaksi live — perilaku nasabah terhadap keputusan challenger tidak bisa diamati, karena keputusannya tidak pernah sampai ke nasabah. Shadow mengukur harga switch, bukan dunia setelah switch.",
        "Nilai [notebook] — disagreement rate: keputusan champion dan challenger berbeda pada 1.165 dari 6.000 nasabah — 19,42%. Hampir satu dari lima nasabah akan menerima keputusan berbeda bila kamu switch. Itu angka pertama yang harus kamu ketahui SEBELUM switch: bila disagreement-nya 0,5%, switch-mu hampir tidak berpengaruh apa-apa; bila 19,42%, switch-mu adalah keputusan besar yang mengubah satu dari lima nasib. Disagreement rate yang besar bukan otomatis alasan menolak — ia alasan untuk MEMBACA SELNYA: siapa yang berubah, dan ke arah mana?",
        "Baik atau buruk: disagreement 19,42% itu «buruk» sebagai kabar — switch ini bukan pergantian kecil — tapi «baik» sebagai informasi: shadow memberitahumu SEBELUM kamu membayar. Dua selnya menceritakan segalanya. Sel pertama — challenger-only approvals (challenger setuju, champion tolak), n = 335: bad rate 18,21% (61 default dari 335) — hampir tiga kali bad rate champion 6,67%. Bila switch bertindak atas sel ini, kerugian terealisasi NT$9.243.000 melawan margin NT$4.382.000 — net −NT$4.861.000. Sel ini saja sudah merugikan hampir NT$5 juta. Sel kedua — challenger-only rejections (champion setuju, challenger tolak), n = 830: good rate 92,29% (766 lancar dari 830) — challenger menolak 766 nasabah BAIK yang champion setujui dengan benar. Margin yang hilang (gross) bila switch bertindak: NT$6.354.000 — sebelum menghitung kerugian yang dihindari atas 64 default di sel ini, jadi angka net-nya lebih kecil dari gross ini; rekonsiliasi penuh kedua sel terhadap selisih profit −NT$6.391.000 ada di notebook.",
        "Mitigasi: JANGAN PERNAH switch tanpa membaca kedua sel shadow. Aturannya: sel approvals challenger-only harus punya bad rate TIDAK LEBIH BURUK dari bad rate champion (di sini 18,21% vs 6,67% — gagal telak); sel rejections challenger-only harus mayoritas BURUK agar penolakan itu benar (di sini 92,29% BAIK — gagal telak). Challenger ini gagal di kedua sel sekaligus: ia menyetujui yang seharusnya ditolak, dan menolak yang seharusnya disetujui. Shadow sudah memberi vonisnya — sebelum satu rupiah pun dipertaruhkan.",
      ],
      formula: String.raw`D = \frac{n_{\text{beda}}}{n}, \qquad D = \frac{1.165}{6.000} = 0{,}1942`,
      formulaNote: "Disagreement rate D: pangsa nasabah yang keputusannya berbeda antara champion dan challenger pada populasi yang sama (test 6.000, threshold 0,10). D yang besar berarti switch mengubah banyak keputusan — baca selnya sebelum memutuskan.",
      tasks: [],
      note: {
        title: "Jebakan: shadow di test dibaca sebagai shadow di live",
        type: "risk",
        body: "Yang benar: shadow lesson ini dihitung pada test 6.000 — populasi KEMARIN. Shadow live (challenger membayangi champion pada nasabah yang benar-benar datang hari ini) bisa memberi angka berbeda bila populasi bergeser [M7.5]. Shadow test menjawab «berapa harga switch pada data yang kita punya»; shadow live menjawab «berapa harga switch pada dunia hari ini». Keduanya dibutuhkan — test dulu, live kemudian — dan jangan pernah memakai yang satu sebagai pengganti yang lain.",
      },
    },
    {
      id: "canary",
      eyebrow: "Langkah 4 · Canary",
      title: "Canary — naik 1% dulu, dan biarkan angka yang memutuskan",
      prose: [
        "Canary adalah shadow yang diberi gigi: challenger benar-benar bertindak — tapi hanya pada sebagian kecil traffic. Ramp lesson ini [kebijakan lesson ini]: 1% → 5% → 25% → 100% dari traffic masuk. Di tiap ramp, challenger hidup cukup lama untuk mengumpulkan data, lalu gate memutuskan: LANJUT ke ramp berikut, TAHAN di ramp yang sama sambil mengumpulkan data lagi, STOP (jangan naik; evaluasi rollback), atau ROLLBACK (traffic kembali 100% ke champion). Ramp tanpa gate bukan canary — itu big-bang yang dicicil.",
        "Aturan per ramp [kebijakan lesson ini] — ditulis DULU, sebelum melihat angka: LANJUT bila bad rate challenger ≤ 8% DAN PSI skor ≤ 0,10; TAHAN bila bad rate 8–10% DAN PSI skor ≤ 0,10 (zona abu-abu: kumpulkan data lagi di ramp yang sama, jangan naik) — dan TAHAN juga bila PSI skor 0,10–0,25 tanpa bad rate buruk (PSI naik tanpa bukti kerugian: jangan naik, kumpulkan data lagi; bila TAHAN itu berulang, STOP); STOP bila bad rate > 10% ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut. Ambang 8% dipilih dari baseline champion: bad rate champion 6,67% [notebook] ditambah toleransi 1,33 poin persen — challenger boleh sedikit lebih buruk, tidak boleh jauh lebih buruk. Ambang 8% (toleransi 1,33 pp) adalah ambang CANARY — lebih longgar dari ambang gate naik G2 (7,67%, toleransi 1,00 pp): canary hanya mengizinkan ramp berikutnya, gate naik memutuskan penggantian penuh — keputusan yang lebih besar memakai ambang yang lebih ketat. Ambang PSI meminjam band M7.5 [M7.5]: di bawah 0,1 stabil, di atas 0,25 geser besar.",
        "Nilai [simulasi] — canary atas challenger LR dengan parameter eksplisit (bukan observasi live). Basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk — jadi 1% = 120, 5% = 600; ramp 5% diperpanjang mengakumulasi 5 periode pada 5% sampai terkumpul 3.000 nasabah (25% dari basis 12.000), bukan «5% dari test 6.000». Ramp 1% (n = 120, disetujui 26, default 2, PSI skor 0,02) → bad rate 7,69% → LANJUT. Ramp 5% (n = 600, disetujui 123, default 11, PSI skor 0,05) → bad rate 8,94% → TAHAN (zona abu-abu, jangan naik). Ramp 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI skor 0,06) → bad rate 9,15% → STOP — TAHAN kedua berturut-turut. Challenger TIDAK PERNAH mencapai 25% — canary menangkapnya di 5%, sebelum 95% nasabah lainnya sempat dirugikan. Itulah gunanya ramp: kegagalan yang di test terlihat sebagai «cuma 0,039 ROC-AUC» berubah menjadi STOP yang terukur di 5% traffic.",
        "Baik atau buruk: canary bagus karena ia membatasi kerugian sambil tetap memberi data LIVE — bad rate 9,15% pada n = 3.000 adalah bukti live, bukan bukti test. Buruk bila dibaca tanpa n dan tanpa cohort matang: ramp 1% dengan n = 120 hanya punya 26 nasabah disetujui — bad rate 7,69% di sana adalah 2 default dari 26, satu default lagi saja sudah mengubahnya menjadi 11,54%. Itulah mengapa LANJUT di ramp 1% bukan vonis «challenger bagus» — melainkan «belum ada bukti ia buruk; naikkan traffic agar buktinya terkumpul». Dan buruk bila bad rate per ramp dihitung pada cohort yang labelnya belum matang [M7.5]: label default butuh jendela observasi 1 bulan — bad rate ramp yang dihitung terlalu dini adalah angka atas label yang belum lengkap.",
        "Mitigasi: di tiap ramp, laporkan metrik TANPA label (PSI skor, approval rate, distribusi skor — tersedia segera) TERPISAH dari metrik berlabel (bad rate, ROC-AUC — hanya cohort matang) [M7.5]. Jangan pernah menaikkan ramp berdasarkan bad rate yang labelnya belum matang — itu menaikkan traffic atas dasar angka yang belum jujur. Dan satu aturan keras: keputusan LANJUT/TAHAN/STOP ditulis dan ditandatangani SEBELUM ramp berikutnya dibuka — canary yang keputusannya dibuat sesudah melihat angka adalah canary yang tidak punya gate.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram canary ramp: 1 persen lanjut, 5 persen tahan lalu stop, 25 persen dan 100 persen tidak dicapai, lalu rollback ke champion">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Canary ramp — 1% → 5% → 25% → 100% [kebijakan lesson ini]</text>
<rect x="20" y="50" width="95" height="44" fill="var(--c4)"/>
<rect x="135" y="50" width="95" height="44" fill="var(--c2)"/>
<rect x="250" y="50" width="95" height="44" fill="none" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<rect x="365" y="50" width="95" height="44" fill="none" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="67" y="68" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1%</text>
<text x="67" y="84" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">traffic</text>
<text x="182" y="68" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5%</text>
<text x="182" y="84" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">traffic</text>
<text x="297" y="68" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">25%</text>
<text x="297" y="84" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">traffic</text>
<text x="412" y="68" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">100%</text>
<text x="412" y="84" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">traffic</text>
<text x="125" y="78" text-anchor="middle" font-size="16" fill="var(--text)" font-family="var(--font-ui)">→</text>
<text x="240" y="78" text-anchor="middle" font-size="16" fill="var(--text)" font-family="var(--font-ui)">→</text>
<text x="355" y="78" text-anchor="middle" font-size="16" fill="var(--text)" font-family="var(--font-ui)">→</text>
<text x="67" y="112" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">LANJUT</text>
<text x="182" y="112" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TAHAN → STOP</text>
<text x="297" y="112" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">TIDAK DICAPAI</text>
<text x="412" y="112" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">TIDAK DICAPAI</text>
<text x="67" y="128" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">bad 7,69% [simulasi]</text>
<text x="182" y="128" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">bad 8,94% → 9,15% [simulasi]</text>
<line x1="182" y1="94" x2="182" y2="180" stroke="var(--c2)" stroke-width="2"/>
<text x="192" y="150" font-size="10" fill="var(--text)" font-family="var(--font-ui)">dua TAHAN berturut-turut</text>
<rect x="20" y="180" width="290" height="30" fill="var(--c1)"/>
<text x="165" y="199" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ROLLBACK — traffic kembali 100% ke champion</text>
<text x="240" y="228" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Gate tiap ramp [kebijakan lesson ini]: LANJUT bila bad ≤ 8% &amp; PSI ≤ 0,10; TAHAN bila bad 8–10% &amp; PSI ≤ 0,10, atau PSI 0,10–0,25 tanpa bad rate buruk; STOP bila bad &gt; 10% / PSI &gt; 0,25 / dua TAHAN.</text>
</svg>`,
        alt: "Diagram canary ramp: 1 persen lanjut dengan bad rate 7,69 persen, 5 persen tahan lalu stop dengan bad rate 8,94 persen ke 9,15 persen, 25 persen dan 100 persen tidak dicapai, lalu rollback ke champion.",
        caption: "Cara membaca: challenger LR naik 1% (bad rate 7,69% [simulasi] → LANJUT), lalu 5% (bad rate 8,94% → TAHAN, diperpanjang ke n = 3.000: bad rate 9,15% → STOP karena TAHAN kedua berturut-turut). Ramp 25% dan 100% tidak pernah dicapai; traffic kembali 100% ke champion. Gate tiap ramp [kebijakan lesson ini]: LANJUT bila bad rate ≤ 8% dan PSI skor ≤ 0,10; TAHAN bila bad rate 8–10% dan PSI skor ≤ 0,10, atau PSI skor 0,10–0,25 tanpa bad rate buruk; STOP bila bad rate > 10%, PSI skor > 0,25, atau dua TAHAN berturut-turut.",
      },
      tasks: [],
    },
    {
      id: "canary-experiment-design",
      eyebrow: "Langkah 4a · Perluasan canary",
      title: "Desain eksperimen canary: traffic persen bukan sampel — dan ambang tidak digeser",
      prose: [
        "Langkah 4 memberimu aturan ramp — tapi aturan itu hanya benar bila EKSPERIMEN-nya benar. Empat hal yang membuat canary menjadi eksperimen, bukan sekadar «naik pelan-pelan». SATU — traffic percentage BUKAN effective sample size. Ramp 1% dari 12.000 aplikasi adalah 120 nasabah — tapi bad rate tidak dihitung atas 120. Bad rate dihitung atas yang DISETUJUI: 26 nasabah. Sampel efektif bad rate R1 adalah 26, bukan 120 — dan bukan 12.000. Dua default dari 26 adalah 7,69%; satu default lagi saja sudah mengubahnya menjadi 11,54% — melewati ambang STOP 10%. Karena itu aturan tambahan lesson ini [kebijakan lesson ini]: STOP atas bad rate butuh n_approved ≥ 100 — di bawah itu, yang tersedia hanya LANJUT atau TAHAN (kumpulkan data lagi). Di R1 (26 disetujui) kamu bahkan TIDAK BOLEH memutuskan STOP atas bad rate — sampelnya terlalu kecil untuk vonis. Aturan pelaporannya: tiap ramp laporkan n, n_approved, DAN n_default — «1% traffic» tanpa ketiganya bukan laporan, melainkan judul.",
        "DUA — random assignment yang stabil per nasabah. Nasabah dibagi dengan hash(customer_id + garam eksperimen) % 100: hash di bawah ramp% masuk challenger, sisanya champion. Hash membuat pembagian STABIL: nasabah yang sama selalu masuk arm yang sama selama eksperimen — ia tidak bisa mendapat champion hari ini dan challenger besok, dan ia tidak bisa «memilih» arm-nya. Garam (salt) diganti tiap eksperimen, supaya nasabah yang sama tidak selalu masuk challenger di eksperimen berikutnya. Dan assignment dilakukan SEBELUM scoring — tidak ada yang boleh merutekan «nasabah yang kelihatan gampang» ke challenger. Random per-request (acak tiap kali tanpa hash) adalah kesalahan klasik: nasabah yang mengajukan dua kali bisa mendapat kedua model — kontaminasi yang membuat perbandingan tidak lagi bersih.",
        "TIGA — cohort champion vs challenger harus comparable (sebanding). Kedua arm berjalan pada jendela waktu yang SAMA dan campuran traffic yang SAMA — bila challenger hanya berjalan di jam sibuk sementara champion di jam sepi, perbandingannya bias. Sebelum membaca bad rate, baca BALANCE TABLE: approval rate baseline dan distribusi skor (PSI antar-arm) harus ≈ 0. Bila arm challenger kebetulan mendapat nasabah yang lebih berisiko (sangat mungkin pada n kecil — di R1 hanya 120 nasabah), bad rate yang lebih tinggi adalah artefak pembagian, bukan bukti model buruk. Canary yang tidak memeriksa balance adalah canary yang membaca noise sebagai sinyal.",
        "EMPAT — stopping rule yang tidak mengubah ambang setelah melihat hasil. Ambang LANJUT/TAHAN/STOP (bad rate 8%/10%, PSI 0,10/0,25, dua TAHAN berturut-turut) DITULIS dan DITANDATANGANI sebelum ramp dibuka — pre-registrasi. Mengubahnya sesudah melihat hasil («bad rate 9,15%… mari kita katakan ambangnya 9,5%») adalah menggeser tiang gawang sesudah bola ditendang — dan itu dilarang. Begitu pula minimum sampel (n_approved ≥ 100 untuk STOP): ia ditulis dulu, bukan ditemukan sesudah R1 terlihat terlalu kecil. Keputusan LANJUT/TAHAN/STOP di tiap ramp ditulis dan ditandatangani SEBELUM ramp berikutnya dibuka (langkah 4) — canary yang keputusannya dibuat sesudah melihat angka adalah canary yang tidak punya gate.",
        "Nilai: desain eksperimen bagus karena ia membuat canary menjadi BUKTI, bukan ANEKDOT: «challenger kalah di 5%» adalah klaim yang bisa diaudit — n-nya berapa, assignment-nya bagaimana, cohort-nya sebanding atau tidak, ambangnya ditulis kapan. Buruk bila canary dijalankan sebagai «naik pelan-pelan saja»: tanpa assignment yang stabil dan tanpa ambang yang ditulis dulu, «challenger kalah di 5%» bisa berarti apa saja — termasuk «challenger kebetulan mendapat nasabah yang lebih berisiko».",
        "Mitigasi: sebelum membuka ramp, tulis empat baris: (1) n, n_approved, n_default yang akan dilaporkan; (2) rumus assignment (hash + garam) dan buktinya stabil; (3) balance table yang akan diperiksa sebelum bad rate dibaca; (4) ambang + minimum sampel, ditandatangani. Bila satu baris tidak bisa ditulis, ramp belum siap dibuka.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Traffic assignment canary: 12.000 aplikasi dibagi hash menjadi champion 99 persen dan challenger 1 persen; challenger 120 nasabah, disetujui 26, default 2 — sampel efektif 26 bukan 120">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Traffic assignment — 1% traffic ≠ sampel 120</text>
<rect x="140" y="28" width="200" height="30" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="240" y="47" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">12.000 aplikasi / periode [simulasi]</text>
<text x="240" y="74" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">hash(customer_id + garam) % 100 — stabil per nasabah</text>
<line x1="125" y1="80" x2="125" y2="94" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="355" y1="80" x2="355" y2="94" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="30" y="94" width="190" height="34" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="125" y="109" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Champion 99% — 11.880</text>
<text x="125" y="122" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">tetap berjalan normal</text>
<rect x="260" y="94" width="190" height="34" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="355" y="109" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Challenger 1% — 120</text>
<text x="355" y="122" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">traffic eksperimen</text>
<line x1="355" y1="128" x2="355" y2="148" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="260" y="148" width="190" height="34" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="355" y="163" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Disetujui challenger: 26</text>
<text x="355" y="176" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">penyebut bad rate</text>
<line x1="355" y1="182" x2="355" y2="196" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="260" y="196" width="190" height="30" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="355" y="215" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Default: 2 → bad rate 7,69%</text>
<text x="125" y="158" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Sampel efektif = 26</text>
<text x="125" y="174" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">bukan 120 — dan bukan 12.000</text>
<text x="125" y="190" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1 default lagi → 11,54%</text>
<text x="125" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">STOP butuh n_approved ≥ 100</text>
</svg>`,
        alt: "Traffic assignment canary: 12.000 aplikasi dibagi hash menjadi champion 99 persen dan challenger 1 persen; challenger 120 nasabah, disetujui 26, default 2 — sampel efektif 26 bukan 120; satu default lagi menjadi 11,54 persen.",
        caption: "Cara membaca: 12.000 aplikasi dibagi hash(customer_id + garam) — stabil per nasabah — menjadi champion 99% (11.880) dan challenger 1% (120). Tapi bad rate challenger dihitung atas yang DISETUJUI: 26 nasabah, 2 default → 7,69%. Sampel efektifnya 26, bukan 120: satu default lagi saja sudah mengubahnya menjadi 11,54%. Karena itu STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini] — di R1, STOP bahkan tidak eligible.",
      },
      tasks: [],
    },
    {
      id: "champion-challenger",
      eyebrow: "Langkah 5 · Champion-challenger",
      title: "Champion vs challenger — kalah di laba, kalah di sel, dan keputusannya memang berbeda",
      prose: [
        "Champion-challenger adalah uji tandingnya: challenger harus mengalahkan champion — model yang sedang live — pada data yang sama, threshold yang sama, dan metrik yang sama. Bukan melawan test lamanya, bukan melawan metrik yang ia pilih sendiri. Di lesson ini, tandanya adalah test 6.000, threshold 0,10, dan metrik keputusan (approval, bad rate, profit) — bukan ROC-AUC semata.",
        "Nilai [notebook] — champion GBM terkalibrasi (Platt): ROC-AUC 0,7816, PR-AUC 0,5558, Brier 0,1345, approval 28,50% (n = 1.710), bad rate 6,67%, profit +NT$8.214.000, cost NT$33.046.500. Challenger LR proba MENTAH: ROC-AUC 0,7426, PR-AUC 0,5049, Brier 0,1427, approval 20,25% (n = 1.215), bad rate 9,14%, profit +NT$1.823.000, cost NT$39.437.500. Selisihnya: approval −8,25 poin persen, bad rate +2,47 poin persen, profit −NT$6.391.000, cost +NT$6.391.000. Challenger menyetujui lebih SEDIKIT nasabah DAN lebih BURUK — bukan trade-off (lebih sedikit tapi lebih aman), melainkan kalah di kedua arah sekaligus. Bandingkan dengan threshold 0,10 champion yang memang cost-optimal [M6.4]: cost NT$33.046.500 vs threshold 0,50 yang cost-nya NT$60.254.956, approve-all NT$82.155.456 (realised loss seluruh test [m8_approve_all_realised_loss] — BUKAN expected loss NT$78.675.378 di M8.2), reject-all NT$41.260.500 — champion tidak hanya menang melawan challenger; ia menang pada operating point yang sudah dioptimasi dari biaya.",
        "McNemar menguji satu pertanyaan yang berbeda dari «siapa lebih baik»: apakah KEPUTUSAN kedua model berbeda lebih dari yang bisa dijelaskan kebetulan? Uji ini memakai pasangan discordant: b = 830 (champion setuju, challenger tolak) dan c = 335 (challenger setuju, champion tolak). χ² dengan koreksi kontinuitas = (|830 − 335| − 1)² / (830 + 335) = 209,473, p < 0,0001. Keputusan kedua model BERBEDA secara signifikan — bukan «LR sedikit lebih buruk», melainkan «kedua model ini mengambil keputusan yang secara sistematis berbeda». McNemar TIDAK mengatakan siapa yang lebih baik — yang mengatakan siapa lebih baik adalah profit dan bad rate di atas. Dua alat, dua pertanyaan: McNemar untuk «apakah berbeda?», profit untuk «mana yang lebih baik?». Dan satu peringatan penulisan: nilai p di sini dibulatkan 4 desimal menjadi 0,0000 — tulis p < 0,0001, JANGAN tulis «p = 0». Nilai p tidak pernah nol; yang nol adalah pembulatannya.",
        "Baik atau buruk: hasil ini «buruk» untuk challenger — ia kalah di semua metrik keputusan — tapi «baik» sebagai proses: champion-challenger menangkap kekalahan itu di test, bukan di live. Dan satu kejujuran yang wajib ditulis: selisih profit ini SEBAGIAN artefak kalibrasi, bukan murni skill ranking. LR dinilai pada proba MENTAH-nya pada threshold 0,10 yang sama — 0,10 LR bukan 0,10 champion (LR tidak terkalibrasi; Brier 0,1427 vs 0,1345). Protokol yang benar: kalibrasi challenger DULU, baru bandingkan pada threshold yang sama. Bukti bahwa artefaknya hanya sebagian: bila LR dikalibrasi Platt [M6.4], ambang 0,10-nya menyetujui 1.166 nasabah [m8_lr_calibrated_thr010] — tetap jauh dari 1.710 champion; dan ekonominya tetap kalah jauh: LR terkalibrasi profit +NT$1.886.500 (bad rate 9,09%) vs champion +NT$8.214.000 (bad rate 6,67%) — kalibrasi hanya menambah NT$63.500 di atas LR mentah (+NT$1.823.000), masih NT$6.327.500 di bawah champion. Jadi kalibrasi bukan penjelasan utama kekalahan ini; ranking LR memang lebih lemah (ROC-AUC 0,7426 vs 0,7816). Ranking invarian ≠ approval invarian: kalibrasi adalah transformasi monoton atas skor yang sama — ranking-nya tidak berubah — tapi ambang 0,10-nya berubah arti, sehingga dua model dengan ranking yang mirip tetap bisa menyetujui nasabah yang sangat berbeda pada threshold angka yang sama. Kata «mentah» di lesson ini HANYA dipakai untuk model yang tidak terkalibrasi — jangan pernah menyebut probabilitas terkalibrasi sebagai «mentah».",
        "Mitigasi: sebelum challenger boleh masuk canary, ia harus (1) terkalibrasi dengan metode yang sama seperti champion (Platt/sigmoid, cv=3) bila ia akan dinilai pada threshold probabilitas; (2) dibandingkan pada threshold yang sama DAN pada metrik keputusan (profit, bad rate), bukan hanya ROC-AUC; (3) diuji McNemar atas keputusannya — bila keputusannya tidak berbeda signifikan dari champion, switch-mu hampir tidak ada gunanya; bila berbeda signifikan seperti di sini (p < 0,0001), baca sel shadow-nya sebelum melangkah.",
      ],
      formula: String.raw`\chi^2 = \frac{(|b - c| - 1)^2}{b + c} = \frac{(|830 - 335| - 1)^2}{830 + 335} = 209{,}473, \qquad p < 0{,}0001`,
      formulaNote: "Uji McNemar dengan koreksi kontinuitas Yates atas keputusan (bukan atas kebenaran prediksi): b = champion setuju & challenger tolak (830), c = challenger setuju & champion tolak (335). Menguji apakah keputusan kedua model berbeda lebih dari kebetulan — bukan siapa yang lebih baik.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Champion vs challenger: approval 28,50 persen vs 20,25 persen; bad rate 6,67 persen vs 9,14 persen; profit 8,214 juta vs 1,823 juta NT dollar">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Champion vs challenger — threshold 0,10, test 6.000 [notebook]</text>
<rect x="150" y="30" width="10" height="10" fill="var(--c1)"/>
<text x="164" y="39" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Champion (GBM terkalibrasi)</text>
<rect x="310" y="30" width="10" height="10" fill="var(--c2)"/>
<text x="324" y="39" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Challenger (LR mentah)</text>
<line x1="20" y1="200" x2="466" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="55" y="70" width="34" height="130" fill="var(--c1)"/>
<rect x="100" y="107.6" width="34" height="92.4" fill="var(--c2)"/>
<text x="72" y="64" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">28,50%</text>
<text x="117" y="101.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">20,25%</text>
<text x="95" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Approval rate</text>
<rect x="205" y="105.1" width="34" height="94.9" fill="var(--c1)"/>
<rect x="250" y="70" width="34" height="130" fill="var(--c2)"/>
<text x="222" y="99.1" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">6,67%</text>
<text x="267" y="64" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">9,14%</text>
<text x="245" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Bad rate (disetujui)</text>
<rect x="355" y="70" width="34" height="130" fill="var(--c1)"/>
<rect x="400" y="171.1" width="34" height="28.9" fill="var(--c2)"/>
<text x="372" y="64" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">8,214</text>
<text x="417" y="165.1" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1,823</text>
<text x="395" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Profit (NT$ juta)</text>
<text x="240" y="236" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Challenger menyetujui lebih sedikit DAN lebih buruk — kalah dua arah; selisih profit −NT$6.391.000.</text>
</svg>`,
        alt: "Champion vs challenger: approval 28,50 persen vs 20,25 persen; bad rate 6,67 persen vs 9,14 persen; profit 8,214 juta vs 1,823 juta NT dollar.",
        caption: "Cara membaca: tiga panel, masing-masing diskalakan sendiri — approval rate (champion 28,50% vs challenger 20,25%), bad rate atas yang disetujui (6,67% vs 9,14%), profit terealisasi (NT$8.214.000 vs NT$1.823.000). Challenger kalah di ketiga panel: lebih sedikit disetujui, lebih banyak yang gagal bayar, dan laba jauh lebih rendah. Selisih profit −NT$6.391.000 sebagian artefak kalibrasi (LR dinilai mentah) — lihat teks langkah 5.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: McNemar p < 0,0001 berarti «challenger lebih buruk»",
        type: "pitfall",
        body: "Yang benar: McNemar hanya menguji apakah KEPUTUSAN kedua model berbeda lebih dari kebetulan (b = 830 vs c = 335 — asimetrinya besar). Siapa yang LEBIH BAIK dibuktikan oleh metrik keputusan: profit +NT$8.214.000 vs +NT$1.823.000 dan bad rate 6,67% vs 9,14%. Jangan pernah menulis «McNemar membuktikan champion lebih baik» — McNemar membuktikan keputusannya berbeda; profitlah yang membuktikan champion lebih baik. (Di M6.5, McNemar yang sama dipakai untuk membandingkan kebenaran prediksi LR vs GBM pada threshold 0,50 — di sini ia dipakai atas KEPUTUSAN pada threshold 0,10; angka M6.5 tidak dipakai di lesson ini karena threshold-nya berbeda.)",
      },
    },
    {
      id: "kriteria-naik",
      eyebrow: "Langkah 6 · Kriteria naik",
      title: "Kriteria naik — tujuh gate kuantitatif sebelum 100%",
      prose: [
        "«Naik produksi» bukan perasaan — ia tujuh gate kuantitatif yang semuanya harus lolos, ditulis DULU sebelum canary dimulai [kebijakan lesson ini]. Challenger naik ke 100% HANYA bila lolos ketujuh gate pada ramp 25% dengan cohort yang matang. Satu gate gagal = tidak naik. Tidak ada «tapi ROC-AUC-nya hampir sama» — gate tidak mengenal hampir.",
        "Nilai — tujuh gate [kebijakan lesson ini]: G1 PROFIT — profit per nasabah challenger ≥ champion pada traffic yang sama (ramp 25%, cohort matang). G2 BAD RATE — bad rate challenger ≤ 7,67% (champion 6,67% + toleransi 1 poin persen). G3 KALIBRASI — challenger WAJIB terkalibrasi sebelum dinilai; ECE ≤ 0,02 pada proba yang dipakai memutuskan; 0,10 mentah tidak boleh dibandingkan dengan 0,10 terkalibrasi. G4 DISAGREEMENT — laporkan disagreement rate; bila di atas 25%, investigasi sel shadow sebelum naik. Kriteria isi sel shadow (langkah 5): gate GAGAL ISI bila bad rate sel challenger-only approvals melebihi bad rate champion, atau bila mayoritas sel challenger-only rejections adalah nasabah baik. Di sini 19,42% — di bawah ambang, tapi selnya buruk (335 approvals bad rate 18,21% > 6,67%; 830 rejections 92,29% baik), jadi gate ini lolos angka dan gagal isi. G5 MONITORING — tidak ada alert KRITIS M7.5 [M7.5] pada ramp mana pun (PSI skor > 0,25; bad rate > 10% dua periode; ROC-AUC turun > 0,02 dua periode; PR-AUC turun > 0,03 dua periode). ECE di atas 0,02 adalah WASPADA, bukan pemicu KRITIS (langkah 8). G6 FAIRNESS — AIR per grup tidak di bawah 0,80 [M7.1]. G7 DUA PERIODE — semua gate lolos dalam 2 periode berturut-turut (aturan M7.5 [M7.5]: satu periode bagus adalah noise).",
        "Terapkan pada LR — vonis per gate [notebook]: G1 GAGAL (profit +NT$1.823.000 vs +NT$8.214.000 — selisih −NT$6.391.000). G2 GAGAL (bad rate 9,14% > 7,67%). G3 GAGAL (LR dinilai mentah — Brier 0,1427 vs 0,1345 — belum pernah dikalibrasi sebelum dibandingkan). G4 GAGAL ISI (disagreement 19,42% di bawah 25%, tapi sel shadow-nya buruk di kedua arah menurut kriteria langkah 5: sel approvals challenger-only bad rate 18,21% > bad rate champion 6,67%, dan sel rejections challenger-only 92,29% nasabah baik — mayoritas yang ditolak justru nasabah baik). G5/G6 BELUM DIUJI (tidak ada data live — canary berhenti di 5% [simulasi] sebelum ramp 25%). G7 GAGAL (tidak ada dua periode lolos). Challenger ini gagal 5 gate (G1, G2, G3, G4, G7), 2 belum diuji, 0 lolos. Itu bukan «hampir naik» — itu tidak naik.",
        "Baik atau buruk: tujuh gate ini bagus karena mereka memaksa jawaban «ya/tidak» atas angka — tidak ada ruang untuk «modelnya menjanjikan» atau «timnya sudah bekerja keras». Buruk bila gate-nya ditulis SESUDAH melihat angka: gate yang dipilih karena challenger kebetulan lolos bukanlah gate — itu pembenaran. Tulis gate sebelum canary; bila challenger gagal, gate-nya tidak diubah — challenger-nya yang diperbaiki atau dibuang.",
        "Mitigasi: simpan lembar gate ini bersama model card (M8): satu baris per gate, angka challenger vs ambang, lolos/gagal, tanggal, dan penyetuju. Bila satu gate gagal, tulis juga TINDAK LANJUTNYA (kalibrasi ulang? latih ulang? buang?) — bukan sekadar «gagal». Lembar gate yang tidak pernah menunjukkan kegagalan adalah lembar gate yang tidak pernah dipakai.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: satu gate yang lolos dipakai untuk menutupi enam yang gagal",
        type: "risk",
        body: "Yang benar: tujuh gate adalah konjungsi (DAN), bukan disjungsi (ATAU). Challenger yang lolos G4 (disagreement 19,42% di bawah 25%) tapi gagal G1, G2, G3 tetap TIDAK NAIK. Bila seseorang membawakanmu satu gate yang lolos sebagai alasan naik, minta enam lainnya — dan tolak bila satu pun gagal.",
      },
    },
    {
      id: "decision-matrix",
      eyebrow: "Langkah 6a · Setelah tujuh gate",
      title: "Decision matrix: superiority, non-inferiority, equivalence, atau reject — dan apa yang tidak bisa ditukar",
      prose: [
        "Tujuh gate (langkah 6) memberimu tujuh jawaban ya/tidak — tapi keputusan akhir bukan «lolos semua gate = naik». DECISION MATRIX adalah cara membaca ketujuh jawaban itu menjadi satu dari empat keputusan. SUPERIORITY: challenger menang di SEMUA gate dengan margin — naik, tanpa ragu. NON-INFERIORITY: challenger tidak lebih buruk dari champion dalam margin yang ditulis dulu — naik HANYA bila ada manfaat lain yang nyata: lebih sederhana, lebih cepat, lebih mudah dijelaskan, atau lebih murah. EQUIVALENCE: challenger ≈ champion dalam margin di semua sumbu — naik hanya bila ada manfaat operasional yang jelas; bila tidak ada, tetap champion (mengganti model yang sama baiknya adalah risiko tanpa imbalan). REJECT: challenger gagal satu hard gate — stop/rollback, tidak peduli seberapa bagus ia di sumbu lain. Margin non-inferiority [kebijakan lesson ini]: ROC-AUC 0,01; profit NT$500.000; bad rate 1,00 poin persen — ditulis dulu, bukan dinegosiasikan sesudah melihat selisihnya.",
        "Challenger LR di matriks ini: ROC-AUC 0,7426 vs 0,7816 — selisih −0,039, hampir EMPAT KALI margin 0,01. Profit +NT$1.823.000 vs +NT$8.214.000 — selisih −NT$6.391.000, hampir TIGA BELAS KALI margin NT$500.000. Bad rate 9,14% vs 6,67% — selisih +2,47 poin persen, lebih dari DUA KALI margin 1,00. LR gagal superiority (kalah di semua sumbu), gagal non-inferiority (jauh di luar margin di tiga sumbu sekaligus), dan gagal equivalence — keputusannya REJECT, dan matriks itu konsisten dengan mini-case: TIDAK NAIK. Yang penting bukan hanya vonisnya — melainkan bahwa vonis itu BISA DIAUDIT: tiga selisih, tiga margin, tiga perbandingan — siapa pun yang membaca matriks ini bisa memeriksa sendiri mengapa LR ditolak, tanpa perlu percaya pada perasaan siapa pun.",
        "HARD CONSTRAINTS — sumbu yang tidak bisa ditukar. Fairness: AIR SEX tidak boleh jatuh di bawah 0,80 [kebijakan M7.5] — challenger yang menaikkan profit tapi menurunkan AIR di bawah 0,80 adalah REJECT, berapa pun profitnya. Kalibrasi: ECE tidak boleh melewati 0,02 [kebijakan lesson ini] — kalibrasi yang rusak tidak bisa ditukar dengan ROC-AUC yang lebih tinggi. Hard constraint berbeda dari margin: margin adalah «seberapa jauh lebih buruk yang masih diterima»; hard constraint adalah «garis yang tidak boleh dilewati, apa pun imbalannya». Challenger yang lolos semua margin tapi melanggar satu hard constraint tetap REJECT — dan keputusan itu tidak perlu dihitung dua kali.",
        "TRADE-OFF yang dieskalasikan ke komite: bila challenger lebih baik di satu sumbu dan lebih buruk di sumbu lain DALAM margin — misal ROC-AUC −0,005 (dalam margin 0,01) tapi jauh lebih sederhana dan lebih cepat — keputusannya BUKAN milik deployer sendirian: ia dieskalasikan ke komite (M8.5), yang menimbang manfaat operasional terhadap risiko yang tersisa. Yang tidak pernah dieskalasikan adalah pelanggaran hard constraint: itu REJECT, bukan bahan diskusi. Dan yang tidak pernah dilakukan adalah mengubah margin sesudah melihat selisih — margin yang diubah sesudah melihat hasil adalah matriks yang tidak punya arti.",
        "Nilai: matriks bagus karena ia memisahkan tiga pertanyaan yang sering dicampur: «apakah challenger lebih baik?» (superiority), «apakah challenger cukup baik?» (non-inferiority/equivalence), dan «apakah challenger melanggar garis yang tidak boleh dilewati?» (hard constraint). Buruk bila matriks dipakai sebagai alasan sesudah keputusan dibuat («kita sudah memutuskan naik, mari isi matriksnya») — matriks yang diisi sesudah keputusan adalah stempel, bukan alat.",
        "Mitigasi: sebelum membaca matriks, tulis dulu tiga margin dan dua hard constraint di atas kertas — lalu isi selisihnya dari angka, bukan dari ingatan. Bila satu selisih berada dalam 10% dari marginnya, tandai sebagai «dekat ambang» dan bawa ke komite — selisih yang dekat ambang adalah selisih yang paling rentan terhadap noise sampling (M8.1).",
      ],
      tasks: [],
    },
    {
      id: "monitoring-gates",
      eyebrow: "Langkah 7 · Monitoring gates",
      title: "Monitoring gates — metrik go/no-go di tiap ramp (tanpa mengajar ulang M7.5)",
      prose: [
        "Lesson ini tidak mengajar ulang monitoring — ia MEMAKAI monitoring M7.5 sebagai gate [M7.5]. Di tiap ramp canary, dashboard yang sama dibaca (PSI skor, ROC-AUC/PR-AUC, approval rate, bad rate, skor rata-rata, ECE) dengan ambang yang sama — tetapi baseline PER MODEL: champion [M6.4/M7.4] ROC-AUC 0,7816, PR-AUC 0,5558, approval 28,5%, bad rate 6,67%; challenger (LR mentah) ROC-AUC 0,7426, PR-AUC 0,5049, approval 20,25%, bad rate 9,14%. Setiap metrik dibaca terhadap baseline modelnya sendiri — dan SELISIH champion−challenger (gap ROC-AUC 0,0390, gap bad rate 2,47 pp, gap approval 8,25 pp, gap profit NT$6.391.000) adalah metrik tersendiri: gap yang melebar di live berarti challenger makin tertinggal, walau masing-masing masih di dalam ambangnya. Ambangnya: PSI skor di atas 0,1 = WASPADA, di atas 0,25 = KRITIS; ROC-AUC turun lebih dari 0,02 dari baseline modelnya (champion 0,7816; challenger 0,7426) = WASPADA, 2 periode = KRITIS; PR-AUC turun lebih dari 0,03 = WASPADA, 2 periode = KRITIS; bad rate di atas 10% = WASPADA, 2 periode = KRITIS; ECE di atas 0,02 = WASPADA (tetap WASPADA walau bertahan dua periode — ia tidak naik menjadi KRITIS; yang naik menjadi KRITIS setelah dua periode adalah ROC-AUC, PR-AUC, dan bad rate); approval bergerak lebih dari 5 poin persen dari baseline 28,5% = PANTAU (beri tahu bisnis). Yang baru di lesson ini hanyalah CARA MEMBACANYA: per ramp, dan per model — champion dan challenger dibaca berdampingan, pada traffic yang sama.",
        "Nilai — dua kolom yang tidak boleh dicampur [M7.5]: kolom TANPA LABEL (PSI skor, approval rate, distribusi skor) tersedia SEGERA begitu skor keluar — ini alarm pertamamu di tiap ramp, dan satu-satunya yang boleh dipakai untuk keputusan LANJUT/TAHAN di hari-hari pertama ramp. Kolom BERLABEL (bad rate, ROC-AUC, PR-AUC, ECE, fairness) hanya untuk COHORT MATANG — label default baru tersedia setelah jendela observasi 1 bulan lewat. Ramp 1% yang dibuka hari ini tidak punya bad rate yang jujur minggu ini; yang ia punya adalah PSI dan approval. Keputusan menaikkan ramp berdasarkan bad rate yang labelnya belum matang adalah keputusan atas angka yang belum jujur — dan lesson M7.5 sudah menjelaskan mengapa angka itu bias (default cenderung ketahuan lebih dulu).",
        "Baik atau buruk: membaca champion dan challenger berdampingan itu bagus karena ia mengontrol populasi: bila PSI skor challenger 0,06 sementara PSI skor champion pada traffic yang sama 0,02, selisihnya adalah milik challenger — bukan milik dunia. Buruk bila satu dashboard dipakai untuk dua model tanpa label modelnya: angka «approval 20,25%» tanpa keterangan «challenger» vs «champion 28,50%» adalah angka yang menunggu untuk disalahbaca. Dan buruk bila metrik per ramp dibaca tanpa n: bad rate 7,69% pada 26 nasabah disetujui (ramp 1% [simulasi]) dan bad rate 9,15% pada 612 nasabah disetujui (ramp 5% diperpanjang [simulasi]) adalah dua angka dengan bobot bukti yang sangat berbeda — yang pertama rumor, yang kedua bukti.",
        "Mitigasi: dashboard canary punya LIMA baris per ramp per model — (1) PSI skor vs train; (2) ROC-AUC/PR-AUC vs baseline PER MODEL — champion 0,7816/0,5558, challenger 0,7426/0,5049 (cohort matang saja); (3) approval + bad rate vs baseline PER MODEL — champion 28,5%/6,67%, challenger 20,25%/9,14% (bad rate cohort matang saja); (4) skor rata-rata (mean calibrated proba [notebook]) + ECE vs 0,2217/0,0087; (5) PSI 5 fitur kunci mingguan — ditambah SATU baris yang tidak ada di M7.5: disagreement rate challenger-vs-champion pada traffic ramp itu. Dibaca SETIAP PAGI oleh analis selama canary berjalan, MINGGUAN oleh risk manager. Ramp yang tidak dibaca tiap pagi adalah ramp yang tidak digate.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: PSI challenger dibaca tanpa pembanding champion",
        type: "risk",
        body: "Yang benar: PSI skor challenger 0,06 pada ramp 5% [simulasi] hanya berarti bila dibandingkan dengan PSI skor champion pada traffic yang sama di periode yang sama. Bila populasi bergeser (misal program restrukturisasi), PSI kedua model naik bersamaan — dan yang naik bersamaan itu adalah drift populasi [M7.5], bukan kesalahan challenger. Selalu baca berdampingan; jangan pernah menghukum challenger atas cuaca.",
      },
    },
    {
      id: "rollback",
      eyebrow: "Langkah 8 · Rollback",
      title: "Rollback — kembali ke champion sebelum kerugian membesar",
      prose: [
        "Rollback adalah kemampuan untuk kembali ke champion — lengkap, cepat, dan tanpa perdebatan — saat challenger terbukti merugikan. Rollback yang baik punya tiga sifat: CEPAT (menit, bukan minggu), LENGKAP (routing, threshold, DAN konfigurasi kembali ke versi champion), dan TANPA IZIN TAMBAHAN (orang yang bertugas sudah diberi wewenang SEBELUM insiden, bukan diminta saat insiden). Rollback yang butuh rapat persetujuan di tengah kerugian bukan rollback — itu antrean.",
        "Nilai — kriteria rollback [kebijakan lesson ini]: rollback SEGERA (tanpa menunggu 2 periode) bila SATU dari ini terjadi — bad rate challenger di atas 12% pada cohort matang; PSI skor challenger di atas 0,25 (geser besar [M7.5]); approval rate challenger anjlok lebih dari 10 poin persen dari ekspektasinya dalam satu periode; atau insiden operasional (skor tidak keluar, fitur hilang, pipeline error). Rollback TERENCANA bila challenger gagal gate (langkah 6) dalam 2 periode berturut-turut, atau STOP dua kali di canary. Prosedurnya lima langkah, berurutan: (1) BEKUKAN ramp — traffic challenger ke 0% SEKARANG; (2) KEMBALIKAN routing 100% ke champion DENGAN threshold 0,10 tunggal (v1) — ini rollback version dari template tata kelola M7.4 [M7.4]: bila deployment memakai threshold per grup (0,1058/0,0965 [M7.4]), rollback mengembalikan threshold TUNGGAL 0,10, bukan threshold per grup yang terakhir; (3) BEKUKAN challenger di shadow — ia boleh memutuskan lagi, tapi tidak bertindak, sampai tinjauan selesai; (4) CATAT insiden — tanggal, metrik pemicu, nomor gate yang gagal, siapa yang menekan tombol; (5) TINJAU sebelum challenger boleh masuk shadow lagi — tidak ada «coba lagi besok» tanpa tinjauan.",
        "Baik atau buruk: rollback SEGERA pada ambang keras (bad rate > 12%, PSI > 0,25) bagus karena ia memotong kerugian sebelum dua periode mengonfirmasinya — konfirmasi dua periode adalah kemewahan yang tidak kamu punya saat kerugian berjalan. Buruk bila ambang rollback terlalu longgar sehingga rollback tidak pernah terjadi: challenger yang merugikan pelan-pelan (bad rate 9,15% terus-menerus [simulasi]) tidak pernah menyentuh 12% — dan justru itulah gunanya rollback TERENCANA atas dua periode gagal gate. Kedua jenis rollback dibutuhkan: yang satu memotong bencana, yang satu menghentikan pendarahan pelan.",
        "Mitigasi: LATIH rollback sebelum kamu membutuhkannya — seperti latihan kebakaran. Sekali per kuartal, tim melakukan rollback drill: dari challenger 25% kembali ke champion 100% + threshold 0,10 tunggal, ukur waktunya (target [kebijakan lesson ini]: di bawah 30 menit dari keputusan ke traffic kembali), dan catat apa yang macet. Rollback yang belum pernah dilatih adalah harapan, bukan kemampuan. Dan satu catatan yang sering dilupakan: rollback mengembalikan MODEL dan THRESHOLD — bukan data. Nasabah yang sudah dirugikan challenger tidak «di-rollback»; kerugiannya dicatat sebagai biaya deployment, bukan dihapus dari laporan.",
      ],
      tasks: [],
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 9 · Jebakan",
      title: "Jebakan — challenger menang di test tapi kalah di live",
      prose: [
        "Ada enam cara challenger yang «menang di test» kalah di live — dan lesson ini sudah menunjukkan tiga di antaranya pada LR. Pertama, SELECTION (winner's curse [M6.5]): challenger dipilih justru karena ia menang pada satu split, satu metrik, satu threshold yang kebetulan menguntungkannya. Kemenangan yang dipilih dari banyak percobaan hampir selalu melebih-lebihkan keunggulan sebenarnya — itulah mengapa M6.5 memakai protokol fair (nested CV, McNemar atas kebenaran prediksi pada threshold 0,50) sebelum menyatakan pemenang. Di lesson ini, McNemar dipakai atas KEPUTUSAN pada threshold 0,10 — uji yang berbeda, threshold yang berbeda; jangan campur angka keduanya.",
        "Kedua, KALIBRASI: threshold 0,10 yang diturunkan dari probabilitas terkalibrasi kehilangan maknanya bila probabilitasnya tidak terkalibrasi — atau bila kalibrasi bergeser di live (ECE 0,0087 di test bisa menjadi 0,1003 seperti simulasi S2 M7.5 [m75_drift_simulations.S2_pay_plus1.ece_10bin]). Challenger yang dinilai mentah, atau yang kalibrasinya rusak di live, akan menyetujui nasabah yang salah — bukan karena ranking-nya buruk, melainkan karena ambangnya berbohong. Ketiga, POPULASI: test adalah populasi kemarin; live adalah populasi hari ini. Shadow di test (disagreement 19,42%) menjawab harga switch pada data yang kita punya — shadow live bisa berbeda bila populasi bergeser. Keempat, METRIK YANG SALAH: menang di ROC-AUC tidak berarti menang di profit — ROC-AUC tidak mengenal LGD 0,45, margin 0,05, atau limit nasabah. Kelima, «SEDERHANA = AMAN»: LR mudah dijelaskan, cepat, stabil — dan tetap kalah NT$6.391.000. Kesederhanaan adalah sifat model, bukan bukti kualitas keputusannya.",
        "Nilai: tiap jebakan di atas punya penangkal yang sudah diajarkan di lesson ini — selection dilawan dengan protokol fair [M6.5] + champion-challenger di data yang sama; kalibrasi dilawan dengan gate G3 (kalibrasi dulu, ECE ≤ 0,02); populasi dilawan dengan shadow live + PSI [M7.5]; metrik yang salah dilawan dengan metrik keputusan (profit, bad rate); «sederhana = aman» dilawan dengan tujuh gate (langkah 6). Jebakan bukan nasib — ia kegagalan protokol yang namanya sudah diketahui.",
        "Keenam, PEMAKAIAN ULANG TEST (test reuse [M8.1]): test 6.000 yang sama sudah dipakai MEMILIH empat kali — threshold 0,10 [M6.4], pemenang model [M6.5], verdict validasi [M8.1], dan challenger ini [M8.4]. Setiap pemakaian memilih mengikis kejujuran test: challenger yang «menang» pada test yang sudah mengenalnya mungkin hanya menang karena test itu sudah dipakai memilih sebelumnya. Penangkalnya ditulis di M8.1 dan berlaku penuh di sini: sebelum menyatakan challenger menang, bandingkan ia pada split validasi yang SEGAR atau nested CV [M6.2], dan tulis di laporan bahwa test 6.000 sudah dipakai memilih sebelumnya. Validator yang menemukan kemenangan challenger di test yang dipakai ulang tanpa catatan menulisnya sebagai TEMUAN — sama seperti ia menulis leakage sebagai temuan.",
        "Baik atau buruk: daftar jebakan ini bagus karena ia mengubah «challenger kalah di live» dari misteri menjadi diagnosis — tiap kegagalan punya nama, bukti, dan penangkal. Buruk bila dibaca sebagai «jadi jangan pernah ganti model»: champion hari ini adalah challenger kemarin yang lolos tujuh gate. Yang dilarang bukan pergantian — melainkan pergantian tanpa bukti.",
        "Mitigasi: sebelum challenger masuk canary, jalankan CHECKLIST ANTI-JEBAKAN: (1) apakah ia menang di protokol fair, bukan satu split yang dipilih? [M6.5] (2) apakah ia terkalibrasi, dan ECE-nya diukur di data yang belum dilihat? (3) apakah shadow-nya dihitung pada test DAN direncanakan pada live? (4) apakah metrik kemenangannya metrik keputusan (profit/bad rate), bukan hanya ROC-AUC? (5) apakah ada yang mengklaim ia aman «karena sederhana» — dan bila ya, minta angka gate-nya. (6) apakah challenger ini dipilih dari test 6.000 yang sama yang sudah dipakai memilih threshold, model, dan verdict validasi? Bila ya, apakah ia sudah dibandingkan pada split yang segar atau nested CV [M6.2] — dan apakah pemakaian ulang test itu dicatat di laporan? [M8.1] Satu «tidak» = challenger belum siap canary.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case — putuskan dari angka: challenger naik atau tidak?",
      prose: [
        "Sekarang giliranmu memutuskan — dengan angka yang sama yang sudah kamu baca di lesson ini, tanpa angka baru. Fakta [notebook]: champion GBM terkalibrasi — approval 28,50%, bad rate 6,67%, profit +NT$8.214.000. Challenger LR mentah — approval 20,25%, bad rate 9,14%, profit +NT$1.823.000. Disagreement 19,42% (1.165 dari 6.000); McNemar b = 830, c = 335, χ² = 209,473, p < 0,0001. Shadow: 335 approvals challenger-only bad rate 18,21% (net −NT$4.861.000 bila bertindak); 830 rejections challenger-only good rate 92,29% (margin forgone gross NT$6.354.000). Canary [simulasi]: berhenti di 5% (TAHAN, lalu STOP). Gate naik (langkah 6): G1 profit, G2 bad rate ≤ 7,67%, G3 kalibrasi ECE ≤ 0,02, G4 disagreement, G5 monitoring, G6 fairness, G7 dua periode.",
        "Jawaban: TIDAK — challenger tidak naik. Buktinya empat lapis. Pertama, PROFIT: challenger kalah NT$6.391.000 pada 6.000 nasabah yang sama — G1 gagal, dan selisihnya bukan noise (McNemar p < 0,0001 memastikan keputusannya memang berbeda sistematis, dan arah perbedaannya merugikan — b = 830 penolakan challenger atas persetujuan champion vs c = 335 sebaliknya). Kedua, SHADOW CELLS: switch akan menyetujui 335 nasabah dengan bad rate 18,21% (net −NT$4.861.000) dan menolak 766 nasabah baik (margin forgone gross NT$6.354.000) — harga switch sudah diketahui SEBELUM dibayar, dan harganya mahal di kedua arah. Ketiga, GATE: G1 gagal, G2 gagal (9,14% > 7,67%), G3 gagal (LR mentah, belum dikalibrasi), G4 gagal isi, G7 gagal (tidak ada dua periode lolos) — 0 dari 7 gate lolos, 2 belum diuji. Keempat, CANARY [simulasi]: challenger bahkan tidak mencapai 25% — ia STOP di 5%. Model yang tidak lolos canary 5% tidak bisa naik ke 100% dengan alasan apa pun.",
        "Nilai: keputusan «TIDAK» di sini bukan penolakan terhadap LR sebagai model — melainkan penolakan terhadap LR SEBAGAI PENGGANTI champion PADA THRESHOLD 0,10 MENTAH. Tindak lanjut yang benar: (1) kalibrasi LR (Platt/sigmoid) lalu bandingkan ulang pada 0,10 — bukti [m8_lr_calibrated_thr010] menunjukkan kalibrasi saja tidak menutup kesenjangan (1.166 vs 1.710 disetujui; profit +NT$1.886.500 vs +NT$8.214.000), tapi perbandingan yang benar menuntutnya; (2) bila LR terkalibrasi tetap kalah, buang challenger ini dan cari challenger lain — atau terima champion sebagai yang terbaik saat ini; (3) simpan lembar gate + sel shadow sebagai catatan keputusan, supaya enam bulan lagi tidak ada yang mengusulkan LR yang sama tanpa membaca vonis ini.",
        "Baik atau buruk: vonis «TIDAK» ini bagus karena ia murah — ia dibayar dengan shadow dan canary 5%, bukan dengan satu bulan profit. Buruk bila vonis ini dibaca sebagai «LR tidak berguna»: LR tetap berguna sebagai baseline yang mudah dijelaskan, sebagai pembanding, dan sebagai model yang mungkin menang pada populasi atau threshold lain — yang ia tidak boleh adalah menggantikan champion di sini, sekarang, dengan bukti ini.",
        "Mitigasi: setiap kali kamu memutuskan «TIDAK» atas challenger, tulis SATU PARAGRAF vonis: angka yang menggagalkannya (di sini: profit −NT$6.391.000, bad rate 9,14%, sel shadow, canary STOP di 5%), gate yang gagal (G1, G2, G3, G4, G7), dan syarat untuk mencoba lagi (kalibrasi + bukti baru). Vonis yang ditulis adalah vonis yang tidak perlu diulang.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «challenger kalah, jadi champion sudah sempurna»",
        type: "risk",
        body: "Yang benar: «challenger kalah» hanya membuktikan champion LEBIH BAIK dari challenger ini — bukan bahwa champion sempurna. Champion tetap punya bad rate 6,67%, cost NT$33.046.500, dan AIR SEX 0,869 [M7.1]. Tugasmu berikutnya bukan merayakan champion — melainkan mencari challenger BERIKUTNYA yang mungkin mengalahkannya, dengan protokol yang sama.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: disagreement rate + McNemar dari angka kanonis",
      prose: [
        "Sekarang hitung sendiri dua angka inti champion-challenger — dari hitungan kanonis test 6.000 [notebook]: b = 830 (champion setuju, challenger tolak), c = 335 (challenger setuju, champion tolak). Disagreement rate = (b + c) / 6.000. χ² McNemar dengan koreksi kontinuitas Yates = (|b − c| − 1)² / (b + c). Signifikan bila χ² melewati nilai kritis df=1 pada p = 0,0001, yaitu 15,1367 — tanpa scipy, cukup bandingkan dengan ambang ini.",
        "Hasil yang diharapkan [lab]: n_disagree=1165; disagreement_rate=0.1942; chi2=209.4730; significant=True. Bacalah χ² itu: 209,473 adalah hampir 14 kali nilai kritis 15,1367 (13,84×) — bukan «sedikit signifikan», melainkan berbeda jauh melampaui keraguan. Dan ingat langkah 5: signifikan di sini berarti KEPUTUSANNYA berbeda — bukan berarti challenger lebih buruk. Yang membuktikan challenger lebih buruk adalah profit dan bad rate, bukan χ² ini.",
        "Setelah lab jalan, tanyakan pada dirimu: bila b = 830 dan c = 830 (simetris sempurna), berapa χ²-nya? (|830 − 830| − 1)² / 1.660 — pembilangnya 1, χ² ≈ 0,0006 — tidak signifikan. McNemar mengukur ASIMETRI pasangan discordant — bila kedua model sama-sama «menang» atas yang lain, tidak ada perbedaan sistematis.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi n_disagree dan disagreement_rate: (B + C) dan n_disagree / N_TEST" },
        { id: "t2", text: "Lengkapi chi2: (|B - C| - 1)^2 / (B + C) — koreksi kontinuitas Yates" },
        { id: "t3", text: "Lengkapi significant: True bila chi2 > CRIT_0001 (15.1367)" },
      ],
      expected: "n_disagree=1165\ndisagreement_rate=0.1942\nchi2=209.4730\nsignificant=True",
      hints: [
        "n_disagree = 830 + 335 = 1.165; disagreement_rate = 1.165 / 6.000 = 0,1942 — hampir satu dari lima nasabah.",
        "chi2 = (|830 − 335| − 1)² / (830 + 335) = 494² / 1.165 = 209,4730 — koreksi kontinuitas mengurangi selisih 495 menjadi 494 sebelum dikuadratkan.",
        "Nilai kritis df=1 pada p = 0,0001 adalah 15,1367 — chi2 209,4730 jauh di atasnya, jadi significant = True. Tulis p < 0,0001, JANGAN «p = 0».",
      ],
      code: {
        starter: `# Lab 1 — disagreement + McNemar: champion vs challenger, threshold 0,10 [notebook]
# Champion = GBM terkalibrasi (Platt); challenger = LR proba MENTAH (tidak terkalibrasi)
# Hitungan kanonis (test 6.000): b = 830, c = 335 — JANGAN ubah angka ini
N_TEST = 6000
B = 830  # champion setuju, challenger tolak
C = 335  # challenger setuju, champion tolak
CRIT_0001 = 15.1367  # nilai kritis chi-kuadrat df=1 pada p = 0,0001

n_disagree = 0  # TODO: B + C
disagreement_rate = 0.0  # TODO: n_disagree / N_TEST
chi2 = 0.0  # TODO: (|B - C| - 1)^2 / (B + C) — koreksi kontinuitas Yates
significant = None  # TODO: True bila chi2 > CRIT_0001
print(f"n_disagree={n_disagree}")
print(f"disagreement_rate={disagreement_rate:.4f}")
print(f"chi2={chi2:.4f}")
print(f"significant={significant}")`,
        lockLines: 8,
        solution: `# Lab 1 — disagreement + McNemar: champion vs challenger, threshold 0,10 [notebook]
# Champion = GBM terkalibrasi (Platt); challenger = LR proba MENTAH (tidak terkalibrasi)
# Hitungan kanonis (test 6.000): b = 830, c = 335 — JANGAN ubah angka ini
N_TEST = 6000
B = 830  # champion setuju, challenger tolak
C = 335  # challenger setuju, champion tolak
CRIT_0001 = 15.1367  # nilai kritis chi-kuadrat df=1 pada p = 0,0001

n_disagree = B + C
disagreement_rate = n_disagree / N_TEST
chi2 = (abs(B - C) - 1) ** 2 / (B + C)
significant = chi2 > CRIT_0001
print(f"n_disagree={n_disagree}")
print(f"disagreement_rate={disagreement_rate:.4f}")
print(f"chi2={chi2:.4f}")
print(f"significant={significant}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_disagree", value: 1165, tol: 0.5, label: "`n_disagree` seharusnya 1165", msg: "Pasangan discordant: b = 830 (champion setuju, challenger tolak) + c = 335 (challenger setuju, champion tolak) = 1.165." },
          { kind: "equal", task: "t1", name: "disagreement_rate", value: 0.1942, tol: 0.00005, label: "`disagreement_rate` seharusnya 0.1942", msg: "1.165 / 6.000 = 0,1942 — hampir satu dari lima nasabah menerima keputusan berbeda bila switch." },
          { kind: "equal", task: "t2", name: "chi2", value: 209.473, tol: 0.001, label: "`chi2` seharusnya 209.473", msg: "McNemar dengan koreksi kontinuitas: (494)² / 1.165 = 209,473 — hampir 14 kali (13,84×) nilai kritis 15,1367 pada p = 0,0001." },
          { kind: "stdout_matches", task: "t3", pattern: "significant=True", label: "Output menampilkan significant=True", msg: "Keputusan kedua model BERBEDA secara signifikan (p < 0,0001) — yang membuktikan challenger lebih buruk adalah profit dan bad rate, bukan chi2 ini." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: keputusan canary — lanjut, tahan, stop, atau rollback?",
      prose: [
        "Lab kedua menerapkan aturan ramp langkah 4 pada canary challenger LR [simulasi]. Aturan per ramp [kebijakan lesson ini]: LANJUT bila bad rate ≤ 0,08 DAN PSI skor ≤ 0,10; TAHAN bila bad rate ≤ 0,10 DAN PSI skor ≤ 0,10 (zona abu-abu — kumpulkan data lagi di ramp yang sama), dan TAHAN juga bila PSI skor 0,10–0,25 tanpa bad rate buruk; STOP bila bad rate > 0,10 ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut; ROLLBACK bila keputusan akhirnya STOP (traffic kembali 100% ke champion). Data per ramp [simulasi] — parameter eksplisit, bukan observasi live. Basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk (1% = 120; 5% = 600); R2-ext mengakumulasi 5 periode pada 5% sampai terkumpul 3.000 nasabah. R1 1% (n = 120, disetujui 26, default 2, PSI 0,02); R2 5% (n = 600, disetujui 123, default 11, PSI 0,05); R2-ext 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI 0,06). Aturan tambahan (langkah 4a): sampel efektif bad rate adalah yang DISETUJUI — STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]; di R1 (26 disetujui) STOP atas bad rate bahkan tidak eligible.",
        "Hasil yang diharapkan [lab]: bad_R1=0.0769; decision_R1=LANJUT; bad_R2=0.0894; decision_R2=TAHAN; bad_R2ext=0.0915; decision_R2ext=STOP; final=ROLLBACK. Bacalah baris demi baris: R1 LANJUT bukan karena challenger «bagus» — melainkan karena n = 120 terlalu kecil untuk membuktikan ia buruk (2 default dari 26). R2 TAHAN karena 8,94% masuk zona abu-abu — jangan naik, kumpulkan data lagi. R2-ext STOP karena ini TAHAN kedua berturut-turut — dua kali abu-abu adalah vonis, bukan kebetulan. Dan final ROLLBACK karena STOP berarti challenger tidak naik — traffic kembali ke champion. Sampel efektif: bad rate R1 dihitung atas 26 yang disetujui — bukan 120 traffic ramp — dan STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]: di R1 (26) kamu bahkan tidak boleh memutuskan STOP atas bad rate.",
        "Setelah lab jalan, tanyakan pada dirimu: apa yang berubah bila R2-ext bad rate-nya 0,0750 (bukan 0,0915)? decision_R2ext menjadi LANJUT (≤ 0,08, PSI 0,06) — challenger naik ke 25%. Satu ramp yang membaik mengubah segalanya — itulah mengapa TAHAN mengumpulkan data lagi, bukan langsung STOP di R2.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi bad_R1, bad_R2, bad_R2ext: default di antaranya / disetujui per ramp" },
        { id: "t2", text: "Lengkapi decision_R1, decision_R2, decision_R2ext dari decide() — perhatikan streak TAHAN" },
        { id: "t3", text: "Lengkapi final: ROLLBACK bila keputusan akhirnya STOP, kalau tidak NAIK" },
        { id: "t4", text: "Lengkapi n_effective_R1 dan stop_eligible_R1: sampel efektif = yang DISETUJUI, dan STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]" },
      ],
      expected: "bad_R1=0.0769\ndecision_R1=LANJUT\nbad_R2=0.0894\ndecision_R2=TAHAN\nbad_R2ext=0.0915\ndecision_R2ext=STOP\nfinal=ROLLBACK\nn_effective_R1=26\nstop_eligible_R1=False",
      hints: [
        "bad_R1 = 2 / 26 = 0,0769; bad_R2 = 11 / 123 = 0,0894; bad_R2ext = 56 / 612 = 0,0915 — bad rate dihitung atas yang DISETUJUI, bukan atas n ramp.",
        "R1: bad 0,0769 ≤ 0,08 dan PSI 0,02 ≤ 0,10 → LANJUT (streak TAHAN masih 0). R2: bad 0,0894 di zona 0,08–0,10 → TAHAN (streak menjadi 1).",
        "R2-ext: bad 0,0915 juga zona abu-abu, TAPI streak TAHAN sudah 1 — TAHAN kedua berturut-turut → STOP. final = ROLLBACK karena keputusan akhirnya STOP.",
        "Sampel efektif bad rate R1 = 26 yang disetujui — bukan 120 traffic ramp. STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]: 26 < 100, jadi stop_eligible_R1=False — di R1 kamu bahkan tidak BOLEH memutuskan STOP atas bad rate; yang tersedia hanya LANJUT/TAHAN.",
      ],
      code: {
        starter: `# Lab 2 — keputusan canary: lanjut / tahan / stop / rollback [simulasi]
# Ramp [kebijakan lesson ini]: 1% -> 5% -> 25% -> 100% dari traffic masuk
# Aturan per ramp [kebijakan lesson ini]:
#   LANJUT bila bad rate <= 0,08 DAN PSI skor <= 0,10
#   TAHAN bila bad rate <= 0,10 DAN PSI skor <= 0,10 (zona abu-abu: kumpulkan data lagi)
#   TAHAN juga bila PSI skor 0,10-0,25 tanpa bad rate buruk (PSI naik tanpa bukti kerugian: jangan naik)
#   STOP bila bad rate > 0,10 ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut
#   ROLLBACK bila keputusan akhirnya STOP (traffic kembali 100% ke champion)
# Data per ramp [simulasi] — parameter eksplisit, bukan observasi live:
# Basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk (1% = 120; 5% = 600); R2-ext = 5 periode @ 600 = 3.000
#   R1 1%: n=120, disetujui 26, default di antaranya 2, PSI skor 0,02
#   R2 5%: n=600, disetujui 123, default di antaranya 11, PSI skor 0,05
#   R2-ext 5% (diperpanjang): n=3000, disetujui 612, default di antaranya 56, PSI skor 0,06
RAMPS = [
    ("R1_1pct", 120, 26, 2, 0.02),
    ("R2_5pct", 600, 123, 11, 0.05),
    ("R2ext_5pct", 3000, 612, 56, 0.06),
]

def decide(bad_rate, psi, tahan_streak):
    if bad_rate > 0.10 or psi > 0.25:
        return "STOP"
    if bad_rate <= 0.08 and psi <= 0.10:
        return "LANJUT"
    if tahan_streak >= 1:
        return "STOP"  # TAHAN kedua berturut-turut: berhenti, jangan naik
    return "TAHAN"

bad_R1 = 0.0  # TODO: RAMPS[0][3] / RAMPS[0][2] — default / disetujui
decision_R1 = ""  # TODO: decide(bad_R1, RAMPS[0][4], 0) — streak TAHAN sejauh ini 0
bad_R2 = 0.0  # TODO: RAMPS[1][3] / RAMPS[1][2]
decision_R2 = ""  # TODO: decide(bad_R2, RAMPS[1][4], 0) — R1 LANJUT, jadi streak masih 0
bad_R2ext = 0.0  # TODO: RAMPS[2][3] / RAMPS[2][2]
decision_R2ext = ""  # TODO: decide(bad_R2ext, RAMPS[2][4], 1) — R2 TAHAN, jadi streak 1
final = ""  # TODO: "ROLLBACK" bila decision_R2ext == "STOP", kalau tidak "NAIK"
n_effective_R1 = 0  # TODO: RAMPS[0][2] — sampel efektif bad rate = yang disetujui, bukan n ramp
stop_eligible_R1 = False  # TODO: True bila n_effective_R1 >= 100 [kebijakan lesson ini] — STOP atas bad rate butuh sampel cukup
print(f"bad_R1={bad_R1:.4f}")
print(f"decision_R1={decision_R1}")
print(f"bad_R2={bad_R2:.4f}")
print(f"decision_R2={decision_R2}")
print(f"bad_R2ext={bad_R2ext:.4f}")
print(f"decision_R2ext={decision_R2ext}")
print(f"final={final}")
print(f"n_effective_R1={n_effective_R1}")
print(f"stop_eligible_R1={stop_eligible_R1}")`,
        lockLines: 26,
        solution: `# Lab 2 — keputusan canary: lanjut / tahan / stop / rollback [simulasi]
# Ramp [kebijakan lesson ini]: 1% -> 5% -> 25% -> 100% dari traffic masuk
# Aturan per ramp [kebijakan lesson ini]:
#   LANJUT bila bad rate <= 0,08 DAN PSI skor <= 0,10
#   TAHAN bila bad rate <= 0,10 DAN PSI skor <= 0,10 (zona abu-abu: kumpulkan data lagi)
#   TAHAN juga bila PSI skor 0,10-0,25 tanpa bad rate buruk (PSI naik tanpa bukti kerugian: jangan naik)
#   STOP bila bad rate > 0,10 ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut
#   ROLLBACK bila keputusan akhirnya STOP (traffic kembali 100% ke champion)
# Data per ramp [simulasi] — parameter eksplisit, bukan observasi live:
# Basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk (1% = 120; 5% = 600); R2-ext = 5 periode @ 600 = 3.000
#   R1 1%: n=120, disetujui 26, default di antaranya 2, PSI skor 0,02
#   R2 5%: n=600, disetujui 123, default di antaranya 11, PSI skor 0,05
#   R2-ext 5% (diperpanjang): n=3000, disetujui 612, default di antaranya 56, PSI skor 0,06
RAMPS = [
    ("R1_1pct", 120, 26, 2, 0.02),
    ("R2_5pct", 600, 123, 11, 0.05),
    ("R2ext_5pct", 3000, 612, 56, 0.06),
]

def decide(bad_rate, psi, tahan_streak):
    if bad_rate > 0.10 or psi > 0.25:
        return "STOP"
    if bad_rate <= 0.08 and psi <= 0.10:
        return "LANJUT"
    if tahan_streak >= 1:
        return "STOP"  # TAHAN kedua berturut-turut: berhenti, jangan naik
    return "TAHAN"

bad_R1 = RAMPS[0][3] / RAMPS[0][2]
decision_R1 = decide(bad_R1, RAMPS[0][4], 0)
bad_R2 = RAMPS[1][3] / RAMPS[1][2]
decision_R2 = decide(bad_R2, RAMPS[1][4], 0)
bad_R2ext = RAMPS[2][3] / RAMPS[2][2]
decision_R2ext = decide(bad_R2ext, RAMPS[2][4], 1)
final = "ROLLBACK" if decision_R2ext == "STOP" else "NAIK"
n_effective_R1 = RAMPS[0][2]
stop_eligible_R1 = n_effective_R1 >= 100
print(f"bad_R1={bad_R1:.4f}")
print(f"decision_R1={decision_R1}")
print(f"bad_R2={bad_R2:.4f}")
print(f"decision_R2={decision_R2}")
print(f"bad_R2ext={bad_R2ext:.4f}")
print(f"decision_R2ext={decision_R2ext}")
print(f"final={final}")
print(f"n_effective_R1={n_effective_R1}")
print(f"stop_eligible_R1={stop_eligible_R1}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bad_R1", value: 0.0769, tol: 0.00005, label: "`bad_R1` seharusnya 0.0769", msg: "Ramp 1% [simulasi]: 2 default dari 26 disetujui = 0,0769 — di bawah 0,08, jadi LANJUT. Tapi ingat: n kecil (26 disetujui) — LANJUT di sini berarti «belum terbukti buruk», bukan «terbukti bagus»." },
          { kind: "equal", task: "t1", name: "bad_R2", value: 0.0894, tol: 0.00005, label: "`bad_R2` seharusnya 0.0894", msg: "Ramp 5% [simulasi]: 11 default dari 123 disetujui = 0,0894 — zona abu-abu 0,08–0,10, jadi TAHAN: jangan naik, kumpulkan data lagi." },
          { kind: "equal", task: "t1", name: "bad_R2ext", value: 0.0915, tol: 0.00005, label: "`bad_R2ext` seharusnya 0.0915", msg: "Ramp 5% diperpanjang [simulasi]: 56 default dari 612 disetujui = 0,0915 — masih zona abu-abu, dan ini TAHAN kedua berturut-turut." },
          { kind: "stdout_matches", task: "t2", pattern: "decision_R1=LANJUT", label: "Output menampilkan decision_R1=LANJUT", msg: "R1: bad 0,0769 ≤ 0,08 dan PSI 0,02 ≤ 0,10 — LANJUT ke 5%." },
          { kind: "stdout_matches", task: "t2", pattern: "decision_R2=TAHAN", label: "Output menampilkan decision_R2=TAHAN", msg: "R2: bad 0,0894 di zona abu-abu — TAHAN di 5%, jangan naik ke 25%." },
          { kind: "stdout_matches", task: "t2", pattern: "decision_R2ext=STOP", label: "Output menampilkan decision_R2ext=STOP", msg: "R2-ext: TAHAN kedua berturut-turut — STOP. Challenger tidak pernah mencapai 25%." },
          { kind: "stdout_matches", task: "t3", pattern: "final=ROLLBACK", label: "Output menampilkan final=ROLLBACK", msg: "Keputusan akhirnya STOP — traffic kembali 100% ke champion. Canary menangkap challenger yang buruk dengan harga 5% traffic, bukan 100%." },
          { kind: "equal", task: "t4", name: "n_effective_R1", value: 26, tol: 0.5, label: "`n_effective_R1` seharusnya 26", msg: "Sampel efektif bad rate R1 = 26 yang disetujui — bukan 120 traffic ramp, bukan 12.000 aplikasi. Satu default lagi saja sudah mengubah 7,69% menjadi 11,54%." },
          { kind: "stdout_matches", task: "t4", pattern: "stop_eligible_R1=False", label: "Output menampilkan stop_eligible_R1=False", msg: "STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini] — 26 < 100, jadi di R1 STOP bahkan tidak eligible; yang tersedia hanya LANJUT/TAHAN." },
        ],
      },
    },
    {
      id: "lab3",
      eyebrow: "Langkah 13 · Lab 3",
      title: "Lab: rollback tabletop — runbook di bawah 30 menit, atau drill-nya gagal",
      prose: [
        "Lab ketiga adalah tabletop exercise rollback (langkah 8 + G10): kamu memegang runbook 10 bagian dan menguji apakah rollback bisa selesai di bawah target 30 menit [kebijakan lesson ini]. Sepuluh bagian runbook: trigger (apa yang memicu rollback), authority (siapa yang boleh memerintahkan — dan siapa yang tidak), commands/steps (perintah dan langkah peralihan traffic), configuration bundle (bundle konfigurasi v1 yang dibekukan — G13), validation after rollback (uji bahwa champion benar-benar kembali memutuskan), queued decisions (keputusan yang antre selama rollback — ditahan atau diputuskan manual), replay/reconciliation (keputusan shadow/challenger yang harus diputar ulang dan direkonsiliasi), customer/business communication (siapa yang diberitahu, dan apa pesannya), incident ticket (tiket insiden dibuka — tanpa tiket, tidak ada jejak), post-mortem (apa yang dipelajari — tanpa post-mortem, insiden yang sama terulang). Menit tiap bagian [ilustrasi]: trigger 2, authority 2, commands/steps 3, configuration bundle 5, validation 5, queued decisions 3, replay/reconciliation 5, communication 2, incident ticket 1, post-mortem 1 — total 29 menit.",
        "Hasil yang diharapkan [lab]: total_time=29; n_sections=10; rollback_valid=True; total_time_scenario=32; rollback_valid_scenario=False. rollback_valid = total < 30 menit DAN bundle konfigurasi dipin (bundle_pinned) DAN langkah validasi ada (validation_present) — ketiganya harus benar: rollback yang cepat tapi memakai bundle yang tidak dibekukan adalah rollback ke versi yang tidak diketahui; rollback tanpa validasi adalah rollback yang tidak tahu apakah ia berhasil. Skenario: replay/reconciliation memakan 8 menit (bukan 5) — total menjadi 32 menit, melewati target — drill GAGAL, dan yang diperbaiki adalah langkah replay-nya (otomasi atau runbook yang lebih pendek), bukan targetnya: target 30 menit tidak digeser supaya drill lolos.",
        "Setelah lab jalan, tanyakan pada dirimu: bagian mana yang paling mungkin membengkak di insiden nyata? Replay/reconciliation — karena di tabletop ia 5 menit, tapi di live ia berarti memutar ulang ratusan keputusan dan mencocokkannya satu per satu. Itulah gunanya drill tiap kuartal (langkah 8): angka tabletop diuji terhadap waktu nyata, dan runbook yang tidak pernah di-drill adalah runbook yang angkanya bohong.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi total_time dan n_sections dari RUNBOOK" },
        { id: "t2", text: "Lengkapi rollback_valid: total < 30 menit DAN bundle_pinned DAN validation_present" },
        { id: "t3", text: "Lengkapi total_time_scenario dan rollback_valid_scenario: replay memakan 8 menit (bukan 5)" },
      ],
      expected: "total_time=29\nn_sections=10\nrollback_valid=True\ntotal_time_scenario=32\nrollback_valid_scenario=False",
      hints: [
        "total_time = sum(menit) atas RUNBOOK — 2+2+3+5+5+3+5+2+1+1 = 29; n_sections = len(RUNBOOK) = 10.",
        "rollback_valid = total_time < TARGET_MINUTES and bundle_pinned and validation_present — ketiganya True, jadi True. Satu syarat yang False sudah cukup membuatnya False.",
        "Skenario: ganti menit replay_reconciliation dari 5 menjadi 8 — total menjadi 32, melewati target 30 [kebijakan lesson ini] — rollback_valid_scenario = False. Yang diperbaiki adalah langkahnya, bukan targetnya.",
      ],
      code: {
        starter: `# Lab 3 — rollback tabletop: runbook di bawah 30 menit [kebijakan lesson ini]
# Sepuluh bagian runbook + menit tiap bagian [ilustrasi] — total harus < 30 menit
# Skenario: replay/reconciliation memakan 8 menit (bukan 5) — total menjadi 32 menit
RUNBOOK = [
    ("trigger", 2),
    ("authority", 2),
    ("commands_steps", 3),
    ("configuration_bundle", 5),
    ("validation_after_rollback", 5),
    ("queued_decisions", 3),
    ("replay_reconciliation", 5),
    ("customer_business_communication", 2),
    ("incident_ticket", 1),
    ("post_mortem", 1),
]

TARGET_MINUTES = 30  # [kebijakan lesson ini]
bundle_pinned = True  # bundle konfigurasi v1 dibekukan sebelum deploy (G13)
validation_present = True  # langkah validasi sesudah rollback ada di runbook

total_time = 0  # TODO: sum(menit for _, menit in RUNBOOK)
n_sections = 0  # TODO: len(RUNBOOK)
rollback_valid = False  # TODO: total_time < TARGET_MINUTES DAN bundle_pinned DAN validation_present
# Skenario: replay/reconciliation memakan 8 menit (bukan 5)
scenario = [(s, 8 if s == "replay_reconciliation" else m) for s, m in RUNBOOK]
total_time_scenario = 0  # TODO: sum menit skenario
rollback_valid_scenario = True  # TODO: False bila total_time_scenario >= TARGET_MINUTES
print(f"total_time={total_time}")
print(f"n_sections={n_sections}")
print(f"rollback_valid={rollback_valid}")
print(f"total_time_scenario={total_time_scenario}")
print(f"rollback_valid_scenario={rollback_valid_scenario}")`,
        lockLines: 20,
        solution: `# Lab 3 — rollback tabletop: runbook di bawah 30 menit [kebijakan lesson ini]
# Sepuluh bagian runbook + menit tiap bagian [ilustrasi] — total harus < 30 menit
# Skenario: replay/reconciliation memakan 8 menit (bukan 5) — total menjadi 32 menit
RUNBOOK = [
    ("trigger", 2),
    ("authority", 2),
    ("commands_steps", 3),
    ("configuration_bundle", 5),
    ("validation_after_rollback", 5),
    ("queued_decisions", 3),
    ("replay_reconciliation", 5),
    ("customer_business_communication", 2),
    ("incident_ticket", 1),
    ("post_mortem", 1),
]

TARGET_MINUTES = 30  # [kebijakan lesson ini]
bundle_pinned = True  # bundle konfigurasi v1 dibekukan sebelum deploy (G13)
validation_present = True  # langkah validasi sesudah rollback ada di runbook

total_time = sum(m for _, m in RUNBOOK)
n_sections = len(RUNBOOK)
rollback_valid = total_time < TARGET_MINUTES and bundle_pinned and validation_present
# Skenario: replay/reconciliation memakan 8 menit (bukan 5)
scenario = [(s, 8 if s == "replay_reconciliation" else m) for s, m in RUNBOOK]
total_time_scenario = sum(m for _, m in scenario)
rollback_valid_scenario = total_time_scenario < TARGET_MINUTES and bundle_pinned and validation_present
print(f"total_time={total_time}")
print(f"n_sections={n_sections}")
print(f"rollback_valid={rollback_valid}")
print(f"total_time_scenario={total_time_scenario}")
print(f"rollback_valid_scenario={rollback_valid_scenario}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_time", value: 29, tol: 0.5, label: "`total_time` seharusnya 29", msg: "Runbook 10 bagian [ilustrasi] berjumlah 29 menit — 2+2+3+5+5+3+5+2+1+1 — di bawah target 30 menit [kebijakan lesson ini]." },
          { kind: "equal", task: "t1", name: "n_sections", value: 10, tol: 0.5, label: "`n_sections` seharusnya 10", msg: "Runbook punya 10 bagian: trigger, authority, commands/steps, configuration bundle, validation, queued decisions, replay/reconciliation, communication, incident ticket, post-mortem." },
          { kind: "stdout_matches", task: "t2", pattern: "rollback_valid=True", label: "Output menampilkan rollback_valid=True", msg: "Rollback valid: total 29 < 30 menit DAN bundle dipin DAN langkah validasi ada — ketiganya harus benar." },
          { kind: "equal", task: "t3", name: "total_time_scenario", value: 32, tol: 0.5, label: "`total_time_scenario` seharusnya 32", msg: "Skenario: replay memakan 8 menit (bukan 5) — total menjadi 32 menit, melewati target 30." },
          { kind: "stdout_matches", task: "t3", pattern: "rollback_valid_scenario=False", label: "Output menampilkan rollback_valid_scenario=False", msg: "Drill GAGAL pada skenario itu — yang diperbaiki adalah langkah replay-nya (otomasi atau runbook lebih pendek), bukan targetnya." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: shadow dulu, canary kecil, naik hanya bila menang di gate",
      prose: [
        "Rangkuman: big-bang masuk akal hanya bila blast radius kecil, reversible dalam hitungan menit, dan tidak ada uang yang dipertaruhkan — untuk keputusan kredit, pakai bertahap: shadow (keputusan dicatat, tidak bertindak) → canary 1% → 5% → 25% → 100% [kebijakan lesson ini] dengan gate di tiap ramp. Shadow [notebook]: disagreement 19,42% (1.165 dari 6.000); sel challenger-only approvals n = 335, bad rate 18,21% (61 default; kerugian NT$9.243.000 vs margin NT$4.382.000 — net −NT$4.861.000 bila bertindak); sel challenger-only rejections n = 830, good rate 92,29% (766 lancar; margin forgone gross NT$6.354.000). Champion vs challenger [notebook]: approval 28,50% vs 20,25% (−8,25 poin persen), bad rate 6,67% vs 9,14%, profit +NT$8.214.000 vs +NT$1.823.000 (selisih −NT$6.391.000), cost NT$33.046.500 vs NT$39.437.500; ROC-AUC 0,7816 vs 0,7426, Brier 0,1345 vs 0,1427. McNemar atas keputusan: b = 830, c = 335, χ² = 209,473, p < 0,0001 — keputusan BERBEDA signifikan (McNemar menguji perbedaan, profit membuktikan siapa lebih baik). Selisih profit SEBAGIAN artefak kalibrasi — LR dinilai mentah pada 0,10 yang sama (0,10 LR ≠ 0,10 champion); bukti artefaknya hanya sebagian: LR terkalibrasi Platt [M6.4] menyetujui 1.166 nasabah [m8_lr_calibrated_thr010] (profit +NT$1.886.500 vs +NT$8.214.000), tetap jauh dari 1.710 champion. Ranking invarian ≠ approval invarian; kata «mentah» hanya untuk model tak terkalibrasi. Tujuh gate naik [kebijakan lesson ini]: G1 profit, G2 bad rate ≤ 7,67%, G3 kalibrasi ECE ≤ 0,02, G4 disagreement, G5 monitoring M7.5, G6 fairness AIR ≥ 0,80, G7 dua periode — LR gagal G1, G2, G3, G4 (isi), G7; G5/G6 belum diuji. Canary [simulasi]: 1% LANJUT (bad 7,69%), 5% TAHAN (bad 8,94%), 5% diperpanjang STOP (bad 9,15%, TAHAN kedua) → ROLLBACK; 25% dan 100% tidak dicapai. Monitoring gates meminjam M7.5 [M7.5] — PSI > 0,1 waspada / > 0,25 kritis, ROC-AUC turun > 0,02, PR-AUC turun > 0,03, bad rate > 10%, ECE > 0,02 (WASPADA, bukan KRITIS) — dibaca per ramp per model terhadap baseline modelnya sendiri (champion 0,7816/0,5558/28,5%/6,67%; challenger 0,7426/0,5049/20,25%/9,14%) plus gap champion−challenger sebagai metrik tersendiri; metrik tanpa label segera, metrik berlabel hanya cohort matang. Rollback: SEGERA bila bad rate > 12% / PSI > 0,25 / approval anjlok > 10 pp; TERENCANA bila 2 periode gagal gate; prosedur 5 langkah termasuk kembali ke threshold 0,10 tunggal (v1) [M7.4]; latih rollback tiap kuartal. Jebakan: selection [M6.5], kalibrasi, populasi, metrik yang salah, «sederhana = aman», pemakaian ulang test [M8.1]. Mini-case: TIDAK NAIK — profit, shadow cells, gate, dan canary semuanya berkata sama. Lab: disagreement 0,1942 + χ² 209,4730 signifikan; canary LANJUT → TAHAN → STOP → ROLLBACK. Readiness (G7): 12 item — kontrak, skema, freshness, fallback, latensi, logging, akses, alert fitur, kartu lengkap, approval, deployment_id + bundle, drill rollback; 2 gagal [ilustrasi] = deployment DIBLOKIR. Desain eksperimen canary (G8): sampel efektif bad rate R1 = 26 yang disetujui (bukan 120 traffic, bukan 12.000); assignment hash(customer_id) stabil per nasabah, sebelum scoring; cohort sebanding (balance check dulu); STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini] — di R1 STOP tidak eligible; ambang ditulis SEBELUM ramp dibuka, tidak digeser sesudah melihat hasil. Decision matrix (G9): superiority / non-inferiority / equivalence / reject — margin ROC-AUC 0,01, profit NT$500.000, bad rate 1,00 pp [kebijakan lesson ini]; hard constraint fairness AIR ≥ 0,80 dan ECE ≤ 0,02 tidak bisa ditukar profit; trade-off dalam margin dieskalasikan ke komite; LR = REJECT. Rollback drill (G10): runbook 10 bagian, total 29 menit < target 30 menit [kebijakan lesson ini]; skenario replay 8 menit → 32 menit = drill GAGAL.",
        "Guided task di Colab — notebook mlf-m84-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data UCI: flagship GBM terkalibrasi + challenger LR mentah, disagreement + McNemar, kedua sel shadow dengan harga switch-nya, dan simulasi canary dengan checks. Tautan Colab: https://colab.research.google.com/drive/13GwZQORed8Oo75BWuVXaCgScjUdS0PJ3",
        "Yang tersisa adalah kebiasaan: sebelum model baru menyentuh satu nasabah pun yang nyata — shadow dulu, canary kecil, dan biarkan tujuh gate yang memutuskan. Model yang tidak lolos gate bukan model yang buruk — ia model yang belum siap. Dan model yang tidak pernah diuji gate bukanlah model yang berani — ia taruhan yang belum ditagih.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kapan big-bang deployment masuk akal, dan kapan harus pakai bertahap?",
          options: [
            { text: "Big-bang selalu benar karena paling cepat — kecepatan adalah segalanya dalam deployment", why: "Salah: kecepatan bukan segalanya; big-bang yang salah merugikan 100% nasabah sejak jam pertama. Untuk keputusan uang, kecepatan tanpa pengaman adalah ceroboh, bukan berani." },
            { text: "Big-bang masuk akal hanya bila blast radius kecil, reversible dalam hitungan menit, dan tidak ada uang yang dipertaruhkan; untuk keputusan kredit, pakai bertahap (shadow → canary)", why: "Benar: tiga syarat itu harus terpenuhi SEKALIGUS. Model kredit tidak memenuhi satu pun — tiap keputusan bernilai limit nasabah dan kesalahan sebulan bernilai NT$6.391.000 per 6.000 nasabah.", correct: true },
            { text: "Bertahap hanya untuk model besar; model kecil seperti LR boleh langsung big-bang", why: "Salah: yang menentukan bukan ukuran model, melainkan taruhan keputusannya. LR yang «kecil» tetap mengubah 19,42% keputusan dan merugikan NT$6.391.000 — ukuran model tidak melindungi dari kerugian." },
            { text: "Big-bang wajib bila model baru menang di test — menunda deployment yang menang adalah buang-buang waktu", why: "Salah: menang di test tidak berarti aman di live — itu justru jebakan selection [M6.5] dan kalibrasi. Kemenangan test adalah alasan untuk MENGUJI (shadow/canary), bukan alasan untuk melewati pengujian." },
          ],
        },
        {
          q: "Apa yang diukur shadow mode — dan apa yang TIDAK bisa diukurnya?",
          options: [
            { text: "Shadow mengukur harga switch (disagreement + sel-selnya) tanpa bertindak; ia TIDAK bisa mengukur reaksi live karena keputusannya tidak pernah sampai ke nasabah", why: "Benar: shadow memberi perbandingan apel-dengan-apel atas nasabah yang sama tanpa satu rupiah pun dipertaruhkan — disagreement 19,42%, sel 335 approvals buruk 18,21%, sel 830 rejections baik 92,29%. Tapi perilaku nasabah terhadap keputusan challenger tetap tidak teramati.", correct: true },
            { text: "Shadow mengukur ROC-AUC challenger di live — itulah gunanya membayangi champion", why: "Salah: ROC-AUC challenger bisa dihitung dari test tanpa shadow. Yang hanya bisa diukur shadow adalah HARGA SWITCH — keputusan mana yang berubah dan berapa biayanya — karena ia membandingkan keputusan atas nasabah yang sama." },
            { text: "Shadow mengukur segalanya termasuk reaksi live — karena challenger menghitung skor pada nasabah live", why: "Salah: menghitung skor bukan bertindak. Nasabah tetap menerima keputusan champion, jadi reaksi mereka terhadap keputusan challenger tidak pernah terjadi dan tidak bisa diukur. Itulah batas shadow — dan alasan canary tetap dibutuhkan." },
            { text: "Shadow tidak mengukur apa pun yang berguna — ia hanya menunda deployment tanpa memberi angka", why: "Salah: shadow memberi angka paling penting sebelum switch — disagreement 19,42% dan harga kedua selnya (net −NT$4.861.000 pada sel approvals; margin forgone gross NT$6.354.000 pada sel rejections). Tanpa shadow, harga itu baru diketahui setelah dibayar." },
          ],
        },
        {
          q: "Canary challenger LR [simulasi]: ramp 1% LANJUT (bad 7,69%), ramp 5% TAHAN (bad 8,94%), ramp 5% diperpanjang bad 9,15%. Apa keputusan yang benar di ramp 5% yang diperpanjang?",
          options: [
            { text: "LANJUT ke 25% — bad rate 9,15% masih di bawah 10%, jadi masih aman", why: "Salah: aturan ramp [kebijakan lesson ini] bukan hanya «di bawah 10%». Bad 9,15% masih zona abu-abu (0,08–0,10) — dan ini TAHAN kedua berturut-turut, yang aturannya STOP. Membaca hanya ambang 10% berarti mengabaikan aturan dua-TAHAN." },
            { text: "STOP — TAHAN kedua berturut-turut; challenger tidak naik ke 25%, evaluasi rollback ke champion", why: "Benar: R2 TAHAN (8,94%), R2-ext masih abu-abu (9,15%) — dua TAHAN berturut-turut berarti STOP menurut aturan ramp. Challenger tidak pernah mencapai 25%; traffic kembali 100% ke champion.", correct: true },
            { text: "TAHAN lagi di 5% — kumpulkan data sekali lagi, mungkin ramp ketiga membaik", why: "Salah: aturan dua-TAHAN ada justru untuk menghentikan pengumpulan data yang tak berujung. Dua kali abu-abu adalah vonis, bukan undangan untuk mencoba ketiga kalinya — tiap perpanjangan adalah 5% traffic yang terus dirugikan." },
            { text: "ROLLBACK tidak perlu — cukup kembalikan traffic challenger ke 1% dan coba lagi dari awal", why: "Salah: kembali ke 1% setelah dua TAHAN adalah mengulang kegagalan yang sama dengan n lebih kecil — bukti yang sudah terkumpul (n = 3.000, bad 9,15%) tidak hilang hanya karena traffic dikecilkan. Keputusan yang benar adalah STOP + evaluasi rollback." },
          ],
        },
        {
          q: "McNemar atas keputusan champion vs challenger: b = 830, c = 335, χ² = 209,473, p < 0,0001. Apa arti yang benar?",
          options: [
            { text: "McNemar membuktikan challenger lebih buruk — p < 0,0001 berarti LR kalah signifikan", why: "Salah: McNemar menguji apakah KEPUTUSAN kedua model berbeda lebih dari kebetulan — bukan siapa yang lebih baik. Yang membuktikan challenger lebih buruk adalah profit (+NT$1.823.000 vs +NT$8.214.000) dan bad rate (9,14% vs 6,67%)." },
            { text: "Keputusan kedua model BERBEDA secara signifikan — McNemar menguji perbedaan keputusan, bukan siapa lebih baik", why: "Benar: b = 830 vs c = 335 sangat asimetris — χ² = 209,473 jauh di atas nilai kritis 15,1367. Dua alat, dua pertanyaan: McNemar untuk «apakah berbeda?», profit untuk «mana yang lebih baik?».", correct: true },
            { text: "p < 0,0001 berarti peluang champion lebih baik adalah 99,99% — McNemar adalah uji superioritas", why: "Salah: nilai p bukan peluang «champion lebih baik». Nilai p adalah peluang melihat asimetri sebesar ini bila keputusan kedua model sebenarnya tidak berbeda sistematis — dan McNemar tidak membandingkan kualitas, hanya perbedaan keputusan." },
            { text: "χ² = 209,473 terlalu besar sehingga uji ini tidak valid — McNemar hanya berlaku untuk χ² kecil", why: "Salah: tidak ada batas atas χ² yang membuatnya «tidak valid». χ² besar berarti bukti perbedaan SANGAT kuat — 209,473 adalah hampir 14 kali (13,84×) nilai kritis 15,1367. Yang tidak valid adalah menulis «p = 0» karena pembulatan 4 desimal — tulis p < 0,0001." },
          ],
        },
        {
          q: "Tujuh gate naik [kebijakan lesson ini]: gate mana saja yang digagalkan challenger LR?",
          options: [
            { text: "Hanya G3 kalibrasi — LR mentah; gate lainnya lolos karena ROC-AUC-nya «hampir sama»", why: "Salah: LR gagal G1 (profit −NT$6.391.000), G2 (bad rate 9,14% > 7,67%), G3 (mentah), G4 (isi sel shadow buruk), dan G7 (tidak ada dua periode lolos). «Hampir sama» bukan lolos gate — gate tidak mengenal hampir." },
            { text: "G1 profit, G2 bad rate, G3 kalibrasi, dan G4 (isi sel shadow) gagal; G5/G6 belum diuji; G7 gagal — 0 dari 7 lolos", why: "Benar: profit +NT$1.823.000 vs +NT$8.214.000 (G1), bad rate 9,14% vs ambang 7,67% (G2), LR dinilai mentah (G3), sel shadow buruk di kedua arah walau disagreement 19,42% di bawah 25% (G4), tidak ada dua periode lolos (G7). Itu bukan «hampir naik» — itu tidak naik.", correct: true },
            { text: "Hanya G1 profit — bad rate 9,14% masih di bawah 10% jadi G2 lolos", why: "Salah: ambang G2 bukan 10% — ambang G2 adalah 7,67% (champion 6,67% + toleransi 1 poin persen). 10% adalah ambang ALERT M7.5, bukan ambang NAIK. Mencampur ambang alert dengan ambang gate adalah kesalahan yang membuat challenger buruk lolos." },
            { text: "Tidak ada yang gagal — challenger kalah profit tapi menang kesederhanaan, dan kesederhanaan adalah gate G8", why: "Salah: tidak ada gate G8 «kesederhanaan» — tujuh gate adalah G1–G7, dan kesederhanaan bukan bukti kualitas keputusan. LR yang mudah dijelaskan tetap merugikan NT$6.391.000." },
          ],
        },
        {
          q: "Di tiap ramp canary, metrik mana yang tersedia SEGERA dan mana yang harus menunggu cohort matang? [M7.5]",
          options: [
            { text: "Semuanya tersedia segera — begitu skor keluar, semua metrik bisa dihitung", why: "Salah: metrik berlabel (bad rate, ROC-AUC, PR-AUC, ECE, fairness) butuh LABEL — dan label default baru tersedia setelah jendela observasi 1 bulan lewat. Menghitung bad rate ramp terlalu dini berarti memakai label yang belum lengkap." },
            { text: "PSI skor, approval rate, dan distribusi skor tersedia segera (tanpa label); bad rate, ROC-AUC, dan fairness hanya untuk cohort matang", why: "Benar: dua kolom yang tidak boleh dicampur [M7.5]. Di hari-hari pertama ramp, keputusan LANJUT/TAHAN hanya boleh memakai kolom tanpa label — bad rate yang labelnya belum matang adalah angka yang belum jujur.", correct: true },
            { text: "Bad rate tersedia segera karena default ketahuan cepat; PSI skor yang harus menunggu cohort matang", why: "Terbalik: PSI tidak butuh label sama sekali — ia membandingkan distribusi skor. Bad rate-lah yang butuh label matang, dan default justru TIDAK ketahuan cepat (jendela observasi 1 bulan). Yang menunggu adalah bad rate, bukan PSI." },
            { text: "Tidak ada bedanya — cohort matang hanya penting untuk retraining, bukan untuk canary", why: "Salah: cohort matang penting di mana pun metrik berlabel dipakai — termasuk canary. Ramp yang dinaikkan berdasarkan bad rate belum matang adalah ramp yang dinaikkan atas angka bias (default cenderung ketahuan lebih dulu)." },
          ],
        },
        {
          q: "Kapan rollback SEGERA, dan kapan rollback TERENCANA? [kebijakan lesson ini]",
          options: [
            { text: "Rollback selalu terencana — rollback segera tidak pernah dibenarkan karena harus menunggu 2 periode konfirmasi", why: "Salah: menunggu 2 periode saat kerugian berjalan adalah kemewahan yang tidak kamu punya. Bad rate > 12%, PSI > 0,25, atau approval anjlok > 10 pp memicu rollback SEGERA — tanpa menunggu konfirmasi." },
            { text: "SEGERA bila bad rate > 12% / PSI > 0,25 / approval anjlok > 10 pp / insiden operasional; TERENCANA bila gagal gate 2 periode berturut-turut atau STOP dua kali di canary", why: "Benar: dua jenis rollback untuk dua jenis bahaya — SEGERA memotong bencana, TERENCANA menghentikan pendarahan pelan (seperti bad rate 9,15% yang terus-menerus tapi tidak pernah menyentuh 12%).", correct: true },
            { text: "SEGERA bila profit challenger negatif; TERENCANA bila profitnya positif tapi lebih kecil dari champion", why: "Salah: profit negatif bukan pemicu rollback — profit per ramp tidak bisa dihitung sebelum cohort matang, dan menunggu profit berarti menunggu sebulan. Pemicunya adalah bad rate, PSI, approval, dan insiden — metrik yang tersedia saat kerugian berjalan." },
            { text: "Rollback berarti latih ulang challenger — jadi rollback SEGERA sama dengan retrain SEGERA", why: "Salah: rollback BUKAN retrain. Rollback mengembalikan routing + threshold 0,10 tunggal (v1) ke champion; retrain adalah melatih model baru. Mencampur keduanya berarti menunda kembalinya traffic aman sambil menunggu model baru selesai dilatih." },
          ],
        },
        {
          q: "Mini-case: challenger LR — approval 20,25%, bad rate 9,14%, profit +NT$1.823.000 vs champion +NT$8.214.000; shadow 335 approvals bad rate 18,21%; canary STOP di 5% [simulasi]. Putuskan.",
          options: [
            { text: "NAIK — challenger lebih sederhana dan ROC-AUC-nya «hampir sama», jadi layak menggantikan champion", why: "Salah: «hampir sama» bukan lolos gate. Challenger gagal G1 (profit −NT$6.391.000), G2 (9,14% > 7,67%), G3 (mentah), G4 (sel shadow buruk), dan STOP di canary 5%. Kesederhanaan bukan bukti kualitas keputusan." },
            { text: "TIDAK NAIK — profit kalah NT$6.391.000, bad rate melewati gate, sel shadow buruk di kedua arah, dan canary sudah STOP di 5%", why: "Benar: empat lapis bukti berkata sama — profit, shadow cells (net −NT$4.861.000 pada sel approvals; margin forgone gross NT$6.354.000 pada sel rejections), tujuh gate (0 lolos), dan canary [simulasi] yang bahkan tidak mencapai 25%. Tindak lanjut: kalibrasi LR lalu bandingkan ulang, atau buang challenger ini.", correct: true },
            { text: "NAIK ke 25% saja — canary STOP di 5% tapi 25% belum dicoba, jadi mungkin di 25% ia membaik", why: "Salah: STOP di 5% berarti JANGAN NAIK — bukan «coba ramp yang lebih besar». Bad rate 9,15% pada n = 3.000 adalah bukti, bukan tebak-tebakan; menaikkan traffic atas model yang sudah STOP adalah mengulang kerugian dengan skala lebih besar." },
            { text: "TIDAK NAIK, tapi champion juga harus diganti — karena challenger kalah berarti champion sempurna dan tidak perlu diganti lagi", why: "Salah alasan: «challenger kalah» hanya membuktikan champion LEBIH BAIK dari challenger ini — bukan bahwa champion sempurna. Champion tetap punya bad rate 6,67% dan AIR SEX 0,869. Yang benar: challenger ini ditolak; challenger BERIKUTNYA tetap dicari dengan protokol yang sama." },
          ],
        },
        {
          q: "Challenger LR: ROC-AUC 0,7426 vs champion 0,7816 (−0,039), profit +NT$1.823.000 vs +NT$8.214.000 (−NT$6.391.000), bad rate 9,14% vs 6,67% (+2,47 pp). Margin non-inferiority [kebijakan lesson ini]: ROC-AUC 0,01; profit NT$500.000; bad rate 1,00 pp. Keputusan menurut decision matrix?",
          options: [
            { text: "Non-inferiority — LR «hampir sama» dan lebih sederhana, jadi boleh naik", why: "Salah: «hampir sama» bukan dalam margin — ROC −0,039 hampir 4× margin 0,01; profit −NT$6.391.000 hampir 13× margin NT$500.000; bad rate +2,47 pp lebih dari 2× margin 1,00. Non-inferiority butuh DALAM margin di semua sumbu." },
            { text: "Equivalence — ROC-AUC LR masih di atas 0,70, jadi ia setara dengan champion", why: "Salah: 0,70 adalah ambang MERAH traffic-light, bukan margin equivalence. Equivalence butuh selisih DALAM margin — dan −0,039 jauh di luar margin 0,01. Mencampur ambang band dengan margin matriks adalah kesalahan yang membuat challenger buruk lolos." },
            { text: "REJECT — challenger gagal non-inferiority di tiga sumbu sekaligus (ROC −0,039 > margin 0,01; profit −NT$6.391.000 > margin NT$500.000; bad rate +2,47 pp > margin 1,00 pp) dan gagal superiority; tidak ada trade-off yang bisa menyelamatkannya", why: "Benar: tiga selisih, tiga margin, tiga perbandingan — semuanya di luar margin. Vonis REJECT ini bisa diaudit siapa pun tanpa perlu percaya pada perasaan siapa pun — dan ia konsisten dengan mini-case: TIDAK NAIK.", correct: true },
            { text: "Superiority — LR menang kesederhanaan, dan kesederhanaan adalah sumbu superiority", why: "Salah: superiority diukur pada tujuh gate (profit, bad rate, kalibrasi, disagreement, monitoring, fairness, dua periode) — bukan pada kesederhanaan. LR yang mudah dijelaskan tetap merugikan NT$6.391.000." },
          ],
        },
        {
          q: "Challenger LR dipilih berdasarkan test 6.000 yang sama yang sudah dipakai memilih threshold 0,10 [M6.4], membandingkan model [M6.5], dan memvalidasi [M8.1]. Apa yang harus dilakukan validator sebelum menyatakan challenger menang?",
          options: [
            { text: "Bandingkan challenger pada split validasi yang segar atau nested CV [M6.2], dan tulis di laporan bahwa test 6.000 sudah dipakai memilih sebelumnya", why: "Benar: test final dipakai SATU KALI untuk vonis akhir; sesudah itu ia referensi, bukan test yang segar. Kemenangan pada test yang dipakai memilih empat kali adalah kemenangan atas test yang sudah dikenalnya — validator yang menemukannya tanpa catatan menulisnya sebagai TEMUAN [M8.1].", correct: true },
            { text: "Tidak ada — test 6.000 adalah test resmi lesson ini, jadi kemenangan di atasnya sah apa pun riwayat pemakaiannya", why: "Salah: test yang sudah dipakai memilih threshold, model, dan verdict bukan lagi test yang segar — yang dipilih adalah yang kebetulan bagus di test itu. «Test resmi» bukan alasan untuk mengabaikan riwayat pemakaian [M8.1]." },
            { text: "Belah lagi test 6.000 secara acak menjadi dua, pilih belahan yang angkanya paling bagus untuk challenger, dan laporkan belahan itu", why: "Salah: memilih belahan karena angkanya bagus adalah selection yang sama dengan baju baru — split yang dipilih karena kebetulan adalah split yang dipilih karena kebetulan [M8.1]." },
            { text: "Pakai ulang test 6.000 tanpa catatan — riwayat pemakaian test adalah detail administrasi, bukan bukti", why: "Salah: riwayat pemakaian test adalah BAGIAN dari bukti — tanpa catatan itu, pembaca laporan tidak tahu bahwa kemenangan challenger diukur pada test yang sudah dipakai memilihnya tiga kali sebelumnya [M8.1]." },
          ],
        },
      ],
      summary: [
        "Big-bang hanya bila blast radius kecil, reversible dalam hitungan menit, dan tidak ada uang yang dipertaruhkan — untuk keputusan kredit, pakai bertahap: shadow → canary 1% → 5% → 25% → 100% [kebijakan lesson ini] dengan gate di tiap ramp.",
        "Shadow [notebook]: disagreement 19,42% (1.165 dari 6.000); challenger-only approvals n = 335, bad rate 18,21% (net −NT$4.861.000 bila bertindak); challenger-only rejections n = 830, good rate 92,29% (margin forgone gross NT$6.354.000).",
        "Champion vs challenger [notebook]: approval 28,50% vs 20,25%, bad rate 6,67% vs 9,14%, profit +NT$8.214.000 vs +NT$1.823.000 (selisih −NT$6.391.000), cost NT$33.046.500 vs NT$39.437.500; ROC-AUC 0,7816 vs 0,7426, Brier 0,1345 vs 0,1427.",
        "McNemar atas keputusan: b = 830, c = 335, χ² = 209,473, p < 0,0001 — keputusan BERBEDA signifikan; McNemar menguji perbedaan, profit membuktikan siapa lebih baik. Tulis p < 0,0001, JANGAN «p = 0».",
        "Selisih profit SEBAGIAN artefak kalibrasi — LR dinilai mentah pada 0,10 yang sama (0,10 LR ≠ 0,10 champion); bukti artefaknya hanya sebagian: LR terkalibrasi Platt [M6.4] menyetujui 1.166 nasabah [m8_lr_calibrated_thr010] (profit +NT$1.886.500 vs +NT$8.214.000), tetap jauh dari 1.710 champion. Ranking invarian ≠ approval invarian; «mentah» hanya untuk model tak terkalibrasi.",
        "Tujuh gate naik [kebijakan lesson ini]: G1 profit, G2 bad rate ≤ 7,67%, G3 kalibrasi ECE ≤ 0,02, G4 disagreement, G5 monitoring M7.5, G6 fairness AIR ≥ 0,80, G7 dua periode — LR gagal G1, G2, G3, G4 (isi), G7; G5/G6 belum diuji; 0 dari 7 lolos.",
        "Canary [simulasi]: 1% LANJUT (bad 7,69%), 5% TAHAN (bad 8,94%), 5% diperpanjang STOP (bad 9,15%, TAHAN kedua) → ROLLBACK; 25% dan 100% tidak dicapai.",
        "Deployment readiness: 12 item (kontrak, skema, freshness, fallback, latensi, logging, akses, alert fitur, kartu lengkap, approval, deployment_id + bundle, drill rollback) — 2 gagal [ilustrasi] = deployment DIBLOKIR; readiness gerbang biner, bukan skor.",
        "Desain eksperimen canary: sampel efektif bad rate R1 = 26 yang disetujui (bukan 120 traffic); assignment hash(customer_id) stabil per nasabah, sebelum scoring; cohort sebanding (balance check dulu); STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]; ambang ditulis SEBELUM ramp dibuka.",
        "Decision matrix: superiority / non-inferiority / equivalence / reject — margin ROC-AUC 0,01, profit NT$500.000, bad rate 1,00 pp [kebijakan lesson ini]; hard constraint fairness AIR ≥ 0,80 dan ECE ≤ 0,02 tidak bisa ditukar profit; LR = REJECT.",
        "Rollback drill: runbook 10 bagian, total 29 menit < target 30 menit [kebijakan lesson ini]; skenario replay 8 menit → 32 menit = drill GAGAL — yang diperbaiki langkahnya, bukan targetnya.",
        "Monitoring gates meminjam M7.5 [M7.5]: PSI > 0,1 waspada / > 0,25 kritis, ROC-AUC turun > 0,02, PR-AUC turun > 0,03, bad rate > 10%, ECE > 0,02 — dibaca per ramp per model; metrik tanpa label segera, metrik berlabel hanya cohort matang.",
        "Rollback [kebijakan lesson ini]: SEGERA bila bad rate > 12% / PSI > 0,25 / approval anjlok > 10 pp / insiden; TERENCANA bila 2 periode gagal gate; prosedur 5 langkah termasuk kembali ke threshold 0,10 tunggal (v1) [M7.4]; latih rollback tiap kuartal.",
        "Jebakan: selection [M6.5], kalibrasi, populasi, metrik yang salah (ROC-AUC ≠ profit), «sederhana = aman», pemakaian ulang test [M8.1] — tiap jebakan punya penangkal di lesson ini.",
        "Mini-case: TIDAK NAIK — profit, shadow cells, tujuh gate, dan canary semuanya berkata sama. Tindak lanjut: kalibrasi LR lalu bandingkan ulang, atau buang challenger ini.",
        "Lab: disagreement 0,1942 + χ² 209,4730 signifikan (p < 0,0001); canary LANJUT → TAHAN → STOP → ROLLBACK; lab 3 rollback: total 29 menit < 30 menit [kebijakan lesson ini], skenario 32 menit = GAGAL.",
      ],
      next: { label: "Lanjut: MLF-M8.5 — Model Risk Governance & Approval Workflow", href: "/v2/learn/mlf-m85-governance-approval-workflow" },
    },
  ],
};
