import type { V2Lesson } from "../lib/types";

// ── Figure: forest plot OR tiga prediktor (sintetis) ─────────────────────
const OR_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Forest plot rasio odds tiga prediktor diabetes beserta interval kepercayaan 95 persen">
<line x1="210" y1="40" x2="210" y2="210" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="214" y="52" font-size="11" fill="var(--c3)" font-family="var(--font-ui)">OR = 1 (tidak ada efek)</text>
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="120" y1="215" x2="480" y2="215"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="120" y="232" text-anchor="middle">0</text>
<text x="210" y="232" text-anchor="middle">1</text>
<text x="300" y="232" text-anchor="middle">2</text>
<text x="390" y="232" text-anchor="middle">3</text>
<text x="480" y="232" text-anchor="middle">4</text>
</g>
<g fill="var(--text)" font-size="12" font-family="var(--font-ui)">
<text x="110" y="74" text-anchor="end">Hipertensi</text>
<text x="110" y="134" text-anchor="end">Usia per 10 thn</text>
<text x="110" y="194" text-anchor="end">Laki-laki</text>
</g>
<g stroke="var(--c1)" stroke-width="2">
<line x1="246" y1="70" x2="453" y2="70"/><line x1="246" y1="64" x2="246" y2="76"/><line x1="453" y1="64" x2="453" y2="76"/>
</g>
<circle cx="327" cy="70" r="6" fill="var(--c1)"/>
<text x="465" y="74" font-size="12" fill="var(--text)" font-family="var(--font-ui)">2,30</text>
<g stroke="var(--c2)" stroke-width="2">
<line x1="228" y1="130" x2="372" y2="130"/><line x1="228" y1="124" x2="228" y2="136"/><line x1="372" y1="124" x2="372" y2="136"/>
</g>
<circle cx="284" cy="130" r="6" fill="var(--c2)"/>
<text x="384" y="134" font-size="12" fill="var(--text)" font-family="var(--font-ui)">1,82</text>
<g stroke="var(--c4)" stroke-width="2">
<line x1="201" y1="190" x2="345" y2="190"/><line x1="201" y1="184" x2="201" y2="196"/><line x1="345" y1="184" x2="345" y2="196"/>
</g>
<circle cx="254" cy="190" r="6" fill="var(--c4)"/>
<text x="357" y="194" font-size="12" fill="var(--text)" font-family="var(--font-ui)">1,49</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="470" y="252">data sintetis</text>
</g>
<text x="120" y="22" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Rasio odds (OR) + IK 95% — whisker = interval kepercayaan</text>
</svg>`;

export const hd30: V2Lesson = {
  slug: "hd30-stata-spss-sas",
  track: "Health Data Science",
  module: "Tooling & Tata Kelola Data",
  title: "Stata, SPSS & SAS untuk Analis Kesehatan",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Angkanya benar, prosesnya tidak bisa dipertahankan",
      prose: [
        "Rina, analis data di sebuah RSUD, diminta kepala penelitiannya menganalisis faktor risiko diabetes pada 200 pasien rawat jalan. Ia membuka SPSS — tool yang ia kuasai sejak kuliah — mengklik Analyze → Regression → Binary Logistic, mencentang beberapa opsi, dan mendapat tabel rapi: usia signifikan, OR 1,82 per 10 tahun. Naskah dikirim ke jurnal. Tiga minggu kemudian balasan reviewer datang: “Mohon lampirkan syntax analisis untuk reproduksibilitas.” Rina panik. Ia mengklik 15 dialog tanpa mencatat satu pun; ia tidak bisa merekonstruksi persis apa yang ia lakukan.",
        "Twist-nya: tidak ada angka yang salah. OR-nya benar, p-value-nya benar. Yang gagal bukan analisisnya — melainkan pekerjaannya sebagai analis. Di riset kesehatan, output tanpa jejak langkah adalah anekdot, bukan bukti. Ironisnya, kalau Rina memakai Stata atau SAS — yang memaksa menulis perintah baris per baris — masalah ini tidak akan pernah terjadi. Lowongan analis kesehatan dan peneliti di Indonesia 2026 mencantumkan “menguasai SPSS/Stata” bukan karena angkanya beda — angkanya IDENTIK di semua tool — melainkan karena cara kerja yang bisa diaudit.",
        "Lesson ini mengajarkan peta tiga tool statistik berbayar yang mendominasi dunia kesehatan (Stata, SPSS, SAS), cara membaca output regresi logistik yang sama di ketiganya, dan disiplin reproducibility yang membedakan analis profesional dari pengguna software.",
      ],
      tasks: [],
      note: {
        title: "Kenapa tool berbayar masih relevan di era Python/R gratis",
        type: "risk",
        body: "Tiga alasan pragmatis. Pertama, lisensi institusi: mayoritas FK dan RS pendidikan di Indonesia sudah membayar lisensi SPSS/Stata kampus — analis memakai yang tersedia dan didukung. Kedua, warisan: puluhan tahun arsip analisis, SOP, dan template pelaporan ditulis dalam dialek tool ini; migrasi berarti menulis ulang semuanya. Ketiga, regulasi: pengajuan ke BPOM dan jurnal tertentu mensyaratkan jejak audit yang mapan di SAS. Analis yang hanya bisa Python akan terkejut saat atasan menyerahkan file .dta berusia 10 tahun dan berkata “lanjutkan analisis ini”.",
      },
      reference: "Angka sama di semua tool; yang dinilai adalah proses yang bisa direproduksi dan diaudit.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan perbedaan filosofi Stata, SPSS, dan SAS serta kapan masing-masing dipakai di ekosistem kesehatan Indonesia; (2) membaca tabel output regresi logistik — koefisien, OR, IK 95%, p-value — apa pun tool-nya; (3) menerjemahkan satu analisis yang sama ke “dialek” ketiga tool; (4) menerapkan disiplin reproducibility (syntax tersimpan, bukan klik).",
        "Rutenya: cerita → tujuan + bekal → tiga konsep (peta tiga tool, membaca output regresi logistik, reproducibility) → lab Python (hitung probabilitas & OR dari koefisien + tulis perintah tiga dialek) → forest plot OR dengan panduan baca → peta keputusan → mini-case standarisasi analisis RS → kuis → rangkuman. Estimasi 60 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, regresi logistik: memodelkan peluang kejadian biner (sakit/tidak) lewat fungsi logit; koefisien β diubah menjadi odds ratio dengan OR = e^β — OR > 1 berarti faktor risiko, OR < 1 berarti protektif. Kedua, interval kepercayaan 95%: rentang nilai OR yang masih konsisten dengan data; bila rentang mencakup 1, efeknya tidak signifikan secara statistik. Ketiga, p-value: peluang melihat efek sebesar ini bila sebenarnya tidak ada efek; ambang umum 0,05 — tetapi p-value bukan ukuran besar efek.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap tiga tool ini seperti tiga dialek bahasa yang sama. “Saya makan” tetap berarti sama dalam dialek mana pun — yang beda hanya cara mengucapkannya. Kuasai logikanya sekali (regresi logistik), terjemahannya tinggal menghafal pola.",
      ],
      reference: "Bekal: (1) OR = e^β, >1 = risiko; (2) IK 95% mencakup 1 = tidak signifikan; (3) p-value ≠ besar efek.",
    },
    {
      id: "konsep-tiga-tool",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga tool, tiga kepribadian",
      prose: [
        "Stata — Si Tukang Catat Rapi. Filosofi: semua lewat perintah teks yang tersimpan di do-file. Kamu mengetik `logit dm usia i.laki`, Stata menjalankan dan mencatat — mengulang analisis setahun kemudian semudah menjalankan ulang file yang sama. Kekuatannya di epidemiologi dan data panel/longitudinal; harganya paling bersahabat untuk akademisi. Kelemahannya: visualisasi dan fleksibilitas pemrograman di bawah Python/R.",
        "SPSS — Si Penjaga Gerbang Klik. Filosofi: menu klik untuk pemula, syntax untuk profesional. Hampir semua analis kesehatan Indonesia belajar statistik lewat SPSS di kampus — inilah bahasa ibu statistik kesehatan Indonesia. Tombol “Paste” mengubah klik menjadi syntax yang bisa disimpan: analis senior selalu memakainya. Kelemahannya: lisensi komersial mahal, dan godaan klik-tanpa-catat adalah jebakan reproducibility nomor satu.",
        "SAS — Si Birokrat Teliti. Filosofi: dua langkah kaku — DATA step (siapkan data) lalu PROC step (analisis, mis. `proc logistic`). Kaku, verbos, mahal — tetapi justru itu yang disukai regulator dan industri farmasi: setiap langkah eksplisit dan bisa diaudit. Kalau analisismu akan dibaca BPOM atau FDA, SAS adalah bahasa resminya.",
        "Kapan memakai apa di Indonesia: mahasiswa/RSUD/skripsi → SPSS (kampus umumnya punya lisensi, pembimbing bisa membaca outputnya); riset epidemiologi longitudinal → Stata (do-file + panel data); uji klinik industri farmasi/pengajuan regulator → SAS. Aturan praktisnya: pakai tool yang (a) institusimu sudah lisensikan, (b) kolegamu bisa membaca outputnya, dan (c) jejak analisisnya bisa disimpan sebagai teks.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Tool mahal = hasil lebih akurat”",
        type: "pitfall",
        body: "Yang benar: untuk model standar seperti regresi logistik, Stata, SPSS, SAS, R, dan Python menghasilkan angka yang IDENTIK (sampai desimal jauh) — matematikanya sama. Yang dibayar dari lisensi bukanlah akurasi, melainkan: dukungan vendor, jejak audit, kompatibilitas arsip institusi, dan kurva belajar tim. Memilih tool karena “lebih akurat” adalah kesalahpahaman; memilih karena “tim saya bisa mereproduksinya” adalah keputusan profesional.",
      },
      hints: [
        "💡 Intuisi: tanyakan “siapa yang akan membaca dan mengulang analisis ini?” sebelum “tool apa yang paling canggih?”. Jawaban pertanyaan pertama menentukan tool-nya 90% kasus.",
      ],
      reference: "Stata = do-file + epidemiologi. SPSS = klik + syntax, bahasa ibu kampus Indonesia. SAS = DATA/PROC, bahasa regulator & farmasi.",
    },
    {
      id: "konsep-output",
      eyebrow: "Langkah 4 · Konsep",
      title: "Membaca tabel regresi logistik — dalam dialek apa pun",
      prose: [
        "Definisi: output regresi logistik selalu memuat kolom yang sama dengan nama berbeda-beda. Koefisien (B / Coef.): perubahan log-odds per satu satuan prediktor. SE: standard error koefisien. p-value (Sig. / P>|z|): signifikansi. Exp(B) / Odds Ratio: OR = e^B — angka yang dilaporkan ke klinisi. IK 95% untuk OR: batas bawah–atas; mencakup 1 = tidak signifikan.",
        "Kepribadiannya: tabel ini adalah rapor terjemahan. Kolom B berbicara bahasa matematika (log-odds, sulit dicerna manusia); kolom Exp(B) berbicara bahasa klinisi (“risiko naik 82%”). Analis yang baik membaca kolom B untuk diagnosis model, tetapi melaporkan kolom Exp(B) untuk keputusan. Jangan pernah melaporkan B mentah ke dokter — itu seperti memberi resep dalam bahasa Latin.",
        "Contoh langkah-demi-langkah dari lab lesson ini: koefisien usia β = 0,06 per tahun. OR per 10 tahun = e^(0,06 × 10) = e^0,6 = 1,82. Artinya: setiap tambahan 10 tahun usia melipatgandakan odds diabetes sebesar 1,82 kali (naik 82%), dengan asumsi variabel lain tetap. Koefisien jenis kelamin laki-laki β = 0,4 → OR = e^0,4 = 1,49 — tetapi IK 95%-nya 0,9–2,5 mencakup 1, sehingga efek ini TIDAK signifikan secara statistik meski OR-nya > 1.",
      ],
      formula: String.raw`\text{logit}(p) = \ln\left(\frac{p}{1-p}\right) = \beta_0 + \beta_1 X_1 + \beta_2 X_2 \quad;\quad \text{OR} = e^{\beta}`,
      formulaNote: "logit(p) = log-odds kejadian (p = peluang diabetes). β0 = intersep (log-odds saat semua X = 0). β1, β2 = koefisien: perubahan log-odds per satu satuan X1 (usia, tahun) dan X2 (laki-laki = 1/0). OR = odds ratio = e^β: faktor pengali odds per satu satuan prediktor. Contoh: β1 = 0,06 → OR per 10 tahun = e^(0,06×10) = e^0,6 = 1,82. Peluang dari log-odds: p = 1/(1 + e^(−logit)). Contoh pasien 45 tahun laki-laki: logit = −4,5 + 0,06×45 + 0,4×1 = −1,4 → p = 1/(1+e^1,4) = 0,198 (19,8%).",
      tasks: [],
      note: {
        title: "🚨 Mitos: “OR 1,49 berarti risiko naik 49% — signifikan”",
        type: "pitfall",
        body: "Yang benar: besar OR tidak sama dengan signifikan. OR 1,49 dengan IK 95% 0,9–2,5 mencakup 1 — artinya data masih konsisten dengan “tidak ada efek”. Kesalahan klasik analis junior: melaporkan OR terbesar sebagai temuan utama tanpa melihat IK-nya. Aturan baca: cek IK dulu (mencakup 1?), baru baca besarnya. Forest plot di Langkah 7 melatih tepat kebiasaan ini.",
      },
      hints: [
        "💡 Intuisi: OR adalah “bahasa klinisi”, IK adalah “kejujurannya”. OR tanpa IK seperti harga tanpa label — kamu tidak tahu seberapa yakin boleh percaya.",
      ],
      reference: "Baca tabel: B untuk diagnosis model, Exp(B)=OR untuk laporan, IK 95% untuk kejujuran. IK mencakup 1 = tidak signifikan.",
    },
    {
      id: "konsep-repro",
      eyebrow: "Langkah 5 · Konsep",
      title: "Reproducibility — syntax adalah nyawa analisis",
      prose: [
        "Definisi: analisis reproducible berarti orang lain (atau kamu setahun kemudian) bisa menjalankan ulang langkah yang sama dan mendapat angka yang sama. Syaratnya tiga: (1) syntax/perintah tersimpan sebagai file teks (do-file Stata, syntax SPSS, program SAS); (2) data versi yang jelas (file mentah + script pembersihan, bukan “data_final_FINAL2.sav”); (3) seed acak dicatat bila ada unsur acak.",
        "Kepribadiannya: syntax adalah resep masakan, klik adalah “kira-kira saja”. Koki yang memasak “kira-kira” tidak bisa mengajari orang lain membuat rasa yang sama — dan tidak bisa membuktikan tidak ada MSG berlebih. Reviewer jurnal yang meminta syntax sebenarnya bertanya: “bolehkah saya mencicipi resepmu?” Analis yang hanya punya file output .spv tanpa syntax sama seperti koki tanpa resep.",
        "Praktik minimum yang realistis: (1) JANGAN PERNAH analisis final dari klik tanpa Paste syntax — di SPSS selalu tekan Paste, bukan OK; (2) satu do-file per analisis dengan header (tujuan, tanggal, penulis, versi data); (3) simpan output + syntax + data dalam satu folder per proyek. Tiga kebiasaan ini menaikkan nilai jualmu lebih dari sertifikasi tool apa pun — karena inilah yang ditanyakan saat interview analis senior: “tunjukkan workflow analisismu.”",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Nanti saja didokumentasikan, yang penting hasilnya dulu”",
        type: "pitfall",
        body: "Yang benar: “nanti” tidak pernah datang, dan ingatanmu tentang 15 klik tiga minggu lalu adalah fiksi. Studi menunjukkan analis tidak bisa merekonstruksi workflow klik-nya sendiri setelah 2 minggu. Dokumentasi bukan pekerjaan tambahan setelah analisis — ia ADALAH bagian analisis. Aturan: tidak ada syntax = analisis belum selesai.",
      },
      hints: [
        "💡 Intuisi kedua: anggap setiap analisis akan diaudit oleh orang yang tidak mempercayaimu. Standar ini terdengar sinis, tetapi justru membebaskan: saat datamu dipertanyakan (dan akan), kamu tinggal menyerahkan folder, bukan membela diri.",
      ],
      reference: "Reproducible = syntax tersimpan + versi data jelas + seed tercatat. Klik tanpa Paste = analisis belum selesai.",
    },
    {
      id: "lab-regresi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Logika regresi logistik + tiga dialek",
      prose: [
        "Waktunya mempraktikkan logikanya. Tool aslinya berbayar dan tidak ada di browser — tetapi matematikanya identik di mana-mana, dan menerjemahkan analisis ke dialek tiap tool adalah skill yang justru langka. Di bawah: koefisien hasil fitting regresi logistik diabetes (SINTETIS, dibuat untuk latihan): intersep −4,5; usia 0,06 per tahun; laki-laki 0,4. Tugasmu: hitung prediktor linear dan peluang untuk 3 pasien, hitung OR per 10 tahun usia, lalu “tulis” perintah analisisnya dalam tiga dialek.",
        "Coba: setelah lolos, ganti usia pasien P3 menjadi 80 — berapa peluangnya? Lalu ubah koefisien laki-laki menjadi 0 dan lihat OR-nya menjadi tepat 1,0: begitulah cara membaca “tidak ada efek” dalam bahasa koefisien.",
      ],
      tasks: [
        { id: "t1", text: "Isi `linpred` = list prediktor linear tiap pasien = −4,5 + 0,06×usia + 0,4×laki" },
        { id: "t2", text: "Isi `prob` = list peluang = 1/(1+e^(−linpred)), bulatkan 4 desimal" },
        { id: "t3", text: "Isi `or_10thn` = OR per 10 tahun usia = e^(0,06×10)" },
        { id: "t4", text: "Cetak perintah analisis dalam dialek Stata, SPSS, dan SAS (satu baris tiap dialek)" },
      ],
      expected: "linpred: [-1.4, -0.9, 0.22]\nprob: [0.1978, 0.2891, 0.5548]\nOR usia per 10 tahun: 1.8221\nStata : logit dm usia i.laki\nSPSS  : LOGISTIC REGRESSION VARIABLES dm /METHOD=ENTER usia laki.\nSAS   : proc logistic data=rs; model dm(event='1') = usia laki; run;",
      code: {
        starter: `import math
# Koefisien SINTETIS hasil fitting regresi logistik (dibuat untuk latihan)
# dm = diabetes (1/0); prediktor: usia (tahun), laki (1=laki-laki, 0=perempuan)
B0, B_USIA, B_LAKI = -4.5, 0.06, 0.4
pasien = [("P1", 45, 1), ("P2", 60, 0), ("P3", 72, 1)]  # (id, usia, laki)

# TULIS KODEMU
linpred =
prob =
or_10thn =

print("linpred:", [round(x, 2) for x in linpred])
print("prob:", [round(p, 4) for p in prob])
print(f"OR usia per 10 tahun: {or_10thn:.4f}")
print("Stata : logit dm usia i.laki")
print("SPSS  : LOGISTIC REGRESSION VARIABLES dm /METHOD=ENTER usia laki.")
print("SAS   : proc logistic data=rs; model dm(event='1') = usia laki; run;")`,
        lockLines: 7,
        solution: `import math
# Koefisien SINTETIS hasil fitting regresi logistik (dibuat untuk latihan)
# dm = diabetes (1/0); prediktor: usia (tahun), laki (1=laki-laki, 0=perempuan)
B0, B_USIA, B_LAKI = -4.5, 0.06, 0.4
pasien = [("P1", 45, 1), ("P2", 60, 0), ("P3", 72, 1)]  # (id, usia, laki)

# TULIS KODEMU
linpred = [round(B0 + B_USIA * u + B_LAKI * l, 2) for _, u, l in pasien]
prob = [round(1 / (1 + math.exp(-lp)), 4) for lp in linpred]
or_10thn = math.exp(B_USIA * 10)

print("linpred:", [round(x, 2) for x in linpred])
print("prob:", [round(p, 4) for p in prob])
print(f"OR usia per 10 tahun: {or_10thn:.4f}")
print("Stata : logit dm usia i.laki")
print("SPSS  : LOGISTIC REGRESSION VARIABLES dm /METHOD=ENTER usia laki.")
print("SAS   : proc logistic data=rs; model dm(event='1') = usia laki; run;")`,
        checks: [
          { kind: "equal", task: "t1", name: "linpred", value: [-1.4, -0.9, 0.22], label: "`linpred` = [−1.4, −0.9, 0.22]", msg: "−4,5 + 0,06×usia + 0,4×laki per pasien." },
          { kind: "equal", task: "t2", name: "prob", value: [0.1978, 0.2891, 0.5548], label: "`prob` peluang tiap pasien benar", msg: "p = 1/(1+e^(−linpred))." },
          { kind: "equal", task: "t3", name: "or_10thn", value: 1.8221, tol: 0.001, label: "`or_10thn` = 1,8221", msg: "e^(0,06×10) = e^0,6." },
          { kind: "stdout_matches", task: "t4", pattern: "Stata : logit dm", label: "Dialek Stata tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t4", pattern: "SPSS  : LOGISTIC REGRESSION", label: "Dialek SPSS tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t4", pattern: "SAS   : proc logistic", label: "Dialek SAS tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: yang kamu latih bukan tool-nya, melainkan penerjemahannya",
        body: "Perhatikan apa yang baru kamu lakukan: dari SATU set koefisien, kamu menghitung peluang (matematika universal) DAN menulis perintahnya dalam tiga dialek. Inilah skill yang dicari lowongan “menguasai SPSS/Stata”: bukan hafal menu, melainkan kemampuan berpindah dialek tanpa kehilangan makna. Tool-nya bisa dipelajari dalam seminggu saat sudah dibutuhkan; logika terjemahannya — bahwa `i.laki`, `/METHOD=ENTER`, dan `model dm = ...` adalah kalimat yang sama — adalah pemahaman konseptual yang bertahan.",
      },
      reference: "Kuasai logika sekali (koefisien → peluang → OR), terjemahkan ke dialek mana pun. Syntax tersimpan = analisis selesai.",
    },
    {
      id: "chart-or",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca forest plot seperti reviewer",
      prose: [
        "Chart di bawah adalah forest plot — cara standar melaporkan hasil regresi logistik di jurnal kesehatan. Tiga prediktor diabetes beserta interval kepercayaan 95%-nya (data sintetis, konsisten dengan lab-mu).",
        "Cara membaca: sumbu X = rasio odds; titik = estimasi OR; garis horizontal (whisker) = IK 95%; garis putus-putus vertikal di OR = 1 = garis “tidak ada efek”.",
        "Interpretasi: hipertensi OR 2,30 (IK 1,4–3,7) — efek terbesar dan signifikan (whisker tidak menyentuh garis 1). Usia per 10 tahun OR 1,82 (IK 1,2–2,8) — signifikan, konsisten dengan hitungan lab-mu. Laki-laki OR 1,49 (IK 0,9–2,5) — whisker MELEWATI garis 1: tidak signifikan; meski titiknya > 1, data masih konsisten dengan tidak ada efek. Inilah kebiasaan reviewer: matanya langsung ke whisker, bukan ke titiknya.",
      ],
      tasks: [],
      figure: { svg: OR_SVG, alt: "Forest plot rasio odds tiga prediktor beserta interval kepercayaan 95 persen", caption: "Forest plot OR + IK 95% — whisker yang melewati garis 1 = tidak signifikan (data sintetis)." },
      hints: [
        "💡 Intuisi: dalam forest plot, LEBAR whisker = ketidakpastianmu. Whisker sempit = estimasi presisi (sampel besar / efek konsisten); whisker lebar = data belum cukup bicara. Jangan pernah membandingkan dua titik tanpa membandingkan whiskernya.",
      ],
      reference: "Baca forest plot: titik = estimasi, whisker = IK 95%, garis 1 = batas signifikansi. Mata ke whisker dulu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Tool apa untuk situasi apa",
      prose: [
        "Skenario 1 — “Skripsi/tesis di FK Indonesia”: kondisi = pembimbing memakai SPSS, kampus punya lisensi, deadline mepet. Keputusan: SPSS — dan selalu tekan Paste untuk menyimpan syntax. Alasan: kecepatan + kompatibilitas pembimbing mengalahkan idealisme tool.",
        "Skenario 2 — “Riset epidemiologi longitudinal multi-tahun”: kondisi = data panel, analisis diulang tiap wave, publikasi internasional. Keputusan: Stata — do-file membuat pengulangan antar wave trivial dan murah. Alasan: reproducibility bawaan + keunggulan data panel.",
        "Skenario 3 — “Analisis untuk pengajuan regulator / industri farmasi”: kondisi = hasil akan diaudit pihak ketiga. Keputusan: SAS — jejak DATA/PROC step yang eksplisit adalah bahasa audit. Alasan: regulator membeli kepastian proses, bukan kecanggihan model.",
        "Skenario 4 — “Tim campuran dengan skill berbeda”: kondisi = sebagian bisa Python, sebagian hanya SPSS. Keputusan: pakai tool yang SEMUA anggota bisa membaca outputnya untuk analisis final, Python/R untuk eksplorasi. Alasan: analisis yang tidak bisa dibaca tim tidak bisa di-review — dan yang tidak bisa di-review tidak boleh dipakai untuk keputusan.",
        "Skenario 5 — “Tidak ada lisensi sama sekali”: kondisi = anggaran nol. Keputusan: jangan bajakan — pakai R/Python (gratis, legal, dan justru lebih kuat), atau minta akses lisensi institusi. Alasan: analisis hasil software bajakan tidak bisa dipertahankan di depan auditor maupun reviewer; risikonya bukan teknis, melainkan kredibilitas.",
        "Aturan praktis 10 detik: tanya siapa yang membaca & mengulang → cek lisensi institusi → pilih yang jejaknya tersimpan sebagai teks → kuasai satu sampai mahir, pahami logika ketiganya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih tool karena “paling canggih” lalu memaksa seluruh tim mengikutinya. Hasilnya: analis senior tidak bisa me-review, pembimbing tidak bisa membuka file-nya, dan saat kamu resign tidak ada yang bisa melanjutkan. Tool terbaik adalah tool yang tim-mu bisa pertahankan tanpamu.",
      },
      reference: "Pembaca & pengulang menentukan tool. Jejak teks menentukan profesionalitas. Jangan bajakan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Standarisasi analisis di RSUD",
      prose: [
        "Situasinya: kamu diangkat koordinator analisis di RSUD dengan 6 analis. Kondisinya berantakan: 3 orang pakai SPSS (klik, tanpa syntax), 2 orang pakai Excel, 1 orang pakai R. Setiap publikasi ditolak reviewer dengan alasan yang sama: tidak reproducible. Direktur memberimu 3 bulan untuk menstandarkan. Lisensi yang tersedia: SPSS kampus (terbatas 10 seat) dan Stata (5 seat).",
        "Pertanyaan analisis: (a) Tool apa yang kamu tetapkan sebagai standar analisis final, dan kenapa? (b) Aturan workflow apa yang kamu wajibkan (spesifik, bisa diaudit)? (c) Bagaimana menangani analis Excel yang resisten?",
        "Pembahasan: (a) SPSS sebagai standar final — alasannya bukan teknis, melainkan manusiawi: mayoritas tim sudah bisa, pembimbing eksternal bisa membaca outputnya, dan lisensi tersedia. Stata untuk analis yang mengerjakan riset longitudinal (2 orang). Kuncinya: standarnya adalah WORKFLOW, bukan tool tunggal — semua analisis final wajib punya syntax tersimpan. (b) Tiga aturan: (1) tidak ada analisis final dari klik tanpa Paste — folder proyek wajib berisi syntax + data versi + output; (2) template header syntax (tujuan, tanggal, penulis, versi data); (3) peer review: satu analis menjalankan ulang syntax koleganya sebelum submit — “reproduksi internal”. (c) Analis Excel tidak dilarang memakai Excel untuk eksplorasi — tetapi output final untuk publikasi/keputusan wajib lewat pipeline syntax. Beri pelatihan 2 minggu + tunjukkan bahwa Paste tidak lebih sulit dari klik. Resistensi biasanya soal takut terlihat bodoh, bukan soal tool — atasi dengan mentoring, bukan perintah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Standar “syntax tersimpan + peer reproduksi” ini identik dengan model risk governance di bank: setiap model kredit wajib punya dokumentasi, versi data, dan validasi independen sebelum dipakai. Analis kesehatan yang terbiasa workflow reproducible sedang berlatih disiplin yang sama dengan model validator di industri keuangan — portofolio skill yang terbawa lintas industri.",
      },
      reference: "Standarkan workflow (syntax tersimpan + reproduksi sejawat), bukan sekadar tool. Manusia menentukan tool.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Stata = do-file + epidemiologi; SPSS = klik + syntax (bahasa ibu kampus Indonesia); SAS = DATA/PROC (bahasa regulator & farmasi) — angka identik, yang beda prosesnya.",
        "Baca output: B untuk diagnosis model, Exp(B) = OR untuk laporan, IK 95% untuk kejujuran — mencakup 1 = tidak signifikan.",
        "OR per k satuan = e^(β×k); peluang dari logit: p = 1/(1+e^(−logit)).",
        "Reproducible = syntax tersimpan + versi data jelas + seed tercatat; klik tanpa Paste = analisis belum selesai.",
        "Forest plot: mata ke whisker dulu — lebar = ketidakpastian, melewati garis 1 = tidak signifikan.",
      ],
      quiz: [
        {
          q: "Output menunjukkan OR jenis kelamin = 1,49 dengan IK 95% 0,9–2,5. Kesimpulan yang tepat?",
          options: [
            { text: "Tidak signifikan — IK mencakup 1, data masih konsisten dengan tidak ada efek", why: "Benar: signifikansi ditentukan IK/p-value, bukan besar OR. Titik 1,49 tanpa whisker yang jelas tidak bisa diklaim.", correct: true },
            { text: "Signifikan — OR di atas 1 berarti risiko naik 49%", why: "Salah: 49% adalah estimasi titik; IK yang mencakup 1 membatalkan klaim signifikansi." },
            { text: "Protektif — karena batas bawah di bawah 1", why: "Salah: batas bawah < 1 tidak berarti protektif; artinya arah efek belum pasti." },
            { text: "Perlu OR di atas 2 baru bisa dinilai", why: "Salah: tidak ada ambang ajaib; signifikansi soal IK, bukan besar angka." },
          ],
        },
        {
          q: "Kapan Stata lebih tepat daripada SPSS untuk peneliti Indonesia?",
          options: [
            { text: "Riset epidemiologi longitudinal multi-wave yang diulang tiap tahun — do-file membuat pengulangan murah dan teraudit", why: "Benar: kekuatan Stata = reproducibility bawaan + data panel; inilah kasus di mana ia mengalahkan SPSS.", correct: true },
            { text: "Selalu — Stata lebih modern", why: "Salah: tidak ada yang selalu menang; untuk skripsi dengan pembimbing SPSS, SPSS lebih tepat." },
            { text: "Ketika ingin hasil lebih akurat", why: "Salah: akurasi identik — yang dibayar adalah workflow, bukan angka." },
            { text: "Tidak pernah — SPSS sudah cukup untuk semua", why: "Salah: untuk data panel dan reproduksibilitas ketat, Stata unggul nyata." },
          ],
        },
        {
          q: "Analis mengklik 15 dialog SPSS dan mendapat hasil benar, tetapi tidak menyimpan syntax. Masalahnya?",
          options: [
            { text: "Tidak reproducible — ia sendiri tidak bisa merekonstruksi langkahnya 2 minggu lagi; hasil = anekdot", why: "Benar: inilah inti lesson ini. Hasil tanpa jejak tidak bisa diaudit, diulang, atau dipertahankan.", correct: true },
            { text: "Tidak ada — hasilnya benar", why: "Salah: kebenaran angka tidak menyelamatkan proses yang tidak bisa diverifikasi." },
            { text: "Harus mengulang dengan Stata", why: "Salah: masalahnya bukan tool, melainkan kebiasaan — di Stata pun bisa ceroboh." },
            { text: "Cukup screenshot tiap dialog", why: "Salah: screenshot tidak bisa dijalankan ulang; syntax bisa." },
          ],
        },
        {
          q: "β usia = 0,06 per tahun. OR per 10 tahun adalah?",
          options: [
            { text: "e^(0,06 × 10) = 1,82", why: "Benar: OR per k satuan = e^(β×k). Perkalian di dalam eksponen, bukan perkalian OR.", correct: true },
            { text: "0,06 × 10 = 0,6", why: "Salah: 0,6 adalah perubahan log-odds, bukan OR — lupa eksponensiasi." },
            { text: "1 + 0,06 × 10 = 1,6", why: "Salah: rumus linear tidak berlaku untuk OR; harus lewat eksponen." },
            { text: "Tidak bisa dihitung tanpa data mentah", why: "Salah: OR per k satuan hanya butuh β — transformasi aljabar murni." },
          ],
        },
        {
          q: "Di forest plot, whisker satu prediktor melewati garis vertikal OR = 1. Artinya?",
          options: [
            { text: "Tidak signifikan secara statistik pada tingkat kepercayaan itu", why: "Benar: garis 1 = tidak ada efek; IK yang mencakupnya berarti efek nol masih konsisten dengan data.", correct: true },
            { text: "Efeknya pasti nol", why: "Salah: tidak signifikan ≠ terbukti nol — hanya belum cukup bukti." },
            { text: "Plotnya salah digambar", why: "Salah: whisker melewati 1 adalah hasil yang valid dan informatif." },
            { text: "Prediktor harus dibuang dari model", why: "Salah: keputusan variabel ikut teori dan tujuan model, bukan sekadar signifikansi satu sampel." },
          ],
        },
        {
          q: "Institusi tanpa anggaran lisensi butuh analisis regresi logistik yang bisa diaudit. Keputusan tepat?",
          options: [
            { text: "Pakai R/Python (gratis, legal) dengan script tersimpan — reproducibility tidak butuh lisensi mahal", why: "Benar: yang dibeli lisensi adalah dukungan & ekosistem, bukan kemampuan reproducible — script R/Python justru paling transparan.", correct: true },
            { text: "Pakai SPSS bajakan — yang penting bisa", why: "Salah: analisis dari software bajakan tidak bisa dipertahankan di depan auditor/reviewer; taruhannya kredibilitas." },
            { text: "Tidak usah analisis — tanpa tool berbayar tidak valid", why: "Salah: R/Python adalah standar emas banyak jurnal; “berbayar = valid” adalah mitos." },
            { text: "Minta tiap analis pakai tool favoritnya masing-masing", why: "Salah: tanpa standar, tidak ada yang bisa me-review pekerjaan orang lain." },
          ],
        },
      ],
      next: { label: "HD31 — Metrik Mutu HEDIS & CMS Star Ratings", href: "/v2/learn/hd31-hedis-cms" },
    },
  ],
};
