import type { V2Lesson } from "../lib/types";

export const d14: V2Lesson = {
  slug: "d14-rekayasa",
  track: "Python",
  module: "Rekayasa",
  title: "D14 Rekayasa: Kode Python yang Bisa Dipercaya",
  estMinutes: 55,
  steps: [
    {
      id: "struktur",
      eyebrow: "Langkah 1 · Struktur",
      title: "Cerita pembuka: notebook 800 baris yang takut disentuh",
      prose: [
        "Notebook analisis 800 baris: variabel `df2_final_fix2`, fungsi 200 baris, tidak ada yang berani ubah karena tidak ada yang tahu apa yang pecah. Kode analisis yang tidak bisa disentuh = kode yang tidak bisa dipercaya.",
        "Aturan struktur: satu fungsi = satu tugas (maks ~20 baris), nama menjelaskan (hitung_npl, bukan f1), tanpa magic number (NPL_BATAS = 0.03, bukan 0.03 di tengah kode), modul per topik. Refactor bukan kemewahan — analisis yang dipakai ulang wajib rapi.",
      ],
      tasks: [],
      reference: "Fungsi kecil, nama jelas, konstanta bernama. Notebook eksplorasi; modul untuk yang dipakai ulang.",
    },
    {
      id: "fungsi-murni",
      eyebrow: "Langkah 2 · Fungsi murni",
      title: "Murni vs efek samping",
      prose: [
        "Fungsi murni: output hanya dari input, tidak mengubah apa pun di luar. `hitung_npl(daftar)` murni — bisa di-test, bisa di-cache, aman dipanggil berkali-kali. Fungsi yang mengubah global/dataframe di tempat = efek samping tersembunyi = bug yang menunggu.",
        "Aturan: fungsi analisis mengembalikan nilai, bukan mengubah global. `df` yang di-pass tidak di-mutate (pakai `.copy()` jika perlu). Test = panggil dengan input diketahui, bandingkan output.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `kategori_bucket(dpd)`" },
        { id: "t2", text: "Hitung `npl` untuk data contoh dan `kat_45`" },
      ],
      expected: "npl=0.17  kat_45=31-60",
      note: {
        title: "Sering salah",
        body: "Fungsi yang mengubah dataframe global di tempat lalu mengembalikan None — pemanggil tidak tahu data berubah. Selalu return nilai baru; jangan mutate input kecuali namanya jelas (mis. `isi_missing_inplace`).",
      },
      hints: [
        "if dpd <= 0: return 'lancar'; elif dpd <= 30: return '1-30'; dst.",
        "macet = sum(1 for d in daftar if kategori_bucket(d) == 'macet').",
        "return macet / len(daftar) jika daftar tidak kosong.",
      ],
      code: {
        starter: `# TULIS KODEMU: fungsi murni klasifikasi bucket & NPL\ndef kategori_bucket(dpd):\n    \n\ndef hitung_npl(daftar_dpd):\n    \n\ndata = [0, 15, 45, 90, 0, 30]\nnpl = \nkat_45 = \n\nprint(f"npl={npl:.2f}  kat_45={kat_45}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU: fungsi murni klasifikasi bucket & NPL\ndef kategori_bucket(dpd):\n    if dpd <= 0:\n        return "lancar"\n    if dpd <= 30:\n        return "1-30"\n    if dpd <= 60:\n        return "31-60"\n    return "macet"\n\ndef hitung_npl(daftar_dpd):\n    if not daftar_dpd:\n        return 0.0\n    macet = sum(1 for d in daftar_dpd if kategori_bucket(d) == "macet")\n    return macet / len(daftar_dpd)\n\ndata = [0, 15, 45, 90, 0, 30]\nnpl = hitung_npl(data)\nkat_45 = kategori_bucket(45)\n\nprint(f"npl={npl:.2f}  kat_45={kat_45}")`,
        checks: [
          { kind: "defined", task: "t1", name: "kategori_bucket", label: "`kategori_bucket` terdefinisi", msg: "Definisikan fungsi kategori_bucket(dpd)." },
          { kind: "equal", task: "t2", name: "npl", value: 0.1667, tol: 0.001, label: "`npl` sekitar 0.17", msg: "1 dari 6 macet (dpd 90)." },
          { kind: "equal", task: "t2", name: "kat_45", value: "31-60", label: "`kat_45` = '31-60'", msg: "dpd 45 masuk bucket 31-60." },
          { kind: "stdout_matches", task: "t2", pattern: "npl=0\\.17\\s+kat_45=31-60", label: "`print` menampilkan hasil", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "Fungsi murni: output dari input saja. Return nilai, jangan mutate global.",
    },
    {
      id: "error-handling",
      eyebrow: "Langkah 3 · Error handling",
      title: "Gagal dengan jelas, bukan diam",
      prose: [
        "Fungsi `persen(x)` harus menolak input bukan-angka (TypeError) dan negatif (ValueError) dengan pesan jelas — bukan mengembalikan hasil aneh. `try/except` di pemanggil menangkap spesifik, bukan `except:` polos yang menelan semua termasuk bug.",
        "Aturan: validasi di batas fungsi (fail fast), pesan error menyebut nilai yang salah, tangkap exception sespesifik mungkin. Error yang jelas menghemat jam debugging.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `persen(x)` dengan validasi, panggil untuk 0.05 → `hasil`" },
        { id: "t2", text: "Tangkap ValueError dari `persen(-1)` → `tangkap`" },
      ],
      expected: "hasil=5.0%  tangkap=True",
      note: {
        title: "Sering salah",
        body: "`except:` polos menelan KeyboardInterrupt dan bug asli — debugging jadi tebak-tebakan. Selalu tangkap tipe spesifik (ValueError, KeyError) dan biarkan yang lain naik.",
      },
      hints: [
        "if not isinstance(x, (int, float)): raise TypeError(...).",
        "if x < 0: raise ValueError('x tidak boleh negatif').",
        "try: persen(-1) \n except ValueError: tangkap = True",
      ],
      code: {
        starter: `# TULIS KODEMU: validasi + tangkap error\ndef persen(x):\n    \n\nhasil = \ntangkap = False\ntry:\n    \nexcept ValueError:\n    \n\nprint(f"hasil={hasil}  tangkap={tangkap}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU: validasi + tangkap error\ndef persen(x):\n    if not isinstance(x, (int, float)):\n        raise TypeError("x harus angka")\n    if x < 0:\n        raise ValueError("x tidak boleh negatif")\n    return f"{x:.1%}"\n\nhasil = persen(0.05)\ntangkap = False\ntry:\n    persen(-1)\nexcept ValueError:\n    tangkap = True\n\nprint(f"hasil={hasil}  tangkap={tangkap}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hasil", value: "5.0%", label: "`hasil` = '5.0%'", msg: "persen(0.05) memformat persen." },
          { kind: "equal", task: "t2", name: "tangkap", value: true, label: "`tangkap` = True", msg: "ValueError dari persen(-1) tertangkap." },
          { kind: "stdout_matches", task: "t2", pattern: "hasil=5\\.0%\\s+tangkap=True", label: "`print` menampilkan hasil", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "Validasi di batas fungsi; except spesifik; pesan error menyebut nilai salah.",
    },
    {
      id: "testing",
      eyebrow: "Langkah 4 · Testing",
      title: "Assert adalah dokumentasi hidup",
      prose: [
        "`assert hitung_npl([0, 90]) == 0.5` — satu baris yang menjadi spesifikasi sekaligus penjaga. Untuk analisis: test fungsi transformasi dengan input kecil yang jawabannya kamu hitung manual. 3-5 assert per fungsi kritis sudah mengubah kepercayaan.",
        "Pola: test data kecil deterministik (bukan random), expected value dihitung manual, nama test menjelaskan kasus (`test_npl_kosong_nol`). CI menjalankan test tiap commit — regresi ketahuan sebelum merge.",
      ],
      tasks: [],
      reference: "Test fungsi kritis dengan input kecil; expected dihitung manual.",
    },
    {
      id: "advanced-logging",
      eyebrow: "Langkah 5 · Advanced",
      title: "Advanced: logging — print untuk manusia, log untuk sistem",
      prose: [
        "Perbedaan print dan logging bukan gaya — melainkan SIAPA yang membaca. print dibaca manusia yang menatap layar; logging dibaca SISTEM: file log yang dirotasi, alert yang dipicu, audit yang menelusuri 'apa yang terjadi jam 3 pagi'. Tiga level yang wajib dikuasai: INFO (jalannya normal — 'mulai: 5000 baris', 'selesai: 4980 bersih') untuk melacak alur; WARNING (anomali yang ditangani — 'buang 20 baris negatif') untuk yang perlu diperhatikan tetapi tidak menghentikan; ERROR (gagal — 'kolom dpd tidak ada') untuk yang butuh tindakan. Aturannya: log MENGANDUNG konteks (berapa baris? batas berapa?) — 'error' tanpa konteks sama tidak bergunanya dengan print.",
        "Dua praktik yang membedakan. Pertama, FORMAT SEKALI di satu tempat: `logging.basicConfig(format='%(asctime)s %(levelname)s %(message)s')` — timestamp + level di setiap baris membuat log bisa diurutkan dan dicari; log tanpa timestamp adalah teka-teki. Kedua, JANGAN log di dalam loop jutaan baris — log per 10 ribu baris atau rangkuman akhir; logging 2 juta baris 'proses baris ke-N' akan memenuhi disk lebih cepat dari datanya. Dan yang paling penting: di production, print dimatikan/diredirect tetapi log TETAP JALAN ke file — script yang 'berhasil' tetapi tidak meninggalkan jejak adalah script yang tidak bisa di-debug saat gagal 3 minggu kemudian.",
        "Praktik di lab: tulis fungsi muat_data yang melapor via log (INFO mulai/selesai, WARNING untuk baris negatif yang dibuang), lalu verifikasi jejaknya dari stream — karena analis senior tidak percaya 'kayaknya sudah jalan', ia percaya log.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `muat_data`: log INFO mulai/selesai, WARNING bila ada baris negatif dibuang" },
        { id: "t2", text: "Jalankan, hitung `n_warn` dari stream, cetak baris terakhir log + ringkasan" },
      ],
      expected: "n_baris=3, n_warn=1, baris terakhir INFO selesai",
      hints: [
        "log.info(f'mulai: {len(baris)} baris'); bersih = [b for b in baris if b >= 0].",
        "if len(bersih) < len(baris): log.warning(f'buang {len(baris)-len(bersih)} baris negatif').",
        "n_warn = stream.getvalue().count('WARNING').",
      ],
      code: {
        starter: `import logging\nimport io\n\nstream = io.StringIO()\nlogging.basicConfig(level=logging.INFO,\n                    handlers=[logging.StreamHandler(stream)],\n                    format="%(levelname)s: %(message)s", force=True)\nlog = logging.getLogger("etl")\n\n# TULIS KODEMU: fungsi ETL yang MELAPOR via logging, bukan print\ndef muat_data(baris):\n    log.info(f"mulai: {len(baris)} baris")\n    bersih =\n    n_buang =\n    if n_buang > 0:\n        log.warning( )\n    log.info(f"selesai: {len(bersih)} baris bersih")\n    return bersih\n\nhasil = muat_data([10, -5, 20, -1, 30])\nout = stream.getvalue()\nn_warn = out.count("WARNING")\nprint(out.strip().splitlines()[-1])\nprint(f"n_baris={len(hasil)} n_warn={n_warn}")\n`,
        lockLines: 9,
        solution: `import logging\nimport io\n\nstream = io.StringIO()\nlogging.basicConfig(level=logging.INFO,\n                    handlers=[logging.StreamHandler(stream)],\n                    format="%(levelname)s: %(message)s", force=True)\nlog = logging.getLogger("etl")\n\n# TULIS KODEMU: fungsi ETL yang MELAPOR via logging, bukan print\ndef muat_data(baris):\n    log.info(f"mulai: {len(baris)} baris")\n    bersih = [b for b in baris if b >= 0]\n    n_buang = len(baris) - len(bersih)\n    if n_buang > 0:\n        log.warning(f"buang {n_buang} baris negatif")\n    log.info(f"selesai: {len(bersih)} baris bersih")\n    return bersih\n\nhasil = muat_data([10, -5, 20, -1, 30])\nout = stream.getvalue()\nn_warn = out.count("WARNING")\nprint(out.strip().splitlines()[-1])\nprint(f"n_baris={len(hasil)} n_warn={n_warn}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "n_warn", value: 1, tol: 1e-09, label: "`n_warn` = 1", msg: "Satu WARNING untuk 2 baris negatif yang dibuang." },
          { kind: "equal", task: "t2", name: "hasil", value: [10, 20, 30], label: "`hasil` = [10, 20, 30]", msg: "Hanya baris non-negatif yang lolos." },
          { kind: "stdout_matches", task: "t2", pattern: "n_baris=3 n_warn=1", label: "Ringkasan tercetak", msg: "Format: n_baris=3 n_warn=1." },
        ],
      },
      reference: "INFO = alur, WARNING = anomali tertangani, ERROR = butuh tindakan. Format sekali; log berkonteks; jangan log per baris.",
    },
    {
      id: "advanced-config",
      eyebrow: "Langkah 6 · Advanced",
      title: "Advanced: config, secrets, dan struktur yang anti 'works on my machine'",
      prose: [
        "Tiga penyebab 'di laptop saya jalan' — dan obatnya. Pertama, HARDCODED VALUES: batas_dpd = 90 tersebar di 7 tempat; besok bisnis minta 60 dan kamu mengedit 5, lupa 2 — hasilnya dua definisi 'macet' dalam satu pipeline. Obatnya: SATU CONFIG di satu tempat (dict CONFIG, file YAML, atau dataclass) yang diimpor semua fungsi — mengubah 90 menjadi 60 adalah satu baris, bukan perburuan. Kedua, SECRETS DI KODE: API key dan password database tertulis di script, lalu ter-commit ke Git — kebocoran yang tidak bisa di-undo (riwayat Git mengingat selamanya). Obatnya: environment variables (`os.environ['DB_PASSWORD']`) + file `.env` yang TIDAK PERNAH di-commit (masukkan ke .gitignore hari ini juga); di server, secrets diisi oleh sistem deployment, bukan oleh kode.",
        "Ketiga, STRUKTUR PROYEK yang bisa dijalankan orang lain: `src/` untuk kode (bukan notebook berserakan), `tests/` untuk test, `pyproject.toml`/`requirements.txt` untuk dependensi yang TERVERSION (`pandas==2.1.4`, bukan `pandas` — 'install pandas' hari ini vs 6 bulan lagi bisa memberi versi beda dengan perilaku beda), `README.md` dengan cara menjalankan dalam 3 perintah. Uji seniornya: clone repo di mesin BERSIH, ikuti README — bila jalan dalam 10 menit tanpa meneleponmu, strukturnya benar. Tambahan: `if __name__ == '__main__':` memisahkan 'modul yang bisa diimpor' dari 'script yang bisa dijalankan' — tanpa ini, import modulmu malah menjalankan seluruh pipeline.",
        "Aturan keputusan: script sekali pakai boleh berantakan; script yang dijalankan 2× sudah butuh config; script yang dijalankan ORANG LAIN butuh struktur + README; script yang MENYENTUH PRODUCTION butuh semuanya + logging + test. Naikkan disiplin mengikuti umur dan jangkauan kode — bukan sekaligus di awal (over-engineering untuk script sekali pakai sama buruknya dengan under-engineering untuk pipeline produksi).",
      ],
      tasks: [],
      reference: "Satu config, bukan 7 hardcode. Secrets via env, .env di .gitignore. Dependensi terversion. Disiplin mengikuti umur kode.",
    },
    {
      id: "minicase-config",
      eyebrow: "Langkah 7 · Mini-case",
      requires: ["pandas"],
      title: "Mini-case: script yang hanya jalan di laptop pembuatnya",
      prose: [
        "Skenario (angka konkret): script laporan NPL harian milik satu analis: path input hardcoded `C:/Users/andi/data/`, password database tertulis di kode, batas DPD 90 tersebar di 6 baris, dan semua output via print. Andi cuti 2 minggu; script harus jalan di server. Upaya migrasi: 3 hari debugging — path Windows vs Linux, password kedaluwarsa yang tidak bisa diganti tanpa edit kode (dan tidak ada yang berani edit karena tidak ada test), 2 dari 6 batas DPD tidak ketahuan belum diubah sehingga 2 minggu laporan memakai definisi ganda (90 dan 60). Total: 3 hari engineer + 2 minggu laporan yang definisinya dipertanyakan.",
        "Pertanyaan analisis: (1) Sebutkan 4 cacat rekayasa dalam cerita ini. (2) Untuk masing-masing, apa obatnya? (3) Bagaimana memverifikasi perbaikanmu bekerja?",
        "Pembahasan: (1) Hardcoded path → config/env; password di kode → environment variable + .gitignore; batas tersebar → satu CONFIG; print → logging dengan jejak. (2) Plus struktur: requirements terversion + README 3-perintah + `if __name__ == '__main__'`. (3) Uji di mesin bersih: clone, ikuti README, tanpa menelepon penulis — dan test otomatis untuk fungsi intinya. Praktikkan di lab: tulis ulang fungsi penanda macet versi produksi-mini — baca CONFIG, validasi kolom (gagal berisik bila tidak ada), dan tinggalkan jejak log.",
        "Kaitan ke karier: 'kode yang hanya jalan di laptop pembuatnya' adalah single point of failure berbentuk manusia. Merekayasa ulang script sekali pakai menjadi pipeline yang bisa diwariskan adalah pekerjaan analis senior yang paling tidak glamor — dan paling diingat saat ia cuti.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `tandai_macets`: baca `batas`/`kol` dari `config`, validasi kolom (raise + log ERROR bila tak ada)" },
        { id: "t2", text: "Hitung `n_macets`, log INFO hasilnya, cetak ringkasan + jejak log terakhir" },
      ],
      expected: "n_macets=2, jejak INFO menandai 2 baris",
      hints: [
        "batas = config['batas_dpd']; kol = config['kolom'].",
        "if kol not in df.columns: log.error(...); raise ValueError(...).",
        "n = int((df[kol] > batas).sum()); log.info(f'menandai {n} baris ...').",
      ],
      code: {
        starter: `import logging\nimport io\nimport pandas as pd\n\n# KONFIGURASI: satu tempat — dulu nilai ini hardcoded di 5 tempat berbeda\nCONFIG = {"batas_dpd": 90, "kolom": "dpd"}\n\nstream = io.StringIO()\nlogging.basicConfig(level=logging.INFO,\n                    handlers=[logging.StreamHandler(stream)],\n                    format="%(levelname)s: %(message)s", force=True)\nlog = logging.getLogger("etl")\n\n# TULIS KODEMU: fungsi produksi mini — baca CONFIG, validasi, log, gagal berisik\ndef tandai_macets(df, config):\n    batas =\n    kol =\n    if kol not in df.columns:\n        log.error( )\n        raise ValueError( )\n    n =\n    log.info( )\n    return n\n\ndf = pd.DataFrame({"dpd": [0, 10, 45, 91, 120, 30]})\nn_macets = tandai_macets(df, CONFIG)\nprint(f"n_macets={n_macets}")\nprint("jejak:", stream.getvalue().strip().splitlines()[-1])\n`,
        lockLines: 13,
        solution: `import logging\nimport io\nimport pandas as pd\n\n# KONFIGURASI: satu tempat — dulu nilai ini hardcoded di 5 tempat berbeda\nCONFIG = {"batas_dpd": 90, "kolom": "dpd"}\n\nstream = io.StringIO()\nlogging.basicConfig(level=logging.INFO,\n                    handlers=[logging.StreamHandler(stream)],\n                    format="%(levelname)s: %(message)s", force=True)\nlog = logging.getLogger("etl")\n\n# TULIS KODEMU: fungsi produksi mini — baca CONFIG, validasi, log, gagal berisik\ndef tandai_macets(df, config):\n    batas = config["batas_dpd"]\n    kol = config["kolom"]\n    if kol not in df.columns:\n        log.error(f"kolom {kol} tidak ada di data")\n        raise ValueError(f"kolom {kol} tidak ada di data")\n    n = int((df[kol] > batas).sum())\n    log.info(f"menandai {n} baris sebagai macet (batas={batas})")\n    return n\n\ndf = pd.DataFrame({"dpd": [0, 10, 45, 91, 120, 30]})\nn_macets = tandai_macets(df, CONFIG)\nprint(f"n_macets={n_macets}")\nprint("jejak:", stream.getvalue().strip().splitlines()[-1])\n`,
        checks: [
          { kind: "equal", task: "t2", name: "n_macets", value: 2, tol: 1e-09, label: "`n_macets` = 2", msg: "DPD > 90: 91 dan 120 — 2 baris." },
          { kind: "stdout_matches", task: "t2", pattern: "n_macets=2", label: "Hasil tercetak", msg: "Format: n_macets=2." },
          { kind: "stdout_matches", task: "t2", pattern: "INFO: menandai 2 baris", label: "Jejak log INFO", msg: "Fungsi meninggalkan jejak: INFO menandai 2 baris sebagai macet." },
        ],
      },
      reference: "Config satu tempat; secrets via env; validasi = gagal berisik; logging = jejak; test = warisan.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 8 · Intuisi",
      title: "Intuisi: kode analis adalah produk — seseorang akan menjalankannya jam 3 pagi",
      prose: [
        "Heuristik penutup: tulis kode seolah yang menjalankannya adalah orang yang tidak bisa meneleponmu — karena biasanya memang begitu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kode analis adalah produk — seseorang akan menjalankannya jam 3 pagi",
        body: "Heuristik pertama: logging, bukan print — print untuk manusia yang menatap layar; log untuk sistem yang berjalan tanpamu. Script produksi yang tidak meninggalkan jejak tidak bisa di-debug. Heuristik kedua: gagal berisik, jangan diam — validasi input dan raise dengan pesan jelas; fungsi yang mengembalikan hasil salah dengan tenang jauh lebih berbahaya dari yang meledak. Heuristik ketiga: config di satu tempat, secrets di environment — angka yang tersebar di 7 tempat akan berbeda isinya dalam 6 bulan; password di kode akan bocor ke Git. Keduanya punya obat yang murah. Heuristik keempat: disiplin mengikuti umur kode — script sekali pakai boleh berantakan; yang dijalankan orang lain butuh README; yang menyentuh production butuh test + logging + config. Over-engineering sama buruknya dengan under-engineering. Heuristik kelima: wariskan dengan test — 3 test untuk 3 fungsi terseram lebih berharga dari 50 halaman dokumentasi; test adalah satu-satunya dokumentasi yang berteriak saat berbohong. Dan uji akhirnya: bisakah orang baru menjalankan pipelinemu dari README dalam 10 menit tanpa meneleponmu? Bila ya, itu rekayasa. Bila tidak, itu kerajinan pribadi.",
      },
      reference: "Log bukan print; gagal berisik; config + secrets benar; disiplin sesuai umur; wariskan via test.",
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
          q: "Fungsi murni artinya...",
          options: [
            { text: "Tanpa parameter", why: "Bukan soal parameter." },
            { text: "Output hanya dari input, tanpa efek samping", why: "Testable, cacheable, aman.", correct: true },
            { text: "Tanpa return", why: "Fungsi murni justru me-return nilai." },
            { text: "Satu baris", why: "Bukan soal panjang." },
          ],
        },
        {
          q: "`except:` polos...",
          options: [
            { text: "Praktis", why: "Menelan bug asli — tidak praktis saat debug." },
            { text: "Menelan semua termasuk bug — tangkap spesifik", why: "ValueError/KeyError spesifik.", correct: true },
            { text: "Wajib", why: "Tidak wajib; justru dihindari." },
            { text: "Lebih cepat", why: "Bukan soal kecepatan." },
          ],
        },
        {
          q: "Magic number di tengah kode...",
          options: [
            { text: "Biarkan", why: "6 bulan lagi tidak ada yang tahu artinya." },
            { text: "Ganti konstanta bernama (NPL_BATAS = 0.03)", why: "Nama menjelaskan maksud.", correct: true },
            { text: "Hapus", why: "Nilainya dibutuhkan — namanya yang diperjelas." },
            { text: "Komentari saja", why: "Konstanta bernama lebih baik dari komentar." },
          ],
        },
        {
          q: "Test terbaik untuk fungsi analisis...",
          options: [
            { text: "Data random besar", why: "Tidak deterministik." },
            { text: "Input kecil, expected dihitung manual", why: "Deterministik dan terverifikasi.", correct: true },
            { text: "Tidak perlu test", why: "Fungsi kritis wajib test." },
            { text: "Test sekali saja", why: "Test jalan tiap commit via CI." },
          ],
        },
      ],
      summary: [
        "Satu fungsi = satu tugas; nama jelas; konstanta bernama.",
        "Fungsi murni: return nilai, jangan mutate global.",
        "Fail fast dengan pesan jelas; except spesifik.",
        "Assert = spesifikasi + penjaga; input kecil deterministik.",
        "Notebook untuk eksplorasi; modul untuk yang dipakai ulang.",
      ],
      next: { label: "D15 — SQL & API", href: "/v2/learn/d15-sql-python-api" },
    },
  ],
};
