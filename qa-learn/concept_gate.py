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
