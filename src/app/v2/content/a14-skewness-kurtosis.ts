import type { V2Lesson } from "../lib/types";

export const a14: V2Lesson = {
  slug: "a14-skewness-kurtosis",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.4 Skewness & Kurtosis: Membaca Ekor yang Menyimpan Risiko",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-var-jebol",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "VaR Rp 2 miliar yang jebol Rp 8 miliar",
      prose: [
        "Divisi treasury sebuah bank melaporkan ke direksi: Value at Risk 99% portofolio = Rp 2 miliar. Artinya kerugian harian di atas Rp 2 miliar seharusnya terjadi kurang dari 1% hari — kira-kira 2,5 hari dalam setahun perdagangan. Modelnya rapi: mean, SD, lalu VaR dengan rumus distribusi normal.",
        "Saat guncangan pasar datang, portofolio rugi Rp 8 miliar dalam sehari — empat kali lipat VaR. Menurut model normal, kejadian itu berpeluang 0,0001%: sekali dalam 4.000 tahun. Nyatanya terjadi tahun ini juga. Audit menemukan return portofolio leptokurtik — ekornya tebal, crash kecil-menengah terjadi jauh lebih sering dari ramalan kurva normal. Model tidak salah hitung; model salah mengira bentuk dunia.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kelipatan` = kerugian riil / VaR model" },
        { id: "t2", text: "Hitung `hari_prediksi` = 1% dari 250 hari perdagangan" },
      ],
      expected: "kelipatan=4.0  hari_prediksi=2.5",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Mean dan SD memberi tahu lokasi dan sebaran. Tapi bentuk distribusi — miring ke mana, setebal apa ekornya — itulah yang menyimpan risiko sesungguhnya. Model risiko yang tidak memeriksa bentuk ekor akan jebol seperti contoh ini.",
      },
      hints: [
        "kelipatan = realita / var_model.",
        "1% dari 250 = 0,01 × 250.",
        "hari_prediksi = 0.01 * 250",
      ],
      code: {
        starter: `var_model = 2      # miliar Rp\nrealita = 8        # miliar Rp\n\n# TULIS KODEMU\nkelipatan = \nhari_prediksi = \n\nprint(f"kelipatan={kelipatan}  hari_prediksi={hari_prediksi}")`,
        lockLines: 2,
        solution: `var_model = 2      # miliar Rp\nrealita = 8        # miliar Rp\n\n# TULIS KODEMU\nkelipatan = realita / var_model\nhari_prediksi = 0.01 * 250\n\nprint(f"kelipatan={kelipatan}  hari_prediksi={hari_prediksi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kelipatan", value: 4.0, tol: 1e-9, label: "`kelipatan` seharusnya 4.0", msg: "8 / 2 = 4 kali lipat VaR." },
          { kind: "equal", task: "t2", name: "hari_prediksi", value: 2.5, tol: 1e-9, label: "`hari_prediksi` seharusnya 2.5", msg: "1% dari 250 hari = 2,5 hari per tahun." },
          { kind: "stdout_matches", task: "t2", pattern: "kelipatan=4(\\.0)?\\s+hari_prediksi=2\\.5", label: "`print` menampilkan keduanya", msg: "Format: kelipatan=...  hari_prediksi=... ." },
        ],
      },
      reference: "VaR 99% normal gagal total pada data berekor tebal.",
    },
    {
      id: "skewness",
      eyebrow: "Langkah 2 · Skewness",
      title: "Skewness: nama ekor, bukan nama massa",
      prose: [
        "Skewness mengukur asimetri: ke arah mana ekor memanjang. Datanya dibakukan dulu (z-score), lalu dipangkatkan tiga — pangkat ganjil mempertahankan tanda, jadi suku positif menang kalau ekor kanan lebih berat. Data 4, 5, 6, 7, 18: mean 8, SD sampel ≈ 5,70. Z-score dipangkatkan tiga memberi −0,345; −0,146; −0,043; −0,005; +5,397. Rata-ratanya ≈ 0,97 → miring kanan.",
        "Perhatikan: satu data 18 menyumbang +5,4 sendirian. Pangkat tiga membuat satu titik jauh mengalahkan empat titik dekat — itulah mengapa skewness sensitif outlier. Dan ingat: skew positif artinya ekornya di kanan, massanya menumpuk di kiri. Mean selalu tertarik ke arah ekor: right skew → mean > median.",
      ],
      formula: String.raw`\gamma_1 = \frac{1}{n}\sum_{i=1}^{n}\left(\frac{x_i - \bar{x}}{s}\right)^3`,
      formulaNote: "gamma_1 = skewness (koefisien kemiringan); x_i, x-bar, s = data, mean, SD; (x_i - x-bar)/s = data terstandarisasi; pangkat 3 mempertahankan tanda — ekor kanan panjang membuat gamma_1 positif.",
      tasks: [
        { id: "t1", text: "Hitung `skew` dari `d` dengan rumus manual (2 desimal)" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "skew=0.97",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Skew positif artinya datanya condong ke kanan. Yang condong ke kanan adalah ekornya — massanya justru menumpuk di kiri. Analis yang salah membaca ini mencari mayoritas di tempat yang salah.",
      },
      hints: [
        "Bakukan dulu: z = (x − mean)/sd.",
        "Pangkatkan tiga tiap z, lalu rata-ratakan.",
        "skew = sum(((x-m)/sd)**3 for x in d)/len(d)",
      ],
      code: {
        starter: `import statistics as st\n\nd = [4, 5, 6, 7, 18]\n\n# TULIS KODEMU\nm = st.mean(d)\nsd = st.stdev(d)\nskew = \n\nprint(f"skew={skew:.2f}")`,
        lockLines: 3,
        solution: `import statistics as st\n\nd = [4, 5, 6, 7, 18]\n\n# TULIS KODEMU\nm = st.mean(d)\nsd = st.stdev(d)\nskew = sum(((x-m)/sd)**3 for x in d)/len(d)\n\nprint(f"skew={skew:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skew", value: 0.97, tol: 0.01, label: "`skew` sekitar 0.97", msg: "Ikuti tiga langkah: bakukan → pangkat tiga → rata-ratakan. Hasilnya ≈ 0,97." },
          { kind: "stdout_matches", task: "t2", pattern: "skew=0\\.97", label: "`print` menampilkan skew", msg: "Format dua desimal: skew=0.97." },
        ],
      },
      reference: "Diagnosa 5 detik: mean > median → curigai right skew.",
    },
    {
      id: "kurtosis",
      eyebrow: "Langkah 3 · Kurtosis",
      title: "Kurtosis: radar kejadian ekstrem",
      prose: [
        "Kurtosis mengukur ketebalan ekor: seberapa sering kejadian ekstrem muncul dibanding prediksi normal. Pangkat empat menghilangkan tanda — yang dihitung murni jarak ekstrem. Satu data 4 SD dari mean menyumbang 4⁴ = 256x dibanding data di mean. Dikurangi 3 agar distribusi normal = 0 (disebut excess kurtosis).",
        "Interpretasi: 0 = mesokurtik (setebal ekor normal, contoh: tinggi badan). > 0 = leptokurtik (ekor tebal — return saham harian: crash −10% terjadi jauh lebih sering dari ramalan normal). < 0 = platikurtik (ekor tipis, contoh: distribusi mendekati uniform).",
      ],
      formula: String.raw`\gamma_2 = \frac{1}{n}\sum_{i=1}^{n}\left(\frac{x_i - \bar{x}}{s}\right)^4 - 3`,
      formulaNote: "gamma_2 = excess kurtosis; pangkat 4 menghilangkan tanda — yang dihitung murni jarak ekstrem; dikurangi 3 agar distribusi normal = 0; positif = ekor lebih tebal dari normal.",
      tasks: [
        { id: "t1", text: "Hitung excess kurtosis `kurt` dari `rets` (2 desimal)" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "kurt=3.44",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Kurtosis tinggi berarti puncaknya runcing. Salah: kurtosis mengukur bobot ekor, bukan ketajaman puncak. Distribusi bisa berpuncak datar tapi berekor tebal — fokus ke ujung-ujung, bukan ke tengah.",
      },
      hints: [
        "Rumahnya sama dengan skewness, pangkatnya empat lalu kurangi 3.",
        "Jangan lupa: excess kurtosis = mentah − 3.",
        "kurt = sum(((x-m)/sd)**4 for x in rets)/len(rets) - 3",
      ],
      code: {
        starter: `import statistics as st\n\n# return harian (%), satu crash -8\nrets = [0.5, 0.3, -0.2, 0.4, 0.1, -0.3, 0.2, -0.1, 0.3, -8.0]\n\n# TULIS KODEMU\nm = st.mean(rets)\nsd = st.stdev(rets)\nkurt = \n\nprint(f"kurt={kurt:.2f}")`,
        lockLines: 6,
        solution: `import statistics as st\n\n# return harian (%), satu crash -8\nrets = [0.5, 0.3, -0.2, 0.4, 0.1, -0.3, 0.2, -0.1, 0.3, -8.0]\n\n# TULIS KODEMU\nm = st.mean(rets)\nsd = st.stdev(rets)\nkurt = sum(((x-m)/sd)**4 for x in rets)/len(rets) - 3\n\nprint(f"kurt={kurt:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kurt", value: 3.44, tol: 0.02, label: "`kurt` sekitar 3.44", msg: "Satu crash −8% mendominasi pangkat empat. Hasilnya ≈ 3,44 — leptokurtik jelas." },
          { kind: "stdout_matches", task: "t2", pattern: "kurt=3\\.44", label: "`print` menampilkan kurt", msg: "Format dua desimal: kurt=3.44." },
        ],
      },
      reference: "γ₂ > 1 pada return/loss → jangan percaya VaR normal.",
    },
    {
      id: "transformasi",
      eyebrow: "Langkah 4 · Transformasi",
      title: "Log dan akar: menjinakkan ekor kanan",
      prose: [
        "Kalau data sangat miring tapi model butuh normalitas (regresi linear), ubah bentuk datanya. Log transform memampatkan angka besar jauh lebih agresif dari angka kecil. Pendapatan 5, 8, 12, 50, 200 juta (bentangan 195 juta): ln-nya 15,4; 15,9; 16,3; 17,7; 19,1 — bentangan baru hanya 3,7. Kemiringan runtuh.",
        "Akar kuadrat efeknya seperti log tapi lebih lembut — cocok untuk data count (jumlah klaim, transaksi fraud per hari) dengan skew sedang. Box-Cox mengoptimasi parameter lambda otomatis (lambda 0 = log, 1 = tanpa transformasi), tapi hasilnya sulit dijelaskan ke direksi. Tiga pengecualian: left skew (log menarik ke arah yang salah), model tree-based (tidak peduli distribusi), dan stakeholder yang butuh angka asli.",
      ],
      formula: String.raw`y_i = \ln(x_i), \quad x_i > 0`,
      formulaNote: "y_i = data hasil transformasi; ln = logaritma natural — memampatkan angka besar jauh lebih agresif dari angka kecil; syarat x_i > 0 karena log tak terdefinisi untuk nol/negatif.",
      tasks: [
        { id: "t1", text: "Hitung `bentang_asli` = max − min pendapatan" },
        { id: "t2", text: "Hitung `bentang_log` = max(ln) − min(ln), 1 desimal" },
      ],
      expected: "bentang_asli=195000000  bentang_log=3.7",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Data miring → langsung log transform, selalu. Tiga pengecualian: left skew menarik ke arah yang salah, model nonparametrik/tree-based tidak peduli bentuk, dan rata-rata log-pendapatan tidak bisa dipresentasikan ke direksi tanpa diterjemahkan balik.",
      },
      hints: [
        "math.log = log natural.",
        "Bentang = nilai terbesar − nilai terkecil.",
        "bentang_log = round(max(lp)-min(lp), 1)",
      ],
      code: {
        starter: `import math\n\npendapatan = [5000000, 8000000, 12000000, 50000000, 200000000]\n\n# TULIS KODEMU\nbentang_asli = \nlp = [math.log(x) for x in pendapatan]\nbentang_log = \n\nprint(f"bentang_asli={bentang_asli}  bentang_log={bentang_log}")`,
        lockLines: 3,
        solution: `import math\n\npendapatan = [5000000, 8000000, 12000000, 50000000, 200000000]\n\n# TULIS KODEMU\nbentang_asli = max(pendapatan)-min(pendapatan)\nlp = [math.log(x) for x in pendapatan]\nbentang_log = round(max(lp)-min(lp), 1)\n\nprint(f"bentang_asli={bentang_asli}  bentang_log={bentang_log}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bentang_asli", value: 195000000, tol: 1, label: "`bentang_asli` seharusnya 195000000", msg: "200 jt − 5 jt = 195 jt." },
          { kind: "equal", task: "t2", name: "bentang_log", value: 3.7, tol: 1e-9, label: "`bentang_log` seharusnya 3.7", msg: "ln(200jt) − ln(5jt) ≈ 3,69 → 3,7." },
          { kind: "stdout_matches", task: "t2", pattern: "bentang_asli=195000000\\s+bentang_log=3\\.7", label: "`print` menampilkan keduanya", msg: "Format: bentang_asli=...  bentang_log=... ." },
        ],
      },
      reference: "math.log(x) butuh x > 0; untuk data mengandung nol pakai log(x+1).",
    },
    {
      id: "minicase-lgd",
      eyebrow: "Langkah 5 · Mini-case",
      title: "LGD: mean 18%, tapi tipikalnya 12%",
      prose: [
        "Kamu analis risiko kredit. Dari 1.000 kredit macet: 900 kredit LGD 5–20% (ada agunan), 80 kredit LGD 30–60% (agunan bermasalah), 20 kredit LGD 90–100% (tanpa agunan, macet total). Statistiknya: mean LGD 18%, median 12%, γ₁ = +2,6, excess kurtosis γ₂ = 8,4.",
        "(a) Mean 18% bukan kerugian tipikal: γ₁ = +2,6 berarti mean tertarik 20 kredit bencana; yang jujur = median 12%. Untuk CKPN pakai distribusi per bucket LGD × exposure. (b) Regresi linear butuh transformasi dulu — LGD dalam (0,1) dan sangat miring: kandidatnya logit transform atau Box-Cox; verifikasi residual sesudahnya. (c) VaR normal akan jebol: γ₂ = 8,4 berarti LGD 90–100% terjadi jauh lebih sering dari ramalan normal — pakai expected shortfall atau VaR historis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih` = mean − median (diagnosa arah skew)" },
        { id: "t2", text: "Tentukan `ekor` = \"tebal\" jika kurtosis > 1, selain itu \"tipis\"" },
      ],
      expected: "selisih=6  ekor=tebal",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Loss kredit yang right-skewed DAN leptokurtik = kombinasi paling berbahaya: potensi loss besar (ekor kanan) yang terjadi lebih sering dari dugaan (ekor tebal). Kalau laporan risikomu hanya menampilkan mean dan SD, dua informasi ini hilang total.",
      },
      hints: [
        "selisih = mean − median; positif = curigai right skew.",
        "Ambang ekor tebal: γ₂ > 1.",
        "ekor = \"tebal\" if kurt > 1 else \"tipis\"",
      ],
      code: {
        starter: `mean_lgd, median_lgd = 18, 12   # persen\nskew, kurt = 2.6, 8.4\n\n# TULIS KODEMU\nselisih = \nekor = \n\nprint(f"selisih={selisih}  ekor={ekor}")`,
        lockLines: 2,
        solution: `mean_lgd, median_lgd = 18, 12   # persen\nskew, kurt = 2.6, 8.4\n\n# TULIS KODEMU\nselisih = mean_lgd - median_lgd\nekor = "tebal" if kurt > 1 else "tipis"\n\nprint(f"selisih={selisih}  ekor={ekor}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih", value: 6, tol: 1e-9, label: "`selisih` seharusnya 6", msg: "18 − 12 = 6 → mean tertarik ke ekor kanan." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih=6\\s+ekor=tebal", label: "`print` menampilkan keduanya", msg: "Format: selisih=6  ekor=tebal." },
        ],
      },
      reference: "γ₁ = +2,6: jangan sebut mean loss sebagai kerugian tipikal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Skewness = arah ekor, bukan arah massa; mean selalu tertarik ke arah ekor.",
        "Kurtosis = ketebalan ekor; γ₂ > 1 pada return/loss berarti VaR normal tidak bisa dipercaya.",
        "Pangkat tiga membuat skewness sensitif outlier; pangkat empat membuat kurtosis radar ekstrem.",
        "Log transform menjinakkan right skew positif; tidak untuk left skew, model tree-based, atau laporan ke direksi tanpa terjemahan balik.",
        "Right-skewed + leptokurtik pada loss = kombinasi paling berbahaya.",
      ],
      next: { label: "A1.5 — Outlier", href: "/learn/a15-kuantil-outlier" },
      quiz: [
        {
          q: "Data loss kredit: kebanyakan kecil, sedikit sangat besar. Skewness-nya?",
          options: [
            { text: "Negatif (miring kiri)", why: "Ekor panjangnya di sisi besar — itu kanan, bukan kiri." },
            { text: "Nol (simetris)", why: "Kebanyakan kecil + sedikit sangat besar = tidak simetris." },
            { text: "Positif (miring kanan)", why: "Ekor panjang di kanan (loss besar). Pola umum data risiko — dan alasan mean loss bisa menipu.", correct: true },
            { text: "Tidak bisa ditentukan", why: "Bisa: deskripsi ekornya sudah jelas." },
          ],
        },
        {
          q: "Kamu pakai model normal untuk return saham (leptokurtik). Apa risikonya?",
          options: [
            { text: "Overestimate risiko", why: "Sebaliknya: ekor tebal berarti ekstrem lebih sering dari ramalan normal." },
            { text: "Underestimate kejadian ekstrem", why: "Model meremehkan risiko — salah satu pelajaran krisis 2008.", correct: true },
            { text: "Tidak ada masalah", why: "Ada: VaR normal jebol seperti cerita pembuka." },
            { text: "Model jadi lebih akurat", why: "Asumsi yang salah tidak membuat model lebih akurat." },
          ],
        },
        {
          q: "Data pendapatan sangat right-skewed dipakai untuk regresi linear (asumsi normalitas). Langkah terbaik?",
          options: [
            { text: "Langsung pakai — regresi tidak peduli distribusi", why: "Regresi linear mengasumsikan residual normal; prediktor sangat skewed merusaknya." },
            { text: "Log transform, lalu cek apakah distribusi membaik", why: "Log menjinakkan ekor kanan; verifikasi dengan histogram sesudahnya.", correct: true },
            { text: "Hapus semua data di atas Rp 50 juta", why: "Menghapus data valid = memalsukan distribusi." },
            { text: "Ganti ke model tree-based tanpa cek apa pun", why: "Tree-based memang tidak peduli, tapi keputusan tanpa cek bukan analisis." },
          ],
        },
        {
          q: "Distribusi loss: γ₁ = +2,3. Di mana massa data dan di mana bahayanya?",
          options: [
            { text: "Massa di kanan, bahaya di kiri", why: "Terbalik: skew positif = ekor di kanan." },
            { text: "Massa di kiri (loss kecil), bahaya di ekor kanan (loss besar)", why: "Mayoritas loss kecil, tapi bahaya sesungguhnya di ekor kanan — sedikit, tapi besar. Profil risiko kredit klasik.", correct: true },
            { text: "Massa dan bahaya sama-sama di tengah", why: "Skew +2,3 berarti jauh dari simetris." },
          ],
        },
        {
          q: "Junior berkata: kurtosis portofolio kita tinggi, berarti return menumpuk runcing di tengah — aman. Status klaim ini?",
          options: [
            { text: "Benar — puncak runcing = stabil", why: "Kurtosis tidak mengukur puncak." },
            { text: "Salah — kurtosis mengukur bobot ekor, bukan puncak; kurtosis tinggi = kejadian ekstrem lebih sering", why: "Salah yang berbahaya: tenang di tengah sering berpasangan dengan brutal di ujung.", correct: true },
            { text: "Benar sebagian — hanya untuk data normal", why: "Untuk data normal pun interpretasinya soal ekor, bukan puncak." },
          ],
        },
      ],
      note: {
        title: "Intuisi: yang menentukan nasibmu adalah ekornya, bukan massanya",
        body: "Lima heuristik. Satu: skewness menamai ekor, bukan massa — skew positif berarti ekor kanan yang panjang, dan mean selalu tertarik ke arah ekor; bila mean jauh di atas median, cari siapa yang menariknya. Dua: kurtosis adalah radar kejadian ekstrem — return saham berekor tebal membuat “kejadian sekali dalam 4.000 tahun” versi normal terjadi tahun ini juga; VaR yang mengabaikannya jebol dengan gaya. Tiga: pangkat tiga dan empat membuat satu titik jauh mengalahkan ratusan titik dekat — momen tinggi sensitif outlier secara struktural; satu data bisa menulis ulang ceritamu. Empat: transformasi log mengubah pertanyaan yang kamu jawab — pastikan pertanyaan barunya masih bermakna bisnis sebelum merayakan normalitasnya; dan ingat syaratnya: hanya untuk x positif. Lima: untuk risiko, laporkan ekor secara langsung (persentil ekstrem, expected shortfall) — momen adalah ringkasan yang elegan tetapi ekorlah yang menagih. Enam: waspadai transformasi yang menyembunyikan ekor — log membuat data terlihat normal tetapi ekor aslinya tetap ada di dunia nyata; model yang tenang di skala log bisa tetap jebol di skala rupiah.",
      },
    },
  ],
};
