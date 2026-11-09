#!/usr/bin/env python3
"""QA Learn — guard GG-18 (pusat): label jumlah vs isi struktur.

Kelas cacat R9 (P1-5/P4-5 "Lima heuristik" untuk 6 butir; P6-C15-6 "Enam
pertanyaan campuran" untuk 5 soal; P6-MLE16-2/3 peta isi + "Lima pertanyaan"
untuk 7 soal; P7-5 "5 kuis"/"46 mnt" vs 7 soal/55 menit; P7-3 L7 tidak
tercantum di daftar isi).

Yang dicek (semua file lesson) — pola DIPERSempit agar tidak false positive
("Tiga pertanyaan" sebagai JUDUL framework / isi kuis bukan label jumlah):
1. Di step checkpoint SAJA, prose berisi "N pertanyaan campuran" atau
   "N pertanyaan dari semua langkah" vs jumlah soal kuis (`q: "..."`) di
   step itu.
2. "(Lima|Enam|...) heuristik" di note body vs jumlah ordinal
   (Pertama..Kesepuluh / "Satu:".."Sepuluh:") di note yang sama.
3. Baris isi lesson (mengandung "⏱"): "N mnt" vs `estMinutes`; "N kuis"
   vs jumlah total soal kuis di file.
4. Peta isi: setiap "Langkah N · Judul" di prose WAJIB cocok nomor DAN
   judulnya dengan step sebenarnya (eyebrow "Langkah N · ..."); kata
   pertama judul (tanpa tanda baca) harus cocok bila judul tidak sama
   persis.
5. Daftar isi ("Isi lesson"): WAJIB menyebut SEMUA nomor langkah yang ada.

Jalankan: python3 qa-learn/qa_gg18_label_counts.py
Keluar 0 = lolos; 1 = gagal.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gg_common import (  # noqa: E402
    ORDINALS, WORD_NUM, iter_lesson_files, split_steps,
    strip_code_and_patterns,
)

Q_RE = re.compile(r"\bq:\s*\"")
WORD_Q_RE = re.compile(
    r"\b(Satu|Dua|Tiga|Empat|Lima|Enam|Tujuh|Delapan|Sembilan|Sepuluh)"
    r"\s+pertanyaan\s+(campuran|dari semua langkah)\b")
HEUR_RE = re.compile(
    r"\b(Satu|Dua|Tiga|Empat|Lima|Enam|Tujuh|Delapan|Sembilan|Sepuluh)"
    r"\s+heuristik\b")
ISI_MNT_RE = re.compile(r"⏱\s*(\d+)\s*mnt\b")
ISI_KUIS_RE = re.compile(r"⏱[^\n\"]*?(\d+)\s*kuis\b")
EST_RE = re.compile(r"\bestMinutes:\s*(\d+)")
STEP_MENTION_RE = re.compile(r"Langkah\s+(\d+)\s*·\s*([^—\n\"|]+)")
EYEBROW_RE = re.compile(r"eyebrow:\s*\"Langkah\s+(\d+)\s*·\s*([^\"]+)\"")
PROSE_STR_RE = re.compile(r"\"((?:\\.|[^\"\\])*)\"")


def count_ordinals(text: str) -> int:
    n = sum(1 for o in ORDINALS if re.search(r"\b" + o + r"\b", text))
    if n:
        return n
    return len(re.findall(r"\b(Satu|Dua|Tiga|Empat|Lima|Enam|Tujuh|Delapan"
                          r"|Sembilan|Sepuluh)\s*:", text))


def _first_word(title: str) -> str:
    words = re.findall(r"[A-Za-zÀ-ÿ0-9]+", title)
    return words[0].lower() if words else ""


def check_file(path: Path):
    problems = []
    text = path.read_text(encoding="utf-8")
    clean = strip_code_and_patterns(text)
    total_q = len(Q_RE.findall(clean))
    m = EST_RE.search(text)
    est = int(m.group(1)) if m else None
    # --- 3. baris isi lesson (⏱) ---
    for line in clean.splitlines():
        if "⏱" in line:
            mm = ISI_MNT_RE.search(line)
            if mm and est is not None and int(mm.group(1)) != est:
                problems.append(
                    f"isi lesson \"{mm.group(1)} mnt\" vs estMinutes={est}")
            mk = ISI_KUIS_RE.search(line)
            if mk and int(mk.group(1)) != total_q:
                problems.append(
                    f"isi lesson \"{mk.group(1)} kuis\" vs {total_q} soal kuis")
    # --- step sebenarnya ---
    actual = {}
    for sm in EYEBROW_RE.finditer(text):
        actual[int(sm.group(1))] = sm.group(2).strip()
    # --- 1/2/4 per step ---
    for step_id, chunk in split_steps(text):
        chunk_clean = strip_code_and_patterns(chunk)
        n_q = len(Q_RE.findall(chunk_clean))
        if step_id == "checkpoint":
            for wm in WORD_Q_RE.finditer(chunk_clean):
                if WORD_NUM[wm.group(1)] != n_q:
                    problems.append(
                        f"step checkpoint: \"{wm.group(1)} pertanyaan "
                        f"{wm.group(2)}\" vs {n_q} soal kuis")
        for hm in HEUR_RE.finditer(chunk_clean):
            n_ord = count_ordinals(chunk_clean)
            if n_ord and WORD_NUM[hm.group(1)] != n_ord:
                problems.append(
                    f"step {step_id}: \"{hm.group(1)} heuristik\" vs "
                    f"{n_ord} butir bernomor")
        for pm in STEP_MENTION_RE.finditer(chunk_clean):
            num = int(pm.group(1))
            title = pm.group(2).strip().strip("—- ").strip()
            if num not in actual:
                problems.append(
                    f"step {step_id}: peta menyebut Langkah {num} "
                    f"\"{title}\" yang tidak ada")
            elif title and title.lower() not in actual[num].lower() \
                    and actual[num].lower() not in title.lower():
                first = _first_word(title)
                if first and first not in actual[num].lower():
                    problems.append(
                        f"step {step_id}: peta \"Langkah {num} · {title}\" "
                        f"vs step sebenarnya \"{actual[num]}\"")
    # --- 5. daftar isi menyebut semua langkah? (hanya bila isi memakai
    # format "Langkah N · Judul" — format "(1) ... (2) ..." bukan peta;
    # eyebrow step sendiri dikeluarkan agar tidak terhitung sebagai isi) ---
    for _sid, chunk in split_steps(text):
        if "Isi lesson" in chunk:
            no_eyebrow = re.sub(r'(?m)^\s*eyebrow:.*$', '', chunk)
            mentions = STEP_MENTION_RE.findall(
                strip_code_and_patterns(no_eyebrow))
            if not mentions:
                continue
            mentioned = {int(n) for n, _t in mentions}
            missing = sorted(set(actual) - mentioned)
            if missing:
                problems.append(
                    f"daftar isi tidak menyebut Langkah {missing} "
                    f"(ada: {sorted(actual)})")
    return problems


def main() -> int:
    bad = 0
    for path in iter_lesson_files():
        for p in check_file(path):
            print(f"FAIL {path.name}: {p}")
            bad += 1
    if bad:
        print(f"QA GG-18-LABEL-COUNTS: FAIL ({bad} temuan)")
        return 1
    print("QA GG-18-LABEL-COUNTS: ALL PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
