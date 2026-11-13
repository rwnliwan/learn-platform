#!/usr/bin/env python3
"""Gerbang konsep pra-deploy (pengganti loop review biasa untuk kelas GG-5).

Latar: kelas "konsep/teorema diajarkan salah" muncul tiga ronde berturut-turut
(R7 mle12 -> R8 hd13 -> R9 b15 GBM). Sesuai aturan konsolidasi R8 + keputusan
Septian 9 Nov 12:52, loop biasa untuk kelas ini DIHENTIKAN dan diganti gerbang
ini: sebelum deploy, klaim teorema/rumus/definisi dari lesson yang BERUBAH
saja (git diff) diekstrak dan diverifikasi via SATU panggilan DeepSeek murah
(prompt sempit — hanya klaim + derivasi, bukan review penuh).

Cara pakai:
    python3 qa-learn/concept_gate.py [--base HEAD] [--files a.ts b.ts]
        [--model deepseek-v4.1-flash] [--max-tokens 8000]
        [--out /tmp/concept_gate_out.txt] [--keep-prompt]
    Tanpa --files: file lesson yang berubah vs --base (git diff --name-only,
    worktree + staged). Tanpa perubahan lesson -> PASS (tidak ada yang dicek).

Keluar 0 = lolos (tidak ada kontradiksi); 1 = DITOLAK (kontradiksi ditemukan
atau gerbang gagal berjalan — deploy dilarang sampai jelas).

Ekstraksi klaim: dari tiap file yang berubah, ambil
- `formula` + `formulaNote` (rumus + penjelasannya),
- `note.body` yang mengandung kata kunci konsep (ekspektasi, median, drift,
  teorema, hukum, distribusi, varians, peluang, bukti, definisi, rumus),
- prose yang mengandung pola klaim kuantitatif ("=" / "tumbuh" / "lebih" /
  "E[" / "median" / "mean" / "teorema" / "hukum" / "distribusi"),
- `why` kuis yang mengandung angka/rumus.
Setiap klaim diberi ID `file:step:kunci` agar verdict bisa dilacak.

Panggilan model: SATU panggilan ke kelontong_api.py (deepseek-v4.1-flash,
--stream --max-tokens 8000, temperature 0). Prompt meminta verdict per klaim:
OK / KONTRADIKSI / RAGU + derivasi singkat (<=3 baris). Parser mencari baris
"KONTRADIKSI" — bila ada, gerbang GAGAL.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CONTENT = REPO / "src" / "app" / "v2" / "content"
KELONTONG = (Path.home() / "workspace/custom-connectors/custom.kelontong"
             / "bin/kelontong_api.py")

KEYWORDS = re.compile(
    r"(ekspektasi|median|mean|drift|teorema|hukum|distribusi|varians|"
    r"peluang|probabilitas|rumus|definisi|tumbuh|E\[|kovarians|korelasi|"
    r"konvergen|stasioner|independen|bias|konsisten|efisien|"
    r"μ|σ|λ|θ|π|Σ|∫|√|≈|≤|≥|→|⇒|±)", re.I)

CLAIM_LINE_RE = re.compile(
    r"(formulaNote|formula|body|prose-item|why)\s*:\s*\"((?:\\.|[^\"\\])*)\"",
    re.S)


def unescape_ts(s: str) -> str:
    def _u(m):
        try:
            return chr(int(m.group(1), 16))
        except ValueError:
            return m.group(0)
    s = re.sub(r"\\u([0-9a-fA-F]{4})", _u, s)
    return s.replace("\\n", " ").replace('\\"', '"').replace("\\\\", "\\")


def changed_line_ranges(base: str):
    """Rentang baris BARU (sisi +) dari `git diff -U0 <base>` per file.

    Dipakai mode --changed-lines-only: klaim hanya diambil bila baris awal
    field-nya jatuh di hunk yang berubah. Tanpa ini, diff sweep 150 file
    menghasilkan 1856 klaim (satu file penuh) — tidak muat satu panggilan;
    dengan filter ini tersisa 122 klaim (R9, diukur 2026-11-09).
    Keterbatasan: klaim prose multi-baris yang field-nya MULAI di baris tak
    berubah tapi isinya berubah di baris berikut bisa lolos dari filter —
    mitigasi: string prose lesson hampir selalu satu baris per entri."""
    out = subprocess.run(
        ["git", "diff", "-U0", base, "--", "src/app/v2/content/*.ts"],
        cwd=REPO, capture_output=True, text=True)
    ranges = {}
    cur = None
    for ln in out.stdout.splitlines():
        if ln.startswith("+++ b/"):
            cur = ln[6:]
            ranges[cur] = set()
        elif ln.startswith("@@"):
            m = re.match(r"@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@", ln)
            if m and cur:
                s, n = int(m.group(1)), int(m.group(2) or 1)
                ranges[cur].update(range(s, s + n))
    return ranges


def changed_files(base: str):
    out = subprocess.run(
        ["git", "diff", "--name-only", base, "--",
         "src/app/v2/content/*.ts"],
        cwd=REPO, capture_output=True, text=True)
    staged = subprocess.run(
        ["git", "diff", "--name-only", "--cached", "--",
         "src/app/v2/content/*.ts"],
        cwd=REPO, capture_output=True, text=True)
    files = {f for f in (out.stdout + staged.stdout).splitlines() if f}
    # file baru yang belum di-track juga ikut (git diff tidak melihatnya)
    untracked = subprocess.run(
        ["git", "ls-files", "--others", "--exclude-standard",
         "src/app/v2/content/*.ts"],
        cwd=REPO, capture_output=True, text=True)
    files |= {f for f in untracked.stdout.splitlines() if f}
    return sorted(REPO / f for f in files)


def extract_claims(path: Path):
    text = path.read_text(encoding="utf-8")
    # buang blok kode lab (starter/solution) — klaim konsep tidak ada di sana
    text = re.sub(r"\b(?:starter|solution):\s*`(?:\\.|[^`\\])*`",
                  "starter: ``", text, flags=re.S)
    claims = []
    step = "?"
    for m in re.finditer(r"(?m)^\s*id:\s*\"([^\"]+)\"", text):
        pass  # step dilacak kasar lewat posisi
    # pendekatan sederhana: tiap formulaNote/formula/body/prose/why yang
    # mengandung kata kunci konsep menjadi satu klaim
    for m in CLAIM_LINE_RE.finditer(text):
        field, raw = m.group(1), unescape_ts(m.group(2))
        if len(raw) < 25:
            continue
        if field in ("formulaNote", "formula", "body") or KEYWORDS.search(raw):
            lineno = text[:m.start()].count("\n") + 1
            claims.append((f"{path.name}:{lineno}:{field}", raw.strip()))
    return claims


def build_prompt(files_claims):
    lines = [
        "Kamu adalah pemeriksa konsep matematika/statistika. Tugasmu SEMPIT: "
        "periksa setiap klaim di bawah ini — apakah klaim itu BENAR secara "
        "matematis, atau BERTENTANGAN dengan rumus/definisi yang dikutipnya "
        "sendiri / dengan teori baku? BUKAN review gaya bahasa, BUKAN review "
        "lengkap, BUKAN saran perbaikan umum.",
        "",
        "Format angka memakai konvensi Indonesia: titik (.) = pemisah "
        "ribuan, koma (,) = desimal — '1.024' berarti 1024, '0,5' berarti "
        "0.5, '524.288' berarti 524288. Jangan salah baca '1.024 MB' "
        "sebagai 1,024 MB.",
        "",
        "Aturan verdict per klaim:",
        "- OK: klaim benar (termasuk bila pembulatan wajar).",
        "- KONTRADIKSI: klaim salah, atau bertentangan dengan rumus/definisi "
        "di klaim itu sendiri. Tulis derivasi/koreksi singkat (maks 3 baris).",
        "- RAGU: bukti tidak cukup untuk memvonis (jelaskan apa yang kurang).",
        "",
        "Format jawaban — SATU BARIS per klaim, persis:",
        "[ID] VERDICT: <OK|KONTRADIKSI|RAGU> — <alasan <= 3 baris, koreksi bila salah>",
        "",
        "Kelas kesalahan yang PERNAH lolos dan harus diperiksa ekstra "
        "(temuan review DeepSeek M1 + M2 + M3 + M4 + M5 + M6 dan L0, 2026-11-12/13 — bila sebuah "
        "klaim cocok dengan salah satu pola ini, vonis KONTRADIKSI kecuali "
        "klaim itu sendiri sudah mengoreksinya):",
        "1. Ringkasan menghilangkan qualifier penting (mis. '1.420 nasabah "
        "yang ditolak' padahal yang benar '1.420 nasabah BAGUS yang ditolak').",
        "2. Formula yang hanya benar untuk satu kasus (mis. median "
        "x_((n+1)/2) hanya untuk n ganjil) dipakai pada contoh kasus lain.",
        "3. Dua metrik dari DUA eksperimen/test set berbeda disajikan "
        "berdampingan seolah satu eksperimen.",
        "4. Brier rendah disamakan dengan probabilitas terkalibrasi/jujur.",
        "5. Akurasi dan baseline dibandingkan padahal dihitung pada set "
        "berbeda (train vs test; mis. M4.1: base rate turun KESELURUHAN "
        "58,04% (267/460) disajikan seolah patokan model, padahal patokan "
        "yang benar = naive walk-forward 0,5625 (90/160 hari uji) — dua "
        "angka dari dua populasi berbeda).",
        "6. Band/ambang berlubang (ada rentang nilai tanpa kategori) atau "
        "band satu metrik dipakai untuk metrik lain tanpa dinyatakan.",
        "7. Ambang/threshold disebut hasilnya tapi aturannya tidak ditulis.",
        "8. Angka agregat (mis. n gabungan) bertentangan dengan angka "
        "per-bagian.",
        "9. Statistik dilaporkan tanpa definisinya (mis. sd populasi vs "
        "sampel; mis. M4.3: ω/(1−α−β) = 5,33e-4 disebut 'level jangka "
        "panjang' padahal itu long-run VARIANCE — long-run VOL = "
        "√5,33e-4 = 0,0231; varians dan vol tidak boleh tertukar).",
        "10. Satu skor diberi dua label kualitatif berbeda tanpa memisahkan "
        "kerangkanya.",
        "11. Figure/kurva memakai data di luar dataset yang dinyatakan "
        "tanpa penjelasan asal datanya.",
        "12. Label horizon angka hitung tidak cocok dengan definisi label "
        "dataset (mis. PD dilabel '12 bulan' padahal label = default bulan "
        "berikutnya / 1 bulan; EL/ECL yang dihitung ikut salah label — "
        "definisi standar IFRS 9 boleh tetap, label angka hitung yang "
        "harus benar).",
        "13. Batas bin/bucket/band tumpang tindih di joint atau notasi "
        "batas ambigu di prosa (mis. band IV '0,02–0,1; 0,1–0,3' tumpang "
        "tindih di 0,1/0,3; bucket '61–90 hari' vs '90 hari ke atas' — 90 "
        "masuk dua bucket) — pakai half-open eksplisit.",
        "14. Klaim tanpa angka pendukung, atau angka yang tidak bisa "
        "dilacak ke notebook/lab mana pun (mis. 'tanpa clip, varians "
        "meledak' padahal bobot maks 4,27 dan clip tidak pernah aktif; "
        "selisih desil 0,0252 tidak tercetak di notebook mana pun; mis. "
        "M4.1: '300 pohon sudah jauh melewati titik jenuh' tanpa kurva "
        "OOB-vs-n_estimators; 'boosting menghafal noise lebih cepat' "
        "tanpa train accuracy GBM; 'tidak ada fitur yang bisa dibuang' "
        "tanpa uji ablation).",
        "15. Kata kepastian atau kesimpulan melebihi angka (mis. 'hampir "
        "pasti bermasalah' untuk default rate 0,7578 — 24% lancar; "
        "'Monoton berarti bin-nya benar'; mis. M4.5: 'korelasi antar "
        "saham mendekati 1' padahal korelasi rata-rata regime high-vol "
        "hanya 0,3752).",
        "16. Jumlah fitur/koefisien/langkah tidak cocok dengan notebook "
        "atau kode (mis. 'sembilan koefisien' padahal LR kanonis 31 fitur, "
        "guided 6; komentar starter '5 bulan' padahal 5 transisi).",
        "17. Klaim konvergen bertentangan dengan paragraf yang sama "
        "(mis. '300 iterasi cukup untuk konvergen' lalu 'bobotnya terus "
        "membesar' — data separable tidak konvergen).",
        "18. Istilah standar salah nilai (mis. '20 = points-to-double-"
        "odds' padahal PDO = 20 x ln2 = 13,86).",
        "19. Contoh hitung memakai angka yang dibulatkan hingga hasilnya "
        "salah (mis. 0,6986 x 0,45 x 108.269 = 34.036, bukan 34.035 — "
        "pakai PD eksak 2.088/2.989).",
        "20. Definisi nilai kategorikal salah (mis. 'PAY_0 <= 1 = tidak "
        "telat' padahal PAY_0=1 = telat 1 bulan).",
        "21. Rumus pedagogis disajikan seolah rumus umum (mis. 'tiap poin "
        "adalah 20 x WoE' — rumus umum scorecard LR memakai beta_i + "
        "offset, bukan 20 x WoE mentah).",
        "22. Satuan mata uang tidak cocok dengan dataset (mis. prefix Rp "
        "untuk nilai NT$).",
        "23. Angka turunan tanpa label asal, atau perbandingan dibulatkan "
        "tidak jujur (mis. skor min/maks tanpa keterangan turunan tabel "
        "poin; 'empat kali lipat' untuk 4,45x; 'sekitar 22 persen lebih "
        "rendah' untuk 22,56% — pembulatan ke bawah yang salah arah, "
        "22,56% dibulatkan menjadi ~23%; 'hampir seminggu' untuk "
        "half-life 4,6 hari — 4,6 hari bukan hampir 7 hari).",
        "24. Angka desimal di pola expected/stdout lab memakai koma "
        "Indonesia padahal kode mencetak titik (pola tidak pernah cocok, "
        "cek lab gagal untuk setiap learner).",
        "25. PD lifetime disajikan seolah perkalian PD 1 bulan (lifetime "
        "bukan 12 x PD 1 bulan; butuh kurva survival/akumulasi default).",
        "26. Derivasi tertulis memakai angka yang dibulatkan sementara "
        "hasil yang dicetak berasal dari angka tak-dibulatkan (mis. "
        "C_missed ditulis NT$61.911 bulat padahal semua EV dihitung "
        "dengan 61.910,67 — derivasi 363 x 61.911 - 100.000 = 22.373.693, "
        "bukan 22.373.572 yang dicetak; tulis derivasi dengan angka "
        "tak-dibulatkan, atau tandai dgn tanda kira-kira dan jelaskan "
        "selisih Rp1 dari pembulatan; contoh M4.2: '0,0286 x akar10 = "
        "0,0903' salah — 0,0286 yang dibulatkan memberi 0,0904, nilai "
        "kanonis 0,0903 berasal dari VaR 1-hari tak-dibulatkan 0,028563; "
        "contoh M4.2 juga: rupiah Rp2.856.323 dihitung dari VaR "
        "tak-dibulatkan 0,028563 sementara yang ditampilkan 0,0286 — "
        "pembaca yang mengalikan angka tampil mendapat 2.860.000; "
        "nyatakan basis tak-dibulatkan di samping angka rupiah).",
        "27. Satu istilah dipakai untuk dua konstruk berbeda dalam satu "
        "modul (mis. 'velocity' = V jumlah bulan membayar di M3.3 dan "
        "VELOCITY = rasio tagihan di M3.4 — beri nama berbeda, mis. "
        "BILL_TREND, plus satu kalimat pembeda eksplisit; mis. M4.4: "
        "'korelasi yang sama' untuk dekomposisi (kovarians ANTAR saham) "
        "dan beta (korelasi saham vs ^GSPC) — dua himpunan korelasi yang "
        "sama sekali berbeda).",
        "28. Angka [ilustrasi] (sintetis/contoh, dihitung skrip fill-gap) "
        "disajikan tanpa label asal, atau tanpa kata 'ilustrasi', sehingga "
        "terbaca sebagai angka notebook — setiap angka sintetis WAJIB "
        "berlabel [ilustrasi] di prose, figure, lab, dan kuis.",
        "29. Nomor/ID community (hasil community detection yang "
        "tie-breaking-nya acak, mis. label propagation) dipakai sebagai "
        "fitur atau identitas — nomor community tidak stabil antar-run; "
        "yang stabil dan boleh jadi fitur adalah ukuran, density, dan "
        "fraud rate per community.",
        "30. Satu rasio dipakai sendirian sebagai bukti fraud (mis. rasio "
        "dana keluar/masuk = 1,00, atau rasio vs baseline = 5,0) — rasio "
        "tanpa paket metrik (in/out-flow, dwell, hop, konteks normal) dan "
        "tanpa baseline yang sesuai bisa salah baca (mule yang rasionya "
        "1,00; acara keluarga yang rasionya 5,0).",
        "31. Model dengan fitur terbanyak diasumsikan terbaik tanpa bukti "
        "bertahap — bandingkan per keluarga fitur; fitur yang tidak "
        "membawa sinyal baru hanya menambah noise (capstone M3.5: model "
        "full 0,8397 di bawah +anomaly 0,8577 di P1 maupun P2).",
        "32. Edge/transaksi sesudah cutoff dipakai untuk menilai perilaku "
        "sebelum cutoff (leakage waktu) — batas waktu harus eksplisit dan "
        "semua fitur hanya dari info sebelum cutoff (mis. transaksi "
        "23:00 yang dipakai menilai antrean cutoff 18:00).",
        "33. Penjelasan narasi bertentangan dengan angka yang ditegaskan "
        "di tempat yang sama (mis. M4.2 lab2: pesan 'ES95 0,1200 — "
        "rata-rata dua hari crash' padahal rata-rata kedua crash = 0,10; "
        "ES 0,1200 berasal dari SATU observasi -0,12 — penjelasan dan "
        "angka saling meniadakan; mis. M4.3: cerita 'forecast ditarik "
        "naik menuju level jangka panjang' padahal forecast 0,0203 "
        "berada DI BAWAH vol terakhir 0,0225 dan level jangka panjang "
        "0,0231).",
        "34. Klaim sensitivitas/stabilitas ('nyaris tidak bergerak', "
        "'tidak berubah', 'stabil') tanpa hitung ulang pada contoh yang "
        "dipakai (mis. tambah 1 observasi -0,08 ke n=20 mengubah VaR95 "
        "0,0405 -> 0,0500, +23,5% — klaim stabilitasnya salah; hitung "
        "ulang dulu, baru klaim).",
        "35. Tanggal/window tidak konsisten antar langkah (mis. M4.2: "
        "colab 'window 2024-11-01 sampai 2026-11-12' vs cerita '1 Nov "
        "2024-11 Nov 2026' — bedakan eksplisit window harga (download, "
        "481 baris) vs window return (480 return, terakhir 11 Nov).",
        "36. Rata-rata kondisional ekor (ES/CVaR) dipakai sebagai contoh "
        "kerugian satu hari/observasi tunggal (mis. 'kerugiannya bisa "
        "0,0775 (ES99 historis)' — ES adalah rata-rata ekor, bukan satu "
        "observasi; satu hari bisa melebihi ES).",
        "37. Basis return (log vs simple) untuk korelasi/kovarians/mean "
        "tidak dilabeli, atau berbeda antar langkah tanpa dinyatakan "
        "(mis. M4.2: korelasi antar saham 0,285-0,361 adalah korelasi "
        "LOG-return dikutip tanpa label di lesson yang VaR-nya berbasis "
        "simple return; Monte Carlo 'return log' vs trio 'kovarians "
        "historis' — satu basis, satu label, di semua langkah).",
        "38. Indeks array 0-based disebut nomor hari/tanggal (atau "
        "sebaliknya) tanpa label (mis. M4.1 lab2: sample indeks 3, 4, 7, "
        "9, 11, 13, 14, 19 disebut 'hari 3, 4, 7, ...' padahal hari "
        "1-based-nya 4, 5, 8, 10, 12, 14, 15, 20 — labeli 'indeks' "
        "atau konversi).",
        "39. Estimasi linear dari laju sesaat disajikan sebagai total "
        "kumulatif tanpa koreksi percepatan (mis. M4.4: theta 2,3801 x "
        "90 hari = $214 disajikan seolah peluruhan 3 bulan, padahal "
        "theta mempercepat saat T→0 dan peluruhan kumulatif = 388,03 "
        "(call menjadi 0 bila S tetap = K) — estimasi linear "
        "meremehkan ~45%).",
        "40. Persentil/ambang dihitung atas subset nilai valid tapi "
        "penyebut yang dipakai N total (mis. M4.5: persentil 75 atas "
        "421 nilai rolling-vol valid (480−60+1) memberi 105 hari "
        "high-vol, bukan 120 = 25% dari 480 — jelaskan mekanisme "
        "jendelanya).",
        "41. Status 'pulih' dan angka drawdown terkini disajikan "
        "berdampingan tanpa menjelaskan urutan waktu (mis. M4.5: UNVR "
        "'PULIH 2025-10-16, saat ini −0,4051' — benar kedua angkanya, "
        "tapi menyesatkan tanpa 'pulih lalu jatuh lagi −40,51% dari "
        "puncak baru').",
        "42. Durasi pemulihan tanpa basis eksplisit dari-puncak vs "
        "dari-lembah (mis. M4.5: BBCA 'belum pulih setelah lebih dari "
        "1 tahun' — lembah→sekarang ~5 bulan, puncak→sekarang >2 "
        "tahun; tulis basisnya).",
        "43. Klaim arah/bentuk fungsi (naik/turun/puncak) tanpa "
        "memeriksa rumus (mis. M4.4: 'vega paling besar pada opsi ATM "
        "dan jangka menengah' padahal vega ATM ∝ √T — T=0,25 → 14,99, "
        "T=1 → ≈28,74, puncak di jangka PANJANG).",
        "44. Persentase perubahan dari log return dihitung seolah "
        "simple return (mis. M4.5: log return −0,1603 ditulis "
        "'sekitar −16,0%' padahal persen yang benar = exp(−0,1603)−1 "
        "= −14,8%; log −0,0892 → −8,5%, bukan −8,9%).",
        "45. Koordinat/tinggi elemen figure (bar/label/garis) tidak "
        "cocok dengan skala sumbu yang dinyatakan — hitung ulang dari "
        "skala (mis. M4.1: naive 0,5625 dengan skala 0,40→206, "
        "0,60→30 = 880 px/unit → y = 206 − 0,1625×880 = 63,0, bukan "
        "62,6).",
        "46. Matriks korelasi/kovarians return aset disebut berubah "
        "karena bobot/jual-beli (mis. M4.4: 'menjual seluruh posisi "
        "mengubah bobot portofolio dan matriks korelasinya') — korelasi "
        "adalah sifat return, bukan bobot; yang berubah adalah bobot, "
        "varians portofolio, dan dimensi matriks bila aset dikeluarkan "
        "(3×3 menjadi 2×2).",
        "47. Hari tanpa pengukuran (NaN, mis. jendela rolling belum "
        "penuh) dihitung ke salah satu kategori tanpa dinyatakan "
        "konvensinya (mis. M4.5: 59 hari awal tanpa vol rolling "
        "dihitung low-vol karena tidak melewati ambang — low 375 = "
        "316 bervol + 59 tanpa vol; tanpa klausa ini, 421−105=316 "
        "tampak bertentangan dengan 375).",
        "48. Perkiraan orde-1 (delta) disajikan sebagai perubahan "
        "harga sebenarnya (mis. M4.4: S +1% → call 'naik $43,17' "
        "padahal repricing Black-Scholes = $44,49; delta saja "
        "meremehkan $1,32 = suku gamma; labeli 43,17 sebagai "
        "'perkiraan delta', 44,49 sebagai 'perubahan sebenarnya').",
        "49. VaR kondisional dibaca sebagai alarm/prediksi crash "
        "(mis. M4.3: pada 16 Okt 2026 VaR95 EWMA 0,0169 dan GARCH "
        "0,0228 BERADA DI BAWAH VaR statis 0,0286 — VaR kondisional "
        "bereaksi SETELAH guncangan, bukan sebelum; ia bukan peringatan "
        "dini).",
        "50. Ambang full-sample dipakai untuk keputusan historis "
        "tanpa prosedur real-time (look-ahead) (mis. M4.5: ambang p75 "
        "0,3316 full-sample tidak boleh dipakai untuk keputusan di "
        "tengah jalan; prosedur real-time = ambang expanding dari data "
        "yang tersedia saja, label hari t untuk keputusan t+1).",
        "51. Akurasi/presisi tinggi disamakan dengan profit (mis. "
        "M4.1: threshold 0,60 akurasi 0,6125 dan presisi 0,6176 "
        "TERBAIK tapi NET −11,88% TERBURUK — akurasi ≠ profit; return "
        "ditentukan hari-hari mana kamu long, bukan seberapa sering "
        "kamu benar).",
        "52. Kerugian terealisasi (P&L shock) dicampur dengan ukuran "
        "risiko (VaR) (mis. M4.5: shock return −10% → P&L −Rp10 jt, "
        "VaR95 tetap 0,0324 — satu guncangan titik tidak mengubah "
        "vol/distribusi, jadi tidak mengubah VaR).",
        "53. Jumlah suku yang dibulatkan disajikan sebagai sama persis "
        "dengan jumlah tak-bulat (mis. M4.4: 43,17 + 1,34 = 44,51, "
        "bukan 44,50 — jumlah tak-bulat delta+gamma = 44,50; pakai ≈ "
        "dan catat pembulatannya).",
        "54. Masalah optimasi tak-terbatas/ill-posed disajikan sebagai "
        "punya optimum berhingga (mis. M5.2: max-Sharpe tak-terkendala — "
        "SLSQP berhenti di w = [−3154; −3786; 6941] dengan Sharpe 0,6697 "
        "disebut 'portofolio optimal', padahal supremum 0,6718 tak pernah "
        "dicapai dan titik berhenti bergantung titik awal; sebut artefak, "
        "bukan solusi).",
        "55. Mitigasi estimation error (shrinkage, Black-Litterman, "
        "kendala) diklaim memperbaiki return out-of-sample padahal hanya "
        "memperbaiki vol/stabilitas (mis. M5.5: GMV-LW OOS vol 0,3296 vs "
        "GMV 0,3372 tapi return −0,3703 vs −0,3697 TIDAK membaik; Sharpe "
        "BL 0,7671 posterior vs −0,6178 pada statistik sample — posterior "
        "bukan ramalan).",
        "56. Risk parity disamakan dengan equal-weight, atau target risk "
        "contribution disamakan dengan target bobot (mis. M5.4: RP w "
        "[0,398; 0,3212; 0,2808] dengan RC 1/3 tiap aset — bobot TIDAK "
        "sama rata; target RC [0,5; 0,3; 0,2] memberi bobot [0,5157; "
        "0,2910; 0,1932], bukan [0,5; 0,3; 0,2]; bahkan dengan korelasi "
        "nol dan vol sama pun bobot mengikuti AKAR target, w_i ∝ √r_i — "
        "untuk [0,5; 0,3; 0,2] bobotnya [0,4154; 0,3218; 0,2628]; hanya "
        "target SAMA RATA yang berimpit dengan bobot).",
        "57. Frontier in-sample disajikan sebagai janji return masa depan "
        "(mis. M5.3/M5.5: max-Sharpe in-sample Sharpe 0,7644 jatuh ke "
        "−0,8780 out-of-sample — frontier menjawab 'risiko minimum untuk "
        "tiap target return di data ini', bukan 'return yang akan "
        "didapat').",
        "59. Peringkat Sharpe negatif dibaca terbalik (mis. M5.5: "
        "dengan semua Sharpe OOS negatif, −0,8780 (max-Sharpe) adalah "
        "yang TERTINGGI/terbaik, bukan 'terburuk kedua' — yang paling "
        "negatif, −1,3278 (equal-weight), yang terburuk; jangan baca "
        "'besar' sebagai 'buruk' tanpa memperhatikan tanda; peringkat "
        "return, vol, dan Sharpe OOS bisa berbeda arah).",
        "58. Sharpe (w'μ − rf)/σ disebut homogen derajat nol / invarian "
        "skala sehingga kendala Σw = 1 dianggap tidak mengubah supremum "
        "(mis. M5.2: S TIDAK homogen — rf tidak ikut skala, S([0; 0; 1]) "
        "= 0,0590 tapi S(2·[0; 0; 1]) = 0,1089; supremum DENGAN Σw = 1 "
        "adalah 0,6718, TANPA kendala jumlah 0,9283 (arah Σ⁻¹μ, net "
        "short), dan versi excess 1,0517 — tiga angka berbeda; hanya "
        "versi excess w'(μ − rf·1)/σ yang homogen).",
        "60. Arah efek multiplier λ salah tanda (mis. M5.2: λ = 2σ²_p = "
        "0,1913 > 0 berarti melonggarkan kendala Σw = 1 dari 1,00 ke 1,01 "
        "MENAIKKAN varians ≈ λ × 0,01 ≈ 0,0019 (V(b) = b²·V(1)); bila "
        "prose/kuis menulis 'menurunkan', itu salah arah — cek tanda "
        "envelope theorem dV/db = λ).",
        "61. Jumlah titik di atas/di bawah ambang dihitung dari daftar "
        "titik yang lesson itu sendiri tulis (mis. M5.3: frontier 8 titik "
        "dengan return −0,1903; −0,1517; −0,1132; −0,0746; −0,0361; "
        "+0,0025; +0,0410; +0,0796 — TIGA di atas return 0, bukan 'hanya "
        "ujung UNVR'; hitung dari tabel, jangan dari kesan bentuk kurva).",
        "62. Superlatif komparatif ('paling terkonsentrasi', 'paling "
        "timpang') tanpa membandingkan SEMUA kandidat (mis. M5.4: GMV max "
        "RC share 0,5526 BUKAN paling terkonsentrasi — Max-Sharpe 1,0000; "
        "EW spread 0,1638 BUKAN paling timpang — GMV 0,3752; bandingkan "
        "dulu keempat portofolio sebelum memakai 'paling').",
        "63. Marginal contribution dibaca sebagai efek dengan bobot lain "
        "menyesuaikan (mis. M5.4: MC_i = (Σw)_i/σ_p adalah turunan "
        "PARSIAL — bobot lain TETAP (ceteris paribus), efek +0,01 UNVR "
        "≈ 0,0039; bila bobot lain menyesuaikan menjaga Σw = 1, efeknya "
        "hanya ≈ 0,0011 — dua angka berbeda, jangan dicampur).",
        "64. Definisi risk contribution di kode lab berbeda dari rumus di "
        "langkah tanpa label (mis. M5.4: lab risk_contrib = w·(Σw) TANPA "
        "/σ_p — itu RC TAK-TERNORMALISASI; rumus langkah RC_i = "
        "w_i(Σw)_i/σ_p; share = rc/vol² tetap sama di keduanya — labeli "
        "eksplisit mana yang dipakai, jangan biarkan siswa membandingkan "
        "angka yang beda definisi).",
        "65. Label rf pada rumus/kode max-Sharpe tidak cocok dengan kode "
        "(mis. M5.5 lab2: prose melabel 'rf = 0,05' sementara kode "
        "max_sharpe_w memakai Σ⁻¹·μ TANPA (μ − rf) — itu rf = 0; bila "
        "rf = 0,05 benar, max-Sharpe long-only 2-aset = [1, 0], bukan "
        "[0,7836; 0,2164] — label harus mengikuti kode, bukan sebaliknya).",
        "66. Return posterior Black-Litterman disajikan tanpa menjelaskan "
        "suku rf (mis. M5.5: w·M = 0,2354 (excess) sedangkan return yang "
        "ditampilkan 0,2854 = w·M + rf; M adalah excess return — tulis "
        "rumusnya eksplisit agar pembaca yang menghitung w·M tidak mengira "
        "ada selisih 0,05 yang hilang).",
        "67. Perbandingan SE vs estimasi dibaca longgar ('sebesar' padahal "
        "lebih besar) (mis. M5.5: SE UNVR 0,5807 LEBIH BESAR dari estimasi "
        "0,4831 — bukan 'sebesar'; bila satu langkah menulis 'lebih besar' "
        "dan langkah lain 'sebesar', itu kontradiksi internal — samakan "
        "dengan angka).",
        "68. Satu simbol dipakai dua makna tanpa pembeda (mis. M5.5: "
        "'delta' = shrinkage Ledoit-Wolf 0,0955 DAN risk-aversion "
        "Black-Litterman 2,5 — labeli 'delta shrinkage' vs 'delta "
        "risk-aversion' pada kemunculan pertama tiap langkah).",
        "69. Koefisien korelasi dibaca sebagai fraksi waktu bergerak "
        "searah (mis. M5.1: korelasi 0,3488 BUKAN 'searah sepertiga "
        "waktu' — ρ mengukur kekuatan hubungan linear, bukan proporsi "
        "kejadian; 'korelasi positif moderat' adalah bacaannya).",
        "70. Aritmetika vol² = diagonal Σ dari vol yang sudah dibulatkan "
        "(mis. M5.1/M5.3: 0,4251² = 0,180710 ≠ 0,180734; 0,5014² = "
        "0,251402 ≠ 0,251375 — diagonal Σ berasal dari vol presisi penuh; "
        "bila vol ditampilkan 4 desimal, catat pembulatannya, jangan klaim "
        "kesamaan persis).",
        "71. 'Selisih maks' lab vs prose dicampur tanpa menyebut basis "
        "pembulatan (mis. M5.2: lab mencetak 0,0007 dari bobot tak-bulat "
        "dengan Σ 6 desimal, prose 0,0008 dari bobot 4 desimal — keduanya "
        "benar; sebut basis tiap angka, jangan samakan diam-diam).",
        "72. Klaim titik berhenti solver default (tanpa ftol ketat) tanpa "
        "verifikasi di environment target (mis. M5.4: 'tanpa ftol, SLSQP "
        "berhenti di [0,4006; 0,3224; 0,2770]' — jalankan di environment "
        "target (scipy 1.11.4: terverifikasi persis) atau turunkan klaim "
        "ke kualitatif 'berhenti sebelum konvergen penuh').",
        "78. Biaya transaksi dihitung dari L1 PENUH, bukan L1/2 (mis. "
        "M5.3: EW→GMV L1 0,4380 → biaya (0,4380/2) × 20bp = 4,38bp "
        "[ilustrasi], bukan 0,4380 × 20bp = 8,76bp; notional sekali jalan "
        "= L1/2 karena tiap rupiah yang dibeli dibiayai dari rupiah yang "
        "dijual — memakai L1 penuh menggandakan biaya; dan L1 (turnover) "
        "jangan disamakan dengan biaya (bp) — keduanya satuan berbeda).",
        "79. Ukuran downside (downside deviation, Sortino, ES-min) diklaim "
        "otomatis lebih baik dari varians/Sharpe tanpa membandingkan "
        "angkanya (mis. M5.3: min-semivarians DD 0,2343 vs GMV 0,2345 — "
        "selisih 0,0002, nyaris sama; ES95-min menukar sedikit VaR "
        "(0,0267 → 0,0280) dengan sedikit ES (0,0437 → 0,0429) — "
        "laporkan perbandingan keduanya, jangan klaim perbaikan tanpa "
        "angka pembanding; ES adalah rata-rata ekor, bukan kerugian satu "
        "hari — lihat kelas 36).",
        "80. Sensitivitas diklaim dari perubahan DUA input sekaligus, atau "
        "dari skala seragam yang memang tidak berpengaruh (mis. M5.3: "
        "semua vol ×1,1 TIDAK mengubah GMV [0,5523; 0,2699; 0,1777] — "
        "Σ diskalakan 1,21 dan tercoret saat normalisasi; klaim 'input X "
        "menggerakkan jawaban' wajib dari hitung ulang SATU-input-berubah "
        "— rf 0,03–0,07 tidak menggerakkan MS long-only [0; 0; 1], tapi "
        "cap UNVR ≤ 0,50 menjatuhkan Sharpe MS dari 0,0590 ke −0,3721).",
        "73. Kondisi matriks kovarians diklaim ('sehat', 'aman dibalik', "
        "'hampir singular') tanpa angka eigenvalue/condition number "
        "(mis. M5.2: Σ 'sehat' berarti SEMUA eigenvalue > 0 "
        "(di sini [0,088937; 0,151142; 0,310986]), cond = λmaks/λmin "
        "kecil (di sini 3,5), det ≠ 0 (di sini 0,004180), Cholesky "
        "berhasil; sebaliknya korelasi → 1 membuat satu eigenvalue → 0 "
        "dan cond meledak (corr 0,99 → cond 207,9; corr 1,0 → singular, "
        "det 0) — jangan klaim invers aman tanpa keempat angka ini, dan "
        "jangan sebut Σ 'hampir singular' bila eigenvalue terkecilnya "
        "0,0889).",
        "74. Harga kendala dibaca dari intuisi, bukan dari vol yang "
        "dihitung ulang di kedua sisi (mis. M5.2 vs GMV bebas vol "
        "0,2966: cap BBCA ≤ 0,40 [ilustrasi] → vol 0,3026 (+60bp); "
        "kardinalitas ≤ 2 → vol 0,3093 (+127bp, termahal); minimum "
        "holding 0,10 → vol 0,2966 (+0bp) karena GMV sudah ≥ 0,10 tiap "
        "aset (bobot terkecil 0,1777) — kendala hanya berharga bila "
        "mengikat; klaim 'kendala X mahal/murah' tanpa vol kedua sisi "
        "adalah intuisi, bukan harga — dan jangan tukar vol antar "
        "kendala).",
        "75. Tau Black-Litterman dibaca sebagai 'bobot view' tanpa menyebut "
        "konvensi Omega (mis. M5.5: dengan Ω = τ·PΣP' (He-Litterman), τ = "
        "0,01 / 0,05 / 0,20 memberi M SAMA PERSIS [0,196; 0,2175; 0,298] — "
        "(τΣ)⁻¹ dan Ω⁻¹ sama-sama berskala 1/τ sehingga τ saling "
        "meniadakan; yang menggerakkan M adalah skala RELATIF Ω (×0,5 → M "
        "[0,2007; 0,2084; 0,2971], ×2 → [0,1912; 0,2265; 0,2990]) dan proxy "
        "pasar (GMV sebagai proxy → Π nyaris rata [0,2201; 0,2200; 0,2196]) "
        "— bila konvensinya Omega bebas, τ BISA berpengaruh; nyatakan "
        "konvensi dulu, baru klaim efek τ).",
        "76. Return/Sharpe NOMINAL dipakai menilai ketahanan terhadap "
        "estimation error, atau peringkat nominal diasumsikan bertahan di "
        "worst-case (mis. M5.5: GMV nominal 'terbaik' (vol 0,2966) menjadi "
        "TERBURUK worst-case k=1 (−0,4760 vs EW −0,4477) — worst-case "
        "menghukum return (w'μ_wc), bukan vol; robust optimization mengubah "
        "PERINGKAT, bukan hanya angka; dan robust tidak selalu mengubah "
        "bobot (robust max-Sharpe tetap [0; 0; 1]) — yang berubah keyakinan "
        "(Sharpe nominal 0,059 vs worst-case −0,6655); laporkan k dan "
        "SE-nya).",
        "77. Walk-forward / beberapa lipatan dibaca sebagai bukti "
        "lintas-rezim atau kemenangan total (mis. M5.5: GMV menang 4/6 "
        "lipatan vs EW tapi total −0,3272 vs EW −0,3279 nyaris sama dan "
        "semua strategi ≈ −0,32 sampai −0,33 — walk-forward TIDAK "
        "membalikkan vonis split 240/240; nilainya konsistensi, bukan "
        "kemenangan; dan 6 lipatan expanding yang tumpang tindih dalam "
        "SATU crash bukan 6 percobaan independen maupun bukti lintas-rezim "
        "— sebut rezimnya).",
        "81. Selisih DUA skor dari protokol/test set BERBEDA dilabeli "
        "sebagai bias/efek dari SATU definisi (mis. M6.2: bias leakage "
        "didefinisikan s_test(λ̂_test) − s_test(λ̂_CV) — kedua suku skor "
        "test pada test set YANG SAMA — tapi dihitung sebagai 0,7823 − "
        "0,7858 = −0,0035, padahal 0,7858 adalah rata-rata nested CV (5 "
        "outer test yang berbeda); bias yang benar 0,7823 − 0,7823 = "
        "0,0000 karena λ̂_test = λ̂_CV = (100, 5, 0,05). −0,0035 adalah "
        "kuantitas NYATA tapi beda: selisih ANTAR-PROTOKOL (single-split "
        "minus nested) — labeli sesuai definisinya, jangan pinjam label "
        "bias).",
        "82. Angka/biaya dilabeli [notebook] padahal notebook memakai "
        "subset/pendekatan BERBEDA dari grid kanonis penuh (mis. M6.2: "
        "'275 kali latih [notebook]' adalah grid PENUH kanonis (18 "
        "konfigurasi × 3 fold × 5 outer); notebook memakai subset 8 "
        "konfigurasi = 125 kali latih dan membandingkan ke kanonis "
        "0,7858 dalam toleransi 0,005 — biaya yang dilabeli [notebook] "
        "harus biaya yang BENAR-BENAR dijalankan notebook; bila berbeda, "
        "sebut keduanya dan toleransinya).",
        "83. Arah pemicu winner's curse / bias seleksi DIBALIK: diklaim "
        "bias MEMBESAR bila selisih antar-konfigurasi BESAR (mis. M6.2: "
        "'makin besar selisih antar-konfigurasi, makin besar hadiah bagi "
        "pemilihan yang curang'). Yang benar: selisih BESAR justru "
        "memudahkan pemilihan yang benar; curse membesar bila "
        "kandidat-kandidat HAMPIR SETARA (selisih sinyal kecil, mis. "
        "0,0038 di grid GBM) sehingga ranking ditentukan NOISE, ditambah "
        "search space besar dan/atau data validasi kecil.",
        "84. Optimisme pemenang vs RATA-RATA optimisme dipakai sebagai "
        "bukti/ukuran winner's curse (mis. M6.5: optimisme 0,0042 "
        "disebut winner's curse tanpa kualifikasi, padahal rata-rata "
        "optimisme KE-18 konfigurasi JUGA 0,0042). Bila optimisme "
        "pemenang SAMA dengan rata-rata semua kandidat, angka itu adalah "
        "gap protokol CV-vs-holdout yang dimiliki semua kandidat — BUKAN "
        "estimasi eksklusif curse. Bukti curse yang sebenarnya adalah "
        "ketidakstabilan PERINGKAT (mis. K15 peringkat-15 CV menyamai "
        "skor test tertinggi; seri 4 arah di test 0,7823).",
        "85. Superlatif tanpa kualifikasi n/pembanding (mis. M6.4: bin "
        "[0,5–0,6) diklaim 'penyimpangan TERBESAR' (0,0481) padahal bin "
        "[0,8–0,9) lebih besar (0,0485) — superlatif wajib kualifikasi "
        "('terbesar di antara bin ber-n ≥ 100' / 'terbesar kedua'); "
        "mis. M6.1: 'max_depth tanpa batas mengisi 6 terbawah' padahal "
        "keenam konfigurasi itu berperingkat 12–17 dari 18 — klaim "
        "peringkat wajib menyebut peringkat sebenarnya).",
        "86. Label varian model (mentah vs terkalibrasi) DICAMPUR dengan "
        "metrik varian lain (mis. M6.4: Brier 0,1342 = GBM MENTAH "
        "dikutip di prose yang menyebut model keputusan 'GBM "
        "terkalibrasi (Platt/sigmoid)' — padahal Brier Platt 0,1345. "
        "Tabel threshold dihitung pada probabilitas Platt, jadi labelnya "
        "harus 'GBM terkalibrasi (Platt/sigmoid)' dengan Brier 0,1345; "
        "bila mengutip 0,1342, labelnya 'GBM mentah'. Setiap angka "
        "kalibrasi wajib dipasangkan dengan varian yang menghasilkannya).",
        "87. Perbandingan lintas-protokol (fold berbeda / CV vs "
        "single-split / nested vs biasa) disajikan TANPA caveat (mis. "
        "M6.1: default dinilai 5-fold CV vs grid 3-fold CV — selisih "
        "0,0025 harus dibaca sebagai orde besaran, bukan selisih eksak; "
        "bandingkan hanya angka dari protokol yang sama, atau sebut "
        "caveatnya eksplisit di kalimat yang sama).",
        "88. Angka/prosedur dilabeli [notebook] padahal HANYA ada di "
        "notebook sebagai detail implementasi, bukan angka kanonis "
        "(mis. M6.1: distribusi log-uniform 0,03–0,20 dan seed 43; "
        "M6.2: subset 8 konfigurasi / 125 latih; M6.4: cv=3 pada "
        "CalibratedClassifierCV). Detail seperti itu WAJIB dilabeli "
        "'detail implementasi notebook, bukan angka kanonis' ATAU "
        "dimasukkan ke file kanonis (bila memang parameter eksperimen "
        "yang menentukan hasil) — jangan biarkan klaim [notebook] tanpa "
        "jejak di kanonis maupun label pembeda.",
        "89. Selisih dihitung dari angka tampil yang SUDAH dibulatkan, "
        "bukan dari nilai penuh (rounding-tension): mis. M6.1 "
        "menampilkan rata-rata kelompok yang dibulatkan (depth 5: "
        "0,7861 vs 0,7852) lalu menyatakan selisih 0,0010 — padahal "
        "0,7861 − 0,7852 = 0,0009; selisih yang benar (0,00097 → "
        "0,0010) dihitung dari rata-rata tak-dibulatkan (0,78613 vs "
        "0,78517). Contoh kedua: depth 5 vs tanpa batas 0,7856 − "
        "0,7841 = 0,0015 padahal selisih penuh 0,00158 → 0,0016. "
        "Aturan: selisih WAJIB dihitung dari nilai penuh lalu "
        "dibulatkan — atau tampilkan desimal lebih banyak — jangan "
        "pernah menyatakan selisih yang tidak sama dengan selisih "
        "angka tampil.",
        "90. Angka threshold/kalibrasi yang DIPILIH pada test yang sama "
        "disajikan sebagai template evaluasi final tanpa label — "
        "kontradiksi internal antar-lesson (mis. M6.4 memilih "
        "threshold 0,10 pada test 6.000 yang sama, sementara M6.5 "
        "melarang memakai test untuk memilih threshold). Angka seperti "
        "itu WAJIB dilabeli eksplisit 'hasil ilustrasi protokol "
        "lesson', BUKAN template evaluasi final; prosedur yang benar "
        "adalah three-way split (train / kalibrasi-validasi / test "
        "final) — dan label itu harus muncul di langkah, lab, DAN kuis "
        "yang memakai angka tersebut.",
        "91. Jumlah percobaan dilaporkan hanya dari sesi yang "
        "dilaporkan — 'effective number of attempts' disembunyikan "
        "(mis. M6.5: laporan 'satu pencarian, 18 kandidat' padahal "
        "tiga sesi = 54 konfigurasi + 1 run gagal). Registry wajib "
        "mencatat SEMUA sesi dan run gagal; skor yang dilaporkan harus "
        "menyebut total percobaan; 'effective number of attempts' "
        "adalah konsep KUALITATIF [ilustrasi] — tidak ada rumus tunggal "
        "yang mengubah jumlah percobaan menjadi satu angka koreksi, "
        "jadi jangan pernah menyajikannya sebagai angka koreksi.",
        "92. Threshold dipilih semata dari maks profit tanpa memeriksa "
        "constraint bisnis (operating point): mis. M6.4 — profit-max "
        "0,10 (approval 28,5%) MELANGGAR constraint approval ≥ 50%; "
        "pilihan-dengan-constraint adalah 0,20 (profit −NT$216.500) "
        "dengan harga NT$8.430.500 laba dibanding profit-max. "
        "Threshold dari constraint vs dari maks profit adalah DUA "
        "jawaban berbeda — sajikan berdampingan, jangan biarkan "
        "profit-max tampil sebagai satu-satunya jawaban.",
        "93. sd antar-fold dipakai sebagai ketidakpastian MEAN (mis. "
        "M6.2: sd 0,0068 dilaporkan sebagai 'mean 0,7858 ± 0,0068'). "
        "Ketidakpastian mean adalah SE = sd/√k (di sini 0,0030, "
        "k=5), bukan sd; CI dari SE itu NAIF karena fold tidak "
        "independen (train antar-fold tumpang tindih 75%: dua fold "
        "berbagi 14.400 dari 19.200 baris) — CI naif WAJIB dilabeli "
        "naif dan tidak boleh dilaporkan sebagai interval kepercayaan "
        "formal.",
        "94. Model flagship MEMAKAI atribut sensitif sebagai fitur "
        "(M7.1/M7.2): koefisien LR SEX −0,0626, EDUCATION −0,0575, "
        "MARRIAGE −0,0565, AGE +0,0547; SHAP GBM SEX 0,0314; "
        "permutation GBM SEX 0,0008 (>0). Eksperimen drop-sensitive "
        "(M7.4) hanya bermakna bila baseline memakainya (28 fitur "
        "tersisa dari 31). Jangan pernah mengklaim model 'tidak "
        "memakai SEX' atau 'tidak pernah melihat kolom sensitif' — "
        "dan jangan menyajikan proxy sebagai SATU-SATUNYA jalur "
        "ketimpangan.",
        "95. Menghapus kolom sensitif MENURUNKAN disparitas tetapi "
        "tidak menuntaskannya (M7.4: AIR SEX 0,8694 → 0,9211, melewati "
        "ambang 0,80) — bukan 'hanya menyembunyikan' dan bukan "
        "'membuat model adil'. Proxy tetap terdeteksi (probe GBM "
        "memprediksi SEX dari fitur tersisa, ROC-AUC 0,6261); bukti "
        "keadilan tetap audit per grup SESUDAH penghapusan (AIR, FPR, "
        "FNR).",
        "96. Urutan temporal PAY_0→PAY_6 = terbaru→terlama (M7.3): "
        "PAY_0 = status bayar bulan terakhir, PAY_6 = enam bulan "
        "lalu. Untuk nasabah 858: tiga bulan terbaru 3, 2, 2 "
        "(PAY_0/2/3), tiga bulan tertua 7, 7, 7 (PAY_4/5/6). Jangan "
        "membalik urutan — 'tiga bulan terakhir' berarti PAY_0/2/3.",
        "97. Penyesuaian threshold per grup TERBUKTI memperbaiki AIR "
        "(M7.4: 0,8694 → 0,9999, approval gap 0, biaya 33.046.500 → "
        "32.756.000, profit 8.214.000 → 8.504.500) — jangan mengklaim "
        "mitigasi 'bukan threshold-nya' secara absolut. Bedakan "
        "perbaikan akar-masalah (fitur/label) dari perbaikan metrik "
        "via threshold; keduanya sah, dengan harga dan batas yang "
        "berbeda.",
        "98. Aturan level alert SATU dan konsisten di semua tempat "
        "(M7.5 — langkah, lab, checkpoint, rangkuman): 1 periode = "
        "WASPADA, 2 periode berturut-turut = KRITIS (atau PSI skor "
        "> 0,25 sendirian). Jangan biarkan lab memakai aturan "
        "'ROC-drop DAN PR-drop dalam satu periode = KRITIS' "
        "sementara langkah memakai aturan 2-periode — satu aturan, "
        "satu angka alert per kasus.",
        "99. Angka performa WAJIB dilabeli varian modelnya (M7.5): "
        "GBM mentah ROC-AUC 0,7823 / PR-AUC 0,5597 vs GBM "
        "terkalibrasi (Platt/sigmoid) 0,7816 / 0,5558. Jangan biarkan "
        "dua angka 'test ROC-AUC' muncul dalam satu langkah tanpa "
        "penanda mentah vs terkalibrasi — model keputusan live memakai "
        "skor terkalibrasi.",
        "100. Prior shift (label shift) murni (M7.5): bila base rate "
        "naik sementara model dan threshold tetap, model "
        "under-predict peluang default — approval cenderung NAIK "
        "(bukan turun), bad rate yang disetujui naik, kalibrasi "
        "bergeser meski ranking utuh. Jangan mengklaim arah approval "
        "tanpa mekanika; arah approval bergantung pada pergeseran "
        "distribusi X.",
        "101. Superlatif ('paling', 'terburuk', 'terbaik') WAJIB "
        "menyebut cakupannya (M7.2): tanpa kualifikasi, 'paling' "
        "dibaca global dan salah bila ada grup lain yang lebih "
        "ekstrem. ECE SMA 0,0362 = kalibrasi terburuk DI ANTARA "
        "GRUP BESAR EDUCATION; 60+ (ECE 0,1208, n kecil) lebih "
        "buruk. Setiap superlatif kalibrasi/approval WAJIB menyebut "
        "'di antara grup besar' atau cakupan setaranya.",
        "102. Uji-z dan interval kepercayaan dari sampel yang sama "
        "BUKAN dua bukti independen (M7.2): keduanya dihitung dari "
        "SE yang sama — uji-z dan CI adalah dua cara membaca bukti "
        "yang sama, bukan dua bukti yang saling menguatkan. Jangan "
        "menyebutnya 'dua bukti independen'.",
        "103. Bedakan syarat CUKUP dari syarat PERLU (M7.2): "
        "distribusi fitur identik antar grup adalah syarat CUKUP "
        "(bukan PERLU) untuk approval sama — model konstan "
        "menyetujui semua orang apa pun fiturnya, dan perbedaan "
        "distribusi bisa saling meniadakan. 'Approval hanya sama "
        "bila distribusi sama' salah logika.",
        "104. Transformasi monoton mempertahankan URUTAN PREDIKSI, "
        "bukan urutan atribusi (M7.3): kalibrasi Platt (monoton) "
        "menjaga ranking skor nasabah — itu sebabnya ROC-AUC nyaris "
        "sama — tetapi nilai SHAP dan urutan fitur teratas pada skor "
        "terkalibrasi BISA BERBEDA dan belum diverifikasi bila tidak "
        "dihitung ulang. Jangan mengklaim 'ranking dan fitur "
        "teratasnya sama'; kutip angka SHAP selalu dengan label "
        "«GBM mentah».",
        "105. Fairness monitoring BUKAN population monitoring (M7.5/G1): "
        "overall yang stabil tidak membuktikan fairness yang stabil — "
        "approval overall per chunk [waktu semu] 25,17%–33,67% tanpa tren "
        "dan ROC-AUC 0,7428–0,8138 tanpa tren, sementara AIR SEX "
        "[simulasi] bergerak 0,869 → 0,710 → 0,830 → 0,910 → 0,940 dan "
        "chunk 2 (0,710) jatuh di bawah 0,80. Alert fairness WAJIB "
        "terpisah dari alert overall; 'overall AMAN' bukan 'fairness "
        "AMAN'. Dashboard fairness: approval, AIR, gap TPR/FPR/FNR, "
        "ECE/Brier per grup — masing-masing dengan n dan label "
        "matangnya.",
        "106. Intersectional audit (M7.2/G2): AIR global menyembunyikan "
        "irisan — SEX global 0,8693 vs Laki-laki × SMA 0,2655 (n = 411, "
        "selisih −0,6038) dan Laki-laki × 60+ 0,5640 (selisih −0,3053). "
        "Stratifikasi satu atribut tidak menggantikan audit irisan. Sel "
        "n < 100 (L × Lainnya 25, P × Lainnya 57, L × 60+ 36, P × 60+ 40) "
        "dilaporkan, tidak divonis. 18 sel diuji pada ambang 5% berarti "
        "~1 flag palsu diharapkan secara kebetulan (multiple "
        "comparisons) — flag yang berdiri sendiri diselidiki, flag yang "
        "membentuk POLA ditindaklanjuti.",
        "107. Ketidakpastian gap fairness / bootstrap CI (M7.2/G3): "
        "'tidak signifikan ≠ tidak ada gap' — gap TPR CI [−0,0498; "
        "0,0110] mencakup 0 berarti tidak bisa divonis, bukan gapnya "
        "nol. Gap nyata (bootstrap 1.000 ulangan, seed 42): approval "
        "+3,93 pp CI [1,78; 6,22]; AIR 0,8693 CI [0,7978; 0,9391]; FPR "
        "−0,0383 CI [−0,0653; −0,0123]; Brier −0,0143 CI [−0,0257; "
        "−0,0036]. Gap yang tidak bisa divonis: TPR, PPV [−0,0446; "
        "0,0101], ECE [−0,0155; 0,0118]. Laporkan titik + CI, bukan "
        "titik saja.",
        "108. Label maturity / matured cohort (M7.5/G4): label 'default "
        "bulan depan' baru tersedia setelah jendela observasi 1 bulan. "
        "ROC-AUC, PR-AUC, bad rate, dan metrik fairness HANYA dihitung "
        "pada cohort matang; periode terbaru (jendela belum lewat) hanya "
        "dimonitor TANPA label (PSI, approval, distribusi skor). "
        "'Belum matang' bukan 0 — laporkan 'proporsi label matang' per "
        "periode. Periode yang belum matang TIDAK PERNAH menaikkan level "
        "alert berbasis label.",
        "109. Attribution drift BUKAN bukti kausal (M7.5/G5): mean |SHAP| "
        "PAY_MAX 0,4946 → 0,2500 [simulasi], UTILIZATION 0,1574 → 0,3100 "
        "[simulasi] — top-1 berganti adalah DIAGNOSIS ('selidiki'), "
        "bukan 'UTILIZATION kini menyebabkan default'. Perubahan alasan "
        "model bukan perubahan penyebab di dunia; attribution drift "
        "tidak pernah membuktikan kausalitas.",
        "110. Protokol pemilihan mitigasi: selection BUKAN evaluation "
        "(M7.4/G6): λ, target AIR, dan threshold per grup dipilih di "
        "VALIDATION, dilaporkan di TEST yang belum tersentuh (three-way "
        "split, M6.4 langkah 4). Angka mitigasi lesson ini (reweighing "
        "0,9567, threshold per grup 0,9999, lima titik Pareto) dihitung "
        "pada test 6.000 yang sama = HASIL ILUSTRASI PROTOKOL LESSON, "
        "bukan evaluasi final. Titik terbaik yang dipilih dari test yang "
        "sama itu optimistis (winner's curse, M6.5) — pilih di "
        "validation, laporkan di test.",
        "111. Counterfactual BUKAN klaim kausal (M7.3/G9): bedakan "
        "descriptive (SHAP: apa yang mendorong keputusan) dari "
        "counterfactual (what-if atas MODEL: perubahan input apa yang "
        "membalikkan keputusan) dari causal (klaim tentang DUNIA — butuh "
        "intervensi). Counterfactual 858 [notebook]: riwayat sempurna "
        "pun tetap ditolak (CF-A cal 0,3325; CF-B cal 0,1535). Aturan "
        "feasibility: fitur sensitif tidak diubah; fitur historis tidak "
        "diubah mundur; hanya perilaku masa depan yang disarankan. "
        "'Turunkan PAY_MAX-mu' = manipulasi fitur (PAY_MAX turunan dari "
        "riwayat), bukan saran.",
        "112. Governance / versioning + rollback (M7.4/G10): keputusan "
        "mitigasi wajib bisa direproduksi — sepuluh kolom (model version, "
        "feature schema version, calibration version, threshold policy "
        "version, data snapshot, code/notebook hash, approval date, "
        "owner, rollback version, alasan perubahan). Rollback v2 = "
        "threshold tunggal 0,10. Tanpa data snapshot dan code hash, paket "
        "tidak bisa direproduksi — sembilan dari sepuluh kolom bukan "
        "'hampir lengkap'.",
        "113. «Mentah» hanya untuk MODEL tak terkalibrasi (M7.4): GBM "
        "mentah ROC-AUC 0,7823 / PR-AUC 0,5597 vs GBM terkalibrasi "
        "(Platt/sigmoid) 0,7816 / 0,5558. Probabilitas keputusan adalah "
        "probabilitas MODEL (terkalibrasi) — jangan sebut «probabilitas "
        "mentah» untuk p terkalibrasi, karena «mentah» sudah berarti "
        "«GBM tak terkalibrasi» (0,7823). Bedakan «probabilitas model "
        "(terkalibrasi)» dari «skor keputusan disesuaikan (s = "
        "p/threshold_kelompok, ROC-AUC 0,7808)» — dan bila memakai kata "
        "«mentah» untuk skor, tulis eksplisit «sebelum penyesuaian "
        "ambang, bukan GBM tak terkalibrasi».",
        "114. Ranking invarian BUKAN approval invarian (M7.2): kalibrasi "
        "monoton (Platt) menjaga ranking dan ROC-AUC (0,7823 vs 0,7816) "
        "— tetapi approval pada threshold TETAP berubah karena nilai "
        "probabilitas bergeser: GBM mentah menyetujui 29,85% (n = 1.791) "
        "vs terkalibrasi 28,50% (n = 1.710), selisih 1,35 poin persen; "
        "AIR SEX 0,8390 vs 0,8694. Jangan pernah membuktikan «approval "
        "hampir tidak berubah» dengan angka ROC-AUC — buktikan dengan "
        "angka approval itu sendiri.",
        "115. Satu gejala statistik bisa menyangkal DUA asumsi sekaligus "
        "— hitung asumsi yang gugur dengan benar (M9.1, temuan gate "
        "run 1): autokorelasi squared return lag-1 0,1043 menyangkal "
        "iid (bila return iid, squared return pun tak berkorelasi) DAN "
        "volatilitas konstan — jadi dari tiga asumsi GBM (normal, iid, "
        "vol konstan), KETIGANYA gagal, bukan dua. Jangan menghitung "
        "«dua gagal» dari dua BUKTI bila satu bukti membunuh dua asumsi.",
        "116. Range 'ketiganya/semua estimator' WAJIB mencakup semua "
        "estimator yang baru saja didaftar (M9.1 M1/S2): bila satu "
        "estimator dikeluarkan dari range, sebut eksplisit — VaR gap ke "
        "MC joint M4 = 0,0050, ES gap = 0,0021; range tiga estimator "
        "utama [0,0286; 0,0329], bila M4 ikut [0,0286; 0,0336]. Jangan "
        "menulis range 'ketiganya' yang diam-diam mengeluarkan "
        "estimator keempat yang baru didaftar.",
        "117. 'iid' vs 'tidak berkorelasi (level)' WAJIB dibedakan "
        "(M9.1 M2): autokorelasi squared return lag-1 0,1043 "
        "menyangkal iid penuh — 'syarat pertama hampir terpenuhi' "
        "hanya benar untuk korelasi LEVEL, bukan iid penuh. Jangan "
        "mengklaim iid 'hampir terpenuhi' sementara bukti yang sama "
        "menyangkalnya.",
        "118. Dekomposisi aritmetika WAJIB menutup (M9.1 M3, M9.4 M1, "
        "M9.5 M1/S2): komponen harus dijumlahkan ke total — drift "
        "10-hari 10 × 0,000752 = 0,0075 dalam log (bukan 0,005); "
        "0,0043 × √10 = 0,0136 (bukan 0,0133); setengah lebar CI iid "
        "= 0,00465, bukan 0,0042; kenaikan sd +32% BUKAN pelebaran CI "
        "+26%. 'Sekitar X' tidak boleh menyembunyikan selisih ~50%.",
        "119. Sensitivitas vs porsi WAJIB dibedakan (M9.4 M1): untuk "
        "fungsi LINEAR, turunan konstan — VaR95 = −μ_d + 1,645·σ_d "
        "linear dalam μ, dVaR/dμ = −1, sensitivitas μ tetap 0,0005 di "
        "titik basis maupun di μ_d = −0,005 (relatif justru turun "
        "1,52% → 1,34%). Yang naik hanya PORSI suku μ (1,7% → 13,4%). "
        "Jangan mengklaim 'sensitivitas naik' dari naiknya porsi.",
        "120. 'Langkah yang sama besar' WAJIB dicek pp-nya (M9.4 S1): "
        "90→95 = 5 pp, 95→97,5 = 2,5 pp — bukan sama besar. Δz 0,363 "
        "vs 0,315; per pp 0,073 vs 0,126. Jangan menyamakan langkah pp "
        "yang berbeda.",
        "121. Perbandingan kemiringan visual WAJIB samakan KEDUA sumbu "
        "(M9.4 S2): menyamakan sumbu-y saja tidak cukup bila sumbu-x "
        "beda (LGD rentang 0,20 vs margin 0,02 pada lebar sama) — "
        "visual ≈1,5× (Δprofit rentang-penuh 5,19 jt vs 7,97 jt), "
        "bukan 15×; 15× hanya dari angka per 0,01, bukan dari mata.",
        "122. Konvensi ranking ('terbesar') WAJIB eksplisit |Δ| vs "
        "signed (M9.4 S3): tornado langkah 2 terurut |Δ| terbesar, "
        "Figure 1 + lab terurut Δ bertanda — tulis konvensinya di tiap "
        "tempat; jangan biarkan 'terbesar' tanpa kualifikasi bila dua "
        "tempat memakai konvensi berbeda.",
        "123. Koma desimal di hint/kode WAJIB titik (M9.3 N2): hint "
        "kode Python memakai 0.05, bukan 0,05 — '0, 05' di Python = "
        "dua argumen / syntax error. (Dikunci juga oleh "
        "qa_lab_hints.py — gate tidak mengekstrak hint, jadi kelas ini "
        "di sini hanya pengingat reviewer.)",
        "124. '250 hari' Basel = hari perdagangan, bukan kalender "
        "(M9.3 S2): VaR99 Basel dihitung atas 250 hari perdagangan "
        "terakhir. Jangan menulis '250 hari KALENDER' untuk jendela "
        "Basel.",
        "125. Figure label WAJIB dicek posisinya terhadap skala sumbu "
        "(M9.1 S4, M9.2 M1, M9.3 N1): label 'ES95 MC 0,0407' di x yang "
        "salah, garis σ* di x=185 padahal seharusnya x≈258, label "
        "'+6%' di y=43 padahal seharusnya y≈30 — ketiganya menyesatkan "
        "meski angkanya benar. (Keterbatasan: ekstraktor gate tidak "
        "membaca koordinat SVG — posisi label hanya bisa dicek "
        "manual/review; kelas ini mengunci klaim caption yang "
        "menyertainya.)",
        "126. Format 'mean ± sd bootstrap' WAJIB tidak dipakai sebagai "
        "pernyataan benar di step pembuka bila lesson melarangnya di "
        "step akhir (M9.5 S1): step 1 memakai '0,0284 ± 0,0022' "
        "sementara step 12 melarangnya — kontradiksi internal. Yang "
        "benar: pita CI [0,0229; 0,0322] di sekitar 0,0286. (Catatan: "
        "string '0,0284 ± 0,0022' tetap muncul SAH sebagai contoh yang "
        "dilarang di step 5/12 dan distraktor kuis — fixture string "
        "TIDAK bisa menguncinya; yang dikunci adalah pemakaiannya "
        "sebagai pernyataan benar.)",
        "127. Nilai p (Kupiec/Basel) yang dikutip WAJIB cocok dengan "
        "(n, x) yang dibicarakan — jangan tempel p dari varian lain "
        "(M9.3 fill: why kuis menempel p = 0,3079 pada '3 exceedance', "
        "padahal 0,3079 adalah p Kupiec VaR99 rolling untuk 4 "
        "exceedance dari 230 (LR = 1,0398); 3/230 memberi LR = 0,1964, "
        "p = 0,6577. Selalu sebut (n, x) di samping p. (Keterbatasan: "
        "ekstraktor gate tidak menghitung p — kelas ini bekerja lewat "
        "prompt reviewer; verifikasi akhir tetap hitung ulang manual.)",
        "",
        "Klaim-klaim:",
    ]
    for fname, claims in files_claims:
        lines.append(f"\n### {fname} ({len(claims)} klaim)")
        for cid, claim in claims:
            lines.append(f"[{cid}] {claim}")
    lines.append(
        "\nIngat: hanya verdict per klaim di atas. Jangan menambah temuan "
        "lain. Bila sebuah klaim memakai contoh angka, hitung ulang contohnya.")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="HEAD")
    ap.add_argument("--files", nargs="*")
    ap.add_argument("--model", default="deepseek-v4.1-flash")
    ap.add_argument("--max-tokens", type=int, default=8000)
    ap.add_argument("--out", default="")
    ap.add_argument("--keep-prompt", action="store_true")
    ap.add_argument("--changed-lines-only", action="store_true",
                    help="hanya klaim yang baris awal field-nya jatuh di hunk "
                         "git diff (untuk diff sweep besar; tanpa ini satu "
                         "file penuh diekstrak)")
    args = ap.parse_args()

    if args.files:
        paths = [REPO / f if not Path(f).is_absolute() else Path(f)
                 for f in args.files]
        paths = [p if p.exists() else CONTENT / Path(f).name
                 for p, f in zip(paths, args.files)]
    else:
        paths = changed_files(args.base)
    paths = [p for p in paths if p.suffix == ".ts" and p.exists()]
    if not paths:
        print("CONCEPT-GATE: PASS (tidak ada lesson yang berubah)")
        return 0

    files_claims = []
    total = 0
    ranges = changed_line_ranges(args.base) if args.changed_lines_only else {}
    for p in paths:
        claims = extract_claims(p)
        if args.changed_lines_only:
            rel = f"src/app/v2/content/{p.name}"
            lines = ranges.get(rel, set())
            claims = [c for c in claims
                      if int(c[0].split(":")[1]) in lines]
        files_claims.append((p.name, claims))
        total += len(claims)
    if total == 0:
        print("CONCEPT-GATE: PASS (tidak ada klaim konsep di lesson berubah)")
        return 0
    prompt = build_prompt(files_claims)
    print(f"CONCEPT-GATE: {len(paths)} file, {total} klaim -> 1 panggilan "
          f"{args.model}")

    with tempfile.TemporaryDirectory() as td:
        prompt_file = Path(td) / "concept_gate_prompt.txt"
        out_file = Path(td) / "concept_gate_out.txt"
        prompt_file.write_text(prompt, encoding="utf-8")
        if args.keep_prompt:
            keep = Path("/tmp/concept_gate_prompt.txt")
            keep.write_text(prompt, encoding="utf-8")
            print(f"CONCEPT-GATE: prompt disimpan di {keep}")
        cmd = [sys.executable, str(KELONTONG), "--model", args.model,
               "--prompt-file", str(prompt_file), "--stream",
               "--max-tokens", str(args.max_tokens), "--temperature", "0",
               "--out", str(out_file)]
        r = subprocess.run(cmd)
        if r.returncode != 0 or not out_file.exists():
            print("CONCEPT-GATE: FAIL — panggilan model gagal "
                  "(deploy DITOLAK sampai gerbang bisa berjalan)")
            return 1
        verdict = out_file.read_text(encoding="utf-8")
        if not verdict.strip():
            print("CONCEPT-GATE: FAIL — verdict model KOSONG "
                  "(deploy DITOLAK sampai gerbang bisa berjalan)")
            return 1
        if args.out:
            Path(args.out).write_text(verdict, encoding="utf-8")
        print("----- verdict model -----")
        print(verdict)
        print("-------------------------")
        bad = re.findall(
            r"\[([^\]]+)\]\s*(?:VERDICT:\s*)?KONTRADIKSI\b", verdict)
        ragu = re.findall(
            r"\[([^\]]+)\]\s*(?:VERDICT:\s*)?RAGU\b", verdict)
        if bad:
            print(f"CONCEPT-GATE: FAIL — {len(bad)} KONTRADIKSI: {bad}")
            print("Deploy DITOLAK.")
            return 1
        if ragu:
            print(f"CONCEPT-GATE: RAGU pada {len(ragu)} klaim: {ragu} "
                  f"(bukan penolakan — triase manusia sebelum deploy)")
        print("CONCEPT-GATE: PASS (tidak ada kontradiksi)")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
