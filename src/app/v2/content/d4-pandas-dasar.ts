import type { V2Lesson } from "../lib/types";

export const d4: V2Lesson = {
  slug: "d4-pandas-dasar",
  track: "Python",
  module: "pandas",
  title: "D4 pandas: DataFrame & Berpikir Tabel",
  estMinutes: 55,
  steps: [
    {
      id: "dataframe",
      eyebrow: "Langkah 1 · DataFrame & Series",
      title: "Cerita pembuka: Excel 1 juta baris yang crash",
      prose: [
        "File Excel 1 juta baris: dibuka 5 menit, filter 1 menit, crash saat sort. Padahal tugasnya sederhana: rata-rata gaji per kota untuk yang dpd = 0. Dengan pandas — Excel terprogram — tugas itu 3 baris kode dalam 2 detik.",
        "DataFrame adalah tabel 2D, Series adalah satu kolom 1D. `df['dpd']` memberi Series; `df[['nama','dpd']]` memberi DataFrame. Tiga perintah pertama untuk DataFrame baru: `df.head()`, `df.info()`, `df.describe()` — 30 detik menjadi peta data. Dan selalu cek `df.dtypes`.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Buat DataFrame `df` dari dict `data`" },
        { id: "t2", text: "Hitung `n_baris`, `n_kolom` dari `df.shape`, dan `n_jakarta`" },
      ],
      expected: "shape=(3, 3)  n_jakarta=2",
      note: {
        title: "Sering salah",
        body: "Mengira kolom string bertipe 'string'. Di pandas, string terbaca sebagai `object` — dan kolom angka yang tercampur teks juga jadi object sehingga tidak bisa dihitung. Cek dtypes selalu; konversi dengan `pd.to_numeric(..., errors='coerce')`.",
      },
      hints: [
        "df = pd.DataFrame(data).",
        "n_baris, n_kolom = df.shape.",
        "n_jakarta = (df['kota'] == 'Jakarta').sum()",
      ],
      code: {
        starter: `import pandas as pd\n\ndata = {'nama': ['Andi', 'Budi', 'Citra'],\n        'kota': ['Jakarta', 'Bandung', 'Jakarta'],\n        'dpd': [0, 15, 45]}\n\n# TULIS KODEMU\ndf = \nn_baris, n_kolom = \nn_jakarta = \n\nprint(f"shape={(n_baris, n_kolom)}  n_jakarta={n_jakarta}")\nprint(df.dtypes)`,
        lockLines: 5,
        solution: `import pandas as pd\n\ndata = {'nama': ['Andi', 'Budi', 'Citra'],\n        'kota': ['Jakarta', 'Bandung', 'Jakarta'],\n        'dpd': [0, 15, 45]}\n\n# TULIS KODEMU\ndf = pd.DataFrame(data)\nn_baris, n_kolom = df.shape\nn_jakarta = (df['kota'] == 'Jakarta').sum()\n\nprint(f"shape={(n_baris, n_kolom)}  n_jakarta={n_jakarta}")\nprint(df.dtypes)`,
        checks: [
          { kind: "defined", task: "t1", name: "df", label: "`df` terdefinisi", msg: "Buat DataFrame dari dict data." },
          { kind: "equal", task: "t2", name: "n_baris", value: 3, tol: 1e-9, label: "`n_baris` = 3", msg: "df.shape = (baris, kolom)." },
          { kind: "equal", task: "t2", name: "n_kolom", value: 3, tol: 1e-9, label: "`n_kolom` = 3", msg: "Tiga kolom: nama, kota, dpd." },
          { kind: "equal", task: "t2", name: "n_jakarta", value: 2, tol: 1e-9, label: "`n_jakarta` = 2", msg: "Andi dan Citra ber-kota Jakarta." },
          { kind: "stdout_matches", task: "t2", pattern: "shape=\\(3, 3\\)\\s+n_jakarta=2", label: "`print` menampilkan shape", msg: "Format: shape=(3, 3)  n_jakarta=2." },
        ],
      },
      reference: "pd.DataFrame(dict). df.head/info/describe/dtypes/shape — refleks 30 detik.",
    },
    {
      id: "loc-iloc",
      eyebrow: "Langkah 2 · loc vs iloc",
      title: "Label lawan posisi",
      prose: [
        "`loc` bekerja berdasar label index, `iloc` berdasar posisi 0-based. Beda kritis: `df.loc[0:1]` mengambil 2 baris (inklusif!), `df.iloc[0:1]` hanya 1 baris (eksklusif). Ini perangkap off-by-one klasik.",
        "Setelah filter atau sort, posisi berubah tapi label ikut barisnya. Aturan: butuh baris ke-n pakai iloc; butuh id atau tanggal tertentu pakai loc. Ragu? iloc untuk posisi selalu aman.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Ambil `dua_baris` = 2 baris pertama via `iloc`, hitung `n_dua`" },
        { id: "t2", text: "Ambil `gaji_budi` = gaji baris label 'Budi' via `loc`" },
      ],
      expected: "n_dua=2  gaji_budi=8000000",
      note: {
        title: "Sering salah",
        body: "Mengira `df.loc[0:1]` dan `df.iloc[0:1]` sama. loc inklusif di ujung (2 baris), iloc eksklusif (1 baris). Satu baris selisih = laporan salah tanpa error.",
      },
      hints: [
        "dua_baris = df.iloc[0:2] — posisi 0 dan 1.",
        "gaji_budi = df.loc['Budi', 'gaji'] — label baris, label kolom.",
        "df.loc['Budi', 'gaji']",
      ],
      code: {
        starter: `import pandas as pd\n\ndf = pd.DataFrame({'gaji': [10_000_000, 8_000_000, 12_000_000]},\n                    index=['Andi', 'Budi', 'Citra'])\n\n# TULIS KODEMU\ndua_baris = \nn_dua = \ngaji_budi = \n\nprint(f"n_dua={n_dua}  gaji_budi={gaji_budi}")`,
        lockLines: 4,
        solution: `import pandas as pd\n\ndf = pd.DataFrame({'gaji': [10_000_000, 8_000_000, 12_000_000]},\n                    index=['Andi', 'Budi', 'Citra'])\n\n# TULIS KODEMU\ndua_baris = df.iloc[0:2]\nn_dua = len(dua_baris)\ngaji_budi = df.loc['Budi', 'gaji']\n\nprint(f"n_dua={n_dua}  gaji_budi={gaji_budi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_dua", value: 2, tol: 1e-9, label: "`n_dua` = 2", msg: "df.iloc[0:2] = posisi 0 dan 1 (eksklusif ujung)." },
          { kind: "equal", task: "t2", name: "gaji_budi", value: 8000000, tol: 1e-9, label: "`gaji_budi` = 8000000", msg: "Label baris 'Budi', kolom 'gaji'." },
          { kind: "stdout_matches", task: "t2", pattern: "n_dua=2\\s+gaji_budi=8000000", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "iloc = posisi (eksklusif); loc = label (inklusif!).",
    },
    {
      id: "boolean-mask",
      eyebrow: "Langkah 3 · Boolean mask",
      title: "WHERE-nya pandas",
      prose: [
        "Filter di pandas memakai mask boolean: `df[df['dpd'] > 30]`, sama seperti boolean indexing NumPy. Untuk dua kondisi, pakai `&` dengan kurung — `(df['kota'] == 'Jakarta') & (df['dpd'] == 0)` — karena `and` Python tidak bisa untuk Series.",
        "Kolom baru dibuat vectorized: `df['bermasalah'] = df['dpd'] > 30`. Jangan loop per baris. Dan hindari `df['gaji'][mask] = 0` (chained indexing bisa jadi kopi) — pakai `df.loc[mask, 'gaji'] = 0` dalam satu operasi.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Filter `jkt_lancar` = kota Jakarta DAN dpd = 0, hitung `n_jkt`" },
        { id: "t2", text: "Tambahkan kolom `gaji_jt` = gaji / 1 juta, hitung `rata_jt`" },
      ],
      expected: "n=2  rata_jt=11.0",
      note: {
        title: "Sering salah",
        body: "Menulis `df[df.kota == 'Jakarta' and df.dpd == 0]` dengan `and`. Python melempar error karena `and` tidak defined untuk Series. Selalu `&` dengan kurung di tiap kondisi.",
      },
      hints: [
        "mask = (df['kota'] == 'Jakarta') & (df['dpd'] == 0).",
        "df['gaji_jt'] = df['gaji'] / 1_000_000.",
        "rata_jt = jkt_lancar['gaji_jt'].mean()",
      ],
      code: {
        starter: `import pandas as pd\n\ndf = pd.DataFrame({\n    'kota': ['JKT', 'SBY', 'JKT', 'BDG'],\n    'gaji': [10_000_000, 8_000_000, 12_000_000, 9_000_000],\n    'dpd': [0, 45, 0, 0]})\n\n# TULIS KODEMU\njkt_lancar = \nn_jkt = \ndf['gaji_jt'] = \nrata_jt = \n\nprint(f"n={n_jkt}  rata_jt={rata_jt}")`,
        lockLines: 6,
        solution: `import pandas as pd\n\ndf = pd.DataFrame({\n    'kota': ['JKT', 'SBY', 'JKT', 'BDG'],\n    'gaji': [10_000_000, 8_000_000, 12_000_000, 9_000_000],\n    'dpd': [0, 45, 0, 0]})\n\n# TULIS KODEMU\njkt_lancar = df[(df['kota'] == 'JKT') & (df['dpd'] == 0)]\nn_jkt = len(jkt_lancar)\ndf['gaji_jt'] = df['gaji'] / 1_000_000\nrata_jt = jkt_lancar['gaji'].mean() / 1_000_000\n\nprint(f"n={n_jkt}  rata_jt={rata_jt}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_jkt", value: 2, tol: 1e-9, label: "`n_jkt` = 2", msg: "JKT dan dpd 0: dua baris." },
          { kind: "equal", task: "t2", name: "rata_jt", value: 11.0, tol: 1e-9, label: "`rata_jt` = 11.0", msg: "(10jt + 12jt) / 2 = 11jt." },
          { kind: "stdout_matches", task: "t2", pattern: "n=2\\s+rata_jt=11\\.0", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "df[(kondisi1) & (kondisi2)]. Kolom baru: df['x'] = ... (vectorized).",
    },
    {
      id: "read-csv",
      eyebrow: "Langkah 4 · read_csv",
      title: "Pintu masuk data — dan jebakannya",
      prose: [
        "Tebakan tipe `read_csv` didasarkan pada baris-baris awal — sering salah. Dua jebakan klasik: separator non-koma (file Eropa memakai `;`) membuat satu kolom berantakan, dan id numerik dibaca int sehingga nol depan hilang dan JOIN gagal.",
        "Aturan: id dan kode selalu `dtype=str`. Tanggal langsung jadi datetime dengan `parse_dates`. Nilai seperti '', 'NA', '-' disamakan jadi NaN dengan `na_values`. Lalu cek dtypes — 5 detik mencegah 5 jam debugging.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Baca `csv_data` dengan separator `;` dan `id` sebagai string" },
        { id: "t2", text: "Ambil `id_pertama` = id baris pertama" },
      ],
      expected: "id_pertama=00123",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ID nasabah yang kehilangan nol depan ('00123' jadi 123) membuat JOIN ke tabel risiko gagal diam-diam — baris hilang tanpa error. Di data risiko, satu baris hilang bisa berarti satu debitur macet tak terpantau.",
      },
      hints: [
        "pd.read_csv(io.StringIO(csv_data), sep=';', dtype={'id': str}).",
        "id_pertama = df['id'].iloc[0].",
        "Jangan lupa import io.",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv_data = "id;nama;dpd\\n00123;Andi;0\\n00456;Budi;45"\n\n# TULIS KODEMU\ndf = \nid_pertama = \n\nprint(f"id_pertama={id_pertama}")\nprint(f"kolom={list(df.columns)}")`,
        lockLines: 3,
        solution: `import pandas as pd, io\n\ncsv_data = "id;nama;dpd\\n00123;Andi;0\\n00456;Budi;45"\n\n# TULIS KODEMU\ndf = pd.read_csv(io.StringIO(csv_data), sep=';', dtype={'id': str})\nid_pertama = df['id'].iloc[0]\n\nprint(f"id_pertama={id_pertama}")\nprint(f"kolom={list(df.columns)}")`,
        checks: [
          { kind: "equal", task: "t2", name: "id_pertama", value: "00123", label: "`id_pertama` = '00123'", msg: "Nol depan selamat karena dtype str." },
          { kind: "stdout_matches", task: "t1", pattern: "kolom=\\['id', 'nama', 'dpd'\\]", label: "3 kolom terbaca benar", msg: "Dengan sep=';', bukan 1 kolom berantakan." },
          { kind: "stdout_matches", task: "t2", pattern: "id_pertama=00123", label: "`print` menampilkan id", msg: "Format: id_pertama=00123." },
        ],
      },
      reference: "pd.read_csv(..., sep=';', dtype={'id': str}, parse_dates=[...]). Cek dtypes setelahnya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Refleks 30 detik untuk DataFrame baru",
      prose: [
        "Setiap kali menerima DataFrame baru: `head`, `info`, `describe`, `dtypes` — peta data dalam 30 detik. Butuh baris ke-n: iloc. Butuh label atau tanggal: loc. Filter: boolean mask dengan `&` berkunjung... dengan kurung. Kolom baru: assign vectorized, bukan loop.",
        "Dan ingat twist cerita pembuka: kekuatan pandas adalah footgun — satu baris `dropna()` bisa menghapus 90% data diam-diam. Excel menunjukkan apa yang ia hapus; pandas tidak. Kuat berarti waspada.",
      ],
      tasks: [],
      reference: "head/info/describe/dtypes dulu. iloc posisi, loc label, mask untuk filter.",
    },
    {
      id: "advanced-chaining",
      eyebrow: "Langkah 6 · Advanced",
      title: "Advanced: method chaining, copy-on-write, dan semantik indexing",
      prose: [
        "Tiga teknik yang memisahkan pengguna pandas kasual dari praktisi. Pertama, METHOD CHAINING: rantai operasi dibaca sebagai satu kalimat — `df.query(\"dpd > 30\").assign(gaji_jt=lambda d: d.gaji / 1e6).groupby(\"kota\")[\"gaji_jt\"].mean()`. Kelebihannya: tidak ada variabel sementara yang namanya harus diingat, dan urutan transformasi terlihat eksplisit. Trade-off-nya: debugging — saat rantai 6 langkah error di tengah, kamu tidak bisa inspect langkah ke-3. Pola senior: tulis sebagai rantai untuk kode final, tetapi saat debug pecah sementara per baris; dan gunakan `.pipe(nama_fungsi)` untuk menyisipkan fungsi kustom bernama jelas di tengah rantai.",
        "Kedua, COPY-ON-WRITE (CoW): aturan main memori pandas modern. Intinya — slice DataFrame adalah VIEW (jendela ke data asli) sampai kamu mengubahnya, saat itulah pandas menyalin. Konsekuensinya: chained assignment `df[df.dpd > 90][\"status\"] = \"macet\"` adalah BERBAHAYA — kamu menulis ke objek sementara yang mungkin view, mungkin copy, dan pandas hanya bisa memberimu SettingWithCopyWarning. Dengan CoW aktif (`pd.options.mode.copy_on_write = True`, default di pandas 3.0), perilaku menjadi deterministik: chained assignment TIDAK PERNAH mengubah aslinya — tidak error, tetapi diam-diam tidak berefek. Aturan keputusan: untuk assignment SELALU gunakan satu langkah `.loc` — `df.loc[df.dpd > 90, \"status\"] = \"macet\"` — tidak pernah rantai dua kurung siku untuk tulis.",
        "Ketiga, semantik indexing yang menjebak senior sekalipun: boolean mask dari DataFrame LAIN disejajarkan berdasar INDEX, bukan posisi — `df[mask_dari_df_lain]` dengan index berbeda menghasilkan NaN diam-diam, bukan error. Begitu juga `df.loc[[...]]` dengan label yang tidak ada melempar KeyError, sementara `.reindex()` memberi NaN — pilih sesuai niat. Heuristik praktisi: setiap operasi indexing, tanyakan \"apa yang terjadi pada baris yang tidak cocok\" — error, NaN, atau hilang diam-diam? Jawabannya menentukan apakah kodemu aman atau hanya beruntung. Keempat, `.query()` vs mask boolean: query lebih terbaca untuk kondisi kompleks (`df.query(\"dpd > 30 and kota == 'Jakarta'\")`) dan sedikit lebih cepat untuk frame besar (evaluasi numexpr), tetapi tidak bisa memakai variabel lokal tanpa prefix @ — pilih satu gaya per codebase dan konsisten. Kelima, `.assign()` untuk kolom baru di tengah rantai menjaga immutability gaya fungsional: `df.assign(gaji_jt=df.gaji / 1e6)` mengembalikan frame baru tanpa menyentuh aslinya — aman untuk eksperimen, karena data sumber tidak pernah termutasi diam-diam.",
      ],
      tasks: [],
      reference: "Rantai untuk baca, pipe untuk fungsi kustom; CoW: tulis selalu via .loc satu langkah; mask disejajarkan via index — cek baris tak cocok.",
    },
    {
      id: "minicase-flag",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: flag macet yang tidak pernah ter-update",
      prose: [
        "Skenario (angka konkret): tim collection sebuah bank memakai script harian untuk menandai debitur macet. Data: 12.400 debitur, total exposure Rp 84 miliar. Baris penanda di script: `df[df.dpd > 90][\"status\"] = \"macet\"` — chained assignment dua kurung siku. Script jalan tanpa error setiap hari (hanya warning yang diabaikan). Tiga minggu kemudian audit menemukan 214 debitur (1,7%) dengan DPD > 90 hari berstatus \"lancar\" di laporan — tim collection tidak pernah menelepon mereka, dan 38 di antaranya kini DPD > 180 hari dengan potensi kerugian Rp 8,4 miliar.",
        "Pertanyaan analisis: (1) Mengapa tidak ada error tetapi status tidak berubah? (2) Perintah apa yang seharusnya ditulis? (3) Pengaman apa yang membuat bug ini mustahil lolos diam-diam?",
        "Pembahasan: (1) `df[df.dpd > 90]` menghasilkan objek sementara (view atau copy — tidak deterministik tanpa CoW); assignment ke `[\"status\"]` menulis ke objek sementara itu, bukan ke df. Warning yang muncul adalah SettingWithCopyWarning — diabaikan karena \"script tetap jalan\". (2) `df.loc[df.dpd > 90, \"status\"] = \"macet\"` — satu langkah .loc, selalu menulis ke aslinya. (3) Tiga pengaman: aktifkan CoW agar perilaku deterministik; set `pd.options.mode.chained_assignment = \"raise\"` di environment dev sehingga pola berbahaya menjadi error, bukan warning; dan assert pasca-tulis — `assert (df.loc[df.dpd > 90, \"status\"] == \"macet\").all()` — script yang memverifikasi tulisannya sendiri.",
        "Kaitan ke karier: bug ini tidak butuh data scientist — ia butuh disiplin assignment. Di code review, setiap baris dengan dua kurung siku sebelum `=` adalah temuan otomatis.",
      ],
      tasks: [],
      reference: "Tulis selalu via .loc satu langkah; chained_assignment='raise' di dev; assert pasca-tulis.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 8 · Intuisi",
      title: "Intuisi: pandas memberi kekuatan tanpa visibilitas",
      prose: [
        "Heuristik penutup: di pandas, yang tidak kamu verifikasi adalah yang akan mengkhianatimu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: pandas memberi kekuatan tanpa visibilitas",
        body: "pandas bisa mengubah 12.400 baris dalam satu baris kode — dan justru itulah bahayanya: kekuatan tanpa visibilitas. Heuristik pertama: verifikasi bentuk setelah tiap operasi penting — `df.shape` sebelum dan sesudah merge/filter; baris yang hilang atau berlipat ganda diam-diam adalah bug paling mahal di pandas. Heuristik kedua: perlakukan SettingWithCopyWarning sebagai ERROR, bukan saran — di environment dev, set chained_assignment='raise' agar pola berbahaya meledak di depanmu, bukan di laporan 3 minggu kemudian. Heuristik ketiga: berpikir dalam kolom, bukan baris — setiap kali kamu menulis iterrows atau loop atas baris, berhentilah; 95% kasus ada operasi vektorisasi atau groupby yang 100× lebih cepat. Heuristik keempat: `.loc` untuk tulis, mask untuk baca — assignment selalu satu langkah .loc dengan mask boolean; tidak pernah rantai dua kurung siku. Heuristik kelima: method chaining untuk transformasi final yang linear, tetapi pecah menjadi variabel bernama saat debug atau saat rantai melewati 4 langkah — rantai 8 langkah yang tidak bisa di-inspect tengahnya adalah write-only code. Dan yang paling senior: dtypes adalah kontrak — `df.dtypes` dibaca SEBELUM analisis, bukan sesudah hasilnya aneh; kolom angka bertipe object adalah alarm kebakaran yang bunyinya pelan, dan satu kolom object di tengah 50 kolom numerik cukup untuk meracuni seluruh agregat downstream.",
      },
      reference: "Verifikasi shape tiap operasi; warning = error di dev; berpikir kolom; tulis via .loc; dtypes dulu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran. Setiap opsi punya alasan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "df.loc[0:1] vs df.iloc[0:1]...",
          options: [
            { text: "Sama — 1 baris", why: "Tidak sama. loc inklusif di ujung." },
            { text: "loc = 2 baris (inklusif), iloc = 1 baris (eksklusif)", why: "Perangkap off-by-one klasik: label vs posisi.", correct: true },
            { text: "loc = 1, iloc = 2", why: "Terbalik." },
            { text: "Keduanya error", why: "Keduanya valid dengan arti berbeda." },
          ],
        },
        {
          q: "Kolom angka terbaca 'object'. Artinya...",
          options: [
            { text: "Normal, biarkan", why: "Tidak normal — kolom itu tidak bisa dihitung." },
            { text: "Ada nilai non-angka — konversi dengan pd.to_numeric(errors='coerce')", why: "Cek dtypes selalu setelah baca data; coerce mengubah yang gagal jadi NaN.", correct: true },
            { text: "Hapus kolomnya", why: "Jangan hapus sebelum tahu isinya." },
            { text: "Tidak bisa dihitung selamanya", why: "Bisa, setelah konversi tipe." },
          ],
        },
        {
          q: "Tiga perintah pertama untuk DataFrame baru...",
          options: [
            { text: "plot, merge, pivot", why: "Itu langkah analisis, bukan eksplorasi awal." },
            { text: "head, info, describe", why: "Refleks 30 detik: bentuk, tipe, sebaran.", correct: true },
            { text: "drop, fillna, astype", why: "Cleaning sebelum kenal data = berbahaya." },
            { text: "save, load, exit", why: "Bukan perintah eksplorasi." },
          ],
        },
        {
          q: "id '001' terbaca sebagai int. Akibatnya...",
          options: [
            { text: "Baik-baik saja", why: "Nol depan hilang: '001' jadi 1 — JOIN bisa gagal." },
            { text: "Nol hilang — paksa dtype={'id': str} saat baca", why: "ID dan kode adalah string, bukan angka.", correct: true },
            { text: "Tidak masalah untuk analisis", why: "Masalah saat join ke tabel lain." },
            { text: "Error langsung", why: "Tidak error — diam-diam salah, itu yang berbahaya." },
          ],
        },
      ],
      summary: [
        "DataFrame (tabel) / Series (kolom); cek dtypes selalu.",
        "iloc = posisi eksklusif; loc = label inklusif.",
        "Boolean mask = WHERE; kolom baru = assign vectorized.",
        "read_csv: sep, parse_dates, dtype, na_values — lalu cek dtypes.",
        "Kekuatan tanpa visibilitas = footgun: ukur sebelum drop atau ubah.",
      ],
      next: { label: "D5 — Data Cleaning", href: "/learn/d5-data-cleaning" },
    },
  ],
};
