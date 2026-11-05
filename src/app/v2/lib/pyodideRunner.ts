// Client-side Pyodide runner: one shared Web Worker, 10s timeout enforced by
// terminate + respawn (DESIGN.md §7.2, §11 — no SharedArrayBuffer needed).
"use client";
import type { V2Check } from "./types";

export interface CheckResult {
  task: string;
  passed: boolean;
  detail: string;
}

export interface RunOutcome {
  stdout: string;
  error: string | null;
  checks: CheckResult[];
  timedOut: boolean;
  runError?: string;
}

export const RUN_TIMEOUT_MS = 10000;

let worker: Worker | null = null;
let seq = 0;

interface Pending {
  resolve: (o: RunOutcome) => void;
  timer: ReturnType<typeof setTimeout>;
}
const pending = new Map<number, Pending>();

function spawnWorker(): Worker {
  const w = new Worker(new URL("./pyodide.worker.ts", import.meta.url));
  w.onmessage = (e: MessageEvent) => {
    const msg = e.data as { id: number; type: string; [k: string]: any };
    const p = pending.get(msg.id);
    if (!p) return;
    if (msg.type === "ready" || msg.type === "load-error") {
      // handled by preload listener separately
      return;
    }
    pending.delete(msg.id);
    clearTimeout(p.timer);
    if (msg.type === "run-ok") {
      p.resolve({
        stdout: msg.stdout ?? "",
        error: msg.error ?? null,
        checks: msg.checks ?? [],
        timedOut: false,
      });
    } else {
      p.resolve({ stdout: "", error: null, checks: [], timedOut: false, runError: msg.message ?? "Gagal menjalankan kode." });
    }
  };
  w.onerror = () => {
    // fail all pending with run error
    for (const [id, p] of pending) {
      clearTimeout(p.timer);
      p.resolve({ stdout: "", error: null, checks: [], timedOut: false, runError: "Worker Python bermasalah." });
      pending.delete(id);
    }
  };
  return w;
}

function getWorker(): Worker {
  if (!worker) worker = spawnWorker();
  return worker;
}

/** Warm up Pyodide in background. Calls onStatus with loading/ready/error. */
export function preloadPyodide(
  onStatus: (s: "loading" | "ready" | "error", msg?: string) => void,
  requires: string[] = []
): void {
  if (typeof window === "undefined") return;
  onStatus("loading");
  const w = getWorker();
  const id = ++seq;
  const handler = (e: MessageEvent) => {
    const msg = e.data as { id: number; type: string; message?: string };
    if (msg.id !== id) return;
    w.removeEventListener("message", handler);
    if (msg.type === "ready") onStatus("ready");
    else onStatus("error", msg.message);
  };
  w.addEventListener("message", handler);
  w.postMessage({ id, type: "init", requires });
}

/** Lazy init Pyodide (tanpa timeout): dipakai klik pertama Jalankan. Init
 *  di luar timer runChecks supaya unduhan Pyodide tidak memakan jatah 10 dtk
 *  eksekusi. Aman dipanggil berulang: worker men-cache paket per nama. */
export function ensurePyodide(
  requires: string[] = []
): Promise<{ ok: boolean; msg?: string }> {
  if (typeof window === "undefined") return Promise.resolve({ ok: false, msg: "SSR" });
  const w = getWorker();
  const id = ++seq;
  return new Promise((resolve) => {
    const handler = (e: MessageEvent) => {
      const msg = e.data as { id: number; type: string; message?: string };
      if (msg.id !== id) return;
      w.removeEventListener("message", handler);
      if (msg.type === "ready") resolve({ ok: true });
      else resolve({ ok: false, msg: msg.message });
    };
    w.addEventListener("message", handler);
    w.postMessage({ id, type: "init", requires });
  });
}

export async function runChecks(code: string, checks: V2Check[], requires: string[] = []): Promise<RunOutcome> {
  const init = await ensurePyodide(requires);
  if (!init.ok) {
    return { stdout: "", error: null, checks: [], timedOut: false, runError: init.msg ?? "Gagal memuat Python." };
  }
  return new Promise((resolve) => {
    const w = getWorker();
    const id = ++seq;
    const timer = setTimeout(() => {
      // Timeout: terminate the worker and respawn fresh next time (§7.2).
      try {
        w.terminate();
      } catch {
        /* noop */
      }
      if (worker === w) worker = null;
      pending.delete(id);
      resolve({ stdout: "", error: null, checks: [], timedOut: true });
    }, RUN_TIMEOUT_MS);
    pending.set(id, { resolve, timer });
    w.postMessage({ id, type: "run", code, checks: JSON.stringify(checks), requires });
  });
}
