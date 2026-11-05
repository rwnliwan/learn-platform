# ---------- lab integrity ----------
def run_py(code: str):
    r = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, timeout=60)
    return r

def calibrate(step: dict):
    """Run solution; fail loudly on error; auto-set expected + equal values;
    verify authored stdout_matches patterns."""
    code = step.get("code")
    if not code:
        return
    r = run_py(code["solution"])
    if r.returncode != 0:
        raise SystemExit("SOLUTION FAILED [" + step["id"] + "]:\n" + r.stderr)
    out = r.stdout
    if not code.get("expected"):
        lines = [l for l in out.splitlines() if l.strip()]
        code["expected"] = lines[-1] if lines else ""
    names = sorted({c["name"] for c in code["checks"] if c.get("name") and c["kind"] in ("equal", "contains", "defined")})
    vals = {}
    if names:
        probe = code["solution"] + "\n" + "\n".join(
            "try:\n    print('##V## " + n + " ' + repr(" + n + "))\nexcept NameError:\n    print('##V## " + n + " ##UNDEF##')" for n in names)
        r2 = run_py(probe)
        if r2.returncode != 0:
            raise SystemExit("PROBE FAILED [" + step["id"] + "]:\n" + r2.stderr)
        for line in r2.stdout.splitlines():
            if line.startswith("##V## "):
                _, name, val = line.split(" ", 2)
                if val == "##UNDEF##":
                    continue
                try:
                    vals[name] = eval(val, {"__builtins__": {}})
                except Exception:
                    vals[name] = "__SKIP__"
    for c in code["checks"]:
        if c["kind"] == "equal" and c.get("name") in vals and vals[c["name"]] != "__SKIP__":
            c["value"] = vals[c["name"]]
            c.setdefault("tol", 1e-9)
        elif c["kind"] == "stdout_matches":
            pat = c.get("pattern")
            if not pat:
                raise SystemExit("stdout_matches without pattern [" + step["id"] + "]")
            if not re.search(pat, out):
                raise SystemExit("PATTERN MISMATCH [" + step["id"] + "]: " + repr(pat) + " not in:\n" + out)

