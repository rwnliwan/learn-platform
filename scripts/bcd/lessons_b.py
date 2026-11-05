#!/usr/bin/env python3
"""Track B: Probabilitas — 19 lessons."""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
from render import Lesson, T, TI, myth, tip, callout, worked, codebox, qa_lesson

LESSONS = []

# ================================================================== B1
def b1():
    L = Lesson("b1-aksioma-peluang", "B1 — Probabilitas",
        "Peluang: Tiga Aturan<br/>yang Mengatur Ketidakpastian",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("/", "Daftar Materi"), ("b2-kombinatorik", "Next: B2"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Mendefinisikan ruang sampel dan kejadian, lalu menghitung peluang klasik " + TI(r"P(A) = n(A)/n(S)") + ".</li>"
        "<li>Menerapkan tiga aksioma peluang dan aturan komplemen, penjumlahan, dan perkalian.</li>"
        "<li>Membedakan <strong>independen</strong> vs <strong>saling lepas</strong> — dua konsep yang paling sering tertukar.</li>"
        "<li>Menghitung peluang gabungan dengan benar (tidak asal tambah atau asal kali).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;5% Gagal Bayar&rdquo; Itu Artinya Apa?")
    L.raw('<div className="story"><p>Risk manager bank mengumumkan: <em>&ldquo;Peluang gagal bayar portofolio kita 5%.&rdquo;</em> Direksi mengangguk tenang. Tapi analis junior bertanya: <em>&ldquo;Artinya dari 100 nasabah, pasti 5 yang gagal bayar?&rdquo;</em></p>'
        "<p>Jawabannya <strong>tidak</strong>. Peluang 5% bukan janji bahwa tepat 5 dari 100 akan gagal. Artinya: jika pola yang sama diulang berkali-kali dalam kondisi sama, <strong>dalam jangka panjang</strong> sekitar 5% yang gagal — tapi 100 nasabah konkret berikutnya bisa 2, bisa 9, bisa 0. Peluang mengatur <em>ketidakpastian</em>, bukan meramal satu kejadian.</p>"
        "<p>Lesson ini membangun fondasinya: tiga aturan sederhana yang mengatur seluruh teori peluang — dari dadu sampai model risiko kredit.</p></div>")

    L.sec("ruang", "Ruang Sampel &amp; Kejadian — Panggungnya Dulu")
    L.p("<strong>Definisi.</strong> <strong>Ruang sampel</strong> (" + TI(r"S") + ") adalah himpunan semua hasil yang mungkin. <strong>Kejadian</strong> (" + TI(r"A") + ") adalah himpunan bagian dari " + TI(r"S") + " yang kita minati.")
    L.p("<strong>Contoh.</strong> Lempar satu dadu: " + TI(r"S = \{1,2,3,4,5,6\}") + ". Kejadian &ldquo;muncul genap&rdquo;: " + TI(r"A = \{2,4,6\}") + ".")
    L.p("<strong>Peluang klasik</strong> (semua hasil equally likely):")
    L.p(T(r"P(A) = \frac{n(A)}{n(S)}"))
    L.ul([
        TI(r"n(A)") + ": banyak hasil yang termasuk kejadian " + TI(r"A"),
        TI(r"n(S)") + ": banyak seluruh hasil yang mungkin",
    ])
    L.p("<strong>Contoh langkah-demi-langkah.</strong> Peluang dadu muncul &gt; 4: " + TI(r"A=\{5,6\}") + " → " + TI(r"n(A)=2") + ", " + TI(r"n(S)=6") + " → " + T(r"P(A) = \frac{2}{6} = \frac{1}{3}", block=False) + ".")
    L.p("<strong>Kepribadian:</strong> ruang sampel adalah &ldquo;panggung&rdquo; — sebelum menghitung peluang apapun, tanyakan dulu: <em>apa semua hasil yang mungkin?</em> Separuh kesalahan peluang berasal dari salah mendefinisikan " + TI(r"S") + ".")
    L.raw(tip("Tulis " + TI(r"S") + " dulu sebelum menghitung. Untuk dua koin: " + TI(r"S=\\{AA, AG, GA, GG\\}") + " — bukan " + TI(r"\\{0,1,2\\}") + " angka! &ldquo;Satu angka&rdquo; dan &ldquo;dua angka&rdquo; tidak equally likely."))

    L.sec("aksioma", "Tiga Aksioma Kolmogorov — Konstitusi Peluang")
    L.p("Tahun 1933, matematikawan Andrey Kolmogorov merumuskan tiga aksioma. Semua aturan peluang — serumit apapun — adalah konsekuensi dari tiga ini:")
    L.p(T(r"1.\quad P(S) = 1 \qquad 2.\quad P(A) \geq 0 \text{ untuk setiap } A \qquad 3.\quad A \cap B = \emptyset \Rightarrow P(A \cup B) = P(A) + P(B)"))
    L.ul([
        "<strong>Aksioma 1:</strong> sesuatu pasti terjadi — total peluang seluruh hasil = 1 (atau 100%).",
        "<strong>Aksioma 2:</strong> peluang tidak pernah negatif.",
        "<strong>Aksioma 3:</strong> untuk kejadian yang <strong>saling lepas</strong> (tidak bisa terjadi bersama), peluang &ldquo;salah satu terjadi&rdquo; = jumlah peluangnya.",
    ])
    L.p("<strong>Artinya tiap simbol:</strong> " + TI(r"\cup") + " = &ldquo;atau&rdquo; (gabungan), " + TI(r"\cap") + " = &ldquo;dan&rdquo; (irisan), " + TI(r"\emptyset") + " = himpunan kosong (tidak ada hasil bersama).")
    L.p("<strong>Interpretasi:</strong> aksioma 3 adalah &ldquo;aturan tambah&rdquo; versi murni — hanya berlaku jika kejadiannya tidak tumpang tindih. Dadu muncul 1 atau 2: " + TI(r"P = 1/6 + 1/6 = 1/3") + " karena &ldquo;muncul 1&rdquo; dan &ldquo;muncul 2&rdquo; tidak bisa bareng.")
    L.raw(myth("Peluang bisa lebih dari 1 atau negatif.",
        "Tidak pernah. Aksioma 1+2 memaksa " + TI(r"0 \leq P(A) \leq 1") + ". Kalau hitunganmu menghasilkan 1,4 atau −0,2 — hitungannya yang salah, bukan teorinya. Cek ulang " + TI(r"S") + "."))
    L.raw(tip("Angka peluang selalu bisa dibaca sebagai &ldquo;dalam jangka panjang, terjadi sekian persen dari pengulangan&rdquo;. " + TI(r"P=0{,}05") + " = sekitar 5 dari 100 pengulangan — bukan janji untuk 100 berikutnya."))

    L.sec("aturan", "Tiga Aturan Turunan yang Dipakai Tiap Hari")
    L.h3("1. Aturan komplemen — &ldquo;kebalikannya&rdquo;")
    L.p(T(r"P(A^c) = 1 - P(A)"))
    L.p(TI(r"A^c") + " = &ldquo;" + TI(r"A") + " tidak terjadi&rdquo;. <strong>Kapan dipakai:</strong> saat menghitung langsung susah tapi kebalikannya gampang. Peluang <em>minimal satu</em> gagal dari 10 nasabah jauh lebih mudah via komplemen: 1 − P(tidak ada yang gagal).")
    L.h3("2. Aturan penjumlahan umum — &ldquo;atau&rdquo; yang benar")
    L.p(T(r"P(A \cup B) = P(A) + P(B) - P(A \cap B)"))
    L.p("<strong>Artinya:</strong> kalau asal tambah, irisan dihitung dua kali — harus dikurangi sekali. <strong>Contoh:</strong> peluang kartu merah atau king: " + TI(r"26/52 + 4/52 - 2/52 = 28/52") + " (2 king merah dihitung ganda).")
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Dari 100 nasabah: 30 pernah telat bayar (T), 20 punya kartu kredit lain macet (M), 8 keduanya.</p>"
        "<p><strong>Langkah 1</strong> — tulis yang diketahui: " + TI(r"P(T)=0{,}30,\ P(M)=0{,}20,\ P(T\cap M)=0{,}08") + ".</p>"
        "<p><strong>Langkah 2</strong> — aturan penjumlahan: " + TI(r"P(T \cup M) = 0{,}30+0{,}20-0{,}08 = 0{,}42") + ".</p>"
        "<p>Jadi 42% nasabah punya minimal satu sinyal risiko — bukan 50% (asal tambah)!</p>"))
    L.h3("3. Aturan perkalian — &ldquo;dan&rdquo; yang benar")
    L.p(T(r"P(A \cap B) = P(A) \times P(B|A)"))
    L.p("Versi sederhananya hanya berlaku jika " + TI(r"A") + " dan " + TI(r"B") + " <strong>independen</strong> (lihat bawah): " + T(r"P(A \cap B) = P(A)\times P(B)", block=False) + ".")
    L.p("<strong>Contoh:</strong> peluang dua nasabah <em>berturut-turut</em> gagal (independen, PD 5%): " + TI(r"0{,}05 \times 0{,}05 = 0{,}0025") + " = 0,25%.")

    L.sec("indep", "&ldquo;Independen&rdquo; vs &ldquo;Saling Lepas&rdquo; — Jangan Tertukar!")
    L.p("<strong>Definisi.</strong> Dua kejadian <strong>independen</strong> jika terjadinya satu <em>tidak mengubah</em> peluang yang lain: " + T(r"P(B|A) = P(B)", block=False) + ". Dua kejadian <strong>saling lepas</strong> (mutually exclusive) jika <em>tidak bisa terjadi bersama</em>: " + T(r"P(A \cap B) = 0", block=False) + ".")
    L.p("<strong>Kepribadian:</strong> independen = &ldquo;tidak peduli&rdquo; (koin kedua tidak peduli hasil koin pertama). Saling lepas = &ldquo;tidak bisa bareng&rdquo; (dadu tidak bisa 1 dan 6 sekaligus).")
    L.raw(myth("Independen sama dengan saling lepas.",
        "Justru <strong>kebalikannya</strong>! Jika " + TI(r"A") + " dan " + TI(r"B") + " saling lepas (dengan peluang positif), maka terjadinya " + TI(r"A") + " membuat " + TI(r"B") + " mustahil — sangat <em>tidak</em> independen. Contoh: &ldquo;nasabah lancar&rdquo; vs &ldquo;nasabah gagal&rdquo; saling lepas, dan jelas tidak independen."))
    L.raw(myth("&ldquo;Sudah 5x gagal, pasti berikutnya berhasil&rdquo; (gambler's fallacy).",
        "Jika tiap percobaan independen, sejarah tidak mengubah peluang. Koin yang 5x muncul angka tetap 50% untuk lemparan ke-6. Yang &ldquo;jatuh tempo&rdquo; hanya berlaku jika ada mekanisme yang menghubungkan (misal tanpa pengembalian — itu tidak independen!)."))
    L.p("<strong>Kapan memakai:</strong> pakai perkalian sederhana " + TI(r"P(A)P(B)") + " <em>hanya</em> jika yakin independen (atau diminta mengasumsikan). Di risiko kredit, default antar nasabah <strong>tidak</strong> independen saat krisis (korelasi!) — asumsi independen meremehkan risiko (ini dibahas di B13 Vasicek).")
    L.raw(tip("&ldquo;Atau&rdquo; → pikir tambah (kurangi irisan). &ldquo;Dan&rdquo; → pikir kali (cek independen dulu). &ldquo;Minimal satu&rdquo; → pikir komplemen. Tiga refleks ini menyelesaikan 80% soal peluang dasar."))

    L.chart(
        data=[{"x": ["atau (tambah)", "dan (kali, independen)", "komplemen"],
               "y": [0.42, 0.0025, 0.95], "type": "bar",
               "marker": {"color": ["#2a7de1", "#e8a838", "#34a853"]},
               "text": ["0,42", "0,0025", "0,95"], "textposition": "outside"}],
        title="Tiga Aturan, Tiga Orde Besarnya",
        layout={"yaxis": {"title": "Peluang"}, "showlegend": False},
        cara="Sumbu X = aturan yang dipakai, tinggi batang = peluang hasil. Perhatikan skala sumbu Y.",
        interpretasi="Aturan &ldquo;atau&rdquo; menghasilkan peluang besar (0,42), &ldquo;dan&rdquo; menghasilkan peluang kecil (0,0025) — mengalikan peluang selalu mengecilkan. Komplemen membalik: P(minimal satu gagal) = 0,95 jauh lebih besar dari P(dua-duanya gagal). Intuisi ini penting: <strong>risiko gabungan &ldquo;salah satu&rdquo; jauh lebih besar dari &ldquo;semuanya&rdquo;</strong>.")

    L.chart(
        data=[{"x": [10, 50, 100, 500, 1000, 5000, 10000], "y": [0.6, 0.54, 0.47, 0.512, 0.498, 0.501, 0.5003],
               "type": "scatter", "mode": "lines+markers", "name": "Frekuensi relatif angka",
               "line": {"color": "#2a7de1"}},
              {"x": [10, 10000], "y": [0.5, 0.5], "type": "scatter", "mode": "lines",
               "name": "Peluang teoretis 0,5", "line": {"color": "#e8a838", "dash": "dash"}}],
        title="Frekuensi Relatif → Peluang (Hukum Bilangan Besar, teaser B11)",
        layout={"xaxis": {"title": "Banyak lemparan (skala log)", "type": "log"}, "yaxis": {"title": "Frekuensi relatif"}},
        cara="Sumbu X = banyak lemparan koin (skala log), sumbu Y = proporsi &ldquo;angka&rdquo;. Garis putus-putus = 0,5.",
        interpretasi="Sedikit lemparan: frekuensi liar (0,6 di n=10). Makin banyak, makin menempel ke 0,5. Inilah makna operasional peluang: <strong>frekuensi jangka panjang</strong>. Bukan ramalan satu kejadian.")

    L.sec("lab1", "🔬 Lab 1: Koin 10.000x — Melihat Peluang Bekerja")
    L.lab("Lab 1 — Frekuensi Relatif Koin",
        "Jalankan simulasi lempar koin. Perhatikan bagaimana frekuensi &ldquo;angka&rdquo; menstabil di 0,5.",
        'import random\nrandom.seed(42)\n\ndef frek(n):\n    angka = sum(random.random() < 0.5 for _ in range(n))\n    return angka / n\n\nfor n in [10, 100, 1000, 10000, 100000]:\n    print(f"n={n:>7}  frekuensi angka = {frek(n):.4f}")\n\nprint()\nprint("Coba: ganti 0.5 jadi 0.7 (koin tidak adil).")\nprint("Coba: seed(42) dihapus — hasil berubah tiap run, tapi tetap -> 0.5.")',
        "Coba n lebih besar. Kapan frekuensi &ldquo;terkunci&rdquo; di dekat 0,5? Itulah aksioma 1 yang hidup.")

    L.sec("lab2", "🔬 Lab 2: Aturan &ldquo;Atau&rdquo; vs Asal Tambah")
    L.lab("Lab 2 — Jangan Asal Tambah",
        "Hitung P(merah atau king) dari 52 kartu dengan simulasi, lalu bandingkan dengan &ldquo;asal tambah&rdquo.",
        'import random\nrandom.seed(7)\nN = 200000\n# kartu: (warna, angka); warna 0=hitam,1=merah; angka 1..13 (13=king)\ndeck = [(w, a) for w in [0,1] for a in range(1,14)]\n\nmerah_atau_king = sum(1 for _ in range(N) if (lambda c: c[0]==1 or c[1]==13)(random.choice(deck)))\nprint(f"Simulasi P(merah atau king) = {merah_atau_king/N:.4f}")\nprint(f"Rumus benar  = {28/52:.4f}  (26/52 + 4/52 - 2/52)")\nprint(f"Asal tambah = {30/52:.4f}  (26/52 + 4/52) <- SALAH, irisan dihitung 2x")\nprint()\nprint("Selisihnya kecil di sini, tapi di portofolio 10.000 nasabah,")\nprint("kesalahan seperti ini = ratusan nasabah salah klasifikasi.")',
        "Coba ubah jadi P(hitam atau As). Berapa irisannya? Cek dengan rumus.")

    L.sec("peta", "🗺️ Peta Keputusan: Tambah, Kali, atau Komplemen?")
    d1 = L.decision_chart([{"x": ["P(A)", "P(B)", "irisan"], "y": [0.3, 0.2, 0.08], "type": "bar", "marker": {"color": "#2a7de1"}}], "Komponen P(A atau B)", {})
    L.decision("1", "Ada kata &ldquo;atau&rdquo; → <strong>aturan penjumlahan</strong>",
        "Dua kejadian bisa tumpang tindih (tidak saling lepas).", chart_var=d1, chart_title="P(A ∪ B) = 0,3 + 0,2 − 0,08",
        kenapa="Irisan dihitung dua kali kalau asal tambah — kurangi sekali.",
        contoh="P(telat atau punya kartu macet) di contoh worked di atas.")
    L.decision("2", "Ada kata &ldquo;dan&rdquo;/&ldquo;berturut-turut&rdquo; → <strong>aturan perkalian</strong>",
        "Dua kejadian berurutan atau bersamaan.", 
        kenapa="P(A dan B) = P(A) × P(B) hanya jika independen. Jika tidak, butuh P(B|A) — itu topik B3.",
        contoh="P(2 nasabah gagal berurutan) = 0,05 × 0,05 (asumsi independen).")
    L.decision("3", "Ada kata &ldquo;minimal satu&rdquo; → <strong>komplemen</strong>",
        "Menghitung langsung butuh banyak suku (1 terjadi + 2 terjadi + ...).",
        kenapa="1 − P(tidak ada yang terjadi) selalu satu suku. Jauh lebih mudah.",
        contoh="P(minimal 1 gagal dari 100 nasabah) = 1 − 0,95^100 ≈ 99,4%!")
    L.decision("4", "Ragu independen atau tidak → <strong>jangan asal kali</strong>",
        "Ada mekanisme yang menghubungkan kejadian (krisis, musim, tanpa pengembalian).",
        kenapa="Asumsi independen yang salah = meremehkan risiko gabungan. Di krisis 2008, default yang &ldquo;independen&rdquo; ternyata bergerak bareng.",
        contoh="Tanpa pengembalian: P(2 kartu As berurutan) = 4/52 × 3/51, bukan (4/52)².")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Dengar katanya: <strong>atau → tambah</strong>, <strong>dan → kali</strong>, <strong>minimal satu → komplemen</strong>.</li>"
        "<li>Sebelum tambah: tanya &ldquo;ada irisan?&rdquo; Sebelum kali: tanya &ldquo;independen?&rdquo;</li>"
        "<li>Hasil di luar [0,1] = pasti salah hitung.</li></ol>"))

    L.sec("case", "📋 Mini-Case: &ldquo;99,4%&rdquo; yang Mengejutkan Direksi")
    L.raw(callout("<p>Portofolio 100 nasabah, masing-masing PD = 5%, <strong>asumsikan independen</strong>.</p>"
        "<p>Direksi: &ldquo;Risiko kita kecil, cuma 5%.&rdquo; Kamu menghitung:</p>"
        "<ul><li>P(tidak ada yang gagal) = 0,95<sup>100</sup> ≈ 0,6%</li>"
        "<li><strong>P(minimal satu gagal) = 1 − 0,006 = 99,4%</strong></li></ul>"
        "<p><strong>Pertanyaan:</strong> (a) Mengapa 99,4% bukan kontradiksi dengan &ldquo;PD 5%&rdquo;? (b) Apa yang salah dari asumsi independen di sini?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) Tidak kontradiksi: 5% adalah peluang <em>per nasabah</em>, 99,4% adalah peluang <em>minimal satu dari 100</em>. Dengan 100 percobaan, hampir pasti ada yang gagal — itu konsekuensi aturan komplemen, bukan kenaikan risiko per nasabah. Ekspektasi jumlah gagal tetap 5 (ini B5).</p>"
        "<p>(b) Asumsi independen rapuh: dalam resesi, PHK massal membuat gagal bayar <strong>berkorelasi</strong> — peluang gabungannya lebih besar dari perkalian sederhana. Inilah mengapa B13 (Vasicek) ada: memodelkan korelasi default.</p>")))

    L.quiz("Ruang sampel lempar dua koin yang benar adalah…",
        ["{AA, AG, GA, GG}", "{0 angka, 1 angka, 2 angka}", "{AA, GG}", "{angka, gambar}"],
        0, "Benar: 4 hasil equally likely. {0,1,2} angka salah karena tidak equally likely — P(1 angka)=1/2, bukan 1/3.")
    L.quiz("P(merah atau king) dari 52 kartu = 28/52. Kesalahan &ldquo;asal tambah&rdquo; (30/52) terjadi karena…",
        ["King merah dihitung dua kali", "Kartu merah terlalu banyak", "King bukan kartu", "52 bukan ruang sampel"],
        0, "Benar: 2 king merah ada di kedua kejadian — irisan harus dikurangi sekali (aturan penjumlahan umum).")
    L.quiz("Mana pasangan yang SALING LEPAS tapi TIDAK independen?",
        ["Koin pertama angka & koin kedua angka", "Dadu 1 & dadu 6", "Hujan hari ini & hujan besok", "Lulus & tidak lulus ujian"],
        3, "Benar: tidak bisa lulus dan tidak lulus sekaligus (saling lepas), dan terjadinya satu membuat yang lain mustahil — sangat tidak independen.")
    L.quiz("Peluang 10 nasabah independen (PD 5%) tidak ada yang gagal adalah 0,95^10 ≈ 60%. Maka P(minimal satu gagal) = …",
        ["5% × 10 = 50%", "1 − 0,60 = 40%", "0,05^10", "Tidak bisa dihitung"],
        1, "Benar: aturan komplemen — 1 − P(tidak ada). Jauh lebih mudah dari menjumlah 10 suku.")
    L.quiz("Setelah 5x gagal beruntun, peluang berhasil berikutnya (independen, p=10%) adalah…",
        ["Lebih dari 10% — sudah jatuh tempo", "Tetap 10%", "Kurang dari 10%", "50%"],
        1, "Benar: independen = sejarah tidak mengubah peluang. Yang berubah hanya jika ada mekanisme penghubung.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Ruang sampel dulu</strong> sebelum hitung — separuh error berasal dari " + TI(r"S") + " yang salah.</li>"
        "<li><strong>Tiga aksioma:</strong> total = 1, tak negatif, saling lepas boleh dijumlah.</li>"
        "<li><strong>Atau → tambah</strong> (kurangi irisan); <strong>dan → kali</strong> (cek independen); <strong>minimal satu → komplemen</strong>.</li>"
        "<li><strong>Independen ≠ saling lepas</strong> — justru saling lepas (nontrivial) pasti tidak independen.</li>"
        "<li>Peluang = frekuensi jangka panjang, bukan janji untuk kejadian berikutnya.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B2
def b2():
    L = Lesson("b2-kombinatorik", "B2 — Probabilitas",
        "Kombinatorik: Menghitung<br/>Tanpa Menghitung Satu per Satu",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b1-aksioma-peluang", "← B1"), ("b3-peluang-bersyarat", "Next: B3"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menerapkan kaidah pencacahan (aturan perkalian) untuk ruang sampel berurutan.</li>"
        "<li>Membedakan kapan pakai <strong>permutasi</strong> vs <strong>kombinasi</strong> vs <strong>dengan pengulangan</strong>.</li>"
        "<li>Menghitung peluang via rasio &ldquo;favorable/total&rdquo; pada ruang sampel kombinatorial.</li>"
        "<li>Menggunakan <strong>strategi komplemen</strong> untuk soal &ldquo;minimal satu&rdquo;.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Ulang Tahun yang Sama?")
    L.raw('<div className="story"><p>Di ruangan berisi <strong>23 orang</strong>, berapa peluang dua orang berulang tahun di tanggal yang sama? Kebanyakan menebak kecil — &ldquo;kan ada 365 hari!&rdquo; Jawabannya: <strong>lebih dari 50%</strong>.</p>'
        "<p>Ini <em>birthday paradox</em>: intuisi manusia payah menghitung pasangan. Dengan 23 orang ada " + TI(r"\binom{23}{2} = 253") + " pasangan — 253 kesempatan &ldquo;tabrakan&rdquo;. Kombinatorik adalah alat untuk menghitung kesempatan-kesempatan itu tanpa mendaftar satu per satu.</p>"
        "<p>Di dunia nyata: tim fraud menghitung pola transaksi mencurigakan, auditor menghitung sampel, tim risiko menghitung skenario — semuanya kombinatorik.</p></div>")

    L.sec("kaidah", "Kaidah Pencacahan — Fondasi Semuanya")
    L.p("<strong>Aturan perkalian:</strong> jika ada " + TI(r"m") + " cara melakukan A dan " + TI(r"n") + " cara melakukan B, total cara berurutan = " + TI(r"m \times n") + ".")
    L.p("<strong>Contoh.</strong> PIN 4 digit: 10×10×10×10 = " + TI(r"10^4 = 10.000") + " kemungkinan. Plat nomor 1 huruf + 3 angka: 26 × 10³ = 26.000.")
    L.p("<strong>Kepribadian:</strong> kaidah pencacahan itu &ldquo;mesin fotokopi&rdquo; — tiap tahap menggandakan kemungkinan tahap sebelumnya. Inilah mengapa ruang sampel meledak eksponensial (dan mengapa brute force cepat mustahil).")
    L.raw(tip("Soal &ldquo;berurutan&rdquo; (PIN, password, antrean) hampir selalu mulai dari kaidah perkalian. Tulis banyaknya pilihan <em>per posisi</em>, lalu kalikan."))

    L.sec("perm", "Permutasi — Urutan Penting, Tanpa Pengulangan")
    L.p(T(r"P(n,k) = \frac{n!}{k!}"))
    L.p("<strong>Artinya tiap simbol:</strong> " + TI(r"n") + " = banyak objek tersedia, " + TI(r"k") + " = banyak posisi yang diisi, " + TI(r"n!") + " = n×(n−1)×...×1.")
    L.p("<strong>Contoh langkah-demi-langkah.</strong> 5 finalis, juara 1-2-3: posisi 1 ada 5 pilihan, posisi 2 sisa 4, posisi 3 sisa 3 → 5×4×3 = 60 = " + TI(r"5!/2!") + ".")
    L.p("<strong>Kapan memakai:</strong> susunan/podium/jabatan — &ldquo;siapa jadi apa&rdquo; penting.")

    L.sec("komb", "Kombinasi — Urutan Tidak Penting")
    L.p(T(r"C(n,k) = \binom{n}{k} = \frac{n!}{k!(n-k)!}"))
    L.p("<strong>Artinya:</strong> sama seperti permutasi, tapi susunan yang sama dianggap satu (dibagi " + TI(r"k!") + " susunan internal).")
    L.p("<strong>Contoh.</strong> Pilih 3 auditor dari 10: " + T(r"\binom{10}{3} = \frac{10\times9\times8}{3\times2\times1} = 120", block=False) + ". Tim {A,B,C} sama dengan {C,B,A} — urutan tidak penting.")
    L.raw(worked("📐 Contoh: peluang &ldquo;full house&rdquo; vs intuisi",
        "<p>Peluang 5 kartu mengandung tepat sepasang As (dan bukan three of a kind)?</p>"
        "<p><strong>Langkah 1</strong> — total: " + TI(r"\binom{52}{5} = 2.598.960") + ".</p>"
        "<p><strong>Langkah 2</strong> — favorable: pilih 2 As dari 4 (" + TI(r"\binom{4}{2}=6") + ") × pilih 3 non-As dari 48 (" + TI(r"\binom{48}{3}=17.296") + ") = 103.776.</p>"
        "<p><strong>Langkah 3</strong> — peluang = 103.776 / 2.598.960 ≈ <strong>4%</strong>. Pola pikirnya selalu: <em>favorable/total</em>, masing-masing dihitung dengan kombinasi.</p>"))
    L.raw(myth("Urutan tidak penting = selalu kombinasi.",
        "Hanya jika tiap subset <em>equally likely</em>. Contoh jebakan: &ldquo;pilih 2 nasabah&rdquo; dari populasi yang tiap nasabahnya tidak equally likely terpilih (sampling berbobot) — kombinasi menghitung susunan, bukan peluang. Kombinasi menjawab &ldquo;ada berapa cara&rdquo;, bukan &ldquo;berapa peluang&rdquo; — peluang butuh asumsi equally likely."))
    L.raw(myth("P(n,k) dan C(n,k) bisa dipakai bergantian, bedanya kecil.",
        "Bedanya faktor " + TI(r"k!") + " — untuk k=10 itu 3,6 juta kali lipat! Salah pilih = salah total. Tes cepat: <em>tukar dua objek, apakah hasilnya dianggap beda?</em> Ya → permutasi. Tidak → kombinasi."))

    L.sec("ulang", "Dengan Pengulangan &amp; Strategi Komplemen")
    L.p("<strong>Dengan pengulangan</strong> (tiap posisi boleh pakai ulang): " + T(r"n^k", block=False) + " (PIN: " + TI(r"10^4") + "). <strong>Kombinasi dengan pengulangan</strong> (stars and bars): " + T(r"\binom{n+k-1}{k}", block=False) + " — misal membagi 10 identik ke 3 kelompok.")
    L.p("<strong>Strategi komplemen</strong> (superpower kombinatorik): soal &ldquo;minimal satu&rdquo; hampir selalu lebih mudah via komplemen.")
    L.p("<strong>Contoh.</strong> Peluang minimal satu &ldquo;angka&rdquo; dari 3 lemparan koin: 1 − P(semua gambar) = 1 − (1/2)³ = <strong>7/8</strong>. Bandingkan dengan menghitung 1-angka + 2-angka + 3-angka = 3/8+3/8+1/8 — komplemen satu langkah.")
    L.raw(tip("Refleks komplemen: begitu melihat kata &ldquo;minimal satu&rdquo;/&ldquo;paling tidak satu&rdquo;, langsung tulis &ldquo;1 − P(tidak ada)&rdquo;. Ini menghemat 80% kerja."))

    L.table(["Situasi", "Rumus", "Contoh"],
        [["Urutan penting, tanpa ulang", "P(n,k) = n!/(n−k)!", "Podium juara 1-2-3"],
         ["Urutan tak penting, tanpa ulang", "C(n,k) = n!/(k!(n−k)!)", "Tim audit 3 dari 10"],
         ["Tiap posisi boleh ulang", "n^k", "PIN 4 digit"],
         ["Bagi identik ke kelompok", "C(n+k−1,k)", "10 bola ke 3 kotak"]])

    L.chart(
        data=[{"x": [5, 10, 15, 20, 23, 30, 40, 50], "y": [0.027, 0.117, 0.253, 0.411, 0.507, 0.706, 0.891, 0.970],
               "type": "scatter", "mode": "lines+markers", "line": {"color": "#e8a838"}, "name": "P(tabrakan ultah)"},
              {"x": [5, 50], "y": [0.5, 0.5], "type": "scatter", "mode": "lines",
               "line": {"color": "#94a3b8", "dash": "dash"}, "name": "50%"}],
        title="Birthday Paradox: 23 Orang → >50%",
        layout={"xaxis": {"title": "Jumlah orang"}, "yaxis": {"title": "P(minimal satu pasang ultah sama)", "tickformat": ".0%"}},
        cara="Sumbu X = jumlah orang di ruangan, sumbu Y = peluang ada minimal dua orang berulang tahun sama.",
        interpretasi="Kurva naik curam: 23 orang sudah >50%, 50 orang 97%. Intuisi &ldquo;365 hari kan banyak&rdquo; salah karena yang relevan adalah <strong>banyaknya pasangan</strong> " + TI(r"\binom{n}{2}") + " yang tumbuh kuadratik, bukan harinya.")

    L.chart(
        data=[{"x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
               "y": [10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000],
               "type": "scatter", "mode": "lines+markers", "line": {"color": "#2a7de1"}, "name": "10^k (PIN k digit)"}],
        title="Ledakan Kombinatorial: Tiap Digit ×10",
        layout={"xaxis": {"title": "Panjang PIN (digit)"}, "yaxis": {"title": "Kemungkinan", "type": "log"}},
        cara="Sumbu Y skala log: tiap naik 1 digit, kemungkinan ×10.",
        interpretasi="PIN 4 digit = 10 ribu (brute force gampang), 10 digit = 10 miliar. Inilah mengapa &ldquo;tambah 1 digit&rdquo; jauh lebih kuat dari &ldquo;aturan password rumit&rdquo; — dan mengapa enumerasi skenario risiko harus dipangkas dengan cerdas, bukan brute force.")

    L.sec("lab1", "🔬 Lab 1: Birthday Paradox — Buktikan Sendiri")
    L.lab("Lab 1 — Simulasi Ulang Tahun",
        "Simulasi ruangan berisi n orang, ulang tahun acak 365 hari. Jalankan dan lihat kapan peluang melewati 50%.",
        'import random\nrandom.seed(11)\n\ndef peluang_tabrakan(n, trials=20000):\n    tabrak = 0\n    for _ in range(trials):\n        ultah = [random.randrange(365) for _ in range(n)]\n        if len(set(ultah)) < n:  # ada yang sama\n            tabrak += 1\n    return tabrak / trials\n\nfor n in [5, 10, 15, 20, 23, 30, 40, 50]:\n    print(f"{n:>3} orang -> P(tabrakan) = {peluang_tabrakan(n):.3f}")\nprint()\nprint("Coba: n=23. Sesuaikah dengan 0.507 di grafik?")\nprint("Coba: ganti 365 -> 1000 hari. Berapa n agar >50%?")',
        "Ubah trials 20.000 → 2.000: hasilnya goyang. Itulah noise simulasi — makin banyak trial makin stabil.")

    L.sec("lab2", "🔬 Lab 2: Kombinasi vs Simulasi — Audit Menemukan Fraud")
    L.lab("Lab 2 — Peluang Menemukan Fraud dalam Sampel",
        "Populasi 200 transaksi, 10 di antaranya fraud. Auditor ambil 15 acak. Berapa peluang <strong>minimal satu</strong> fraud ketemu? Hitung via kombinasi + cek via simulasi.",
        'import random, math\nrandom.seed(3)\n\ndef C(n, k):\n    return math.comb(n, k)  # Python 3.8+: kombinasi eksak\n\nN, F, n = 200, 10, 15\n# komplemen: sampel tanpa fraud sama sekali\np_tanpa = C(N - F, n) / C(N, n)\nprint(f"P(tanpa fraud)      = {p_tanpa:.4f}")\nprint(f"P(minimal 1 fraud)  = {1 - p_tanpa:.4f}")\n\n# simulasi\ntrials = 50000\nketemu = 0\npop = [1]*F + [0]*(N-F)  # 1 = fraud\nfor _ in range(trials):\n    if sum(random.sample(pop, n)) >= 1:\n        ketemu += 1\nprint(f"Simulasi            = {ketemu/trials:.4f}")\nprint()\nprint("Coba: n=15 -> 30. Berapa n agar P > 95%? (coba-coba!)")',
        "Naikkan n sampai peluang > 0,95. Itulah cara menentukan <strong>ukuran sampel audit</strong>.")

    L.sec("peta", "🗺️ Peta Keputusan: Permutasi, Kombinasi, atau Apa?")
    L.decision("1", "Soal susunan/jabatan/podium → <strong>Permutasi</strong>",
        "Objek dibedakan oleh posisinya: juara 1 vs juara 2 itu beda.",
        kenapa="Tukar dua objek mengubah hasil → urutan penting → P(n,k).",
        contoh="Nomor antrean layanan: siapa di posisi 1 penting.")
    L.decision("2", "Soal tim/sampel/komite → <strong>Kombinasi</strong>",
        "Yang penting siapa anggotanya, bukan urutannya.",
        kenapa="Tukar dua anggota tidak mengubah tim → C(n,k).",
        contoh="Sampel audit 15 dari 200 transaksi (Lab 2).")
    L.decision("3", "Tiap pilihan boleh dipakai ulang → <strong>pangkat (n^k)</strong>",
        "Posisi independen dan boleh mengulang: PIN, password, lemparan berurutan.",
        kenapa="Tiap posisi punya n pilihan penuh → kalikan n sebanyak k kali.",
        contoh="Password 8 karakter dari 62 simbol: 62^8.")
    L.decision("4", "Ada kata &ldquo;minimal satu&rdquo; → <strong>komplemen dulu</strong>",
        "Menghitung langsung butuh menjumlah banyak kasus.",
        kenapa="1 − P(tidak ada) selalu satu suku. Hemat dan anti-salah.",
        contoh="P(minimal satu fraud) = 1 − C(190,15)/C(200,15).")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Tanya: <strong>tukar dua objek, beda hasil?</strong> Ya → permutasi, tidak → kombinasi.</li>"
        "<li>Boleh pakai ulang? → n^k.</li>"
        "<li>&ldquo;Minimal satu&rdquo; → 1 − P(tidak ada). Selalu.</li>"
        "<li>Peluang = favorable/total — pastikan keduanya dihitung dengan <em>aturan yang sama</em>.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Berapa Sampel Agar Yakin 95%?")
    L.raw(callout("<p>Tim audit menemukan pola: ~5% transaksi di satu cabang terindikasi fraud (10 dari 200). Kepala audit bertanya: <em>&ldquo;Berapa transaksi harus kami sampel acak agar peluang menemukan <strong>minimal satu</strong> fraud ≥ 95%?&rdquo;</em></p>"
        "<p>Dari Lab 2: n=15 → P ≈ 55%. Terlalu kecil.</p>"
        "<p><strong>Pertanyaan:</strong> (a) Perkirakan n yang dibutuhkan (coba dengan lab). (b) Mengapa jawaban ini memakai komplemen, bukan menghitung langsung?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) Dengan mencoba n di Lab 2: n=40 → P ≈ 88%, n=50 → P ≈ 94%, <strong>n≈52–55 → P ≥ 95%</strong>. (Tanpa pengembalian, jadi sedikit di bawah aproksimasi binomial.)</p>"
        "<p>(b) Menghitung langsung butuh menjumlah P(1 fraud) + P(2) + ... + P(10) — 10 suku hipergeometrik. Komplemen: 1 − C(190,n)/C(200,n) — satu suku. Inilah strategi komplemen di dunia nyata: <strong>ukuran sampel audit ditentukan oleh komplemen</strong>.</p>")))

    L.quiz("PIN 4 digit (boleh ulang). Banyak kemungkinan?",
        ["4^10", "10^4 = 10.000", "P(10,4) = 5.040", "C(10,4) = 210"],
        1, "Benar: tiap digit 10 pilihan independen → 10^4. P(10,4) salah karena digit boleh berulang.")
    L.quiz("Pilih 3 orang dari 10 untuk tim (urutan tidak penting). Rumus?",
        ["10^3", "10!/7!", "C(10,3) = 120", "10!/3!"],
        2, "Benar: tim {A,B,C} = {C,B,A} → kombinasi. 10!/7! adalah permutasi (untuk podium).")
    L.quiz("Peluang minimal satu angka dari 4 lemparan koin paling cepat via…",
        ["Menjumlah P(1)+P(2)+P(3)+P(4)", "1 − (1/2)^4 = 15/16", "4 × 1/2 = 2", "(1/2)^4"],
        1, "Benar: komplemen — 1 − P(semua gambar). Satu langkah vs empat suku.")
    L.quiz("23 orang, peluang ada pasang berulang tahun sama >50%. Intuisi yang benar:",
        ["365 hari terlalu sedikit", "Yang penting banyaknya pasangan C(23,2)=253", "Orang lahir musiman", "Ulang tahun tidak acak"],
        1, "Benar: 253 pasangan = 253 kesempatan tabrakan. Pertumbuhan kuadratik pasangan mengalahkan 365 hari.")
    L.quiz("Kombinasi C(n,k) bisa dipakai untuk peluang hanya jika…",
        ["n besar", "Setiap subset equally likely", "k kecil", "Selalu bisa"],
        1, "Benar: kombinasi menghitung <em>cara</em>. Jadi peluang hanya valid jika tiap cara equally likely — asumsi yang harus dicek, bukan default.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Kaidah perkalian:</strong> cara berurutan dikalikan — fondasi semua pencacahan.</li>"
        "<li><strong>Tukar beda hasil → permutasi;</strong> tukar sama saja → kombinasi; boleh ulang → n^k.</li>"
        "<li><strong>&ldquo;Minimal satu&rdquo; → komplemen.</strong> Selalu lebih mudah.</li>"
        "<li>Peluang = favorable/total — hitung keduanya dengan aturan yang sama + asumsi equally likely.</li>"
        "<li><strong>Jangan</strong> pakai untuk risiko: brute force skenario meledak eksponensial — butuh sampling cerdas (Monte Carlo, B12).</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B3
def b3():
    L = Lesson("b3-peluang-bersyarat", "B3 — Probabilitas",
        "Peluang Bersyarat:<br/>Informasi Mengubah Peluang",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b2-kombinatorik", "← B2"), ("b4-bayes", "Next: B4"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menghitung " + TI(r"P(A|B)") + " dari definisi dan menginterpretasikannya sebagai &ldquo;dunia yang menyusut&rdquo;.</li>"
        "<li>Menerapkan aturan perkalian umum " + TI(r"P(A \\cap B) = P(A)P(B|A)") + " untuk kejadian berurutan yang tidak independen.</li>"
        "<li>Menggunakan <strong>hukum peluang total</strong> untuk memecah masalah via partisi.</li>"
        "<li>Membedakan " + TI(r"P(A|B)") + " vs " + TI(r"P(B|A)") + " — kesalahan paling mahal di analitik.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;Telat 30 Hari&rdquo; Mengubah Segalanya")
    L.raw('<div className="story"><p>Bank punya 10.000 nasabah. Secara umum, peluang gagal bayar 5% — terdengar kecil. Tapi pagi ini sistem menandai satu nasabah: <strong>telat bayar 30 hari</strong>. Tiba-tiba peluang gagal bayarnya bukan 5% lagi, melainkan <strong>35%</strong>.</p>'
        "<p>Apa yang berubah? Bukan nasabahnya — <em>informasi kita</em> yang bertambah. Peluang bersyarat " + TI(r"P(\\text{gagal} \\mid \\text{telat 30 hari})") + " menjawab: <em>di dunia di mana kita tahu dia telat 30 hari</em>, berapa peluang dia gagal? Dunia (ruang sampel) menyusut dari &ldquo;semua nasabah&rdquo; menjadi &ldquo;nasabah yang telat 30 hari&rdquo; — dan di dunia yang lebih kecil itu, proporsi gagal jauh lebih besar.</p>"
        "<p>Inilah jantung collection analytics, roll rate, dan seluruh B4 (Bayes).</p></div>")

    L.sec("definisi", "Definisi — Dunia yang Menyusut")
    L.p(T(r"P(A|B) = \frac{P(A \cap B)}{P(B)}, \quad P(B) > 0"))
    L.ul([
        TI(r"P(A|B)") + ": peluang A terjadi <em>dengan syarat</em> B sudah terjadi/dianggap terjadi",
        TI(r"P(A \\cap B)") + ": peluang keduanya terjadi",
        TI(r"P(B)") + ": peluang syaratnya — sekaligus &ldquo;ukuran dunia baru&rdquo;",
    ])
    L.p("<strong>Intuisi:</strong> syarat " + TI(r"B") + " memangkas ruang sampel menjadi hanya hasil-hasil di " + TI(r"B") + ". Di dunia baru itu, peluang " + TI(r"A") + " = proporsi " + TI(r"A") + " di dalam " + TI(r"B") + ".")
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>100 nasabah: 20 telat 30 hari (T), dan 7 di antaranya akhirnya gagal (G ∩ T).</p>"
        "<p><strong>Langkah 1</strong> — identifikasi: yang ditanya " + TI(r"P(G|T)") + " (&ldquo;given telat&rdquo;).</p>"
        "<p><strong>Langkah 2</strong> — " + TI(r"P(G \\cap T) = 7/100") + ", " + TI(r"P(T) = 20/100") + ".</p>"
        "<p><strong>Langkah 3</strong> — " + T(r"P(G|T) = \\frac{7/100}{20/100} = \\frac{7}{20} = 35\\%", block=False) + ".</p>"
        "<p>Bandingkan: P(G) umum = 5%, tapi P(G|T) = 35%. <strong>Informasi mengubah peluang 7x lipat.</strong></p>"))
    L.raw(tip("Baca " + TI(r"P(A|B)") + " sebagai &ldquo;di antara kejadian B, berapa proporsi yang juga A?&rdquo;. Kata &ldquo;given&rdquo;/&ldquo;jika diketahui&rdquo;/&ldquo;di antara yang&rdquo; adalah sinyal soal bersyarat."))
    L.raw(myth(TI(r"P(A|B)") + " selalu sama dengan " + TI(r"P(B|A)") + ".",
        "P(gagal | telat 30 hari) = 35%, tapi P(telat 30 hari | gagal) bisa 70% — beda total! Yang pertama untuk <em>prediksi</em> (given sinyal, berapa risiko?), yang kedua untuk <em>diagnosis</em> (given gagal, seberapa umum sinyalnya?). Tertukar = keputusan terbalik. Analis risiko hidup dari bedanya."))

    L.sec("kali", "Aturan Perkalian Umum — &ldquo;Dan&rdquo; Tanpa Asumsi Independen")
    L.p(T(r"P(A \cap B) = P(A) \times P(B|A)"))
    L.p("Ini versi jujur dari aturan perkalian B1: tidak butuh asumsi independen. <strong>Contoh:</strong> P(2 kartu As berurutan tanpa pengembalian) = " + TI(r"\frac{4}{52} \times \frac{3}{51}") + " — suku kedua adalah " + TI(r"P(\\text{As}_2 \\mid \\text{As}_1)") + ".")
    L.p("<strong>Kepribadian:</strong> aturan ini adalah &ldquo;rantai sebab-akibat&rdquo; — peluang gabungan = peluang langkah pertama × peluang langkah kedua <em>given</em> langkah pertama terjadi. Pohon peluang (di bawah) adalah visualnya.")
    L.raw(tip("Gambar <strong>pohon peluang</strong>: tiap cabang = syarat, tiap ranting = peluang bersyarat. Peluang satu jalur = kali sepanjang jalur. Pohon mengubah soal berurutan yang membingungkan menjadi perkalian mekanis."))

    L.sec("total", "Hukum Peluang Total — Pecah via Partisi")
    L.p(T(r"P(A) = \sum_{i} P(B_i)\,P(A|B_i)"))
    L.ul([
        TI(r"B_i") + ": partisi — kejadian-kejadian yang saling lepas dan mencakup semua kemungkinan (misal DPD bucket: lancar / 1–30 / 31–60 / &gt;60)",
        TI(r"P(B_i)") + ": bobot tiap kelompok",
        TI(r"P(A|B_i)") + ": peluang A di dalam tiap kelompok",
    ])
    L.p("<strong>Contoh.</strong> Portofolio: 80% lancar (PD 2%), 15% telat 1–30 (PD 10%), 5% telat &gt;30 (PD 35%). PD portofolio = 0,8×0,02 + 0,15×0,10 + 0,05×0,35 = 0,016+0,015+0,0175 = <strong>4,85%</strong>.")
    L.p("<strong>Interpretasi:</strong> ini <strong>rata-rata tertimbang</strong> dari peluang bersyarat — menghubungkan B3 ke weighted mean (A1.2)! Setiap bucket menyumbang sesuai bobotnya.")
    L.raw(myth("Peluang bersyarat selalu lebih kecil dari peluang umum.",
        "Bisa lebih besar (35% &gt; 5% di cerita pembuka) atau lebih kecil. Syarat bisa <em>menaikkan</em> maupun <em>menurunkan</em> peluang — tergantung apakah syaratnya berkorelasi positif atau negatif dengan kejadian. &ldquo;Diberi info&rdquo; ≠ &ldquo;peluang menyusut&rdquo;."))

    L.chart(
        data=[{"x": ["Lancar (80%)", "Telat 1–30 (15%)", "Telat >30 (5%)", "Portofolio (total)"],
               "y": [0.02, 0.10, 0.35, 0.0485], "type": "bar",
               "marker": {"color": ["#34a853", "#e8a838", "#ef4444", "#2a7de1"]},
               "text": ["2%", "10%", "35%", "4,85%"], "textposition": "outside"}],
        title="PD per Bucket vs PD Portofolio (Hukum Peluang Total)",
        layout={"yaxis": {"title": "Peluang gagal bayar", "tickformat": ".0%"}, "showlegend": False},
        cara="Tiga batang pertama = PD bersyarat tiap bucket DPD; batang biru = PD portofolio (rata-rata tertimbang).",
        interpretasi="PD portofolio 4,85% <strong>tidak sama</strong> dengan PD bucket manapun — ia rata-rata tertimbang. Bucket kecil (5%) tapi PD 35% menyumbang 1,75 poin, hampir sama dengan bucket lancar 80% (1,6 poin). <strong>Pelajaran:</strong> jangan kelola portofolio dengan satu angka rata-rata; kelola per bucket.")

    L.chart(
        data=[{"x": ["P(Gagal)", "P(Gagal|Telat 30h)", "P(Telat 30h|Gagal)"],
               "y": [0.05, 0.35, 0.70], "type": "bar",
               "marker": {"color": ["#94a3b8", "#e8a838", "#2a7de1"]},
               "text": ["5%", "35%", "70%"], "textposition": "outside"}],
        title="P(A|B) ≠ P(B|A): Tiga Angka, Tiga Makna",
        layout={"yaxis": {"title": "Peluang", "tickformat": ".0%"}, "showlegend": False},
        cara="Batang 1 = peluang umum gagal; batang 2 = given telat, berapa yang gagal (prediksi); batang 3 = given gagal, berapa yang dulu telat (diagnosis).",
        interpretasi="Tiga angka beda jauh dari data yang sama. Tertukar = bencana: memakai 70% (diagnostik) sebagai &ldquo;peluang gagal&rdquo; untuk nasabah telat akan membuatmu overestimasi 2x lipat. <strong>Selalu tanya: given-nya apa?</strong>")

    L.sec("lab1", "🔬 Lab 1: Dua Dadu, Given Jumlah > 8")
    L.lab("Lab 1 — Dunia Menyusut",
        "Simulasi: lempar dua dadu. Hitung P(jumlah=12) vs P(jumlah=12 | jumlah > 8). Lihat bagaimana syarat mengubah peluang.",
        'import random\nrandom.seed(21)\nN = 200000\ncnt12 = cnt_gt8 = cnt12_gt8 = 0\nfor _ in range(N):\n    d = random.randint(1,6) + random.randint(1,6)\n    if d == 12: cnt12 += 1\n    if d > 8:\n        cnt_gt8 += 1\n        if d == 12: cnt12_gt8 += 1\nprint(f"P(jumlah=12)          = {cnt12/N:.4f}  (teori 1/36 = 0.0278)")\nprint(f"P(jumlah=12 | jum>8)  = {cnt12_gt8/cnt_gt8:.4f}  (teori 1/10 = 0.1000)")\nprint()\nprint("Syarat memangkas dunia dari 36 hasil -> 10 hasil (9,10,11,12).")\nprint("Di dunia baru, peluang 12 naik 3.6x lipat!")\nprint("Coba: ganti syarat jadi jumlah > 10. Berapa dunia barunya?")',
        "Ubah syaratnya (misal jumlah genap). Kapan syarat <em>menurunkan</em> peluang?")

    L.sec("lab2", "🔬 Lab 2: Pohon Roll-Rate Kredit")
    L.lab("Lab 2 — Roll Rate via Hukum Peluang Total",
        "Nasabah telat 1–30 hari: 60% kembali lancar, 30% roll ke 31–60, 10% langsung gagal. Dari yang roll ke 31–60: 50% gagal. Hitung P(gagal | mulai telat 1–30) via pohon.",
        '# Pohon: mulai dari "telat 1-30"\n# Cabang 1: kembali lancar (0.60) -> P(gagal)=0\n# Cabang 2: roll ke 31-60 (0.30) -> P(gagal|31-60)=0.50\n# Cabang 3: langsung gagal (0.10) -> P(gagal)=1\np_gagal = 0.60*0 + 0.30*0.50 + 0.10*1\nprint(f"P(gagal | telat 1-30) = {p_gagal:.2%}")\nprint()\nprint("Ini hukum peluang total: jumlahkan (bobot cabang x peluang bersyarat).")\nprint("Coba: jika P(gagal|31-60) naik jadi 0.70, berapa P(gagal|telat 1-30)?")\nprint("Coba: tambah cabang baru di bawah 31-60 (roll ke 61-90).")',
        "Ubah angka-angka pohon sesuai data cabangmu. Pohon ini = inti <strong>roll-rate analysis</strong> di collection.")

    L.sec("peta", "🗺️ Peta Keputusan: Kapan Pakai Rumus Mana")
    L.decision("1", "Soal menyebut &ldquo;jika diketahui / given / di antara&rdquo; → <strong>definisi bersyarat</strong>",
        "Ada informasi baru yang memangkas ruang sampel.",
        kenapa="P(A|B) = P(A∩B)/P(B): bagi dengan &ldquo;ukuran dunia baru&rdquo;.",
        contoh="P(gagal | telat 30 hari) = 7/20 = 35%.")
    L.decision("2", "Kejadian berurutan &amp; tidak independen → <strong>perkalian umum</strong>",
        "Langkah kedua bergantung pada langkah pertama (tanpa pengembalian, rantai).",
        kenapa="P(A∩B) = P(A)×P(B|A) — rantai pohon peluang.",
        contoh="Dua kartu As berurutan: 4/52 × 3/51.")
    L.decision("3", "Banyak kelompok/jalur → <strong>hukum peluang total</strong>",
        "Populasi terbagi ke bucket (DPD, segmen, region) dengan peluang beda.",
        kenapa="P(A) = Σ bobot × P(A|bucket) — rata-rata tertimbang peluang bersyarat.",
        contoh="PD portofolio dari PD per bucket DPD.")
    L.decision("4", "Mau &ldquo;membalik&rdquo; arah: dari P(B|A) ke P(A|B) → <strong>Bayes (B4)</strong>",
        "Punya data diagnostik tapi butuh prediksi (atau sebaliknya).",
        kenapa="Butuh base rate P(A) — tidak bisa dibalik tanpa itu.",
        contoh="Dari &ldquo;70% yang gagal dulu telat&rdquo; ke &ldquo;nasabah telat, berapa peluang gagal?&rdquo;.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Temukan kata <strong>given</strong>-nya dulu — itulah penyebutmu.</li>"
        "<li>" + TI(r"P(A|B)") + " vs " + TI(r"P(B|A)") + ": tulis dengan kata-kata (&ldquo;given telat, berapa gagal&rdquo;) sebelum angka.</li>"
        "<li>Banyak jalur → gambar pohon, kali sepanjang jalur, jumlahkan jalur yang relevan.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Prioritas Collection")
    L.raw(callout("<p>Tim collection punya 1.000 akun telat. Kapasitas hanya 200 akun untuk ditelepon intensif minggu ini. Data historis:</p>"
        "<ul><li>Telat 1–30: 700 akun, P(gagal|bucket) = 8%</li>"
        "<li>Telat 31–60: 200 akun, P(gagal|bucket) = 25%</li>"
        "<li>Telat 61–90: 100 akun, P(gagal|bucket) = 55%</li></ul>"
        "<p><strong>Pertanyaan:</strong> (a) Berapa ekspektasi gagal bayar total (gunakan hukum peluang total)? (b) Jika hanya bisa telepon 200 akun, bucket mana yang diprioritaskan dan mengapa?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) Ekspektasi = 700×0,08 + 200×0,25 + 100×0,55 = 56 + 50 + 55 = <strong>161 akun</strong>. (Ekspektasi = jumlah × peluang — detail di B5.)</p>"
        "<p>(b) <strong>Telat 61–90 dulu (100 akun), lalu 100 dari bucket 31–60.</strong> Alasan: P(gagal|bucket) tertinggi = &ldquo;risiko per telepon&rdquo; tertinggi. Ini <em>risk-based prioritization</em>: alokasikan kapasitas ke peluang bersyarat terbesar, bukan ke bucket terbesar. Menelpon 200 akun acak hanya menyelamatkan ~32 (16%), strategi bucket menyelamatkan ~68.</p>")))

    L.quiz("P(gagal | telat 30 hari) = 35% artinya…",
        ["35% nasabah telat 30 hari", "Di antara nasabah telat 30 hari, 35% gagal", "35% nasabah gagal", "Telat 30 hari menyebabkan 65% gagal"],
        1, "Benar: &ldquo;di antara yang telat&rdquo; — dunia menyusut ke bucket telat. Bukan 35% dari semua nasabah.")
    L.quiz("P(A|B) = 35% dan P(B|A) = 70%. Mana untuk memprediksi risiko nasabah yang telat?",
        ["P(B|A) = 70%", "P(A|B) = 35%", "Keduanya sama", "Tidak ada yang benar"],
        1, "Benar: given-nya adalah &ldquo;telat&rdquo; (informasi yang kita punya) → P(gagal|telat). 70% adalah arah diagnostik.")
    L.quiz("Hukum peluang total P(A) = Σ P(Bi)P(A|Bi) pada dasarnya adalah…",
        ["Rata-rata tertimbang", "Aturan komplemen", "Permutasi", "Independensi"],
        0, "Benar: bobot P(Bi) × peluang bersyarat — sama seperti weighted mean di A1.2.")
    L.quiz("Dua kartu As berurutan tanpa pengembalian: 4/52 × 3/51. Suku 3/51 adalah…",
        ["P(As pertama)", "P(As kedua | As pertama)", "P(As pertama | As kedua)", "P(keduanya As)"],
        1, "Benar: setelah satu As keluar, tersisa 3 As dari 51 kartu — peluang bersyarat.")
    L.quiz("Kapan P(A|B) > P(A)?",
        ["Tidak pernah", "Selalu", "Jika B berkorelasi positif dengan A", "Jika A dan B independen"],
        2, "Benar: syarat yang &ldquo;kabar baik/buruk&rdquo; menggeser peluang. Jika independen, P(A|B) = P(A) — informasi tidak mengubah apa-apa.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>" + TI(r"P(A|B)") + " = proporsi A di dalam dunia B</strong> — informasi memangkas ruang sampel.</li>"
        "<li><strong>Jangan tertukar</strong> " + TI(r"P(A|B)") + " vs " + TI(r"P(B|A)") + " — prediksi vs diagnosis.</li>"
        "<li><strong>Perkalian umum:</strong> " + TI(r"P(A\\cap B) = P(A)P(B|A)") + " — rantai pohon, tanpa asumsi independen.</li>"
        "<li><strong>Hukum peluang total:</strong> pecah per bucket, lalu rata-rata tertimbang.</li>"
        "<li><strong>Jangan</strong> pakai peluang umum untuk keputusan individual — selalu cari peluang bersyarat yang relevan.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B4
def b4():
    L = Lesson("b4-bayes", "B4 — Probabilitas",
        "Teorema Bayes: Membalik<br/>Arah Peluang",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("b3-peluang-bersyarat", "← B3"), ("b5-variabel-acak-ekspektasi", "Next: B5"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menurunkan dan menerapkan <strong>teorema Bayes</strong> untuk membalik " + TI(r"P(B|A)") + " menjadi " + TI(r"P(A|B)") + ".</li>"
        "<li>Menjelaskan <strong>base rate fallacy</strong> dengan angka konkret — mengapa tes 99% akurat bisa menipu.</li>"
        "<li>Mensimulasikan <strong>Monty Hall</strong> dan menjelaskan mengapa &ldquo;ganti pintu&rdquo; menang 2/3.</li>"
        "<li>Menerapkan pola pikir Bayesian (prior → data → posterior) pada fraud alert dan skrining kredit.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Tes 99% Akurat yang Menipu")
    L.raw('<div className="story"><p>Sebuah tes fraud diklaim <strong>99% akurat</strong>: jika transaksi fraud, 99% terdeteksi; jika bukan fraud, 99% dinyatakan bersih. Alarm berbunyi untuk transaksimu. <em>&ldquo;Berapa peluang transaksi ini benar-benar fraud?&rdquo;</em></p>'
        "<p>Kebanyakan menjawab 99%. Jawaban yang benar: <strong>sekitar 9%</strong>.</p>"
        "<p>Kok bisa? Karena fraud itu <strong>langka</strong> — hanya 1 dari 1.000 transaksi. Dari 1.000 transaksi: 1 fraud (terdeteksi, 99%) + 999 bukan fraud (1% salah alarm ≈ 10 alarm palsu). Total 11 alarm, hanya 1 yang benar → 1/11 ≈ 9%. Akurasi tes tidak sama dengan <em>kepercayaan pada hasil positif</em> — yang menentukan adalah <strong>base rate</strong>.</p>"
        "<p>Teorema Bayes adalah mesin matematika untuk hitungan seperti ini — dan jebakan ini (base rate fallacy) memakan korban di medis, hukum, hiring, dan fraud detection.</p></div>")

    L.sec("rumus", "Teorema Bayes — Mesin Pembalik")
    L.p(T(r"P(A|B) = \frac{P(B|A)\,P(A)}{P(B)}"))
    L.ul([
        TI(r"P(A)") + " = <strong>prior</strong>: keyakinan sebelum melihat bukti (base rate!)",
        TI(r"P(B|A)") + " = <strong>likelihood</strong>: seberapa cocok bukti jika A benar",
        TI(r"P(B)") + " = <strong>evidence</strong>: total peluang melihat bukti (via hukum peluang total)",
        TI(r"P(A|B)") + " = <strong>posterior</strong>: keyakinan setelah melihat bukti",
    ])
    L.p("Bentuk lengkap dengan hukum peluang total di penyebut:")
    L.p(T(r"P(A|B) = \frac{P(B|A)\,P(A)}{P(B|A)\,P(A) + P(B|A^c)\,P(A^c)}"))
    L.raw(worked("📐 Contoh langkah-demi-langkah (tes fraud di cerita)",
        "<p>Diketahui: base rate fraud " + TI(r"P(F)=0{,}001") + ", " + TI(r"P(+|F)=0{,}99") + " (sensitivitas), " + TI(r"P(+|F^c)=0{,}01") + " (false alarm).</p>"
        "<p><strong>Langkah 1</strong> — penyebut (total peluang alarm): " + TI(r"P(+) = 0{,}99\\times0{,}001 + 0{,}01\\times0{,}999 = 0{,}00099 + 0{,}00999 = 0{,}01098") + ".</p>"
        "<p><strong>Langkah 2</strong> — Bayes: " + T(r"P(F|+) = \\frac{0{,}99 \\times 0{,}001}{0{,}01098} \\approx 0{,}09", block=False) + " = <strong>9%</strong>.</p>"
        "<p>Perhatikan: pembilang kecil (fraud langka &times; tes bagus), penyebut didominasi <em>false alarm dari populasi besar yang bersih</em>. Itulah base rate fallacy dalam satu rumus.</p>"))
    L.raw(myth("Tes 99% akurat → hasil positif berarti 99% benar.",
        "Akurasi (sensitivitas) menjawab &ldquo;given sakit, berapa % terdeteksi&rdquo; — bukan &ldquo;given positif, berapa % sakit&rdquo;. Yang kedua butuh base rate. Pada penyakit langka (0,1%), bahkan tes 99% akurat menghasilkan mayoritas false positive. Jangan pernah menafsirkan hasil tes tanpa prevalensi."))
    L.raw(tip("Berpikirlah dalam <strong>frekuensi natural</strong>: &ldquo;dari 1.000 transaksi…&rdquo; bukan &ldquo;P=0,001&rdquo;. Otak manusia (termasuk dokter dan analis!) jauh lebih akurat dengan frekuensi. Ini trik komunikasi juga: jelaskan Bayes ke direksi dengan &ldquo;dari 1.000…&rdquo;."))

    L.sec("monty", "Monty Hall — &ldquo;Ganti Pintu&rdquo; Menang 2/3")
    L.p("Tiga pintu, satu mobil. Kamu pilih pintu 1. Pembawa acara (yang <strong>tahu</strong> di mana mobil) membuka pintu 3 — kosong — lalu bertanya: tetap atau ganti ke pintu 2?")
    L.p("Intuisi bilang 50:50. Bayes bilang <strong>ganti menang 2/3</strong>. Mengapa? Prior: mobil di pintu 1 = 1/3. Pembawa acara membuka pintu kosong <em>bukan acak</em> — tindakannya adalah <strong>bukti</strong> yang menggeser keyakinan. Jika mobil di pintu 2 (prob 2/3), ia <em>dipaksa</em> membuka pintu 3. Jadi &ldquo;ia membuka pintu 3&rdquo; justru mengonfirmasi pintu 2.")
    L.p("<strong>Kepribadian Bayes:</strong> bukan rumusnya yang pintar — melainkan disiplin bertanya <em>&ldquo;seberapa mungkin saya melihat bukti ini, jika hipotesis saya benar vs salah?&rdquo;</em>")
    L.raw(tip("Prior yang jujur > prior yang &ldquo;netral&rdquo;. Beta(1,1) (uniform) terlihat netral tapi bisa menyesatkan untuk kejadian langka — prior yang baik memakai <strong>pengetahuan domain</strong> (base rate historis). Bayes tidak menciptakan info dari nol; ia mengkombinasikan info lama + baru secara konsisten."))
    L.raw(myth("Setelah satu pintu dibuka, peluangnya 50:50.",
        "Hanya jika pembuka <em>tidak tahu</em> dan membuka acak. Karena ia tahu dan menghindari mobil, buktinya informatif — posterior bergeser ke 2/3 untuk pintu lain. <strong>Informasi mengubah peluang</strong> (B3!), dan Bayes mengukurnya."))

    L.chart(
        data=[{"x": ["Prior: P(fraud)=0,1%", "Posterior: P(fraud|alarm)=9%"],
               "y": [0.001, 0.09], "type": "bar",
               "marker": {"color": ["#94a3b8", "#e8a838"]},
               "text": ["0,1%", "9%"], "textposition": "outside"}],
        title="Prior → Posterior: Alarm 99% Akurat",
        layout={"yaxis": {"title": "Peluang fraud", "tickformat": ".0%"}, "showlegend": False},
        cara="Batang kiri = keyakinan sebelum alarm (base rate); batang kanan = setelah alarm positif dari tes 99% akurat.",
        interpretasi="Alarm menaikkan keyakinan 90x lipat (0,1% → 9%) — tesnya <em>berguna</em>! Tapi 9% ≠ 99%. <strong>Pelajaran operasional:</strong> setiap alarm fraud masih 91% false positive → butuh investigasi, bukan blokir otomatis. Inilah mengapa fraud punya tim investigator, bukan sekadar rule.")

    L.chart(
        data=[{"x": ["Tetap di pintu awal", "Ganti pintu"],
               "y": [0.333, 0.667], "type": "bar",
               "marker": {"color": ["#94a3b8", "#2a7de1"]},
               "text": ["33%", "67%"], "textposition": "outside"}],
        title="Monty Hall: Strategi Ganti vs Tetap",
        layout={"yaxis": {"title": "Peluang menang", "tickformat": ".0%"}, "showlegend": False},
        cara="Dua strategi, tinggi batang = peluang menang jangka panjang.",
        interpretasi="Ganti menang 2x lebih sering. Ini bukan sulap — ini Bayes: tindakan pembawa acara (bukti) + prior 1/3 menghasilkan posterior 2/3. <strong>Analogi bisnis:</strong> &ldquo;tetap&rdquo; = bertahan pada hipotesis awal; &ldquo;ganti&rdquo; = update keyakinan saat bukti baru datang.")

    L.sec("lab1", "🔬 Lab 1: Simulasi Tes Fraud 100.000 Transaksi")
    L.lab("Lab 1 — Base Rate Fallacy (Bukti Angka)",
        "Simulasi 100.000 transaksi dengan base rate 0,1% dan tes 99% akurat. Hitung sendiri P(fraud|alarm).",
        'import random\nrandom.seed(99)\nN = 100000\nbase_rate = 0.001\nsens = 0.99   # P(alarm | fraud)\nfalse_alarm = 0.01  # P(alarm | bukan fraud)\n\nalarm_benar = alarm_palsu = 0\nfor _ in range(N):\n    fraud = random.random() < base_rate\n    if fraud:\n        if random.random() < sens: alarm_benar += 1\n    else:\n        if random.random() < false_alarm: alarm_palsu += 1\n\ntotal_alarm = alarm_benar + alarm_palsu\nprint(f"Total alarm      : {total_alarm}")\nprint(f"Alarm benar      : {alarm_benar}")\nprint(f"Alarm palsu      : {alarm_palsu}")\nprint(f"P(fraud | alarm) = {alarm_benar/total_alarm:.2%}")\nprint()\nprint("Coba: base_rate = 0.10 (fraud 10%). Berapa P(fraud|alarm) sekarang?")\nprint("Kesimpulan: tes yang SAMA, kepercayaan beda jauh jika base rate beda.")',
        "Ubah base_rate jadi 0,1 (skenario krisis fraud). Lihat posterior melonjak — base rate adalah raja.")

    L.sec("lab2", "🔬 Lab 2: Monty Hall 50.000x")
    L.lab("Lab 2 — Buktikan &ldquo;Ganti&rdquo; Menang",
        "Simulasi strategi tetap vs ganti. Intuisimu akan kalah dari angka.",
        'import random\nrandom.seed(5)\nN = 50000\nmenang_tetap = menang_ganti = 0\nfor _ in range(N):\n    mobil = random.randrange(3)\n    pilih = random.randrange(3)\n    # pembawa acara buka pintu kosong yang bukan pilihanmu\n    buka = random.choice([p for p in range(3) if p != pilih and p != mobil])\n    if pilih == mobil: menang_tetap += 1\n    ganti = [p for p in range(3) if p != pilih and p != buka][0]\n    if ganti == mobil: menang_ganti += 1\nprint(f"Tetap : {menang_tetap/N:.2%}")\nprint(f"Ganti : {menang_ganti/N:.2%}")\nprint()\nprint("Coba: 100 pintu, dibuka 98 kosong. Ganti menang berapa? (ubah range(3)->range(100))")',
        "Versi 100 pintu membuat intuisinya klik: pilihan awalmu hampir pasti salah (99%), jadi ganti hampir pasti benar.")

    L.sec("peta", "🗺️ Peta Keputusan: Kapan Berpikir Bayesian")
    L.decision("1", "Ada hasil tes/alarm → <strong>tanya base rate dulu</strong>",
        "Sensitivitas tes diketahui, tapi prevalensi kondisi tidak dipertimbangkan.",
        kenapa="Posterior didominasi base rate saat kondisi langka — tanpa itu, alarm 99% akurat pun 91% palsu.",
        contoh="Alarm fraud, skrining penyakit langka, tes rekrutmen.")
    L.decision("2", "Keyakinan awal + bukti baru berdatangan → <strong>update sekuensial</strong>",
        "Data datang bertahap (transaksi per transaksi, cicilan per bulan).",
        kenapa="Posterior hari ini = prior besok. Bayes adalah &ldquo;cara belajar&rdquo; yang konsisten — ini fondasi B17.",
        contoh="Skor fraud nasabah diupdate tiap transaksi baru.")
    L.decision("3", "Bukti dihasilkan oleh agen yang tahu sesuatu → <strong>waspadai seleksi</strong>",
        "Informasi tidak muncul acak (pembawa acara tahu, penjual tahu cacatnya).",
        kenapa="Likelihood P(bukti|hipotesis) harus memodelkan <em>proses menghasilkan bukti</em>, bukan sekadar bukti.",
        contoh="Monty Hall; &ldquo;penjual hanya menunjukkan review bagus&rdquo;.")
    L.decision("4", "Dua arah tersedia → <strong>pilih arah yang menjawab keputusan</strong>",
        "Punya P(B|A) tapi keputusan butuh P(A|B).",
        kenapa="Prediksi butuh P(hasil|info yang kupunya); diagnosis butuh arah sebaliknya. Bayes menjembatani.",
        contoh="Dari &ldquo;90% gagal bayar dulu telat&rdquo; ke &ldquo;nasabah ini telat — berapa peluang gagal?&rdquo;.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Dengar &ldquo;akurasi tes&rdquo; → langsung tanya: <strong>berapa base rate-nya?</strong></li>"
        "<li>Ubah persen ke <strong>frekuensi natural</strong> (&ldquo;dari 1.000…&rdquo;) sebelum percaya intuisi.</li>"
        "<li>Bukti baru → update keyakinan, jangan buang prior (dan jangan abaikan bukti).</li></ol>"))

    L.sec("case", "📋 Mini-Case: Blokir Otomatis atau Investigasi?")
    L.raw(callout("<p>Startup paylater memakai rule: <em>&ldquo;skor fraud > 0,8 → blokir otomatis&rdquo;</em>. Vendor mengklaim sensitivitas 95%, false positive 5%. Base rate fraud aktual: 0,5%.</p>"
        "<p><strong>Pertanyaan:</strong> (a) Hitung P(fraud | skor > 0,8). (b) Apakah blokir otomatis keputusan tepat? Apa alternatifnya?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) P(+) = 0,95×0,005 + 0,05×0,995 = 0,00475 + 0,04975 = 0,0545. P(fraud|+) = 0,00475/0,0545 ≈ <strong>8,7%</strong>.</p>"
        "<p>(b) <strong>Blokir otomatis salah.</strong> 91% yang diblokir adalah pelanggan sah — bencana churn + komplain. Alternatif Bayesian: gunakan posterior 8,7% sebagai <em>prior untuk investigasi bertingkat</em> — verifikasi ringan (OTP/biometrik) dulu, eskalasi hanya jika bukti tambahan menaikkan posterior. Inilah pola &ldquo;step-up authentication&rdquo; di industri: keputusan proporsional dengan posterior, bukan biner dari alarm mentah.</p>")))

    L.quiz("Tes 99% akurat, penyakit 0,1%. Hasil positif → peluang benar-benar sakit sekitar…",
        ["99%", "50%", "9%", "0,1%"],
        2, "Benar: ~9%. False positive dari populasi sehat yang besar menenggelamkan true positive — base rate fallacy.")
    L.quiz("Dalam Bayes, &ldquo;prior&rdquo; adalah…",
        ["Hasil akhir setelah bukti", "Keyakinan sebelum melihat bukti (base rate)", "Akurasi tes", "Jumlah sampel"],
        1, "Benar: prior = P(A) sebelum bukti. Tanpa prior yang jujur, posterior ikut ngawur.")
    L.quiz("Monty Hall: strategi optimal dan alasannya…",
        ["Tetap — sudah 50:50", "Ganti — menang 2/3 karena bukti pembawa acara informatif", "Acak saja", "Tidak ada strategi"],
        1, "Benar: pembawa acara yang tahu &ldquo;membocorkan&rdquo; informasi lewat pilihannya — posterior pintu lain = 2/3.")
    L.quiz("Alarm fraud 8,7% posterior. Keputusan bisnis terbaik?",
        ["Blokir otomatis semua", "Abaikan alarm", "Investigasi bertingkat proporsional dengan posterior", "Naikkan threshold sampai 99%"],
        2, "Benar: 91% false positive → blokir otomatis membunuh pelanggan sah. Eskalasi bertingkat = keputusan proporsional risiko.")
    L.quiz("Frekuensi natural (&ldquo;dari 1.000…&rdquo;) disarankan karena…",
        ["Lebih presisi matematis", "Otak manusia lebih akurat menalar frekuensi daripada persen bersyarat", "Disyaratkan regulator", "Lebih cepat dihitung"],
        1, "Benar: riset kognitif menunjukkan dokter/analis jauh lebih tepat dengan frekuensi natural — trik komunikasi juga.")
    L.quiz("Kapan posterior ≈ prior (bukti tidak mengubah keyakinan)?",
        ["Bukti sangat kuat", "Bukti tidak informatif: P(bukti|A) = P(bukti|¬A)", "Prior = 50%", "Sampel besar"],
        1, "Benar: jika bukti sama mungkin muncul baik saat A benar maupun salah, likelihood ratio = 1 → posterior = prior.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Bayes = mesin pembalik:</strong> dari " + TI(r"P(B|A)") + " ke " + TI(r"P(A|B)") + " via prior.</li>"
        "<li><strong>Base rate adalah raja:</strong> pada kondisi langka, mayoritas alarm positif adalah palsu.</li>"
        "<li><strong>Frekuensi natural</strong> (&ldquo;dari 1.000&rdquo;) mengalahkan persen untuk intuisi.</li>"
        "<li><strong>Posterior hari ini = prior besok</strong> — belajar sekuensial (fondasi B17).</li>"
        "<li><strong>Jangan</strong> menafsirkan akurasi tes sebagai kepercayaan hasil — dan <strong>jangan</strong> blokir otomatis dari posterior 9%.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B5
def b5():
    L = Lesson("b5-variabel-acak-ekspektasi", "B5 — Probabilitas",
        "Variabel Acak &amp; Ekspektasi:<br/>Rata-rata yang Menipu",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("b4-bayes", "← B4"), ("b6-distribusi-diskret-1", "Next: B6.1"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Mendefinisikan <strong>variabel acak</strong> dan membedakan diskret vs kontinu.</li>"
        "<li>Menghitung <strong>ekspektasi</strong> " + TI(r"E[X]") + " dan menjelaskan mengapa ia &ldquo;rata-rata jangka panjang&rdquo;, bukan &ldquo;nilai yang akan terjadi&rdquo;.</li>"
        "<li>Menghitung <strong>varians</strong> " + TI(r"Var(X)") + " dan memakai sifat linearitas ekspektasi.</li>"
        "<li>Menjelaskan <strong>ketaksamaan Jensen</strong> — mengapa rata-rata dari fungsi ≠ fungsi dari rata-rata (penting untuk risiko!).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Asuransi yang &ldquo;Pasti Untung&rdquo;?")
    L.raw('<div className="story"><p>Perusahaan asuransi menjual 1.000 polis. Tiap polis: premi Rp1 juta, klaim Rp100 juta dengan peluang 0,5%. Ekspektasi klaim per polis = 0,005 × 100 jt = <strong>Rp500 ribu</strong>. Premi 1 jt &gt; 500 rb — <em>&ldquo;pasti untung Rp500 ribu per polis!&rdquo;</em> kata direksi.</p>'
        "<p>Tapi tahun itu klaim datang 12x (bukan 5x) — perusahaan rugi. Tahun lain cuma 1x — untung besar. <strong>Ekspektasi bukan janji tahunan; ia rata-rata dari banyak tahun.</strong> Dan ada yang lebih dalam: <em>varians</em> menentukan apakah perusahaan selamat sampai &ldquo;jangka panjang&rdquo; itu tiba.</p>"
        "<p>Variabel acak + ekspektasi + varians = bahasa untuk semua model risiko (EL = PD × LGD × EAD tidak lain adalah ekspektasi!).</p></div>")

    L.sec("rv", "Variabel Acak — Angka yang Belum Pasti")
    L.p("<strong>Definisi.</strong> Variabel acak (" + TI(r"X") + ") adalah <strong>fungsi</strong> yang memetakan tiap hasil ruang sampel ke bilangan real. Bukan &ldquo;variabel yang acak&rdquo; — melainkan <em>nilai numerik dari kejadian acak</em>.")
    L.p("<strong>Contoh.</strong> " + TI(r"X") + " = jumlah &ldquo;angka&rdquo; dari 2 lemparan koin: " + TI(r"X(AA)=2,\\ X(AG)=X(GA)=1,\\ X(GG)=0") + ".")
    L.ul([
        "<strong>Diskret:</strong> nilai terhitung (0,1,2,…) — jumlah gagal bayar, jumlah klaim. Punya <strong>pmf</strong> " + TI(r"p(x) = P(X=x)") + ".",
        "<strong>Kontinu:</strong> nilai di interval — waktu tunggu, return saham. Punya <strong>pdf</strong> " + TI(r"f(x)") + " (peluang = luas di bawah kurva; P(X=tepat 5,0) = 0!).",
    ])
    L.p("<strong>Kepribadian:</strong> variabel acak adalah &ldquo;pelempar dadu yang sudah diberi label angka&rdquo; — ia mengubah kejadian kualitatif menjadi angka sehingga bisa dihitung rata-ratanya.")
    L.raw(tip("Notasi: huruf kapital " + TI(r"X") + " = variabel acak (belum diketahui), huruf kecil " + TI(r"x") + " = nilai konkret yang teramati. " + TI(r"P(X=x)") + " dibaca &ldquo;peluang X bernilai x&rdquo;. Konsisten dengan notasi ini = separuh kebingungan hilang."))

    L.sec("ekspek", "Ekspektasi — Rata-rata Tertimbang Peluang")
    L.p(T(r"E[X] = \sum_x x \cdot P(X=x)"))
    L.ul([
        TI(r"x") + ": tiap nilai yang mungkin",
        TI(r"P(X=x)") + ": bobot peluangnya",
    ])
    L.p("<strong>Interpretasi:</strong> persis <strong>weighted mean</strong> (A1.2) dengan peluang sebagai bobot! Dan secara operasional = <strong>rata-rata dari sangat banyak pengulangan</strong> (ini dibuktikan B11/LLN).")
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Dadu adil, " + TI(r"X") + " = mata dadu:</p>"
        "<p>" + T(r"E[X] = 1\\cdot\\tfrac16 + 2\\cdot\\tfrac16 + \\cdots + 6\\cdot\\tfrac16 = \\tfrac{21}{6} = 3{,}5", block=False) + ".</p>"
        "<p>Perhatikan: <strong>3,5 tidak pernah muncul</strong> di dadu! Ekspektasi bukan &ldquo;nilai yang akan terjadi&rdquo; — ia pusat gravitasi distribusi. Inilah &ldquo;rata-rata yang menipu&rdquo; jika disalahartikan sebagai prediksi.</p>"))
    L.h3("Sifat super: linearitas ekspektasi")
    L.p(T(r"E[aX + bY + c] = a\,E[X] + b\,E[Y] + c"))
    L.p("<strong>Berlaku SELALU</strong> — bahkan jika " + TI(r"X,Y") + " tidak independen, bahkan jika berkorelasi! Inilah mengapa EL portofolio = Σ EL tiap kredit (B13 memakai ini). <strong>Tidak ada sifat sekuat ini untuk varians</strong> (lihat bawah).")
    L.raw(myth("Ekspektasi = nilai yang paling mungkin terjadi.",
        "Ekspektasi 3,5 dadu tidak pernah muncul; ekspektasi klaim Rp500 ribu tidak berarti klaim &ldquo;tipikal&rdquo; Rp500 ribu (klaim aktual: 0 atau 100 jt!). Yang &ldquo;paling mungkin&rdquo; adalah <strong>modus</strong> distribusi. Ekspektasi = pusat gravitasi, bukan prediksi kejadian tunggal."))
    L.raw(tip("Untuk keputusan bisnis, pasangkan ekspektasi dengan varians (atau distribusi penuh). &ldquo;Ekspektasi untung 500 rb&rdquo; tanpa varians = setengah cerita — seperti mean tanpa SD (A1.3)."))

    L.sec("var", "Varians — Seberapa Liar di Sekitar Ekspektasi")
    L.p(T(r"\mathrm{Var}(X) = E\big[(X - E[X])^2\big] = E[X^2] - (E[X])^2"))
    L.ul([
        TI(r"E[X^2] - (E[X])^2") + ": rumus hitung cepat (bukti satu baris dari linearitas).",
        TI(r"\sigma = \\sqrt{\\mathrm{Var}(X)}") + ": standar deviasi — kembali ke satuan asli.",
    ])
    L.p("<strong>Contoh.</strong> Dadu: " + TI(r"E[X^2] = (1+4+9+16+25+36)/6 = 91/6") + ", " + T(r"\\mathrm{Var}(X) = \\tfrac{91}{6} - 3{,}5^2 = \\tfrac{35}{12} \\approx 2{,}92", block=False) + ", σ ≈ 1,71.")
    L.p("<strong>Sifat varians</strong> (tidak selinier ekspektasi!):")
    L.p(T(r"\mathrm{Var}(aX + b) = a^2\,\mathrm{Var}(X)"))
    L.p(T(r"\mathrm{Var}(X+Y) = \mathrm{Var}(X) + \mathrm{Var}(Y) + 2\,\mathrm{Cov}(X,Y)"))
    L.p("Independen → kovarians 0 → varians jumlah = jumlah varians. <strong>Tapi</strong> jika berkorelasi positif, varians meledak — inilah matematika di balik &ldquo;diversifikasi gagal saat krisis&rdquo; (B9/B10).")
    L.raw(myth("Varians jumlah selalu = jumlah varians.",
        "Hanya jika tidak berkorelasi! Rumus lengkap punya suku " + TI(r"2\\,\\mathrm{Cov}(X,Y)") + ". Mengabaikannya = mengabaikan risiko korelasi — dosa klasik pra-2008. Diversifikasi bekerja <em>karena</em> kovarians rendah/negatif."))

    L.sec("jensen", "Ketaksamaan Jensen — Rata-rata dari Fungsi ≠ Fungsi dari Rata-rata")
    L.p("Untuk fungsi <strong>cembung</strong> (" + TI(r"f") + " melengkung ke atas, misal " + TI(r"x^2,\\ e^x") + "):")
    L.p(T(r"E[f(X)] \geq f(E[X])"))
    L.p("(Untuk cekung/∩, tanda berbalik.) <strong>Contoh konkret:</strong> " + TI(r"X") + " = {0 dengan p=1/2, 100 dengan p=1/2}. " + TI(r"E[X]=50") + ". Tapi " + TI(r"E[X^2] = 5000") + " sedangkan " + TI(r"(E[X])^2 = 2500") + " — <strong>2x lipat!</strong>")
    L.p("<strong>Mengapa penting untuk risiko?</strong> Kerugian (loss) adalah fungsi <strong>cembung</strong> dari kejadian buruk — Jensen bilang <em>ekspektasi kerugian ≥ kerugian dari ekspektasi kejadian</em>. Model yang hanya memakai &ldquo;skenario rata-rata&rdquo; <strong>sistematis meremehkan</strong> risiko. Inilah argumen matematis untuk stress testing &amp; distribusi penuh, bukan point forecast.")
    L.raw(tip("Tes cepat Jensen: jika fungsinya melengkung (cembung/cekung), jangan pernah &ldquo;masukkan rata-rata ke fungsi&rdquo;. Hitung ekspektasi dari <em>distribusinya</em>. Aturan ini menjelaskan mengapa opsi (payoff cembung) berharga mahal saat volatilitas tinggi."))

    L.chart(
        data=[{"x": ["0", "100"], "y": [0.5, 0.5], "type": "bar", "name": "pmf",
               "marker": {"color": "#2a7de1"}, "text": ["50%", "50%"], "textposition": "outside"},
              {"x": [50], "y": [0.55], "type": "scatter", "mode": "markers", "name": "E[X]=50",
               "marker": {"color": "#e8a838", "size": 14, "symbol": "diamond"}}],
        title="Ekspektasi 50 yang Tidak Pernah Terjadi",
        layout={"xaxis": {"title": "X (klaim, juta Rp)"}, "yaxis": {"title": "Peluang"}, "showlegend": True},
        cara="Batang = distribusi X (klaim 0 atau 100 jt, masing-masing 50%); berlian kuning = ekspektasi 50.",
        interpretasi="Ekspektasi (50) jatuh di <strong>lembah kosong</strong> — tidak ada hasil yang bernilai 50. Visual ini = inti &ldquo;rata-rata yang menipu&rdquo;: ekspektasi adalah pusat gravitasi, bukan prediksi. Untuk keputusan (premi, cadangan), yang relevan adalah seluruh distribusi + varians.")

    L.chart(
        data=[{"x": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
               "y": [0, 100, 400, 900, 1600, 2500, 3600, 4900, 6400, 8100, 10000],
               "type": "scatter", "mode": "lines", "name": "f(x) = x² (cembung)",
               "line": {"color": "#e8a838"}},
              {"x": [0, 100], "y": [0, 10000], "type": "scatter", "mode": "lines",
               "name": "garis lurus (linear)", "line": {"color": "#94a3b8", "dash": "dash"}}],
        title="Jensen: Fungsi Cembung di Atas Garis Lurus",
        layout={"xaxis": {"title": "x"}, "yaxis": {"title": "f(x)"}, "showlegend": True},
        cara="Kurva kuning = x² (cembung); garis putus-putus = fungsi linear. Pada x=50, kurva di atas garis.",
        interpretasi="Karena melengkung ke atas, rata-rata dari f(X) (titik-titik di kurva) selalu ≥ f(rata-rata X) (garis). <strong>Implikasi risiko:</strong> jika kerugian cembung terhadap guncangan, memakai &ldquo;guncangan rata-rata&rdquo; meremehkan ekspektasi kerugian — harus integrasikan seluruh distribusi (atau Monte Carlo, B12).")

    L.sec("lab1", "🔬 Lab 1: Ekspektasi Asuransi — Jangka Panjang vs Satu Tahun")
    L.lab("Lab 1 — Kapan &ldquo;Pasti Untung&rdquo; Gagal",
        "Simulasi 1.000 polis/tahun selama 30 tahun. Premi 1 jt, klaim 100 jt (p=0,5%). Lihat tahun-tahun rugi meski ekspektasi untung.",
        'import random\nrandom.seed(2026)\nN_POLIS, PREMI, KLAIM, P = 1000, 1_000_000, 100_000_000, 0.005\nE_untung = N_POLIS * (PREMI - P * KLAIM)\nprint(f"Ekspektasi untung/tahun = Rp{E_untung/1e6:.0f} juta")\nprint()\nrugi = 0\nfor th in range(1, 31):\n    n_klaim = sum(random.random() < P for _ in range(N_POLIS))\n    untung = N_POLIS * PREMI - n_klaim * KLAIM\n    flag = "  <-- RUGI" if untung < 0 else ""\n    if untung < 0: rugi += 1\n    print(f"Tahun {th:>2}: {n_klaim:>2} klaim, untung Rp{untung/1e6:+7.0f} jt{flag}")\nprint(f"\\nTahun rugi: {rugi}/30 meski ekspektasi untung tiap tahun!")\nprint("Coba: P=0.008. Berapa tahun rugi? (ekspektasi masih untung?)")',
        "Naikkan P sampai ekspektasi mendekati nol. Rasakan: <strong>varians</strong> yang menentukan selamat/tidaknya perusahaan, bukan cuma ekspektasi.")

    L.sec("lab2", "🔬 Lab 2: Buktikan Jensen dengan Simulasi")
    L.lab("Lab 2 — E[X²] vs (E[X])²",
        "Simulasi membuktikan ketaksamaan Jensen: E[X²] > (E[X])² untuk X acak non-degenerat.",
        'import random, statistics\nrandom.seed(8)\nN = 200000\n# X: 0 (50%) atau 100 (50%)\nxs = [0 if random.random() < 0.5 else 100 for _ in range(N)]\nmean = statistics.mean(xs)\nE_x2 = statistics.mean([x**2 for x in xs])\nprint(f"E[X]     = {mean:.1f}")\nprint(f"(E[X])^2  = {mean**2:.0f}")\nprint(f"E[X^2]   = {E_x2:.0f}")\nprint(f"Selisih   = {E_x2 - mean**2:.0f}  (= Var(X)! cek: {statistics.pvariance(xs):.0f})")\nprint()\nprint("Selisih E[X^2]-(E[X])^2 PERSIS = Var(X). Itulah rumus varians cepat.")\nprint("Coba: ganti distribusi jadi dadu 1-6. Masih berlaku?")',
        "Identitas E[X²]−(E[X])² = Var(X) adalah jembatan hitung cepat varians — hafalkan.")

    L.sec("peta", "🗺️ Peta Keputusan: Ekspektasi, Varians, atau Distribusi Penuh?")
    L.decision("1", "Butuh &ldquo;rata-rata jangka panjang&rdquo; → <strong>ekspektasi</strong>",
        "Banyak pengulangan independen: premi asuransi, EL portofolio besar.",
        kenapa="Linearitas: E[total] = Σ E[bagian] — selalu benar, bahkan jika berkorelasi.",
        contoh="EL = Σ PD×LGD×EAD per fasilitas (B13).")
    L.decision("2", "Butuh &ldquo;seberapa liar&rdquo; → <strong>varians/SD</strong>",
        "Satu periode bisa jauh dari ekspektasi; ada batas toleransi rugi.",
        kenapa="Varians mengukur risiko di sekitar ekspektasi — tanpa ini, &ldquo;untung 500 rb&rdquo; tak bermakna.",
        contoh="Modal asuransi disiapkan dari varians klaim, bukan dari ekspektasi.")
    L.decision("3", "Fungsi cembung/cekung (opsi, utilitas, loss) → <strong>Jensen: jangan colok rata-rata</strong>",
        "Payoff non-linear terhadap variabel acak.",
        kenapa="E[f(X)] ≠ f(E[X]) — selisihnya bisa 2x lipat atau lebih.",
        contoh="Harga opsi naik dengan volatilitas (bukan cuma harga rata-rata).")
    L.decision("4", "Keputusan satu kejadian / ekor ekstrem → <strong>distribusi penuh</strong>",
        "Yang penting bukan rata-rata melainkan P(rugi > X) — VaR, stress test.",
        kenapa="Ekspektasi + varians tidak menangkap bentuk ekor (butuh B7/B16).",
        contoh="&ldquo;Berapa peluang rugi > Rp10 M tahun ini?&rdquo; — butuh distribusi, bukan mean.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Ekspektasi menjawab &ldquo;rata-rata jika diulang banyak&rdquo; — bukan &ldquo;yang akan terjadi&rdquo;.</li>"
        "<li>Varians jumlah = jumlah varians <strong>+ 2×kovarians</strong> — jangan lupakan suku terakhir.</li>"
        "<li>Fungsi melengkung → Jensen: hitung dari distribusi, jangan colok rata-rata.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Pricing Premi yang Adil (dan Selamat)")
    L.raw(callout("<p>Asuransi mikro: 5.000 nasabah, klaim Rp20 juta dengan peluang 1%/tahun. Biaya operasional Rp50 ribu/polis.</p>"
        "<p><strong>Pertanyaan:</strong> (a) Premi minimum agar ekspektasi impas? (b) Mengapa premi aktual harus lebih tinggi? (c) Apa peran varians di sini?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) E[klaim] = 0,01 × 20 jt = <strong>Rp200 ribu</strong>. Impas ekspektasi: premi = 200 rb + 50 rb = <strong>Rp250 ribu</strong>.</p>"
        "<p>(b) Karena <strong>satu tahun buruk bisa membunuh perusahaan</strong> sebelum &ldquo;jangka panjang&rdquo; tiba. Premi aktual = 250 rb + <em>risk loading</em> (buffer modal) + margin. Risk loading dihitung dari varians/ekor distribusi klaim — bukan dari ekspektasi.</p>"
        "<p>(c) SD klaim per polis = √(0,01×0,99)×20 jt ≈ Rp1,99 jt — <strong>10x ekspektasinya!</strong> Untuk 5.000 polis independen, SD total = √5000 × 1,99 jt ≈ Rp141 jt vs ekspektasi total Rp1 M. Rasio inilah yang menentukan buffer modal. (Diversifikasi: makin banyak polis, rasio SD/mean makin kecil — akar dari hukum bilangan besar, B11.)</p>")))

    L.quiz("E[X] = 3,5 untuk dadu. Artinya…",
        ["Lemparan berikutnya 3,5", "Rata-rata dari sangat banyak lemparan → 3,5", "3,5 paling sering muncul", "Setengah lemparan di atas 3,5"],
        1, "Benar: ekspektasi = rata-rata jangka panjang (LLN, B11). 3,5 bahkan tidak pernah muncul sebagai hasil.")
    L.quiz("Linearitas E[X+Y] = E[X]+E[Y] berlaku…",
        ["Hanya jika independen", "Hanya jika identik", "Selalu, bahkan jika berkorelasi", "Tidak pernah"],
        2, "Benar: selalu. Ini sifat terkuat ekspektasi — dan alasan EL portofolio bisa dijumlah.")
    L.quiz("Var(X+Y) = Var(X)+Var(Y) + 2Cov(X,Y). Jika Cov positif besar…",
        ["Varians total lebih kecil", "Varians total lebih besar — diversifikasi gagal", "Tidak ada efek", "Ekspektasi berubah"],
        1, "Benar: korelasi positif menggembungkan varians — matematika di balik &ldquo;semua jatuh bareng saat krisis&rdquo;.")
    L.quiz("X = 0/100 masing-masing 50%. E[X²] vs (E[X])²:",
        ["Sama = 2500", "E[X²]=5000 > 2500 — Jensen", "E[X²]=2500 < 5000", "Tidak terdefinisi"],
        1, "Benar: 5000 > 2500. Fungsi x² cembung → E[f(X)] > f(E[X]). Selisihnya = Var(X).")
    L.quiz("Mengapa model &ldquo;skenario rata-rata&rdquo; meremehkan risiko jika loss cembung?",
        ["Karena rata-rata selalu salah", "Jensen: E[loss] > loss(E[kejadian])", "Karena varians nol", "Tidak meremehkan"],
        1, "Benar: Jensen — ekspektasi dari fungsi cembung lebih besar dari fungsi di titik rata-rata. Harus pakai distribusi penuh/Monte Carlo.")
    L.quiz("Huruf kapital X vs kecil x: yang benar…",
        ["Sama saja", "X = variabel acak, x = nilai teramati", "X = konstanta", "x = ekspektasi"],
        1, "Benar: P(X=x) = peluang variabel acak X bernilai x. Notasi ini mencegah kebingungan di rumus-rumus.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Variabel acak:</strong> angka dari kejadian acak; diskret (pmf) vs kontinu (pdf).</li>"
        "<li><strong>Ekspektasi</strong> = rata-rata tertimbang peluang = rata-rata jangka panjang; linearitas selalu berlaku.</li>"
        "<li><strong>Varians</strong> = E[(X−E[X])²]; varians jumlah memuat kovarians — jangan lupakan.</li>"
        "<li><strong>Jensen:</strong> fungsi cembung → E[f(X)] ≥ f(E[X]) — jangan colok rata-rata ke fungsi melengkung.</li>"
        "<li><strong>Jangan</strong> tafsirkan ekspektasi sebagai prediksi kejadian tunggal.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B6-1
def b6_1():
    L = Lesson("b6-distribusi-diskret-1", "B6 (Part 1) — Probabilitas",
        "Distribusi Diskret (1):<br/>Bernoulli &amp; Binomial",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b5-variabel-acak-ekspektasi", "← B5"), ("b6-distribusi-diskret-2", "Next: B6.2"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>Bernoulli</strong> sebagai &ldquo;atom&rdquo; semua distribusi diskret: satu percobaan ya/tidak.</li>"
        "<li>Menurunkan <strong>Binomial</strong> sebagai jumlah n Bernoulli independen + menghitung peluangnya.</li>"
        "<li>Menghitung ekspektasi &amp; varians Binomial (" + TI(r"np") + ", " + TI(r"np(1-p)") + ") dan menafsirkannya.</li>"
        "<li>Memutuskan kapan Binomial valid — dan kapan asumsinya jebol (overdispersi).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: 1.000 Nasabah, 5% Gagal — Berapa yang Benar-benar Gagal?")
    L.raw('<div className="story"><p>Bank punya 1.000 nasabah baru, masing-masing peluang gagal bayar 5% (independen). <em>&ldquo;Berapa nasabah yang akan gagal tahun ini?&rdquo;</em> tanya direksi.</p>'
        "<p>&ldquo;Ekspektasinya 50,&rdquo; jawab analis. &ldquo;Tapi bisa 40, bisa 65.&rdquo; Direksi mengernyit: <em>&ldquo;Bisa berapa tepatnya? Berapa peluang lebih dari 70 yang gagal?&rdquo;</em></p>"
        "<p>Ekspektasi (B5) tidak menjawab &ldquo;berapa peluangnya&rdquo; — butuh <strong>distribusi</strong>: peta lengkap peluang untuk tiap kemungkinan jumlah. Distribusi Binomial adalah peta itu untuk &ldquo;jumlah sukses dari n percobaan ya/tidak&rdquo; — dan ia ada di mana-mana: gagal bayar, konversi iklan, A/B testing, kontrol kualitas.</p></div>")

    L.sec("bern", "Bernoulli — Atomnya: Satu Percobaan Ya/Tidak")
    L.p("<strong>Definisi.</strong> " + TI(r"X \\sim \\mathrm{Bernoulli}(p)") + ": " + TI(r"X=1") + " (sukses) dengan peluang " + TI(r"p") + ", " + TI(r"X=0") + " (gagal) dengan peluang " + TI(r"1-p") + ".")
    L.p(T(r"P(X=1) = p, \quad P(X=0) = 1-p"))
    L.ul([
        TI(r"E[X] = p") + " — ekspektasi = peluangnya sendiri!",
        TI(r"\\mathrm{Var}(X) = p(1-p)") + " — maksimal di p=0,5 (ketidakpastian terbesar), nol di p=0/1.",
    ])
    L.p("<strong>Kepribadian:</strong> Bernoulli adalah &ldquo;bata LEGO&rdquo; peluang — satu bata sederhana, tapi disusun jadi Binomial, Geometrik, Negatif Binomial, bahkan fondasi regresi logistik (A3.4).")
    L.p("<strong>Contoh:</strong> satu nasabah: gagal (1) p=5% / lancar (0) p=95%. " + TI(r"E[X]=0{,}05") + " = PD-nya. (Ya — <strong>PD tidak lain adalah parameter Bernoulli!</strong>)")
    L.raw(tip("Setiap kali melihat &ldquo;ya/tidak&rdquo;, &ldquo;sukses/gagal&rdquo;, &ldquo;default/lancar&rdquo;, &ldquo;klik/tidak&rdquo; — pasang kacamata Bernoulli dulu. Pertanyaan berikutnya selalu: <em>berapa n-nya?</em> (→ Binomial) atau <em>kapan berhentinya?</em> (→ Geometrik, B6.2)."))

    L.sec("binom", "Binomial — Jumlah dari n Bernoulli")
    L.p("<strong>Definisi.</strong> " + TI(r"X \\sim \\mathrm{Binomial}(n,p)") + ": jumlah sukses dari " + TI(r"n") + " percobaan Bernoulli <strong>independen</strong> dengan peluang sukses " + TI(r"p") + " yang sama.")
    L.p(T(r"P(X=k) = \binom{n}{k}\, p^k\, (1-p)^{\,n-k}"))
    L.ul([
        TI(r"\\binom{n}{k}") + ": banyak cara memilih <em>posisi</em> k sukses dari n (kombinasi — B2!)",
        TI(r"p^k(1-p)^{n-k}") + ": peluang satu pola spesifik (k sukses lalu n−k gagal)",
    ])
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>5 nasabah, PD 5% independen. Peluang tepat 2 gagal?</p>"
        "<p><strong>Langkah 1</strong> — " + TI(r"n=5,\\ k=2,\\ p=0{,}05") + ".</p>"
        "<p><strong>Langkah 2</strong> — " + TI(r"\\binom{5}{2} = 10") + " pola.</p>"
        "<p><strong>Langkah 3</strong> — " + T(r"P(X=2) = 10 \\times 0{,}05^2 \\times 0{,}95^3 \\approx 0{,}0214", block=False) + " ≈ <strong>2,1%</strong>.</p>"))
    L.p("<strong>Ekspektasi &amp; varians</strong> (dari linearitas B5 — tiap Bernoulli independen):")
    L.p(T(r"E[X] = np, \qquad \mathrm{Var}(X) = np(1-p)"))
    L.p("Contoh: 1.000 nasabah, p=5% → E=50, SD = √(1000×0,05×0,95) ≈ <strong>6,9</strong>. Jadi &ldquo;50 ± 14&rdquo; (±2 SD) adalah rentang wajar — 70 gagal (2,9 SD di atas mean) adalah sinyal, bukan noise!")
    L.raw(myth("Binomial berlaku untuk semua &ldquo;jumlah kejadian&rdquo;.",
        "Hanya jika: (1) n tetap, (2) tiap percobaan ya/tidak, (3) p sama, (4) independen. Jebol satu saja → bukan Binomial. Contoh jebol: default saat krisis (tidak independen — butuh Vasicek/B13), jumlah klaim per bulan (n tidak tetap — butuh Poisson/B6.2), sampling tanpa pengembalian dari populasi kecil (butuh Hipergeometrik)."))
    L.raw(myth("Varians Binomial = np.",
        "Itu Poisson! Binomial: np(1−p). Untuk p kecil keduanya mirip (inilah aproksimasi Poisson — B6.2), tapi untuk p=0,5 bedanya 2x lipat. Salah rumus = salah interval kepercayaan."))
    L.raw(tip("Aproksimasi cepat: jika " + TI(r"np \\geq 10") + " dan " + TI(r"n(1-p) \\geq 10") + ", Binomial ≈ Normal(" + TI(r"np,\\ np(1-p)") + ") — jembatan ke B7.1 dan ke interval kepercayaan Wald (A2.3)."))

    L.chart(
        data=[{"x": list(range(0, 11)), "y": [round(__import__("math").comb(10,k)*0.2**k*0.8**(10-k),4) for k in range(11)],
               "type": "bar", "marker": {"color": "#2a7de1"}, "text": [str(k) for k in range(11)], "textposition": "outside"}],
        title="Binomial(10, 0.2): Peta Peluang Jumlah Sukses",
        layout={"xaxis": {"title": "k = jumlah sukses"}, "yaxis": {"title": "P(X=k)"}, "showlegend": False},
        cara="Sumbu X = kemungkinan jumlah sukses (0–10), tinggi batang = peluangnya. Total semua batang = 1.",
        interpretasi="Puncak di k=2 (= np = ekspektasi). Bentuknya miring kanan karena p kecil. <strong>Cara membaca distribusi:</strong> cari puncak (moda ≈ ekspektasi), lihat sebaran (SD), dan baca peluang ekor langsung dari tinggi batang — misal P(X≥5) = jumlah batang 5–10.")

    L.chart(
        data=[{"x": ["p=0.1", "p=0.3", "p=0.5", "p=0.7", "p=0.9"],
               "y": [0.09, 0.21, 0.25, 0.21, 0.09], "type": "bar",
               "marker": {"color": ["#94a3b8","#2a7de1","#e8a838","#2a7de1","#94a3b8"]},
               "text": ["0,09","0,21","0,25","0,21","0,09"], "textposition": "outside"}],
        title="Var(Bernoulli) = p(1−p): Maksimal di Tengah",
        layout={"xaxis": {"title": "p"}, "yaxis": {"title": "Varians"}, "showlegend": False},
        cara="Sumbu X = peluang sukses, tinggi batang = varians satu percobaan.",
        interpretasi="Ketidakpastian maksimal saat p=0,5 (koin adil — paling tidak bisa ditebak) dan nol di ujung (pasti). <strong>Implikasi bisnis:</strong> segmen dengan PD ~50% adalah yang paling &ldquo;liar&rdquo; — butuh sampel terbesar untuk diestimasi presisi (ini materi power/sample size, A2.10).")

    L.sec("lab1", "🔬 Lab 1: Bentuk Binomial Berubah dengan p")
    L.lab("Lab 1 — Peta Binomial Interaktif",
        "Fungsi pmf Binomial dihitung manual (rumus B2+B5). Ubah n dan p, amati bentuknya.",
        'import math\n\ndef binom_pmf(n, p, k):\n    return math.comb(n, k) * (p**k) * ((1-p)**(n-k))\n\ndef cetak(n, p):\n    print(f"Binomial(n={n}, p={p}): E={n*p:.1f}, SD={(n*p*(1-p))**0.5:.1f}")\n    maks = max(binom_pmf(n, p, k) for k in range(n+1))\n    for k in range(n+1):\n        pk = binom_pmf(n, p, k)\n        bar = "#" * int(40 * pk / maks)\n        print(f"k={k:>2}  {pk:.4f} {bar}")\n    print()\n\ncetak(10, 0.2)\n# Coba: cetak(10, 0.5) -> simetris!\n# Coba: cetak(10, 0.8) -> miring kiri (cerminan p=0.2)\n# Coba: cetak(100, 0.05) -> mirip Poisson? (bandingkan di B6.2)',
        "Bandingkan cetak(100, 0.05) dengan Poisson(5) di B6.2 — inilah <strong>aproksimasi Poisson</strong>.")

    L.sec("lab2", "🔬 Lab 2: &ldquo;70 Gagal&rdquo; — Sinyal atau Noise?")
    L.lab("Lab 2 — Ekor Binomial untuk Deteksi Anomali",
        "1.000 nasabah, PD 5%. Tahun ini 70 gagal. Hitung P(X ≥ 70) — jika sangat kecil, ada yang berubah (bukan noise).",
        'import math\n\ndef binom_sf(n, p, k):\n    """P(X >= k) = 1 - P(X <= k-1)""" \n    return 1 - sum(math.comb(n, j)*(p**j)*((1-p)**(n-j)) for j in range(k))\n\nn, p = 1000, 0.05\nprint(f"E[X]={n*p}, SD={(n*p*(1-p))**0.5:.1f}")\nfor k in [55, 60, 65, 70, 80]:\n    print(f"P(X >= {k}) = {binom_sf(n, p, k):.4%}")\nprint()\nprint("P(X>=70) sangat kecil -> 70 gagal BUKAN noise: PD naik / korelasi muncul.")\nprint("Coba: n=100, p=0.05, k=10. (sampel kecil -> ekor lebih tebal relatif)")',
        "Inilah logika <strong>backtesting</strong> (MR6): bandingkan realisasi vs distribusi yang diprediksi model.")

    L.sec("peta", "🗺️ Peta Keputusan: Distribusi Diskret Mana?")
    L.decision("1", "Satu percobaan ya/tidak → <strong>Bernoulli(p)</strong>",
        "Hasil biner tunggal: satu nasabah, satu klik, satu tes.",
        kenapa="Atomnya — E=p, Var=p(1−p). Semua yang lain dibangun dari ini.",
        contoh="PD per nasabah = parameter Bernoulli.")
    L.decision("2", "Jumlah sukses dari n tetap, p sama, independen → <strong>Binomial(n,p)</strong>",
        "n percobaan berulang identik: 1.000 nasabah, 100 klik iklan.",
        kenapa="Jumlah n Bernoulli independen. E=np, Var=np(1−p).",
        contoh="Distribusi jumlah gagal bayar portofolio (asumsi independen).")
    L.decision("3", "n tidak tetap / p sangat kecil → <strong>tunggu B6.2 (Poisson)</strong>",
        "Menghitung kejadian per periode/wilayah: klaim per bulan, fraud per hari.",
        kenapa="Binomial dengan n besar & p kecil → Poisson(λ=np). Lebih sederhana.",
        contoh="Jumlah klaim asuransi per bulan.")
    L.decision("4", "&ldquo;Berapa percobaan sampai sukses pertama&rdquo; → <strong>tunggu B6.2 (Geometrik)</strong>",
        "Waktu tunggu, bukan jumlah dalam n tetap.",
        kenapa="Struktur soalnya terbalik: n acak, k=1 tetap.",
        contoh="Berapa nasabah dihubungi sampai 1 setuju.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Hitung dulu: <strong>n tetap?</strong> Ya → Binomial (cek independen + p sama).</li>"
        "<li>E = np selalu; Var = np(1−p) — bukan np.</li>"
        "<li>Realisasi > E + 3 SD → sinyal, bukan noise (gunakan ekor, bukan firasat).</li></ol>"))

    L.sec("case", "📋 Mini-Case: A/B Testing — 55 vs 45 Klik")
    L.raw(callout("<p>Tim marketing: varian A diklik 45 dari 1.000 tayang, varian B 55 dari 1.000. <em>&ldquo;B menang 22%!&rdquo;</em> klaim mereka.</p>"
        "<p><strong>Pertanyaan:</strong> (a) Jika sebenarnya A dan B sama (p=0,05), berapa SD selisih klik? (b) Apakah selisih 10 signifikan?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) Tiap varian ~ Binomial(1000, 0,05): Var = 47,5, SD ≈ 6,9. Selisih dua independen: Var = 95, SD ≈ <strong>9,7</strong>.</p>"
        "<p>(b) Selisih 10 ≈ <strong>1 SD</strong> — sangat wajar sebagai noise! Klaim &ldquo;menang 22%&rdquo; adalah ilusi persen dari angka kecil. Butuh selisih ~20 (2 SD) untuk mulai curiga, ~30 untuk yakin. <strong>Pelajaran:</strong> tanpa distribusi, &ldquo;55 vs 45&rdquo; terlihat meyakinkan; dengan Binomial, ia cuma noise. Ini fondasi A/B testing (A2.11).</p>")))

    L.quiz("X ~ Bernoulli(0,05). E[X] dan Var(X)?",
        ["0,05 dan 0,05", "0,05 dan 0,0475", "0,5 dan 0,25", "5 dan 4,75"],
        1, "Benar: E=p=0,05; Var=p(1−p)=0,0475. Bukan 0,05 (itu Poisson).")
    L.quiz("Binomial(5; 0,05): P(X=2) memakai suku C(5,2) karena…",
        ["Ada 10 urutan gagal", "Ada 10 posisi untuk 2 sukses", "Ada 10 nasabah", "Rumusnya begitu"],
        1, "Benar: C(5,2)=10 cara menempatkan 2 sukses di 5 posisi — tiap pola berpeluang p²(1−p)³.")
    L.quiz("Kapan Binomial TIDAK valid?",
        ["n=1000, p=0,05 independen", "Default saat krisis (berkorelasi)", "100 lemparan koin adil", "1000 klik iklan independen"],
        1, "Benar: krisis merusak independensi — butuh model korelasi (Vasicek, B13).")
    L.quiz("Binomial(1000; 0,05): 70 gagal. Kesimpulan tepat?",
        ["Normal, dekat ekspektasi 50", "Sinyal: ~2,9 SD di atas mean, P(X≥70) kecil", "Pasti PD naik", "Hitungan salah"],
        1, "Benar: 2,9 SD = ekor tipis → sinyal kuat ada perubahan. Tapi &ldquo;pasti&rdquo; terlalu kuat — bisa juga korelasi, bukan PD.")
    L.quiz("Binomial(10; 0,5) bentuknya simetris karena…",
        ["n besar", "p=0,5 membuat p^k(1−p)^(n−k) simetris terhadap k↔n−k", "Selalu simetris", "Kebetulan"],
        1, "Benar: p=0,5 → tiap pola dan cerminannya berpeluang sama. Untuk p≠0,5, miring.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Bernoulli(p):</strong> satu ya/tidak; E=p, Var=p(1−p) — atom semua distribusi diskret.</li>"
        "<li><strong>Binomial(n,p):</strong> jumlah n Bernoulli independen; " + TI(r"P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}") + "; E=np, Var=np(1−p).</li>"
        "<li><strong>Syarat:</strong> n tetap, p sama, independen — jebol → bukan Binomial.</li>"
        "<li><strong>Ekor untuk sinyal:</strong> realisasi > E+3SD = anomali, bukan noise.</li>"
        "<li><strong>Jangan</strong> samakan Var Binomial (np(1−p)) dengan Poisson (λ).</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B6-2
def b6_2():
    L = Lesson("b6-distribusi-diskret-2", "B6 (Part 2) — Probabilitas",
        "Distribusi Diskret (2):<br/>Poisson, Geometrik &amp; Negatif Binomial",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b6-distribusi-diskret-1", "← B6.1"), ("b7-distribusi-kontinu-1", "Next: B7.1"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>Poisson</strong> sebagai &ldquo;Binomial untuk n besar, p kecil&rdquo; + menghitungnya.</li>"
        "<li>Membedakan <strong>Geometrik</strong> (&ldquo;sampai sukses pertama&rdquo;) vs <strong>Negatif Binomial</strong> (&ldquo;sampai sukses ke-r&rdquo;).</li>"
        "<li>Memakai sifat <strong>memoryless</strong> Geometrik dengan benar.</li>"
        "<li>Memilih distribusi yang tepat untuk soal &ldquo;jumlah per periode&rdquo; vs &ldquo;waktu tunggu&rdquo;.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Berapa Klaim Bulan Depan?")
    L.raw('<div className="story"><p>Aktuaris asuransi ditanya: <em>&ldquo;Berapa klaim mobil bulan depan?&rdquo;</em> Ia tidak bisa pakai Binomial — <strong>n-nya tidak jelas</strong> (berapa &ldquo;percobaan&rdquo; dalam sebulan?). Yang ia tahu: rata-rata <strong>4 klaim/bulan</strong>.</p>'
        "<p>Distribusi Poisson menjawab dengan satu parameter: " + TI(r"\\lambda") + " = rata-rata per periode. P(0 klaim) = e^(−4) ≈ 1,8%, P(10 klaim) ≈ 0,5% — peta lengkap tanpa perlu tahu n.</p>"
        "<p>Dan ketika sales bertanya <em>&ldquo;berapa nasabah harus dihubungi sampai dapat 1 yang setuju?&rdquo;</em> — itu bukan soal &ldquo;jumlah dalam n tetap&rdquo;, melainkan <strong>waktu tunggu</strong>: wilayah Geometrik.</p></div>")

    L.sec("poisson", "Poisson — Menghitung Kejadian per Periode")
    L.p("<strong>Definisi.</strong> " + TI(r"X \\sim \\mathrm{Poisson}(\\lambda)") + ": jumlah kejadian dalam periode/wilayah tetap, dengan rata-rata " + TI(r"\\lambda") + ".")
    L.p(T(r"P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}, \quad k = 0,1,2,\ldots"))
    L.ul([
        TI(r"E[X] = \\lambda") + " dan " + TI(r"\\mathrm{Var}(X) = \\lambda") + " — <strong>mean = varians!</strong> (ciri khas Poisson)",
        TI(r"e \\approx 2{,}718") + ": bilangan Euler.",
    ])
    L.p("<strong>Asal-usul:</strong> limit Binomial saat " + TI(r"n \\to \\infty,\\ p \\to 0") + " dengan " + TI(r"np = \\lambda") + " tetap. Intuisi: periode dibagi jadi slot super-kecil, tiap slot peluang kejadian super-kecil.")
    L.p("<strong>Kapan memakai:</strong> klaim/bulan, fraud/hari, kedatangan nasabah/jam, cacat per batch — <em>kejadian per satuan waktu/ruang</em> dengan n implisit.")
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Klaim " + TI(r"\\lambda=4") + "/bulan. P(tepat 6 klaim)?</p>"
        "<p>" + T(r"P(X=6) = \\frac{4^6 \\cdot e^{-4}}{6!} = \\frac{4096 \\times 0{,}0183}{720} \\approx 0{,}104", block=False) + " ≈ <strong>10,4%</strong>.</p>"
        "<p>P(tidak ada klaim) = e^(−4) ≈ 1,8% — bulan tanpa klaim itu langka!</p>"))
    L.raw(myth("Poisson = Binomial dengan n besar, jadi selalu bisa saling ganti.",
        "Hanya jika p kecil juga (np = λ moderat). Jika p=0,4 dan n=1000, Binomial(1000; 0,4) ≠ Poisson(400): varians Binomial = 240, Poisson = 400 — beda jauh! Aproksimasi butuh p kecil (aturan praktis: n ≥ 100, p ≤ 0,05)."))
    L.raw(myth("Mean = varians selalu berlaku.",
        "Hanya untuk Poisson murni! Data klaim nyata sering <strong>overdispersi</strong> (varians > mean) karena heterogenitas — solusinya Negatif Binomial (campuran Poisson-Gamma, lihat bawah) — atau model campuran. Cek rasio varians/mean dulu sebelum pakai Poisson."))
    L.raw(tip("Tes cepat Poisson: hitung mean dan varians sampel. Rasio ≈ 1 → Poisson cocok. Rasio >> 1 → overdispersi → Negatif Binomial. Rasio << 1 → underdispersi (jarang, misal data terkontrol ketat)."))

    L.sec("geo", "Geometrik — Menunggu Sukses Pertama")
    L.p("<strong>Definisi.</strong> " + TI(r"X \\sim \\mathrm{Geometrik}(p)") + ": banyak percobaan <strong>sampai sukses pertama</strong> (termasuk percobaannya).")
    L.p(T(r"P(X=k) = (1-p)^{k-1}\,p, \quad k = 1,2,\ldots"))
    L.ul([
        TI(r"E[X] = 1/p") + " — peluang setuju 10% → ekspektasi hubungi 10 nasabah.",
        TI(r"\\mathrm{Var}(X) = (1-p)/p^2") + ".",
    ])
    L.p("<strong>Sifat memoryless</strong> (ajaib &amp; khas):")
    L.p(T(r"P(X > m+n \mid X > m) = P(X > n)"))
    L.p("&ldquo;Sudah gagal 9x tidak mengubah peluang sukses di percobaan ke-10&rdquo; — koin tidak punya ingatan. <strong>Hanya</strong> berlaku untuk Geometrik (diskret) &amp; Eksponensial (kontinu, B7.1).")
    L.raw(tip("Bedakan: Binomial menjawab &ldquo;berapa sukses dari n tetap&rdquo;; Geometrik menjawab &ldquo;berapa percobaan sampai 1 sukses&rdquo;. Kata kuncinya: <strong>&ldquo;sampai&rdquo;</strong> → Geometrik/NegBin; <strong>&ldquo;dari n&rdquo;</strong> → Binomial."))

    L.sec("negbin", "Negatif Binomial — Sampai Sukses ke-r")
    L.p("<strong>Definisi.</strong> " + TI(r"X \\sim \\mathrm{NB}(r,p)") + ": banyak percobaan sampai sukses <strong>ke-r</strong>.")
    L.p(T(r"P(X=k) = \binom{k-1}{r-1}\, p^r\, (1-p)^{k-r}, \quad E[X] = \frac{r}{p}"))
    L.p("<strong>Dua peran penting:</strong>")
    L.ul([
        "<strong>Waktu tunggu:</strong> &ldquo;berapa nasabah dihubungi sampai 3 setuju&rdquo; (r=3).",
        "<strong>Poisson overdispersi:</strong> NB sebagai campuran Poisson–Gamma — model standar untuk <em>count data</em> dengan varians > mean (klaim asuransi, jumlah pembelian). Ini alasan NB ada di semua software statistik.",
    ])
    L.p("<strong>Kepribadian:</strong> Negatif Binomial adalah &ldquo;Poisson yang jujur tentang heterogenitas&rdquo; — ia mengakui bahwa tiap nasabah punya λ berbeda.")

    L.chart(
        data=[{"x": list(range(0, 13)), "y": [round(4**k*__import__("math").exp(-4)/__import__("math").factorial(k),4) for k in range(13)],
               "type": "bar", "marker": {"color": "#34a853"}, "name": "Poisson(4)"},
              {"x": list(range(0, 13)), "y": [round(__import__("math").comb(1000,k)*0.004**k*0.996**(1000-k),4) for k in range(13)],
               "type": "scatter", "mode": "markers", "marker": {"color": "#e8a838", "size": 8}, "name": "Binomial(1000, 0.004)"}],
        title="Poisson(4) vs Binomial(1000; 0,004): Hampir Identik",
        layout={"xaxis": {"title": "k"}, "yaxis": {"title": "P(X=k)"}, "showlegend": True},
        cara="Batang hijau = Poisson(4); titik kuning = Binomial(1000; 0,004) — np = 4 sama.",
        interpretasi="Hampir tidak bisa dibedakan! Inilah aproksimasi Poisson bekerja: n besar + p kecil. <strong>Implikasi praktis:</strong> untuk kejadian langka (fraud, klaim), pakai Poisson(λ) yang sederhana — tidak perlu tahu n.")

    L.chart(
        data=[{"x": list(range(1, 21)), "y": [round(0.9**(k-1)*0.1,4) for k in range(1,21)],
               "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Geometrik(0.1)"}],
        title="Geometrik(0,1): Peluang Menunggu k Percobaan",
        layout={"xaxis": {"title": "k = percobaan ke-"}, "yaxis": {"title": "P(X=k)"}, "showlegend": False},
        cara="Sumbu X = sukses pertama terjadi di percobaan ke-k; tinggi batang = peluangnya.",
        interpretasi="Selalu menurun eksponensial — hasil <em>paling mungkin</em> adalah sukses langsung (k=1), tapi <strong>ekspektasi = 10</strong> (ekor panjang menarik rata-rata!). Pelajaran: &ldquo;rata-rata 10x percobaan&rdquo; bukan berarti menunggu 10x itu tipikal — mediannya cuma ~7. Distribusi waktu-tunggu selalu miring kanan.")

    L.sec("lab1", "🔬 Lab 1: Klaim Asuransi — Poisson Bekerja")
    L.lab("Lab 1 — Simulasi Klaim Bulanan",
        "λ=4 klaim/bulan. Simulasikan 1.000 bulan, bandingkan frekuensi vs rumus Poisson. Cek juga mean vs varians.",
        'import random, math, statistics\nrandom.seed(44)\nlam = 4\nN = 100000\n\ndef poisson_one(lam):\n    # Knuth: cacah sampai produk uniform < e^-lam\n    L, k, p = math.exp(-lam), 0, 1.0\n    while p > L:\n        k += 1; p *= random.random()\n    return k - 1\n\nxs = [poisson_one(lam) for _ in range(N)]\nprint(f"mean sampel    = {statistics.mean(xs):.3f} (teori {lam})")\nprint(f"varians sampel = {statistics.pvariance(xs):.3f} (teori {lam})")\nprint()\nfor k in [0, 2, 4, 6, 10]:\n    emp = sum(1 for x in xs if x == k) / N\n    teo = lam**k * math.exp(-lam) / math.factorial(k)\n    print(f"k={k:>2}: simulasi {emp:.4f} vs teori {teo:.4f}")\nprint("\\nCoba: lam=0.5 (kejadian sangat langka). P(0) berapa?")',
        "Perhatikan mean ≈ varians — sidik jari Poisson. Data dengan varians >> mean butuh Negatif Binomial.")

    L.sec("lab2", "🔬 Lab 2: Memoryless — Koin Tak Punya Ingatan")
    L.lab("Lab 2 — Buktikan Sifat Memoryless",
        "Geometrik(p=0,1): bandingkan P(X>15 | X>10) vs P(X>5). Harusnya sama!",
        'import random\nrandom.seed(17)\np, N = 0.1, 200000\nxs = []\nfor _ in range(N):\n    k = 1\n    while random.random() >= p:\n        k += 1\n    xs.append(k)\n\ndef P_gt(t):\n    return sum(1 for x in xs if x > t) / N\n\nprint(f"P(X>5)          = {P_gt(5):.4f}  (teori 0.9^5 = {0.9**5:.4f})")\ncond = sum(1 for x in xs if x > 15) / sum(1 for x in xs if x > 10)\nprint(f"P(X>15 | X>10)  = {cond:.4f}")\nprint("SAMA! Sudah gagal 10x tidak mengubah peluang 5 percobaan berikutnya.")\nprint("Coba: p=0.5. Apakah tetap berlaku? (harusnya ya - sifat umum)")',
        "Memoryless = alasan &ldquo;mesin slot yang sudah lama tidak jackpot&rdquo; tetap peluang sama. Jangan tertipu sunk cost.")

    L.sec("peta", "🗺️ Peta Keputusan: Empat Distribusi Diskret")
    L.decision("1", "&ldquo;Berapa sukses dari n tetap&rdquo; → <strong>Binomial</strong>",
        "n diketahui, p sama, independen.", kenapa="Jumlah n Bernoulli.",
        contoh="Gagal bayar dari 1.000 nasabah.")
    L.decision("2", "&ldquo;Berapa kejadian per periode&rdquo; → <strong>Poisson</strong>",
        "n implisit/tak jelas; hanya tahu rata-rata λ.",
        kenapa="Limit Binomial (n besar, p kecil). Cek mean ≈ varians.",
        contoh="Klaim/bulan, fraud/hari, telepon masuk/jam.")
    L.decision("3", "&ldquo;Berapa percobaan sampai 1 sukses&rdquo; → <strong>Geometrik</strong>",
        "Waktu tunggu sukses pertama.",
        kenapa="Memoryless — masa lalu tak relevan.",
        contoh="Nasabah dihubungi sampai 1 setuju.")
    L.decision("4", "&ldquo;Sampai r sukses&rdquo; / count overdispersi → <strong>Negatif Binomial</strong>",
        "Butuh r sukses, atau varians count > mean.",
        kenapa="Generalisasi Geometrik; campuran Poisson-Gamma untuk heterogenitas.",
        contoh="Sampai 3 nasabah setuju; jumlah klaim antar nasabah heterogen.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Dengar <strong>&ldquo;dari n&rdquo;</strong> → Binomial. <strong>&ldquo;per periode&rdquo;</strong> → Poisson. <strong>&ldquo;sampai&rdquo;</strong> → Geometrik/NB.</li>"
        "<li>Poisson: cek mean ≈ varians. Jauh beda → Negatif Binomial.</li>"
        "<li>Waktu tunggu selalu miring kanan — jangan pakai mean sebagai &ldquo;tipikal&rdquo;.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Kapasitas Tim Investigasi Fraud")
    L.raw(callout("<p>Tim fraud menerima rata-rata λ = 6 alert/hari (Poisson). Tiap investigator menangani 1 alert/jam. Saat ini 8 investigator/shift.</p>"
        "<p><strong>Pertanyaan:</strong> (a) P(alert > 8 dalam 1 jam)? (b) Berapa investigator agar P(kewalahan) < 5%?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) P(X > 8) = 1 − P(X ≤ 8) ≈ 1 − 0,847 = <strong>15,3%</strong> — cukup sering kewalahan!</p>"
        "<p>(b) Cari k terkecil dengan P(X > k) < 5%: k=10 → P ≈ 4,2%. Jadi <strong>11 investigator</strong> (10 + buffer). <strong>Pelajaran:</strong> kapasitas berbasis <em>rata-rata</em> (6) gagal 15% waktu; kapasitas berbasis <em>distribusi</em> (11) gagal <5%. Inilah &ldquo;staffing by distribution, not by mean&rdquo; — dipakai di call center (Erlang), RS, dan tim fraud.</p>")))

    L.quiz("Poisson(λ=4): yang benar…",
        ["E=4, Var=16", "E=4, Var=4", "E=2, Var=4", "E=16, Var=4"],
        1, "Benar: ciri Poisson — mean = varians = λ.")
    L.quiz("Data klaim: mean=4, varians=11. Kesimpulan?",
        ["Poisson cocok", "Overdispersi — pertimbangkan Negatif Binomial", "Data salah", "Pakai Binomial"],
        1, "Benar: varians >> mean = overdispersi (heterogenitas). Poisson murni akan meremehkan ekor.")
    L.quiz("Geometrik(0,1): sudah gagal 9x. Peluang sukses di percobaan ke-10?",
        ["Lebih dari 10%", "Tetap 10% (memoryless)", "Kurang dari 10%", "100%"],
        1, "Benar: memoryless — koin tak punya ingatan. Sunk cost fallacy adalah mengira peluang naik.")
    L.quiz("&ldquo;Berapa nasabah dihubungi sampai 3 setuju&rdquo; (p=20%) → distribusi?",
        ["Binomial", "Poisson", "Negatif Binomial (r=3)", "Normal"],
        2, "Benar: &ldquo;sampai r sukses&rdquo; = Negatif Binomial. E = r/p = 15 nasabah.")
    L.quiz("Aproksimasi Poisson untuk Binomial butuh…",
        ["n besar saja", "p kecil saja", "n besar DAN p kecil (np moderat)", "n = p"],
        2, "Benar: keduanya. n=1000, p=0,4 → varians beda jauh (240 vs 400) — aproksimasi gagal.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Poisson(λ):</strong> kejadian per periode; " + TI(r"P(X=k)=\\lambda^k e^{-\\lambda}/k!") + "; mean = varians = λ.</li>"
        "<li><strong>Geometrik(p):</strong> tunggu sukses pertama; E=1/p; <strong>memoryless</strong>.</li>"
        "<li><strong>Negatif Binomial:</strong> tunggu sukses ke-r; juga untuk count overdispersi.</li>"
        "<li><strong>&ldquo;Dari n&rdquo; → Binomial; &ldquo;per periode&rdquo; → Poisson; &ldquo;sampai&rdquo; → Geometrik/NB.</strong></li>"
        "<li><strong>Jangan</strong> pakai rata-rata untuk kapasitas — pakai distribusi (staffing by distribution).</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B7-1
def b7_1():
    L = Lesson("b7-distribusi-kontinu-1", "B7 (Part 1) — Probabilitas",
        "Distribusi Kontinu (1):<br/>Normal, Lognormal &amp; Eksponensial",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("b6-distribusi-diskret-2", "← B6.2"), ("b7-distribusi-kontinu-2", "Next: B7.2"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>pdf vs pmf</strong>: mengapa P(X = tepat 5,0) = 0 untuk kontinu.</li>"
        "<li>Menggunakan <strong>distribusi Normal</strong> + aturan 68-95-99,7 dan z-score.</li>"
        "<li>Membedakan <strong>Normal vs Lognormal</strong> — kapan log yang normal.</li>"
        "<li>Menerapkan <strong>Eksponensial</strong> untuk waktu tunggu kontinu + sifat memoryless.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;Peluang Tepat Rp5.000.000&rdquo; = Nol?")
    L.raw('<div className="story"><p>Analis bertanya: <em>&ldquo;Berapa peluang saldo nasabah <strong>tepat</strong> Rp5.000.000,00?&rdquo;</em> Jawaban yang benar: <strong>nol</strong>. Bukan karena mustahil — melainkan karena saldo itu kontinu: ada tak berhingga nilai di sekitar 5 juta (5.000.000,01; 5.000.000,001; …), masing-masing berpeluang nol, tapi peluang <em>rentang</em> 4,9–5,1 juta bisa 10%.</p>'
        "<p>Ini lompatan konseptual terbesar B-track: dari <strong>batang peluang</strong> (diskret) ke <strong>luas di bawah kurva</strong> (kontinu). Setelah paham ini, Normal, Lognormal, dan Eksponensial jadi mudah.</p></div>")

    L.sec("jembatan", "Jembatan: Dari Batang ke Kurva (pdf &amp; cdf)")
    L.p("<strong>pmf</strong> (diskret): " + TI(r"p(x) = P(X=x)") + " — tinggi batang = peluang. <strong>pdf</strong> (kontinu): " + TI(r"f(x)") + " — <em>tinggi kurva BUKAN peluang</em>; peluang = <strong>luas</strong> di bawah kurva:")
    L.p(T(r"P(a \le X \le b) = \int_a^b f(x)\,dx, \qquad P(X = x_0) = 0"))
    L.p("<strong>cdf</strong> (keduanya): " + T(r"F(x) = P(X \\le x)", block=False) + " — &ldquo;peluang kumulatif sampai x&rdquo;. Untuk kontinu: " + TI(r"F'(x) = f(x)") + ".")
    L.p("<strong>Contoh.</strong> Waktu tunggu " + TI(r"X") + " dengan " + TI(r"P(X \\le 5 \\text{ mnt}) = 0{,}6") + ": cdf di 5 = 0,6. Peluang 3–5 menit = F(5) − F(3) = luas di bawah pdf antara 3 dan 5.")
    L.raw(tip("Selalu tanya: &ldquo;yang ditanya <strong>titik</strong> atau <strong>rentang</strong>?&rdquo; Titik pada kontinu → 0 (tak bermakna). Rentang → luas/cdf. Jebakan klasik: &ldquo;peluang return tepat 0%&rdquo; = 0, tapi &ldquo;return antara −1% dan 1%&rdquo; bisa 30%."))

    L.sec("normal", "Normal — Ratu Distribusi")
    L.p(T(r"f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x-\mu)^2}{2\sigma^2}}"))
    L.ul([
        TI(r"\\mu") + ": pusat (mean = median = modus — simetris!)",
        TI(r"\\sigma") + ": lebar (SD). Total luas = 1.",
    ])
    L.p("<strong>Mengapa merajalela?</strong> (1) Banyak fenomena ≈ normal (tinggi, error pengukuran). (2) <strong>CLT</strong> (B11): rata-rata sampel → normal apapun distribusi aslinya. (3) Matematikanya enak.")
    L.p("<strong>Aturan 68–95–99,7:</strong> ±1σ → 68%, ±2σ → 95%, ±3σ → 99,7% data.")
    L.p("<strong>z-score</strong> — standarisasi ke Normal(0,1):")
    L.p(T(r"Z = \frac{X - \mu}{\sigma}"))
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Nilai ujian " + TI(r"\\mu=70,\\ \\sigma=10") + ". Peluang nilai &gt; 85?</p>"
        "<p><strong>Langkah 1</strong> — z = (85−70)/10 = <strong>1,5</strong>.</p>"
        "<p><strong>Langkah 2</strong> — P(Z &gt; 1,5) = 1 − Φ(1,5) ≈ 1 − 0,9332 = <strong>6,7%</strong> (Φ = cdf Normal standar).</p>"
        "<p>z-score mengubah <em>soal apapun</em> menjadi soal Normal(0,1) — satu tabel untuk semua!</p>"))
    L.raw(myth("Data harus normal agar boleh pakai mean/SD.",
        "Tidak! Mean/SD terdefinisi untuk distribusi apapun. Yang butuh normalitas: <em>uji/interval tertentu</em> (dan itupun sering diselamatkan CLT untuk n besar). &ldquo;Data tidak normal → tidak boleh pakai mean&rdquo; adalah miskonsepsi mahal."))
    L.raw(tip("Hafalkan tiga angka: <strong>68–95–99,7</strong> dan z untuk 95% dua sisi (<strong>1,96</strong>) dan 95% satu sisi (<strong>1,645</strong>). Empat angka ini menyelesaikan separuh soal Normal tanpa kalkulator."))

    L.sec("lognormal", "Lognormal — Ketika yang Normal adalah Log-nya")
    L.p("<strong>Definisi.</strong> " + TI(r"X") + " lognormal jika " + TI(r"\\ln X \\sim \\mathrm{Normal}(\\mu, \\sigma^2)") + ". Syarat: " + TI(r"X > 0") + ".")
    L.p(T(r"E[X] = e^{\mu + \sigma^2/2}, \qquad \mathrm{Median}(X) = e^{\mu}"))
    L.p("<strong>Kapan memakai:</strong> harga aset, pendapatan, klaim asuransi — <strong>positif &amp; miring kanan</strong>. Harga saham tidak bisa negatif dan bisa naik 10x — Normal (yang simetris &amp; bisa negatif) salah model; Lognormal benar.")
    L.p("<strong>Kepribadian:</strong> Lognormal adalah &ldquo;Normal yang dipaksa positif&rdquo; — hasil dari banyak <em>perkalian</em> acak kecil (return berlipat), sedangkan Normal adalah hasil banyak <em>penjumlahan</em> acak kecil (CLT!). Perkalian vs penjumlahan = Lognormal vs Normal.")
    L.raw(myth("Lognormal = Normal yang di-log-kan, jadi sama saja.",
        "Beda fundamental: Normal simetris (mean=median), Lognormal miring kanan (mean > median!). Untuk " + TI(r"\\sigma=1") + ": mean = e^(μ+0,5), median = e^μ — mean 65% lebih besar dari median. Pakai Normal untuk harga → model mengizinkan harga negatif (absurd) dan meremehkan ekor kanan."))

    L.sec("eksponen", "Eksponensial — Waktu Tunggu Kontinu")
    L.p("<strong>Definisi.</strong> " + TI(r"X \\sim \\mathrm{Eksponensial}(\\lambda)") + ": waktu tunggu sampai kejadian berikutnya jika kejadian datang dengan laju " + TI(r"\\lambda") + " per satuan waktu (pasangan kontinu dari Poisson!).")
    L.p(T(r"f(x) = \lambda e^{-\lambda x}, \quad x \ge 0, \qquad E[X] = \frac{1}{\lambda}"))
    L.p("<strong>Hubungan Poisson–Eksponensial:</strong> jika jumlah kejadian per jam ~ Poisson(λ), maka <em>waktu antar kejadian</em> ~ Eksponensial(λ). Dua sisi koin yang sama!")
    L.p("<strong>Memoryless</strong> (versi kontinu dari Geometrik B6.2):")
    L.p(T(r"P(X > s+t \mid X > s) = P(X > t)"))
    L.p("&ldquo;Sudah menunggu 10 menit tidak mengubah peluang menunggu 5 menit lagi.&rdquo; <strong>Catatan jujur:</strong> di dunia nyata waktu tunggu jarang benar-benar memoryless (mesin menua, nasabah lelah menunggu) — Eksponensial adalah model <em>baseline</em>, bukan kebenaran.")
    L.raw(tip("Pasangan yang wajib dihafal: <strong>Poisson(λ) ↔ Eksponensial(λ)</strong>. &ldquo;Berapa kejadian per jam&rdquo; ↔ &ldquo;berapa lama antar kejadian&rdquo;. Soal yang satu bisa dijawab lewat yang lain."))

    L.chart(
        data=[{"x": [round(40+i*0.5,1) for i in range(121)],
               "y": [round(__import__("math").exp(-0.5*((40+i*0.5-70)/10)**2)/(10*__import__("math").sqrt(2*__import__("math").pi)),4) for i in range(121)],
               "type": "scatter", "mode": "lines", "name": "Normal(70, 10²)",
               "line": {"color": "#2a7de1"}, "fill": "tozeroy"},
              {"x": [85, 85], "y": [0, 0.04], "type": "scatter", "mode": "lines",
               "name": "x=85 (z=1,5)", "line": {"color": "#e8a838", "dash": "dash"}}],
        title="Normal(70, 10²): Peluang = Luas di Bawah Kurva",
        layout={"xaxis": {"title": "Nilai ujian"}, "yaxis": {"title": "pdf f(x)"}, "showlegend": True},
        cara="Kurva biru = pdf; luas total di bawahnya = 1. Garis putus-putus di 85; luas kanan garis = P(X>85).",
        interpretasi="Peluang adalah <strong>luas</strong>, bukan tinggi kurva. Luas kanan 85 ≈ 6,7% (z=1,5). Visual ini menjelaskan mengapa P(X=tepat 85) = 0: garis tunggal tidak punya luas!")

    L.chart(
        data=[{"x": [round(0.1+i*0.15,2) for i in range(60)],
               "y": [round((1/(x*0.8*math.sqrt(2*math.pi)))*math.exp(-(math.log(x)-2)**2/(2*0.64)),4) for x in [0.1+j*0.15 for j in range(60)]],
               "type": "scatter", "mode": "lines", "name": "Lognormal(μ=2, σ=0,8)",
               "line": {"color": "#e8a838"}}],
        title="Lognormal: Miring Kanan, Selalu Positif",
        layout={"xaxis": {"title": "x"}, "yaxis": {"title": "pdf"}, "showlegend": False},
        cara="Kurva mulai dari 0 (tidak pernah negatif), puncak di kiri, ekor panjang ke kanan.",
        interpretasi="Bentuk khas data harga/pendapatan: banyak nilai kecil-menengah, sedikit sangat besar. <strong>Mean > median</strong> di sini — memakai Normal (simetris) untuk data seperti ini meremehkan ekor kanan (= meremehkan risiko kerugian besar pada data loss!).")

    L.sec("lab1", "🔬 Lab 1: Aturan 68-95-99,7 via Simulasi")
    L.lab("Lab 1 — Buktikan Aturan Empiris",
        "Simulasi 200.000 sampel Normal(70, 10²). Hitung proporsi dalam ±1/2/3 SD — cocokkan dengan 68/95/99,7%.",
        'import random, statistics\nrandom.seed(60)\nmu, sigma, N = 70, 10, 200000\nxs = [random.gauss(mu, sigma) for _ in range(N)]\nprint(f"mean={statistics.mean(xs):.2f}, SD={statistics.pstdev(xs):.2f}")\nfor k in [1, 2, 3]:\n    p = sum(1 for x in xs if abs(x-mu) <= k*sigma) / N\n    print(f"dalam ±{k} SD: {p:.2%}")\nprint("Teori: 68.27% / 95.45% / 99.73%")\nprint()\nprint("Coba: ganti jadi data seragam (random.uniform(40,100)).")\nprint("Apakah 68-95-99.7 masih berlaku? (Tidak! itu KHAS Normal)")',
        "Aturan ini KHAS Normal — jangan tempel ke distribusi lain. Cek dengan uniform untuk buktinya.")

    L.sec("lab2", "🔬 Lab 2: Poisson vs Eksponensial — Dua Sisi Koin")
    L.lab("Lab 2 — Waktu Antar Kedatangan",
        "Nasabah datang λ=2/jam (Poisson). Simulasikan waktu antar kedatangan — harusnya Eksponensial dengan mean 0,5 jam.",
        'import random, math, statistics\nrandom.seed(61)\nlam = 2  # per jam\nN = 100000\n# waktu antar kejadian ~ Eksponensial(lam): -ln(U)/lam\nwaits = [-math.log(random.random())/lam for _ in range(N)]\nprint(f"mean waktu tunggu = {statistics.mean(waits):.3f} jam (teori 1/λ = 0.5)")\nprint(f"P(tunggu > 1 jam) = {sum(1 for w in waits if w > 1)/N:.3f} (teori e^-2 = 0.135)")\nprint(f"P(tunggu > 2 jam) = {sum(1 for w in waits if w > 2)/N:.4f} (teori e^-4 = 0.0183)")\nprint("\\nCoba: lam=0.5. Bagaimana mean waktu tunggu berubah?")\nprint("Coba: memoryless - P(tunggu>1.5 | tunggu>1) vs P(tunggu>0.5)")',
        "Hubungan Poisson↔Eksponensial adalah salah satu yang paling sering keluar di interview quant.")

    L.sec("peta", "🗺️ Peta Keputusan: Distribusi Kontinu Mana?")
    L.decision("1", "Data simetris, bisa negatif, banyak penjumlahan → <strong>Normal</strong>",
        "Error pengukuran, tinggi badan, rata-rata sampel (CLT).",
        kenapa="Stabil di bawah penjumlahan; 68-95-99,7; z-score universal.",
        contoh="Interval kepercayaan mean (A2.3).")
    L.decision("2", "Data positif &amp; miring kanan (hasil perkalian) → <strong>Lognormal</strong>",
        "Harga aset, pendapatan, klaim.",
        kenapa="ln(X) normal; mean > median; tidak pernah negatif.",
        contoh="Model harga saham (fondasi GBM, B15).")
    L.decision("3", "&ldquo;Berapa lama sampai kejadian berikutnya&rdquo; → <strong>Eksponensial</strong>",
        "Waktu antar kedatangan dengan laju konstan λ.",
        kenapa="Pasangan Poisson; memoryless; E=1/λ.",
        contoh="Waktu antar nasabah datang; lifetime komponen (baseline).")
    L.decision("4", "Butuh ekor tebal / data proporsi / lainnya → <strong>tunggu B7.2</strong>",
        "Return saham berekor tebal, data proporsi 0–1, rasio varians.",
        kenapa="Normal meremehkan ekstrem — butuh t, Pareto, Beta, Gamma, χ².",
        contoh="Return harian saham (t), pangsa pasar (Beta).")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Kontinu: peluang = <strong>luas</strong>, bukan tinggi. Titik → 0.</li>"
        "<li>Hafal <strong>68–95–99,7</strong> + z=1,96 / 1,645.</li>"
        "<li>Bisa negatif &amp; simetris → Normal; positif &amp; miring kanan → Lognormal.</li>"
        "<li>&ldquo;Per jam&rdquo; ↔ &ldquo;antar kejadian&rdquo; = Poisson ↔ Eksponensial.</li></ol>"))

    L.sec("case", "📋 Mini-Case: SLA Call Center")
    L.raw(callout("<p>Call center: waktu antar telepon ~ Eksponensial(λ=12/jam). SLA: 90% penelepon menunggu &lt; 5 menit untuk diangkat. Kapasitas saat ini: 1 agen menangani 1 telepon per 4 menit rata-rata.</p>"
        "<p><strong>Pertanyaan:</strong> (a) Berapa peluang jeda antar telepon &gt; 10 menit? (b) Jika 1 agen, berapa % penelepon menunggu &gt; 5 menit (asumsikan waktu layanan juga Eksponensial)? Apakah SLA terpenuhi?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) P(T &gt; 10 mnt) = e^(−λt) = e^(−12×10/60) = e^(−2) ≈ <strong>13,5%</strong>.</p>"
        "<p>(b) Ini antrean M/M/1: laju datang λ=12/jam, laju layanan μ=15/jam (1 per 4 mnt). Utilisasi ρ=0,8. P(menunggu &gt; 5 mnt) = ρ×e^(−(μ−λ)t) = 0,8×e^(−3×5/60) = 0,8×e^(−0,25) ≈ <strong>62%</strong> — jauh di atas 10%! <strong>SLA jebol.</strong> Butuh ~3 agen. <strong>Pelajaran:</strong> &ldquo;rata-rata cukup&rdquo; (12 vs 15/jam) menipu — variabilitas Eksponensial membuat antrean menumpuk. Lagi-lagi: distribusi, bukan mean.</p>")))

    L.quiz("Untuk X kontinu, P(X = 5,0) = 0 karena…",
        ["5,0 mustahil terjadi", "Ada tak berhingga nilai di sekitarnya; peluang hanya bermakna untuk rentang (luas)", "pdf-nya nol", "Rumusnya salah"],
        1, "Benar: peluang kontinu = luas. Titik tak berluas → 0. Yang bermakna: P(4,9 < X < 5,1).")
    L.quiz("Nilai ujian μ=70, σ=10. P(nilai > 85) ≈ …",
        ["50%", "16%", "6,7%", "2,5%"],
        2, "Benar: z=1,5 → ekor kanan ≈ 6,7%. (z=1 → 16%, z=2 → 2,5% — hafalkan!)")
    L.quiz("Harga saham sebaiknya dimodelkan Lognormal, bukan Normal, karena…",
        ["Lognormal lebih mudah", "Harga positif & miring kanan; Normal mengizinkan negatif & simetris", "Regulator meminta", "Selalu sama saja"],
        1, "Benar: harga = hasil perkalian return → lognormal. Normal untuk harga = absurd (harga negatif).")
    L.quiz("Jika kedatangan ~ Poisson(λ=2/jam), waktu antar kedatangan ~ …",
        ["Poisson(2)", "Eksponensial(2), mean 0,5 jam", "Normal", "Binomial"],
        1, "Benar: pasangan Poisson–Eksponensial. &ldquo;Per jam&rdquo; ↔ &ldquo;antar kejadian&rdquo;.")
    L.quiz("Sifat memoryless Eksponensial artinya…",
        ["Tidak punya varians", "P(X>s+t|X>s) = P(X>t) — menunggu lama tak mengubah sisa tunggu", "Selalu simetris", "Mean = 0"],
        1, "Benar: tanpa ingatan. Di dunia nyata jarang persis — ini model baseline.")
    L.quiz("Aturan 68–95–99,7 berlaku untuk…",
        ["Semua distribusi", "Hanya (mendekati) Normal", "Semua yang simetris", "Data besar saja"],
        1, "Benar: khas Normal. Data uniform/exponensial punya aturan sendiri — jangan tempel sembarangan.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Kontinu:</strong> peluang = luas di bawah pdf; P(titik) = 0; cdf = P(X ≤ x).</li>"
        "<li><strong>Normal(μ,σ²):</strong> simetris; 68–95–99,7; z = (X−μ)/σ; raja karena CLT.</li>"
        "<li><strong>Lognormal:</strong> ln(X) normal; positif &amp; miring kanan; untuk harga/pendapatan.</li>"
        "<li><strong>Eksponensial(λ):</strong> waktu antar kejadian; E=1/λ; memoryless; pasangan Poisson.</li>"
        "<li><strong>Jangan</strong> pakai Normal untuk data positif miring kanan — dan <strong>jangan</strong> tanya peluang &ldquo;tepat&rdquo; pada kontinu.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B7-2
def b7_2():
    L = Lesson("b7-distribusi-kontinu-2", "B7 (Part 2) — Probabilitas",
        "Distribusi Kontinu (2):<br/>Gamma, Beta, t, Chi-Square &amp; Pareto",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b7-distribusi-kontinu-1", "← B7.1"), ("b8-fitting-distribusi", "Next: B8"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>Gamma</strong> (waktu tunggu kejadian ke-k) dan <strong>Beta</strong> (distribusi untuk peluang/proporsi).</li>"
        "<li>Menjelaskan <strong>t</strong> dan <strong>χ²</strong> sebagai &ldquo;distribusi sampling&rdquo; — dari mana uji-t dan uji chi-square berasal.</li>"
        "<li>Menjelaskan <strong>Pareto</strong> dan hukum pangkat — mengapa &ldquo;rata-rata&rdquo; bisa tidak ada.</li>"
        "<li>Memilih distribusi kontinu yang tepat untuk tiap jenis data.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Ketika Rata-rata Tidak Ada")
    L.raw('<div className="story"><p>Manajer kekayaan melapor: <em>&ldquo;Rata-rata kekayaan nasabah kami Rp2 miliar.&rdquo;</em> Kamu hitung ulang dengan data lengkap — dan dapat <strong>Rp8 miliar</strong>. Kok beda? Karena satu konglomerat Rp500 miliar masuk sampel. Kamu tambah data lagi — rata-rata jadi Rp5 miliar. Tambah lagi — Rp11 miliar. <strong>Rata-ratanya tidak pernah stabil!</strong></p>'
        "<p>Ini bukan error — ini <strong>distribusi Pareto</strong>: ekor sangat tebal sehingga mean teoritisnya bisa tak berhingga (untuk parameter tertentu). Hukum bilangan besar (B11) <em>gagal</em> di sini. Jika datamu Pareto tapi kamu perlakukan seperti Normal, seluruh analisismu — mean, SD, interval — runtuh.</p>"
        "<p>Part 2 ini tentang distribusi-distribusi &ldquo;kambing hitam&rdquo; yang justru paling penting di risiko.</p></div>")

    L.sec("gamma", "Gamma — Menunggu Kejadian ke-k")
    L.p("<strong>Definisi.</strong> " + TI(r"X \\sim \\mathrm{Gamma}(\\alpha, \\beta)") + ": waktu tunggu sampai kejadian <strong>ke-</strong>" + TI(r"\\alpha") + " jika kejadian datang laju " + TI(r"\\beta") + ".")
    L.p(T(r"f(x) = \frac{\beta^\alpha}{\Gamma(\alpha)}\, x^{\alpha-1} e^{-\beta x}, \quad E[X] = \frac{\alpha}{\beta}"))
    L.ul([
        TI(r"\\alpha=1") + " → persis Eksponensial(β). Gamma = &ldquo;Eksponensial yang digeneralisasi&rdquo;.",
        TI(r"\\alpha") + " bulat = <strong>Erlang</strong>: jumlah " + TI(r"\\alpha") + " Eksponensial independen.",
    ])
    L.p("<strong>Kapan memakai:</strong> total waktu tunggu beberapa kejadian (klaim ke-5), jumlah curah hujan, waktu antar kegagalan mesin. Juga sebagai <strong>prior konjugat</strong> untuk laju Poisson (B17!).")
    L.raw(tip("Ingat rantai: <strong>Eksponensial</strong> (tunggu 1) → <strong>Erlang/Gamma</strong> (tunggu α). Pasangan diskretnya: <strong>Geometrik</strong> (tunggu 1 sukses) → <strong>Negatif Binomial</strong> (tunggu r). Empat distribusi, satu pola &ldquo;waktu tunggu&rdquo;."))

    L.sec("beta", "Beta — Distribusi untuk Peluang")
    L.p("<strong>Definisi.</strong> " + TI(r"X \\sim \\mathrm{Beta}(a, b)") + ": variabel acak di <strong>[0,1]</strong> — cocok untuk <em>peluang yang tidak diketahui</em>, proporsi, rate.")
    L.p(T(r"f(x) = \frac{x^{a-1}(1-x)^{b-1}}{B(a,b)}, \quad E[X] = \frac{a}{a+b}"))
    L.p("<strong>Interpretasi ajaib:</strong> Beta(a,b) bisa dibaca sebagai &ldquo;punya bukti setara a−1 sukses dan b−1 gagal&rdquo;. Beta(1,1) = Uniform(0,1) = &ldquo;tidak tahu apa-apa&rdquo;.")
    L.p("<strong>Kapan memakai:</strong> <strong>prior konjugat untuk peluang Binomial</strong> (B17): mulai Beta(a,b), amati s sukses &amp; f gagal → posterior Beta(a+s, b+f). Sesederhana tambah! Juga: modeling LGD (0–1), conversion rate, pangsa pasar.")
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Keyakinan awal PD ≈ 5%: prior Beta(5, 95) (mean 5/100 = 5%). Amati 200 nasabah: 16 gagal.</p>"
        "<p><strong>Langkah 1</strong> — posterior: Beta(5+16, 95+184) = <strong>Beta(21, 279)</strong>.</p>"
        "<p><strong>Langkah 2</strong> — mean posterior = 21/300 = <strong>7%</strong> (tertarik dari 5% ke data 8%).</p>"
        "<p><strong>Langkah 3</strong> — bandingkan dengan estimasi mentah 16/200 = 8%: prior &ldquo;menahan&rdquo; agar tidak terlalu reaktif — inilah <strong>shrinkage</strong> (B17).</p>"))

    L.sec("t", "Distribusi t — Normal dengan Ketidakpastian Tambahan")
    L.p("<strong>Definisi.</strong> " + TI(r"T = \\frac{Z}{\\sqrt{V/\\nu}}") + " dengan " + TI(r"Z \\sim N(0,1)") + ", " + TI(r"V \\sim \\chi^2_\\nu") + " independen. Parameter: derajat bebas " + TI(r"\\nu") + ".")
    L.p("<strong>Intuisi:</strong> seperti Normal tapi <strong>ekor lebih tebal</strong> — karena SD-nya sendiri diestimasi dari sampel kecil (tidak diketahui pasti). Makin kecil " + TI(r"\\nu") + ", makin tebal ekor; " + TI(r"\\nu \\to \\infty") + " → Normal.")
    L.p("<strong>Kapan memakai:</strong> uji-t &amp; interval kepercayaan mean untuk <strong>sampel kecil</strong> (A2.5). Return keuangan juga sering dimodelkan dengan t (ekor tebal!).")
    L.raw(myth("Uji-t butuh data normal.",
        "Yang butuh (mendekati) normal adalah <em>distribusi sampling mean</em> — bukan data mentah. Untuk n besar, CLT menyelamatkan. Untuk n kecil + data sangat tidak normal, t-test memang goyah — di situlah uji nonparametrik (A2.6) masuk."))

    L.sec("chisq", "Chi-Square — Distribusi untuk Jumlah Kuadrat")
    L.p("<strong>Definisi.</strong> " + TI(r"Q = \\sum_{i=1}^{k} Z_i^2") + " dengan " + TI(r"Z_i \\sim N(0,1)") + " independen → " + TI(r"Q \\sim \\chi^2_k") + ".")
    L.p(T(r"E[Q] = k, \qquad \mathrm{Var}(Q) = 2k"))
    L.p("<strong>Kapan memakai:</strong> uji chi-square independensi/homogenitas (A2.6), interval kepercayaan <strong>varians</strong>, dan — penting! — " + TI(r"\\chi^2") + " adalah fondasi distribusi t dan F. Juga: jumlah kuadrat return ternormalisasi untuk uji volatilitas.")
    L.raw(tip("Trio sampling yang wajib dikenal: <strong>Z</strong> (mean, σ diketahui) → <strong>t</strong> (mean, σ diestimasi) → <strong>χ²</strong> (varians). Tiga distribusi ini = mesin di balik separuh uji hipotesis klasik (A2.4–A2.6)."))

    L.sec("pareto", "Pareto — Hukum Pangkat &amp; Ekor yang Memakan Mean")
    L.p(T(r"P(X > x) = \left(\frac{x_m}{x}\right)^{\alpha}, \quad x \ge x_m"))
    L.ul([
        TI(r"x_m") + ": nilai minimum (skala)",
        TI(r"\\alpha") + ": indeks ekor — <strong>makin kecil α, makin tebal ekor</strong>",
    ])
    L.p("<strong>Fakta mengejutkan:</strong>")
    L.p(T(r"E[X] = \frac{\alpha\, x_m}{\alpha - 1} \quad (\alpha > 1), \qquad \mathrm{Var}(X) = \infty \text{ jika } \alpha \le 2"))
    L.p("Jika " + TI(r"\\alpha \\le 1") + ": <strong>mean pun tak berhingga!</strong> Rata-rata sampel tidak konvergen — inilah cerita pembuka. Kekayaan, ukuran kota, klaim bencana alam: α sering 1–2.")
    L.p("<strong>Aturan 80/20:</strong> Pareto dengan α ≈ 1,16 menghasilkan &ldquo;80% efek dari 20% sebab&rdquo; — bukan hukum alam, hanya satu titik parameter!")
    L.p("<strong>Kapan memakai:</strong> data dengan sedikit raksasa &amp; banyak kecil: klaim asuransi besar, ukuran kerugian operasional, kekayaan. <strong>Peran di risiko:</strong> model ekor untuk EVT (B16).")
    L.raw(myth("Ekor tebal = outlier yang harus dibuang.",
        "Pada Pareto, &ldquo;outlier&rdquo; raksasa BUKAN error — mereka <em>ciri</em> distribusinya dan mendominasi total! Membuang klaim terbesar dari data asuransi = membuang bagian terpenting risiko. Ekor tebal dimodelkan (B16), bukan dihapus."))
    L.raw(tip("Tes cepat ekor tebal: plot log-log P(X > x) vs x. Pareto → garis lurus (kemiringan −α). Normal/eksponensial → melengkung turun curam. Satu plot ini = diagnosis 10 detik."))

    L.chart(
        data=[{"x": [round(-4+i*0.1,1) for i in range(81)],
               "y": [round(__import__("math").exp(-(x)**2/2)/__import__("math").sqrt(2*__import__("math").pi),4) for x in [-4+i*0.1 for i in range(81)]],
               "type": "scatter", "mode": "lines", "name": "Normal(0,1)", "line": {"color": "#94a3b8"}},
              {"x": [round(-4+i*0.1,1) for i in range(81)],
               "y": [round(__import__("math").gamma(2)/(__import__("math").sqrt(3*__import__("math").pi)*__import__("math").gamma(1.5))*(1+x**2/3)**(-2),4) for x in [-4+i*0.1 for i in range(81)]],
               "type": "scatter", "mode": "lines", "name": "t (ν=3)", "line": {"color": "#e8a838"}}],
        title="t(ν=3) vs Normal: Ekor Lebih Tebal",
        layout={"xaxis": {"title": "x", "range": [-4, 4]}, "yaxis": {"title": "pdf"}, "showlegend": True},
        cara="Abu-abu = Normal standar; kuning = distribusi t dengan ν=3. Perhatikan ujung kiri-kanan.",
        interpretasi="t lebih <strong>rendah di tengah, lebih tinggi di ekor</strong> — massa peluang &ldquo;bocor&rdquo; ke ekstrem. Untuk ν kecil (sampel kecil), memakai Normal meremehkan peluang kejadian ekstrem. Makin besar ν, t menyatu ke Normal.")

    L.chart(
        data=[{"x": [round(1+i*0.3,1) for i in range(40)],
               "y": [round((1/(x))**2.0,4) for x in [1+i*0.3 for i in range(40)]],
               "type": "scatter", "mode": "lines", "name": "Pareto: P(X>x)=(1/x)²",
               "line": {"color": "#ef4444"}},
              {"x": [round(1+i*0.3,1) for i in range(40)],
               "y": [round(__import__("math").exp(-(x-1)),4) for x in [1+i*0.3 for i in range(40)]],
               "type": "scatter", "mode": "lines", "name": "Eksponensial (banding)",
               "line": {"color": "#2a7de1", "dash": "dash"}}],
        title="Pareto vs Eksponensial: Ekor Turun Jauh Lebih Lambat",
        layout={"xaxis": {"title": "x (skala log)", "type": "log"}, "yaxis": {"title": "P(X > x) (skala log)", "type": "log"}, "showlegend": True},
        cara="Sumbu log-log: Pareto = garis lurus; Eksponensial = melengkung turun curam.",
        interpretasi="Pada x besar, peluang Pareto <strong>orde magnitude</strong> lebih besar dari Eksponensial. &ldquo;Kejadian 10x lipat&rdquo; pada Pareto masih lumayan mungkin; pada Eksponensial praktis mustahil. <strong>Model risiko yang salah di ekor = bangkrut saat ekor datang</strong> (B16/EVT).")

    L.sec("lab1", "🔬 Lab 1: Beta-Binomial — Update Keyakinan Live")
    L.lab("Lab 1 — Prior → Posterior (Shrinkage)",
        "Prior Beta(5,95) untuk PD. Tambahkan data observasi, lihat posterior menyusut ke data — tapi tidak sepenuhnya.",
        'a, b = 5, 95  # prior Beta: mean 5%\nprint(f"Prior: Beta({a},{b}), mean = {a/(a+b):.2%}")\nprint()\nfor sukses, total in [(8, 100), (16, 200), (40, 500), (80, 1000)]:\n    pa, pb = a + sukses, b + (total - sukses)\n    mean_post = pa / (pa + pb)\n    mentah = sukses / total\n    print(f"data {sukses}/{total} (mentah {mentah:.1%}): posterior Beta({pa},{pb}), mean {mean_post:.2%}")\nprint()\nprint("Makin banyak data, posterior makin dekat ke data mentah")\nprint(\"(prior \'tenggelam\'). Sedikit data -> prior menahan (shrinkage).\")\nprint("Coba: prior Beta(1,1) (tidak tahu apa-apa). Apa yang berubah?")',
        "Inilah <strong>conjugate update</strong>: posterior = prior + hitung sukses/gagal. Fondasi B17.")

    L.sec("lab2", "🔬 Lab 2: Pareto — Rata-rata yang Tidak Stabil")
    L.lab("Lab 2 — Mean yang Gagal Konvergen",
        "Simulasi Pareto(α=1,2): rata-rata sampel meloncat-loncat bahkan di n besar. Bandingkan dengan Normal.",
        'import random, statistics\nrandom.seed(71)\n\ndef pareto(alpha, xm=1.0):\n    return xm / (random.random() ** (1/alpha))\n\nalpha = 1.2\nxs = [pareto(alpha) for _ in range(20000)]\nprint("Pareto(α=1.2): rata-rata kumulatif")\nfor n in [100, 1000, 5000, 20000]:\n    print(f"  n={n:>6}: mean = {statistics.mean(xs[:n]):8.1f}")\nprint(f"  (teori: α/(α-1) = {alpha/(alpha-1):.1f}, tapi sampel meloncat!)")\nprint()\nys = [random.gauss(0,1) for _ in range(20000)]\nprint("Normal(0,1) sebagai banding:")\nfor n in [100, 1000, 5000, 20000]:\n    print(f"  n={n:>6}: mean = {statistics.mean(ys[:n]):+.3f}")\nprint("\\nCoba: alpha=2.5 (ekor lebih tipis). Apakah mean stabil?")',
        "Jika datamu seperti Pareto(α≤2): <strong>jangan percaya SD</strong> (tak berhingga!) — pakai kuantil & EVT (B16).")

    L.sec("peta", "🗺️ Peta Keputusan: Distribusi Kontinu Lanjutan")
    L.decision("1", "Waktu tunggu kejadian ke-α → <strong>Gamma</strong>",
        "Generalisasi Eksponensial untuk beberapa kejadian.",
        kenapa="α=1 → Eksponensial; α bulat → Erlang (jumlah Eksponensial).",
        contoh="Waktu sampai klaim ke-5; total hujan sebulan.")
    L.decision("2", "Peluang/proporsi yang tidak diketahui → <strong>Beta</strong>",
        "Parameter di [0,1]: PD, LGD, conversion rate.",
        kenapa="Konjugat Binomial: update = tambah sukses/gagal. Shrinkage alami.",
        contoh="Posterior PD setelah observasi (worked di atas).")
    L.decision("3", "Inferensi mean sampel kecil / return berekor → <strong>t</strong>",
        "SD tidak diketahui pasti (diestimasi) atau ekor tebal moderat.",
        kenapa="Ekor lebih tebal dari Normal; ν→∞ → Normal.",
        contoh="Uji-t (A2.5); model return harian.")
    L.decision("4", "Uji varians / independensi kategori → <strong>Chi-Square</strong>",
        "Jumlah kuadrat Normal standar.",
        kenapa="Mesin di balik uji chi-square & interval varians; fondasi t dan F.",
        contoh="Uji independensi (A2.6).")
    L.decision("5", "Sedikit raksasa, banyak kecil (ekor pangkat) → <strong>Pareto</strong>",
        "Kekayaan, klaim besar, kerugian operasional.",
        kenapa="Hukum pangkat; α≤2 → varians tak hingga; α≤1 → mean tak hingga.",
        contoh="Model ekor klaim bencana (EVT, B16).")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Yang diestimasi <strong>peluang</strong> → Beta. <strong>Waktu tunggu k kejadian</strong> → Gamma.</li>"
        "<li>Sampel kecil → t, bukan Z. Varians → χ².</li>"
        "<li>Curiga ekor tebal → plot log-log dulu; Pareto = garis lurus.</li>"
        "<li>α ≤ 2 → lupakan SD; pakai kuantil.</li></ol>"))

    L.sec("case", "📋 Mini-Case: LGD yang &ldquo;Rata-rata 40%&rdquo;")
    L.raw(callout("<p>Bank melapor &ldquo;rata-rata LGD 40%&rdquo;. Kamu tarik distribusinya: ternyata <strong>bimodal</strong> — 60% kasus LGD ≈ 10% (ada agunan), 40% kasus LGD ≈ 85% (tanpa agunan). Distribusi Beta campuran.</p>"
        "<p><strong>Pertanyaan:</strong> (a) Mengapa &ldquo;rata-rata 40%&rdquo; berbahaya untuk pricing? (b) Distribusi apa yang lebih jujur untuk LGD?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) Tidak ada LGD yang 40%! Rata-rata jatuh di lembah kosong (mirip Lab B5). Pricing berbasis 40% salah harga untuk <em>kedua</em> segmen: kemahalan untuk beragunan (kabur ke kompetitor), kemurahan untuk tanpa agunan (rugi).</p>"
        "<p>(b) <strong>Campuran dua Beta</strong> (atau model dua segmen): Beta untuk &ldquo;ada agunan&rdquo; (puncak di 10%) + Beta untuk &ldquo;tanpa agunan&rdquo; (puncak di 85%). LGD memang standar dimodelkan Beta (0–1) — dan <strong>bimodalitas = sinyal segmentasi</strong> (ingat A1.2!). Pelajaran: distribusi yang tepat + segmentasi > satu angka rata-rata.</p>")))

    L.quiz("Beta(5,95) lalu amati 16 gagal dari 200. Posterior?",
        ["Beta(21, 279)", "Beta(16, 184)", "Beta(5, 95)", "Beta(21, 184)"],
        0, "Benar: tambah sukses ke a, gagal ke b → Beta(5+16, 95+184). Mean 7% — shrinkage dari 8% mentah.")
    L.quiz("Distribusi t vs Normal: bedanya…",
        ["t selalu simetris sempurna", "t berekor lebih tebal; ν→∞ → Normal", "t hanya untuk data besar", "Tidak ada beda"],
        1, "Benar: t = Normal + ketidakpastian estimasi SD. ν kecil → ekor tebal.")
    L.quiz("χ² dengan k derajat bebas muncul sebagai…",
        ["Jumlah k Normal standar yang dikuadratkan", "Rata-rata k Normal", "Selisih dua Normal", "Hasil kali k Uniform"],
        0, "Benar: definisinya. Makanya dipakai untuk varians (jumlah kuadrat deviasi).")
    L.quiz("Pareto α=1,5: yang benar…",
        ["Mean dan varians hingga", "Mean hingga, varians tak hingga", "Keduanya tak hingga", "Mean nol"],
        1, "Benar: α>1 → mean hingga; α≤2 → varians tak hingga. Jangan hitung SD!"),
    L.quiz("Kapan pakai Gamma?",
        ["Data proporsi", "Waktu tunggu sampai kejadian ke-α", "Uji independensi", "Data kategorik"],
        1, "Benar: Gamma = generalisasi Eksponensial. α=1 → Eksponensial.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Gamma:</strong> tunggu kejadian ke-α (α=1 → Eksponensial).</li>"
        "<li><strong>Beta:</strong> distribusi untuk peluang di [0,1]; konjugat Binomial — update = tambah.</li>"
        "<li><strong>t:</strong> Normal berekor tebal untuk sampel kecil; <strong>χ²:</strong> jumlah kuadrat Normal — untuk varians.</li>"
        "<li><strong>Pareto:</strong> hukum pangkat; α≤2 → varians ∞; α≤1 → mean ∞ — jangan perlakukan seperti Normal.</li>"
        "<li><strong>Jangan</strong> buang &ldquo;outlier&rdquo; ekor tebal — mereka adalah risikonya.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B8
def b8():
    L = Lesson("b8-fitting-distribusi", "B8 — Probabilitas",
        "Fitting Distribusi:<br/>Distribusi Mana yang Jujur?",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b7-distribusi-kontinu-2", "← B7.2"), ("b9-joint-kovarians", "Next: B9"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>MLE</strong> (maximum likelihood) sebagai &ldquo;parameter yang membuat data paling masuk akal&rdquo;.</li>"
        "<li>Memakai <strong>QQ-plot</strong> untuk diagnosis visual kecocokan distribusi.</li>"
        "<li>Menerapkan <strong>uji goodness-of-fit</strong> (KS, chi-square, Anderson-Darling) + AIC/BIC untuk memilih model.</li>"
        "<li>Menghindari jebakan: fitting distribusi yang salah untuk ekor (risiko!).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Model &ldquo;Sempurna&rdquo; yang Gagal di Ekor")
    L.raw('<div className="story"><p>Tim risiko mem-fit distribusi Normal ke data kerugian operasional. QQ-plot tengahnya <strong>sempurna</strong> — titik-titik menempel garis. Uji chi-square: <em>p-value 0,4, &ldquo;lolos&rdquo;</em>. Model disetujui.</p>'
        "<p>Setahun kemudian, kerugian Rp50 miliar datang — model Normal bilang peluangnya 1 banding 10 juta tahun. <strong>Modelnya &ldquo;lolos uji&rdquo; tapi buta di ekor</strong> — karena uji goodness-of-fit standar didominasi <em>badan</em> distribusi (tempat data terbanyak), bukan ekor (tempat risiko terbesar).</p>"
        "<p>Lesson ini: cara fit yang benar + cara tahu kapan fit-mu menipu — terutama di ekor.</p></div>")

    L.sec("mle", "MLE — Parameter yang Membuat Data Paling Masuk Akal")
    L.p("<strong>Definisi.</strong> <strong>Likelihood</strong> " + TI(r"L(\\theta)") + " = peluang (densitas) data teramati <em>jika</em> parameter = " + TI(r"\\theta") + ". <strong>MLE</strong> = " + TI(r"\\theta") + " yang memaksimalkan likelihood:")
    L.p(T(r"\hat{\theta}_{MLE} = \arg\max_{\theta}\; L(\theta) = \arg\max_{\theta}\; \sum_{i=1}^{n} \log f(x_i;\theta)"))
    L.ul([
        TI(r"\\log") + ": dipakai karena jumlah lebih mudah dari kali (log-likelihood); maksimumnya sama.",
        "Intuisi: &ldquo;parameter apa yang membuat data yang kita lihat menjadi <em>paling tidak mengejutkan</em>?&rdquo;",
    ])
    L.p("<strong>Contoh.</strong> Koin 100x, 60 angka. Likelihood " + TI(r"L(p) = p^{60}(1-p)^{40}") + " — dimaksimalkan di " + TI(r"\\hat{p} = 60/100 = 0{,}6") + ". (Untuk Binomial, MLE = proporsi sampel — masuk akal!)")
    L.p("<strong>Contoh Normal:</strong> MLE " + TI(r"\\hat{\\mu} = \\bar{x}") + " (mean sampel), " + TI(r"\\hat{\\sigma}^2 = \\frac{1}{n}\\sum(x_i-\\bar{x})^2") + " (catatan: versi MLE pakai n, bukan n−1 — sedikit bias, lihat A2.2).")
    L.raw(tip("MLE menjawab &ldquo;parameter terbaik untuk <em>distribusi yang sudah kupilih</em>&rdquo; — ia TIDAK menjawab &ldquo;distribusi mana yang benar&rdquo;. Mem-fit Normal dengan MLE ke data Pareto menghasilkan parameter Normal yang &ldquo;optimal&rdquo; tapi model yang salah. Pilih keluarga dulu (diagnosis!), baru estimasi parameter."))
    L.raw(myth("MLE selalu memberikan jawaban terbaik.",
        "MLE optimal secara asimtotik (n → ∞) <em>jika</em> keluarga distribusi benar. Untuk n kecil atau keluarga salah, MLE bisa buruk: ia sensitif terhadap outlier (satu titik ekstrem menggeser μ̂ dan menggelembungkan σ̂). Alternatif robust: M-estimator, atau Bayesian dengan prior (B17)."))

    L.sec("qq", "QQ-Plot — Diagnosis Visual 10 Detik")
    L.p("<strong>Ide:</strong> plot kuantil data vs kuantil teoretis distribusi kandidat. Cocok → titik-titik di <strong>garis lurus diagonal</strong>.")
    L.ul([
        "<strong>Lengkung ke atas di kanan</strong> → ekor kanan data lebih tebal dari model (bahaya! model meremehkan ekstrem).",
        "<strong>Lengkung ke bawah di kanan</strong> → ekor lebih tipis (model terlalu konservatif).",
        "<strong>Bentuk S</strong> → miring (skew) tidak tertangkap model.",
    ])
    L.p("<strong>Kepribadian:</strong> QQ-plot adalah &ldquo;tes kejujuran&rdquo; distribusi — ia memaksa model menunjukkan di mana ia berbohong, terutama di ekor (titik-titik ujung).")
    L.raw(tip("Baca QQ-plot dari <strong>ujung-ujungnya</strong>, bukan tengahnya. Tengah hampir selalu cocok — risiko tinggal di ujung. Aturan: jika 5 titik teratas melengkung menjauh garis, modelmu buta ekor."))

    L.sec("uji", "Uji Formal &amp; Pemilihan Model")
    L.h3("Uji goodness-of-fit")
    L.ul([
        "<strong>Kolmogorov-Smirnov (KS):</strong> jarak maksimum cdf empiris vs teoretis. Umum, tapi kurang peka di ekor.",
        "<strong>Anderson-Darling:</strong> seperti KS tapi <strong>memberi bobot lebih ke ekor</strong> — pilihan tepat untuk risiko!",
        "<strong>Chi-square:</strong> bandingkan frekuensi per bin. Butuh bin cukup; sensitif pada pilihan bin.",
    ])
    L.h3("Banding model: AIC/BIC")
    L.p(T(r"AIC = 2k - 2\log\hat{L}, \qquad BIC = k\log n - 2\log\hat{L}"))
    L.ul([
        TI(r"k") + ": jumlah parameter — penalti kompleksitas (Occam's razor terkuantifikasi).",
        "<strong>Pilih yang terkecil.</strong> BIC menghukum lebih keras untuk n besar.",
    ])
    L.p("<strong>Alur kerja yang benar:</strong> (1) plot histogram + QQ-plot beberapa kandidat → (2) MLE tiap kandidat → (3) bandingkan AIC/BIC + uji AD → (4) <strong>cek ekor secara khusus</strong> (QQ-plot ujung, exceedance) → (5) validasi out-of-sample.")
    L.raw(myth("p-value > 0,05 berarti distribusi benar.",
        "Tidak! &ldquo;Gagal menolak&rdquo; ≠ &ldquo;terbukti benar&rdquo;. Dengan n kecil, uji tidak punya power — distribusi salah pun lolos. Dengan n besar, perbedaan trivial pun &ldquo;signifikan&rdquo;. Uji adalah <em>saringan</em>, bukan sertifikat. Selalu pasangkan dengan QQ-plot + pertimbangan ekor."))
    L.raw(tip("Untuk risiko, urutan prioritas diagnosis: <strong>1. ekor (QQ ujung, AD)</strong>, 2. badan (KS, AIC), 3. tengah. Kebanyakan tutorial mengajarkan urutan terbalik — karena mereka tidak menanggung kerugian Rp50 miliar."))

    L.chart(
        data=[{"x": [-2.5,-2,-1.5,-1,-0.5,0,0.5,1,1.5,2,2.5],
               "y": [-2.5,-2,-1.5,-1,-0.5,0,0.5,1,1.5,2.6,3.4],
               "type": "scatter", "mode": "markers", "name": "kuantil data vs Normal",
               "marker": {"color": "#e8a838", "size": 9}},
              {"x": [-2.5, 2.5], "y": [-2.5, 2.5], "type": "scatter", "mode": "lines",
               "name": "garis cocok sempurna", "line": {"color": "#2a7de1", "dash": "dash"}}],
        title="QQ-Plot: Data vs Normal — Ekor Kanan Melengkung",
        layout={"xaxis": {"title": "Kuantil teoretis Normal"}, "yaxis": {"title": "Kuantil data"}, "showlegend": True},
        cara="Titik = kuantil data vs kuantil Normal; garis putus-putus = cocok sempurna. Baca dari ujung kanan.",
        interpretasi="Tengah menempel garis (terlihat &ldquo;cocok&rdquo;!), tapi 2 titik teratas <strong>melengkung ke atas</strong> — ekor kanan data lebih tebal dari Normal. Inilah pola cerita pembuka: model &ldquo;lolos&rdquo; tapi buta ekor. <strong>Keputusan:</strong> tolak Normal untuk risiko; coba t/Pareto.")

    L.chart(
        data=[{"x": ["Normal", "t (ν=5)", "Pareto"],
               "y": [120.5, 112.3, 118.9], "type": "bar",
               "marker": {"color": ["#94a3b8", "#34a853", "#e8a838"]},
               "text": ["120,5", "112,3", "118,9"], "textposition": "outside"}],
        title="Banding Model via AIC (lebih kecil = lebih baik)",
        layout={"xaxis": {"title": "Model"}, "yaxis": {"title": "AIC"}, "showlegend": False},
        cara="Tiga kandidat di-fit via MLE ke data yang sama; batang = AIC (sudah termasuk penalti parameter).",
        interpretasi="t(ν=5) menang (112,3) — ekor tebalnya menjelaskan data lebih baik daripada Normal maupun Pareto murni. <strong>Tapi</strong> AIC adalah rata-rata terbobot seluruh data — untuk keputusan risiko, tetap cek QQ-plot ekor t(ν=5) sebelum percaya.")

    L.sec("lab1", "🔬 Lab 1: MLE Koin — Cari p yang Memaksimalkan Likelihood")
    L.lab("Lab 1 — Maximum Likelihood dari Nol",
        "Data: 100 lemparan, 63 angka. Hitung log-likelihood untuk p=0,1..0,9 — buktikan maksimum di 0,63.",
        'import math\nn, sukses = 100, 63\nprint(f"Data: {sukses} angka dari {n} lemparan")\nprint()\nterbaik, ll_terbaik = 0, -1e18\nfor p100 in range(5, 96, 5):\n    p = p100 / 100\n    ll = sukses*math.log(p) + (n-sukses)*math.log(1-p)  # log-likelihood Binomial\n    bar = "#" * int(50 * (ll + 400) / 130)\n    print(f"p={p:.2f}  logL={ll:8.1f} {bar}")\n    if ll > ll_terbaik:\n        terbaik, ll_terbaik = p, ll\nprint(f"\\nMLE: p^ = {terbaik:.2f} (= {sukses}/{n} = proporsi sampel)")\nprint("Coba: sukses=50. Di mana puncaknya? (harusnya 0.50)")',
        "Untuk Binomial, MLE = proporsi — tapi untuk distribusi lain (Gamma, Beta) butuh optimasi numerik (scipy, D11).")

    L.sec("lab2", "🔬 Lab 2: QQ-Plot Manual — Deteksi Ekor Tebal")
    L.lab("Lab 2 — QQ-Plot dari Nol (tanpa scipy)",
        "Buat data campuran (95% Normal + 5% ekstrem), lalu QQ-plot vs Normal manual. Lihat ekor melengkung!",
        'import random, math, statistics\nrandom.seed(82)\n# data: 95% N(0,1) + 5% ekstrem (tanda acak * uniform 3..6)\ndata = [random.gauss(0,1) if random.random() < 0.95 else random.choice([-1,1])*random.uniform(3,6) for _ in range(2000)]\ndata.sort()\nn = len(data)\n# kuantil teoretis Normal via aproksimasi Acklam (inverse cdf)\ndef norm_ppf(p):\n    a = [-39.696830286, 220.683265068, -275.928510446, 138.357751867, -30.664798066, 2.506628277]\n    b = [-54.476098798, 161.585836858, -155.698979859, 66.801311887, -13.280681552]\n    c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]\n    d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416]\n    pl, pu = 0.02425, 1 - 0.02425\n    if pl < p < pu:\n        q = p - 0.5; r = q*q\n        return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)\n    q = math.sqrt(-2*math.log(min(p, 1-p)))\n    x = (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)\n    return -x if p < 0.5 else x\n\nprint("QQ-plot (teoretis vs data), 10 titik teratas:")\nprint("  teoritis | data")\nfor i in range(n-10, n):\n    t = norm_ppf((i+0.5)/n)\n    flag = "  <-- MELENGKUNG!" if abs(data[i]) > abs(t)+0.8 else ""\n    print(f"  {t:+.2f}   | {data[i]:+.2f}{flag}")\nprint("\\nCoba: hapus komponen ekstrem (if random.random() < 1.0). Lengkungan hilang?")',
        "Inilah yang dilihat tim risiko di cerita pembuka — bedanya mereka <strong>mengabaikan</strong> lengkungannya.")

    L.sec("peta", "🗺️ Peta Keputusan: Alur Fitting yang Benar")
    L.decision("1", "Belum tahu keluarga → <strong>diagnosis dulu (histogram + QQ-plot)</strong>",
        "Asal pilih Normal adalah default yang berbahaya.",
        kenapa="Bentuk data (miring? ekor tebal? bimodal?) menentukan keluarga — bukan sebaliknya.",
        contoh="Ekor melengkung di QQ Normal → coba t / Pareto.")
    L.decision("2", "Keluarga dipilih → <strong>MLE untuk parameter</strong>",
        "Butuh parameter terbaik dalam keluarga itu.",
        kenapa="Prinsip &ldquo;data paling tidak mengejutkan&rdquo;; optimal asimtotik jika keluarga benar.",
        contoh="μ̂ = x̄, σ̂ dari data untuk Normal.")
    L.decision("3", "Banding beberapa kandidat → <strong>AIC/BIC + uji Anderson-Darling</strong>",
        "Lebih dari satu keluarga masuk akal.",
        kenapa="AIC/BIC menghukum kompleksitas; AD peka ekor (penting untuk risiko).",
        contoh="Normal vs t(ν=5) vs Pareto untuk data kerugian.")
    L.decision("4", "Keputusan melibatkan ekor → <strong>cek ekor khusus</strong>",
        "VaR, modal, worst-case — semua tentang ekor.",
        kenapa="Uji global didominasi badan data; ekor butuh perhatian khusus (QQ ujung, exceedance count).",
        contoh="Hitung P(X > 50M) dari tiap kandidat — bandingkan langsung.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li><strong>Keluarga dulu, parameter kemudian.</strong> MLE tidak memilihkan keluarga.</li>"
        "<li>QQ-plot dibaca dari <strong>ujung</strong>, bukan tengah.</li>"
        "<li>Untuk risiko: Anderson-Darling > KS; dan selalu cek ekor secara eksplisit.</li>"
        "<li>&ldquo;Gagal menolak&rdquo; ≠ &ldquo;terbukti benar&rdquo;.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Memilih Model Kerugian Operasional")
    L.raw(callout("<p>Data 500 kerugian operasional (Rp juta): mean 120, median 45, maks 8.500. Tiga kandidat ter-fit:</p>"
        "<ul><li>Lognormal: AIC 5.210, AD p-value 0,08</li>"
        "<li>Pareto: AIC 5.195, AD p-value 0,15</li>"
        "<li>Campuran (body Lognormal + ekor Pareto): AIC 5.180, AD p-value 0,35</li></ul>"
        "<p><strong>Pertanyaan:</strong> model mana untuk perhitungan modal (ekor 99,9%)? Mengapa bukan sekadar &ldquo;AIC terkecil&rdquo;?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Campuran.</strong> AIC memang terkecil, tapi alasan utamanya struktural: <strong>mekanisme badan ≠ mekanisme ekor</strong>. Kerugian rutin (proses) vs kerugian bencana (fraud besar/sistem) adalah dua fenomena — satu distribusi dipaksa menjelaskan keduanya akan kompromi di tempat yang salah.</p>"
        "<p>Mengapa bukan &ldquo;AIC terkecil, selesai&rdquo;? Karena AIC rata-rata seluruh data — untuk kuantil 99,9%, yang relevan adalah <em>fit di ekor</em> (AD + QQ ujung + exceedance backtest). Praktik industri (LDA untuk risiko operasional): body + ekor terpisah (B16/EVT). <strong>Pelajaran:</strong> kriteria statistik + pengetahuan mekanisme > satu angka.</p>")))

    L.quiz("MLE untuk Binomial(n=100, 63 sukses) menghasilkan p̂ = …",
        ["0,5", "0,63", "0,37", "Tidak bisa tanpa prior"],
        1, "Benar: 63/100 — parameter yang membuat data paling tidak mengejutkan.")
    L.quiz("QQ-plot titik-titik melengkung ke atas di ujung kanan. Artinya…",
        ["Data cocok sempurna", "Ekor kanan data lebih tebal dari model", "Ekor kanan lebih tipis", "Data simetris"],
        1, "Benar: data punya ekstrem lebih besar dari prediksi model — bahaya untuk risiko.")
    L.quiz("Untuk risiko (fokus ekor), uji goodness-of-fit yang lebih tepat…",
        ["Kolmogorov-Smirnov", "Anderson-Darling", "Chi-square selalu", "Uji-t"],
        1, "Benar: AD memberi bobot lebih ke ekor. KS didominasi badan distribusi.")
    L.quiz("AIC = 2k − 2log L̂. Suku 2k berfungsi sebagai…",
        ["Bonus akurasi", "Penalti kompleksitas (Occam's razor)", "Koreksi sampel kecil", "Normalisasi"],
        1, "Benar: menghukum parameter tambahan — model sederhana yang hampir sama baik akan menang.")
    L.quiz("p-value uji KS = 0,4. Interpretasi tepat?",
        ["Distribusi terbukti benar", "Gagal menolak — belum tentu benar; cek power & QQ-plot", "Model salah", "Butuh lebih banyak parameter"],
        1, "Benar: &ldquo;gagal menolak&rdquo; ≠ &ldquo;benar&rdquo;. n kecil → power rendah → model salah pun lolos.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>MLE:</strong> parameter yang membuat data paling tidak mengejutkan — tapi tidak memilih keluarga distribusi.</li>"
        "<li><strong>QQ-plot:</strong> baca dari ujung; lengkung = model buta ekor/bentuk.</li>"
        "<li><strong>AD > KS</strong> untuk risiko; <strong>AIC/BIC</strong> untuk banding model (terkecil menang).</li>"
        "<li><strong>Alur:</strong> diagnosis → MLE → banding → cek ekor khusus → validasi out-of-sample.</li>"
        "<li><strong>Jangan</strong> anggap &ldquo;lolos uji&rdquo; = &ldquo;benar&rdquo; — terutama untuk ekor.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B9
def b9():
    L = Lesson("b9-joint-kovarians", "B9 — Probabilitas",
        "Joint, Kovarians &amp; Bivariat Normal:<br/>Ketika Dua Variabel Bergerak Bersama",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b8-fitting-distribusi", "← B8"), ("b10-copula", "Next: B10"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>distribusi joint</strong> dan menurunkan <strong>marginal</strong> dari joint.</li>"
        "<li>Menghitung <strong>kovarians &amp; korelasi</strong> dan menafsirkan tandanya dengan benar.</li>"
        "<li>Menjelaskan <strong>bivariat normal</strong>: kapan &ldquo;tidak berkorelasi = independen&rdquo; berlaku.</li>"
        "<li>Menghitung <strong>varians portofolio</strong> — mengapa korelasi menentukan diversifikasi.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Diversifikasi yang Menghilang")
    L.raw('<div className="story"><p>Manajer portofolio membanggakan: <em>&ldquo;Kami diversifikasi ke 20 saham dengan korelasi rata-rata 0,2 — risiko kami rendah.&rdquo;</em> Lalu krisis datang. Korelasi melonjak ke <strong>0,8</strong>. Semua saham jatuh bareng. Diversifikasinya <em>menguap</em> tepat saat paling dibutuhkan.</p>'
        "<p>Pelajaran pahit 2008: <strong>korelasi bukan konstanta</strong> — ia berubah, dan biasanya naik saat krisis (correlation breakdown). Memahami joint distribution, kovarians, dan batasnya adalah syarat untuk tidak tertipu &ldquo;diversifikasi di atas kertas&rdquo;.</p></div>")

    L.sec("joint", "Distribusi Joint &amp; Marginal")
    L.p("<strong>Definisi.</strong> <strong>Joint pmf/pdf</strong> " + TI(r"p(x,y)") + " / " + TI(r"f(x,y)") + " = peluang (densitas) " + TI(r"X=x") + " <em>dan</em> " + TI(r"Y=y") + " bersamaan.")
    L.p("<strong>Marginal</strong> — &ldquo;lupakan Y&rdquo;: jumlahkan/integralkan Y keluar:")
    L.p(T(r"p_X(x) = \sum_y p(x,y), \qquad f_X(x) = \int f(x,y)\,dy"))
    L.p("<strong>Contoh.</strong> Tabel joint (X = telat bayar {0,1}, Y = gagal {0,1}):")
    L.table(["", "Y=0", "Y=1", "Marginal X"],
        [["X=0", "0,90", "0,02", "0,92"],
         ["X=1", "0,05", "0,03", "0,08"],
         ["Marginal Y", "0,95", "0,05", "1,00"]])
    L.p("Marginal X: P(telat) = 0,05+0,03 = 8%. Dari joint, kita dapat P(gagal|telat) = 0,03/0,08 = 37,5% (B3!). <strong>Joint adalah &ldquo;induk&rdquo;</strong> — marginal &amp; bersyarat lahir darinya.")
    L.raw(tip("Jika diberi tabel joint, selalu hitung marginal dulu (jumlahkan baris/kolom). Itu &ldquo;cek kewarasan&rdquo;: total harus 1, dan marginal harus cocok dengan yang kamu tahu dari data."))

    L.sec("kov", "Kovarians &amp; Korelasi — Arah Gerak Bersama")
    L.p(T(r"\mathrm{Cov}(X,Y) = E\big[(X-E[X])(Y-E[Y])\big] = E[XY] - E[X]E[Y]"))
    L.ul([
        TI(r"\\mathrm{Cov} > 0") + ": cenderung bergerak <strong>searah</strong> (sama-sama di atas/di bawah mean).",
        TI(r"\\mathrm{Cov} < 0") + ": cenderung <strong>berlawanan arah</strong>.",
        TI(r"\\mathrm{Cov} = 0") + ": <strong>tidak berkorelasi</strong> — TAPI belum tentu independen! (lihat miskonsepsi)",
    ])
    L.p("<strong>Korelasi</strong> = kovarians yang dinormalisasi (tak bersatuan, −1 s/d 1):")
    L.p(T(r"\\rho_{X,Y} = \\frac{\\mathrm{Cov}(X,Y)}{\\sigma_X\\,\\sigma_Y}"))
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Data 4 kuartal: return saham A dan B (dalam %): (2,3), (4,5), (−2,−1), (0,1).</p>"
        "<p><strong>Langkah 1</strong> — mean: Ā=1, B̄=2.</p>"
        "<p><strong>Langkah 2</strong> — deviasi: A:(1,3,−3,−1), B:(1,3,−3,−1).</p>"
        "<p><strong>Langkah 3</strong> — Cov = (1×1 + 3×3 + (−3)(−3) + (−1)(−1))/4 = 20/4 = <strong>5</strong>.</p>"
        "<p><strong>Langkah 4</strong> — σ_A = σ_B = √5 → ρ = 5/5 = <strong>1,0</strong> (di contoh mainan ini keduanya bergerak searah sempurna).</p>"))
    L.raw(myth("Kovarians nol berarti independen.",
        "Salah! Nol kovarians = tidak ada hubungan <em>linear</em>. Contoh klasik: " + TI(r"X \\sim") + " simetris di [−1,1], " + TI(r"Y = X^2") + " — Y sepenuhnya ditentukan X (sangat dependen!) tapi Cov(X,Y) = 0. <strong>Independen → kovarians nol, tapi tidak sebaliknya.</strong> Untuk deteksi dependensi non-linear butuh alat lain (copula/B10, mutual information)."))
    L.raw(tip("Korelasi hanya mengukur hubungan <strong>linear</strong>. Dua variabel bisa berkorelasi 0 tapi berhubungan kuat (non-linear), atau berkorelasi 0,9 tapi hubungannya tidak kausal (confounder — ingat Simpson di A1.6)."))

    L.sec("biv", "Bivariat Normal — Kasus Istimewa")
    L.p("Jika (X,Y) bivariat normal dengan korelasi " + TI(r"\\rho") + ":")
    L.ul([
        "Marginal X dan Y masing-masing <strong>normal</strong> (univariat).",
        TI(r"\\rho = 0") + " ⟺ <strong>independen</strong> — SATU-SATUNYA kasus umum di mana &ldquo;tidak berkorelasi = independen&rdquo;!",
        "Distribusi bersyarat juga normal: " + TI(r"Y|X=x") + " ~ Normal dengan mean " + TI(r"\\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x-\\mu_X)") + " — ini <strong>regresi linear</strong> dalam bentuk probabilistik (fondasi A3.1!).",
    ])
    L.p("<strong>Kepribadian:</strong> bivariat normal adalah &ldquo;warga teladan&rdquo; — semua sifat bagus (marginal normal, kondisional normal, ρ=0 ⟺ independen). Masalahnya: <strong>data keuangan nyata bukan warga teladan</strong> (ekor tebal, dependensi non-linear) — di situlah copula (B10) masuk.")
    L.raw(myth("Marginal normal + korelasi ρ = joint-nya bivariat normal.",
        "Salah dan berbahaya! Marginal tidak menentukan joint — ada tak berhingga joint dengan marginal & korelasi yang sama tapi bentuk dependensi beda (inilah yang ditemukan copula). Pra-2008, model CDO memakai korelasi Gaussian dan mengasumsikan joint Gaussian — salah di ekor, dan ekor itulah yang meledak."))

    L.sec("port", "Varians Portofolio — Matematika Diversifikasi")
    L.p(T(r"\mathrm{Var}(w_1X_1 + w_2X_2) = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2\,w_1w_2\,\rho\,\sigma_1\sigma_2"))
    L.p("<strong>Contoh.</strong> Dua aset, σ=20% masing-masing, bobot 50/50:")
    L.ul([
        "ρ = 0,2 → Var = 0,25×0,04×2 + 2×0,25×0,2×0,04 = 0,024 → SD = <strong>15,5%</strong> (&lt; 20%: diversifikasi bekerja).",
        "ρ = 0,8 → SD = <strong>19,0%</strong> (hampir tidak ada manfaat diversifikasi!).",
        "ρ = −0,5 → SD = <strong>10%</strong> (lindung nilai alami).",
    ])
    L.p("<strong>Interpretasi:</strong> satu-satunya &ldquo;free lunch&rdquo; di keuangan adalah korelasi rendah — dan ia bisa hilang saat krisis. Inilah mengapa stress test memakai korelasi <em>stress</em>, bukan korelasi normal.")

    L.chart(
        data=[{"x": [1, 2, 3, 4, 5, 6], "y": [2, 4, 5, 4, 5, 7], "type": "scatter", "mode": "markers",
               "name": "Korelasi + (ρ≈0,9)", "marker": {"color": "#2a7de1", "size": 10}},
              {"x": [1, 2, 3, 4, 5, 6], "y": [7, 5, 6, 4, 3, 2], "type": "scatter", "mode": "markers",
               "name": "Korelasi − (ρ≈−0,9)", "marker": {"color": "#e8a838", "size": 10}, "xaxis": "x2", "yaxis": "y2"}],
        title="Korelasi Positif vs Negatif (sketsa)",
        layout={"xaxis": {"title": "X", "domain": [0, 0.45]}, "yaxis": {"title": "Y"},
                "xaxis2": {"title": "X", "domain": [0.55, 1]}, "yaxis2": {"title": "Y", "anchor": "x2"},
                "showlegend": True},
        cara="Dua panel: kiri X-Y naik bersama (ρ positif), kanan X naik Y turun (ρ negatif).",
        interpretasi="Korelasi = &ldquo;kecenderungan bergerak searah/berlawanan&rdquo; — <strong>bukan</strong> &ldquo;sebab-akibat&rdquo; dan <strong>bukan</strong> &ldquo;keeratan&rdquo; dalam arti umum (non-linear lolos). Untuk diversifikasi: cari pasangan kanan (negatif/rendah).")

    L.chart(
        data=[{"x": ["ρ = −0,5", "ρ = 0,2 (normal)", "ρ = 0,8 (krisis)"], "y": [0.10, 0.155, 0.19],
               "type": "bar", "marker": {"color": ["#34a853", "#2a7de1", "#ef4444"]},
               "text": ["10%", "15,5%", "19%"], "textposition": "outside"}],
        title="SD Portofolio 50/50: Korelasi Menentukan Segalanya",
        layout={"yaxis": {"title": "SD portofolio", "tickformat": ".0%"}, "showlegend": False},
        cara="Tiga skenario korelasi untuk portofolio yang sama (dua aset σ=20%).",
        interpretasi="Asetnya sama, bobotnya sama — hanya korelasi beda, risiko nyaris 2x lipat (10% → 19%). <strong>Korelasi adalah parameter risiko terpenting sekaligus tersulit diestimasi</strong> — dan ia tidak stabil (cerita pembuka). Jangan percaya diversifikasi tanpa stress korelasi.")

    L.sec("lab1", "🔬 Lab 1: Korelasi Nol tapi Dependen!")
    L.lab("Lab 1 — Bukti Kovarians Nol ≠ Independen",
        "X simetris, Y = X². Hitung korelasi (≈0!) padahal Y sepenuhnya ditentukan X.",
        'import random, statistics\nrandom.seed(90)\nN = 200000\nxs = [random.uniform(-1, 1) for _ in range(N)]\nys = [x**2 for x in xs]\nmx, my = statistics.mean(xs), statistics.mean(ys)\ncov = sum((x-mx)*(y-my) for x, y in zip(xs, ys)) / N\nsx, sy = statistics.pstdev(xs), statistics.pstdev(ys)\nprint(f"Cov(X,Y) = {cov:.4f}")\nprint(f"Korelasi = {cov/(sx*sy):.4f}  <- NOL!")\nprint(f"Tapi Y = X^2: dependen SEMPURNA (tahu X -> tahu Y persis)")\nprint()\nprint("Coba: ys = [abs(x) for x in xs]. Korelasi? (masih ~0!)")\nprint("Pelajaran: korelasi buta terhadap hubungan non-linear simetris.")',
        "Inilah mengapa eksplorasi butuh <strong>scatterplot</strong> (A1.8), bukan cuma angka korelasi.")

    L.sec("lab2", "🔬 Lab 2: Correlation Breakdown — Simulasi Krisis")
    L.lab("Lab 2 — Diversifikasi Menguap",
        "Portofolio 2 aset. Bandingkan SD portofolio saat ρ=0,2 (normal) vs ρ=0,8 (krisis).",
        'import random, statistics\nrandom.seed(91)\n\ndef sim_port(rho, N=100000):\n    # dua Normal(0, 0.2) dengan korelasi rho (via Cholesky)\n    vals = []\n    for _ in range(N):\n        z1, z2 = random.gauss(0,1), random.gauss(0,1)\n        a = 0.2*z1\n        b = 0.2*(rho*z1 + (1-rho**2)**0.5*z2)\n        vals.append(0.5*a + 0.5*b)\n    return statistics.pstdev(vals)\n\nfor rho in [-0.5, 0.0, 0.2, 0.5, 0.8, 1.0]:\n    print(f"ρ={rho:+.1f} -> SD portofolio = {sim_port(rho):.3f}")\nprint()\nprint("Lihat: ρ naik -> SD naik. Di ρ=1, diversifikasi NOL.")\nprint("Coba: bobot 80/20. Apakah diversifikasi lebih baik?")',
        "Stress test yang benar: hitung ulang risiko dengan <strong>ρ krisis</strong>, bukan ρ historis normal.")

    L.sec("peta", "🗺️ Peta Keputusan: Joint, Kovarians, Korelasi")
    L.decision("1", "Punya tabel joint → <strong>hitung marginal dulu</strong>",
        "Data peluang gabungan dua variabel.",
        kenapa="Marginal = cek kewarasan + fondasi untuk bersyarat (B3).",
        contoh="P(telat) = 8% dari tabel di atas.")
    L.decision("2", "Mau tahu arah gerak bersama → <strong>korelasi (bukan kovarians mentah)</strong>",
        "Dua variabel numerik.",
        kenapa="Kovarians bersatuan (sulit tafsir); korelasi −1..1, sebanding.",
        contoh="ρ return dua saham untuk diversifikasi.")
    L.decision("3", "ρ = 0 → <strong>jangan simpulkan independen</strong>",
        "Kecuali yakin bivariat normal.",
        kenapa="Nol korelasi = nol hubungan linear saja. Cek scatterplot!",
        contoh="Y = X²: ρ=0 tapi dependen sempurna.")
    L.decision("4", "Risiko portofolio → <strong>stress korelasinya</strong>",
        "Keputusan berbasis diversifikasi.",
        kenapa="Korelasi naik saat krisis — risiko &ldquo;normal&rdquo; menipu.",
        contoh="Hitung SD portofolio dengan ρ=0,8, bukan 0,2.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Korelasi = arah linear, bukan sebab-akibat, bukan keeratan umum.</li>"
        "<li>ρ=0 ≠ independen (kecuali bivariat normal).</li>"
        "<li>Marginal ≠ joint — korelasi saja tidak menentukan bentuk dependensi (→ B10).</li>"
        "<li>Diversifikasi diuji dengan korelasi <strong>krisis</strong>.</li></ol>"))

    L.sec("case", "📋 Mini-Case: &ldquo;Hedging&rdquo; yang Bukan Hedging")
    L.raw(callout("<p>Bank &ldquo;melindungi&rdquo; portofolio kredit UKM dengan membeli asuransi yang membayar saat <em>default berkorelasi rendah</em>. Korelasi historis default antar debitur: 0,1. Saat resesi sektoral, korelasi aktual: 0,6.</p>"
        "<p><strong>Pertanyaan:</strong> apa yang terjadi pada efektivitas &ldquo;hedging&rdquo; ini? Pelajaran umumnya?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Hedge-nya gagal tepat saat dibutuhkan.</strong> Proteksi dihargai dengan asumsi ρ=0,1 (independen-ish) — saat ρ=0,6, klaim datang bergerombol melebihi yang dimodelkan; penyedia proteksi bisa ikut gagal (counterparty risk berkorelasi!). Ini replika mini krisis 2008: <em>model korelasi konstan + ekor Gaussian = bencana</em>.</p>"
        "<p><strong>Pelajaran umum:</strong> (1) parameter dependensi harus di-stress, bukan diestimasi dari masa tenang; (2) lindung nilai yang bergantung pada korelasi rendah adalah <em>korelasi itu sendiri</em> sebagai risiko — butuh copula dengan tail dependence (B10) untuk memodelkannya jujur.</p>")))

    L.quiz("Dari tabel joint, P(telat)=0,08 didapat dengan…",
        ["Membagi 0,03/0,08", "Menjumlahkan baris X=1: 0,05+0,03", "Mengalikan 0,05×0,03", "Tidak bisa"],
        1, "Benar: marginal = jumlahkan keluar variabel lain. Fondasi sebelum hitung bersyarat.")
    L.quiz("Cov(X,Y)=0. Kesimpulan yang VALID…",
        ["X,Y independen", "Tidak ada hubungan linear; bisa tetap dependen non-linear", "Korelasi = 1", "Y konstan"],
        1, "Benar: contoh Y=X² membuktikan kovarians nol ≠ independen.")
    L.quiz("Pada bivariat normal, ρ=0 berarti…",
        ["Tidak ada hubungan apapun", "Independen (kasus istimewa!)", "Korelasi tidak terdefinisi", "Marginal tidak normal"],
        1, "Benar: satu-satunya kasus umum di mana nol korelasi ⟺ independen. Jangan generalisasi ke distribusi lain.")
    L.quiz("Dua aset σ=20%, 50/50, ρ naik 0,2→0,8. SD portofolio…",
        ["Tetap 15,5%", "Naik ke ~19%", "Turun ke 10%", "Jadi 0"],
        1, "Benar: 15,5% → 19%. Diversifikasi menguap — correlation breakdown.")
    L.quiz("Mengapa korelasi saja tidak cukup untuk risiko?",
        ["Cukup sebenarnya", "Korelasi hanya linear & tidak stabil; bentuk dependensi ekor butuh lebih (copula)", "Korelasi sulit dihitung", "Korelasi selalu 0"],
        1, "Benar: krisis 2008 = pelajaran bahwa dependensi ekor ≠ korelasi linear. Lanjut ke B10.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Joint</strong> = induk: marginal (jumlahkan keluar) &amp; bersyarat lahir darinya.</li>"
        "<li><strong>Korelasi</strong> = kovarians ternormalisasi (−1..1); hanya hubungan <strong>linear</strong>.</li>"
        "<li><strong>ρ=0 ≠ independen</strong> — kecuali bivariat normal (kasus istimewa).</li>"
        "<li><strong>Varians portofolio</strong> ditentukan korelasi — dan korelasi naik saat krisis.</li>"
        "<li><strong>Jangan</strong> percaya diversifikasi tanpa stress korelasi; <strong>jangan</strong> simpulkan independensi dari korelasi nol.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B10
def b10():
    L = Lesson("b10-copula", "B10 — Probabilitas",
        "Copula: Memisahkan Bentuk<br/>Marginal dari Ketergantungan",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b9-joint-kovarians", "← B9"), ("b11-lln-clt", "Next: B11"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>teorema Sklar</strong>: joint = marginal + copula (pemisahan).</li>"
        "<li>Membedakan <strong>copula Gaussian vs t vs Clayton/Gumbel</strong> via tail dependence.</li>"
        "<li>Menjelaskan <strong>tail dependence</strong> — mengapa krisis butuh copula yang tepat.</li>"
        "<li>Menafsirkan pelajaran 2008: apa yang salah dari &ldquo;korelasi Gaussian&rdquo;.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Rumus yang &ldquo;Membunuh&rdquo; Wall Street?")
    L.raw('<div className="story"><p>Tahun 2000, David Li mempublikasikan cara memakai <strong>copula Gaussian</strong> untuk memodelkan default bersama. Rumusnya elegan, mudah dipakai — Wall Street mengadopsinya untuk menilai triliunan dolar CDO. Tahun 2008, semuanya runtuh. <em>Wired</em> menulis: &ldquo;The Formula That Killed Wall Street&rdquo;.</p>'
        "<p>Apakah rumusnya yang salah? Tidak persis — yang salah adalah <strong>cara pakainya</strong>: korelasi diestimasi dari masa tenang, dan copula Gaussian <strong>tidak punya tail dependence</strong> — ia mengasumsikan kejadian ekstrem terjadi <em>independen</em>. Saat krisis, default datang bergerombol — persis yang tidak bisa ditangkap model itu.</p>"
        "<p>Lesson ini: apa itu copula, mengapa ia powerful, dan mengapa memilih yang salah bisa bencana.</p></div>")

    L.sec("sklar", "Teorema Sklar — Pemisahan Elegan")
    L.p("<strong>Teorema Sklar:</strong> setiap distribusi joint " + TI(r"H(x,y)") + " dengan marginal kontinu " + TI(r"F(x), G(y)") + " bisa ditulis:")
    L.p(T(r"H(x,y) = C\big(F(x),\, G(y)\big)"))
    L.ul([
        TI(r"F(x), G(y)") + ": marginal — diubah jadi <strong>uniform [0,1]</strong> (transformasi integral peluang).",
        TI(r"C(u,v)") + ": <strong>copula</strong> — distribusi joint dari dua uniform; murni &ldquo;bentuk ketergantungan&rdquo;, bebas dari bentuk marginal.",
    ])
    L.p("<strong>Intuisi:</strong> copula memisahkan <em>&ldquo;bagaimana tiap variabel berperilaku sendiri&rdquo;</em> (marginal) dari <em>&ldquo;bagaimana mereka bergerak bersama&rdquo;</em> (copula). Kamu bisa pasang marginal apapun (Normal? Pareto? bebas!) dengan struktur dependensi apapun — LEGO probabilistik.")
    L.p("<strong>Kepribadian:</strong> copula adalah &ldquo;penerjemah&rdquo; — ia bekerja di dunia peringkat/uniform, tidak peduli satuan asli. Korelasi peringkat (Spearman!) hidup alami di sini.")
    L.raw(tip("Ingat miskonsepsi B9: &ldquo;marginal + korelasi = joint&rdquo; itu SALAH. Yang benar: <strong>marginal + copula = joint</strong>. Korelasi hanya satu angka; copula adalah seluruh bentuk dependensi."))

    L.sec("jenis", "Keluarga Copula — Pilih Bentuk Ekornya")
    L.h3("1. Copula Gaussian")
    L.p("Dari bivariat normal: " + TI(r"C_\\rho(u,v) = \\Phi_\\rho(\\Phi^{-1}(u), \\Phi^{-1}(v))") + ". <strong>Tidak punya tail dependence</strong>: " + TI(r"\\lambda = 0") + " — kejadian ekstrem (hampir) independen. Inilah dosa 2008.")
    L.h3("2. Copula t")
    L.p("Dari bivariat t: punya <strong>tail dependence simetris</strong> " + TI(r"\\lambda > 0") + " — ekstrem atas &amp; bawah cenderung bareng. Makin kecil ν, makin kuat.")
    L.h3("3. Clayton &amp; Gumbel (Archimedean)")
    L.ul([
        "<strong>Clayton:</strong> tail dependence <strong>bawah</strong> saja — cocok untuk default bersama / crash bersama (risiko kredit!).",
        "<strong>Gumbel:</strong> tail dependence <strong>atas</strong> saja — cocok untuk kejadian besar bersama (klaim bencana, lonjakan).",
    ])
    L.p("<strong>Tail dependence</strong> " + TI(r"\\lambda") + ":")
    L.p(T(r"\\lambda_{\\text{bawah}} = \\lim_{q \\to 0} P(V \\le q \\mid U \\le q)"))
    L.p("&ldquo;Jika satu variabel ekstrem bawah, berapa peluang yang lain ikut ekstrem bawah?&rdquo; Gaussian: → 0. Clayton: > 0.")
    L.raw(myth("Korelasi 0,5 = dependensi 0,5, apapun copulanya.",
        "Korelasi linear yang sama bisa berasal dari copula Gaussian (ekor independen), t (ekor bareng), atau Clayton (bawah bareng) — dengan <strong>implikasi risiko sangat beda</strong>. Dua portofolio dengan korelasi &ldquo;sama&rdquo; bisa punya peluang krisis bersama yang beda 10x lipat. Inilah mengapa copula ada."))
    L.raw(tip("Untuk risiko kredit (default bersama = ekor <em>bawah</em>), copula Clayton/Gumbel-rotated lebih jujur dari Gaussian. Untuk return saham (crash bersama), copula t. Gaussian hanya untuk masa tenang — dan masa tenang bukan saat kamu butuh model."))

    L.sec("praktek", "Copula dalam Praktik — Alur Kerja")
    L.ol([
        "<strong>Fit marginal</strong> tiap variabel (B8): F₁, F₂ — boleh beda keluarga!",
        "<strong>Transformasi ke uniform:</strong> uᵢ = F₁(xᵢ), vᵢ = G(yᵢ) — sekarang hidup di kotak [0,1]².",
        "<strong>Pilih &amp; fit copula:</strong> dari pola scatter (u,v) + tail dependence yang dibutuhkan; estimasi parameter via MLE.",
        "<strong>Validasi:</strong> bandingkan frekuensi kejadian bersama ekstrem (empiris vs model) — <em>di ekor</em>, bukan di tengah.",
    ])
    L.p("<strong>Hubungan ke Vasicek (B13):</strong> model Vasicek sebenarnya memakai <em>struktur Gaussian</em> satu faktor — pahami batasnya dari lesson ini sebelum percaya hasilnya.")
    L.raw(myth("Copula = alat curang untuk menaikkan korelasi.",
        "Copula bukan tentang &ldquo;menaikkan angka&rdquo; — ia tentang <em>bentuk</em>. Bahkan dengan korelasi sama, copula yang tepat mengubah peluang kejadian bersama ekstrem secara dramatis. Yang &ldquo;curang&rdquo; adalah memakai Gaussian dan berharap ekor baik-baik saja."))

    L.chart(
        data=[{"x": ["Gaussian", "t (ν=4)", "Clayton"],
               "y": [0.0, 0.35, 0.55], "type": "bar",
               "marker": {"color": ["#94a3b8", "#e8a838", "#ef4444"]},
               "text": ["0", "0,35", "0,55"], "textposition": "outside"}],
        title="Tail Dependence Bawah: Gaussian vs t vs Clayton",
        layout={"xaxis": {"title": "Copula (korelasi disamakan)"}, "yaxis": {"title": "λ bawah"}, "showlegend": False},
        cara="Tiga copula dengan korelasi linear SAMA; batang = peluang &ldquo;ikut jatuh&rdquo; saat satu ekstrem bawah.",
        interpretasi="Korelasi sama, nasib beda: Gaussian bilang &ldquo;ekstrem tidak menular&rdquo; (λ=0), Clayton bilang 55% menular. <strong>Model 2008 memakai yang kiri untuk risiko yang perilakunya seperti kanan.</strong> Inilah &ldquo;formula yang membunuh&rdquo; — bukan rumusnya, tapi pilihannya.")

    L.chart(
        data=[{"x": [i/100 for i in range(1, 100)], "y": [i/100 for i in range(1, 100)],
               "type": "scatter", "mode": "lines", "name": "Independen (diagonal)",
               "line": {"color": "#94a3b8", "dash": "dash"}},
              {"x": [0.01, 0.05, 0.1, 0.2, 0.5], "y": [0.35, 0.42, 0.48, 0.55, 0.68],
               "type": "scatter", "mode": "lines+markers", "name": "Clayton: P(V≤q|U≤q)",
               "line": {"color": "#ef4444"}}],
        title="Clayton: Makin Ekstrem, Makin Menular",
        layout={"xaxis": {"title": "q (ambang ekstrem)"}, "yaxis": {"title": "P(ikut ekstrem | satu ekstrem)"}, "showlegend": True},
        cara="Sumbu X = seberapa ekstrem ambangnya (makin kiri makin ekstrem); sumbu Y = peluang bersyarat ikut ekstrem.",
        interpretasi="Pada Clayton, makin ekstrem kejadiannya, makin besar peluang menularnya (naik ke kiri) — <strong>kebalikan dari intuisi &ldquo;kejadian langka itu independen&rdquo;</strong>. Inilah pola krisis finansial: yang &ldquo;1-in-100-tahun&rdquo; datang bergerombol.")

    L.sec("lab1", "🔬 Lab 1: Korelasi Sama, Ekor Beda")
    L.lab("Lab 1 — Gaussian vs Clayton (Simulasi)",
        "Simulasikan dua copula dengan korelasi mirip. Hitung P(keduanya < persentil 5%) — lihat bedanya.",
        'import random, math\nrandom.seed(101)\nN = 200000\n\ndef gauss_copula(rho, n):\n    pts = []\n    for _ in range(n):\n        z1, z2 = random.gauss(0,1), random.gauss(0,1)\n        x = z1\n        y = rho*z1 + math.sqrt(1-rho**2)*z2\n        # ke uniform via cdf Normal (aproksimasi)\n        pts.append((0.5*(1+math.erf(x/math.sqrt(2))), 0.5*(1+math.erf(y/math.sqrt(2)))))\n    return pts\n\ndef clayton_copula(theta, n):\n    pts = []\n    for _ in range(n):\n        # Marshall-Olkin untuk Clayton\n        u = random.random()\n        e = -math.log(random.random())\n        s = -math.log(random.random())\n        w = (1 + s)**(-1/theta)\n        v = (u**(-theta)*(w**(-theta)-1) + 1)**(-1/theta)\n        pts.append((u, min(v, 1.0)))\n    return pts\n\ng = gauss_copula(0.7, N)\nc = clayton_copula(2.0, N)\nq = 0.05\npg = sum(1 for u, v in g if u < q and v < q) / sum(1 for u, v in g if u < q)\npc = sum(1 for u, v in c if u < q and v < q) / sum(1 for u, v in c if u < q)\nprint(f"Gaussian(0.7): P(ikut ekstrem | ekstrem) = {pg:.2%}")\nprint(f"Clayton(2.0) : P(ikut ekstrem | ekstrem) = {pc:.2%}")\nprint("\\nKorelasi mirip, tapi peluang krisis bersama beda JAUH.")\nprint("Coba: q=0.01 (lebih ekstrem). Selisih makin besar?")',
        "Angka ini = alasan model CDO Gaussian meremehkan risiko 2008.")

    L.sec("lab2", "🔬 Lab 2: Transformasi ke Uniform (Cara Kerja Copula)")
    L.lab("Lab 2 — Pisahkan Marginal dari Dependensi",
        "Ambil data miring (eksponensial), transformasi via cdf empiris ke uniform — lihat dependensi &ldquo;telanjang&rdquo;.",
        'import random, statistics\nrandom.seed(102)\nN = 5000\n# X,Y eksponensial berkorelasi (dibangun via Gaussian copula, rho=0.6)\nimport math\nxs, ys = [], []\nfor _ in range(N):\n    z1, z2 = random.gauss(0,1), random.gauss(0,1)\n    u = 0.5*(1+math.erf(z1/math.sqrt(2)))\n    v = 0.5*(1+math.erf((0.6*z1+0.8*z2)/math.sqrt(2)))\n    xs.append(-math.log(1-u))  # Eksponensial(1) via inverse cdf\n    ys.append(-2*math.log(1-v)) # Eksponensial(0.5)\n# cdf empiris -> uniform\nsx, sy = sorted(xs), sorted(ys)\nu = [sx.index(x)/N for x in xs]\nv = [sy.index(y)/N for y in ys]\nprint(f"data asli: X miring (mean {statistics.mean(xs):.2f}), Y miring (mean {statistics.mean(ys):.2f})")\nprint(f"setelah transformasi: U,V ~ Uniform(0,1), mean {statistics.mean(u):.2f}, {statistics.mean(v):.2f}")\n# korelasi peringkat (Spearman) vs korelasi linear\nmu, mv = statistics.mean(u), statistics.mean(v)\nnum = sum((a-mu)*(b-mv) for a,b in zip(u,v))\nden = (sum((a-mu)**2 for a in u)*sum((b-mv)**2 for b in v))**0.5\nprint(f"korelasi peringkat (Spearman) U,V = {num/den:.3f}  <- dependensi murni, tanpa pengaruh marginal!")\nprint("\\nCoba: ubah rho 0.6 -> 0.9. Apa yang berubah? (marginal tetap!)")',
        "Inilah Sklar beraksi: marginal (Eksponensial) dipisahkan, dependensi (ρ=0,6) tetap.")

    L.sec("peta", "🗺️ Peta Keputusan: Copula Mana?")
    L.decision("1", "Masa tenang / dependensi simetris ringan → <strong>Gaussian</strong>",
        "Tidak ada alasan curiga ekor menular.",
        kenapa="Sederhana, mudah dihitung. Tapi tanpa tail dependence!",
        contoh="Operasional harian non-krisis.")
    L.decision("2", "Crash bersama dua arah (saham) → <strong>t</strong>",
        "Ekstrem atas &amp; bawah sama-sama menular.",
        kenapa="Tail dependence simetris; ν kecil → kuat.",
        contoh="Return portofolio multi-aset saat stress.")
    L.decision("3", "Default / gagal bersama (ekor bawah) → <strong>Clayton</strong>",
        "Yang menakutkan adalah kejadian buruk bergerombol.",
        kenapa="Tail dependence bawah saja — hemat &amp; tepat sasaran.",
        contoh="Default bersama portofolio kredit (pengganti Vasicek Gaussian).")
    L.decision("4", "Lonjakan besar bersama (ekor atas) → <strong>Gumbel</strong>",
        "Klaim bencana, spike harga komoditas.",
        kenapa="Tail dependence atas saja.",
        contoh="Asuransi bencana multi-wilayah.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Tanya dulu: <strong>ekor mana yang menular?</strong> Bawah → Clayton, atas → Gumbel, dua-duanya → t, tidak ada → Gaussian.</li>"
        "<li>Korelasi sama ≠ risiko sama. Selalu tanya copulanya.</li>"
        "<li>Validasi di <strong>ekor</strong>: bandingkan frekuensi kejadian bersama ekstrem empiris vs model.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Audit Model CDO 2007 (Retrospektif)")
    L.raw(callout("<p>Kamu auditor kuant di 2007. Bank memakai copula Gaussian dengan korelasi default 0,2 (dari data 2003–2006, masa tenang) untuk menilai tranche CDO. Kamu curiga.</p>"
        "<p><strong>Pertanyaan:</strong> (a) Dua kelemahan fatal apa? (b) Tes/analisis apa yang kamu minta sebelum menyetujui?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) <strong>Kelemahan 1:</strong> copula Gaussian tanpa tail dependence — default bersama saat krisis tidak tertangkap. <strong>Kelemahan 2:</strong> korelasi dari masa tenang (0,2) — correlation breakdown: saat krisis korelasi melonjak (B9!). Kombinasinya = meremehkan risiko tranche senior secara sistematis.</p>"
        "<p>(b) <strong>Yang diminta:</strong> (1) ganti/uji copula dengan tail dependence (t/Clayton) dan bandingkan harga tranche; (2) stress korelasi (0,2 → 0,5/0,7); (3) backtest pada periode stress historis (bukan cuma masa tenang); (4) analisis sensitivitas: seberapa besar harga berubah jika asumsi goyah. <strong>Pelajaran abadi:</strong> model dependensi harus diuji di rezim yang relevan dengan keputusan — bukan di rezim yang nyaman.</p>")))

    L.quiz("Teorema Sklar: H(x,y) = C(F(x), G(y)). Artinya…",
        ["Joint = jumlah marginal", "Joint = copula(marginal) — dependensi terpisah dari marginal", "Copula = korelasi", "Marginal tidak penting"],
        1, "Benar: pemisahan elegan — bentuk tiap variabel (marginal) bebas dipilih, lalu dipasang struktur dependensi (copula).")
    L.quiz("Dosa fatal copula Gaussian untuk risiko kredit…",
        ["Terlalu rumit", "Tidak punya tail dependence — ekstrem dianggap independen", "Tidak bisa dihitung", "Hanya untuk data normal"],
        1, "Benar: λ=0. Default bersama saat krisis = kejadian ekstrem berekor — persis yang tidak ditangkap.")
    L.quiz("Untuk default bersama (ekor bawah menular), copula paling jujur…",
        ["Gaussian", "Gumbel", "Clayton", "Independen"],
        2, "Benar: Clayton punya tail dependence bawah. Gumbel untuk ekor atas.")
    L.quiz("Dua portofolio, korelasi sama 0,5, copula beda (Gaussian vs Clayton). Maka…",
        ["Risiko krisis bersama sama", "Peluang krisis bersama bisa beda jauh", "Clayton selalu lebih aman", "Korelasi salah hitung"],
        1, "Benar: korelasi hanya satu angka linear; bentuk ekor ditentukan copula.")
    L.quiz("Langkah pertama alur kerja copula yang benar…",
        ["Langsung fit copula Gaussian", "Fit marginal tiap variabel, transformasi ke uniform", "Hitung korelasi Pearson", "Asumsikan independen"],
        1, "Benar: marginal dulu (boleh beda keluarga!), baru dependensi di dunia uniform.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Sklar:</strong> joint = copula(marginal) — pisahkan bentuk individu dari ketergantungan.</li>"
        "<li><strong>Tail dependence (λ):</strong> &ldquo;ekstrem menular?&rdquo; — Gaussian λ=0, t simetris, Clayton bawah, Gumbel atas.</li>"
        "<li><strong>Pelajaran 2008:</strong> korelasi masa tenang + copula tanpa tail dependence = bencana.</li>"
        "<li><strong>Alur:</strong> fit marginal → ke uniform → pilih copula sesuai ekor → validasi di ekor.</li>"
        "<li><strong>Jangan</strong> samakan korelasi dengan dependensi — dan <strong>jangan</strong> validasi model krisis dengan data masa tenang.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B11
def b11():
    L = Lesson("b11-lln-clt", "B11 — Probabilitas",
        "LLN &amp; CLT: Mengapa Rata-rata<br/>Sampel Bisa Dipercaya",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("b10-copula", "← B10"), ("b12-monte-carlo", "Next: B12"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>LLN</strong>: rata-rata sampel → ekspektasi, dan kapan ia gagal (Pareto!).</li>"
        "<li>Menjelaskan <strong>CLT</strong>: distribusi rata-rata sampel → Normal, seberapa cepat, dan syaratnya.</li>"
        "<li>Menghitung <strong>standard error</strong> " + TI(r"\\sigma/\\sqrt{n}") + " dan menafsirkan &ldquo;√n&rdquo;.</li>"
        "<li>Menjelaskan mengapa seluruh inferensi klasik (interval, uji) berdiri di atas dua teorema ini.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Jajak Pendapat 1.000 Orang Mewakili 200 Juta?")
    L.raw('<div className="story"><p>Survei elektabilitas: <strong>1.000 responden</strong> diklaim mewakili 200 juta pemilih, dengan &ldquo;margin of error ±3%&rdquo;. Kok bisa? 1.000 dari 200 juta itu 0,0005%!</p>'
        "<p>Jawabannya dua teorema paling penting di statistika. <strong>LLN</strong> bilang: rata-rata 1.000 orang mendekati rata-rata populasi. <strong>CLT</strong> bilang: <em>seberapa dekatnya</em> bisa dihitung — dan hanya bergantung pada n (1.000), <strong>bukan</strong> pada besar populasi (200 juta)! Inilah mengapa survei nasional tidak butuh jutaan responden.</p>"
        "<p>Dua teorema ini juga fondasi A/B testing, interval kepercayaan, dan Monte Carlo (B12).</p></div>")

    L.sec("lln", "Hukum Bilangan Besar (LLN) — Rata-rata Menuju Ekspektasi")
    L.p(T(r"\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^{n} X_i \\;\\xrightarrow[n\\to\\infty]{}\\; E[X]"))
    L.ul([
        TI(r"X_i") + ": sampel acak independen dari distribusi yang sama (i.i.d.),",
        "Panah: konvergensi dalam peluang — makin besar n, " + TI(r"\\bar{X}_n") + " makin &ldquo;nempel&rdquo; ke " + TI(r"E[X]") + ".",
    ])
    L.p("<strong>Intuisi:</strong> tiap sampel baru &ldquo;mengencerkan&rdquo; pengaruh sampel lama. Setelah 10.000 lemparan, 10 lemparan awal yang sial tidak lagi berarti.")
    L.p("<strong>Kapan GAGAL?</strong> Syarat: " + TI(r"E|X| < \\infty") + " (mean hingga!). Pareto α≤1 (B7.2): mean tak hingga → LLN gagal → rata-rata sampel meloncat selamanya (ingat Lab B7.2!). Juga gagal jika tidak independen (data berkorelasi kuat) atau tidak identik.")
    L.raw(myth("LLN berarti 1.000 sampel selalu dekat dengan populasi.",
        "LLN adalah pernyataan <em>asimtotik</em> (n → ∞) — tidak menjanjikan seberapa dekat di n=1.000. &ldquo;Seberapa dekat&rdquo; diatur CLT + standard error. Dan LLN butuh mean hingga: untuk data Pareto (α≤1), n=1 juta pun rata-rata tetap liar."))
    L.raw(tip("LLN adalah <em>alasan</em> kita percaya rata-rata sampel; CLT adalah <em>penggaris</em> yang mengukur kepercayaannya. Dua-duanya dibutuhkan — LLN tanpa CLT = &ldquo;percaya saja&rdquo; tanpa ukuran."))

    L.sec("clt", "Teorema Limit Pusat (CLT) — Keajaiban Bentuk Lonceng")
    L.p(T(r"\\frac{\\bar{X}_n - \\mu}{\\sigma/\\sqrt{n}} \\;\\xrightarrow[n\\to\\infty]{}\\; N(0,1)"))
    L.ul([
        "Apapun bentuk distribusi asal (miring! bimodal! diskret!) — distribusi <strong>rata-rata sampel</strong> mendekati Normal.",
        TI(r"\\mu, \\sigma") + ": mean &amp; SD distribusi asal (harus hingga!).",
        TI(r"\\sigma/\\sqrt{n}") + ": <strong>standard error</strong> — SD dari rata-rata sampel.",
    ])
    L.p("<strong>Mengapa ajaib?</strong> Data gaji (miring kanan parah) → rata-rata dari 100 gaji → (hampir) Normal! Inilah mengapa uji-z/interval kepercayaan bekerja untuk data tidak normal — asal n cukup.")
    L.p("<strong>Seberapa cepat?</strong> Aturan praktis n ≥ 30 untuk data &ldquo;wajar&rdquo;. Tapi: makin miring/ekor tebal data asal → makin besar n yang dibutuhkan. Data Pareto butuh n raksasa; data simetris butuh n kecil.")
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Waktu tunggu nasabah ~ Eksponensial(λ=0,2/mnt): μ=5 mnt, σ=5 mnt (sangat miring!). Sampel n=100. Berapa P(rata-rata &gt; 6 mnt)?</p>"
        "<p><strong>Langkah 1</strong> — SE = σ/√n = 5/10 = <strong>0,5</strong>.</p>"
        "<p><strong>Langkah 2</strong> — z = (6−5)/0,5 = <strong>2,0</strong>.</p>"
        "<p><strong>Langkah 3</strong> — P(Z &gt; 2) ≈ <strong>2,3%</strong>.</p>"
        "<p>Padahal data aslinya Eksponensial (jauh dari Normal)! CLT yang memungkinkan hitungan ini — inilah &ldquo;keajaiban&rdquo;-nya.</p>"))
    L.raw(myth("CLT berarti data menjadi normal jika n besar.",
        "SALAH total — yang menjadi normal adalah <strong>distribusi rata-rata sampel</strong>, bukan datanya! Data gaji 1 juta orang tetap miring kanan; yang normal adalah distribusi &ldquo;rata-rata dari 100 gaji&rdquo; yang diulang berkali-kali. Mencampuradukkan keduanya = kesalahan paling umum tentang CLT."))
    L.raw(tip("Hafalkan: <strong>SE = σ/√n</strong>. Untuk presisi 2x lipat → butuh <strong>4x sampel</strong> (√n!). Inilah ekonomi survei: 1.000 → 4.000 responden hanya memangkas error dari 3% ke 1,5%. Akar kuadrat adalah &ldquo;pajak&rdquo; presisi."))

    L.sec("se", "Standard Error — Penggaris Kepercayaan")
    L.p(T(r"SE(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}"))
    L.p("<strong>Contoh survei:</strong> proporsi p=0,5 (kasus terburuk), n=1.000 → SE = √(0,25/1000) ≈ 1,58%. Margin of error 95% = 1,96×SE ≈ <strong>±3,1%</strong> — inilah &ldquo;±3%&rdquo; di cerita pembuka! Dan populasi 200 juta tidak masuk rumus — hanya n.")
    L.p("<strong>Implikasi A/B testing:</strong> beda konversi 0,5% butuh n besar agar SE lebih kecil dari efeknya. Inilah kalkulasi ukuran sampel (A2.10).")

    L.chart(
        data=[{"x": [round(0.5+i*0.25,2) for i in range(38)],
               "y": [round(0.2*__import__("math").exp(-0.2*(0.5+i*0.25)),3) for i in range(38)],
               "type": "scatter", "mode": "lines", "name": "Data asal: Eksponensial",
               "line": {"color": "#e8a838"}},
              {"x": ["n=1", "n=5", "n=30", "n=100"], "y": [1, 1, 1, 1], "type": "bar",
               "marker": {"color": "#2a7de1"}, "showlegend": False, "visible": False}],
        title="CLT: Rata-rata Sampel dari Data Eksponensial",
        layout={"xaxis": {"title": "x"}, "yaxis": {"title": "densitas"}, "showlegend": True,
                "annotations": [{"x": 7, "y": 0.16, "text": "n=1: miring (Eksponensial)", "showarrow": False},
                                {"x": 5, "y": 0.05, "text": "n=100: hampir Normal di sekitar μ=5", "showarrow": False}]},
        cara="Kurva kuning = distribusi data asal (Eksponensial, sangat miring). Anotasi menjelaskan bentuk distribusi rata-rata sampel untuk n=1 vs n=100 (lihat Lab 1 untuk visual pastinya).",
        interpretasi="Data asal tidak berubah (tetap miring!) — yang berubah adalah <strong>distribusi rata-ratanya</strong>: dari miring (n=1) menjadi lonceng simetris di sekitar μ (n=100). Inilah CLT: keajaiban terjadi pada rata-rata, bukan pada data.")

    L.chart(
        data=[{"x": [100, 400, 1000, 4000, 10000], "y": [5.0, 2.5, 1.58, 0.79, 0.5],
               "type": "scatter", "mode": "lines+markers", "name": "SE = 50%/√n (p=0,5)",
               "line": {"color": "#2a7de1"}}],
        title="Pajak √n: Presisi 2x Butuh Sampel 4x",
        layout={"xaxis": {"title": "n (sampel)", "type": "log"}, "yaxis": {"title": "Standard error (%)"}, "showlegend": False},
        cara="Sumbu X log: n dari 100 ke 10.000. Sumbu Y = standard error proporsi (p=0,5).",
        interpretasi="Kurva melandai: 100→400 memangkas SE 5%→2,5%, tapi 1.000→4.000 hanya 1,58%→0,79%. <strong>Presisi punya diminishing return akar kuadrat.</strong> Keputusan bisnis: kapan berhenti menambah sampel? Saat biaya sampel > nilai presisi tambahan.")

    L.sec("lab1", "🔬 Lab 1: Saksikan CLT Lahir dari Data Miring")
    L.lab("Lab 1 — Distribusi Rata-rata Sampel",
        "Data asal: dadu (diskret!) atau Eksponensial (miring!). Lihat distribusi rata-rata sampel menjadi lonceng saat n naik.",
        'import random, statistics\nrandom.seed(111)\n\ndef rata2_sampel(n, trials, gen):\n    return [statistics.mean([gen() for _ in range(n)]) for _ in range(trials)]\n\n# data asal: Eksponensial(1) — sangat miring, mean=1\nmeans1 = rata2_sampel(1, 20000, lambda: random.expovariate(1))\nmeans30 = rata2_sampel(30, 20000, lambda: random.expovariate(1))\nprint(f"n=1 : mean={statistics.mean(means1):.2f}, bentuk: miring (itu datanya sendiri)")\nprint(f"n=30: mean={statistics.mean(means30):.3f}, SD={statistics.pstdev(means30):.3f}")\nprint(f"      teori: mean=1.000, SE=1/√30={1/30**0.5:.3f}  <- COCOK!")\n# cek normalitas kasar: proporsi dalam ±2 SE\np = sum(1 for m in means30 if abs(m-1) <= 2/30**0.5)/len(means30)\nprint(f"      proporsi dalam ±2SE: {p:.1%} (teori Normal: 95.4%)")\nprint("\\nCoba: ganti gen jadi dadu: lambda: random.randint(1,6). n=30 cukup?")',
        "Ulangi dengan n=5: belum normal sempurna. Itulah &ldquo;kecepatan konvergensi&rdquo; — tergantung kemiringan data asal.")

    L.sec("lab2", "🔬 Lab 2: LLN Gagal di Pareto — Batas Teorema")
    L.lab("Lab 2 — Kapan LLN Berkhianat",
        "Bandingkan LLN untuk data &ldquo;baik&rdquo; (Eksponensial) vs &ldquo;liar&rdquo; (Pareto α=1,1).",
        'import random, statistics\nrandom.seed(112)\n\ndef pareto(a):\n    return 1.0 / (random.random() ** (1/a))\n\nprint("Eksponensial(1) — LLN bekerja:")\nxs = [random.expovariate(1) for _ in range(50000)]\nfor n in [100, 1000, 10000, 50000]:\n    print(f"  n={n:>6}: mean={statistics.mean(xs[:n]):.3f}")\nprint("\\nPareto(α=1.1) — LLN GAGAL (mean tak hingga):")\nys = [pareto(1.1) for _ in range(50000)]\nfor n in [100, 1000, 10000, 50000]:\n    print(f"  n={n:>6}: mean={statistics.mean(ys[:n]):8.1f}  <- meloncat terus!")\nprint("\\nKesimpulan: teorema punya SYARAT. Cek E|X|<∞ sebelum percaya rata-rata.")',
        "Inilah mengapa B7.2/B16 ada: sebagian data finansial hidup di wilayah LLN-gagal.")

    L.sec("peta", "🗺️ Peta Keputusan: LLN/CLT dalam Praktik")
    L.decision("1", "Mau percaya rata-rata sampel → <strong>cek syarat LLN</strong>",
        "Data i.i.d. dan mean hingga.",
        kenapa="Tanpa mean hingga (Pareto α≤1) atau independensi, rata-rata menipu.",
        contoh="Rata-rata klaim: cek ekor dulu (B7.2) sebelum percaya mean.")
    L.decision("2", "Mau interval/uji untuk mean → <strong>CLT + SE</strong>",
        "n cukup besar relatif terhadap kemiringan data.",
        kenapa="SE = σ/√n mengukur presisi; 1,96×SE = margin 95%.",
        contoh="Survei ±3%: 1,96×√(0,25/1000).")
    L.decision("3", "n kecil + data miring → <strong>jangan paksa CLT</strong>",
        "n < 30 dengan data sangat miring/ekor tebal.",
        kenapa="Konvergensi belum terjadi — interval Normal terlalu sempit.",
        contoh="Pakai t (lebih lebar), bootstrap (A2.9), atau tambah sampel.")
    L.decision("4", "Butuh presisi 2x → <strong>siapkan 4x sampel</strong>",
        "Perencanaan survei/eksperimen.",
        kenapa="Pajak √n — diminishing return.",
        contoh="A/B testing: hitung n dari efek minimum yang mau dideteksi (A2.10).")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>LLN: rata-rata → ekspektasi (butuh mean hingga + i.i.d.).</li>"
        "<li>CLT: <strong>rata-rata</strong> → Normal (bukan datanya!). SE = σ/√n.</li>"
        "<li>Presisi 2x = sampel 4x. Populasi tidak masuk rumus SE.</li>"
        "<li>Data liar (Pareto) → kedua teorema goyah — pakai B16.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Survei Kepuasan 400 Responden")
    L.raw(callout("<p>Bank survei 400 nasabah: 320 puas (80%). Direksi: <em>&ldquo;Berapa rentang kepuasan sebenarnya? Dan kalau mau ±2%, berapa responden?&rdquo;</em></p>"
        "<p><strong>Pertanyaan:</strong> (a) Interval 95% untuk proporsi puas. (b) n agar margin ±2%.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) SE = √(0,8×0,2/400) = 0,02. Interval 95% = 0,80 ± 1,96×0,02 = <strong>76%–84%</strong>. (CLT untuk proporsi: Binomial → Normal.)</p>"
        "<p>(b) 1,96×√(0,25/n) ≤ 0,02 (pakai p=0,5, kasus terburuk) → √n ≥ 49 → <strong>n ≥ 2.401</strong>. Dari 400 ke 2.401 — pajak √n beraksi! <strong>Pelajaran bisnis:</strong> presisi itu mahal; tentukan dulu <em>berapa presisi yang benar-benar dibutuhkan untuk keputusan</em> sebelum bayar survei.</p>")))

    L.quiz("LLN mengatakan…",
        ["Data menjadi normal", "Rata-rata sampel → ekspektasi saat n→∞", "n=30 selalu cukup", "Populasi harus kecil"],
        1, "Benar: konvergensi rata-rata ke ekspektasi. &ldquo;Menjadi normal&rdquo; adalah CLT.")
    L.quiz("CLT: yang menjadi (mendekati) normal adalah…",
        ["Data aslinya", "Distribusi rata-rata sampel", "Seluruh populasi", "Variansnya"],
        1, "Benar: rata-ratanya! Data gaji tetap miring; rata-rata 100 gaji yang normal.")
    L.quiz("SE = σ/√n. Untuk memangkas SE setengahnya, n harus…",
        ["2x", "4x", "10x", "Tetap"],
        1, "Benar: pajak akar kuadrat. 4x sampel = 2x presisi.")
    L.quiz("Survei 1.000 orang untuk 200 juta pemilih valid karena…",
        ["1.000 cukup besar absolut", "SE hanya bergantung pada n, bukan besar populasi", "Pemilih homogen", "Kebetulan"],
        1, "Benar: SE = σ/√n — populasi tidak masuk rumus (kecuali populasi kecil → koreksi populasi hingga).")
    L.quiz("LLN bisa gagal jika…",
        ["n terlalu besar", "Mean tak hingga (Pareto α≤1) atau tidak independen", "Data normal", "Sampel acak"],
        1, "Benar: syarat E|X|<∞ dan i.i.d. Data finansial berekor tebal = waspada.")
    L.quiz("Data Eksponensial (miring), n=100. P(rata-rata > μ+2SE) ≈ …",
        ["50%", "2,3%", "16%", "Tidak bisa dihitung"],
        1, "Benar: CLT — rata-rata ≈ Normal meski data asal miring. z=2 → ekor 2,3%.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>LLN:</strong> " + TI(r"\\bar{X}_n \\to E[X]") + " — alasan percaya rata-rata (butuh mean hingga, i.i.d.).</li>"
        "<li><strong>CLT:</strong> distribusi " + TI(r"\\bar{X}_n") + " → Normal — <strong>bukan datanya</strong>, tapi rata-ratanya.</li>"
        "<li><strong>SE = σ/√n:</strong> penggaris presisi; presisi 2x = 4x sampel; populasi tak masuk rumus.</li>"
        "<li><strong>Fondasi:</strong> survei ±3%, interval kepercayaan, uji hipotesis, A/B testing, Monte Carlo.</li>"
        "<li><strong>Jangan</strong> paksa CLT untuk n kecil + data liar — dan <strong>jangan</strong> samakan &ldquo;data normal&rdquo; dengan &ldquo;rata-rata normal&rdquo;.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B12
def b12():
    L = Lesson("b12-monte-carlo", "B12 — Probabilitas",
        "Monte Carlo: Ketika Rumus Menyerah,<br/>Simulasi Berbicara",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b11-lln-clt", "← B11"), ("b13-vasicek", "Next: B13"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>prinsip Monte Carlo</strong>: ekspektasi = rata-rata simulasi (LLN beraksi).</li>"
        "<li>Menghitung <strong>standard error Monte Carlo</strong> " + TI(r"\\sigma/\\sqrt{N}") + " dan menentukan N.</li>"
        "<li>Menerapkan Monte Carlo untuk <strong>integral, VaR, dan harga opsi</strong> sederhana.</li>"
        "<li>Mengenal <strong>variance reduction</strong> (antithetic, control variate) dan kapan Monte Carlo <em>tidak</em> cocok.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Menghitung π dengan Hujan Beras?")
    L.raw('<div className="story"><p>Tempel kertas 2×2 m di dinding, gambar lingkaran diameter 2 m di dalamnya. Lempar 10.000 butir beras acak ke kertas. Hitung yang jatuh di dalam lingkaran: misal 7.854. Maka π ≈ 4 × 7854/10000 = <strong>3,1416</strong>.</p>'
        "<p>Kedengarannya konyol — tapi ini <strong>metode Monte Carlo</strong>: menjawab pertanyaan deterministik (berapa π?) dengan <em>acak</em>. Prinsipnya: peluang butir jatuh di lingkaran = luas lingkaran / luas kertas = π/4 — dan LLN (B11) menjamin frekuensi → peluang.</p>"
        "<p>Di keuangan: harga opsi eksotik, VaR portofolio kompleks, ECL dengan banyak skenario — semua yang <em>rumusnya tidak ada atau terlalu sulit</em> — dijawab Monte Carlo. Industri berjalan di atasnya.</p></div>")

    L.sec("prinsip", "Prinsip — LLN yang Dipekerjakan")
    L.p("Banyak masalah = menghitung ekspektasi " + TI(r"E[g(X)]") + " yang integralnya sulit. Monte Carlo:")
    L.p(T(r"E[g(X)] \\approx \\frac{1}{N}\\sum_{i=1}^{N} g(X_i), \\quad X_i \\text{ sampel acak}"))
    L.p("Ini <strong>LLN (B11)</strong> yang dipekerjakan: rata-rata simulasi → ekspektasi. <strong>Error-nya:</strong>")
    L.p(T(r"SE_{MC} = \\frac{\\sigma_g}{\\sqrt{N}}"))
    L.p("dengan " + TI(r"\\sigma_g") + " = SD dari " + TI(r"g(X)") + ". <strong>Contoh π:</strong> tiap butir ~ Bernoulli(p=π/4); " + TI(r"\\sigma_g = \\sqrt{p(1-p)} \\approx 0{,}41") + "; N=10.000 → SE ≈ 0,0041 → π ≈ 3,1416 ± 0,016 (95%).")
    L.p("<strong>Kepribadian:</strong> Monte Carlo adalah &ldquo;pekerja kasar yang jujur&rdquo; — tidak pintar (error turun lambat, 1/√N), tapi tidak pernah berbohong tentang errornya dan bisa mengerjakan <em>apapun</em> yang bisa disimulasikan.")
    L.raw(tip("Rumus menentukan N: mau error &lt; ε dengan 95% keyakinan? " + TI("N \\approx (1{,}96\\,\\sigma_g/\\varepsilon)^2") + ". Untuk π ± 0,001: N ≈ 650.000. Pajak √n lagi — Monte Carlo mahal untuk presisi tinggi, murah untuk jawaban kasar yang cepat."))
    L.raw(myth("Makin banyak simulasi = makin akurat, tanpa batas.",
        "Akurat iya, tapi error hanya turun 1/√N: 100x simulasi = 10x presisi. Dari 10 ribu ke 1 juta simulasi (100x komputasi) error cuma turun 10x. Untuk presisi tinggi, <strong>variance reduction</strong> (di bawah) jauh lebih murah daripada brute force N."))

    L.sec("aplikasi", "Tiga Aplikasi Klasik")
    L.h3("1. Integral sulit")
    L.p(T(r"\\int_0^1 e^{-x^2} dx = E[e^{-U^2}],\\ U \\sim \\mathrm{Uniform}(0,1)"))
    L.p("Sampel U acak, rata-ratakan " + TI(r"e^{-U^2}") + " — selesai. (Untuk integral dimensi tinggi, Monte Carlo <em>mengalahkan</em> metode grid: error 1/√N tak peduli dimensi!)")
    L.h3("2. VaR portofolio (topik E13/MR3)")
    L.p("Simulasikan N skenario return (dengan korelasi/copula yang benar!), hitung P&L tiap skenario, ambil <strong>kuantil 5%</strong> = VaR 95%. Tidak butuh rumus — butuh model simulasi yang jujur.")
    L.h3("3. Harga opsi (topik E10–E11)")
    L.p("Opsi call Eropa: payoff = max(S_T − K, 0). Simulasikan " + TI(r"S_T") + " (misal GBM, B15), rata-ratakan payoff yang didiskon:")
    L.p(T(r"C \\approx e^{-rT}\\, \\frac{1}{N}\\sum_{i=1}^{N} \\max(S_T^{(i)} - K,\\, 0)"))
    L.raw(tip("Pola universal Monte Carlo: <strong>(1)</strong> tulis yang dicari sebagai ekspektasi; <strong>(2)</strong> sampel dari distribusinya; <strong>(3)</strong> rata-ratakan; <strong>(4)</strong> laporkan SE = σ/√N. Empat langkah ini menyelesaikan ribuan masalah."))

    L.sec("vr", "Variance Reduction — Bekerja Lebih Cerdas")
    L.ul([
        "<strong>Antithetic variates:</strong> tiap sampel Z dipasangkan dengan −Z — saling mengkansel noise. Sering memangkas varians 2–10x, hampir gratis.",
        "<strong>Control variate:</strong> jika tahu E[h(X)] analitik dan h mirip g, simulasikan g−h (varians kecil) lalu tambah E[h].",
        "<strong>Importance sampling:</strong> sampel lebih banyak di wilayah penting (ekor!) — wajib untuk kejadian langka; jika tidak, 1 juta simulasi pun tak menyentuh ekor.",
    ])
    L.p("<strong>Kapan Monte Carlo TIDAK cocok:</strong> butuh presisi sangat tinggi (pakai metode deterministik/analitik), dimensi rendah + fungsi mulus (kuadratur lebih cepat), atau kejadian super-langka tanpa importance sampling.")
    L.raw(myth("Monte Carlo = asal simulasi banyak-banyak.",
        "Simulasi tanpa desain = pemborosan. Seed tidak di-set (tidak reproducible!), tanpa SE (tidak tahu error), tanpa variance reduction (lambat 100x), model simulasi salah (copula Gaussian untuk krisis — B10!). Monte Carlo yang profesional = desain eksperimen, bukan brute force."))

    L.chart(
        data=[{"x": [100, 1000, 10000, 100000], "y": [0.041, 0.013, 0.0041, 0.0013],
               "type": "scatter", "mode": "lines+markers", "name": "SE Monte Carlo untuk π",
               "line": {"color": "#2a7de1"}}],
        title="Error Monte Carlo: Turun 1/√N (Lambat tapi Pasti)",
        layout={"xaxis": {"title": "N (simulasi, skala log)", "type": "log"}, "yaxis": {"title": "Standard error", "type": "log"}, "showlegend": False},
        cara="Skala log-log: garis lurus dengan kemiringan −1/2 — ciri 1/√N.",
        interpretasi="Dari 100 ke 100.000 simulasi (1000x komputasi), error turun 30x (bukan 1000x). <strong>Keputusan praktis:</strong> butuh 1 digit presisi → Monte Carlo murah; butuh 6 digit → pikir ulang (analitik/variance reduction). Pilih N dari rumus error, bukan dari &ldquo;angka bulat yang enak&rdquo;.")

    L.chart(
        data=[{"x": ["Tanpa VR", "Antithetic", "Control variate"],
               "y": [1.0, 0.35, 0.12], "type": "bar",
               "marker": {"color": ["#94a3b8", "#2a7de1", "#34a853"]},
               "text": ["1,0x", "0,35x", "0,12x"], "textposition": "outside"}],
        title="Variance Reduction: Varians Relatif (ilustrasi)",
        layout={"yaxis": {"title": "Varians relatif terhadap MC biasa"}, "showlegend": False},
        cara="Batang = varians estimator relatif terhadap Monte Carlo polos untuk masalah yang sama.",
        interpretasi="Antithetic memangkas ~3x, control variate ~8x — <strong>setara menambah simulasi 8x lipat tanpa biaya komputasi tambahan</strong>. Pelajaran: satu jam memikirkan variance reduction > satu hari menambah N.")

    L.sec("lab1", "🔬 Lab 1: Hitung π dengan Beras Digital")
    L.lab("Lab 1 — Monte Carlo Klasik",
        "Lempar titik acak ke kotak [−1,1]², hitung proporsi dalam lingkaran. Lihat error menyusut 1/√N.",
        'import random, math\nrandom.seed(123)\n\ndef mc_pi(N):\n    dalam = sum(1 for _ in range(N)\n                if (lambda x, y: x*x + y*y <= 1)(random.uniform(-1,1), random.uniform(-1,1)))\n    p = dalam / N\n    se = 4 * math.sqrt(p*(1-p)/N)  # SE untuk 4*p\n    return 4*p, se\n\nfor N in [100, 1_000, 10_000, 100_000]:\n    est, se = mc_pi(N)\n    print(f"N={N:>7}: π ≈ {est:.4f} ± {1.96*se:.4f}  (error {(est-math.pi):+.4f})")\nprint(f"\\nπ asli = {math.pi:.4f}")\nprint("\\nCoba: N=1_000_000 (lambat?). Bandingkan waktu vs presisi.")',
        "Perhatikan error ≈ SE yang diprediksi — Monte Carlo selalu jujur tentang ketelitiannya sendiri.")

    L.sec("lab2", "🔬 Lab 2: VaR Portofolio via Monte Carlo")
    L.lab("Lab 2 — VaR 95% Satu Saham",
        "Saham Rp10.000, return harian ~ Normal(μ=0,05%, σ=2%). Simulasikan 50.000 hari, hitung VaR 95% (kerugian maksimum yang &ldquo;wajar&rdquo;).",
        'import random, math, statistics\nrandom.seed(124)\nS0, mu, sigma, N = 10_000, 0.0005, 0.02, 50_000\n# S1 = S0 * exp(return); return ~ Normal(mu, sigma)\npl = [S0*math.exp(random.gauss(mu, sigma)) - S0 for _ in range(N)]\npl_sorted = sorted(pl)\nvar95 = -pl_sorted[int(0.05*N)]  # kerugian pada kuantil 5%\nes = -statistics.mean(pl_sorted[:int(0.05*N)])  # Expected Shortfall\nprint(f"VaR 95% (1 hari) = Rp{var95:,.0f}")\nprint(f"ES 95% (1 hari)  = Rp{es:,.0f}  (rata-rata kerugian JIKA tembus VaR)")\nprint(f"P(rugi > Rp500)  = {sum(1 for x in pl if x < -500)/N:.2%}")\nprint("\\nCoba: sigma=0.04 (2x lipat). VaR naik berapa? (tidak 2x persis!)")',
        "VaR = kuantil, ES = rata-rata ekor. Keduanya dari SATU simulasi — dan keduanya butuh model return yang jujur (Normal? t? — B7!).")

    L.sec("peta", "🗺️ Peta Keputusan: Kapan Monte Carlo")
    L.decision("1", "Ekspektasi/integral tanpa rumus tertutup → <strong>Monte Carlo</strong>",
        "Payoff eksotik, portofolio kompleks, dimensi tinggi.",
        kenapa="Empat langkah universal; error 1/√N tak peduli dimensi.",
        contoh="Opsi Asia, VaR multi-aset.")
    L.decision("2", "Butuh presisi → <strong>hitung N dari rumus error</strong>",
        "Ada target toleransi ε.",
        kenapa="N ≈ (1,96σ/ε)² — jangan asal 10.000 atau 1 juta.",
        contoh="π ± 0,001 → N ≈ 650 ribu.")
    L.decision("3", "Simulasi lambat / N mahal → <strong>variance reduction dulu</strong>",
        "Tiap sampel mahal (model kompleks).",
        kenapa="Antithetic/control variate = &ldquo;N gratis&rdquo;.",
        contoh="Pricing portofolio derivatif.")
    L.decision("4", "Kejadian langka (ekor) → <strong>importance sampling</strong>",
        "P(ekstrem) kecil — MC polos tak menyentuh.",
        kenapa="Sampel difokuskan ke wilayah penting, lalu dikoreksi bobotnya.",
        contoh="P(kerugian > Rp10 M) dengan model berekor tebal.")
    L.decision("5", "Ada rumus analitik eksak &amp; murah → <strong>jangan Monte Carlo</strong>",
        "Opsi Eropa standar (Black-Scholes), integral 1D mulus.",
        kenapa="Analitik: instan &amp; presisi mesin. MC: lambat &amp; ber-noise.",
        contoh="Jangan MC untuk Black-Scholes standar — pakai rumus.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Tulis target sebagai <strong>ekspektasi</strong> → sampel → rata-rata → SE.</li>"
        "<li>Selalu laporkan <strong>SE = σ/√N</strong> — MC tanpa error bar = setengah bohong.</li>"
        "<li>Set <strong>seed</strong> — reproducibility bukan opsional.</li>"
        "<li>Model simulasinya harus jujur (distribusi + copula) — MC hanya sebaik modelnya.</li></ol>"))

    L.sec("case", "📋 Mini-Case: ECL dengan 3 Skenario Makro")
    L.raw(callout("<p>IFRS 9/PSAK 71 mewajibkan ECL = rata-rata tertimbang skenario: baseline (50%), adverse (30%), severe (20%). Bank punya model PD bersyarat makro — tapi distribusi makro kontinu, bukan 3 titik.</p>"
        "<p><strong>Pertanyaan:</strong> (a) Bagaimana Monte Carlo memperbaiki &ldquo;3 skenario&rdquo;? (b) Apa risikonya?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) <strong>MC mengintegrasikan seluruh distribusi makro:</strong> sampel 10.000 path makro (GDP, unemployment) dari distribusi forecast → hitung PD &amp; ECL tiap path → rata-ratakan. Ini menghilangkan &ldquo;loncatan&rdquo; antar 3 skenario diskret dan menangkap non-linearitas (Jensen, B5!). ECL_3skenario bisa bias jika hubungan makro→PD cembung.</p>"
        "<p>(b) <strong>Risiko:</strong> (1) distribusi forecast makro harus jujur (bukan Normal jika resesi berekor); (2) korelasi antar variabel makro (copula!); (3) 10.000 path × portofolio besar = komputasi berat → butuh variance reduction atau surrogate model. <strong>Pelajaran:</strong> MC memindahkan masalah dari &ldquo;rumus&rdquo; ke &ldquo;kualitas model simulasi&rdquo; — tetap butuh B7–B10 yang benar.</p>")))

    L.quiz("Prinsip Monte Carlo untuk E[g(X)] adalah…",
        ["Integral analitik", "Rata-rata g(Xi) dari sampel acak (LLN)", "Tebakan", "Regresi"],
        1, "Benar: LLN dipekerjakan — rata-rata simulasi → ekspektasi.")
    L.quiz("SE Monte Carlo = σ/√N. Untuk error 10x lebih kecil, N harus…",
        ["10x", "100x", "1000x", "Tetap"],
        1, "Benar: pajak akar kuadrat — 100x komputasi untuk 10x presisi.")
    L.quiz("Kapan sebaiknya TIDAK pakai Monte Carlo?",
        ["VaR multi-aset", "Opsi eksotik", "Ada rumus analitik murah & eksak (Black-Scholes standar)", "Integral 10 dimensi"],
        2, "Benar: jangan bayar noise & waktu untuk yang bisa eksak instan.")
    L.quiz("Untuk kejadian langka (ekor), teknik yang wajib…",
        ["Antithetic saja", "Importance sampling", "Seed besar", "N kecil"],
        1, "Benar: MC polos hampir tak pernah menyentuh ekor — sampel harus difokuskan lalu dikoreksi.")
    L.quiz("Monte Carlo tanpa SE yang dilaporkan…",
        ["Tetap valid", "Setengah bohong — tidak tahu ketelitiannya", "Lebih cepat", "Disyaratkan"],
        1, "Benar: kejujuran MC = ia tahu errornya sendiri. Tanpa SE, angka MC = angka misterius.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Prinsip:</strong> " + TI(r"E[g(X)] \\approx \\frac{1}{N}\\sum g(X_i)") + " — LLN yang dipekerjakan.</li>"
        "<li><strong>Error:</strong> SE = σ/√N — lambat tapi pasti; tentukan N dari target error.</li>"
        "<li><strong>Pola:</strong> tulis ekspektasi → sampel → rata-rata → SE. Untuk integral, VaR, opsi.</li>"
        "<li><strong>Variance reduction:</strong> antithetic, control variate, importance sampling — &ldquo;N gratis&rdquo;.</li>"
        "<li><strong>Jangan</strong> MC untuk yang ada rumus eksaknya; <strong>selalu</strong> set seed + laporkan SE; model harus jujur.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B13
def b13():
    L = Lesson("b13-vasicek", "B13 — Probabilitas",
        "Vasicek: Satu Faktor yang<br/>Menggerakkan Ribuan Kredit",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b12-monte-carlo", "← B12"), ("b14-markov-chain", "Next: B14"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>model satu faktor Vasicek</strong>: faktor sistemik + idiosinkratik.</li>"
        "<li>Menurunkan <strong>distribusi kerugian portofolio</strong> dan rumus kuantilnya (VaR kredit).</li>"
        "<li>Menghubungkan Vasicek ke <strong>korelasi aset</strong> " + TI(r"\\rho") + " dan copula Gaussian (B10).</li>"
        "<li>Menjelaskan peran Vasicek di <strong>Basel IRB</strong> (rumus modal) + batas-batasnya.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Mengapa 5% × 1.000 ≠ 50 Gagal?")
    L.raw('<div className="story"><p>B1 mengajarkan: 1.000 nasabah × PD 5% (independen) → ekspektasi 50 gagal, SD 6,9. Kenyataannya saat krisis 2008: <strong>200 gagal</strong> — 22 SD di atas mean! Model Binomial bilang &ldquo;mustahil&rdquo;.</p>'
        "<p>Yang salah: <strong>asumsi independen</strong>. Saat ekonomi runtuh, nasabah gagal <em>bareng</em> — ada <strong>faktor bersama</strong> (ekonomi makro) yang menggerakkan semua. Model Vasicek (1987) menangkap ini dengan satu faktor sistemik: tiap debitur punya &ldquo;kesehatan&rdquo; = campuran faktor ekonomi umum + nasib individual.</p>"
        "<p>Model ini begitu fundamental hingga menjadi <strong>basis rumus modal Basel II/III</strong> — setiap bank di dunia memakainya (atau variannya).</p></div>")

    L.sec("model", "Model Satu Faktor — Anatomi")
    L.p("Nilai aset (laten) debitur " + TI(r"i") + ":")
    L.p(T(r"X_i = \\sqrt{\\rho}\\,Y + \\sqrt{1-\\rho}\\,\\varepsilon_i"))
    L.ul([
        TI(r"Y \\sim N(0,1)") + ": <strong>faktor sistemik</strong> — ekonomi, sama untuk semua debitur.",
        TI(r"\\varepsilon_i \\sim N(0,1)") + ": <strong>idiosinkratik</strong> — nasib individual, independen antar debitur.",
        TI(r"\\rho") + ": <strong>korelasi aset</strong> — seberapa besar ekonomi menentukan nasib (0 = murni individual, 1 = semua bareng).",
    ])
    L.p("Default jika " + TI(r"X_i") + " jatuh di bawah ambang:")
    L.p(T(r"\\text{default} \\iff X_i < \\Phi^{-1}(PD)"))
    L.p("dengan " + TI(r"\\Phi^{-1}") + " = inverse cdf Normal. <strong>Mengapa ambang ini?</strong> Karena " + TI(r"P(X_i < \\Phi^{-1}(PD)) = PD") + " — konsisten dengan PD individual!")
    L.p("<strong>Kepribadian:</strong> Vasicek adalah &ldquo;orkestra satu dirigen&rdquo; — Y adalah dirigen (ekonomi), tiap debitur main notnya sendiri (" + TI(r"\\varepsilon_i") + ") tapi mengikuti tempo dirigen sebesar √ρ.")
    L.raw(tip("Perhatikan: " + TI(r"\\sqrt{\\rho}") + " dan " + TI(r"\\sqrt{1-\\rho}") + " memastikan Var(Xᵢ) = ρ + (1−ρ) = 1 — Xᵢ tetap Normal(0,1) marginal. Model ini <em>tidak mengubah</em> risiko individual (PD tetap!), hanya menambahkan <strong>korelasi</strong>. Elegan: satu parameter ρ mengubah segalanya."))
    L.raw(myth("Vasicek menaikkan ekspektasi kerugian.",
        "Tidak! E[loss] = PD × LGD × EAD tetap — sama seperti independen (linearitas B5). Yang berubah: <strong>distribusi</strong> kerugian — ekor kanan menggemuk. Modal (yang melindungi dari ekor) naik, ekspektasi tidak. Inilah beda &ldquo;expected loss&rdquo; vs &ldquo;unexpected loss&rdquo; (CR3)."))

    L.raw(myth("Korelasi aset (ρ) = korelasi default.",
        "Beda! ρ di Vasicek adalah korelasi <strong>nilai aset laten</strong> " + TI(r"(X_i)") + " — variabel kontinu yang selalu teramati dalam model. <strong>Korelasi default</strong> (korelasi indikator biner gagal/tidak) jauh lebih kecil dan tergantung PD: untuk PD=2%, ρ_aset=0,15 setara korelasi default hanya ~0,02! Mencampuradukkan keduanya = salah mengira &ldquo;default hampir independen&rdquo; padahal ρ_aset signifikan. Selalu tanyakan: korelasi <em>apa</em>?"))
    L.sec("distribusi", "Distribusi Kerugian Portofolio")
    L.p("Bersyarat pada Y (ekonomi diketahui), default antar debitur <strong>independen</strong> dengan:")
    L.p(T(r"p(Y) = P(\\text{default} \\mid Y) = \\Phi\\!\\left(\\frac{\\Phi^{-1}(PD) - \\sqrt{\\rho}\\,Y}{\\sqrt{1-\\rho}}\\right)"))
    L.p("Untuk portofolio besar homogen (LLN!), fraksi default → " + TI(r"p(Y)") + ". Karena " + TI(r"Y") + " acak, fraksi default punya <strong>distribusi</strong> — dan kuantilnya ada rumus tertutup:")
    L.p(T(r"q_\\alpha = \\Phi\\!\\left(\\frac{\\Phi^{-1}(PD) + \\sqrt{\\rho}\\,\\Phi^{-1}(\\alpha)}{\\sqrt{1-\\rho}}\\right)"))
    L.p("Ini <strong>VaR kredit</strong>: &ldquo;dengan keyakinan α, fraksi default ≤ q_α&rdquo;. <strong>Contoh:</strong> PD=2%, ρ=0,15, α=99,9%: " + TI(r"\\Phi^{-1}(0{,}02) = -2{,}05") + ", " + TI(r"\\Phi^{-1}(0{,}999) = 3{,}09") + ":")
    L.p(T(r"q_{99{,}9\\%} = \\Phi\\!\\left(\\frac{-2{,}05 + \\sqrt{0{,}15}\\times 3{,}09}{\\sqrt{0{,}85}}\\right) = \\Phi(-0{,}92) \\approx 17{,}9\\%"))
    L.p("Bandingkan: ekspektasi cuma 2%, tapi VaR 99,9% = <strong>17,9%</strong> — 9x lipat! Inilah mengapa modal bank besar: melindungi dari ekor korelasi.")
    L.raw(worked("📐 Intuisi rumus kuantil",
        "<p>Ambil skenario ekonomi buruk: Y = −3,09 (kuantil 0,1% terburuk — ingat: Y negatif = ekonomi buruk).</p>"
        "<p>" + TI(r"p(Y) = \\Phi\\left(\\frac{-2{,}05 - \\sqrt{0{,}15}\\times(-3{,}09)}{\\sqrt{0{,}85}}\\right) = \\Phi\\left(\\frac{-2{,}05+1{,}197}{0{,}922}\\right) = \\Phi(-0{,}925) \\approx 17{,}7\\%") + ".</p>"
        "<p>Di ekonomi sangat buruk, <strong>PD kondisional</strong> melonjak 2% → 17,7%. Rumus kuantil hanyalah &ldquo;balikkan&rdquo;: VaR pada keyakinan α = PD kondisional pada ekonomi seburuk kuantil 1−α. <strong>Satu faktor menghubungkan ekonomi makro ke kerugian portofolio.</strong></p>"))
    L.raw(tip("Basel IRB memakai rumus ini (dengan penyesuaian maturity & LGD) untuk menghitung <strong>modal minimum</strong>. ρ ditetapkan regulator per segmen (misal 0,12–0,24 untuk korporasi). Pahami rumus ini = pahami jantung regulasi modal kredit."))

    L.sec("batas", "Batas-batas yang Jujur")
    L.ul([
        "<strong>Struktur Gaussian</strong> (B10!): tanpa tail dependence — krisis ekstrem bisa lebih bergerombol dari prediksi.",
        "<strong>ρ konstan:</strong> korelasi aset berubah sepanjang siklus (correlation breakdown, B9).",
        "<strong>Portofolio homogen:</strong> dunia nyata heterogen (PD/LGD/EAD beda) — butuh Monte Carlo (B12) untuk yang heterogen.",
        "<strong>Satu faktor:</strong> ekonomi multi-dimensi (sektor, region) butuh multi-faktor.",
    ])
    L.p("<strong>Kepribadian jujur:</strong> Vasicek adalah &ldquo;model pertama yang benar arahnya&rdquo; — ia menangkap esensi (korelasi via faktor bersama) dengan elegan, tapi jangan jadikan kitab suci. Stress ρ, uji copula alternatif, dan Monte Carlo untuk portofolio heterogen.")

    L.chart(
        data=[{"x": [round(1+i*0.2,1) for i in range(41)],
               "y": [round(math.exp(-0.5*((1+i*0.2-5)/0.7)**2)/(0.7*math.sqrt(2*math.pi)),3) for i in range(41)],
               "type": "scatter", "mode": "lines", "name": "ρ=0 (sempit)",
               "line": {"color": "#2a7de1"}},
              {"x": [round(0+i*0.4,1) for i in range(51)],
               "y": [round(math.exp(-0.5*((0+i*0.4-5)/2.6)**2)/(2.6*math.sqrt(2*math.pi)),3) for i in range(51)],
               "type": "scatter", "mode": "lines", "name": "ρ=0,3 (melebar)",
               "line": {"color": "#ef4444"}}],
        title="Distribusi Fraksi Default: ρ=0 vs ρ=0,3 (PD=5%, sketsa)",
        layout={"xaxis": {"title": "Fraksi default (%)"}, "yaxis": {"title": "Densitas"}, "showlegend": True,
                "annotations": [
                    {"x": 5, "y": 0.45, "text": "Ekspektasi TETAP 5% keduanya", "showarrow": False}]},
        cara="Sketsa konseptual: dua kurva distribusi fraksi default untuk 1.000 debitur, PD=5%. Biru sempit (ρ=0), merah melebar (ρ=0,3).",
        interpretasi="Korelasi tidak menggeser pusat (ekspektasi tetap 5%!) — ia <strong>melebarkan</strong> distribusi dan <strong>menggemukkan ekor kanan</strong>. Dengan ρ=0,3, skenario &ldquo;15% gagal&rdquo; yang mustahil di model independen menjadi lumayan mungkin. <strong>Modal melindungi dari ekor — dan ekor ditentukan ρ.</strong>")

    L.sec("lab1", "🔬 Lab 1: Simulasi Vasicek — Lihat Ekor Menggemuk")
    L.lab("Lab 1 — Satu Faktor Beraksi",
        "Simulasikan 1.000 debitur, PD=5%. Bandingkan distribusi jumlah default untuk ρ=0 vs ρ=0,3.",
        'import random, math, statistics\nrandom.seed(131)\n\ndef sim_vasicek(n, pd, rho, trials=20000):\n    ambang = statistics.NormalDist().inv_cdf(pd)\n    sr, s1r = math.sqrt(rho), math.sqrt(1-rho)\n    hasil = []\n    for _ in range(trials):\n        Y = random.gauss(0, 1)  # faktor sistemik: SATU per trial\n        gagal = sum(1 for _ in range(n)\n                    if sr*Y + s1r*random.gauss(0, 1) < ambang)\n        hasil.append(gagal)\n    return hasil\n\nn, pd = 1000, 0.05\nfor rho in [0.0, 0.15, 0.3]:\n    h = sim_vasicek(n, pd, rho)\n    h.sort()\n    print(f"ρ={rho}: mean={statistics.mean(h):.0f}, VaR99%={h[int(0.99*len(h))]}, VaR99.9%={h[int(0.999*len(h))]}")\nprint("\\nMean sama (~50), tapi VaR meledak dengan ρ!")\nprint("Coba: rho=0.5. Berapa VaR99.9%?")',
        "Inilah inti modal Basel: <strong>unexpected loss</strong> (VaR − ekspektasi) tumbuh dengan ρ.")

    L.sec("lab2", "🔬 Lab 2: Verifikasi Rumus Kuantil Vasicek")
    L.lab("Lab 2 — Rumus vs Simulasi",
        "Hitung q_99,9% dari rumus tertutup, bandingkan dengan simulasi Lab 1.",
        'import math, statistics\nND = statistics.NormalDist()\npd, rho, alpha = 0.02, 0.15, 0.999\nq = ND.cdf((ND.inv_cdf(pd) + math.sqrt(rho)*ND.inv_cdf(alpha)) / math.sqrt(1-rho))\nprint(f"Rumus: q_99.9% = {q:.2%}")\nprint(f"Contoh: {q:.2%} dari 10.000 debitur = {q*10000:.0f} gagal (ekspektasi cuma 200!)")\nprint()\n# sensitivitas terhadap rho\nfor r in [0.05, 0.12, 0.15, 0.24, 0.4]:\n    qq = ND.cdf((ND.inv_cdf(pd) + math.sqrt(r)*ND.inv_cdf(alpha)) / math.sqrt(1-r))\n    print(f"  ρ={r:.2f} -> VaR99.9% = {qq:.2%}  (modal ∝ ini!)")\nprint("\\nKesimpulan: modal SANGAT sensitif terhadap ρ.")\nprint("Salah estimasi ρ sedikit -> modal salah besar. Itulah mengapa ρ di-stress.")',
        "Sensitivitas inilah alasan regulator menetapkan ρ (bukan bank) — dan mengapa validasi ρ krusial.")

    L.sec("peta", "🗺️ Peta Keputusan: Kapan Vasicek")
    L.decision("1", "Risiko kredit portofolio homogen besar → <strong>Vasicek analitik</strong>",
        "Ribuan debitur serupa; butuh VaR cepat &amp; rumus modal.",
        kenapa="Rumus kuantil tertutup — instan, transparan, basis Basel.",
        contoh="Modal IRB bank untuk portofolio korporasi.")
    L.decision("2", "Portofolio heterogen / multi-faktor → <strong>Monte Carlo multi-faktor</strong>",
        "PD/LGD/EAD bervariasi; sektor/region berbeda.",
        kenapa="Vasicek homogen terlalu menyederhanakan — simulasi lebih fleksibel.",
        contoh="ECL/stress test internal bank (B12).")
    L.decision("3", "Curiga tail dependence → <strong>copula non-Gaussian</strong>",
        "Krisis menunjukkan default lebih bergerombol dari prediksi Gaussian.",
        kenapa="Vasicek = struktur Gaussian (B10) — tanpa tail dependence.",
        contoh="Ganti ke copula t/Clayton untuk skenario krisis.")
    L.decision("4", "Butuh angka cepat untuk diskusi → <strong>ingat orde besarnya</strong>",
        "PD 2%, ρ 0,15 → VaR 99,9% ≈ 9x ekspektasi.",
        kenapa="Intuisi &ldquo;ekor ≈ 5–10x mean&rdquo; mencegah estimasi ngawur.",
        contoh="Sanity check hasil model internal.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Vasicek mengubah <strong>distribusi</strong>, bukan ekspektasi — modal melindungi ekor.</li>"
        "<li>ρ adalah parameter terpenting &amp; tersulit — selalu stress.</li>"
        "<li>Ingat struktur Gaussian-nya (B10): untuk krisis ekstrem, pertimbangkan tail dependence.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Kalibrasi ρ dari Data")
    L.raw(callout("<p>Bank punya 10 tahun data default tahunan portofolio UKM: rata-rata 3%, tapi tahun terburuk 11%. Model independen (Binomial) bilang P(≥11%) ≈ 0.</p>"
        "<p><strong>Pertanyaan:</strong> (a) Perkirakan ρ yang konsisten dengan data. (b) Apa bahaya mengkalibrasi ρ dari 10 tahun &ldquo;tenang&rdquo;?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) Cari ρ sehingga q_90% ≈ 11% (tahun terburuk dari 10 ≈ kuantil 90%): coba ρ=0,2 → q_90% = Φ((Φ⁻¹(0,03)+√0,2×1,28)/√0,8) = Φ((−1,88+0,57)/0,89) = Φ(−1,47) ≈ 7%. Kurang. ρ=0,35 → (−1,88+0,76)/0,81 = −1,39 → 8,2%. ρ=0,5 → (−1,88+0,91)/0,71 = −1,37 → 8,5%... Hmm, butuh ρ sangat tinggi atau model multi-faktor — <strong>data 10 titik tidak cukup untuk kalibrasi presisi!</strong> Inilah pesan sebenarnya: kalibrasi ρ dari deret pendek sangat tidak pasti.</p>"
        "<p>(b) <strong>10 tahun tenang tidak mengandung krisis</strong> — ρ terkalibrasi akan terlalu rendah (survivorship/period bias). Praktik benar: pakai ρ regulator (konservatif) + stress + data lintas siklus + benchmark antar bank. <strong>Pelajaran:</strong> parameter yang paling menentukan modal adalah yang paling sulit diestimasi — di sinilah konservatisme regulator berasal.</p>")))

    L.quiz("Dalam Vasicek, Y (faktor sistemik) berperan sebagai…",
        ["Nasib individual tiap debitur", "Ekonomi bersama yang menggerakkan semua debitur", "Tingkat bunga", "Jumlah debitur"],
        1, "Benar: Y sama untuk semua — sumber korelasi. εᵢ individual independen.")
    L.quiz("Vasicek mengubah ekspektasi kerugian portofolio?",
        ["Ya, menaikkan", "Tidak — hanya distribusinya (ekor menggemuk)", "Ya, menurunkan", "Menghapusnya"],
        1, "Benar: linearitas B5 — E[loss] tetap. Yang naik: VaR/modal (unexpected loss).")
    L.quiz("PD=2%, ρ=0,15: VaR 99,9% ≈ 17,9% vs ekspektasi 2%. Artinya…",
        ["Model salah", "Ekor 9x mean — modal melindungi dari korelasi, bukan dari rata-rata", "PD sebenarnya 17,9%", "Tidak mungkin"],
        1, "Benar: inilah inti modal kredit — unexpected loss dari korelasi.")
    L.quiz("Kelemahan struktural Vasicek terkait B10…",
        ["Terlalu rumit", "Struktur Gaussian tanpa tail dependence", "Tidak ada rumus", "Butuh data besar"],
        1, "Benar: seperti copula Gaussian — krisis ekstrem bisa lebih bergerombol.")
    L.quiz("ρ naik. Yang terjadi pada modal (VaR−ekspektasi)?",
        ["Turun", "Naik — ekor menggemuk", "Tetap", "Nol"],
        1, "Benar: modal ∝ ekor ∝ ρ. Salah estimasi ρ = salah modal besar.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Model:</strong> " + TI(r"X_i = \\sqrt{\\rho}\\,Y + \\sqrt{1-\\rho}\\,\\varepsilon_i") + " — satu faktor sistemik + idiosinkratik.</li>"
        "<li><strong>Default</strong> jika " + TI(r"X_i < \\Phi^{-1}(PD)") + " — PD individual tetap!</li>"
        "<li><strong>VaR kredit:</strong> " + TI(r"q_\\alpha = \\Phi\\left(\\frac{\\Phi^{-1}(PD)+\\sqrt{\\rho}\\,\\Phi^{-1}(\\alpha)}{\\sqrt{1-\\rho}}\\right)") + " — basis modal Basel.</li>"
        "<li><strong>Ekspektasi tetap, ekor menggemuk</strong> dengan ρ — modal melindungi unexpected loss.</li>"
        "<li><strong>Batas:</strong> Gaussian (tanpa tail dependence), ρ konstan, homogen — stress &amp; validasi selalu.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B14
def b14():
    L = Lesson("b14-markov-chain", "B14 — Probabilitas",
        "Markov Chain: Masa Depan<br/>Hanya Peduli Hari Ini",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b13-vasicek", "← B13"), ("b15-proses-stokastik", "Next: B15"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>sifat Markov</strong> dan matriks transisi.</li>"
        "<li>Menghitung distribusi <strong>n-langkah</strong> dengan pangkat matriks.</li>"
        "<li>Menemukan <strong>distribusi stasioner</strong> dan menafsirkannya.</li>"
        "<li>Menerapkan pada <strong>migrasi rating &amp; roll rate</strong> kredit.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;Nasabah Ini Bulan Depan di Mana?&rdquo;")
    L.raw('<div className="story"><p>Bank memantau status tiap kredit tiap bulan: <strong>Lancar → Telat → Macet → Lunas/Gagal</strong>. Data historis: dari 1.000 yang &ldquo;Telat 30 hari&rdquo; bulan ini, 600 kembali lancar, 300 tetap telat, 100 jadi macet bulan depan.</p>'
        "<p>Pertanyaan ajaib: <em>&ldquo;Dari 1.000 telat hari ini, berapa yang macet 6 bulan lagi?&rdquo;</em> Jawabannya tidak butuh simulasi rumit — cukup <strong>matriks transisi</strong> dipangkatkan 6. Dan lebih ajaib lagi: apapun kondisi awal, setelah lama, proporsi tiap status menuju <strong>distribusi stasioner</strong> — &ldquo;takdir jangka panjang&rdquo; portofolio.</p>"
        "<p>Markov chain = mesin untuk semua sistem &ldquo;status berpindah&rdquo;: rating kredit, cuaca, antrean, PageRank Google.</p></div>")

    L.sec("sifat", "Sifat Markov &amp; Matriks Transisi")
    L.p("<strong>Sifat Markov</strong> (memoryless untuk rantai):")
    L.p(T(r"P(X_{n+1} = j \\mid X_n = i, X_{n-1}, \\ldots) = P(X_{n+1} = j \\mid X_n = i) = P_{ij}"))
    L.p("&ldquo;Masa depan hanya peduli <strong>hari ini</strong>, bukan sejarah.&rdquo; <strong>Matriks transisi</strong> " + TI(r"P") + " berisi semua " + TI(r"P_{ij}") + " (baris = dari, kolom = ke; tiap baris jumlah = 1).")
    L.p("<strong>Contoh</strong> (status: Lancar, Telat, Macet):")
    L.table(["Dari \\ Ke", "Lancar", "Telat", "Macet"],
        [["Lancar", "0,95", "0,04", "0,01"],
         ["Telat", "0,60", "0,30", "0,10"],
         ["Macet", "0,10", "0,20", "0,70"]])
    L.p("<strong>Kepribadian:</strong> Markov chain adalah &ldquo;penumpang yang pelupa&rdquo; — ia hanya ingat stasiun saat ini untuk memutuskan stasiun berikutnya. Sederhana, tapi cukup untuk memodelkan sistem kompleks.")
    L.raw(tip("Cek kewarasan matriks: <strong>tiap baris jumlah = 1</strong> (dari satu status, pasti ke suatu status). Jika tidak = ada yang salah. Ini tes 5 detik yang menangkap banyak error."))

    L.sec("nlangkah", "n Langkah — Pangkat Matriks")
    L.p(T(r"P(X_{n} = j \\mid X_0 = i) = (P^n)_{ij}"))
    L.p("<strong>Contoh.</strong> Dari &ldquo;Telat&rdquo;, 2 bulan lagi di &ldquo;Macet&rdquo;? Hitung baris Telat × kolom Macet dari " + TI(r"P^2") + ":")
    L.p(T(r"(P^2)_{\\text{Telat}\\to\\text{Macet}} = 0{,}6\\times0{,}01 + 0{,}3\\times0{,}10 + 0{,}1\\times0{,}70 = 0{,}106"))
    L.p("Tiga jalur: Telat→Lancar→Macet (0,006), Telat→Telat→Macet (0,03), Telat→Macet→Macet (0,07). <strong>Distribusi vektor:</strong> " + TI(r"\\pi^{(n)} = \\pi^{(0)} P^n") + ".")
    L.raw(worked("📐 Contoh: 6 bulan lagi",
        "<p>Awal: 1.000 Telat → " + TI(r"\\pi^{(0)} = (0, 1, 0)") + ".</p>"
        "<p>" + TI(r"P^6") + " (hitung via lab): baris Telat ≈ (0,72; 0,13; 0,15).</p>"
        "<p>Prediksi: <strong>720 lancar, 130 telat, 150 macet</strong>. Satu perkalian matriks menjawab &ldquo;6 bulan lagi&rdquo;!</p>"))
    L.raw(myth("Pangkat matriks = pangkatkan tiap elemen.",
        "SALAH! " + TI(r"P^2") + " adalah <strong>perkalian matriks</strong> (jumlahkan semua jalur 2-langkah), bukan kuadrat per elemen. (P²)ᵢⱼ = Σₖ PᵢₖPₖⱼ — &ldquo;semua jalan dari i ke j via k&rdquo;. Ini inti Chapman-Kolmogorov."))

    L.sec("stasioner", "Distribusi Stasioner — Takdir Jangka Panjang")
    L.p(T(r"\\pi = \\pi P, \\qquad \\sum_i \\pi_i = 1"))
    L.p("&ldquo;Distribusi yang jika dicapai, tetap selamanya.&rdquo; Untuk rantai <strong>irreducible &amp; aperiodik</strong>, apapun awalnya → konvergen ke π (unik!).")
    L.p("<strong>Contoh.</strong> Selesaikan π = πP untuk matriks di atas: π ≈ <strong>(0,86; 0,08; 0,06)</strong>. Artinya: dalam jangka panjang, portofolio stabil di 86% lancar, 8% telat, 6% macet — <em>apapun</em> kondisi awal! (Cek via lab: P^50.)")
    L.p("<strong>Interpretasi bisnis:</strong> π adalah &ldquo;komposisi keseimbangan&rdquo; portofolio. Jika komposisi saat ini jauh dari π, ia akan &ldquo;melayang&rdquo; ke sana — prediksi struktural tanpa perlu forecast ekonomi!")
    L.raw(tip("Distribusi stasioner = <strong>eigenvector kiri</strong> dengan eigenvalue 1. Tapi jangan takut aljabar linear: untuk 3–5 status, selesaikan sistem linear biasa (atau iterasikan P^n sampai stabil — lab!)."))

    L.sec("rating", "Aplikasi: Migrasi Rating &amp; Roll Rate")
    L.ul([
        "<strong>Migrasi rating</strong> (AAA, AA, …, Default): matriks transisi tahunan dari data historis — fondasi <strong>CreditMetrics</strong> &amp; stress testing (MR7/CR16). Default = <strong>absorbing state</strong> (sekali masuk, tak keluar: baris = [0,…,1]).",
        "<strong>Roll rate</strong> (collection): status DPD per bulan — dipakai untuk prediksi &amp; strategi (ingat Lab B3!).",
        "<strong>Catatan jujur:</strong> transisi <strong>tidak stasioner</strong> — saat resesi, P(telat→macet) naik! Praktik benar: matriks <em>bersyarat rezim</em> (normal vs stress) atau time-varying.",
    ])
    L.raw(myth("Matriks transisi historis bisa dipakai mentah untuk forecast.",
        "Hanya jika dunia stasioner — padahal tidak. Matriks 2019 (tenang) meremehkan transisi buruk saat 2020. Solusi: <strong>dua matriks</strong> (baseline + stress), atau model transisi sebagai fungsi variabel makro. Markov memberi kerangka; isinya harus forward-looking."))

    L.chart(
        data=[{"x": [0, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20],
               "y": [0, 0.10, 0.106, 0.115, 0.121, 0.126, 0.13, 0.136, 0.14, 0.145, 0.147],
               "type": "scatter", "mode": "lines+markers", "name": "P(Telat → Macet dalam n bulan)",
               "line": {"color": "#2a7de1"}}],
        title="Dari Telat ke Macet: Konvergensi ke Stasioner",
        layout={"xaxis": {"title": "n (bulan)"}, "yaxis": {"title": "Peluang", "tickformat": ".0%"}, "showlegend": False},
        cara="Sumbu X = horizon bulan; sumbu Y = peluang berada di status Macet setelah n bulan, mulai dari Telat.",
        interpretasi="Naik cepat di awal (jalur langsung), lalu melandai menuju ~15% (komponen stasioner untuk yang mulai dari Telat). <strong>Pelajaran:</strong> risiko kumulatif tumbuh dengan horizon tapi <em>melambat</em> — dan batasnya diketahui (stasioner). Untuk pricing/CKPN multi-periode, inilah mesinnya.")

    L.chart(
        data=[{"x": ["Lancar", "Telat", "Macet"], "y": [0.86, 0.08, 0.06], "type": "bar",
               "name": "Stasioner", "marker": {"color": "#2a7de1"}},
              {"x": ["Lancar", "Telat", "Macet"], "y": [0.5, 0.3, 0.2], "type": "bar",
               "name": "Awal (krisis)", "marker": {"color": "#e8a838"}}],
        title="Awal Krisis vs Takdir Jangka Panjang (Stasioner)",
        layout={"barmode": "group", "yaxis": {"title": "Proporsi", "tickformat": ".0%"}, "xaxis": {"title": "Status"}},
        cara="Kuning = komposisi saat krisis (banyak telat/macet); biru = distribusi stasioner (keseimbangan).",
        interpretasi="Meski mulai dari krisis (50% lancar), rantai &ldquo;menarik&rdquo; kembali ke 86% lancar — <strong>jika</strong> matriks transisi tetap (asumsi besar!). Inilah dua sisi stasioner: ia memberi jangkar prediksi, tapi jangkarnya hanya sekuat asumsi stasioneritas matriks.")

    L.sec("lab1", "🔬 Lab 1: Pangkat Matriks & Stasioner dari Nol")
    L.lab("Lab 1 — Markov Chain Murni Python",
        "Definisikan matriks transisi, hitung P^n dan distribusi stasioner via iterasi. Tanpa numpy!",
        'P = [[0.95, 0.04, 0.01],\n     [0.60, 0.30, 0.10],\n     [0.10, 0.20, 0.70]]\nstatus = ["Lancar", "Telat", "Macet"]\n\ndef matmul(A, B):\n    n = len(A)\n    return [[sum(A[i][k]*B[k][j] for k in range(n)) for j in range(n)] for i in range(n)]\n\ndef matpow(M, n):\n    # identitas\n    R = [[1.0 if i==j else 0.0 for j in range(len(M))] for i in range(len(M))]\n    for _ in range(n):\n        R = matmul(R, M)\n    return R\n\nP2 = matpow(P, 2)\nprint(f"P(Telat->Macet, 2 bln) = {P2[1][2]:.3f}")\nP50 = matpow(P, 50)\nprint("Baris P^50 (harus SAMA semua -> stasioner):")\nfor i, row in enumerate(P50):\n    print(f"  dari {status[i]:>6}: " + " ".join(f"{v:.3f}" for v in row))\nprint("\\nCoba: ubah P[1] (baris Telat) jadi [0.4,0.3,0.3] (resesi).")\nprint("Bagaimana stasioner berubah? (sensitivitas!)")',
        "Semua baris P^50 sama = bukti konvergensi ke π. Ubah satu baris, lihat π bergeser — itulah <strong>stress testing matriks</strong>.")

    L.sec("lab2", "🔬 Lab 2: Roll Rate 12 Bulan — Prediksi Collection")
    L.lab("Lab 2 — Proyeksi Portofolio Telat",
        "1.000 akun Telat hari ini. Proyeksikan komposisi tiap bulan selama 12 bulan.",
        'P = [[0.95, 0.04, 0.01],\n     [0.60, 0.30, 0.10],\n     [0.10, 0.20, 0.70]]\n\ndef vec_mul(v, M):\n    return [sum(v[i]*M[i][j] for i in range(len(v))) for j in range(len(M))]\n\npi = [0.0, 1000.0, 0.0]  # mulai: 1000 Telat\nprint(f"Bulan  0: Lancar={pi[0]:6.0f} Telat={pi[1]:6.0f} Macet={pi[2]:6.0f}")\nfor b in range(1, 13):\n    pi = vec_mul(pi, P)\n    print(f"Bulan {b:>2}: Lancar={pi[0]:6.0f} Telat={pi[1]:6.0f} Macet={pi[2]:6.0f}")\nprint("\\nCoba: skenario stress — P Macet->Macet 0.7->0.9 (susah sembuh).")\nprint("Bandingkan Macet bulan 12. Itulah nilai stress test!")',
        "Dua skenario (baseline vs stress) = inti <strong>IFRS 9 multi-skenario</strong> untuk transisi status.")

    L.sec("peta", "🗺️ Peta Keputusan: Kapan Markov Chain")
    L.decision("1", "Sistem berpindah status diskret → <strong>Markov chain</strong>",
        "Status jelas (rating, DPD bucket); transisi hanya peduli status kini.",
        kenapa="Sifat Markov menyederhanakan drastis: cukup matriks P.",
        contoh="Migrasi rating, roll rate collection.")
    L.decision("2", "Butuh horizon n → <strong>pangkatkan matriks</strong>",
        "Pertanyaan &ldquo;n periode lagi&rdquo;.",
        kenapa="(P^n)ᵢⱼ = semua jalur n-langkah. Chapman-Kolmogorov.",
        contoh="&ldquo;6 bulan lagi berapa yang macet?&rdquo;")
    L.decision("3", "Butuh &ldquo;takdir jangka panjang&rdquo; → <strong>stasioner π</strong>",
        "Keseimbangan struktural portofolio.",
        kenapa="π = πP; jangkar prediksi tanpa forecast makro.",
        contoh="Komposisi keseimbangan portofolio kredit.")
    L.decision("4", "Ada absorbing state (Default/Lunas) → <strong>analisis absorbsi</strong>",
        "Status yang tak bisa keluar.",
        kenapa="Fokus ke <em>waktu sampai absorbsi</em> &amp; peluang absorbsi — bukan stasioner.",
        contoh="P(default sebelum lunas) untuk vintage.")
    L.decision("5", "Dunia tidak stasioner → <strong>matriks bersyarat rezim</strong>",
        "Transisi berubah saat krisis.",
        kenapa="Satu matriks historis = satu rezim. Butuh baseline + stress.",
        contoh="Matriks 2019 vs 2020 untuk stress test.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Cek baris jumlah = 1. Selalu.</li>"
        "<li>&ldquo;n lagi&rdquo; → P^n. &ldquo;Jangka panjang&rdquo; → π.</li>"
        "<li>Absorbing state → analisis waktu absorbsi, bukan stasioner.</li>"
        "<li>Stress matriksnya, bukan cuma pakai historis.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Vintage 2024 — Kapan Macetnya Puncak?")
    L.raw(callout("<p>Vintage kredit 2024: 5.000 akun, semua &ldquo;Lancar&rdquo; di bulan 0. Matriks baseline seperti di atas. Direksi tanya: <em>&ldquo;Kapan jumlah Macet mencapai puncak, dan berapa? Kami siapkan tim collection.&rdquo;</em></p>"
        "<p><strong>Pertanyaan:</strong> (a) Dengan Lab 2 (mulai dari Lancar), bulan berapa Macet maksimum? (b) Mengapa tidak monoton naik?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) Jalankan Lab 2 dengan pi awal [5000,0,0]: Macet naik terus awalnya, mencapai puncak sekitar <strong>bulan 18–24</strong> (~600–700 akun), lalu melandai menuju stasioner (6% × 5000 = 300... tapi ingat Macet bisa &ldquo;sembuh&rdquo; 10% di matriks ini — jika Macet absorbing, ia naik monoton ke 100%!).</p>"
        "<p>(b) <strong>Tidak monoton</strong> karena Macet bukan absorbing di matriks ini (10% kembali lancar/bulan) — ada arus masuk (dari Telat) dan arus keluar (sembuh). Puncak = saat arus masuk = arus keluar. <strong>Pelajaran modeling:</strong> definisi status menentukan dinamika! Jika &ldquo;Macet&rdquo; didefinisikan absorbing (write-off), kurvanya monoton naik — keputusan definisi = keputusan hasil. Selalu tanyakan definisi status sebelum percaya proyeksi.</p>")))

    L.quiz("Sifat Markov artinya…",
        ["Masa depan tergantung seluruh sejarah", "Masa depan hanya tergantung status kini", "Tidak ada keacakan", "Matriks harus simetris"],
        1, "Benar: P(X_{n+1}|X_n, sejarah) = P(X_{n+1}|X_n). Pelupa tapi powerful.")
    L.quiz("(P²)ᵢⱼ dihitung dengan…",
        ["Kuadrat tiap elemen", "Perkalian matriks: Σₖ PᵢₖPₖⱼ (semua jalur 2-langkah)", "Pᵢⱼ × 2", "Akar matriks"],
        1, "Benar: Chapman-Kolmogorov — jumlahkan semua jalan via status antara.")
    L.quiz("Distribusi stasioner π memenuhi…",
        ["π = Pπ", "π = πP dan Σπᵢ=1", "π = P²", "π = 0"],
        1, "Benar: eigenvector kiri eigenvalue 1 — &ldquo;takdir jangka panjang&rdquo;.")
    L.quiz("Status Default sebagai absorbing state artinya…",
        ["Bisa keluar lagi", "Sekali masuk tak keluar (baris = [0,…,1])", "Tidak pernah dimasuki", "Transisinya acak"],
        1, "Benar: menyerap. Analisis fokus ke waktu/peluang absorbsi.")
    L.quiz("Kelemahan memakai matriks historis mentah…",
        ["Tidak ada", "Transisi tidak stasioner — krisis mengubahnya; butuh skenario stress", "Matriks terlalu kecil", "Terlalu akurat"],
        1, "Benar: matriks 2019 ≠ matriks 2020. Butuh baseline + stress / bersyarat rezim.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Sifat Markov:</strong> masa depan | kini — cukup matriks transisi P (baris jumlah 1).</li>"
        "<li><strong>n langkah:</strong> " + TI(r"(P^n)_{ij}") + " via perkalian matriks (semua jalur).</li>"
        "<li><strong>Stasioner:</strong> " + TI(r"\\pi = \\pi P") + " — takdir jangka panjang, jangkar prediksi.</li>"
        "<li><strong>Aplikasi:</strong> migrasi rating, roll rate; absorbing state untuk default.</li>"
        "<li><strong>Jangan</strong> pakai matriks historis mentah — stress per rezim; <strong>jangan</strong> kuadratkan elemen (kalikan matriks!).</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B15
def b15():
    L = Lesson("b15-proses-stokastik", "B15 — Probabilitas",
        "Proses Stokastik: Random Walk<br/>hingga GBM",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b14-markov-chain", "← B14"), ("b16-heavy-tails-evt", "Next: B16"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>random walk</strong> dan sifat varians ∝ t.</li>"
        "<li>Menurunkan <strong>Brownian motion</strong> sebagai limit random walk.</li>"
        "<li>Menjelaskan <strong>GBM</strong> sebagai model harga saham + rumusnya.</li>"
        "<li>Membedakan <strong>OU</strong> (mean-reverting) vs <strong>Poisson process</strong> (lompatan).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Pemabuk dan Harga Saham")
    L.raw('<div className="story"><p>Seorang pemabuk melangkah acak: tiap detik ke kiri atau kanan dengan peluang 50:50. Setelah 10.000 langkah, di mana dia? Jawabannya mengejutkan: <strong>jarak tipikalnya ~100 langkah dari awal</strong> — bukan 0, bukan 10.000.</p>'
        "<p>Ini <strong>random walk</strong> — dan Louis Bachelier (1900!) menyadari harga saham berperilaku sama: tiap tick naik/turun acak, akumulasinya = random walk. Dari ide sesederhana pemabuk ini lahir <strong>Brownian motion</strong>, <strong>GBM</strong> (fondasi Black-Scholes!), dan seluruh pemodelan harga modern.</p>"
        "<p>Lesson ini menaikkan tangga: diskret → kontinu, aditif → multiplikatif.</p></div>")

    L.sec("rw", "Random Walk — Fondasi Diskret")
    L.p(T(r"S_n = X_1 + X_2 + \\cdots + X_n, \\quad X_i = \\pm 1"))
    L.ul([
        TI(r"E[S_n] = 0") + ": ekspektasi tetap di awal (fair game).",
        TI(r"\\mathrm{Var}(S_n) = n") + ": varians <strong>tumbuh linear</strong> dengan waktu!",
        TI(r"\\text{SD}(S_n) = \\sqrt{n}") + ": jarak tipikal ~ √n — 10.000 langkah → ~100.",
    ])
    L.p("<strong>Kepribadian:</strong> random walk adalah &ldquo;difusi ketidaktahuan&rdquo; — makin lama, makin tidak tahu di mana (varians ∝ t), tapi ekspektasi tidak bias ke mana-mana. Akar kuadrat lagi: untuk 2x jarak tipikal butuh 4x waktu.")
    L.raw(tip("Aturan √t ada di mana-mana: SD return tahunan = SD harian × √252. Volatilitas &ldquo;diskalakan&rdquo; dengan akar waktu — BUKAN linear! Ini sebabnya VaR 10-hari = VaR 1-hari × √10 (aturan Basel)."))

    L.sec("bm", "Brownian Motion — Limit Kontinu")
    L.p("Perkecil langkah (→0) dan percepat (→∞) dengan skala tepat → <strong>gerak Brown standar</strong> " + TI(r"W_t") + ":")
    L.ul([
        TI(r"W_0 = 0") + ", jalur kontinu,",
        "Inkremen independen: " + TI(r"W_t - W_s \\sim N(0, t-s)") + " — <strong>varians = selang waktu</strong>,",
        TI(r"E[W_t] = 0,\\ \\mathrm{Var}(W_t) = t") + ".",
    ])
    L.p("<strong>Mengapa penting?</strong> Brownian motion adalah &ldquo;atom&rdquo; proses kontinu — seperti Bernoulli untuk diskret. SDE (stochastic differential equation) ditulis sebagai:")
    L.p(T(r"dX_t = \\mu\\,dt + \\sigma\\,dW_t"))
    L.p("&ldquo;Perubahan = tren (μ·dt) + guncangan acak (σ·dW)&rdquo; — template untuk SEMUA model difusi.")
    L.raw(myth("Jalur Brownian bisa diprediksi jika tahu polanya.",
        "Jalur Brown kontinu tapi <strong>tidak terdiferensiasi di titik manapun</strong> — bergerigi di semua skala (fraktal!). &ldquo;Tren&rdquo; yang kamu lihat di grafik harga jangka pendek hampir selalu ilusi random walk. Inilah alasan teknikal analisis murni pola sangat dipertanyakan."))

    L.sec("gbm", "GBM — Model Harga Saham")
    L.p("Harga tidak boleh negatif dan return-nya yang acak (bukan perubahan absolut) → pakai <strong>eksponensial dari Brown</strong>:")
    L.p(T(r"dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t"))
    L.p("Solusinya (Itô):")
    L.p(T(r"S_t = S_0\\, \\exp\\!\\left(\\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right)t + \\sigma W_t\\right)"))
    L.ul([
        TI(r"\\mu") + ": drift (return ekspektasi),",
        TI(r"\\sigma") + ": volatilitas,",
        TI(r"-\\frac{1}{2}\\sigma^2") + ": <strong>koreksi Itô</strong> — Jensen (B5!) beraksi: E[S_t] = S_0·e^(μt), tapi median = S_0·e^((μ−σ²/2)t) < mean!",
        TI(r"\\ln(S_t/S_0) \\sim N") + ": <strong>log-return normal → harga lognormal</strong> (B7.1!).",
    ])
    L.p("<strong>Kepribadian:</strong> GBM adalah &ldquo;random walk untuk orang kaya&rdquo; — bekerja di skala perkalian (return), bukan penjumlahan (rupiah). Inilah fondasi Black-Scholes (E11).")
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>S0 = Rp10.000, μ = 10%/thn, σ = 30%/thn. Distribusi harga 1 tahun lagi?</p>"
        "<p><strong>Langkah 1</strong> — ln(S₁/S₀) ~ N((0,1 − 0,045)×1, 0,09) = N(0,055; 0,09).</p>"
        "<p><strong>Langkah 2</strong> — median S₁ = 10.000×e^0,055 ≈ <strong>Rp10.566</strong>.</p>"
        "<p><strong>Langkah 3</strong> — E[S₁] = 10.000×e^0,1 ≈ <strong>Rp11.052</strong> (lebih tinggi — Jensen!).</p>"
        "<p><strong>Langkah 4</strong> — P(S₁ &lt; 10.000) = P(Z &lt; −0,055/0,3) = P(Z &lt; −0,18) ≈ <strong>43%</strong> — meski ekspektasi +10%!</p>"))
    L.raw(tip("Tiga angka GBM yang wajib bisa: <strong>mean</strong> (S₀e^μt), <strong>median</strong> (S₀e^((μ−σ²/2)t)), dan <strong>probabilitas di bawah level</strong> (via z-score log-return). Ketiganya beda — dan ketiganya dipakai."))

    L.sec("ou", "OU &amp; Poisson — Mean-Reversion dan Lompatan")
    L.h3("Ornstein-Uhlenbeck (mean-reverting)")
    L.p(T(r"dX_t = \\theta(\\mu - X_t)\\,dt + \\sigma\\,dW_t"))
    L.p("&ldquo;Pegas&rdquo; yang menarik kembali ke μ dengan kekuatan θ. <strong>Kapan:</strong> suku bunga, volatilitas, spread pairs-trading — yang <em>tidak bisa kabur jauh</em>. GBM untuk harga saham (bisa 10x), OU untuk suku bunga (kembali ke normal).")
    L.h3("Proses Poisson (lompatan)")
    L.p("Kejadian diskret di waktu kontinu: N_t ~ Poisson(λt) (B6.2!). <strong>Kapan:</strong> default, klaim, kedatangan order — <em>event</em>, bukan difusi mulus.")
    L.h3("Jump-diffusion (Merton)")
    L.p("GBM + lompatan Poisson — untuk <strong>crash</strong>: difusi sehari-hari + lompatan sesekali. Model yang jujur untuk return saham berekor tebal.")
    L.raw(myth("Satu model cocok untuk semua deret waktu.",
        "Harga saham (GBM, non-stasioner) ≠ suku bunga (OU, stasioner) ≠ default (Poisson, event). Salah model = salah sifat: memodelkan suku bunga dengan GBM memprediksi ia bisa 1000% (absurd); memodelkan harga dengan OU memprediksi ia kembali ke &ldquo;rata-rata&rdquo; (value trap!). Pilih model sesuai <em>sifat</em> data."))

    L.chart(
        data=[{"x": list(range(0, 101)), "y": [0.5, -0.5, 0, 1, 0.5, 1.5, 1, 2, 1.5, 2.5] + [round(2.5 + (i-10)*0.05 + (2*((i*37)%11)/11-1), 2) for i in range(10, 101)],
               "type": "scatter", "mode": "lines", "name": "Random walk (ilustrasi)",
               "line": {"color": "#2a7de1"}},
              {"x": [0, 100], "y": [10, 10], "type": "scatter", "mode": "lines", "name": "+√t",
               "line": {"color": "#94a3b8", "dash": "dash"}},
              {"x": [0, 100], "y": [-10, -10], "type": "scatter", "mode": "lines", "name": "−√t",
               "line": {"color": "#94a3b8", "dash": "dash"}, "showlegend": False}],
        title="Random Walk: Tetap di Sekitar 0, Menyebar ∝ √t",
        layout={"xaxis": {"title": "Langkah n"}, "yaxis": {"title": "Posisi Sₙ"}, "showlegend": True},
        cara="Biru = satu jalur random walk; garis putus-putus = ±√n (amplop jarak tipikal).",
        interpretasi="Jalur berkelok tanpa tren (ekspektasi 0), tapi amplop melebar ∝ √n. <strong>Dua fakta dalam satu gambar:</strong> tak bisa diprediksi arahnya, tapi bisa diukur sebarannya. Inilah esensi pemodelan stokastik: bukan meramal jalur, melainkan mengukur distribusinya.")

    L.sec("lab1", "🔬 Lab 1: √t — Jarak Tipikal Random Walk")
    L.lab("Lab 1 — Hukum Akar Kuadrat",
        "Simulasikan random walk. Verifikasi SD(Sₙ) = √n dan aturan skala volatilitas √252.",
        'import random, statistics\nrandom.seed(151)\n\ndef rw(n):\n    s = 0\n    for _ in range(n):\n        s += 1 if random.random() < 0.5 else -1\n    return s\n\nfor n in [100, 400, 1600, 10000]:\n    xs = [rw(n) for _ in range(5000)]\n    print(f"n={n:>6}: SD = {statistics.pstdev(xs):6.1f}  (teori √n = {n**0.5:6.1f})")\nprint()\nprint("Aturan pasar: SD tahunan = SD harian × √252")\nprint(f"SD harian 2% -> SD tahunan = {0.02 * 252**0.5:.1%}")\nprint("Coba: jika return BERKORELASI (tren), apakah √t masih berlaku? (tidak!)")',
        "Peringatan: √t hanya untuk inkremen <strong>independen</strong>. Ada autokorelasi → skala beda (inilah mengapa estimasi vol butuh kehati-hatian).")

    L.sec("lab2", "🔬 Lab 2: Simulasi GBM — Harga Saham Setahun")
    L.lab("Lab 2 — GBM dari Nol",
        "Simulasikan 5.000 path GBM (S₀=10.000, μ=10%, σ=30%). Hitung mean, median, P(rugi).",
        'import random, math, statistics\nrandom.seed(152)\nS0, mu, sigma, T = 10_000, 0.10, 0.30, 1.0\nN = 5000\nST = [S0*math.exp((mu-0.5*sigma**2)*T + sigma*math.sqrt(T)*random.gauss(0,1)) for _ in range(N)]\nST.sort()\nprint(f"mean   = Rp{statistics.mean(ST):,.0f} (teori {S0*math.exp(mu*T):,.0f})")\nprint(f"median = Rp{statistics.median(ST):,.0f} (teori {S0*math.exp((mu-0.5*sigma**2)*T):,.0f})")\nprint(f"P(rugi) = {sum(1 for s in ST if s < S0)/N:.1%} (teori ~43%)")\nprint(f"kuantil 5%  = Rp{ST[int(0.05*N)]:,.0f}  <- VaR 95%!")\nprint(f"kuantil 95% = Rp{ST[int(0.95*N)]:,.0f}")\nprint("\\nCoba: sigma=0.6. Apa yang terjadi pada median vs mean? (Jensen melebar!)")',
        "Perhatikan mean > median — selalu, untuk GBM. Dan VaR langsung terbaca dari kuantil simulasi.")

    L.sec("peta", "🗺️ Peta Keputusan: Proses Stokastik Mana?")
    L.decision("1", "Harga aset (positif, multiplikatif) → <strong>GBM</strong>",
        "Saham, komoditas, FX.",
        kenapa="Log-return normal → harga lognormal; tidak pernah negatif.",
        contoh="Black-Scholes, simulasi harga (Lab 2).")
    L.decision("2", "Kembali ke rata-rata (suku bunga, vol, spread) → <strong>OU</strong>",
        "Ada &ldquo;gravitasi&rdquo; ke level normal.",
        kenapa="Suku bunga 1000% absurd — butuh mean-reversion.",
        contoh="Model Vasicek/CIR untuk suku bunga (MR15).")
    L.decision("3", "Kejadian diskret (default, klaim) → <strong>Poisson process</strong>",
        "Event, bukan difusi.",
        kenapa="Menghitung &ldquo;berapa event&rdquo; per periode.",
        contoh="Intensitas default dalam model reduksi (CR).")
    L.decision("4", "Difusi + crash sesekali → <strong>jump-diffusion</strong>",
        "Return berekor tebal dengan lompatan.",
        kenapa="GBM murni meremehkan crash; lompatan Poisson menangkapnya.",
        contoh="Pricing opsi saat earnings/makro.")
    L.decision("5", "Status diskret per periode → <strong>Markov chain (B14)</strong>",
        "Bukan proses kontinu.",
        kenapa="Jika waktu diskret &amp; status diskret, Markov lebih pas.",
        contoh="Migrasi rating bulanan.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Skala <strong>perkalian</strong> (harga) → GBM; ada <strong>pegas</strong> → OU; <strong>event</strong> → Poisson.</li>"
        "<li>Vol diskala <strong>√t</strong> — bukan linear (butuh inkremen independen).</li>"
        "<li>Untuk GBM: bedakan <strong>mean vs median</strong> (Jensen!) — dan laporkan keduanya.</li></ol>"))

    L.sec("case", "📋 Mini-Case: VaR 10-Hari Portofolio")
    L.raw(callout("<p>Regulator meminta VaR 10-hari 99%. Tim menghitung VaR 1-hari = Rp1 M (via GBM/historis), lalu melaporkan VaR 10-hari = Rp10 M (×10).</p>"
        "<p><strong>Pertanyaan:</strong> (a) Apa yang salah? (b) Berapa yang benar di bawah asumsi i.i.d.? (c) Kapan bahkan √10 pun salah?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) <strong>Skala linear salah.</strong> Volatilitas tumbuh ∝ √t, bukan t — mengalikan 10 melebih-lebihkan 3x lipat (dan membuat modal boros / sinyal salah).</p>"
        "<p>(b) VaR 10-hari = Rp1 M × √10 ≈ <strong>Rp3,16 M</strong> (asumsi i.i.d. dan distribusi stabil).</p>"
        "<p>(c) <strong>√10 pun salah jika:</strong> return berautokorelasi (tren/vol clustering — butuh GARCH, A3.10), distribusi tidak stabil (regime change), atau ada lompatan (jump-diffusion). Aturan Basel memakai √10 sebagai <em>aproksimasi</em> — bank yang serius memodelkan langsung horizon 10-hari. <strong>Pelajaran:</strong> aturan skala adalah alat cepat, bukan kebenaran.</p>")))

    L.quiz("Var(Sₙ) untuk random walk ±1 adalah…",
        ["√n", "n", "n²", "0"],
        1, "Benar: varians jumlah inkremen independen = n. SD = √n.")
    L.quiz("VaR 1-hari Rp1 M. VaR 10-hari (i.i.d.) ≈ …",
        ["Rp10 M", "Rp3,16 M (√10)", "Rp100 juta", "Tetap Rp1 M"],
        1, "Benar: skala √t. ×10 linear = kesalahan 3x lipat.")
    L.quiz("Koreksi −½σ² di GBM berasal dari…",
        ["Regulasi", "Jensen/Itô: E[exp] > exp(E) — mean vs median", "Pembulatan", "Biaya transaksi"],
        1, "Benar: konveksitas eksponensial — E[S_t] = S₀e^μt tapi median lebih rendah.")
    L.quiz("Suku bunga lebih tepat dimodelkan…",
        ["GBM", "OU (mean-reverting)", "Poisson", "Random walk biasa"],
        1, "Benar: suku bunga punya gravitasi ke normal — GBM bisa memprediksi 1000% (absurd).")
    L.quiz("Jalur Brownian motion bersifat…",
        ["Mulus & terdiferensiasi", "Kontinu tapi tidak terdiferensiasi di manapun (fraktal)", "Lurus", "Periodik"],
        1, "Benar: bergerigi di semua skala — &ldquo;tren jangka pendek&rdquo; biasanya ilusi.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Random walk:</strong> Var ∝ t, SD ∝ √t — aturan skala volatilitas.</li>"
        "<li><strong>Brownian:</strong> limit kontinu; inkremen N(0, dt) independen; template SDE.</li>"
        "<li><strong>GBM:</strong> " + TI(r"dS = \\mu S\\,dt + \\sigma S\\,dW") + " — harga lognormal; bedakan mean vs median.</li>"
        "<li><strong>OU:</strong> mean-reverting (suku bunga); <strong>Poisson:</strong> event; <strong>jump-diffusion:</strong> keduanya.</li>"
        "<li><strong>Jangan</strong> skala vol linear dengan waktu; <strong>jangan</strong> pakai satu model untuk semua deret.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B16
def b16():
    L = Lesson("b16-heavy-tails-evt", "B16 — Probabilitas",
        "Heavy Tails &amp; EVT:<br/>Ekor yang Memakan Model",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b15-proses-stokastik", "← B15"), ("b17-bayesian-praktis", "Next: B17"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>heavy tail</strong>: definisi, deteksi (log-log, Hill), dan mengapa Normal gagal.</li>"
        "<li>Menjelaskan <strong>teorema Fisher-Tippett</strong>: maksimum ternormalisasi → GEV.</li>"
        "<li>Menerapkan <strong>metode POT + GPD</strong> untuk mengestimasi kuantil ekstrem.</li>"
        "<li>Menghitung <strong>return level</strong> (&ldquo;1-in-100-tahun&rdquo;) dengan benar + batasnya.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Banjir &ldquo;1-in-100-Tahun&rdquo; yang Datang 3x Seabad")
    L.raw('<div className="story"><p>Kota membangun tanggul untuk banjir &ldquo;1-in-100-tahun&rdquo; berdasar 50 tahun data dengan model Normal. Dalam 30 tahun berikutnya, banjir sebesar itu datang <strong>3 kali</strong>. Insinyurnya bingung: <em>&ldquo;Kemungkinan 3 kejadian 1%-per-tahun dalam 30 tahun kan kecil sekali?&rdquo;</em></p>'
        "<p>Yang salah: <strong>modelnya</strong>. Tinggi banjir berekor tebal (Pareto-like) — ekstrapolasi Normal dari 50 tahun data meremehkan kuantil 1% secara sistematis. Dan &ldquo;1-in-100-tahun&rdquo; dari data 50 tahun adalah <strong>ekstrapolasi</strong>, bukan observasi.</p>"
        "<p><strong>Extreme Value Theory (EVT)</strong> adalah statistika khusus untuk ekor — satu-satunya cara jujur menjawab &ldquo;seberapa besar yang 1-in-100-tahun?&rdquo;.</p></div>")

    L.sec("heavy", "Heavy Tail — Definisi &amp; Deteksi")
    L.p("<strong>Definisi.</strong> Distribusi berekor tebal (kanan) jika ekornya turun <strong>lebih lambat dari eksponensial</strong>:")
    L.p(T(r"\\lim_{x\\to\\infty} \\frac{P(X > x)}{e^{-\\lambda x}} = \\infty \\quad \\text{untuk semua } \\lambda > 0"))
    L.p("Praktisnya: Pareto, lognormal (agak), t-Student — vs Normal/Eksponensial (tipis). <strong>Konsekuensi:</strong> momen bisa tak hingga (B7.2); sampel maksimum tumbuh cepat; CLT lambat/gagal.")
    L.p("<strong>Deteksi:</strong>")
    L.ul([
        "<strong>Plot log-log</strong> P(X&gt;x) vs x: garis lurus → Pareto (kemiringan −α).",
        "<strong>QQ-plot vs Eksponensial:</strong> melengkung ke atas → heavy.",
        "<strong>Plot Hill:</strong> estimasi α vs jumlah order statistic — datar = stabil.",
        "<strong>Rasio max/sum:</strong> jika satu observasi mendominasi total → heavy (coba: 1% terbesar menyumbang berapa % total?).",
    ])
    L.raw(tip("Tes 10 detik: urutkan data, lihat 1% teratas menyumbang berapa % dari total. Normal: ~3%. Pareto α=1,5: ~30%+. Jika &ldquo;secuil data menguasai total&rdquo; — kamu di wilayah heavy tail, dan mean/SD tidak bisa dipercaya."))
    L.raw(myth("Ekor tebal hanya soal &ldquo;outlier sesekali&rdquo;.",
        "Bukan sesekali — ini <em>struktural</em>. Pada Pareto α=1,5, kejadian &ldquo;10x median&rdquo; terjadi ~3% waktu (vs 0% praktis pada Normal). Seluruh strategi (asuransi, modal, reasuransi) harus didesain untuk dunia di mana ekstrem adalah <em>rutin</em>, bukan anomali."))

    L.sec("gev", "Fisher-Tippett — Teorema Limit untuk Maksimum")
    L.p("CLT adalah teorema limit untuk <em>rata-rata</em>. EVT punya padanannya untuk <em>maksimum</em>:")
    L.p(T(r"\\frac{M_n - b_n}{a_n} \\xrightarrow{d} G_\\xi"))
    L.p("dengan " + TI(r"M_n = \\max(X_1,\\ldots,X_n)") + " dan " + TI(r"G_\\xi") + " = <strong>Generalized Extreme Value (GEV)</strong>:")
    L.p(T(r"G_\\xi(x) = \\exp\\!\\big(-(1+\\xi x)^{-1/\\xi}\\big)"))
    L.ul([
        TI(r"\\xi > 0") + ": <strong>Fréchet</strong> — heavy tail (Pareto-like). Ini yang menakutkan.",
        TI(r"\\xi = 0") + ": <strong>Gumbel</strong> — ekor tipis (Normal/Eksponensial).",
        TI(r"\\xi < 0") + ": <strong>Weibull</strong> — ada batas atas hingga.",
    ])
    L.p("<strong>Metode block maxima:</strong> ambil maksimum per blok (tahunan), fit GEV via MLE → estimasi return level.")
    L.p("<strong>Kepribadian:</strong> jika CLT bilang &ldquo;rata-rata selalu jadi lonceng&rdquo;, Fisher-Tippett bilang &ldquo;maksimum selalu jadi salah satu dari tiga bentuk&rdquo; — dan bentuknya (ξ) menentukan apakah duniamu jinak atau liar.")

    L.sec("pot", "POT + GPD — Memakai Semua Data Ekor")
    L.p("Block maxima boros (1 data per tahun!). <strong>POT (Peaks Over Threshold):</strong> ambil semua <em>exceedance</em> di atas ambang u. Teorema Pickands-Balkema-de Haan: exceedance ternormalisasi → <strong>Generalized Pareto (GPD)</strong>:")
    L.p(T(r"P(X - u > y \\mid X > u) \\approx \\left(1 + \\frac{\\xi y}{\\beta}\\right)^{-1/\\xi}"))
    L.p("<strong>Return level</strong> &ldquo;1-in-m observasi&rdquo>:")
    L.p(T(r"x_m = u + \\frac{\\beta}{\\xi}\\left((m\\,\\zeta_u)^{\\xi} - 1\\right)"))
    L.p("dengan " + TI(r"\\zeta_u = P(X > u)") + " (proporsi exceedance). <strong>Contoh:</strong> u = Rp1 M, ξ = 0,3, β = 0,5M, ζᵤ = 5%: level 1-in-100 → x ≈ 1 + (0,5/0,3)((100×0,05)^0,3 − 1) ≈ Rp3,7 M.")
    L.p("<strong>Pemilihan ambang u:</strong> trade-off bias-varians — terlalu rendah (teorema belum berlaku), terlalu tinggi (sedikit data). Praktik: <strong>mean excess plot</strong> harus linear di atas u.")
    L.raw(tip("Aturan praktis: u di sekitar <strong>kuantil 90–95%</strong> data. Lalu cek stabilitas: geser u sedikit — jika ξ berubah drastis, ambangmu salah atau data tidak cukup."))
    L.raw(myth("&ldquo;1-in-100-tahun&rdquo; berarti aman 99 tahun.",
        "Artinya peluang 1% <em>tiap tahun</em> — seperti dadu 100-sisi tiap tahun. P(terjadi dalam 30 tahun) = 1−0,99³⁰ ≈ <strong>26%</strong>! Dan jika iklim berubah (non-stasioner), &ldquo;1-in-100&rdquo; historis bisa jadi &ldquo;1-in-20&rdquo; saat ini. Return level adalah <em>probabilitas tahunan</em>, bukan jadwal."))

    L.chart(
        data=[{"x": [round(1+i*0.2,1) for i in range(46)],
               "y": [round((1+i*0.2)**(-1.5),4) for i in range(46)],
               "type": "scatter", "mode": "lines", "name": "Pareto (heavy)",
               "line": {"color": "#ef4444"}},
              {"x": [round(1+i*0.2,1) for i in range(46)],
               "y": [round(math.exp(-(1+i*0.2-1)*2),4) for i in range(46)],
               "type": "scatter", "mode": "lines", "name": "Eksponensial (tipis)",
               "line": {"color": "#2a7de1", "dash": "dash"}}],
        title="Ekor: Pareto vs Eksponensial (skala log-log)",
        layout={"xaxis": {"title": "x (log)", "type": "log"}, "yaxis": {"title": "P(X > x) (log)", "type": "log"}, "showlegend": True},
        cara="Skala log-log: garis lurus = hukum pangkat (Pareto); melengkung turun = ekor tipis.",
        interpretasi="Pada x=10, peluang Pareto ~30x lipat Eksponensial. <strong>Ekstrapolasi Normal/Eksponensial ke wilayah 1-in-100 meremehkan secara sistematis</strong> — inilah dosa insinyur tanggul di cerita pembuka. Diagnosis 10 detik: plot log-log dulu.")

    L.sec("lab1", "🔬 Lab 1: Normal vs Pareto — Siapa Meremehkan Ekor?")
    L.lab("Lab 1 — Ekstrapolasi yang Jujur vs Menipu",
        "Data benar Pareto(α=1,5). Fit Normal (MLE) lalu bandingkan prediksi kuantil 99% vs kuantil empiris.",
        'import random, statistics\nrandom.seed(161)\n\ndef pareto(a):\n    return 1.0/(random.random()**(1/a))\n\ndata = [pareto(1.5) for _ in range(5000)]\ndata.sort()\nq99_emp = data[int(0.99*len(data))]\n# fit Normal (MLE): mean & sd sampel\nmu, sd = statistics.mean(data), statistics.pstdev(data)\n# kuantil 99% Normal = mu + 2.326*sd\nq99_norm = mu + 2.326*sd\nprint(f"Kuantil 99% empiris : {q99_emp:.1f}")\nprint(f"Kuantil 99% Normal  : {q99_norm:.1f}")\nprint(f"Normal meremehkan {(1-q99_norm/q99_emp):.0%}!")\nprint(f"(mean={mu:.1f}, sd={sd:.1f} — sd meledak karena 1-2 monster)")\nprint("\\nCoba: apa yang terjadi jika 2 data terbesar dibuang? (jangan di praktik!)")',
        "Inilah &ldquo;cerita tanggul&rdquo; dalam angka: model Normal dari data yang sama meremehkan kuantil ekstrem.")

    L.sec("lab2", "🔬 Lab 2: Return Level &ldquo;1-in-100&rdquo; via POT (sketsa)")
    L.lab("Lab 2 — Estimasi Kuantil Ekstrem",
        "Ambang u = kuantil 95%. Estimasi ξ via Hill, hitung return level 1-in-100 & 1-in-500.",
        'import random, math, statistics\nrandom.seed(162)\n\ndef pareto(a):\n    return 1.0/(random.random()**(1/a))\n\ndata = sorted([pareto(1.5) for _ in range(20000)])\nn = len(data)\nu = data[int(0.95*n)]  # ambang 95%\nexc = [x for x in data if x > u]\nk = len(exc)\n# estimator Hill untuk xi\nxi = sum(math.log(x/u) for x in exc) / k\nzeta = k / n\nprint(f"ambang u={u:.1f}, exceedance={k}, xi(Hill)={xi:.2f} (teori 1/1.5=0.67)")\nfor m in [100, 500, 2000]:\n    xm = u * (m*zeta)**xi  # return level Pareto\n    print(f"return level 1-in-{m}: {xm:.1f}")\nprint(f"\\nmax data = {data[-1]:.1f}. Return 1-in-2000 ({u*(2000*zeta)**xi:.0f}) MELAMPAUI max!")\nprint("Itulah gunanya EVT: ekstrapolasi jujur ke luar data.")\nprint("Coba: n=2000 saja. Stabilkah xi? (data ekor butuh BANYAK)")',
        "EVT mengekstrapolasi <strong>keluar</strong> data — satu-satunya metode berprinsip untuk itu. Tapi butuh banyak data ekor.")

    L.sec("peta", "🗺️ Peta Keputusan: Kapan EVT")
    L.decision("1", "Butuh kuantil ekstrem / return level → <strong>EVT (POT/GPD)</strong>",
        "Pertanyaan &ldquo;1-in-100&rdquo;, VaR 99,9%, modal bencana.",
        kenapa="Satu-satunya ekstrapolasi ekor yang berprinsip.",
        contoh="Tanggul 1-in-100-tahun, modal risiko operasional.")
    L.decision("2", "Data cukup + maksimum per blok → <strong>block maxima + GEV</strong>",
        "Data tahunan panjang (banjir tahunan, return tahunan).",
        kenapa="Sederhana; tapi boros data.",
        contoh="Rekor banjir tahunan 80 tahun.")
    L.decision("3", "Data harian, butuh semua ekor → <strong>POT + GPD</strong>",
        "Exceedance di atas ambang u.",
        kenapa="Efisien: pakai semua data ekstrem, bukan 1/blok.",
        contoh="Kerugian operasional harian di atas Rp1 M.")
    L.decision("4", "Curiga non-stasioner (iklim berubah) → <strong>EVT non-stasioner</strong>",
        "&ldquo;1-in-100&rdquo; masa lalu ≠ masa kini.",
        kenapa="Parameter GEV sebagai fungsi waktu/kovariat.",
        contoh="Banjir dengan tren iklim; frekuensi fraud yang naik.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Curiga heavy tail → <strong>plot log-log</strong> dulu (10 detik).</li>"
        "<li>Butuh di luar data → <strong>EVT</strong>; jangan ekstrapolasi Normal.</li>"
        "<li>&ldquo;1-in-100&rdquo; = 1% per tahun, bukan jadwal — P(30 thn) ≈ 26%.</li>"
        "<li>Ambang POT ~ kuantil 90–95%; cek stabilitas ξ.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Modal Risiko Operasional (LDA)")
    L.raw(callout("<p>Bank memakai LDA (Loss Distribution Approach): frekuensi ~ Poisson(50/thn), severitas ~ Lognormal. AMA menghitung VaR 99,9% = Rp80 M. Kamu curiga severitas berekor tebal (ada 2 kerugian > Rp30 M dalam 5 tahun).</p>"
        "<p><strong>Pertanyaan:</strong> (a) Bagaimana menguji kecurigaan? (b) Jika benar, apa dampak ke VaR 99,9%? (c) Desain model yang lebih jujur.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) <strong>Uji:</strong> log-log plot severitas; Hill estimator; QQ-plot vs Lognormal (lengkung ke atas di kanan = lebih tebal). 2/250 (0,8%) kerugian > Rp30 M — bandingkan dengan prediksi Lognormal.</p>"
        "<p>(b) <strong>Dampak:</strong> VaR 99,9% sangat sensitif ke ekor — ganti Lognormal → GPD/Pareto untuk ekor bisa menaikkan VaR <strong>2–5x lipat</strong>. Rp80 M bisa jadi Rp200–400 M. Inilah mengapa &ldquo;model risk&rdquo; untuk LDA sangat tinggi.</p>"
        "<p>(c) <strong>Desain jujur:</strong> body (di bawah ambang) ~ Lognormal + ekor (di atas ambang) ~ GPD (spliced model, seperti mini-case B8!). Validasi: backtest exceedance (berapa kali > VaR?) + stress ξ. <strong>Pelajaran:</strong> untuk risiko operasional, <em>pemilihan ekor</em> adalah keputusan modal terbesar — lebih penting dari presisi parameter body.</p>")))

    L.quiz("Heavy tail berarti…",
        ["Banyak outlier kecil", "Ekor turun lebih lambat dari eksponensial — ekstrem struktural", "Data selalu Pareto", "Varians nol"],
        1, "Benar: definisi formal via limit. Konsekuensi: momen bisa tak hingga, ekstrem adalah rutin.")
    L.quiz("Fisher-Tippett adalah padanan CLT untuk…",
        ["Rata-rata", "Maksimum", "Median", "Varians"],
        1, "Benar: maksimum ternormalisasi → GEV (Fréchet/Gumbel/Weibull tergantung ξ).")
    L.quiz("Kelebihan POT dibanding block maxima…",
        ["Lebih sederhana", "Memakai semua exceedance — efisien data", "Tidak butuh ambang", "Selalu akurat"],
        1, "Benar: block maxima boros (1/blok). POT memakai semua data ekstrem.")
    L.quiz("&ldquo;Banjir 1-in-100-tahun&rdquo;. P(terjadi dalam 30 tahun) ≈ …",
        ["30%", "26% (1−0,99³⁰)", "100%", "3%"],
        1, "Benar: 1% per tahun, bukan jadwal. 26% dalam 30 tahun — jauh dari &ldquo;aman&rdquo;.")
    L.quiz("QQ-plot data vs Eksponensial melengkung ke atas. Artinya…",
        ["Ekor tipis", "Heavy tail — butuh EVT, bukan model eksponensial", "Data normal", "Tidak ada info"],
        1, "Benar: ekor data lebih tebal dari eksponensial. Jangan ekstrapolasi dengan model tipis.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Heavy tail:</strong> ekor turun lambat; deteksi via log-log/Hill/rasio max-sum.</li>"
        "<li><strong>Fisher-Tippett:</strong> maksimum → GEV; ξ&gt;0 (Fréchet) = dunia liar.</li>"
        "<li><strong>POT+GPD:</strong> exceedance di atas ambang → return level; ambang ~k95, cek stabilitas.</li>"
        "<li><strong>&ldquo;1-in-m&rdquo;</strong> = peluang tahunan, bukan jadwal.</li>"
        "<li><strong>Jangan</strong> ekstrapolasi Normal ke ekor; <strong>jangan</strong> anggap ekstrem sebagai anomali.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== B17
def b17():
    L = Lesson("b17-bayesian-praktis", "B17 — Probabilitas",
        "Bayesian Praktis: Belajar dari Data,<br/>Bukan dari Nol",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b16-heavy-tails-evt", "← B16"), ("c1-select-dasar", "Next: C1"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>aliran Bayesian</strong>: prior → likelihood → posterior, dan posterior jadi prior berikutnya.</li>"
        "<li>Menghitung <strong>konjugat Beta-Binomial &amp; Gamma-Poisson</strong> tanpa integral.</li>"
        "<li>Menjelaskan <strong>shrinkage</strong>: mengapa estimasi Bayesian &ldquo;menahan&rdquo; data kecil.</li>"
        "<li>Membedakan <strong>credible interval vs confidence interval</strong> — dan kapan Bayesian menang.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Cabang Baru dengan 10 Nasabah")
    L.raw('<div className="story"><p>Bank buka cabang baru. Bulan pertama: 10 nasabah, <strong>3 gagal</strong> (30%!). Manajer panik: <em>&ldquo;PD cabang ini 30% — tutup saja!&rdquo;</em></p>'
        "<p>Analis Bayesian tenang: <em>&ldquo;Bank kita punya 100.000 nasabah historis dengan PD 5%. Dengan 10 data baru, estimasi terbaik bukan 30%, melainkan <strong>5,3%</strong>.&rdquo;</em> Setahun kemudian (2.000 nasabah, 140 gagal = 7%): estimasi Bayesian 6,9% — akurat. Estimasi &ldquo;30%&rdquo; si manajer sudah lama dilupakan.</p>"
        "<p>Ini <strong>shrinkage</strong>: Bayesian tidak membuang pengetahuan lama (prior) hanya karena 10 data baru berisik. Di dunia data kecil — cabang baru, produk baru, segmen langka — Bayesian bukan &ldquo;alternatif&rdquo;, melainkan <strong>satu-satunya cara waras</strong>.</p></div>")

    L.sec("aliran", "Aliran Bayesian — Belajar Sekuensial")
    L.p(T(r"\\underbrace{P(\\theta \\mid \\text{data})}_{\\text{posterior}} \\propto \\underbrace{P(\\text{data} \\mid \\theta)}_{\\text{likelihood}} \\times \\underbrace{P(\\theta)}_{\\text{prior}}"))
    L.ul([
        TI(r"\\theta") + ": parameter yang diestimasi (PD, λ, ...),",
        "<strong>Prior:</strong> pengetahuan sebelum data — dari historis, expert, atau &ldquo;tidak tahu&rdquo; (noninformatif),",
        "<strong>Likelihood:</strong> seberapa cocok data untuk tiap θ (model!)",
        "<strong>Posterior:</strong> pengetahuan setelah data — <strong>= prior untuk data berikutnya!</strong>",
    ])
    L.p("<strong>Kepribadian:</strong> Bayesian adalah &ldquo;pembelajar yang tidak amnesia&rdquo; — ia tidak pernah mulai dari nol. Tiap analisis mewarisi pengetahuan analisis sebelumnya. Frekuentis (A2) memulai dari nol tiap kali.")
    L.raw(tip("Siklusnya: <strong>posterior hari ini = prior besok</strong>. Inilah yang membuat Bayesian natural untuk sistem live (skor fraud diupdate per transaksi, PD diupdate per bulan) — tidak perlu &ldquo;refit dari nol&rdquo;."))

    L.sec("konjugat", "Pasangan Konjugat — Bayesian Tanpa Integral")
    L.p("Pasangan prior–likelihood <strong>konjugat</strong>: posterior satu keluarga dengan prior — update = aritmetika!")
    L.table(["Likelihood (data)", "Prior konjugat", "Update posterior", "Contoh"],
        [["Binomial (s sukses, f gagal)", "Beta(a, b)", "Beta(a+s, b+f)", "PD dari data default"],
         ["Poisson (n kejadian)", "Gamma(α, β)", "Gamma(α+n, β+t)", "λ klaim per bulan"],
         ["Normal (σ² diketahui)", "Normal(μ₀, τ₀²)", "Normal(μₙ, τₙ²) presisi tertimbang", "Mean return"],
         ["Multinomial", "Dirichlet", "Dirichlet(α+c)", "Pangsa kategori"]])
    L.raw(worked("📐 Contoh: cabang baru (cerita pembuka)",
        "<p>Prior dari historis bank: PD ≈ 5% → Beta(50, 950) (setara 1.000 observasi).</p>"
        "<p>Data cabang: 3 gagal dari 10 → posterior <strong>Beta(53, 957)</strong>, mean = 53/1010 ≈ <strong>5,25%</strong>.</p>"
        "<p>Bandingkan: estimasi mentah 30% vs Bayesian 5,25%. <strong>Prior &ldquo;menahan&rdquo;</strong> (shrinkage) karena 10 data terlalu sedikit untuk mengalahkan 1.000 data historis.</p>"
        "<p>Setahun kemudian (+140/2000): Beta(193, 2957) → mean <strong>6,1%</strong> — data akhirnya &ldquo;menang&rdquo;.</p>"))
    L.raw(myth("Prior = subjektivitas = tidak ilmiah.",
        "Prior yang <em>disembunyikan</em> memang berbahaya — tapi prior yang <em>eksplisit &amp; didokumentasikan</em> justru lebih ilmiah dari &ldquo;asumsi implisit&rdquo;. Dan ingat: metode &ldquo;objektif&rdquo; pun punya pilihan subjektif (model, α=5%, prior implisit uniform). Kejujuran Bayesian: semua asumsi tertulis di prior, bisa dikritik &amp; diuji sensitivitasnya."))

    L.sec("shrink", "Shrinkage — Kebijaksanaan Data Kecil")
    L.p("Estimasi Bayesian = <strong>rata-rata tertimbang</strong> prior dan data:")
    L.p(T(r"\\hat{\\theta}_{\\text{Bayes}} \\approx w\\cdot \\bar{x}_{\\text{data}} + (1-w)\\cdot \\mu_{\\text{prior}}, \\quad w = \\frac{n}{n + n_0}"))
    L.p("dengan " + TI(r"n_0") + " = &ldquo;kekuatan&rdquo; prior (observasi ekuivalen). <strong>n kecil → w kecil → ikut prior.</strong> Inilah James-Stein/empirical Bayes: &ldquo;pinjam kekuatan&rdquo; dari populasi.")
    L.p("<strong>Kapan kritis:</strong> segmen kecil (cabang baru, produk baru), rare event, A/B testing awal, hierarchical model (nasabah dalam cabang dalam region).")
    L.raw(tip("Jika ada yang melapor &ldquo;PD segmen ini 30%&rdquo; dari n=10 — tanya: <em>berapa n-nya, dan apa prior-nya?</em> Dua pertanyaan ini membunuh 90% klaim dramatis dari data kecil. Shrinkage adalah &ldquo;rem&rdquo; terhadap overreaksi."))

    L.sec("credible", "Credible vs Confidence — Beda Filsafat")
    L.table(["", "Bayesian: credible interval", "Frekuentis: confidence interval"],
        [["Arti 95%", "P(θ di interval | data) = 95% — <strong>yang ingin diketahui!</strong>", "Jika diulang, 95% interval menutupi θ — <strong>bukan</strong> P(θ di interval ini)"],
         ["θ", "Variabel acak (punya distribusi)", "Tetap (tidak acak)"],
         ["Data kecil", "Tetap valid (dengan prior)", "Bisa degenerat/lebar tak hingga"],
         ["Komputasi", "Dulu mahal (MCMC); kini mudah", "Rumus tertutup sering ada"]])
    L.p("<strong>Kapan Bayesian menang:</strong> data kecil, butuh interpretasi probabilistik langsung (&ldquo;peluang PD &gt; 10%?&rdquo;), model hierarkis, update sekuensial, menggabung expert judgment. <strong>Kapan frekuentis cukup:</strong> data besar (keduanya konvergen!), butuh cepat &amp; standar, regulasi meminta.")
    L.raw(myth("Bayesian selalu lebih baik.",
        "Dengan data besar, prior &ldquo;tenggelam&rdquo; — hasil Bayesian ≈ MLE frekuentis (teorema Bernstein–von Mises). Bayesian membayar harga komputasi &amp; debat prior; jika data melimpah dan pertanyaan standar, frekuentis lebih murah. <strong>Pilih berdasarkan masalah, bukan ideologi.</strong>"))

    L.chart(
        data=[{"x": ["n=10 (30% mentah)", "n=100", "n=1000", "n=10000"],
               "y": [0.0525, 0.062, 0.068, 0.0695], "type": "bar", "name": "Estimasi Bayesian",
               "marker": {"color": "#2a7de1"}, "text": ["5,25%", "6,2%", "6,8%", "6,95%"], "textposition": "outside"},
              {"x": ["n=10 (30% mentah)", "n=100", "n=1000", "n=10000"],
               "y": [0.30, 0.08, 0.072, 0.0702], "type": "scatter", "mode": "lines+markers",
               "name": "Estimasi mentah", "line": {"color": "#e8a838"}}],
        title="Shrinkage: Bayesian vs Mentah (data benar 7%)",
        layout={"yaxis": {"title": "Estimasi PD", "tickformat": ".0%"}, "xaxis": {"title": "n (data baru)"}, "showlegend": True},
        cara="Biru = posterior Bayesian (prior 5%); kuning = proporsi mentah. Data benar PD=7%.",
        interpretasi="n=10: mentah 30% (panik!), Bayesian 5,25% (tenang &amp; lebih dekat ke 7%). Makin besar n, keduanya konvergen ke 7% — <strong>prior hanya menahan saat data sedikit</strong>, tidak mendikte selamanya. Inilah &ldquo;kebijaksanaan&rdquo;: skeptis saat bukti lemah, mengikuti saat bukti kuat.")

    L.sec("lab1", "🔬 Lab 1: Shrinkage Beraksi")
    L.lab("Lab 1 — Prior vs Data (Beta-Binomial)",
        "Prior Beta(50,950) [PD 5%]. Data benar PD=7%. Lihat siapa lebih akurat di n kecil.",
        'import random\nrandom.seed(171)\npa, pb = 50, 950  # prior\np_true = 0.07\nprint(f"Prior: Beta({pa},{pb}) -> mean {pa/(pa+pb):.2%}; PD benar {p_true:.0%}")\nprint()\nfor n in [10, 50, 200, 1000, 5000]:\n    s = sum(random.random() < p_true for _ in range(n))\n    mentah = s / n\n    post_mean = (pa + s) / (pa + pb + n)\n    menang = "BAYES" if abs(post_mean-p_true) < abs(mentah-p_true) else "mentah"\n    print(f"n={n:>5}: mentah={mentah:6.2%}  bayes={post_mean:6.2%}  menang={menang}")\nprint()\nprint("Coba: prior Beta(1,1) (noninformatif). Kapan bayes masih menang?")\n',
        "Bayesian menang telak di n kecil — &ldquo;asuransi&rdquo; terhadap data berisik.")

    L.sec("lab2", "🔬 Lab 2: &ldquo;Peluang PD > 10%?&rdquo; — Pertanyaan Bayesian")
    L.lab("Lab 2 — Probabilitas Langsung dari Posterior",
        "Dari posterior Beta, hitung P(PD > 10%) via simulasi — pertanyaan yang TAK bisa dijawab frekuentis langsung.",
        'import random\nrandom.seed(172)\n# posterior setelah data: Beta(53, 957) [cerita cabang baru]\na, b = 53, 957\nN = 100000\n# sampel Beta via dua Gamma\nsamp = [random.gammavariate(a, 1) / (random.gammavariate(a, 1) + random.gammavariate(b, 1)) for _ in range(N)]\nsamp.sort()\nprint(f"Posterior mean      = {sum(samp)/N:.2%}")\nprint(f"Interval kredibel 95% = [{samp[int(0.025*N)]:.2%}, {samp[int(0.975*N)]:.2%}]")\nprint(f"P(PD > 10%)         = {sum(1 for s in samp if s > 0.10)/N:.2%}")\nprint(f"P(PD > 7%)          = {sum(1 for s in samp if s > 0.07)/N:.2%}")\nprint("\\n\\"P(PD > 10%) = 0.03%\\" -> keputusan langsung: cabang AMAN.")\nprint("Frekuentis tidak bisa mengucapkan kalimat itu! (θ bukan acak bagi mereka)")',
        "Inilah kekuatan unik Bayesian: <strong>probabilitas tentang parameter</strong> — bahasa keputusan.")

    L.sec("peta", "🗺️ Peta Keputusan: Kapan Bayesian")
    L.decision("1", "Data kecil + pengetahuan historis → <strong>Bayesian + konjugat</strong>",
        "Cabang/produk/segmen baru; rare event.",
        kenapa="Shrinkage mencegah overreaksi; update = aritmetika.",
        contoh="PD cabang baru (cerita pembuka).")
    L.decision("2", "Butuh P(parameter > ambang) → <strong>Bayesian</strong>",
        "Keputusan berbasis risiko parameter.",
        kenapa="Hanya Bayesian memberi distribusi posterior θ.",
        contoh="&ldquo;P(PD > 10%)&rdquo; untuk limit setting.")
    L.decision("3", "Update sekuensial / sistem live → <strong>Bayesian</strong>",
        "Data datang bertahap.",
        kenapa="Posterior → prior; tidak refit dari nol.",
        contoh="Skor fraud per transaksi.")
    L.decision("4", "Data besar + pertanyaan standar → <strong>frekuentis cukup</strong>",
        "n besar, interval/uji rutin.",
        kenapa="Keduanya konvergen; frekuentis lebih murah &amp; standar.",
        contoh="Interval PD portofolio 1 juta nasabah.")
    L.decision("5", "Model hierarkis (grup dalam grup) → <strong>Bayesian hierarkis</strong>",
        "Nasabah dalam cabang dalam region.",
        kenapa="Pinjam kekuatan antar grup (partial pooling) — shrinkage bertingkat.",
        contoh="PD per cabang dengan 50 cabang kecil.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Data kecil → Bayesian (shrinkage). Data besar → keduanya sama.</li>"
        "<li>Prior <strong>eksplisit &amp; uji sensitivitasnya</strong> — jangan sembunyikan.</li>"
        "<li>Butuh P(θ > x) → Bayesian. Butuh cepat &amp; standar → frekuentis.</li>"
        "<li>Posterior hari ini = prior besok.</li></ol>"))

    L.sec("case", "📋 Mini-Case: A/B Testing yang Dihentikan Terlalu Cepat")
    L.raw(callout("<p>Tim produk menjalankan A/B test: setelah 200 pengunjung (100/varian), konversi A=8%, B=14%. <em>&ldquo;B menang! Hentikan test, rollout!&rdquo;</em></p>"
        "<p><strong>Pertanyaan:</strong> (a) Apa kata analisis Bayesian (prior Beta(20,180) ≈ 10% historis)? (b) Keputusan yang benar?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) Posterior A: Beta(28, 272) → mean 9,3%. Posterior B: Beta(34, 266) → mean 11,3%. P(B &gt; A | data) via simulasi ≈ <strong>78%</strong> — jauh dari &ldquo;pasti&rdquo;! Interval kredibel keduanya tumpang tindih lebar.</p>"
        "<p>(b) <strong>Jangan rollout.</strong> 78% bukan keyakinan cukup untuk keputusan mahal (butuh ~95%+ atau expected loss analysis). Yang benar: lanjutkan test sampai P(B&gt;A) > 95% <em>atau</em> hitung expected value of information. <strong>Pelajaran:</strong> frekuentis dengan n=200 pun akan bilang &ldquo;belum signifikan&rdquo; — tapi Bayesian memberi angka yang bisa ditindaklanjuti (78%) + bahasa yang dipahami bisnis (&ldquo;peluang B lebih baik&rdquo;). Ini <strong>Bayesian A/B testing</strong> — standar di tech company modern.</p>")))

    L.quiz("Posterior Beta setelah prior Beta(50,950) + 3 gagal dari 10…",
        ["Beta(53, 957)", "Beta(3, 7)", "Beta(50, 950)", "Beta(53, 960)"],
        0, "Benar: tambah sukses ke a, gagal ke b. Mean 5,25% — shrinkage dari 30% mentah.")
    L.quiz("Shrinkage berarti…",
        ["Data selalu diabaikan", "Estimasi ditarik ke prior saat data sedikit; data menang saat banyak", "Prior selalu menang", "Tidak ada estimasi"],
        1, "Benar: w = n/(n+n₀) — timbangan otomatis antara bukti baru dan pengetahuan lama.")
    L.quiz("Keunggulan unik Bayesian vs frekuentis…",
        ["Selalu lebih cepat", "Bisa menyatakan P(parameter > ambang | data)", "Tidak butuh data", "Tidak butuh model"],
        1, "Benar: parameter sebagai variabel acak → probabilitas langsung tentang θ.")
    L.quiz("Dengan data sangat besar, Bayesian vs frekuentis…",
        ["Selalu beda jauh", "Konvergen (prior tenggelam) — pilih yang murah", "Bayesian selalu menang", "Frekuentis tidak bisa dipakai"],
        1, "Benar: Bernstein–von Mises. Jangan bayar harga Bayesian jika data melimpah.")
    L.quiz("Kritik &ldquo;prior subjektif&rdquo; dijawab dengan…",
        ["Prior disembunyikan", "Prior eksplisit, didokumentasikan, diuji sensitivitasnya", "Tidak pakai prior", "Prior selalu uniform"],
        1, "Benar: transparansi > ilusi objektivitas. Semua metode punya asumsi.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Aliran:</strong> posterior ∝ likelihood × prior; posterior hari ini = prior besok.</li>"
        "<li><strong>Konjugat:</strong> Beta-Binomial, Gamma-Poisson — update = aritmetika.</li>"
        "<li><strong>Shrinkage:</strong> " + TI(r"w = n/(n+n_0)") + " — skeptis saat bukti lemah, ikut saat bukti kuat.</li>"
        "<li><strong>Credible interval:</strong> P(θ di interval | data) — bahasa keputusan.</li>"
        "<li><strong>Pilih berdasarkan masalah:</strong> data kecil/hierarkis/live → Bayesian; data besar/standar → frekuentis cukup.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)
