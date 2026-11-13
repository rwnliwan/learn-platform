#!/usr/bin/env python3
"""Fill gap Luna M8 — M8.4 (G7 + G8 + G9 + G10).

G7 (should): langkah baru "Langkah 2a" sebelum shadow — deployment readiness
checklist (12 item) + figure arsitektur + skenario 2 gagal = BLOKIR.
G8 (must): langkah baru "Langkah 4a" perluasan canary — traffic % vs effective
sample size, hash assignment stabil, cohort sebanding, stopping rule tanpa
menggeser ambang + figure traffic assignment + lab2 t4.
G9 (must): langkah baru "Langkah 6a" setelah tujuh gate — decision matrix
(superiority / non-inferiority / equivalence / reject) + hard constraint
fairness + kuis.
G10 (must): Lab 3 rollback tabletop — runbook 10 bagian, target < 30 menit
[kebijakan lesson ini].
"""
import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent


def apply(path, pairs, dry):
    p = REPO / path
    text = p.read_text()
    ok = True
    for old, new, expect in pairs:
        n = text.count(old)
        if n != expect:
            print(f"  FAIL {path}: expect {expect}x found {n}x :: {old[:100]!r}")
            ok = False
            continue
        text = text.replace(old, new)
    if not ok:
        return False
    if not dry:
        p.write_text(text)
    print(f"  OK {path}: {len(pairs)} replacements applied")
    return True


M84 = "src/app/v2/content/mlf-m84-deployment-shadow-canary-champion.ts"
M84_MD = "content/mlf-m84-deployment-shadow-canary-champion.md"

G7_STEP = """    {
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
      id: "shadow-mode","""

G8_STEP = """    {
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
      id: "champion-challenger","""

G9_STEP = """    {
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
      id: "monitoring-gates","""

LAB3_STEP = """    {
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
      expected: "total_time=29\\nn_sections=10\\nrollback_valid=True\\ntotal_time_scenario=32\\nrollback_valid_scenario=False",
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
      id: "checkpoint","""

M84_PAIRS = [
    ("  estMinutes: 80,",
     "  estMinutes: 100,", 1),
    # Peta lesson.
    ("Peta lesson: cerita kerugian satu bulan → pola deployment (big-bang vs bertahap) → shadow mode (harga switch sebelum membayarnya) → canary (ramp 1%→5%→25%→100%) → champion-challenger (angka + McNemar) → kriteria naik yang kuantitatif → monitoring gates per ramp → rollback → jebakan (menang di test, kalah di live) → mini-case (putuskan: naik atau tidak?) → 2 lab → checkpoint.",
     "Peta lesson: cerita kerugian satu bulan → pola deployment (big-bang vs bertahap) → deployment readiness (12 item, gerbang sebelum shadow) → shadow mode (harga switch sebelum membayarnya) → canary (ramp 1%→5%→25%→100%) → desain eksperimen canary (sampel efektif, hash, cohort, stopping rule) → champion-challenger (angka + McNemar) → kriteria naik yang kuantitatif → decision matrix (superiority / non-inferiority / equivalence / reject) → monitoring gates per ramp → rollback → jebakan (menang di test, kalah di live) → mini-case (putuskan: naik atau tidak?) → 3 lab → checkpoint.", 1),
    # G7: sisip langkah 2a sebelum shadow-mode.
    ('    {\n      id: "shadow-mode",', G7_STEP, 1),
    # G8: sisip langkah 4a sebelum champion-challenger.
    ('    {\n      id: "champion-challenger",', G8_STEP, 1),
    # G9: sisip langkah 6a sebelum monitoring-gates.
    ('    {\n      id: "monitoring-gates",', G9_STEP, 1),
    # Lab2 prose para 1: tambah aturan sampel efektif.
    ("R2-ext 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI 0,06).",
     "R2-ext 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI 0,06). Aturan tambahan (langkah 4a): sampel efektif bad rate adalah yang DISETUJUI — STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]; di R1 (26 disetujui) STOP atas bad rate bahkan tidak eligible.", 1),
    # Lab2 prose para 2: tambah sampel efektif.
    ("Dan final ROLLBACK karena STOP berarti challenger tidak naik — traffic kembali ke champion.",
     "Dan final ROLLBACK karena STOP berarti challenger tidak naik — traffic kembali ke champion. Sampel efektif: bad rate R1 dihitung atas 26 yang disetujui — bukan 120 traffic ramp — dan STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]: di R1 (26) kamu bahkan tidak boleh memutuskan STOP atas bad rate.", 1),
    # Lab2 tasks: tambah t4.
    ('        { id: "t3", text: "Lengkapi final: ROLLBACK bila keputusan akhirnya STOP, kalau tidak NAIK" },',
     '        { id: "t3", text: "Lengkapi final: ROLLBACK bila keputusan akhirnya STOP, kalau tidak NAIK" },\n        { id: "t4", text: "Lengkapi n_effective_R1 dan stop_eligible_R1: sampel efektif = yang DISETUJUI, dan STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]" },', 1),
    # Lab2 expected: tambah 2 baris.
    ('      expected: "bad_R1=0.0769\\ndecision_R1=LANJUT\\nbad_R2=0.0894\\ndecision_R2=TAHAN\\nbad_R2ext=0.0915\\ndecision_R2ext=STOP\\nfinal=ROLLBACK",',
     '      expected: "bad_R1=0.0769\\ndecision_R1=LANJUT\\nbad_R2=0.0894\\ndecision_R2=TAHAN\\nbad_R2ext=0.0915\\ndecision_R2ext=STOP\\nfinal=ROLLBACK\\nn_effective_R1=26\\nstop_eligible_R1=False",', 1),
    # Lab2 hint 4.
    ('        "R2-ext: bad 0,0915 juga zona abu-abu, TAPI streak TAHAN sudah 1 — TAHAN kedua berturut-turut → STOP. final = ROLLBACK karena keputusan akhirnya STOP.",',
     '        "R2-ext: bad 0,0915 juga zona abu-abu, TAPI streak TAHAN sudah 1 — TAHAN kedua berturut-turut → STOP. final = ROLLBACK karena keputusan akhirnya STOP.",\n        "Sampel efektif bad rate R1 = 26 yang disetujui — bukan 120 traffic ramp. STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]: 26 < 100, jadi stop_eligible_R1=False — di R1 kamu bahkan tidak BOLEH memutuskan STOP atas bad rate; yang tersedia hanya LANJUT/TAHAN.",', 1),
    # Lab2 code starter: tambah TODO setelah final.
    ('final = ""  # TODO: "ROLLBACK" bila decision_R2ext == "STOP", kalau tidak "NAIK"',
     'final = ""  # TODO: "ROLLBACK" bila decision_R2ext == "STOP", kalau tidak "NAIK"\nn_effective_R1 = 0  # TODO: RAMPS[0][2] — sampel efektif bad rate = yang disetujui, bukan n ramp\nstop_eligible_R1 = False  # TODO: True bila n_effective_R1 >= 100 [kebijakan lesson ini] — STOP atas bad rate butuh sampel cukup', 1),
    # Lab2 code solution: tambah baris setelah final.
    ('final = "ROLLBACK" if decision_R2ext == "STOP" else "NAIK"',
     'final = "ROLLBACK" if decision_R2ext == "STOP" else "NAIK"\nn_effective_R1 = RAMPS[0][2]\nstop_eligible_R1 = n_effective_R1 >= 100', 1),
    # Lab2 code prints (starter + solution, expect 2).
    ('print(f"final={final}")',
     'print(f"final={final}")\nprint(f"n_effective_R1={n_effective_R1}")\nprint(f"stop_eligible_R1={stop_eligible_R1}")', 2),
    # Lab2 checks: tambah 2 check t4 setelah check final.
    ('          { kind: "stdout_matches", task: "t3", pattern: "final=ROLLBACK", label: "Output menampilkan final=ROLLBACK", msg: "Keputusan akhirnya STOP — traffic kembali 100% ke champion. Canary menangkap challenger yang buruk dengan harga 5% traffic, bukan 100%." },',
     '          { kind: "stdout_matches", task: "t3", pattern: "final=ROLLBACK", label: "Output menampilkan final=ROLLBACK", msg: "Keputusan akhirnya STOP — traffic kembali 100% ke champion. Canary menangkap challenger yang buruk dengan harga 5% traffic, bukan 100%." },\n          { kind: "equal", task: "t4", name: "n_effective_R1", value: 26, tol: 0.5, label: "`n_effective_R1` seharusnya 26", msg: "Sampel efektif bad rate R1 = 26 yang disetujui — bukan 120 traffic ramp, bukan 12.000 aplikasi. Satu default lagi saja sudah mengubah 7,69% menjadi 11,54%." },\n          { kind: "stdout_matches", task: "t4", pattern: "stop_eligible_R1=False", label: "Output menampilkan stop_eligible_R1=False", msg: "STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini] — 26 < 100, jadi di R1 STOP bahkan tidak eligible; yang tersedia hanya LANJUT/TAHAN." },', 1),
    # Lab3: sisip sebelum checkpoint.
    ('    {\n      id: "checkpoint",', LAB3_STEP, 1),
    # Checkpoint prose: tambah G7/G8/G9/G10 (jangkar gabungan mini-case + lab).
    ("Mini-case: TIDAK NAIK — profit, shadow cells, gate, dan canary semuanya berkata sama. Lab: disagreement 0,1942 + χ² 209,4730 signifikan; canary LANJUT → TAHAN → STOP → ROLLBACK.",
     "Mini-case: TIDAK NAIK — profit, shadow cells, gate, dan canary semuanya berkata sama. Lab: disagreement 0,1942 + χ² 209,4730 signifikan; canary LANJUT → TAHAN → STOP → ROLLBACK. Readiness (G7): 12 item — kontrak, skema, freshness, fallback, latensi, logging, akses, alert fitur, kartu lengkap, approval, deployment_id + bundle, drill rollback; 2 gagal [ilustrasi] = deployment DIBLOKIR. Desain eksperimen canary (G8): sampel efektif bad rate R1 = 26 yang disetujui (bukan 120 traffic, bukan 12.000); assignment hash(customer_id) stabil per nasabah, sebelum scoring; cohort sebanding (balance check dulu); STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini] — di R1 STOP tidak eligible; ambang ditulis SEBELUM ramp dibuka, tidak digeser sesudah melihat hasil. Decision matrix (G9): superiority / non-inferiority / equivalence / reject — margin ROC-AUC 0,01, profit NT$500.000, bad rate 1,00 pp [kebijakan lesson ini]; hard constraint fairness AIR ≥ 0,80 dan ECE ≤ 0,02 tidak bisa ditukar profit; trade-off dalam margin dieskalasikan ke komite; LR = REJECT. Rollback drill (G10): runbook 10 bagian, total 29 menit < target 30 menit [kebijakan lesson ini]; skenario replay 8 menit → 32 menit = drill GAGAL.", 1),
    # Kuis G9: sisip sebelum penutup array kuis.
    ("""        },
      ],
      summary: [
        "Big-bang hanya bila blast radius kecil, reversible dalam hitungan menit, dan tidak ada uang yang dipertaruhkan — untuk keputusan kredit, pakai bertahap: shadow → canary 1% → 5% → 25% → 100% [kebijakan lesson ini] dengan gate di tiap ramp.",""",
     """        },
        {
          q: "Challenger LR: ROC-AUC 0,7426 vs champion 0,7816 (−0,039), profit +NT$1.823.000 vs +NT$8.214.000 (−NT$6.391.000), bad rate 9,14% vs 6,67% (+2,47 pp). Margin non-inferiority [kebijakan lesson ini]: ROC-AUC 0,01; profit NT$500.000; bad rate 1,00 pp. Keputusan menurut decision matrix?",
          options: [
            { text: "Non-inferiority — LR «hampir sama» dan lebih sederhana, jadi boleh naik", why: "Salah: «hampir sama» bukan dalam margin — ROC −0,039 hampir 4× margin 0,01; profit −NT$6.391.000 hampir 13× margin NT$500.000; bad rate +2,47 pp lebih dari 2× margin 1,00. Non-inferiority butuh DALAM margin di semua sumbu." },
            { text: "Equivalence — ROC-AUC LR masih di atas 0,70, jadi ia setara dengan champion", why: "Salah: 0,70 adalah ambang MERAH traffic-light, bukan margin equivalence. Equivalence butuh selisih DALAM margin — dan −0,039 jauh di luar margin 0,01. Mencampur ambang band dengan margin matriks adalah kesalahan yang membuat challenger buruk lolos." },
            { text: "REJECT — challenger gagal non-inferiority di tiga sumbu sekaligus (ROC −0,039 > margin 0,01; profit −NT$6.391.000 > margin NT$500.000; bad rate +2,47 pp > margin 1,00 pp) dan gagal superiority; tidak ada trade-off yang bisa menyelamatkannya", why: "Benar: tiga selisih, tiga margin, tiga perbandingan — semuanya di luar margin. Vonis REJECT ini bisa diaudit siapa pun tanpa perlu percaya pada perasaan siapa pun — dan ia konsisten dengan mini-case: TIDAK NAIK.", correct: true },
            { text: "Superiority — LR menang kesederhanaan, dan kesederhanaan adalah sumbu superiority", why: "Salah: superiority diukur pada tujuh gate (profit, bad rate, kalibrasi, disagreement, monitoring, fairness, dua periode) — bukan pada kesederhanaan. LR yang mudah dijelaskan tetap merugikan NT$6.391.000." },
          ],
        },
      ],
      summary: [
        "Big-bang hanya bila blast radius kecil, reversible dalam hitungan menit, dan tidak ada uang yang dipertaruhkan — untuk keputusan kredit, pakai bertahap: shadow → canary 1% → 5% → 25% → 100% [kebijakan lesson ini] dengan gate di tiap ramp.",""", 1),
    # Summary: tambah 4 bullet setelah bullet canary; update bullet lab.
    ('        "Canary [simulasi]: 1% LANJUT (bad 7,69%), 5% TAHAN (bad 8,94%), 5% diperpanjang STOP (bad 9,15%, TAHAN kedua) → ROLLBACK; 25% dan 100% tidak dicapai.",',
     '''        "Canary [simulasi]: 1% LANJUT (bad 7,69%), 5% TAHAN (bad 8,94%), 5% diperpanjang STOP (bad 9,15%, TAHAN kedua) → ROLLBACK; 25% dan 100% tidak dicapai.",
        "Deployment readiness: 12 item (kontrak, skema, freshness, fallback, latensi, logging, akses, alert fitur, kartu lengkap, approval, deployment_id + bundle, drill rollback) — 2 gagal [ilustrasi] = deployment DIBLOKIR; readiness gerbang biner, bukan skor.",
        "Desain eksperimen canary: sampel efektif bad rate R1 = 26 yang disetujui (bukan 120 traffic); assignment hash(customer_id) stabil per nasabah, sebelum scoring; cohort sebanding (balance check dulu); STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]; ambang ditulis SEBELUM ramp dibuka.",
        "Decision matrix: superiority / non-inferiority / equivalence / reject — margin ROC-AUC 0,01, profit NT$500.000, bad rate 1,00 pp [kebijakan lesson ini]; hard constraint fairness AIR ≥ 0,80 dan ECE ≤ 0,02 tidak bisa ditukar profit; LR = REJECT.",
        "Rollback drill: runbook 10 bagian, total 29 menit < target 30 menit [kebijakan lesson ini]; skenario replay 8 menit → 32 menit = drill GAGAL — yang diperbaiki langkahnya, bukan targetnya.",''', 1),
    ('        "Lab: disagreement 0,1942 + χ² 209,4730 signifikan (p < 0,0001); canary LANJUT → TAHAN → STOP → ROLLBACK.",',
     '        "Lab: disagreement 0,1942 + χ² 209,4730 signifikan (p < 0,0001); canary LANJUT → TAHAN → STOP → ROLLBACK; lab 3 rollback: total 29 menit < 30 menit [kebijakan lesson ini], skenario 32 menit = GAGAL.",', 1),
]

M84_MD_PAIRS = [
    # Seksi 2a setelah "## 2. Big-Bang vs Bertahap".
    ("""---

## 3. Shadow Mode — Challenger Memutuskan, tapi Tidak Bertindak""",
     """---

## 2a. Deployment Readiness: Dua Belas Item yang Diperiksa SEBELUM Satu Keputusan Pun Diambil

Shadow dan canary adalah pengaman untuk model yang SUDAH SIAP di-deploy — tapi «siap» itu sendiri harus diperiksa dulu. **Checklist 12 item** (semuanya harus lolos SEBELUM shadow dibuka): (1) input/output contract; (2) schema compatibility — fitur live = fitur latih; (3) feature freshness — tiap fitur tersedia tepat waktu; (4) fallback behavior — model gagal/slow → champion/manual, bukan error ke nasabah; (5) latency/capacity test — p95 di bawah SLA [kebijakan organisasi] pada traffic puncak; (6) logging — decision ID, model version, threshold, skor, fitur input (cukup untuk replay); (7) access control — deploy dan rollback oleh orang berbeda; (8) alert missing/late features — fitur hilang/telat → alert, bukan nilai default diam-diam; (9) model card lengkap (M8.3) — gerbang; (10) approval komite ditandatangani (M8.5); (11) deployment_id ditetapkan + bundle konfigurasi dibekukan (G13, M8.3); (12) rollback drill sudah dilakukan kuartal ini (G10).

**Skenario latihan [ilustrasi]:** 10 item lolos, 2 gagal — (3) PAY_AMT telat 2 jam (fitur turunan dihitung dari tagihan belum lengkap) dan (6) decision ID belum ditulis ke log (keputusan shadow tidak bisa di-replay). Vonis: deployment DIBLOKIR. Sepuluh yang lolos tidak menebus dua yang gagal — readiness adalah gerbang biner, seperti linkage (M8.3).

---

## 3. Shadow Mode — Challenger Memutuskan, tapi Tidak Bertindak""", 1),
    # Seksi 4a setelah "## 4. Canary".
    ("""---

## 5. Champion vs Challenger — Kalah di Laba, Kalah di Sel, dan Keputusannya Memang Berbeda""",
     """---

## 4a. Desain Eksperimen Canary: Traffic Persen Bukan Sampel — dan Ambang Tidak Digeser

Empat hal yang membuat canary menjadi eksperimen. **Satu — traffic % bukan effective sample size:** ramp 1% dari 12.000 = 120 nasabah, tapi bad rate dihitung atas yang DISETUJUI: 26. Sampel efektif R1 = 26 — satu default lagi saja mengubah 7,69% menjadi 11,54%. Aturan [kebijakan lesson ini]: STOP atas bad rate butuh n_approved ≥ 100 — di R1 STOP bahkan tidak eligible. Laporkan n, n_approved, DAN n_default per ramp. **Dua — assignment stabil:** hash(customer_id + garam) % 100 — nasabah yang sama selalu masuk arm yang sama; garam diganti tiap eksperimen; assignment SEBELUM scoring. Random per-request = kontaminasi. **Tiga — cohort sebanding:** jendela waktu dan campuran traffic SAMA; baca balance table (approval baseline, PSI antar-arm ≈ 0) SEBELUM membaca bad rate. **Empat — stopping rule tanpa menggeser ambang:** ambang LANJUT/TAHAN/STOP + minimum sampel ditulis dan ditandatangani SEBELUM ramp dibuka; mengubahnya sesudah melihat hasil adalah menggeser tiang gawang sesudah bola ditendang.

---

## 5. Champion vs Challenger — Kalah di Laba, Kalah di Sel, dan Keputusannya Memang Berbeda""", 1),
    # Seksi 6a setelah "## 6. Kriteria Naik".
    ("""---

## 7. Monitoring Gates — Metrik Go/No-Go di Tiap Ramp (Tanpa Mengajar Ulang M7.5)""",
     """---

## 6a. Decision Matrix: Superiority, Non-Inferiority, Equivalence, atau Reject

Empat keputusan dari tujuh gate. **Superiority:** challenger menang di SEMUA gate dengan margin → naik. **Non-inferiority:** challenger tidak lebih buruk dalam margin → naik HANYA bila ada manfaat lain (lebih sederhana/cepat/mudah dijelaskan). **Equivalence:** challenger ≈ champion dalam margin → naik hanya bila ada manfaat operasional yang jelas; bila tidak, tetap champion. **Reject:** gagal satu hard gate → stop/rollback. Margin [kebijakan lesson ini]: ROC-AUC 0,01; profit NT$500.000; bad rate 1,00 pp.

**Challenger LR:** ROC −0,039 (hampir 4× margin), profit −NT$6.391.000 (hampir 13× margin), bad rate +2,47 pp (lebih dari 2× margin) → REJECT — konsisten dengan mini-case. **Hard constraints** (tidak bisa ditukar): fairness AIR ≥ 0,80 [kebijakan M7.5]; ECE ≤ 0,02 [kebijakan lesson ini]. **Trade-off dalam margin** dieskalasikan ke komite (M8.5) — deployer tidak memutuskan sendiri; pelanggaran hard constraint tidak pernah dieskalasikan: itu REJECT.

---

## 7. Monitoring Gates — Metrik Go/No-Go di Tiap Ramp (Tanpa Mengajar Ulang M7.5)""", 1),
    # Lab 3 .md setelah Lab 2 (jangkar "## Guided task di Colab").
    ("""---

## Guided Task di Colab

Guided task di Colab — notebook: colab/mlf-m84-guided-task.ipynb""",
     """---

## Lab 3: Rollback Tabletop — Runbook di Bawah 30 Menit, atau Drill-nya Gagal

Runbook 10 bagian + menit [ilustrasi]: trigger 2, authority 2, commands/steps 3, configuration bundle 5, validation 5, queued decisions 3, replay/reconciliation 5, communication 2, incident ticket 1, post-mortem 1 — total 29 menit.

Hasil [lab]: total_time=29; n_sections=10; rollback_valid=True; total_time_scenario=32; rollback_valid_scenario=False. rollback_valid = total < 30 menit DAN bundle dipin DAN langkah validasi ada. Skenario: replay memakan 8 menit (bukan 5) → total 32 menit, melewati target — drill GAGAL; yang diperbaiki adalah langkah replay-nya, bukan targetnya.

---

## Guided Task di Colab

Guided task di Colab — notebook: colab/mlf-m84-guided-task.ipynb""", 1),
    # Rangkuman .md: tambah 4 bullet setelah bullet canary; update bullet lab.
    ('- Canary [simulasi]: 1% LANJUT (bad 7,69%), 5% TAHAN (bad 8,94%), 5% diperpanjang STOP (bad 9,15%, TAHAN kedua) → ROLLBACK; 25% dan 100% tidak dicapai.',
     '''- Canary [simulasi]: 1% LANJUT (bad 7,69%), 5% TAHAN (bad 8,94%), 5% diperpanjang STOP (bad 9,15%, TAHAN kedua) → ROLLBACK; 25% dan 100% tidak dicapai.
- Deployment readiness: 12 item — 2 gagal [ilustrasi] = deployment DIBLOKIR; readiness gerbang biner, bukan skor.
- Desain eksperimen canary: sampel efektif bad rate R1 = 26 yang disetujui (bukan 120 traffic); assignment hash(customer_id) stabil per nasabah; cohort sebanding (balance check dulu); STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]; ambang ditulis SEBELUM ramp dibuka.
- Decision matrix: superiority / non-inferiority / equivalence / reject — margin ROC-AUC 0,01, profit NT$500.000, bad rate 1,00 pp [kebijakan lesson ini]; hard constraint fairness AIR ≥ 0,80 dan ECE ≤ 0,02 tidak bisa ditukar profit; LR = REJECT.
- Rollback drill: runbook 10 bagian, total 29 menit < target 30 menit [kebijakan lesson ini]; skenario replay 8 menit → 32 menit = drill GAGAL.''', 1),
    ('- Lab: disagreement 0,1942 + χ² 209,4730 signifikan (p < 0,0001); canary LANJUT → TAHAN → STOP → ROLLBACK.',
     '- Lab: disagreement 0,1942 + χ² 209,4730 signifikan (p < 0,0001); canary LANJUT → TAHAN → STOP → ROLLBACK; lab 3 rollback: total 29 menit < 30 menit [kebijakan lesson ini], skenario 32 menit = GAGAL.', 1),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()
    ok = True
    ok = apply(M84, M84_PAIRS, args.dry) and ok
    ok = apply(M84_MD, M84_MD_PAIRS, args.dry) and ok
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
