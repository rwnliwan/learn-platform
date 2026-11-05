"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getPfProject,
  PF_SECTIONS,
  PF_SHARE_VERSION,
  PF_REDACT_KEY,
  parseShareHidden,
  buildShareQuery,
  formatCheckValue,
  type PfMode,
  type PfProject,
  type PfStep,
} from "../../lib/portfolio";

/** Render `kode` inline markup menjadi <code>; teks lain apa adanya. */
function renderInline(t: string) {
  const parts = t.split("`");
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <code key={i} className="pf-code">
        {p}
      </code>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function stepRef(i: number, s: PfStep) {
  return `Langkah ${i + 1} · ${s.eyebrow || s.title}`;
}

function Source({ i, s }: { i: number; s: PfStep }) {
  return <div className="pf-src">Sumber: {stepRef(i, s)}</div>;
}

/* ── Bagian Executive Scan ─────────────────────────────────────────── */

function SecMasalah({ p }: { p: PfProject }) {
  const first = p.steps[0];
  return (
    <section className="pf-sec" data-sec="ex-masalah">
      <blockquote className="pf-quote">{renderInline(p.tagline || p.title)}</blockquote>
      <div className="pf-src">Sumber: deskripsi proyek (reg-proyek.ts)</div>
      {first && first.prose.slice(0, 2).map((par, k) => (
        <p key={k} className="pf-p">{renderInline(par)}</p>
      ))}
      {first && <Source i={0} s={first} />}
      <dl className="pf-meta">
        <div><dt>Peran</dt><dd>{p.role || "—"}</dd></div>
        <div><dt>Klien / konteks</dt><dd>{p.client || "—"}</dd></div>
        <div><dt>Deliverable</dt><dd>{p.deliverable || "—"}</dd></div>
        <div><dt>Estimasi</dt><dd>{p.estMinutes ? `±${p.estMinutes} menit` : "—"}</dd></div>
      </dl>
    </section>
  );
}

function SecPendekatan({ p }: { p: PfProject }) {
  return (
    <section className="pf-sec" data-sec="ex-pendekatan">
      <div className="pf-chips">
        {p.skills.map((s) => (
          <span key={s} className="pf-chip">{s}</span>
        ))}
      </div>
      <div className="pf-src">Sumber: daftar skill proyek (reg-proyek.ts)</div>
      <ol className="pf-steps">
        {p.steps.map((s, i) => (
          <li key={s.id || i}>
            <span className="pf-eyebrow">{s.eyebrow}</span>
            <span className="pf-step-t">{renderInline(s.title)}</span>
          </li>
        ))}
      </ol>
      <div className="pf-src">Sumber: urutan langkah konten proyek ({p.steps.length} langkah)</div>
    </section>
  );
}

function allChecks(p: PfProject) {
  const out: { i: number; s: PfStep; label: string; value: unknown; tol: number | null; msg: string | null }[] = [];
  p.steps.forEach((s, i) => {
    for (const c of s.checks) out.push({ i, s, label: c.label, value: c.value, tol: c.tol, msg: c.msg });
  });
  return out;
}

function allExpected(p: PfProject) {
  const out: { i: number; s: PfStep; expected: string }[] = [];
  p.steps.forEach((s, i) => {
    if (s.expected) out.push({ i, s, expected: s.expected });
  });
  return out;
}

function SecHasil({ p }: { p: PfProject }) {
  const checks = allChecks(p);
  return (
    <section className="pf-sec" data-sec="ex-hasil">
      {checks.length === 0 ? (
        <p className="pf-empty">Tidak ada angka kunci terekstrak dari konten proyek ini.</p>
      ) : (
        <ul className="pf-gt">
          {checks.map((c, k) => (
            <li key={k}>
              <strong>{renderInline(c.label)}</strong>
              {c.msg && <span className="pf-gt-msg"> — {renderInline(c.msg)}</span>}
              <Source i={c.i} s={c.s} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function riskNotes(p: PfProject) {
  const out: { i: number; s: PfStep }[] = [];
  p.steps.forEach((s, i) => {
    if (s.note && (s.note.type === "risk" || s.note.type === "pitfall")) out.push({ i, s });
  });
  return out;
}

function designNotes(p: PfProject) {
  const out: { i: number; s: PfStep }[] = [];
  p.steps.forEach((s, i) => {
    if (s.note && s.note.type !== "risk" && s.note.type !== "pitfall") out.push({ i, s });
  });
  return out;
}

function SecKeterbatasan({ p }: { p: PfProject }) {
  const notes = riskNotes(p);
  return (
    <section className="pf-sec" data-sec="ex-keterbatasan">
      {notes.length === 0 ? (
        <p className="pf-empty">Tidak ada catatan keterbatasan eksplisit di konten proyek ini.</p>
      ) : (
        notes.map(({ i, s }) => (
          <div key={s.id || i} className="pf-note pf-note-risk">
            <strong>{renderInline(s.note!.title)}</strong>
            <p>{renderInline(s.note!.body)}</p>
            <Source i={i} s={s} />
          </div>
        ))
      )}
    </section>
  );
}

/* ── Bagian Technical Deep Dive ────────────────────────────────────── */

function SecLangkah({ p }: { p: PfProject }) {
  return (
    <section className="pf-sec" data-sec="dd-langkah">
      <ol className="pf-dd">
        {p.steps.map((s, i) => (
          <li key={s.id || i}>
            <div className="pf-eyebrow">{s.eyebrow}</div>
            <div className="pf-step-t">{renderInline(s.title)}</div>
            {s.prose[0] && <p className="pf-p">{renderInline(s.prose[0])}</p>}
            {s.tasks.length > 0 && (
              <ul className="pf-tasks">
                {s.tasks.map((t, k) => (
                  <li key={k}>{renderInline(t)}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function SecDesain({ p }: { p: PfProject }) {
  const notes = designNotes(p);
  return (
    <section className="pf-sec" data-sec="dd-desain">
      {notes.length === 0 ? (
        <p className="pf-empty">Tidak ada catatan keputusan eksplisit di konten proyek ini.</p>
      ) : (
        notes.map(({ i, s }) => (
          <div key={s.id || i} className="pf-note">
            <strong>{renderInline(s.note!.title)}</strong>
            <p>{renderInline(s.note!.body)}</p>
            <Source i={i} s={s} />
          </div>
        ))
      )}
    </section>
  );
}

function SecGroundTruth({ p }: { p: PfProject }) {
  const checks = allChecks(p);
  const expected = allExpected(p);
  return (
    <section className="pf-sec" data-sec="dd-groundtruth">
      {checks.length === 0 && expected.length === 0 && (
        <p className="pf-empty">Tidak ada expected value terekstrak dari konten proyek ini.</p>
      )}
      {checks.length > 0 && (
        <table className="pf-table">
          <thead>
            <tr>
              <th>Check</th>
              <th>Expected</th>
              <th>Toleransi</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((c, k) => (
              <tr key={k}>
                <td>{renderInline(c.label)}</td>
                <td className="pf-num">{formatCheckValue(c.value)}</td>
                <td className="pf-num">{c.tol === null ? "—" : String(c.tol)}</td>
                <td>{c.msg ? renderInline(c.msg) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {expected.map((e, k) => (
        <div key={k} className="pf-expected">
          <code>{renderInline(e.expected)}</code>
          <Source i={e.i} s={e.s} />
        </div>
      ))}
      <div className="pf-src">Sumber: checks lab &amp; field expected konten proyek</div>
    </section>
  );
}

function SecImpostor({ p }: { p: PfProject }) {
  const hits: { i: number; s: PfStep }[] = [];
  p.steps.forEach((s, i) => {
    if (s.impostor) hits.push({ i, s });
  });
  return (
    <section className="pf-sec" data-sec="dd-impostor">
      {hits.length === 0 ? (
        <p className="pf-empty">Tidak ada langkah audit impostor eksplisit di konten proyek ini.</p>
      ) : (
        hits.map(({ i, s }) => (
          <div key={s.id || i} className="pf-note pf-note-imp">
            <div className="pf-eyebrow">{s.eyebrow}</div>
            <strong>{renderInline(s.title)}</strong>
            {s.prose.slice(0, 2).map((par, k) => (
              <p key={k}>{renderInline(par)}</p>
            ))}
            {s.note && (
              <p className="pf-p"><strong>{renderInline(s.note.title)}:</strong> {renderInline(s.note.body)}</p>
            )}
            <Source i={i} s={s} />
          </div>
        ))
      )}
      <div className="pf-src">
        Impostor Protocol: klaim yang disuntikkan AI ke dalam paket audit — dilatih untuk dikenali, bukan dipercaya.
      </div>
    </section>
  );
}

const SEC_BODY: Record<string, (p: PfProject) => React.ReactNode> = {
  "ex-masalah": (p) => <SecMasalah p={p} />,
  "ex-pendekatan": (p) => <SecPendekatan p={p} />,
  "ex-hasil": (p) => <SecHasil p={p} />,
  "ex-keterbatasan": (p) => <SecKeterbatasan p={p} />,
  "dd-langkah": (p) => <SecLangkah p={p} />,
  "dd-desain": (p) => <SecDesain p={p} />,
  "dd-groundtruth": (p) => <SecGroundTruth p={p} />,
  "dd-impostor": (p) => <SecImpostor p={p} />,
};

/* ── Komponen utama ────────────────────────────────────────────────── */

export default function PortfolioClient({ slug }: { slug: string }) {
  const params = useSearchParams();
  const project = getPfProject(slug);
  const shareMode = params.has("v");
  const shareHidden = useMemo(() => parseShareHidden(params.toString()), [params]);

  const [mode, setMode] = useState<PfMode>("executive");
  // Redaksi mode edit. localStorage HANYA dibaca di useEffect (pelajaran Gelombang J).
  const [hidden, setHidden] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (shareMode) return;
    try {
      const raw = localStorage.getItem(PF_REDACT_KEY(slug));
      if (raw) setHidden(parseShareHidden(`?hide=${raw}`));
    } catch {
      /* abaikan */
    }
  }, [slug, shareMode]);

  const effectiveHidden = shareMode ? shareHidden : hidden;

  if (!project) {
    return <p className="pf-empty">Proyek tidak ditemukan.</p>;
  }

  const toggle = (id: string) => {
    setHidden((h) => {
      const next = h.includes(id) ? h.filter((x) => x !== id) : [...h, id];
      try {
        localStorage.setItem(PF_REDACT_KEY(slug), next.join(","));
      } catch {
        /* abaikan */
      }
      return next;
    });
  };

  const copyShare = async () => {
    const url = `${window.location.origin}/v2/portofolio/${slug}${buildShareQuery(hidden)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const visibleSections = PF_SECTIONS.filter(
    (s) => s.mode === mode && !effectiveHidden.includes(s.id),
  );

  return (
    <div className="pf-wrap">
      <div className="pf-crumb pf-no-print">
        <Link href="/v2/portofolio">← Semua proyek</Link>
      </div>

      <header className="pf-head">
        <span className="pf-track">{project.track}</span>
        <h2 className="pf-title">{project.title}</h2>
        <p className="pf-tagline">{renderInline(project.tagline)}</p>
      </header>

      {shareMode && (
        <div className="pf-sharebanner">
          Tautan bagikan · skema v{PF_SHARE_VERSION}
          {shareHidden.length > 0 && ` · ${shareHidden.length} bagian disembunyikan pemilik`}
          {" "}— tampilan bersih, tanpa kontrol edit.
        </div>
      )}

      <div className="pf-tabs pf-no-print" role="tablist" aria-label="Mode tampilan">
        <button
          role="tab"
          aria-selected={mode === "executive"}
          className={mode === "executive" ? "on" : ""}
          onClick={() => setMode("executive")}
        >
          Executive scan
        </button>
        <button
          role="tab"
          aria-selected={mode === "deepdive"}
          className={mode === "deepdive" ? "on" : ""}
          onClick={() => setMode("deepdive")}
        >
          Technical deep dive
        </button>
      </div>

      {!shareMode && (
        <div className="pf-controls pf-no-print">
          <div className="pf-redact">
            <span className="pf-redact-label">Redaksi — sembunyikan bagian:</span>
            {PF_SECTIONS.filter((s) => s.mode === mode).map((s) => (
              <label key={s.id} className="pf-toggle">
                <input
                  type="checkbox"
                  checked={hidden.includes(s.id)}
                  onChange={() => toggle(s.id)}
                />
                {s.title}
              </label>
            ))}
          </div>
          <div className="pf-actions">
            <button className="pf-btn" onClick={copyShare}>
              {copied ? "Tautan tersalin ✓" : "Salin tautan bagikan"}
            </button>
            <button className="pf-btn" onClick={() => window.print()}>
              Cetak / PDF
            </button>
          </div>
          <p className="pf-hint">
            Bagian yang disembunyikan tidak ikut ke tautan bagikan maupun hasil cetak — tidak dimuat sama sekali.
          </p>
        </div>
      )}

      {shareMode && (
        <div className="pf-actions pf-no-print">
          <button className="pf-btn" onClick={() => window.print()}>
            Cetak / PDF
          </button>
        </div>
      )}

      <div className="pf-body">
        {visibleSections.map((s) => (
          <div key={s.id} className="pf-block">
            <h3 className="pf-sec-t">
              {s.title}
              <span className="pf-sec-d">{s.desc}</span>
            </h3>
            {SEC_BODY[s.id](project)}
          </div>
        ))}
      </div>

      <footer className="pf-foot">
        Semua isi ditarik dari konten proyek di Learn v2 — tidak ada narasi yang ditulis ulang.
        Angka ground truth = expected value dari checks lab/kuis proyek.
      </footer>
    </div>
  );
}
