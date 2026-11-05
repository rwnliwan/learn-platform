"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "../lib/icons";
import { ensurePyodide, runChecks, RUN_TIMEOUT_MS } from "../lib/pyodideRunner";
import { loadSqlJs, type SqlJsDb, type SqlJsModule } from "../lib/sqljsLoader";
import {
  VERDICT_LABEL,
  cardGate,
  datasetsFor,
  getDataset,
  loadArchive,
  newCardId,
  saveArchive,
  summarizeStdout,
  type ExperimentCard,
  type LabDataset,
  type LabLanguage,
  type RunRecord,
  type Verdict,
} from "../lib/labbebas";

type EngineState = "idle" | "loading" | "ready" | "error";

interface SqlOutcome {
  columns: string[];
  rows: unknown[][];
  totalRows: number;
  truncated: boolean;
}

const PY_ENV = `Pyodide v0.26.4 (CDN) · pandas · timeout ${RUN_TIMEOUT_MS / 1000} dtk`;
const SQL_ENV = "sql.js 1.x (SQLite di browser)";

/* ---------- sanitasi longgar sandbox: blokir yang berbahaya saja ---------- */
function sanitizeSql(input: string): { ok: true; sql: string } | { ok: false; error: string } {
  const s = input
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .trim();
  if (!s) return { ok: false, error: "Editor masih kosong — tulis query dulu." };
  if (/\b(ATTACH|DETACH|PRAGMA|VACUUM|REINDEX)\b/i.test(s))
    return { ok: false, error: "Statement itu tidak diizinkan di sandbox ini." };
  return { ok: true, sql: s };
}

function fmtCell(v: unknown): string {
  if (v === null) return "NULL";
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : String(Math.round(v * 1e4) / 1e4);
  return String(v);
}

const EMPTY_CARD = {
  question: "",
  hypothesis: "",
  falsification: "",
  code: "",
  verdict: null as Verdict | null,
};

export default function LabBebasClient() {
  const [language, setLanguage] = useState<LabLanguage>("python");
  const [datasetId, setDatasetId] = useState<string>("py-imbal");
  const [question, setQuestion] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [falsification, setFalsification] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [archive, setArchive] = useState<ExperimentCard[]>([]);
  const [archiveLoaded, setArchiveLoaded] = useState(false);

  const [pyState, setPyState] = useState<EngineState>("idle");
  const [pyMsg, setPyMsg] = useState("");
  const [sqlState, setSqlState] = useState<EngineState>("idle");
  const [sqlMsg, setSqlMsg] = useState("");
  const dbRef = useRef<SqlJsDb | null>(null);
  const seededFor = useRef<string | null>(null);

  const [running, setRunning] = useState(false);
  const [pyOut, setPyOut] = useState<{ stdout: string; error: string | null } | null>(null);
  const [pyTimedOut, setPyTimedOut] = useState(false);
  const [pyRunError, setPyRunError] = useState<string | null>(null);
  const [sqlOut, setSqlOut] = useState<SqlOutcome | null>(null);
  const [sqlErr, setSqlErr] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [savedTick, setSavedTick] = useState(0);

  const dataset = useMemo(() => getDataset(datasetId), [datasetId]);
  const langDatasets = useMemo(() => datasetsFor(language), [language]);

  /* ---------- arsip ---------- */
  useEffect(() => {
    setArchive(loadArchive());
    setArchiveLoaded(true);
  }, []);

  /* ---------- engine Python: lazy — dimuat saat pertama klik Jalankan (runPython) ---------- */

  /* ---------- engine SQL: lazy saat bahasa SQL dipilih ---------- */
  const ensureSqlDb = useCallback(
    async (ds: LabDataset): Promise<SqlJsDb> => {
      if (dbRef.current && seededFor.current === ds.id) return dbRef.current;
      setSqlState("loading");
      try {
        const init = (await loadSqlJs()) as unknown as SqlJsModule;
        const db = new init.Database();
        db.exec(ds.schema ?? "");
        db.exec(ds.seed ?? "");
        if (dbRef.current) {
          try {
            dbRef.current.close();
          } catch {
            /* noop */
          }
        }
        dbRef.current = db;
        seededFor.current = ds.id;
        setSqlState("ready");
        setSqlMsg("");
        return db;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setSqlState("error");
        setSqlMsg(msg);
        throw e;
      }
    },
    []
  );

  useEffect(() => {
    const ds = getDataset(datasetId);
    if (ds && ds.language === "sql") {
      ensureSqlDb(ds).catch(() => {
        /* status error sudah di-set */
      });
    }
  }, [datasetId, ensureSqlDb]);

  /* ---------- starter otomatis untuk kartu baru ---------- */
  const isStarterLike = useCallback((c: string) => {
    if (!c.trim()) return true;
    return getDataset(datasetId)?.starter.trim() === c.trim() || c.trim().length === 0;
  }, [datasetId]);

  useEffect(() => {
    // Hanya auto-isi untuk kartu baru (belum pernah di-run/diarsipkan).
    if (editingId) return;
    if (isStarterLike(code)) {
      const ds = getDataset(datasetId);
      if (ds) setCode(ds.starter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetId, language]);

  const switchLanguage = (lang: LabLanguage) => {
    setLanguage(lang);
    const first = datasetsFor(lang)[0];
    if (first) setDatasetId(first.id);
    setPyOut(null);
    setSqlOut(null);
    setSqlErr(null);
    setPyTimedOut(false);
    setPyRunError(null);
    setVerdict(null);
  };

  const gate = cardGate({ question, hypothesis, falsification });
  const engineReady =
    language === "python" ? pyState === "ready" : sqlState === "ready";
  const engineBusy = language === "python" ? pyState === "loading" : sqlState === "loading";
  const engineFailed = language === "python" ? pyState === "error" : sqlState === "error";
  const canRun = gate.ok && !!dataset && (engineReady || (language === "python" && pyState === "idle")) && !running && code.trim().length > 0;

  const runGateHint = useMemo(() => {
    const parts: string[] = [];
    if (!gate.ok) parts.push(`isi dulu: ${gate.missing.join(", ")}`);
    if (!code.trim()) parts.push("tulis kode di editor");
    if (engineBusy) parts.push("tunggu engine selesai dimuat");
    if (engineFailed) parts.push("engine bermasalah — muat ulang halaman");
    return parts.join(" · ");
  }, [gate, code, engineBusy, engineReady]);

  /* ---------- run Python ---------- */
  const runPython = useCallback(async () => {
    setRunning(true);
    setPyOut(null);
    setPyTimedOut(false);
    setPyRunError(null);
    setVerdict(null);
    if (pyState !== "ready") {
      setPyState("loading");
      const init = await ensurePyodide(["pandas"]);
      if (!init.ok) {
        setPyState("error");
        setPyMsg(init.msg ?? "");
        setPyRunError(init.msg ?? "Gagal memuat Python.");
        setRunning(false);
        return;
      }
      setPyState("ready");
    }
    try {
      const out = await runChecks(code, [], ["pandas"]);
      if (out.timedOut) {
        setPyTimedOut(true);
      } else if (out.runError) {
        setPyRunError(out.runError);
      } else {
        setPyOut({ stdout: out.stdout, error: out.error });
      }
    } catch (e) {
      setPyRunError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }, [code, pyState]);

  /* ---------- run SQL ---------- */
  const runSql = useCallback(async () => {
    const ds = getDataset(datasetId);
    if (!ds) return;
    setRunning(true);
    setSqlOut(null);
    setSqlErr(null);
    setVerdict(null);
    try {
      const db = await ensureSqlDb(ds);
      const s = sanitizeSql(code);
      if (!s.ok) {
        setSqlErr(s.error);
        return;
      }
      const res = db.exec(s.sql);
      const withCols = res.filter((r) => r.columns && r.columns.length > 0);
      const last = withCols[withCols.length - 1];
      if (!last) {
        setSqlOut({ columns: [], rows: [], totalRows: 0, truncated: false });
      } else {
        const LIMIT = 100;
        setSqlOut({
          columns: last.columns,
          rows: last.values.slice(0, LIMIT),
          totalRows: last.values.length,
          truncated: last.values.length > LIMIT,
        });
      }
    } catch (e) {
      setSqlErr(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }, [code, datasetId, ensureSqlDb]);

  const hasRun = language === "python" ? !!(pyOut || pyTimedOut || pyRunError) : !!(sqlOut || sqlErr);

  const buildRecord = useCallback((): RunRecord => {
    const at = new Date().toISOString();
    if (language === "python") {
      return {
        at,
        timedOut: pyTimedOut,
        runError: pyRunError ?? undefined,
        error: pyOut?.error ?? null,
        stdoutSummary: summarizeStdout(pyOut?.stdout ?? ""),
        envNote: PY_ENV,
      };
    }
    return {
      at,
      timedOut: false,
      runError: sqlErr ?? undefined,
      error: null,
      stdoutSummary: sqlOut
        ? summarizeStdout(
            `${sqlOut.columns.join(" | ")}\n${sqlOut.rows.map((r) => r.map(fmtCell).join(" | ")).join("\n")}` +
              (sqlOut.truncated ? `\n…(${sqlOut.totalRows} baris, tampil ${sqlOut.rows.length})` : "")
          )
        : "",
      envNote: SQL_ENV,
    };
  }, [language, pyOut, pyTimedOut, pyRunError, sqlOut, sqlErr]);

  const saveCard = () => {
    if (!verdict || !dataset) return;
    const rec = buildRecord();
    const now = new Date().toISOString();
    const next = [...archive];
    if (editingId) {
      const i = next.findIndex((c) => c.id === editingId);
      if (i >= 0) {
        next[i] = {
          ...next[i],
          question,
          hypothesis,
          falsification,
          code,
          language,
          datasetId,
          lastRun: rec,
          verdict,
          updatedAt: now,
        };
      }
    } else {
      next.unshift({
        id: newCardId(),
        createdAt: now,
        updatedAt: now,
        language,
        datasetId,
        question,
        hypothesis,
        falsification,
        code,
        lastRun: rec,
        verdict,
      });
    }
    setArchive(next);
    saveArchive(next);
    setSavedTick((t) => t + 1);
  };

  const openCard = (c: ExperimentCard) => {
    setEditingId(c.id);
    setLanguage(c.language);
    setDatasetId(c.datasetId);
    setQuestion(c.question);
    setHypothesis(c.hypothesis);
    setFalsification(c.falsification);
    setCode(c.code);
    setVerdict(c.verdict);
    setPyOut(null);
    setSqlOut(null);
    setSqlErr(null);
    setPyTimedOut(false);
    setPyRunError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const newExperiment = () => {
    setEditingId(null);
    setQuestion(EMPTY_CARD.question);
    setHypothesis(EMPTY_CARD.hypothesis);
    setFalsification(EMPTY_CARD.falsification);
    setVerdict(EMPTY_CARD.verdict);
    setPyOut(null);
    setSqlOut(null);
    setSqlErr(null);
    setPyTimedOut(false);
    setPyRunError(null);
    const ds = getDataset(datasetId);
    setCode(ds ? ds.starter : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCard = (id: string) => {
    const next = archive.filter((c) => c.id !== id);
    setArchive(next);
    saveArchive(next);
    if (editingId === id) newExperiment();
  };

  const resetSqlData = async () => {
    const ds = getDataset(datasetId);
    if (ds && ds.language === "sql") {
      seededFor.current = null;
      await ensureSqlDb(ds).catch(() => {});
    }
  };

  return (
    <div className="lb-wrap">
      {/* gerbang eksploratif */}
      <div className="lb-banner" role="note">
        <Icon name="flask" />
        <div>
          <strong>Lab Bebas — ruang eksperimen eksploratif.</strong>
          <span>
            Semua yang dihasilkan di sini adalah hipotesis kerja, <em>bukan kesimpulan final</em>.
            Engine dan dataset sama persis dengan yang dipakai Misi — tidak ada data baru yang dikarang.
          </span>
        </div>
      </div>

      {/* bahasa */}
      <div className="lb-tabs" role="tablist" aria-label="Bahasa">
        {(["python", "sql"] as LabLanguage[]).map((l) => (
          <button
            key={l}
            role="tab"
            aria-selected={language === l}
            className={language === l ? "lb-tab on" : "lb-tab"}
            onClick={() => switchLanguage(l)}
          >
            {l === "python" ? "Python" : "SQL"}
          </button>
        ))}
        <span className="lb-engine">
          {language === "python"
            ? pyState === "ready"
              ? "Engine siap · Pyodide + pandas"
              : pyState === "loading"
                ? "Memuat Pyodide…"
                : pyState === "error"
                  ? `Engine gagal: ${pyMsg}`
                  : "Engine belum dimuat"
            : sqlState === "ready"
              ? "Engine siap · SQLite (sql.js)"
              : sqlState === "loading"
                ? "Memuat sql.js…"
                : sqlState === "error"
                  ? `Engine gagal: ${sqlMsg}`
                  : "Engine belum dimuat"}
        </span>
      </div>

      {/* dataset */}
      <div className="lb-sec">
        <h2>1 · Pilih dataset</h2>
        <div className="lb-dsgrid">
          {langDatasets.map((d) => (
            <button
              key={d.id}
              className={datasetId === d.id ? "lb-ds on" : "lb-ds"}
              onClick={() => setDatasetId(d.id)}
              aria-pressed={datasetId === d.id}
            >
              <strong>{d.label}</strong>
              <span className="lb-ds-src">{d.source}</span>
              <span className="lb-ds-det">{d.detail}</span>
            </button>
          ))}
        </div>
        {language === "sql" && (
          <button className="lb-link" onClick={resetSqlData}>
            Reset data ke kondisi awal
          </button>
        )}
      </div>

      {/* experiment card */}
      <div className="lb-sec">
        <h2>
          2 · Experiment card <span className="lb-must">wajib sebelum run</span>
        </h2>
        <div className="lb-grid2">
          <label className="lb-field">
            <span>Pertanyaan</span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              placeholder="Pertanyaan apa yang ingin dijawab eksperimen ini?"
            />
          </label>
          <label className="lb-field">
            <span>Hipotesis</span>
            <textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              rows={2}
              placeholder="Dugaan jawabanmu — spesifik dan bisa salah."
            />
          </label>
        </div>
        <label className="lb-field">
          <span>Kondisi falsifikasi</span>
          <textarea
            value={falsification}
            onChange={(e) => setFalsification(e.target.value)}
            rows={2}
            placeholder="Bukti apa yang akan MEMBANTAH hipotesismu? Tulis sebelum menjalankan kode."
          />
        </label>
        {!gate.ok && (
          <p className="lb-hint">
            Tombol run terkunci sampai terisi: <strong>{gate.missing.join(", ")}</strong>.
          </p>
        )}
      </div>

      {/* editor + run */}
      <div className="lb-sec">
        <h2>3 · Tulis & jalankan</h2>
        <textarea
          className="lb-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
          spellCheck={false}
          aria-label={language === "python" ? "Editor Python" : "Editor SQL"}
        />
        <div className="lb-runrow">
          <button
            className="lb-run"
            disabled={!canRun}
            onClick={() => (language === "python" ? runPython() : runSql())}
          >
            <Icon name="play" />
            {running ? "Menjalankan…" : "Jalankan"}
          </button>
          {!canRun && runGateHint && <span className="lb-hint">{runGateHint}</span>}
        </div>

        {/* output python */}
        {language === "python" && (pyOut || pyTimedOut || pyRunError) && (
          <div className="lb-out">
            {pyTimedOut && (
              <p className="lb-err">Waktu habis ({RUN_TIMEOUT_MS / 1000} dtk) — worker di-restart otomatis. Sederhanakan kodemu.</p>
            )}
            {pyRunError && <p className="lb-err">{pyRunError}</p>}
            {pyOut?.error && <p className="lb-err">{pyOut.error}</p>}
            {pyOut && (
              <pre className="lb-stdout">{pyOut.stdout || "(tidak ada output)"}</pre>
            )}
          </div>
        )}

        {/* output sql */}
        {language === "sql" && (sqlOut || sqlErr) && (
          <div className="lb-out">
            {sqlErr && <p className="lb-err">{sqlErr}</p>}
            {sqlOut && (
              <>
                {sqlOut.columns.length === 0 ? (
                  <p className="lb-hint">(statement berhasil, tidak ada result set untuk ditampilkan)</p>
                ) : (
                  <>
                    <p className="lb-hint">
                      {sqlOut.totalRows} baris{sqlOut.truncated ? ` — tampil ${sqlOut.rows.length} pertama` : ""}
                    </p>
                    <div className="lb-tablewrap">
                      <table className="lb-table">
                        <thead>
                          <tr>
                            {sqlOut.columns.map((c, i) => (
                              <th key={i}>{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sqlOut.rows.map((r, i) => (
                            <tr key={i}>
                              {r.map((v, j) => (
                                <td key={j}>{fmtCell(v)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* verdict + simpan */}
        {hasRun && (
          <div className="lb-verdict">
            <span className="lb-vlabel">Verdict eksperimen ini</span>
            <div className="lb-vopts">
              {(Object.keys(VERDICT_LABEL) as Verdict[]).map((v) => (
                <button
                  key={v}
                  className={verdict === v ? "lb-vopt on" : "lb-vopt"}
                  onClick={() => setVerdict(v)}
                  aria-pressed={verdict === v}
                >
                  {VERDICT_LABEL[v]}
                </button>
              ))}
            </div>
            <button className="lb-save" disabled={!verdict} onClick={saveCard}>
              {editingId ? "Perbarui eksperimen" : "Simpan eksperimen"}
            </button>
            {savedTick > 0 && <span className="lb-hint">tersimpan ✓</span>}
          </div>
        )}
      </div>

      {/* arsip */}
      <div className="lb-sec">
        <h2>4 · Arsip eksperimen</h2>
        {!archiveLoaded ? (
          <p className="lb-hint">Memuat arsip…</p>
        ) : archive.length === 0 ? (
          <p className="lb-hint">
            Belum ada eksperimen tersimpan. Eksperimen yang kamu simpan (dengan verdict) akan muncul di sini —
            bisa dibuka kembali, dijalankan ulang, atau dihapus.
          </p>
        ) : (
          <div className="lb-arch">
            {archive.map((c) => {
              const ds = getDataset(c.datasetId);
              return (
                <div key={c.id} className="lb-card">
                  <div className="lb-card-h">
                    <strong>{c.question || "(tanpa pertanyaan)"}</strong>
                    <span className="lb-exp">EKSPERIMENTAL</span>
                  </div>
                  <p className="lb-card-meta">
                    {c.language === "python" ? "Python" : "SQL"} · {ds?.label ?? c.datasetId} ·
                    verdict: {c.verdict ? VERDICT_LABEL[c.verdict] : "—"} ·
                    {new Date(c.updatedAt).toLocaleString("id-ID")}
                  </p>
                  <p className="lb-card-hyp">Hipotesis: {c.hypothesis}</p>
                  <div className="lb-card-actions">
                    <button className="lb-link" onClick={() => openCard(c)}>
                      Buka
                    </button>
                    <button
                      className="lb-link lb-danger"
                      onClick={() => {
                        if (window.confirm("Hapus eksperimen ini dari arsip?")) deleteCard(c.id);
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {editingId && (
          <button className="lb-link" onClick={newExperiment}>
            + Eksperimen baru
          </button>
        )}
      </div>
    </div>
  );
}
