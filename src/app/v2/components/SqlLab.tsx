"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "../lib/icons";
import type { SqlLabSpec } from "../lib/types";
import { loadSqlJs, type SqlJsDb, type SqlJsModule } from "../lib/sqljsLoader";

interface SqlLabProps {
  spec: SqlLabSpec;
  /** kunci localStorage untuk menyimpan teks editor + attempts */
  storageKey: string;
  /** dipanggil saat penilaian pertama kali lolos */
  onPassChange?: (passed: boolean) => void;
}

interface RunResult {
  columns: string[];
  rows: unknown[][];
  truncated: boolean;
}

interface CheckReport {
  passed: boolean;
  lines: string[];
}

/* ---------- sanitasi: hanya query baca, satu statement ---------- */
function sanitize(input: string): { ok: true; sql: string } | { ok: false; error: string } {
  let s = input
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .trim()
    .replace(/;+\s*$/, "");
  if (!s) return { ok: false, error: "Editor masih kosong — tulis query SELECT dulu." };
  if (/;/.test(s)) return { ok: false, error: "Jalankan satu query dalam satu waktu (tanpa titik koma di tengah)." };
  if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|ATTACH|DETACH|PRAGMA|VACUUM|REINDEX|TRUNCATE)\b/i.test(s))
    return { ok: false, error: "Statement modifikasi/DDL tidak diizinkan di lab ini." };
  if (!/^(SELECT|WITH|VALUES|TABLE)\b/i.test(s))
    return { ok: false, error: "Hanya query baca yang diizinkan (diawali SELECT / WITH / VALUES)." };
  return { ok: true, sql: s };
}

/* ---------- perbandingan nilai ---------- */
function numEq(a: unknown, b: unknown, tol: number): boolean {
  const na = typeof a === "number" ? a : typeof a === "string" && a.trim() !== "" ? Number(a) : NaN;
  const nb = typeof b === "number" ? b : typeof b === "string" && b.trim() !== "" ? Number(b) : NaN;
  if (Number.isNaN(na) || Number.isNaN(nb)) return false;
  if (Number.isNaN(na) && Number.isNaN(nb)) return true;
  return Math.abs(na - nb) <= tol;
}

function cellEq(a: unknown, b: unknown, tol: number): boolean {
  if (a === null || b === null) return a === b;
  if (typeof a === "number" || typeof b === "number") return numEq(a, b, tol);
  return String(a) === String(b);
}

/** kunci urut stabil untuk mode toleran-urutan (angka dibulatkan ke 1e-6) */
function rowKey(row: unknown[]): string {
  return JSON.stringify(
    row.map((v) => (typeof v === "number" ? Math.round(v * 1e6) / 1e6 : v === null ? null : String(v)))
  );
}

function fmtCell(v: unknown): string {
  if (v === null) return "NULL";
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : String(Math.round(v * 1e4) / 1e4);
  return String(v);
}

function compareResult(spec: SqlLabSpec, actual: RunResult): CheckReport {
  const tol = spec.floatTol ?? 1e-6;
  const lines: string[] = [];
  if (actual.columns.length !== spec.expectedColumns.length) {
    lines.push(`Jumlah kolom: diharapkan ${spec.expectedColumns.length}, dapat ${actual.columns.length}.`);
  } else {
    spec.expectedColumns.forEach((exp, i) => {
      const got = (actual.columns[i] ?? "").trim();
      if (got.toLowerCase() !== exp.trim().toLowerCase())
        lines.push(`Kolom ke-${i + 1}: diharapkan \`${exp}\`, dapat \`${got || "(kosong)"}\`.`);
    });
  }
  if (actual.truncated) {
    lines.push(`Hasil melebihi batas 500 baris — persempit query (tambah WHERE / agregasi / LIMIT).`);
  } else if (actual.rows.length !== spec.expectedRows.length) {
    lines.push(`Jumlah baris: diharapkan ${spec.expectedRows.length}, dapat ${actual.rows.length}.`);
  } else {
    const orderMatters = spec.orderMatters ?? false;
    const expRows = orderMatters ? spec.expectedRows : [...spec.expectedRows].sort((a, b) => (rowKey(a) < rowKey(b) ? -1 : 1));
    const gotRows = orderMatters ? actual.rows : [...actual.rows].sort((a, b) => (rowKey(a) < rowKey(b) ? -1 : 1));
    let diffs = 0;
    for (let r = 0; r < expRows.length && diffs < 5; r++) {
      const er = expRows[r];
      const gr = gotRows[r] ?? [];
      for (let c = 0; c < er.length; c++) {
        if (!cellEq(er[c], gr[c], tol)) {
          diffs++;
          const col = spec.expectedColumns[c] ?? `kolom ${c + 1}`;
          lines.push(
            `Baris ${r + 1}, \`${col}\`: diharapkan ${fmtCell(er[c])}, dapat ${fmtCell(gr[c] ?? "(hilang)")}.`
          );
          if (diffs >= 5) break;
        }
      }
    }
  }
  return { passed: lines.length === 0, lines };
}

/* ================= SqlLab ================= */
export default function SqlLab({ spec, storageKey, onPassChange }: SqlLabProps) {
  const [dbStatus, setDbStatus] = useState<"loading" | "ready" | "error">("loading");
  const [dbMsg, setDbMsg] = useState("");
  const [sql, setSql] = useState(spec.starter);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [report, setReport] = useState<CheckReport | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [passed, setPassed] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const dbRef = useRef<SqlJsDb | null>(null);
  const passRef = useRef(onPassChange);
  passRef.current = onPassChange;

  // restore editor + attempts
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const s = JSON.parse(raw) as { sql?: string; attempts?: number; passed?: boolean };
        if (typeof s.sql === "string") setSql(s.sql);
        if (typeof s.attempts === "number") setAttempts(s.attempts);
        if (s.passed) {
          setPassed(true);
          passRef.current?.(true);
        }
      }
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // build DB sekali
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = (await loadSqlJs()) as unknown as SqlJsModule;
        if (cancelled) return;
        const db = new mod.Database();
        db.exec(spec.schema);
        for (const stmt of spec.seedData.split(";")) {
          const t = stmt.trim();
          if (t) db.exec(t);
        }
        dbRef.current = db;
        setDbStatus("ready");
      } catch (e) {
        if (!cancelled) {
          setDbStatus("error");
          setDbMsg(e instanceof Error ? e.message : String(e));
        }
      }
    })();
    return () => {
      cancelled = true;
      try {
        dbRef.current?.close();
      } catch {
        /* noop */
      }
      dbRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  function persist(next: { sql: string; attempts: number; passed: boolean }) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* noop */
    }
  }

  function execQuery(userSql: string): RunResult {
    const db = dbRef.current;
    if (!db) throw new Error("Database belum siap.");
    // bungkus LIMIT agar cartesian join tak sengaja meledakkan memori
    const capped = `SELECT * FROM (${userSql}) LIMIT 501`;
    const out = db.exec(capped);
    if (out.length === 0) return { columns: [], rows: [], truncated: false };
    const { columns, values } = out[0];
    return { columns, rows: values, truncated: values.length > 500 };
  }

  function doRun() {
    if (running || dbStatus !== "ready") return;
    const clean = sanitize(sql);
    setRunning(true);
    setReport(null);
    try {
      if (!clean.ok) {
        setRunError(clean.error);
        setResult(null);
      } else {
        const r = execQuery(clean.sql);
        setResult(r);
        setRunError(r.rows.length === 0 ? "Query jalan, tapi hasilnya 0 baris. Cek WHERE / JOIN." : null);
      }
    } catch (e) {
      setResult(null);
      setRunError(`SQLite menolak query: ${e instanceof Error ? e.message : String(e)}`);
    }
    setRunning(false);
  }

  function doCheck() {
    if (running || dbStatus !== "ready") return;
    const clean = sanitize(sql);
    setRunning(true);
    try {
      if (!clean.ok) {
        setRunError(clean.error);
        setResult(null);
        setReport({ passed: false, lines: [clean.error] });
      } else {
        const r = execQuery(clean.sql);
        setResult(r);
        setRunError(null);
        const rep = compareResult(spec, r);
        setReport(rep);
        const nextAttempts = rep.passed ? attempts : attempts + 1;
        setAttempts(nextAttempts);
        if (rep.passed && !passed) {
          setPassed(true);
          passRef.current?.(true);
        }
        persist({ sql, attempts: nextAttempts, passed: passed || rep.passed });
      }
    } catch (e) {
      setResult(null);
      const msg = `SQLite menolak query: ${e instanceof Error ? e.message : String(e)}`;
      setRunError(msg);
      setReport({ passed: false, lines: [msg] });
    }
    setRunning(false);
  }

  function doReset() {
    if (sql !== spec.starter && !window.confirm("Kembalikan query ke awal? Perubahanmu akan hilang.")) return;
    setSql(spec.starter);
    setResult(null);
    setRunError(null);
    setReport(null);
    setSolutionOpen(false);
    persist({ sql: spec.starter, attempts, passed });
  }

  function openSolution() {
    if (attempts < 2) return;
    if (!window.confirm("Lihat solusi? Kamu tetap bisa mencoba sendiri setelahnya.")) return;
    setSolutionOpen(true);
  }

  const solutionUnlocked = attempts >= 2;

  return (
    <div className="sqllab">
      <div className="tabs" role="tablist">
        <button className="tab" role="tab" aria-selected={true}>
          query.sql
        </button>
        <div className="status">
          <span
            className="dot"
            style={{
              background:
                dbStatus === "ready" ? "var(--success)" : dbStatus === "error" ? "var(--error)" : "var(--accent)",
            }}
          ></span>
          {dbStatus === "ready" ? "SQL siap" : dbStatus === "error" ? `Gagal memuat SQL${dbMsg ? ": " + dbMsg : ""}` : "Memuat SQL"}
        </div>
      </div>

      <div className="editor-wrap" style={{ padding: "12px 16px" }}>
        <p style={{ margin: "0 0 8px", fontSize: 13 }}>{spec.task}</p>
        <details className="schema-box">
          <summary>Lihat skema tabel</summary>
          <pre>{spec.schema.trim()}</pre>
        </details>
        <textarea
          className="v2ed-area"
          value={sql}
          onChange={(e) => {
            setSql(e.target.value);
            persist({ sql: e.target.value, attempts, passed });
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              doRun();
            }
          }}
          spellCheck={false}
          aria-label="Editor SQL"
          rows={Math.max(5, sql.split("\n").length + 1)}
          style={{ marginTop: 8 }}
        />
        {solutionOpen && (
          <div style={{ marginTop: 12 }}>
            <h3 className="label" style={{ marginTop: 0 }}>
              Solusi
            </h3>
            <pre className="v2ed-lock" style={{ background: "var(--bg-sunken)", borderRadius: "var(--r-2)", padding: "8px 12px" }}>
              {spec.solution}
            </pre>
          </div>
        )}
      </div>

      <div className="console">
        <div className="tabs sub" role="tablist">
          <button className="tab" role="tab" aria-selected={true}>
            <Icon name="table" />
            Hasil
          </button>
        </div>
        <div className="console-body">
          {runError ? (
            <div className="out-err">{runError}</div>
          ) : result ? (
            <>
              <div className="run-meta">
                <span>{result.rows.length} baris</span>
                <span>·</span>
                <span>{result.columns.length} kolom</span>
                {result.truncated && (
                  <>
                    <span>·</span>
                    <span>dipotong di 500 baris</span>
                  </>
                )}
              </div>
              {result.columns.length > 0 ? (
                <div className="sqlres">
                  <table>
                    <thead>
                      <tr>
                        {result.columns.map((c, i) => (
                          <th key={i}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.slice(0, 500).map((row, i) => (
                        <tr key={i}>
                          {row.map((v, j) => (
                            <td key={j}>{fmtCell(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <span className="run-meta">Tidak ada kolom dikembalikan.</span>
              )}
            </>
          ) : (
            <span className="run-meta">Tekan Jalankan untuk mengeksekusi query. Pertama kali memuat engine SQL agak lama.</span>
          )}
        </div>
      </div>

      {report && (
        <div className={`feedback ${report.passed ? "pass" : "fail"}`} role="status" aria-live="polite">
          <Icon name={report.passed ? "check" : "x"} className="i lead" />
          <div>
            {report.passed ? (
              <div>
                <b>Benar.</b> Hasil query cocok dengan yang diharapkan
                {spec.orderMatters ? " (termasuk urutannya)" : " (urutan baris tidak dinilai)"}.
              </div>
            ) : (
              <div>
                <b>Belum tepat.</b>
                <ul>
                  {report.lines.map((l, i) => (
                    <li key={i} className="no">
                      <Icon name="x" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="actionbar">
        <button
          className="btn ghost"
          onClick={openSolution}
          disabled={!solutionUnlocked || solutionOpen}
          title={solutionUnlocked ? "Lihat solusi" : "Terbuka setelah 2 percobaan"}
          aria-label="Solusi"
        >
          <Icon name="lock" />
          <span className="lbl">Solusi</span>
        </button>
        <span className="spacer attempts">Percobaan {Math.max(1, attempts + (passed ? 0 : 1))}</span>
        <button className="btn ghost icon" onClick={doReset} aria-label="Reset query">
          <Icon name="reset" />
        </button>
        <button className="btn" onClick={doRun} disabled={running || dbStatus === "error"}>
          <Icon name="play" />
          {running ? "Menjalankan…" : "Jalankan"}
          <span className="kbd">Ctrl+Enter</span>
        </button>
        <button className="btn primary" onClick={doCheck} disabled={running || dbStatus === "error"}>
          Periksa
        </button>
      </div>
    </div>
  );
}
