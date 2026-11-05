"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "../lib/icons";
import { getLocalDone } from "../lib/progress";
import {
  allKgNodes,
  bottlenecks,
  bridge,
  domainIslands,
  edgeKey,
  findEdge,
  flagEdge,
  flaggedEdgeNodes,
  gatewayLessons,
  getFlags,
  kgNode,
  unflagEdge,
  type KgFlag,
  type KgNode,
  type KgNodeKind,
} from "../lib/knowledgegraph";

const KIND_LABEL: Record<KgNodeKind, string> = {
  lesson: "Lesson",
  track: "Track",
  jalur: "Jalur",
  proyek: "Proyek",
  akar: "Kurikulum",
};

function KindBadge({ kind }: { kind: KgNodeKind }) {
  return <span className={`kg-kind kg-k-${kind}`}>{KIND_LABEL[kind]}</span>;
}

function NodeLink({ node }: { node: KgNode }) {
  return (
    <Link className="kg-node" href={node.href}>
      <KindBadge kind={node.kind} />
      <span className="kg-nodetitle">{node.label}</span>
      {node.sub && <span className="kg-nodesub">{node.sub}</span>}
    </Link>
  );
}

/* ── Bagian 1: query jembatan ─────────────────────────────────────────── */

function BridgeQuery() {
  const nodes = useMemo(() => allKgNodes(), []);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState<{
    nodes: KgNode[];
    reasons: string[];
    noPath: boolean;
  } | null>(null);
  // flags dibaca setelah mount agar HTML prerender cocok dengan render awal
  // (localStorage tidak ada saat SSR — baca di sini = hydration mismatch).
  const [flags, setFlags] = useState<KgFlag[]>([]);
  useEffect(() => {
    setFlags(getFlags());
  }, []);

  const resolve = (text: string): KgNode | undefined => {
    const t = text.trim().toLowerCase();
    if (!t) return undefined;
    return (
      nodes.find((n) => n.label.toLowerCase() === t) ??
      nodes.find((n) => n.label.toLowerCase().includes(t))
    );
  };

  const run = () => {
    const a = resolve(from);
    const b = resolve(to);
    if (!a || !b) {
      setResult(null);
      return;
    }
    const r = bridge(a.id, b.id);
    setResult(r ? { nodes: r.nodes, reasons: r.reasons, noPath: false } : { nodes: [], reasons: [], noPath: true });
  };

  const toggleFlag = (aId: string, bId: string) => {
    const key = edgeKey(aId, bId);
    const flagged = flags.some((f) => f.edgeKey === key);
    setFlags(flagged ? unflagEdge(key) : flagEdge(aId, bId));
  };

  const options = useMemo(
    () =>
      nodes.map((n) => (
        <option key={n.id} value={n.label}>
          {KIND_LABEL[n.kind]} · {n.sub ?? ""}
        </option>
      )),
    [nodes],
  );

  return (
    <section aria-label="Query jembatan">
      <h2 className="kg-h2">Cari jembatan</h2>
      <p className="kg-mut">
        Pilih dua titik — lesson, track, jalur, atau proyek — dan lihat rute
        penghubung terpendek. Setiap langkah menampilkan <b>alasannya</b>, bukan
        sekadar garis.
      </p>
      <div className="kg-form">
        <label className="kg-field">
          <span>Dari</span>
          <input
            list="kg-nodes"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="mis. SQL: JOIN …"
            autoComplete="off"
          />
        </label>
        <button
          type="button"
          className="kg-swap"
          title="Tukar arah"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          <Icon name="reset" />
        </button>
        <label className="kg-field">
          <span>Ke</span>
          <input
            list="kg-nodes"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="mis. Credit Risk"
            autoComplete="off"
          />
        </label>
        <button type="button" className="kg-btn" onClick={run}>
          Cari jembatan
        </button>
        <datalist id="kg-nodes">{options}</datalist>
      </div>

      {result?.noPath && (
        <p className="kg-mut">
          Tidak ada jembatan antara kedua titik itu di graf saat ini. Ini
          informasi jujur dari data — bukan kegagalan pencarian.
        </p>
      )}

      {result && !result.noPath && result.nodes.length > 0 && (
        <ol className="kg-path">
          {result.nodes.map((n, i) => {
            const isLast = i === result.nodes.length - 1;
            const next = result.nodes[i + 1];
            const fkey = next ? edgeKey(n.id, next.id) : "";
            const flagged = next && flags.some((f) => f.edgeKey === fkey);
            return (
              <li key={n.id} className="kg-hop">
                <NodeLink node={n} />
                {!isLast && (
                  <div className="kg-reason">
                    <div className="kg-reasonline" aria-hidden="true" />
                    <p>{result.reasons[i]}</p>
                    <button
                      type="button"
                      className={`kg-flagbtn${flagged ? " kg-flagged" : ""}`}
                      onClick={() => toggleFlag(n.id, next.id)}
                      title={
                        flagged
                          ? "Relasi ini ditandai keliru — klik untuk membatalkan"
                          : "Tandai relasi ini bila terasa keliru"
                      }
                    >
                      {flagged ? "Ditandai keliru ✓" : "Tandai keliru"}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

/* ── Bagian 2 & 3: lesson pembuka & bottleneck ────────────────────────── */

function GatewayList() {
  const gateways = useMemo(() => gatewayLessons(12), []);
  return (
    <section aria-label="Lesson pembuka">
      <h2 className="kg-h2">Lesson pembuka</h2>
      <p className="kg-mut">
        Lesson yang membuka paling banyak lanjutan — selesaikan ini dulu,
        efeknya berantai. Angka dihitung dari graf, bukan opini.
      </p>
      <ol className="kg-list">
        {gateways.map((g, i) => (
          <li key={g.node.id} className="kg-item">
            <span className="kg-rank">{i + 1}</span>
            <div className="kg-itemmain">
              <NodeLink node={g.node} />
              <div className="kg-itemmeta">
                Membuka <b>{g.fanoutCount} node</b> · {g.breakdown}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function BottleneckList() {
  // null = belum mount (SSR/prerender tidak punya localStorage)
  const [done, setDone] = useState<Set<string> | null>(null);
  useEffect(() => {
    setDone(getLocalDone());
  }, []);
  const items = useMemo(() => (done ? bottlenecks(done, 8) : []), [done]);
  if (done === null) {
    return (
      <section aria-label="Bottleneck">
        <h2 className="kg-h2">Bottleneck-mu</h2>
        <p className="kg-mut">Memuat progres lokal…</p>
      </section>
    );
  }
  return (
    <section aria-label="Bottleneck">
      <h2 className="kg-h2">Bottleneck-mu</h2>
      {done.size === 0 ? (
        <div className="kg-empty">
          <p>
            Belum ada progres tercatat di perangkat ini, jadi belum ada
            bottleneck yang bisa dihitung. Tandai lesson selesai di halaman
            belajar, lalu kembali ke sini.
          </p>
        </div>
      ) : (
        <>
          <p className="kg-mut">
            Belum selesai, tapi membuka paling banyak lanjutan — ini
            hambatan terbesar di jalurmu sekarang.
          </p>
          <ol className="kg-list">
            {items.map((g, i) => (
              <li key={g.node.id} className="kg-item">
                <span className="kg-rank">{i + 1}</span>
                <div className="kg-itemmain">
                  <NodeLink node={g.node} />
                  <div className="kg-itemmeta">
                    Membuka <b>{g.fanoutCount} node</b> · {g.breakdown}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}

/* ── Bagian 4: pulau domain ─────────────────────────────────────────── */

function Islands() {
  const islands = useMemo(() => domainIslands(), []);
  return (
    <section aria-label="Pulau domain">
      <h2 className="kg-h2">Pulau domain</h2>
      <p className="kg-mut">
        25 track dikelompokkan dua pulau — Fondasi (bekal lintas peran) dan
        Track Peran. Buka tiap track untuk melihat daftar lesson-nya.
      </p>
      <div className="kg-islands">
        {islands.map((isl) => (
          <div key={isl.id} className="kg-island">
            <h3 className="kg-h3">{isl.title}</h3>
            <p className="kg-mut kg-tight">{isl.blurb}</p>
            {isl.tracks.map((t) => (
              <details key={t.id} className="kg-track">
                <summary>
                  {t.label} <span className="kg-count">{t.sub}</span>
                </summary>
                <TrackLessons trackName={t.label} />
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function TrackLessons({ trackName }: { trackName: string }) {
  const lessons = useMemo(
    () =>
      allKgNodes()
        .filter((n) => n.kind === "lesson" && n.sub === `Track ${trackName}`)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [trackName],
  );
  return (
    <ul className="kg-tracklessons">
      {lessons.map((l) => (
        <li key={l.id}>
          <Link href={l.href}>{l.label}</Link>
        </li>
      ))}
    </ul>
  );
}

/* ── Bagian 5: relasi yang ditandai ───────────────────────────────────── */

function FlaggedList() {
  const [flags, setFlags] = useState<KgFlag[]>([]);
  useEffect(() => {
    setFlags(getFlags());
  }, []);
  if (flags.length === 0) return null;
  return (
    <section aria-label="Relasi yang ditandai">
      <h2 className="kg-h2">Relasi yang ditandai</h2>
      <p className="kg-mut">
        Relasi yang kamu tandai keliru — tersimpan di perangkat ini saja.
      </p>
      <ul className="kg-list">
        {flags.map((f) => {
          const { a, b, edge } = flaggedEdgeNodes(f);
          return (
            <li key={f.edgeKey} className="kg-item">
              <div className="kg-itemmain">
                <div className="kg-flagpair">
                  {a && <NodeLink node={a} />} <span aria-hidden="true">↔</span>{" "}
                  {b && <NodeLink node={b} />}
                </div>
                {edge && <p className="kg-reasontext">{edge.reason}</p>}
                <button
                  type="button"
                  className="kg-flagbtn"
                  onClick={() => setFlags(unflagEdge(f.edgeKey))}
                >
                  Batalkan tanda
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── Halaman ──────────────────────────────────────────────────────────── */

export default function PetaClient() {
  return (
    <div className="kg-wrap">
      <p className="kg-intro">
        Peta Pengetahuan menampilkan 749 lesson sebagai <b>rute</b>, bukan
        daftar panjang. Semua relasi dihitung dari data kurikulum nyata —
        registry lesson, jalur belajar, dan proyek terpandu — dan{" "}
        <b>setiap relasi menampilkan alasannya</b>.
      </p>
      <BridgeQuery />
      <GatewayList />
      <BottleneckList />
      <Islands />
      <FlaggedList />
      <section className="kg-method" aria-label="Metodologi">
        <h2 className="kg-h2">Dari mana relasi ini berasal</h2>
        <ul>
          <li>
            <b>Lesson → track:</b> lesson terdaftar di track-nya (registry
            lesson, 749 lesson).
          </li>
          <li>
            <b>Lesson → lesson:</b> urutan kurikulum dalam satu track,
            numeric-aware (a22 sebelum a210).
          </li>
          <li>
            <b>Track → jalur:</b> track tercakup dalam 5 jalur belajar
            (paths.ts).
          </li>
          <li>
            <b>Track → proyek:</b> proyek melatih track tersebut (deklarasi
            konten reg-proyek.ts; satu alias tercatat: “Fraud/AML” →
            “Fraud & AML Analytics”).
          </li>
          <li>
            <b>Track → kurikulum:</b> semua track adalah bagian kurikulum —
            ini yang membuat graf terhubung penuh antar domain.
          </li>
        </ul>
        <p className="kg-mut">
          Relasi yang salah bisa ditandai langsung di hasil pencarian — tandanya
          tersimpan lokal di perangkatmu.
        </p>
      </section>
    </div>
  );
}
