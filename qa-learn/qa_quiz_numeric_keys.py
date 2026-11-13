#!/usr/bin/env python3
"""QA Learn — guard kunci kuis numerik: jawaban benar kuis yang berupa angka
WAJIB cocok dengan hitung ulang independen.

Latar: ronde 7 menemukan kunci kuis numerik yang salah di lesson (mis.
Vasicek SD, rasio FNR) — angka yang salah di kunci kuis membuat learner
yang menghitung dengan BENAR justru dinyatakan salah. Guard ini mengambil
tiap kunci numerik dari TABEL di bawah, menghitung ulang nilainya dari
parameter pertama (bukan dari teks lesson — rumus di qa_r7_recompute.py
atau aritmetika inline dengan derivasi di komentar), lalu menegaskan
opsi yang ditandai `correct: true` pada pertanyaan itu memuat angka hasil
hitung ulang tersebut.

Hanya kuis yang kuncinya MEMANG membawa angka hasil koreksi R7 yang
masuk tabel — angka yang hanya ada di prosa/lab sudah dikunci
qa_learn_numbers.py. Setiap entri di tabel ini diverifikasi ke file
sumber sebelum ditambahkan.

Jalankan: python3 qa_quiz_numeric_keys.py
Keluar 0 = lolos; 1 = ada kunci kuis yang tidak cocok dengan hitung ulang.
"""
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from qa_r7_recompute import vasicek_q, vasicek_sd  # noqa: E402

CONTENT = Path(__file__).resolve().parent.parent / "src" / "app" / "v2" / "content"

TEXT_RE = re.compile(r'text:\s*"((?:[^"\\]|\\.)*)"', re.S)
Q_RE = re.compile(r'q:\s*"((?:[^"\\]|\\.)*)"', re.S)


def _unescape(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return s.replace('\\"', '"').replace("\\\\", "\\").replace("\\n", "\n")


def decode_file(path: Path) -> str:
    """Teks lesson dengan escape \\uXXXX diubah ke karakter asli (untuk cari)."""
    return re.sub(r"\\u([0-9a-fA-F]{4})",
                  lambda m: chr(int(m.group(1), 16)),
                  path.read_text(encoding="utf-8"))


def correct_option(text: str, q_sub: str) -> str:
    """Teks opsi `correct: true` pada pertanyaan yang memuat q_sub."""
    qi = text.find(q_sub)
    if qi < 0:
        raise AssertionError(f"pertanyaan tidak ditemukan: {q_sub!r}")
    ci = text.find("correct: true", qi)
    if ci < 0:
        raise AssertionError(f"tidak ada opsi correct setelah pertanyaan: {q_sub!r}")
    texts = list(TEXT_RE.finditer(text, qi, ci))
    if not texts:
        raise AssertionError(f"tidak ada opsi sebelum correct: {q_sub!r}")
    return _unescape(texts[-1].group(1))


def question_text(text: str, q_sub: str) -> str:
    """Teks pertanyaan (field `q:`) yang memuat q_sub."""
    for m in Q_RE.finditer(text):
        if q_sub in _unescape(m.group(1)):
            return _unescape(m.group(1))
    raise AssertionError(f"pertanyaan tidak ditemukan: {q_sub!r}")


def fmt_id(value: float, decimals: int) -> str:
    return f"{value:.{decimals}f}".replace(".", ",")


def _wilson(k: int, n: int, z: float = 1.959964) -> tuple[float, float]:
    """Interval Wilson 95% untuk k sukses dari n percobaan."""
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return c - h, c + h


def _lr_ind(n00: int, n01: int, n10: int, n11: int) -> float:
    """LR independensi Christoffersen dari transition counts."""
    n = n00 + n01 + n10 + n11
    pi = (n01 + n11) / n
    pi01 = n01 / (n00 + n01)
    pi11 = n11 / (n10 + n11)
    l0 = (n00 + n01) * math.log(1 - pi) + (n01 + n11) * math.log(pi)
    l1 = (n00 * math.log(1 - pi01) + n01 * math.log(pi01)
          + n10 * math.log(1 - pi11) + n11 * math.log(pi11))
    return -2 * (l0 - l1)


def _kupiec_lr(x: int, n: int, p: float) -> float:
    """LR Kupiec dari x pelanggaran dalam n hari, peluang p."""
    ph = x / n
    return -2 * ((n - x) * math.log(1 - p) + x * math.log(p)
                 - ((n - x) * math.log(1 - ph) + x * math.log(ph)))


def _kupiec_p(x: int, n: int, p: float) -> float:
    """p-value Kupiec (chi2 df=1) dari LR-nya."""
    return math.erfc(math.sqrt(_kupiec_lr(x, n, p) / 2))


def _bs_call(s: float, k: float = 7619.38, t: float = 0.25,
             r: float = 0.05, sig: float = 0.2243) -> float:
    """Harga call Black-Scholes (parameter kanonis M4.4)."""
    d1 = (math.log(s / k) + (r + sig * sig / 2) * t) / (sig * math.sqrt(t))
    d2 = d1 - sig * math.sqrt(t)
    n = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))
    return s * n(d1) - k * math.exp(-r * t) * n(d2)


def _bs_delta_gamma(s: float = 7619.38, sig: float = 0.2243,
                    t: float = 0.25, r: float = 0.05) -> tuple[float, float]:
    """(suku delta, suku gamma) untuk ΔS = 0,01 × S (kanonis M4.4)."""
    d1 = ((r + sig * sig / 2) * t) / (sig * math.sqrt(t))
    delta = 0.5 * (1 + math.erf(d1 / math.sqrt(2)))
    gamma = (math.exp(-d1 * d1 / 2) / math.sqrt(2 * math.pi)
             / (s * sig * math.sqrt(t)))
    ds = 0.01 * s
    return delta * ds, 0.5 * gamma * ds * ds


_D, _G = _bs_delta_gamma()


# (file, pertanyaan, [(nama, nilai_hitung_ulang, desimal, akhiran), ...])
# Untuk tiap entri: fmt_id(nilai, desimal) + akhiran WAJIB muncul di opsi benar.
_KV_BYTES = 2 * 40 * 40 * 128 * 16 * 1024 * 2  # rumus dari opsi lesson itu sendiri
CHECKS = [
    ("b13-vasicek.ts",
     "n=500, PD=2%, ρ=0,15. SD jumlah gagal",
     [("SD Vasicek", vasicek_sd(500, 0.02, 0.15)[0], 2, ""),
      ("SD binomial", vasicek_sd(500, 0.02, 0.15)[1], 2, "")]),
    ("mle12-fairness.ts",
     "recall 85% vs 40%",
     [("FNR 60%/15%", 60 / 15, 0, "x")]),
    ("llmops13-inference-selfhosted.ts",
     "Model 13B, batch 16, seq 1024",
     [("KV-cache GiB", _KV_BYTES / 1024 ** 3, 1, " GiB"),
      ("KV-cache GB", _KV_BYTES / 1e9, 2, "")]),
    ("aai11-debugging.ts",
     "muncul di langkah 4, 5, 7, 10 dari 12 langkah",
     [("R = 4/12", 4 / 12, 2, "")]),
    ("aai13-mcp.ts",
     "6 tool dan 4 framework",
     [("tanpa MCP 6x4", 6 * 4, 0, ""),
      ("dengan MCP 6+4", 6 + 4, 0, "")]),
    # --- Build gap ronde 7 Terra (2026-11-09, 23 langkah gap-r7-*) ---
    # Kunci kuis numerik langkah gap; hitung ulang di qa_r7_recompute.py.
    ("cr15-risiko-portofolio.ts",
     "Berapa PD marginal tahun ke-2?",
     [("PD marginal tahun 2", 0.98 * 0.03 * 100, 2, "%")]),
    ("mr4-var-lanjut.ts",
     "Potong Rp10 jt dari mana untuk hemat VaR terbesar?",
     [("component VaR", 0.6 * (2.33 * 100 * (0.6 * 0.2 ** 2 + 0.4 * 0.3 * 0.2 * 0.3)
                               / math.sqrt(0.6 ** 2 * 0.2 ** 2 + 0.4 ** 2 * 0.3 ** 2
                                           + 2 * 0.6 * 0.4 * 0.3 * 0.2 * 0.3)), 2, "")]),
    ("aie13-hybrid-search-reranking.ts",
     "Berapa kira-kira perbandingan kontribusi 'deposito' keduanya?",
     [("kontribusi deposito d1 (tf=2)",
        math.log(1.6) * (2 * 2.2) / (2 + 1.2 * (1 - 0.75 + 0.75 * 3 / (10 / 3))), 2, ""),
      ("kontribusi deposito d0 (tf=1)",
        math.log(1.6) * (1 * 2.2) / (1 + 1.2 * (1 - 0.75 + 0.75 * 3 / (10 / 3))), 2, "")]),
    ("wqb13-self-correlation.ts",
     "Korelasi 0,94 (n = 252), CI 95%",
     [("CI bawah Fisher", math.tanh(math.atanh(0.94) - 1.96 / math.sqrt(252 - 3)), 2, "")]),
    # --- Track Machine Learning Finance, M1 (2026-11-12) ---
    # Kunci kuis numerik MLF1-MLF4; hitung ulang inline dari parameter lesson.
    ("mlf1-tiga-tipe-satu-alur.ts",
     "Berapa base rate default di sampel ini?",
     [("base rate 5/12", 5 / 12, 4, "")]),
    ("mlf2-membaca-angka.ts",
     "Berapa PPV-nya?",
     [("PPV prev 1%", 0.99 * 0.01 / (0.99 * 0.01 + 0.01 * 0.99), 4, "")]),
    ("mlf3-evaluasi-model.ts",
     "Berapa akurasinya?",
     [("akurasi mayoritas 4673/6000", 4673 / 6000, 4, "")]),
    ("mlf3-evaluasi-model.ts",
     "GBM PR-AUC 0,5597 dengan base rate 0,2212",
     [("rasio PR-AUC/base rate", 0.5597 / 0.2212, 2, "")]),
    ("mlf4-overfitting-underfitting.ts",
     "Bagaimana diagnosisnya?",
     [("gap GBM", 0.8469 - 0.7823, 4, "")]),
    ("mlf4-overfitting-underfitting.ts",
     "Berapa penghematannya?",
     [("hemat ridge", (0.0531 - 0.0425) / 0.0531 * 100, 1, " persen")]),
    # --- Track Machine Learning Finance, M2 (2026-11-12) ---
    # Kunci kuis numerik M2.1-M2.5; hitung ulang inline dari parameter lesson.
    # Nilai di WHY-TEXT opsi benar (bukan teks opsi) — diverifikasi dari
    # notebook M2 yang sudah dieksekusi (25 check lolos).
    ("mlf-m21-supervised-logistic-regression.ts",
     "Koefisien PAY_DELAY_COUNT pada LR (standardisasi) adalah 0,756",
     [("OR PAY_DELAY_COUNT", math.exp(0.756), 2, "")]),
    ("mlf-m22-scorecard-woe-iv.ts",
     "Pelamar A (PAY_0 = 0, LIMIT 200–300 ribu, AGE 26–35) mendapat skor berapa?",
     [("skor A", 500 + 13 + 8 + 3, 0, "")]),
    ("mlf-m23-pd-lgd-ead-expected-loss.ts",
     "Confusion matrix threshold 0,10: TP 1.213, FN 114",
     [("recall 0,10", 1213 / (1213 + 114), 4, "")]),
    ("mlf-m25-reject-inference.ts",
     "Model-A: mean PD pada yang ditolak 0,2337, aktual 0,4759",
     [("gap model-A", 0.4759 - 0.2337, 4, "")]),
    # --- Track Machine Learning Finance, M3 (2026-11-12) ---
    # Kunci kuis numerik M3.1-M3.5; hitung ulang inline dari parameter lesson.
    ("mlf-m31-unsupervised-clustering-anomaly.ts",
     "Dari 6.636 nasabah default, 655 berada di kelompok flagged. Berapa persen default yang tertangkap?",
     [("share default tertangkap", 655 / 6636 * 100, 2, " persen")]),
    ("mlf-m32-network-link-analysis.ts",
     "Berapa lift ROC-AUC dari penambahan graph features — dan pada test set apa?",
     [("lift ROC-AUC graph", 0.8204 - 0.6387, 4, "")]),
    ("mlf-m33-velocity-benford.ts",
     "Berapa ekspektasi Benford untuk digit 2?",
     [("P Benford digit 2", math.log10(1.5), 4, "")]),
    ("mlf-m34-behavioral-peer-group.ts",
     "Nasabah UTIL 1,365; peer band-nya mean 0,555, sd 0,405. Berapa z-score-nya",
     [("z-score 1,365", (1.365 - 0.555) / 0.405, 2, "")]),
    ("mlf-m35-alert-triage-economics.ts",
     "Pada threshold 0,10, FPR laki-laki 0,6888 vs perempuan 0,5985. Apa artinya?",
     [("FPR laki-laki persen", 1268 / 1841 * 100, 2, "%")]),
    # --- Fill gap Luna M3 (2026-11-12) ---
    # Kunci kuis BARU dari fill; hitung ulang inline dari parameter lesson.
    # M3.2 tidak masuk: kedua kuis barunya tidak mengandung angka yang
    # inline-recomputable dengan format guard (community ID / cutoff).
    ("mlf-m31-unsupervised-clustering-anomaly.ts",
     "Pseudo-labeling dengan ambang ≥0,95/≤0,05 menambah 212 pseudo-label",
     [("recall pseudo-labeling", 41 / 166, 4, "")]),
    ("mlf-m31-unsupervised-clustering-anomaly.ts",
     "Label propagation pada graf akun-device mencapai precision 0,1143",
     [("precision label propagation", 4 / 35, 4, "")]),
    ("mlf-m33-velocity-benford.ts",
     "Akun F: 12 transaksi dalam 44 menit (10:01–10:45)",
     [("max1h akun F", 12, 0, "")]),
    ("mlf-m33-velocity-benford.ts",
     "100 merchant diuji Benford satu per satu pada α = 0,05",
     [("ambang BH rank 2", 2 / 100 * 0.05, 4, "")]),
    ("mlf-m35-alert-triage-economics.ts",
     "model full (semua fitur M3) mencapai PR-AUC P1 0,8397",
     [("P@100 capstone", 25 / 100, 2, "")]),
    ("mlf-m35-alert-triage-economics.ts",
     "presisi lokal jatuh di bawah impas (0,0808) pertama kali di k = 2.845",
     [("impas review 5000", 5000 / 61910.67, 5, "")]),
    ("mlf-m35-alert-triage-economics.ts",
     "precision default 0,60 (EV NT$18.473.201) vs precision confirmed fraud 0,12",
     [("precision default", 300 / 500, 2, ""),
      ("precision confirmed fraud", 60 / 500, 2, "")]),
    # --- Fill gap Luna M2 (2026-11-12) ---
    # Kunci kuis BARU dari fill; hitung ulang inline dari parameter lesson.
    # M2.5 (a) tidak masuk: "3.135" memakai pemisah ribuan yang tidak
    # bisa dihasilkan fmt_id — angka itu dikunci qa_learn_numbers.py.
    ("mlf-m21-supervised-logistic-regression.ts",
     "GBM train ROC-AUC 0,8469, test 0,7823 — gap 0,0646. Apa diagnosis",
     [("gap GBM", 0.8469 - 0.7823, 4, "")]),
    ("mlf-m21-supervised-logistic-regression.ts",
     "P1 PD 0,1741. Apa keputusan pada threshold 0,50 versus threshold 0,10?",
     [("PD P1", 0.1741, 4, "")]),
    ("mlf-m22-scorecard-woe-iv.ts",
     "Kontribusi IV bin PAY_0 = 2 adalah 0,5012",
     [("share IV bin 2", 0.5012 / 0.8761 * 100, 1, " persen")]),
    ("mlf-m23-pd-lgd-ead-expected-loss.ts",
     "Confusion matrix threshold 0,10: TP 1.213, FP 3.077, TN 1.596, FN 114",
     [("precision", 1213 / 4290, 4, ""),
      ("specificity", 1596 / 4673, 4, "")]),
    ("mlf-m23-pd-lgd-ead-expected-loss.ts",
     "Threshold 0,10 memberi akurasi 0,4682",
     [("akurasi 0,10", (1213 + 1596) / 6000, 4, "")]),
    ("mlf-m24-vintage-rollrate-ifrs9.ts",
     "Dari bucket 2, berapa peluang nasabah MEMBURUK ke bucket 3 atau 4+ bulan depan?",
     [("peluang memburuk bucket 2", 0.0633 + 0.0000, 4, "")]),
    ("mlf-m24-vintage-rollrate-ifrs9.ts",
     "Kohort 4+ default 0,7132 (n = 129) vs kohort current",
     [("lebar Wilson 4+", 0.7842 - 0.6299, 4, "")]),
    ("mlf-m25-reject-inference.ts",
     "P(approve) = 0,05 pada satu nasabah",
     [("bobot hipotetis", 1 / 0.05, 0, "")]),
    # --- Track Machine Learning Finance, M4 (2026-11-12) ---
    # Kunci kuis numerik M4.1-M4.5; hitung ulang inline dari parameter lesson.
    # M4.2 Q7 (akar-10) TIDAK masuk CHECKS sebelum fix: "0,0286 × √10"
    # memberi 0,0904, bukan 0,0903 kanonis — derivasi yang benar memakai
    # VaR 1-hari tak-dibulatkan 0,028563 (lihat QUESTION_CHECKS).
    ("mlf-m41-random-forest-ensembles.ts",
     "Walk-forward 8 folds: RF 0,5250, LR 0,5688",
     [("selisih LR-naive pp", (0.5688 - 0.5625) * 100, 1, "pp")]),
    ("mlf-m42-var-expected-shortfall.ts",
     "VaR95 historis portofolio adalah 0,0286",
     [("VaR95 persen", 0.0286 * 100, 2, "%"),
      ("pelanggaran ekspektasi", 0.05 * 480, 0, "")]),
    ("mlf-m42-var-expected-shortfall.ts",
     "ES99 historis 0,0775 vs ES99 parametrik",
     [("ES99 historis vs normal persen",
       (0.0775 - 0.0528) / 0.0528 * 100, 0, "%")]),
    ("mlf-m42-var-expected-shortfall.ts",
     "portofolio equal-weight 0,0286. Apa yang ditunjukkan",
     [("korelasi min", 0.2850, 3, ""),
      ("korelasi max", 0.3610, 3, "")]),
    ("mlf-m43-var-backtesting-volatility.ts",
     "kondisional-EWMA 0,0601 vs parametrik tak-kondisional 0,0372",
     [("selisih VaR kondisional", 0.0601 - 0.0372, 4, "")]),
    ("mlf-m43-var-backtesting-volatility.ts",
     "Berapa half-life guncangan volatilitas",
     [("half-life", math.log(0.5) / math.log(0.8602), 1, " hari")]),
    ("mlf-m43-var-backtesting-volatility.ts",
     "Bagaimana hubungan EWMA",
     [("alpha EWMA", 1 - 0.94, 2, "")]),
    ("mlf-m44-greeks-risk-decomposition.ts",
     "Berapa saham yang harus di-short",
     [("hedge saham", 0.5665 * 100, 0, "")]),
    ("mlf-m44-greeks-risk-decomposition.ts",
     # q_sub diperbarui fill gap M4: pertanyaan kuis lama menulis
     # "call naik $43,17" sebagai perubahan sebenarnya — dikoreksi ke
     # $44,49 (repricing); 43,17 kini berlabel "perkiraan delta".
     "S naik 1 persen: call naik $44,49 dan delta menjadi 0,6011",
     [("delta naik gamma", 0.000460 * 76.19, 4, "")]),
    ("mlf-m44-greeks-risk-decomposition.ts",
     "Component VaR: BBCA 0,0082",
     [("jumlah component VaR", 0.0082 + 0.0109 + 0.0133, 4, "")]),
    ("mlf-m44-greeks-risk-decomposition.ts",
     "Direksi minta VaR portofolio dipotong 0,00324",
     [("jual UNVR juta", 0.00324 / 0.0398 * 100, 2, "")]),
    ("mlf-m45-drawdown-regime-stress.ts",
     "maximum drawdown −0,4363",
     [("pemulihan maxDD persen", (1 / (1 - 0.4363) - 1) * 100, 2, "%")]),
    # --- Fill gap Luna M4 (2026-11-12) ---
    # Kunci kuis numerik BARU dari fill; hitung ulang inline.
    # M4.2: loss L = -P&L (return -0,02 x Rp100 jt).
    ("mlf-m42-var-expected-shortfall.ts",
     "Portofolio Rp100 juta, return portofolio hari ini −0,02",
     [("loss L", 0.02, 2, "")]),
    # M4.3: pi01 = 11/214, pi11 = 4/15 (Christoffersen VaR95 OOS).
    ("mlf-m43-var-backtesting-volatility.ts",
     "Deret exceedance VaR95 OOS: π01 = 0,0514, π11 = 0,2667",
     [("pi01 persen", 11 / 214 * 100, 2, " persen"),
      ("pi11 persen", 4 / 15 * 100, 2, " persen")]),
    # M4.3: p-value Kupiec EWMA VaR95 (12/230, p=0,05).
    ("mlf-m43-var-backtesting-volatility.ts",
     "Backtest OOS 230 hari, VaR95: historis 15 pelanggaran",
     [("Kupiec p EWMA VaR95", _kupiec_p(12, 230, 0.05), 4, "")]),
    # M4.4: atribusi S+1% — delta+gamma tak-bulat 44,50, suku gamma 1,34.
    ("mlf-m44-greeks-risk-decomposition.ts",
     "S naik 1 persen: call sebenarnya naik $44,49",
     [("delta+gamma tak-bulat", _D + _G, 2, ""),
      ("suku gamma", _G, 2, "")]),
    # --- Build M5 (2026-11-12); hitung ulang inline dari parameter lesson ---
    # M5.1 Q1: GD f=x^2+y^2 dari (2,1), eta 0,25: gradien (4,2).
    ("mlf-m51-gradient-descent-optimization.ts",
     "Fungsi [ilustrasi] f(x, y) = x² + y², start (2, 1)",
     [("x baru", 2 - 0.25 * (2 * 2), 1, ""),
      ("y baru", 1 - 0.25 * (2 * 1), 1, "")]),
    # M5.1 Q2: faktor y per langkah |1-20*eta|, eta 0,12 -> 1,4.
    ("mlf-m51-gradient-descent-optimization.ts",
     "f meledak ke 133.869,2748 setelah 10 langkah. Mengapa?",
     [("faktor y", abs(1 - 20 * 0.12), 1, "")]),
    # M5.1 Q3: eta 0,05 memberi f terkecil setelah 10 langkah.
    ("mlf-m51-gradient-descent-optimization.ts",
     "Setelah 10 langkah GD pada mangkuk kuadratik",
     [("f eta 0,05", 1.9452, 4, "")]),
    # M5.2 Q1: GMV 2 aset: w1 = (0,09-0,01)/(0,04+0,09-2*0,01).
    ("mlf-m52-constrained-optimization-lagrange.ts",
     "Dua aset [ilustrasi]: varians 0,04 dan 0,09",
     [("w1 GMV", (0.09 - 0.01) / (0.04 + 0.09 - 2 * 0.01), 4, ""),
      ("w2 GMV", 1 - (0.09 - 0.01) / (0.04 + 0.09 - 2 * 0.01), 4, "")]),
    # M5.2 Q2: lambda 0,1913 x 0,01 = penurunan varians 0,0019.
    ("mlf-m52-constrained-optimization-lagrange.ts",
     "Untuk GMV 2 aset (BBCA + KLBF), λ = 0,1913",
     [("penurunan varians", 0.1913 * 0.01, 4, "")]),
    # M5.2 Q4: selisih maks closed-form vs SLSQP = 0,0008.
    ("mlf-m52-constrained-optimization-lagrange.ts",
     "vs SLSQP [0,5523; 0,2699; 0,1777]. Apa kesimpulannya?",
     [("selisih maks",
       max(abs(0.5523 - 0.5518), abs(0.2699 - 0.2698),
           abs(0.1777 - 0.1785)), 4, "")]),
    # M5.2 Q7: excess UNVR = 0,0796-0,05 = 0,0296 (satu-satunya positif).
    ("mlf-m52-constrained-optimization-lagrange.ts",
     "Max-Sharpe long-only adalah [0; 0; 1]",
     [("excess UNVR", 0.0796 - 0.05, 4, "")]),
    # --- Fill gap Luna M5.2 (2026-11-13) ---
    # M5.2 Q9 (G4): eigenvalue terkecil Σ = 0,088937 -> 0,0889 (4 desimal).
    ("mlf-m52-constrained-optimization-lagrange.ts",
     "Eigenvalue Σ tahunan adalah",
     [("eigenvalue terkecil", 0.088937, 4, "")]),
    # M5.2 Q10 (G10): kardinalitas vol = GMV bebas + 127bp; min holding
    # vol = GMV bebas (tidak mengikat).
    ("mlf-m52-constrained-optimization-lagrange.ts",
     "Empat kendala diterapkan pada GMV bebas",
     [("vol kardinalitas", 0.2966 + 0.0127, 4, ""),
      ("vol min holding", 0.2966, 4, "")]),
    # M5.3 Q3: vol ekstra EW vs frontier = 0,3114-0,3056.
    ("mlf-m53-markowitz-efficient-frontier.ts",
     "Equal-weight punya return −0,1406 dan vol 0,3114",
     [("vol ekstra EW", 0.3114 - 0.3056, 4, "")]),
    # M5.3 Q5: CML 50/50 mempertahankan Sharpe tangency 0,0590.
    ("mlf-m53-markowitz-efficient-frontier.ts",
     "Campuran 50% aset bebas risiko",
     [("Sharpe CML", 0.0590, 4, "")]),
    # --- Fill gap Luna M5.3 (2026-11-13); hitung ulang inline ---
    # Q9: biaya EW->MS = (1,3333/2) x 20bp [ilustrasi].
    ("mlf-m53-markowitz-efficient-frontier.ts",
     "pindah ke max-Sharpe biayanya 13,33bp",
     [("biaya EW->MS bp", 1.3333 / 2 * 20, 2, "")]),
    # Q10: biaya tahunan ambang 2pp = 18,76 x 252/480.
    ("mlf-m53-markowitz-efficient-frontier.ts",
     "ambang drift 2pp memicu 39 rebalance",
     [("biaya tahunan ambang 2pp", 18.76 / 480 * 252, 2, "")]),
    # Q11: sisa kas GMV = 550.000/100.000.000.
    # (q_sub harus unik di file: frasa "sisa kas Rp550.000 (0,55%)" juga
    # ada di prosa Rangkuman sebelum kuis, sehingga find() mendarat di
    # sana — pakai ekor pertanyaan yang hanya ada di kuis.)
    ("mlf-m53-markowitz-efficient-frontier.ts",
     "jauh lebih besar dari sisa kas tanpa lot",
     [("sisa kas GMV persen", 550000 / 100000000 * 100, 2, "%")]),
    # Q12: selisih DD min-semivarians vs GMV = 0,2345-0,2343.
    ("mlf-m53-markowitz-efficient-frontier.ts",
     "downside deviation 0,2343, GMV 0,2345",
     [("selisih DD", 0.2345 - 0.2343, 4, "")]),
    # Q13: GMV BBCA tetap 0,5523 setelah semua vol x1,1.
    ("mlf-m53-markowitz-efficient-frontier.ts",
     "Mengalikan SEMUA vol dengan 1,1",
     [("GMV BBCA skala seragam", 0.5523, 4, "")]),
    # M5.4 Q1: RC share risk parity = 1/3 tiap aset.
    ("mlf-m54-risk-parity-budgeting.ts",
     "Portofolio risk parity dari data pin punya RC shares berapa?",
     [("RC share RP", 1 / 3, 4, "")]),
    # M5.4 Q3: RC UNVR EW = 0,4137 -> 41,37%.
    ("mlf-m54-risk-parity-budgeting.ts",
     "Equal-weight: bobot [1/3; 1/3; 1/3]",
     [("RC UNVR EW persen", 0.4137 * 100, 2, "%")]),
    # M5.4 Q4: RC BBCA GMV = 0,5526 -> 55,26%.
    ("mlf-m54-risk-parity-budgeting.ts",
     "GMV punya vol TERENDAH",
     [("RC BBCA GMV persen", 0.5526 * 100, 2, "%")]),
    # M5.4 Q7: bobot BBCA risk budgeting [ilustrasi] = 0,5157.
    ("mlf-m54-risk-parity-budgeting.ts",
     "menghasilkan bobot [0,5157; 0,2910; 0,1932]. Apa pelajarannya?",
     [("bobot BBCA RB", 0.5157, 4, "")]),
    # M5.5 Q2: t UNVR periode 1 = 0,4831/0,5807 = 0,83.
    ("mlf-m55-black-litterman-shrinkage.ts",
     "UNVR periode 1: mean tahunan +0,4831, SE 0,5807, t-statistik 0,83",
     [("t UNVR", 0.4831 / 0.5807, 2, "")]),
    # M5.5 Q3: vol OOS GMV-LW = 0,3296 (vs GMV 0,3372).
    ("mlf-m55-black-litterman-shrinkage.ts",
     "return OOS −0,3703 vs −0,3697. Apa yang benar tentang shrinkage di sini?",
     [("vol LW OOS", 0.3296, 4, "")]),
    # M5.5 Q5: posterior BBCA = 0,196 (dari Pi 0,1817 + view).
    ("mlf-m55-black-litterman-shrinkage.ts",
     "Black-Litterman: Pi = [0,1817; 0,2447; 0,3009]",
     [("posterior BBCA", 0.196, 3, "")]),
    # M5.5 Q6: Sharpe BL pada statistik posterior = 0,7671.
    ("mlf-m55-black-litterman-shrinkage.ts",
     "Portofolio BL yang sama: Sharpe 0,7671",
     [("Sharpe BL posterior", 0.7671, 4, "")]),
    # M5.5 Q9 (gap fill G6): tau 0,01 vs 0,20 -> M BBCA tetap 0,196.
    ("mlf-m55-black-litterman-shrinkage.ts",
     "tau 0,01 vs 0,20 memberi posterior M",
     [("M BBCA tau 0,01 vs 0,20", 0.196, 3, "")]),
    # M5.5 Q10 (gap fill G3): robust GMV lantai -0,35 -> w BBCA 0,3147.
    ("mlf-m55-black-litterman-shrinkage.ts",
     "Kenapa GMV kalah dari EW pada worst-case?",
     [("w BBCA robust GMV lantai -0,35", 0.3147, 4, "")]),
    # M5.5 Q11 (gap fill G7): total GMV walk-forward = -0,3272.
    ("mlf-m55-black-litterman-shrinkage.ts",
     "Kenapa walk-forward lebih dipercaya",
     [("total GMV walk-forward", 0.3272, 4, "")]),
    # M7.4 Q (fill gap Luna G10, 2026-11-13): AIR v2 threshold per
    # grup 0,9999 (kunci m74_pareto di m7_canonical.json).
    ("mlf-m74-fairness-mitigation.ts",
     "tapi TIDAK berisi data snapshot dan code/notebook hash",
     [("AIR v2", 0.9999, 4, "")]),
]

# (file, pertanyaan, [(nama, nilai, desimal, akhiran)]) — angka yang hidup
# di WHY-TEXT opsi benar (bukan di teks opsinya). R8: b17 why-text sempat
# menulis "tambah gagal ke b" (salah arah: gagal masuk parameter PERTAMA)
# dan b14 why-text mengunci "puncak = arus masuk = arus keluar" untuk
# kurva yang nyatanya naik monoton menuju stasioner.
WHY_CHECKS = [
    ("b17-bayesian-praktis.ts",
     "Posterior Beta setelah prior Beta(50,950)",
     [("mean posterior 53/1010", 53 / 1010 * 100, 2, "%")]),
    ("b14-markov-chain.ts",
     "jumlah Macet naik terus lalu mendatar",
     # 5000 × π_macet; π dari iterasi P 60× (lihat qa_r8_recompute.py) = 255,81
     [("Macet stasioner", 255.81395348837225, 1, "")]),
    # R8 gaps: model 2% (salah 2x) lolos Kupiec x<=4 dari 250 hari = 43,9%.
    ("mr6-backtesting.ts",
     "Uji Kupiec 250 hari: LR = 0,77",
     [("lolos model 2%",
       sum(math.comb(250, i) * 0.02 ** i * 0.98 ** (250 - i)
           for i in range(5)) * 100, 1, "%")]),
    # --- Track Machine Learning Finance, L0 (2026-11-12) ---
    # Kunci kuis numerik L0 di WHY-TEXT opsi benar; hitung ulang inline.
    # q_sub dipilih yang HANYA muncul di pertanyaan kuis (bukan di prosa).
    ("mlf-l01-data-cleaning.ts",
     "Apa keputusan notebook?",
     [("EDU tak dikenal", 345 / 30000 * 100, 2, " persen")]),
    ("mlf-l02-missing-data-imputasi.ts",
     "varians populasi menyusut berapa",
     [("penyusutan varians", (7.0997 - 5.6798) / 7.0997 * 100, 1, " persen")]),
    ("mlf-l03-distribusi-outlier.ts",
     "Bentuk distribusinya?",
     [("skew tagihan", 2.386, 3, "")]),
    ("mlf-l04-data-wrangling.ts",
     "diubah ke long. Berapa baris hasilnya",
     [("baris long", 3 * 6, 0, "")]),
    ("mlf-l05-ab-testing.ts",
     "p sama dengan 0,0992, alpha 0,05",
     [("p-value", 1 - math.erf(1.6489 / math.sqrt(2)), 4, "")]),
    # --- Fill gap Luna L0 (2026-11-12) ---
    # Kunci kuis BARU dari fill: dihitung ulang inline dari parameter lesson.
    ("mlf-l01-data-cleaning.ts",
     "49 baris (4,9 persen)",
     [("beda baris", 52 - 49, 0, " baris")]),
    ("mlf-l03-distribusi-outlier.ts",
     "terbukti transaksi korporat yang sah",
     [("pagar atas", 285.0, 1, "")]),
    ("mlf-l03-distribusi-outlier.ts",
     "Tiga alat memberi tiga bacaan",
     [("skewness", 0.7, 1, ""), ("QQ", 0.97, 2, "")]),
    ("mlf-l04-data-wrangling.ts",
     "di-join dengan riwayat pembayaran H",
     [("baris join", 8, 0, " baris")]),
    ("mlf-l05-ab-testing.ts",
     "Alpha Bonferroni per uji 0,01",
     [("alpha Bonferroni", 0.05 / 5, 2, "")]),
    # --- Track Machine Learning Finance, M2 (2026-11-12) ---
    # Kunci kuis numerik M2 di WHY-TEXT opsi benar; hitung ulang inline.
    ("mlf-m23-pd-lgd-ead-expected-loss.ts",
     "Desil 10 reliability diagram: PD 0,6967, aktual 0,7000",
     [("selisih desil 10", 0.7000 - 0.6967, 4, "")]),
    ("mlf-m24-vintage-rollrate-ifrs9.ts",
     "Kohort current (status April 2005) default di Oktober sebesar?",
     [("kohort current", 0.1867 * 100, 2, " persen")]),
    ("mlf-m25-reject-inference.ts",
     "ROC-AUC model-A 0,7124 vs oracle 0,7139",
     [("selisih ROC-AUC", 0.7139 - 0.7124, 4, "")]),
    ("mlf-m25-reject-inference.ts",
     "Kenapa fuzzy augmentation tidak memperbaiki bias?",
     [("beda koefisien fuzzy", 0.000875, 6, "")]),
    # --- Track Machine Learning Finance, M4 (2026-11-12) ---
    # Kunci kuis numerik M4 di WHY-TEXT opsi benar; hitung ulang inline.
    ("mlf-m41-random-forest-ensembles.ts",
     "(gap 0,4750). Apa diagnosisnya?",
     [("gap train-WF", 1.0000 - 0.5250, 4, "")]),
    ("mlf-m42-var-expected-shortfall.ts",
     "ES99 historis 0,0775 vs ES99 parametrik",
     [("selisih ES99", 0.0775 - 0.0528, 4, "")]),
    ("mlf-m44-greeks-risk-decomposition.ts",
     # q_sub diperbarui fill gap M4 (lihat CHECKS di atas).
     "S naik 1 persen: call naik $44,49 dan delta menjadi 0,6011",
     [("delta naik aktual", 0.6011 - 0.5665, 4, "")]),
    ("mlf-m44-greeks-risk-decomposition.ts",
     "Harga call 388,03 dihitung dengan",
     [("vega dolar per 1pp", 14.9867, 2, "")]),
    # --- Fill gap Luna M4 (2026-11-12) ---
    # Kunci kuis numerik BARU dari fill di WHY-TEXT opsi benar.
    # M4.1: lebar interval Wilson LR = 0,6430-0,4913 = 15,2pp.
    ("mlf-m41-random-forest-ensembles.ts",
     "Interval Wilson 95% akurasi LR adalah [0,4913; 0,6430]",
     [("lebar interval Wilson", (0.6430 - 0.4913) * 100, 1, "pp")]),
    # M4.3: LR_ind Christoffersen VaR95 dari transition counts.
    ("mlf-m43-var-backtesting-volatility.ts",
     "Kupiec VaR95 tidak menolak (p = 0,3108)",
     [("LR_ind Christoffersen", _lr_ind(203, 11, 11, 4), 4, "")]),
    # M4.3: LR Kupiec EWMA VaR95 (12/230, p=0,05).
    ("mlf-m43-var-backtesting-volatility.ts",
     "Backtest OOS 230 hari, VaR95: historis 15 pelanggaran",
     [("Kupiec LR EWMA VaR95", _kupiec_lr(12, 230, 0.05), 4, "")]),
    # M4.5: VaR95 parametrik tetap = 1,6449 x vol 0,0197.
    ("mlf-m45-drawdown-regime-stress.ts",
     "Shock return −10% pada semua saham",
     [("VaR95 tetap", 1.6449 * 0.0197, 4, "")]),
    # --- Track MLF M6 (2026-11-13, kanonis qa-learn/m6_canonical.json) ---
    # M6.1 Q1: grid GBM terbaik 0,7865, hanya 0,0001 di atas peringkat 2.
    ("mlf-m61-hyperparameter-tuning.ts",
     "Grid GBM 18 konfigurasi (3-fold CV) memberi konfigurasi terbaik yang mana?",
     [("CV grid terbaik", 0.7865, 4, ""),
      ("jarak ke peringkat 2", 0.7865 - 0.7864, 4, "")]),
    # M6.1 Q2: norma L2 C=1 vs C=100 (plateau CV 0,7581).
    ("mlf-m61-hyperparameter-tuning.ts",
     "Grid C logistic regression: C = 1, 10, dan 100 semuanya memberi CV 0,7581. Apa bacaan yang benar?",
     [("norma L2 C=1", 0.9684, 4, ""),
      ("norma L2 C=100", 0.9695, 4, "")]),
    # M6.1 Q3: random search 0,7866, 1,5x fits (81 vs 54).
    ("mlf-m61-hyperparameter-tuning.ts",
     "Random search GBM (27 konfigurasi, seed 42) vs grid terbaik (0,7865). Apa hasil yang benar?",
     [("CV random terbaik", 0.7866, 4, ""),
      ("rasio fits random/grid", 81 / 54, 1, "")]),
    # M6.1 Q7: fits grid GBM 18x3=54, grid LR 5x5=25.
    ("mlf-m61-hyperparameter-tuning.ts",
     "Berapa total fits untuk grid GBM (18 konfigurasi, 3-fold) dan grid LR (5 nilai C, 5-fold)?",
     [("fits GBM", 18 * 3, 0, ""),
      ("fits LR", 5 * 5, 0, "")]),
    # M6.2 Q1: band CV LR = mean ± sd = [0,7504; 0,7616] (band deskriptif;
    # soal dirombak ronde fix M8: "mean (sd antar-fold ...)").
    ("mlf-m62-cross-validation-nested-cv.ts",
     "LR pada data UCI: 5-fold stratified CV memberi mean ROC-AUC 0,7560 (sd antar-fold 0,0056). Apa bacaan yang benar?",
     [("band bawah", 0.7560 - 0.0056, 4, ""),
      ("band atas", 0.7560 + 0.0056, 4, "")]),
    # M6.2 Q2: base rate 0,2212; goyangan 1 sd satu fold 6.000 baris.
    ("mlf-m62-cross-validation-nested-cv.ts",
     "Mengapa dipakai StratifiedKFold, bukan KFold biasa, pada data UCI (base rate 0,2212)?",
     [("base rate", 0.2212, 4, ""),
      ("goyangan 1 sd", (0.2212 * 0.7788 / 6000) ** 0.5, 4, "")]),
    # M6.2 Q5: nested − single-split +0,0035; gain tuning jujur 0,0018.
    ("mlf-m62-cross-validation-nested-cv.ts",
     "Nested CV GBM 0,7858 vs single-split 0,7823 (selisih +0,0035). Apa bacaan yang benar?",
     [("selisih nested-single", 0.7858 - 0.7823, 4, ""),
      ("gain tuning jujur", 0.7858 - 0.7840, 4, "")]),
    # M6.2 Q8: selisih akurasi − naive = 0,0184.
    ("mlf-m62-cross-validation-nested-cv.ts",
     "Time-series BBCA: expanding window 5 fold memberi mean ROC-AUC 0,5516, akurasi 0,5894 vs naive-majority 0,5710, dan fold 5 tepat 0,5000. Apa bacaan yang benar?",
     [("selisih akurasi-naive", 0.5894 - 0.5710, 4, "")]),
    # M6.2 Q9 (fill gap Luna G5, 2026-11-13): SE mean = sd/√5 ≈ 0,0030;
    # CI naif dari mean TAK-DIBULATKAN 0,78584 (memakai 0,7858 memberi
    # batas bawah 0,7798 — salah; kelas gate 89).
    ("mlf-m62-cross-validation-nested-cv.ts",
     "Nested CV GBM: lima skor outer 0,7974; 0,7782; 0,7878; 0,7859; 0,7799 — mean 0,7858, sd 0,0068. Mana pernyataan yang benar tentang ketidakpastian mean ini?",
     [("SE mean", 0.0068 / math.sqrt(5), 4, ""),
      ("CI bawah naif", 0.78584 - 1.96 * (0.0068 / math.sqrt(5)), 4, ""),
      ("CI atas naif", 0.78584 + 1.96 * (0.0068 / math.sqrt(5)), 4, "")]),
    # M6.3 Q1: kenaikan C terkuat → C=1 = 0,0015.
    ("mlf-m63-regularization-early-stopping.ts",
     "Jalur C pada LR [notebook]: C = 0,01 memberi test ROC-AUC 0,7411, C = 1 memberi 0,7426. Berapa kenaikan skor dari penalti terkuat ke C = 1?",
     [("gain jalur C", 0.7426 - 0.7411, 4, "")]),
    # M6.3 Q2: L1 C=0,1 test 0,7418, hanya 0,0006 di bawah L2.
    ("mlf-m63-regularization-early-stopping.ts",
     "L1 pada C = 0,1 men-zero-kan berapa koefisien dari 31, dan berapa test ROC-AUC-nya?",
     [("test L1", 0.7418, 4, ""),
      ("selisih L1-L2", 0.7424 - 0.7418, 4, "")]),
    # M6.3 Q4: memburuk 0,0159; gap tanpa ES 0,2128.
    ("mlf-m63-regularization-early-stopping.ts",
     "GBM TANPA early stopping: test puncak 0,7797 pada 50 pohon, lalu 0,7638 pada 400 pohon. Berapa pemburukannya, dan berapa gap train-test di 400 pohon?",
     [("memburuk", 0.7797 - 0.7638, 4, ""),
      ("gap tanpa ES", 0.9766 - 0.7638, 4, "")]),
    # M6.3 Q5: norma L2 C=100 terbesar, C=0,01 terkecil.
    ("mlf-m63-regularization-early-stopping.ts",
     "Norma L2 koefisien LR: 0,8866 pada C = 0,01 dan 0,9695 pada C = 100. Apa bacaan yang benar tentang C?",
     [("norma L2 C=100", 0.9695, 4, ""),
      ("norma L2 C=0,01", 0.8866, 4, "")]),
    # M6.3 Q6: harga seleksi fitur 0,0001.
    ("mlf-m63-regularization-early-stopping.ts",
     "Pada C = 1: L1 men-zero-kan 1 koefisien (test 0,7425), L2 men-zero-kan 0 (test 0,7426). Bila kamu butuh model yang lebih ringkas untuk dijelaskan ke auditor, apa pilihan yang benar?",
     [("harga seleksi fitur", 0.7426 - 0.7425, 4, "")]),
    # M6.4 Q2: selisih bin |0,2419 − 0,2221| = 0,0198.
    ("mlf-m64-calibration-threshold-selection.ts",
     "Bin [0,2–0,3) GBM mentah: n = 752, prediksi rata-rata 0,2419, tingkat aktual 0,2221. Berapa selisihnya, dan apa artinya?",
     [("selisih bin", abs(0.2419 - 0.2221), 4, "")]),
    # M6.4 Q3: approval 88,05% dan bad rate 15,96% di threshold 0,50.
    # (Review DeepSeek M6.4 2026-11-13: label "GBM terkalibrasi" kini
    # menyebut varian Platt/sigmoid secara eksplisit.)
    ("mlf-m64-calibration-threshold-selection.ts",
     "Threshold 0,10 memberi net profit +NT$8.214.000, threshold 0,50 memberi −NT$18.994.456 (GBM terkalibrasi (Platt/sigmoid), test 6.000). Apa penyebab utama perbedaan ini?",
     [("approval 0,50 %", 0.8805 * 100, 2, "%"),
      ("bad rate 0,50 %", 0.1596 * 100, 2, "%")]),
    # M6.4 Q4: ambang impas p* = 0,05/(0,05+0,45) = 0,10.
    ("mlf-m64-calibration-threshold-selection.ts",
     "Dengan margin 5% dan LGD 45%, berapa ambang impas teoretis p* — dan bagaimana hubungannya dengan threshold empiris?",
     [("ambang impas", 0.05 / (0.05 + 0.45), 2, "")]),
    # M6.4 Q7: kontribusi ECE bin terbesar 0,0025; dua bin lain 0,0009.
    ("mlf-m64-calibration-threshold-selection.ts",
     "Tiga bin GBM mentah menyumbang ECE parsial 0,0033; ECE penuh (10 bin) adalah 0,0073. Bin mana penyumbang TERBESAR di antara ketiganya?",
     [("kontribusi ECE bin", (752 / 6000) * 0.0198, 4, ""),
      ("dua bin lain", 0.0007 + 0.0002, 4, "")]),
    # M6.5 Q1: optimisme winner's curse 0,0042.
    ("mlf-m65-automl-selection-bias.ts",
     "Konfigurasi GBM CV-terbaik (max_iter 100, max_depth 5, learning_rate 0,05) punya skor CV 0,7865 dan skor test 0,7823 [notebook]. Berapa optimisme winner's curse-nya?",
     [("optimisme", 0.7865 - 0.7823, 4, "")]),
    # M6.5 Q2: McNemar LR vs GBM chi2 13,1601, p 0,0003.
    ("mlf-m65-automl-selection-bias.ts",
     "McNemar LR vs GBM (threshold 0,5, test 6.000): b = 132, c = 199, χ² = 13,1601, p = 0,0003 [notebook]. Apa kesimpulan yang benar?",
     [("chi2 McNemar", (abs(132 - 199) - 1) ** 2 / (132 + 199), 4, ""),
      ("p McNemar", 0.0003, 4, "")]),
    # M6.5 Q3: McNemar GBM default vs tertala chi2 0,3788, p 0,5383.
    ("mlf-m65-automl-selection-bias.ts",
     "McNemar GBM default vs GBM tertala: b = 36, c = 30, χ² = 0,3788, p = 0,5383 [notebook]. Apa bacaan yang benar?",
     [("chi2", (abs(36 - 30) - 1) ** 2 / (36 + 30), 4, ""),
      ("p", 0.5383, 4, "")]),
    # M6.5 Q4: keunggulan tertala atas default 0,0018.
    # (Soal dirombak ronde fix M8: "mean (sd antar-fold ...)" — angka sama.)
    ("mlf-m65-automl-selection-bias.ts",
     "Protokol adil (nested CV) [notebook]: LR tertala 0,7560 (sd antar-fold 0,0056); GBM default 0,7840 (sd antar-fold 0,0059); GBM tertala 0,7858 (sd antar-fold 0,0068). Siapa «pemenang jujur», dan apa catatannya?",
     [("keunggulan tertala", 0.7858 - 0.7840, 4, "")]),
    # M6.5 Q8: selisih pasangan kedua 0,0018.
    ("mlf-m65-automl-selection-bias.ts",
     "Pelajaran dari pasangan hasil ini: LR vs GBM signifikan (p = 0,0003, selisih ROC-AUC 0,0397) vs GBM tertala vs default tidak signifikan (p = 0,5383, selisih nested 0,0018). Apa yang harus selalu dilaporkan bersama?",
     [("selisih pasangan kedua", 0.7858 - 0.7840, 4, "")]),
    # M6.5 Q11 (fill gap Luna G7, 2026-11-13): skor yang boleh
    # dilaporkan = nested 0,7858 (mean 5 outer, dihitung ulang).
    ("mlf-m65-automl-selection-bias.ts",
     "Selection record GBM tertala: skor CV 0,7865, skor nested 0,7858, skor test 0,7823 [notebook]. Skor mana yang boleh dilaporkan sebagai «performa model», dan mengapa?",
     [("skor nested (mean 5 outer)",
       (0.7974 + 0.7782 + 0.7878 + 0.7859 + 0.7799) / 5, 4, "")]),
    # M7.3 Q (fill gap Luna G9, 2026-11-13): counterfactual 858
    # dihitung ulang — CF-A cal 0,3325, CF-B cal 0,1535 (kunci
    # m7g9_counterfactual_858 di m7_canonical.json).
    ("mlf-m73-explainability-shap-lime.ts",
     "Apakah saran itu actionable atau manipulasi fitur?",
     [("CF-A cal", 0.3325, 4, ""),
      ("CF-B cal", 0.1535, 4, "")]),
]

# (file, pertanyaan, [(nama, nilai, desimal, akhiran)], [string yang TIDAK
# boleh ada di pertanyaan]) — angka yang hidup di TEKS PERTANYAAN itu sendiri.
QUESTION_CHECKS = [
    ("b13-vasicek.ts",
     "VaR 99,9% ≈ 17,6%",
     [("q99,9 PD=2% rho=15%", vasicek_q(0.02, 0.15, 0.999) * 100, 1, "%")],
     ["17,9%"]),
    ("mk14-pricing.ts",
     "Kanibalisasi 15% pada promo",
     [("kanibalisasi 6/40", 6 / 40 * 100, 0, "%")],
     ["62,5%"]),
    # R8 gaps: LR Kupiec x=4 dihitung ulang dari rumus (bukan dari teks).
    ("mr6-backtesting.ts",
     "Uji Kupiec 250 hari: LR = 0,77",
     [("LR Kupiec x=4",
       -2 * ((250 - 4) * math.log(0.99) + 4 * math.log(0.01)
             - ((250 - 4) * math.log(1 - 4 / 250) + 4 * math.log(4 / 250))),
       2, "")],
     []),
    # R8 gaps: retensi compaction 16/19 = 84,2% (ambang 90% -> GAGAL).
    ("aai14-context-engineering.ts",
     "Compaction meretensi 84,2%",
     [("retensi 16/19", 16 / 19 * 100, 1, "%")],
     []),
    # R8 gaps: kanibalisasi 6/10 = 60% (vs baseline) vs 6/40 = 15% (vs promo).
    ("mk14-pricing.ts",
     "kanibalisasi 60%' tanpa penyebut",
     [("kanibalisasi vs baseline 6/10", 6 / 10 * 100, 0, "%"),
      ("kanibalisasi vs promo 6/40", 6 / 40 * 100, 0, "%")],
     ["62,5%"]),
    # --- Track Machine Learning Finance, M4 (2026-11-12) ---
    # Kunci kuis numerik M4 di TEKS PERTANYAAN itu sendiri.
    # Akar-10: 0,028563 (tak-dibulatkan) × √10 = 0,0903; memakai 0,0286
    # yang dibulatkan memberi 0,0904 — derivasi lesson memakai 0,028563.
    ("mlf-m43-var-backtesting-volatility.ts",
     "Kupiec out-of-sample VaR95",
     [("ekspektasi pelanggaran", 230 * 0.05, 1, "")],
     []),
    ("mlf-m42-var-expected-shortfall.ts",
     "VaR95 10-hari adalah 0,0903",
     [("VaR95 10-hari akar-10", 0.028563 * math.sqrt(10), 4, "")],
     ["0,0286 × √10"]),
    # --- Fill gap Luna M4 (2026-11-12) ---
    # Kunci kuis numerik BARU dari fill di TEKS PERTANYAAN itu sendiri.
    # M4.1: akurasi/presisi threshold 0,60 dari confusion matrix.
    ("mlf-m41-random-forest-ensembles.ts",
     "Threshold 0,60 punya akurasi 0,6125",
     [("akurasi threshold 0,60", (21 + 77) / 160, 4, ""),
      ("presisi threshold 0,60", 21 / 34, 4, "")],
     []),
    # M4.1: batas interval Wilson dihitung ulang dari rumus (bukan dari
    # teks lesson) — 91/160 dan 90/160, z = 1,959964.
    ("mlf-m41-random-forest-ensembles.ts",
     "Interval Wilson 95% akurasi LR adalah [0,4913; 0,6430]",
     [("Wilson bawah LR", _wilson(91, 160)[0], 4, ""),
      ("Wilson atas LR", _wilson(91, 160)[1], 4, ""),
      ("Wilson bawah naive", _wilson(90, 160)[0], 4, ""),
      ("Wilson atas naive", _wilson(90, 160)[1], 4, "")],
     []),
    # M4.4: repricing BS S+1% dan suku delta/gamma dari parameter kanonis.
    ("mlf-m44-greeks-risk-decomposition.ts",
     "S naik 1 persen: call sebenarnya naik $44,49",
     [("perubahan sebenarnya S+1%",
       _bs_call(7695.57) - _bs_call(7619.38), 2, ""),
      ("perkiraan delta", _D, 2, ""),
      ("suku gamma", _G, 2, "")],
     []),
    # --- Fill gap Luna M6 (2026-11-13) ---
    # M6.1 Q4: interaksi lr x depth dari rata-rata kelompok grid penuh
    # (bukan dari angka tampil yang dibulatkan — kelas gate 89).
    ("mlf-m61-hyperparameter-tuning.ts",
     "Pada grid GBM, learning rate 0,05 lebih baik pada depth 5",
     [("interaksi depth 5",
       (0.7865 + 0.7864 + 0.7855) / 3 - (0.7853 + 0.7851 + 0.7851) / 3, 4, ""),
      ("interaksi depth 3",
       (0.7862 + 0.7862 + 0.7856) / 3 - (0.7864 + 0.7854 + 0.7827) / 3, 4, "")],
     []),
    # M6.5 Q12: registry lintas sesi — 54 percobaan, skor terbaik 0,7869.
    ("mlf-m65-automl-selection-bias.ts",
     "Tiga sesi eksperimen: grid 18 (terbaik CV 0,7865)",
     [("total percobaan", 18 + 27 + 9, 0, ""),
      ("skor terbaik lintas sesi", 0.7869, 4, "")],
     []),
]


def correct_why(text: str, q_sub: str) -> str:
    """Why-text opsi `correct: true` pada pertanyaan yang memuat q_sub."""
    qi = text.find(q_sub)
    if qi < 0:
        raise AssertionError(f"pertanyaan tidak ditemukan: {q_sub!r}")
    ci = text.find("correct: true", qi)
    if ci < 0:
        raise AssertionError(f"tidak ada opsi correct setelah pertanyaan: {q_sub!r}")
    whys = list(re.finditer(r'why:\s*"((?:[^"\\]|\\.)*)"', text[qi:ci]))
    if not whys:
        raise AssertionError(f"tidak ada why sebelum correct: {q_sub!r}")
    return _unescape(whys[-1].group(1))


def main() -> int:
    fails: list[str] = []
    for fname, q_sub, recomps in CHECKS:
        text = decode_file(CONTENT / fname)
        try:
            opt = correct_option(text, q_sub)
        except AssertionError as e:
            print(f"FAIL {fname} :: {e}")
            fails.append(fname)
            continue
        missing = []
        vals = []
        for name, value, dec, suffix in recomps:
            want = fmt_id(value, dec) + suffix
            vals.append(f"{name}={want}")
            if want not in opt:
                missing.append(want)
        if missing:
            print(f"FAIL {fname} :: opsi benar '{opt[:90]}' kehilangan {missing} "
                  f"(hitung ulang: {', '.join(vals)})")
            fails.append(fname)
        else:
            print(f"OK   {fname} :: opsi benar memuat {vals}")
    for fname, q_sub, recomps, must_not in QUESTION_CHECKS:
        text = decode_file(CONTENT / fname)
        try:
            q = question_text(text, q_sub)
        except AssertionError as e:
            print(f"FAIL {fname} :: {e}")
            fails.append(fname)
            continue
        missing, bad, vals = [], [], []
        for name, value, dec, suffix in recomps:
            want = fmt_id(value, dec) + suffix
            vals.append(f"{name}={want}")
            if want not in q:
                missing.append(want)
        bad = [s for s in must_not if s in q]
        if missing or bad:
            print(f"FAIL {fname} :: pertanyaan '{q[:90]}' hilang {missing}, "
                  f"mengandung yang salah {bad} (hitung ulang: {', '.join(vals)})")
            fails.append(fname)
        else:
            print(f"OK   {fname} :: pertanyaan memuat {vals}")
    for fname, q_sub, recomps in WHY_CHECKS:
        text = decode_file(CONTENT / fname)
        try:
            why = correct_why(text, q_sub)
        except AssertionError as e:
            print(f"FAIL {fname} :: {e}")
            fails.append(fname)
            continue
        missing, vals = [], []
        for name, value, dec, suffix in recomps:
            want = fmt_id(value, dec) + suffix
            vals.append(f"{name}={want}")
            if want not in why:
                missing.append(want)
        # arah update Beta: gagal masuk parameter PERTAMA (a), bukan b.
        extra_bad = []
        if fname.startswith("b17-") and "tambah gagal ke b" in why:
            extra_bad.append("tambah gagal ke b")
        if fname.startswith("b14-") and "puncak = saat arus masuk" in why:
            extra_bad.append("puncak = saat arus masuk")
        if missing or extra_bad:
            print(f"FAIL {fname} :: why opsi benar '{why[:90]}' hilang {missing}, "
                  f"mengandung yang salah {extra_bad} (hitung ulang: {', '.join(vals)})")
            fails.append(fname)
        else:
            print(f"OK   {fname} :: why opsi benar memuat {vals}")
    print(f"QA QUIZ-NUMERIC-KEYS: {'ALL PASS' if not fails else f'{len(fails)} FAIL'}"
          f" ({len(CHECKS) + len(QUESTION_CHECKS) + len(WHY_CHECKS)} kunci dipindai)")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
