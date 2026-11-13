#!/usr/bin/env python3
"""Extract NEW fill steps/labs from the 5 M8 lessons for a prose-level review.
New content = steps with eyebrow 'Langkah <n>a' + capstone step + lab3 blocks.
Also appends m8 canonical + cross-ref appendix. Output: review-prompts/prose_review_m8_fill_prompt.txt
"""
import json, re
from pathlib import Path

ROOT = Path("/home/hatch/workspace/learn-platform")

HEADER = """Kamu adalah reviewer konsep (bukan reviewer koreksi angka). Tugasmu: membaca KONTEN BARU hasil fill gap Luna M8 (langkah-langkah baru + lab baru + capstone) dan memeriksa KONTRADIKSI KONSEPTUAL dengan isi lesson M8 yang sudah ada (diringkas di bawah) dan dengan angka kanonis.

ATURAN:
1. Periksa HANYA kontradiksi: klaim di konten baru yang bertentangan dengan (a) angka kanonis, (b) aturan/keputusan lesson yang sudah ada (diringkas di bawah), atau (c) klaim di langkah baru lainnya.
2. JANGAN laporkan ulang hal yang sudah benar. JANGAN laporkan gaya bahasa. JANGAN mengarang angka baru.
3. Bila menemukan kontradiksi, kutip kedua sisi (kalimat konten baru + kalimat/angka yang dilanggar) dan beri tingkat: MUST (salah dan menyesatkan learner) / SHOULD (ambigu, bisa dibaca salah).
4. Bila tidak ada kontradiksi, jawab: "TIDAK ADA KONTRADIKSI" + satu kalimat alasan.
5. Jawab dalam Bahasa Indonesia (istilah teknis English).

KEPUTUSAN LESSON YANG SUDAH ADA (jangan dilanggar konten baru):
- M8.1: band ECE berlaku HANYA overall + per half (n=3.000–6.000); per grup berlaku gate n≥200 (n<200 = TEMUAN-INVESTIGASI, bukan pemicu band). Verdict KUNING: pemicu |Δbad rate| 1,06 pp + ECE grup dalam band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312). AGE 60+ ECE 0,1208 (n=76) = TEMUAN-INVESTIGASI. Band |Δapproval|: HIJAU ≤1,0 pp, KUNING 1,0–3,0 pp, MERAH >3,0 pp.
- M8.2: tiering = aturan jumlah level (C+M ≥3 Tier 1; =2 Tier 2; ≤1 Tier 3) DAN skor tertimbang 0,5M+0,3C+0,2B (ambang 1,5/2,5); hierarki: matriks = saringan kasar, SKOR yang mengikat. Flagship: M=3, C=2, B=3 (skala sampel [ilustrasi skala]), skor 3,20 → Tier 1; skala buku penuh → M=4, B=4, skor 3,40, tetap Tier 1.
- M8.3: model card = satu versi = satu kartu = satu paket (versi model + kalibrasi + threshold + snapshot + hash kode). Rentang antar-chunk ROC 0,0710 [m75_pseudo_time_roc_spread]; drop vs full-test 0,0388.
- M8.4: champion GBM terkalibrasi (0,7816/0,5558/28,5%/6,67%, profit +NT$8.214.000) vs challenger LR (0,7426/0,5049/20,25%/9,14%, profit +NT$1.823.000); LR terkalibrasi Platt 1.166 approval, profit +NT$1.886.500. Tujuh gate naik: G1 profit, G2 bad rate ≤7,67%, G3 ECE ≤0,02, G4 disagreement, G5 monitoring M7.5, G6 AIR ≥0,80, G7 dua periode — LR gagal G1, G2, G3, G4, G7; G5/G6 belum diuji. Canary: 1% LANJUT, 5% TAHAN, 5% diperpanjang STOP → ROLLBACK. Ramp 1%→5%→25%→100% [kebijakan lesson ini]. Target rollback < 30 menit [kebijakan lesson ini].
- M8.5: 6 gerbang change control; gerbang 6 = VERIFIKASI rollback criteria (ditulis gerbang 1). Validator independen dari owner. Ambang kebijakan dilabeli [kebijakan lesson ini]; kuorum/SLA = [kebijakan organisasi].
- Cross-ref: ECE GBM terkalibrasi 0,0087 [M6.4]; nested CV GBM 0,7858 (sd antar-fold 0,0068; SE ≈ 0,0030) [M6.2]; AIR SEX 0,8694; thresholds post-processing L 0,1058 / P 0,0965 [M7.4]; PSI S2 simulasi 0,5811 [M7.5].

FORMAT JAWABAN:
# Prose Review Fill M8
## Ringkasan
(TIDAK ADA KONTRADIKSI, atau tabel temuan)
## Per temuan
### F1 — [MUST/SHOULD]
- Konten baru: (kutipan)
- Dilanggar: (kutipan/angka yang dilanggar)
- Perbaikan: (satu kalimat)

"""

LESSONS = [
    ("M8.1", "mlf-m81-model-validation-framework"),
    ("M8.2", "mlf-m82-model-risk-rating-inventory"),
    ("M8.3", "mlf-m83-model-card-documentation"),
    ("M8.4", "mlf-m84-deployment-shadow-canary-champion"),
    ("M8.5", "mlf-m85-governance-approval-workflow"),
]

def extract_new_blocks(ts_text: str):
    """Return list of (id, eyebrow/title, text) for new fill content."""
    blocks = []
    # Split on step boundaries: each step starts with 'id: "..."' inside steps array.
    # Simpler: find all occurrences of eyebrow containing 'Langkah <n>a' or 'Capstone' or 'Lab 3'
    # and capture from the preceding 'id:' to the next 'id:' at same indent.
    # Use a regex over the whole file: blocks delimited by lines starting with 6 spaces + 'id:'
    pattern = re.compile(r'(?m)^(      id: "[^"]+",\n(?:.*\n)*?)(?=^      id: |^    \],|^  \}\n\})', re.MULTILINE)
    # Fallback: work line-based.
    lines = ts_text.split("\n")
    cur = None
    for ln in lines:
        m = re.match(r'^      id: "([^"]+)",', ln)
        if m:
            if cur is not None:
                blocks.append(cur)
            cur = {"id": m.group(1), "lines": [ln]}
        elif cur is not None:
            cur["lines"].append(ln)
            if re.match(r'^    \],', ln) or re.match(r'^  \},', ln):
                blocks.append(cur)
                cur = None
    if cur is not None:
        blocks.append(cur)
    out = []
    for b in blocks:
        text = "\n".join(b["lines"])
        if re.search(r'eyebrow: "Langkah \d+a', text) or re.search(r'eyebrow: "Langkah 10a|Capstone', text) or b["id"] in ("lab3", "capstone"):
            out.append((b["id"], text))
    return out

parts = [HEADER]
for code, slug in LESSONS:
    ts = (ROOT / f"src/app/v2/content/{slug}.ts").read_text()
    for bid, text in extract_new_blocks(ts):
        parts.append(f"\n\n===== {code} — {bid} =====\n\n" + text)
canon = (ROOT / "qa-learn/m8_canonical.json").read_text()
parts.append("\n\n===== ANGKA KANONIS (m8_canonical.json, 13 kunci) =====\n" + canon)
prompt = "".join(parts)
out = ROOT / "review-prompts/prose_review_m8_fill_prompt.txt"
out.write_text(prompt)
print(out.name, len(prompt), "bytes")
