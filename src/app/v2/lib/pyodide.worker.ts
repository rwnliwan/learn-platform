/// <reference lib="webworker" />
// Pyodide Web Worker for v2 workspace (DESIGN.md §7.2, §11).
// Loads Pyodide from CDN once, then executes learner code + check harness
// in one roundtrip. The main thread enforces the 10s timeout by
// terminating this worker (terminate + respawn, no SharedArrayBuffer needed).
declare function importScripts(...urls: string[]): void;

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

let pyodide: any = null;
let readyPromise: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  if (pyodide) return Promise.resolve();
  if (readyPromise) return readyPromise;
  readyPromise = new Promise<void>((resolve, reject) => {
    try {
      importScripts(PYODIDE_URL);
    } catch (e) {
      reject(new Error("Gagal mengunduh Pyodide dari CDN"));
      return;
    }
    const w = self as any;
    if (typeof w.loadPyodide !== "function") {
      reject(new Error("loadPyodide tidak tersedia"));
      return;
    }
    w.loadPyodide()
      .then((p: any) => {
        pyodide = p;
        resolve();
      })
      .catch((e: any) => reject(new Error("Gagal inisialisasi Pyodide: " + (e?.message ?? e))));
  });
  return readyPromise;
}

// The check harness: runs user code capturing stdout, then evaluates the
// check specs in the same namespace. Check kinds: defined, equal,
// contains, stdout_matches, uses, forbids (see v2/lib/types.ts).
function buildScript(code: string, checksJson: string): string {
  return `
import io, contextlib, json, ast, re
__code__ = ${JSON.stringify(code)}
__specs__ = json.loads(${JSON.stringify(checksJson)})
__ns__ = {}
__buf__ = io.StringIO()
__err__ = None
try:
    __compiled__ = compile(__code__, "<langkah>", "exec")
    with contextlib.redirect_stdout(__buf__):
        exec(__compiled__, __ns__)
except SyntaxError as e:
    __err__ = "SyntaxError: %s (baris %s)" % (e.msg, e.lineno)
except Exception as e:
    __err__ = "%s: %s" % (type(e).__name__, e)
__stdout__ = __buf__.getvalue()

def __uses__(tree, token):
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and node.id == token:
            return True
        if isinstance(node, ast.Attribute) and node.attr == token:
            return True
    return False

__tree__ = None
try:
    __tree__ = ast.parse(__code__)
except Exception:
    __tree__ = None

__results__ = []
for __spec__ in __specs__:
    __ok__ = False
    __detail__ = ""
    __kind__ = __spec__.get("kind")
    try:
        if __kind__ == "defined":
            __ok__ = __spec__["name"] in __ns__
            __detail__ = "" if __ok__ else "tidak terdefinisi"
        elif __kind__ == "equal":
            __v__ = __ns__.get(__spec__["name"])
            __e__ = __spec__["value"]
            __tol__ = __spec__.get("tol") or 0
            if isinstance(__v__, (int, float)) and isinstance(__e__, (int, float)) and __tol__:
                __ok__ = abs(__v__ - __e__) <= __tol__
            else:
                __ok__ = __v__ == __e__
            __detail__ = "" if __ok__ else "hasilmu %r" % (__v__,)
        elif __kind__ == "contains":
            __c__ = __ns__.get(__spec__["name"])
            __ok__ = __c__ is not None and __spec__["value"] in __c__
            __detail__ = "" if __ok__ else "tidak ditemukan"
        elif __kind__ == "stdout_matches":
            __ok__ = re.search(__spec__["pattern"], __stdout__) is not None
            __detail__ = "" if __ok__ else "output tidak cocok"
        elif __kind__ == "uses":
            __ok__ = __tree__ is not None and __uses__(__tree__, __spec__["token"])
            __detail__ = "" if __ok__ else "tidak dipakai"
        elif __kind__ == "forbids":
            __ok__ = not (__tree__ is not None and __uses__(__tree__, __spec__["token"]))
            __detail__ = "" if __ok__ else "seharusnya tidak dipakai"
        else:
            __detail__ = "jenis check tidak dikenal"
    except Exception as e:
        __ok__ = False
        __detail__ = "gagal dievaluasi"
    __results__.append({"task": __spec__.get("task"), "passed": bool(__ok__), "detail": __detail__})

print("__V2RESULT__" + json.dumps({"stdout": __stdout__, "error": __err__, "checks": __results__}))
`;
}

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data as { id: number; type: string; code?: string; checks?: string; requires?: string[] };
  const post = (data: any) => (self as any).postMessage({ id: msg.id, ...data });

  async function loadRequires(requires: string[] | undefined): Promise<void> {
    const pkgs = (requires ?? []).filter((p) => typeof p === "string" && p.length > 0);
    if (pkgs.length === 0) return;
    // loadPackage is cached per worker instance; repeat calls are no-ops.
    await pyodide.loadPackage(pkgs);
  }

  if (msg.type === "init") {
    try {
      await ensureReady();
      await loadRequires(msg.requires);
      post({ type: "ready" });
    } catch (err: any) {
      post({ type: "load-error", message: "Gagal memuat Python/paket: " + (err?.message ?? String(err)) });
    }
    return;
  }

  if (msg.type === "run") {
    try {
      await ensureReady();
      try {
        await loadRequires(msg.requires);
      } catch (err: any) {
        post({ type: "run-error", message: "Gagal memuat paket Python: " + (err?.message ?? String(err)) });
        return;
      }
      const logs: string[] = [];
      pyodide.setStdout({ batched: (m: string) => logs.push(m) });
      pyodide.setStderr({ batched: (m: string) => logs.push(m) });
      const script = buildScript(msg.code ?? "", msg.checks ?? "[]");
      await pyodide.runPythonAsync(script);
      const out = logs.join("\n");
      const marker = out.lastIndexOf("__V2RESULT__");
      if (marker < 0) {
        post({ type: "run-error", message: "Hasil check tidak terbaca." });
        return;
      }
      const payload = JSON.parse(out.slice(marker + "__V2RESULT__".length));
      post({ type: "run-ok", stdout: payload.stdout, error: payload.error, checks: payload.checks });
    } catch (err: any) {
      post({ type: "run-error", message: err?.message ?? String(err) });
    }
    return;
  }
};
