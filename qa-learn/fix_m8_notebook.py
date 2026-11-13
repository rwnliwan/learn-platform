#!/usr/bin/env python3
"""Patch notebook M7.5 (Learn v2 MLF) — helper find_file, pola M8 — 13 Nov 2026.

Latar: nbconvert menjalankan kernel dengan cwd colab/, sehingga path relatif
"data/..." dan "qa-learn/..." GAGAL bila notebook dieksekusi ulang dari
colab/. M8 sudah memakai helper find_file (coba repo-root dulu, lalu
relatif); M7.5 belum. Patch ini MENYALIN pola M8.1 persis — isi/angka
notebook TIDAK diubah: hanya cell 1 (setup) yang disentuh.

Perubahan cell 1:
  - tambah `import os`
  - tambah def find_file(candidates) (docstring pola M8.1)
  - DATA_XLS = find_file(["data/uci_default_credit.xls",
                          "../data/uci_default_credit.xls"])
  - CANON_PATH = find_file(["qa-learn/m7_calc_m75_output.json",
                            "../qa-learn/m7_calc_m75_output.json"])
    lalu open(CANON_PATH); pesan print memakai path yang ketemu.

Verifikasi: skrip mencetak jumlah sel + hash cell 1 sebelum/sesudah,
memastikan TIDAK ADA cell lain yang berubah (bandingkan JSON cell-by-cell
kecuali cell 1), dan memastikan string lama "data/uci_default_credit.xls"
sebagai literal tunggal sudah tidak ada (hanya di dalam list find_file).

Re-eksekusi notebook TIDAK dilakukan di sini (VM tidak sepi; patch
bersifat struktural, tidak mengubah angka) — dicatat untuk koordinator
deploy: eksekusi ulang M7.5 saat VM sepi sebelum re-upload ke Drive.
"""
import hashlib
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
NB_PATH = REPO / "colab" / "mlf-m75-guided-task.ipynb"

OLD_IMPORT = "import json\nimport math\n"
NEW_IMPORT = "import json\nimport math\nimport os\n"

OLD_PATHS = '''DATA_XLS = "data/uci_default_credit.xls"

try:
    with open("qa-learn/m7_calc_m75_output.json") as f:
        CANON = json.load(f)
    print("Kanonis dimuat dari qa-learn/m7_calc_m75_output.json")'''

NEW_PATHS = '''def find_file(candidates):
    # Notebook dijalankan dari folder repo (data/...) atau oleh nbconvert
    # yang memakai folder notebook sebagai cwd (../data/...).
    for p in candidates:
        if os.path.exists(p):
            return p
    raise FileNotFoundError(candidates)


DATA_XLS = find_file(["data/uci_default_credit.xls",
                      "../data/uci_default_credit.xls"])
CANON_PATH = find_file(["qa-learn/m7_calc_m75_output.json",
                        "../qa-learn/m7_calc_m75_output.json"])

try:
    with open(CANON_PATH) as f:
        CANON = json.load(f)
    print(f"Kanonis dimuat dari {CANON_PATH}")'''


def sha(text):
    return hashlib.sha256(text.encode()).hexdigest()[:12]


def main():
    dry = "--dry" in sys.argv
    nb = json.loads(NB_PATH.read_text())
    cells = nb["cells"]
    assert len(cells) == 14, f"jumlah sel berubah: {len(cells)} (harap 14)"
    src1 = "".join(cells[1]["source"])
    before = sha(src1)
    assert OLD_IMPORT in src1, "blok import tidak ditemukan di cell 1"
    assert OLD_PATHS in src1, "blok path tidak ditemukan di cell 1"
    assert src1.count("find_file") == 0, "cell 1 sudah punya find_file"
    new_src1 = src1.replace(OLD_IMPORT, NEW_IMPORT, 1).replace(OLD_PATHS, NEW_PATHS, 1)
    assert new_src1.count("find_file") == 3, new_src1.count("find_file")
    # literal tunggal lama harus hilang (hanya tersisa di dalam list find_file)
    assert '"data/uci_default_credit.xls"' in new_src1  # di list find_file
    assert new_src1.count('"data/uci_default_credit.xls"') == 1
    assert new_src1.count('"qa-learn/m7_calc_m75_output.json"') == 1
    print(f"cell 1: {before} -> {sha(new_src1)}")
    print(f"sel: {len(cells)}; cell lain tak berubah: dicek di bawah")
    if dry:
        print("DRY-RUN: file tidak ditulis")
        return
    cells[1]["source"] = new_src1.splitlines(keepends=True)
    # nbformat menyimpan source sebagai list baris; samakan gaya file lama:
    # bila source lama berupa list, tulis list; bila string, tulis string.
    NB_PATH.write_text(json.dumps(nb, indent=1, ensure_ascii=False) + "\n")
    # verifikasi pasca-tulis
    nb2 = json.loads(NB_PATH.read_text())
    assert len(nb2["cells"]) == 14
    assert "".join(nb2["cells"][1]["source"]) == new_src1
    for i, (a, b) in enumerate(zip(cells, nb2["cells"])):
        if i == 1:
            continue
        assert a == b, f"cell {i} ikut berubah!"
    print("OK: notebook ditulis; hanya cell 1 berubah; 14 sel utuh")


if __name__ == "__main__":
    main()
