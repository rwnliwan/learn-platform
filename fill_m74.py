#!/usr/bin/env python3
"""Fill gap Luna M7 — M7.4: G6 (protokol validasi) + G10 (template tata kelola).
Insert G6 after 'cerita', G10 after 'dokumentasi'; renumber eyebrows;
update 'langkah N' refs (+1 for steps >= 2); Peta lesson; estMinutes 70->80;
2 checkpoint quizzes; summary bullets. TS + .md mirror.
Run: python3 fill_m74.py (from ~/workspace/learn-platform). Verifies with tsc after.
"""
import re
from pathlib import Path

TS = Path("src/app/v2/content/mlf-m74-fairness-mitigation.ts")
MD = Path("content/mlf-m74-fairness-mitigation.md")

G6_BLOCK = '''    {
      id: "protokol-validasi",
      eyebrow: "Langkah 2 · Protokol validasi",
      title: "Protokol validasi mitigasi: pilih di validation, laporkan di test yang belum tersentuh",
      prose: [
        "Semua angka mitigasi di lesson ini — reweighing AIR 0,9567, resampling 0,9788, hapus fitur 0,9211, in-processing 0,9233, threshold per grup 0,9999, lima titik Pareto — dihitung pada test 6.000 yang SAMA. Itu bukan kecelakaan: satu test yang sama membuat kelima mitigasi bisa dibandingkan apel dengan apel (M7.1). Tapi ada harga yang harus dibayar untuk kenyamanan itu: begitu kamu MEMILIH mitigasi, target AIR, λ, atau threshold dengan melihat hasil di test yang sama, angka yang kamu laporkan bukan lagi estimasi yang jujur — ia estimasi yang sudah memilih dirinya sendiri sebagai yang terbaik. Seperti M7.1 dan M7.3 yang sudah melabelinya, angka-angka mitigasi lesson ini adalah HASIL ILUSTRASI PROTOKOL LESSON: mereka mengilustrasikan METODE — cara menghitung reweighing, cara kerja threshold per grup, bentuk kurva Pareto — bukan hasil final yang boleh dilaporkan ke komite sebagai «model kami mencapai AIR 0,9999».",
        "Nilai: protokol yang benar memakai TIGA bagian data, bukan dua. TRAIN (24.000): latih model, hitung bobot reweighing, pasang kalibrasi. VALIDATION / KALIBRASI: pilih keluarga mitigasi, pilih target AIR, pilih λ, pilih threshold per grup — SEMUA keputusan pemilihan terjadi di sini. TEST FINAL (6.000): belum tersentuh selama pemilihan — dipakai SEKALI untuk melaporkan hasil akhir. Inilah three-way split M6.4 (langkah 4) — lesson ini tidak mengajar ulang split-nya, hanya menerapkan aturannya ke mitigasi: data yang dipakai MEMILIH kebijakan harus berbeda dari data yang dipakai MELAPORKAN hasil kebijakan itu. Bila datanya sama, yang dilaporkan adalah skor terbaik dari sekian percobaan — dan skor terbaik dari sekian percobaan selalu terlihat lebih baik daripada kenyataannya (winner's curse, M6.5).",
        "Gambar: tiap keluarga menyentuh pipeline di titik yang berbeda — dan tiap titik punya «data pemilihan»-nya sendiri. Pre-processing (reweighing, resampling, hapus fitur) dihitung dari TRAIN — di lesson ini reweighing memang dihitung dari train 24.000, dan itu sudah benar. In-processing (constraint saat latih) dipilih dan ditala di VALIDATION. Post-processing (threshold per grup, λ Pareto) dipilih di VALIDATION, lalu dilaporkan di TEST. Yang SALAH di lesson ini — dan diakui terbuka sebagai ilustrasi — adalah λ dan threshold per grup dipilih sambil melihat test 6.000 yang sama: lima titik λ dievaluasi di test, lalu λ = 1 (AIR 0,9999, profit +NT$8.504.500) dilaporkan sebagai «titik terbaik». Titik itu memang terbaik DI TEST — tapi tanpa holdout yang belum tersentuh, kamu tidak tahu berapa yang tersisa bila diukur ulang.",
        "Baik atau buruk: tiga bagian data ini bagus karena ia membuat satu pertanyaan yang tajam — «angka ini dipilih di mana, dilaporkan di mana?» — dan jawaban yang jujur selalu bisa ditulis dalam satu baris. Buruk bila dibaca sebagai «jadi angka lesson ini tidak berguna»: angka ilustrasi tetap berguna untuk MEMBANDINGKAN metode (reweighing vs threshold per grup) dan untuk mempelajari BENTUK trade-off-nya (kurva Pareto yang menurun, biaya yang turun) — yang tidak boleh adalah membawanya ke komite sebagai estimasi final tanpa pengukuran ulang. Dan buruk bila protokol ini dibaca sebagai birokrasi: memisahkan validation dari test tidak butuh data baru — cukup potong test-mu menjadi dua SEBELUM memilih apa pun (M6.2, nested CV, adalah versi yang sama untuk tuning).",
        "Mitigasi: sebelum mitigasi apa pun masuk produksi, jawab TIGA pertanyaan ini secara tertulis — dan tulis jawabannya di samping angka hasilmu. (1) Threshold / λ / target AIR dipilih dari data apa? (2) Kalibrasi (Platt/sigmoid) dipasang pada data apa? (3) Metrik fairness yang dilaporkan (AIR, selisih FPR/FNR) dihitung pada data apa — dan apakah data itu sudah dipakai untuk satu dari dua pertanyaan sebelumnya? Bila jawaban (3) sama dengan jawaban (1) atau (2), angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON — beri label itu, dan ukur ulang pada holdout sebelum melaporkannya sebagai hasil final.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Alur data tiga bagian: train 24 ribu untuk latih dan pre-processing, validasi untuk memilih lambda dan threshold, test 6 ribu yang belum tersentuh untuk laporan final">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Pilih di VALIDASI — laporkan di TEST yang belum tersentuh</text>
<rect x="16" y="48" width="128" height="52" fill="var(--c1)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="176" y="48" width="128" height="52" fill="var(--c4)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="336" y="48" width="128" height="52" fill="var(--c2)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="146" y1="74" x2="174" y2="74" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="174,74 166,70 166,78" fill="var(--chart-text)"/>
<line x1="306" y1="74" x2="334" y2="74" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="334,74 326,70 326,78" fill="var(--chart-text)"/>
<text x="80" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TRAIN</text>
<text x="80" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">24.000 baris</text>
<text x="240" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">VALIDASI</text>
<text x="240" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">kalibrasi</text>
<text x="400" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TEST</text>
<text x="400" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">6.000, belum tersentuh</text>
<line x1="80" y1="100" x2="80" y2="122" stroke="var(--c1)" stroke-width="2"/>
<polygon points="80,130 75,120 85,120" fill="var(--c1)"/>
<text x="80" y="146" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PRE + IN</text>
<text x="80" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">reweighing, resampling,</text>
<text x="80" y="174" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">hapus fitur, constraint</text>
<line x1="240" y1="100" x2="240" y2="122" stroke="var(--c4)" stroke-width="2"/>
<polygon points="240,130 235,120 245,120" fill="var(--c4)"/>
<text x="240" y="146" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">POST: PILIH</text>
<text x="240" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">λ, threshold per grup,</text>
<text x="240" y="174" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">target AIR</text>
<line x1="400" y1="100" x2="400" y2="122" stroke="var(--c2)" stroke-width="2"/>
<polygon points="400,130 395,120 405,120" fill="var(--c2)"/>
<text x="400" y="146" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">LAPOR: SEKALI</text>
<text x="400" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">hasil final, tanpa</text>
<text x="400" y="174" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">pemilihan ulang</text>
<text x="240" y="206" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Yang dipilih di TEST bukan lagi estimasi yang jujur — ia skor terbaik dari sekian percobaan.</text>
<text x="240" y="222" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Di lesson ini λ dan threshold dipilih sambil melihat test — angka-angkanya ilustrasi, bukan evaluasi final.</text>
<text x="240" y="238" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Three-way split: M6.4 langkah 4. Winner's curse: M6.5.</text>
</svg>`,
        alt: "Alur data tiga bagian: train 24 ribu untuk latih dan pre-processing, validasi untuk memilih lambda dan threshold, test 6 ribu yang belum tersentuh untuk laporan final.",
        caption: "Cara membaca: panah mengalir dari train ke validasi ke test. Pre-processing dan in-processing dihitung/ditala di train; pemilihan λ, threshold per grup, dan target AIR terjadi di validasi; test yang belum tersentuh dipakai SEKALI untuk laporan final. Di lesson ini λ dan threshold dipilih sambil melihat test 6.000 yang sama — angka-angkanya adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan evaluasi final (three-way split: M6.4 langkah 4).",
      },
      tasks: [],
    },
'''

G10_BLOCK = '''    {
      id: "governance-template",
      eyebrow: "Langkah 12 · Template tata kelola",
      title: "Template tata kelola: satu halaman yang membuat keputusanmu bisa direproduksi",
      prose: [
        "Dokumentasi keputusan (langkah 11) menjawab «mengapa mitigasi ini dipilih» — tapi ia belum menjawab «model dan data MANA yang menghasilkan keputusan ini, dan bagaimana cara mengembalikannya bila gagal». Enam bulan lagi, seseorang membuka file ini dan bertanya: threshold 0,1058/0,0965 itu berlaku untuk model versi berapa? Data snapshot yang mana? Kode notebook yang mana — yang sebelum atau sesudah perbaikan bug terakhir? Tanpa jawaban itu, keputusanmu tidak bisa direproduksi — dan keputusan yang tidak bisa direproduksi tidak bisa diaudit. Template tata kelola satu halaman ini adalah jawabannya: sepuluh kolom wajib, diisi untuk SETIAP perubahan yang masuk produksi.",
        "Nilai: sepuluh kolom wajib — diisi dengan contoh keputusan M7.4-01 dari lesson ini. (1) Model version: GBM terkalibrasi Platt/sigmoid, seed 42, 31 fitur flagship v1. (2) Feature schema version: 31 fitur (23 mentah + 8 turunan, M1) — bila satu fitur berubah definisinya, versinya naik. (3) Calibration version: Platt/sigmoid, CalibratedClassifierCV cv=3. (4) Threshold policy version: v1 threshold tunggal 0,10 → v2 threshold per grup 0,1058/0,0965 (target approval 0,285). (5) Data snapshot: UCI Default of Credit Card Clients, 30.000 baris, split stratified seed 42 (train 24.000, test 6.000). (6) Code/notebook hash: hash commit atau hash notebook yang menghitung angka-angka itu — bukan «notebook terbaru». (7) Approval date: tanggal komite menyetujui v2. (8) Owner: nama penanggung jawab mitigasi ini. (9) Rollback version: threshold tunggal 0,10 (v1) — versi yang berlaku bila v2 dicabut. (10) Alasan perubahan: AIR SEX 0,869 pada v1, target AIR minimum 0,95, harga yang diterima (pita inversi 92 vs 151, pertimbangan legalitas). Sepuluh kolom, satu halaman — dan siapa pun bisa merekonstruksi keputusan itu tanpa meneleponmu.",
        "Baik atau buruk: template ini bagus karena ia mengubah «keputusan» menjadi «artefak» — sesuatu yang bisa dicari, dibandingkan antar versi, dan dibuka saat audit. Buruk bila diisi SEBAGIAN: paket yang berisi model version, threshold policy, approval date, dan owner — tapi tanpa data snapshot dan code hash — TIDAK bisa direproduksi: tidak ada yang bisa membuktikan data dan kode mana yang menghasilkan angka AIR 0,9999 itu. Sembilan dari sepuluh kolom bukan «hampir lengkap» — untuk reproduksi, satu kolom yang hilang bisa berarti seluruh paket tidak bisa diverifikasi. Dan buruk bila rollback version kosong: perubahan tanpa versi pengembali adalah perubahan yang tidak bisa dibatalkan — bila v2 gagal (AIR jatuh, ECE rusak, review hukum menolak), tim akan mengarang penggantinya di tengah krisis.",
        "Mitigasi: pasangkan template ini dengan workflow change control ENAM gerbang — (1) proposal: tuliskan template ini DULU, sebelum satu baris kode berubah; (2) offline validation: ukur paket lengkap (AIR, FPR/FNR, biaya, profit, kalibrasi) pada validation yang belum dipakai memilih; (3) legal/risk approval: penasihat hukum dan risk manager menandatangani template-nya — bukan slide-nya; (4) shadow/canary: jalankan v2 berdampingan dengan v1 pada sebagian trafik, bandingkan keputusan per nasabah; (5) production: v2 berlaku, v1 menjadi rollback version; (6) rollback criteria — ditulis SEBELUM produksi: cabut v2 bila AIR SEX jatuh di bawah 0,80 selama 2 periode berturut-turut, atau ECE di atas 0,02 bertahan, atau review hukum menolak — dan kembalikan v1 (threshold tunggal 0,10). Monitoring M7.5 adalah yang memberi sinyal untuk gerbang (6): alert WASPADA/KRITIS di sana adalah pemicu peninjauan template ini. Detail model card dan model risk governance adalah materi M8 — template ini hanya memastikan keputusan M7.4 bisa DIBAWA ke sana tanpa kehilangan jejak.",
      ],
      tasks: [],
    },
'''

G6_QUIZ = '''        {
          q: "Lima λ dicoba di test 6.000; titik terbaik λ = 1 (AIR 0,9999, profit +NT$8.504.500) dilaporkan sebagai hasil final tanpa holdout yang belum tersentuh. Bolehkah titik itu dilaporkan sebagai estimasi final yang unbiased?",
          options: [
            { text: "Tidak — titik terbaik yang dipilih dari test yang sama itu optimistis (winner's curse): protokol yang benar memilih λ di validation dan melaporkannya di test yang belum tersentuh", why: "Benar: λ = 1 dipilih KARENA terlihat terbaik di test 6.000 yang sama — skor terbaik dari sekian percobaan selalu terlihat lebih baik daripada kenyataannya (M6.5). Angka-angka mitigasi lesson ini adalah HASIL ILUSTRASI PROTOKOL LESSON: mereka mengilustrasikan metode dan bentuk trade-off-nya, bukan hasil final. Evaluasi final butuh holdout yang belum dipakai memilih (three-way split, M6.4 langkah 4).", correct: true },
            { text: "Boleh — λ = 1 juga memberi profit tertinggi (+NT$8.504.500), jadi ia terbaik menurut dua metrik sekaligus", why: "Salah: profit tertinggi DI TEST yang sama adalah bagian dari masalah yang sama — ia juga dipilih dari data yang sama. Dua metrik yang optimistis tidak saling mengoreksi; keduanya perlu diukur ulang pada holdout." },
            { text: "Boleh — AIR 0,9999 sudah melewati ambang 0,80 dengan jauh, jadi tidak ada lagi yang perlu dibuktikan", why: "Salah: melewati ambang tidak memperbaiki bias seleksi. AIR 0,9999 yang dipilih dari lima percobaan di test yang sama bisa jadi lebih rendah bila diukur pada data yang belum dipakai memilih — ambang yang dilewati angka optimistis bukan bukti." },
            { text: "Tidak boleh — λ yang benar adalah 0,62 (interpolasi), bukan 1, jadi titik λ = 1 salah", why: "Salah alasan: λ = 0,62 adalah titik untuk TARGET AIR 0,95 — bukan «λ yang benar» secara umum. Masalahnya bukan nilai λ-nya, melainkan PROTOKOLNYA: titik mana pun yang dipilih dari test yang sama lalu dilaporkan sebagai final adalah optimistis, termasuk λ = 0,62." },
          ],
        },
'''

G10_QUIZ = '''        {
          q: "Paket keputusan mitigasi berisi model version, threshold policy (0,1058/0,0965), approval date, dan owner — tapi TIDAK berisi data snapshot dan code/notebook hash. Apa risikonya?",
          options: [
            { text: "Keputusan tidak bisa direproduksi — tidak ada yang bisa membuktikan data dan kode mana yang menghasilkan angka AIR 0,9999 itu", why: "Benar: reproduksi butuh SEPULUH kolom — data snapshot (UCI 30.000, split seed 42) dan code hash adalah yang mengikat angka ke sumbernya. Tanpa keduanya, paket itu hanya klaim dengan nama penanggung jawab: angkanya tidak bisa diperiksa ulang, dan audit setahun kemudian tidak bisa membedakan «angka dari model v2» dari «angka dari model yang lain».", correct: true },
            { text: "Tidak ada risiko — angka hasil (AIR, biaya, profit) sudah cukup untuk membuktikan keputusan itu benar", why: "Salah: angka hasil tanpa sumbernya tidak bisa diperiksa ulang. AIR 0,9999 bisa berasal dari model, data, atau kode apa saja — tanpa snapshot dan hash, tidak ada yang bisa membuktikan ia berasal dari v2." },
            { text: "Risikonya hanya administratif — audit akan meminta dokumen tambahan, tapi keputusannya tetap sah", why: "Salah arah: audit yang tidak bisa mereproduksi angka adalah audit yang GAGAL — bukan yang «meminta dokumen tambahan». Keputusan yang tidak bisa diperiksa ulang bukan keputusan yang sah secara tata kelola." },
            { text: "Risikonya kecil — cukup tambahkan nama penyetuju kedua dan paketnya lengkap", why: "Salah: nama penyetuju tidak menggantikan data snapshot dan code hash. Dua nama tidak membuat angka bisa direproduksi; yang membuat bisa direproduksi adalah jejak data dan kode." },
          ],
        },
'''

def renumber_eyebrows(text):
    """Renumber all `eyebrow: "Langkah N ..."` sequentially in file order."""
    n = [0]

    def repl(m):
        n[0] += 1
        return f'eyebrow: "Langkah {n[0]}{m.group(1)}'

    return re.sub(r'eyebrow: "Langkah \d+([^"]*)"', repl, text), n[0]


def main():
    ts = TS.read_text(encoding="utf-8")
    orig_steps = ts.count('eyebrow: "Langkah')

    # 1) 'langkah N' refs: G6 insert shifts steps >= 2 by +1.
    # Order matters: multi-token first, then descending singles.
    ts = ts.replace("langkah 6–7", "langkah 7–8")
    ts = re.sub(r"langkah 10\b", "langkah 11", ts)
    ts = re.sub(r"langkah 9\b", "langkah 10", ts)
    ts = re.sub(r"langkah 7\b", "langkah 8", ts)
    ts = re.sub(r"langkah 3\b", "langkah 4", ts)
    ts = re.sub(r"langkah 2\b", "langkah 3", ts)

    # 2) Insert G6 before peta-mitigasi; G10 before lab1.
    anchor_peta = '    {\n      id: "peta-mitigasi",'
    assert anchor_peta in ts, "anchor peta-mitigasi hilang"
    ts = ts.replace(anchor_peta, G6_BLOCK + anchor_peta, 1)
    anchor_lab1 = '    {\n      id: "lab1",'
    assert anchor_lab1 in ts, "anchor lab1 hilang"
    ts = ts.replace(anchor_lab1, G10_BLOCK + anchor_lab1, 1)

    # 3) Renumber eyebrows sequentially.
    ts, n_steps = renumber_eyebrows(ts)
    assert n_steps == 15, f"steps M7.4 harus 15, dapat {n_steps}"

    # 4) Peta lesson: tambahkan dua langkah baru.
    old_peta = "Peta lesson: cerita AIR 0,869 → peta tiga keluarga mitigasi"
    new_peta = ("Peta lesson: cerita AIR 0,869 → protokol validasi mitigasi "
                "(pilih di validation, laporkan di test yang belum tersentuh) → "
                "peta tiga keluarga mitigasi")
    assert old_peta in ts
    ts = ts.replace(old_peta, new_peta, 1)
    old_peta2 = "→ dokumentasi keputusan mitigasi → 2 lab → checkpoint."
    new_peta2 = ("→ dokumentasi keputusan mitigasi → template tata kelola satu halaman "
                 "(versi, snapshot, rollback) → 2 lab → checkpoint.")
    assert old_peta2 in ts
    ts = ts.replace(old_peta2, new_peta2, 1)

    # 5) estMinutes 70 -> 80.
    ts = ts.replace("estMinutes: 70,", "estMinutes: 80,", 1)

    # 6) Two checkpoint quizzes (before summary).
    anchor_q = "      ],\n      summary: ["
    assert anchor_q in ts
    ts = ts.replace(anchor_q, G6_QUIZ + G10_QUIZ + anchor_q, 1)

    # 7) Summary bullets: insert after Dokumentasi bullet, before Lab bullet.
    anchor_lab = '        "Lab: AIR 0,8693 / 1,1502'
    assert anchor_lab in ts
    new_bullets = (
        '        "Protokol validasi [ilustrasi protokol lesson]: SEMUA angka mitigasi '
        'di lesson ini dihitung pada test 6.000 yang sama — reweighing dihitung dari '
        'train (benar), tapi λ, target AIR, dan threshold per grup dipilih sambil '
        'melihat test. Protokol benar: train → validation (pilih mitigasi/λ/threshold) '
        '→ test final yang belum tersentuh (laporkan sekali); three-way split M6.4.",\n'
        '        "Template tata kelola: sepuluh kolom wajib (model version, feature schema '
        'version, calibration version, threshold policy version, data snapshot, code/notebook '
        'hash, approval date, owner, rollback version, alasan perubahan) + change control '
        'enam gerbang (proposal → offline validation → legal/risk approval → shadow/canary → '
        'production → rollback criteria); rollback v2 = threshold tunggal 0,10.",\n'
    )
    ts = ts.replace(anchor_lab, new_bullets + anchor_lab, 1)

    TS.write_text(ts, encoding="utf-8")
    print(f"M7.4 TS: {orig_steps} -> {n_steps} steps, est 80, +2 quiz, +2 summary")

    # ---- .md mirror ----
    md = MD.read_text(encoding="utf-8")
    # Insert G6 section after "## 1." section, before "## 2. Tiga Keluarga".
    anchor_md2 = "## 2. Tiga Keluarga Mitigasi"
    assert anchor_md2 in md
    g6_md = """## 2. Protokol Validasi Mitigasi: Pilih di Validation, Laporkan di Test yang Belum Tersentuh

Semua angka mitigasi di lesson ini — reweighing AIR 0,9567, resampling 0,9788, hapus fitur 0,9211, in-processing 0,9233, threshold per grup 0,9999, lima titik Pareto — dihitung pada test 6.000 yang SAMA. Begitu kamu MEMILIH mitigasi, target AIR, λ, atau threshold dengan melihat hasil di test yang sama, angka yang dilaporkan bukan lagi estimasi yang jujur — ia sudah memilih dirinya sendiri sebagai yang terbaik. Seperti M7.1 dan M7.3 yang sudah melabelinya, angka-angka ini adalah HASIL ILUSTRASI PROTOKOL LESSON: mereka mengilustrasikan METODE, bukan hasil final yang boleh dilaporkan ke komite sebagai «model kami mencapai AIR 0,9999».

**Protokol benar — tiga bagian data:** TRAIN (24.000): latih model, hitung bobot reweighing, pasang kalibrasi. VALIDATION / KALIBRASI: pilih keluarga mitigasi, target AIR, λ, threshold per grup — SEMUA keputusan pemilihan terjadi di sini. TEST FINAL (6.000): belum tersentuh selama pemilihan — dipakai SEKALI untuk laporan akhir. Ini three-way split M6.4 (langkah 4): data yang dipakai MEMILIH kebijakan harus berbeda dari data yang dipakai MELAPORKAN hasil kebijakan itu. Bila datanya sama, yang dilaporkan adalah skor terbaik dari sekian percobaan — dan skor terbaik dari sekian percobaan selalu terlihat lebih baik daripada kenyataannya (winner's curse, M6.5).

**Baik/buruk:** tiga bagian data ini bagus karena ia membuat satu pertanyaan tajam — «angka ini dipilih di mana, dilaporkan di mana?» Buruk bila dibaca sebagai «jadi angka lesson ini tidak berguna»: angka ilustrasi tetap berguna untuk MEMBANDINGKAN metode dan mempelajari BENTUK trade-off-nya — yang tidak boleh adalah membawanya ke komite sebagai estimasi final tanpa pengukuran ulang.

**Mitigasi:** sebelum mitigasi apa pun masuk produksi, jawab TIGA pertanyaan ini secara tertulis. (1) Threshold / λ / target AIR dipilih dari data apa? (2) Kalibrasi dipasang pada data apa? (3) Metrik fairness yang dilaporkan dihitung pada data apa — dan apakah data itu sudah dipakai untuk satu dari dua pertanyaan sebelumnya? Bila jawaban (3) sama dengan jawaban (1) atau (2), angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON — beri label itu, dan ukur ulang pada holdout sebelum melaporkannya sebagai hasil final.

---

"""
    md = md.replace(anchor_md2, g6_md + anchor_md2, 1)
    # Insert G10 section before "## 11. Lab 1" (which after G6 insert is still numbered 11
    # in the old file — renumbering happens after both inserts).
    anchor_md_lab = "## 11. Lab 1:"
    assert anchor_md_lab in md
    g10_md = """## 12. Template Tata Kelola: Satu Halaman yang Membuat Keputusanmu Bisa Direproduksi

Dokumentasi keputusan menjawab «mengapa mitigasi ini dipilih» — tapi belum menjawab «model dan data MANA yang menghasilkan keputusan ini, dan bagaimana cara mengembalikannya bila gagal». Template tata kelola satu halaman: sepuluh kolom wajib untuk SETIAP perubahan yang masuk produksi. (1) Model version: GBM terkalibrasi Platt/sigmoid, seed 42, 31 fitur flagship v1. (2) Feature schema version: 31 fitur (23 mentah + 8 turunan). (3) Calibration version: Platt/sigmoid, cv=3. (4) Threshold policy version: v1 threshold tunggal 0,10 → v2 threshold per grup 0,1058/0,0965 (target approval 0,285). (5) Data snapshot: UCI 30.000 baris, split seed 42 (train 24.000, test 6.000). (6) Code/notebook hash. (7) Approval date. (8) Owner. (9) Rollback version: threshold tunggal 0,10 (v1). (10) Alasan perubahan: AIR SEX 0,869 pada v1, target AIR minimum 0,95, harga yang diterima (pita inversi 92 vs 151, pertimbangan legalitas).

**Baik/buruk:** template ini bagus karena ia mengubah «keputusan» menjadi «artefak» yang bisa dicari dan dibuka saat audit. Buruk bila diisi SEBAGIAN: paket tanpa data snapshot dan code hash TIDAK bisa direproduksi — sembilan dari sepuluh kolom bukan «hampir lengkap». Dan buruk bila rollback version kosong: perubahan tanpa versi pengembali adalah perubahan yang tidak bisa dibatalkan.

**Mitigasi:** workflow change control ENAM gerbang — (1) proposal: tulis template ini DULU; (2) offline validation: ukur paket lengkap pada validation yang belum dipakai memilih; (3) legal/risk approval: penasihat hukum dan risk manager menandatangani template-nya; (4) shadow/canary: jalankan v2 berdampingan dengan v1; (5) production: v2 berlaku, v1 menjadi rollback version; (6) rollback criteria — ditulis SEBELUM produksi: cabut v2 bila AIR SEX jatuh di bawah 0,80 selama 2 periode berturut-turut, atau ECE di atas 0,02 bertahan, atau review hukum menolak — dan kembalikan v1. Monitoring M7.5 memberi sinyal untuk gerbang (6). Detail model card dan model risk governance adalah materi M8.

---

"""
    md = md.replace(anchor_md_lab, g10_md + anchor_md_lab, 1)
    # Renumber "## N." headings sequentially in order (skip Masalah/Guided/Rangkuman).
    nums = [0]

    def renum_md(m):
        nums[0] += 1
        return f"## {nums[0]}. {m.group(2)}"

    md = re.sub(r"^## (\d+)\. (.*)$", renum_md, md, flags=re.M)
    # Rangkuman: tambahkan dua butir sebelum butir Lab.
    anchor_rangk = "- Lab: AIR 0,8693"
    assert anchor_rangk in md
    md = md.replace(
        anchor_rangk,
        "- Protokol validasi: semua angka mitigasi dihitung pada test 6.000 yang sama (HASIL ILUSTRASI PROTOKOL LESSON); protokol benar train → validation (pilih) → test final (laporkan sekali); three-way split M6.4.\n"
        "- Template tata kelola: sepuluh kolom wajib + change control enam gerbang; rollback v2 = threshold tunggal 0,10.\n"
        + anchor_rangk, 1)
    MD.write_text(md, encoding="utf-8")
    print(f"M7.4 MD: sections renumbered to {nums[0]}")


if __name__ == "__main__":
    main()
