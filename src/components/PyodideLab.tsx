"use client";
import { useState, useRef } from "react";
import { decodeEntities } from "@/lib/decodeEntities";

interface PyodideLabProps {
  defaultCode: string;
  title?: string;
  hint?: string;
}

// Module-level cache so Pyodide loads only once across all lab instances
let pyodidePromise: Promise<any> | null = null;

declare global {
  interface Window {
    loadPyodide?: (opts?: any) => Promise<any>;
  }
}

function getPyodide(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      window.loadPyodide().then(resolve, reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
    script.onload = () => {
      if (window.loadPyodide) {
        window.loadPyodide().then(resolve, reject);
      } else {
        reject(new Error("loadPyodide tidak tersedia"));
      }
    };
    script.onerror = () => reject(new Error("Gagal memuat Pyodide dari CDN"));
    document.head.appendChild(script);
  });
  return pyodidePromise;
}

export default function PyodideLab({ defaultCode, title, hint }: PyodideLabProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "error">("idle");
  const runId = useRef(0);

  async function run() {
    const myRun = ++runId.current;
    setStatus("loading");
    setOutput("Memuat Python…");
    try {
      const pyodide = await getPyodide();
      if (myRun !== runId.current) return;
      setStatus("running");
      setOutput("Menjalankan…");
      const logs: string[] = [];
      pyodide.setStdout({ batched: (m: string) => logs.push(m) });
      pyodide.setStderr({ batched: (m: string) => logs.push(m) });
      await pyodide.runPythonAsync(code);
      if (myRun !== runId.current) return;
      setOutput(logs.join("\n") || "(tidak ada output)");
      setStatus("idle");
    } catch (e: any) {
      if (myRun !== runId.current) return;
      setOutput("Error: " + (e?.message ?? String(e)));
      setStatus("error");
    }
  }

  function reset() {
    runId.current++;
    setCode(defaultCode);
    setOutput(null);
    setStatus("idle");
  }

  return (
    <div className="pyodide-lab">
      {title && <p className="pyodide-lab-title">{title}</p>}
      <textarea
        className="codebox"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={Math.min(16, Math.max(6, defaultCode.split("\n").length + 1))}
        spellCheck={false}
      />
      <div className="pyodide-lab-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={run}
          disabled={status === "loading" || status === "running"}
        >
          {status === "loading" ? "⏳ Memuat Python…" : status === "running" ? "⏳ Menjalankan…" : "▶ Jalankan"}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={reset}>
          Reset kode
        </button>
      </div>
      {hint && <p className="text-small text-muted" style={{ marginTop: "var(--sp-2)" }} dangerouslySetInnerHTML={{ __html: decodeEntities(hint) }} />}
      {output !== null && (
        <pre className={`codebox pyodide-lab-out ${status === "error" ? "pyodide-lab-err" : ""}`}>{output}</pre>
      )}
    </div>
  );
}
