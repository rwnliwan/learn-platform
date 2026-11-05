#!/usr/bin/env python3
"""Uji eksekusi semua lab code dari page.tsx yang di-generate (b/c/d)."""
import re, glob, sys

def main():
    files = sorted(glob.glob("/home/hatch/workspace/learn-platform/src/app/learn/[bcd]*/page.tsx"))
    ok = fail = skipped = 0
    for fp in files:
        txt = open(fp).read()
        codes = re.findall(r"const (lab\d+Code) = String\.raw`(.*?)`;", txt, re.S)
        for name, code in codes:
            # lewati lab yang butuh micropip (pandas/numpy di Pyodide) — dicek terpisah
            if "micropip" in code:
                skipped += 1
                continue
            try:
                exec(compile(code, f"<{fp}#{name}>", "exec"), {"__name__": "__main__"})
                ok += 1
            except Exception as e:
                fail += 1
                print(f"FAIL {fp} {name}: {type(e).__name__}: {e}")
    print(f"\n{ok} OK, {fail} FAIL, {skipped} micropip-skipped")
    return 1 if fail else 0

if __name__ == "__main__":
    sys.exit(main())
