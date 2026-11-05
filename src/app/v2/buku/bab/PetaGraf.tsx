"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { BukuKonsep } from "../../lib/bedahbuku";
import { RichInline } from "./rich";
import "./poles.css";

/**
 * PetaGraf — peta konsep interaktif Bab (React Flow).
 *
 * Bentuk data (FINAL, ditulis worker data paralel):
 *   BukuPeta { nodes: [{id, label, x, y, konsepId?}], edges: [{from, to, label?}] }
 *
 * React Flow menyentuh window/ResizeObserver, jadi kanvas aktual dibungkus
 * next/dynamic { ssr: false } — pola client-only sesuai panduan next/dynamic.
 */

export interface BukuPetaNode {
  id: string;
  label: string;
  x: number;
  y: number;
  konsepId?: string | number;
}

export interface BukuPetaEdge {
  from: string;
  to: string;
  label?: string;
  /** Titik bantu rute: edge digambar lurus melewati titik-titik ini. */
  via?: { x: number; y: number }[];
}

export interface BukuPeta {
  nodes: BukuPetaNode[];
  edges: BukuPetaEdge[];
}

export interface PetaGrafProps {
  peta: BukuPeta;
  konsep: BukuKonsep[];
}

/** Cari entri konsep untuk sebuah node: dukung konsepId angka (indeks) maupun string (nama). */
function resolveKonsep(
  konsepId: string | number | undefined,
  label: string,
  konsep: BukuKonsep[]
): BukuKonsep | null {
  if (konsepId === undefined || konsepId === null) return null;
  if (typeof konsepId === "number" && Number.isInteger(konsepId)) {
    return konsep[konsepId] ?? null;
  }
  const s = String(konsepId).trim();
  if (s !== "" && /^\d+$/.test(s) && konsep[Number(s)]) return konsep[Number(s)];
  const low = s.toLowerCase();
  return (
    konsep.find((k) => {
      const n = k.nama.toLowerCase();
      return n === low || n.includes(low) || (low.length > 2 && low.includes(n));
    }) ?? null
  );
}

/** Titik pada polyline pada fraksi panjang tertentu (untuk label edge `via`). */
function pointOnPolyline(
  pts: { x: number; y: number }[],
  frac: number
): { x: number; y: number } {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1) return pts[0];
  const segs: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    segs.push(d);
    total += d;
  }
  if (total === 0) return pts[0];
  let target = total * Math.min(1, Math.max(0, frac));
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i] || i === segs.length - 1) {
      const t = segs[i] === 0 ? 0 : target / segs[i];
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
      };
    }
    target -= segs[i];
  }
  return pts[pts.length - 1];
}

/**
 * RoutedEdge — edge garis lurus ber-segmen melewati titik `via`.
 * Dipakai untuk edge panjang yang bila digambar lurus/bezier akan menembus
 * simpul lain. Label (chip HTML) ditaruh di tengah rute.
 */
function RoutedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const via = ((data?.via ?? []) as { x: number; y: number }[]).filter(
    (p) => Number.isFinite(p.x) && Number.isFinite(p.y)
  );
  const pts = [{ x: sourceX, y: sourceY }, ...via, { x: targetX, y: targetY }];
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const lp = pointOnPolyline(pts, 0.5);
  const label = typeof data?.label === "string" ? data.label : "";
  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{ ...style, strokeDasharray: "7 5" }}
        markerEnd={markerEnd}
      />
      {label !== "" && (
        <EdgeLabelRenderer>
          <div
            className="react-flow__edge-textwrapper bk-edge-label nodrag nopan"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${lp.x}px, ${lp.y}px)`,
            }}
          >
            <span className="bk-edge-label-chip">{label}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const edgeTypes = { routed: RoutedEdge };

function FlowCanvasInner({ peta, konsep }: PetaGrafProps) {
  const [sel, setSel] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile: jangan pampatkan seluruh graf (fitView penuh membuat label mungil
  // tak terbaca); paksa zoom minimal agar label tetap terbaca + pan/zoom mudah.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const upd = () => setIsMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  const flowNodes: Node[] = useMemo(
    () =>
      peta.nodes.map((n) => ({
        id: n.id,
        position: { x: n.x, y: n.y },
        data: { label: n.label },
        selected: sel === n.id,
      })),
    [peta, sel]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      peta.edges.map((e, i) => {
        const hot = sel !== null && (e.from === sel || e.to === sel);
        const routed = Array.isArray(e.via) && e.via.length > 0;
        return {
          id: `e${i}`,
          source: e.from,
          target: e.to,
          ...(routed
            ? { type: "routed", data: { label: e.label, via: e.via } }
            : { label: e.label }),
          animated: true,
          style: hot
            ? { stroke: "#ffd166", strokeWidth: 3 }
            : { stroke: "#5b6b82", strokeWidth: 1.5 },
          labelStyle: { fill: "#c8d2df", fontSize: 13, fontWeight: 600 },
          labelBgStyle: {
            fill: "#0e141c",
            fillOpacity: 1,
            stroke: "#3a4556",
            strokeWidth: 1,
          },
          labelBgPadding: [6, 8] as [number, number],
          labelBgBorderRadius: 8,
        };
      }),
    [peta, sel]
  );

  const labelOf = (id: string) =>
    peta.nodes.find((n) => n.id === id)?.label ?? id;

  const selNode = sel ? peta.nodes.find((n) => n.id === sel) ?? null : null;
  const konsepHit = selNode
    ? resolveKonsep(selNode.konsepId, selNode.label, konsep)
    : null;
  const linked = sel
    ? peta.edges.filter((e) => e.from === sel || e.to === sel)
    : [];

  return (
    <div className="bk-petagraf">
      <div className="bk-peta" role="application" aria-label="Peta konsep interaktif">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          edgeTypes={edgeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          fitView
          fitViewOptions={{
            padding: 0.2,
            minZoom: isMobile ? 0.9 : 0.35,
            maxZoom: isMobile ? 1.0 : 1.25,
          }}
          minZoom={isMobile ? 0.9 : 0.35}
          maxZoom={1.75}
          colorMode="dark"
          onNodeClick={(_, node) => setSel(node.id)}
          onPaneClick={() => setSel(null)}
          proOptions={{ hideAttribution: false }}
        >
          <Background variant={BackgroundVariant.Dots} gap={26} size={1.2} />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </div>

      {/* Panel detail — DI BAWAH graf */}
      <div className="bk-peta-detail" aria-live="polite">
        {!selNode && (
          <p className="bk-peta-hint">
            👆 Klik salah satu simpul pada peta untuk melihat definisi konsepnya.
          </p>
        )}
        {selNode && (
          <div key={selNode.id} className="bk-peta-card">
            <h4 className="bk-peta-nama">
              {konsepHit ? konsepHit.nama : selNode.label}
            </h4>
            {konsepHit ? (
              <>
                <p className="bk-peta-definisi">
                  <RichInline text={konsepHit.definisi} />
                </p>
                {konsepHit.relasi && (
                  <p className="bk-peta-meta">
                    <strong>Relasi:</strong>{" "}
                    <RichInline text={konsepHit.relasi} />
                  </p>
                )}
                {konsepHit.contoh && (
                  <p className="bk-peta-meta">
                    <strong>Contoh:</strong>{" "}
                    <RichInline text={konsepHit.contoh} />
                  </p>
                )}
              </>
            ) : (
              <p className="bk-peta-definisi bk-peta-kosong">
                (Belum ada definisi konsep untuk simpul ini.)
              </p>
            )}
            {linked.length > 0 && (
              <div className="bk-peta-edges">
                <span className="bk-peta-edges-title">Terhubung dengan:</span>
                <ul>
                  {linked.map((e, i) => (
                    <li key={i}>
                      {e.from === sel ? (
                        <>
                          → <strong>{labelOf(e.to)}</strong>
                        </>
                      ) : (
                        <>
                          ← <strong>{labelOf(e.from)}</strong>
                        </>
                      )}
                      {e.label && (
                        <span className="bk-peta-edge-label">
                          {" "}
                          — <RichInline text={e.label} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Kanvas Flow hanya hidup di client; saat SSR tampil skeleton pemuatan.
const FlowCanvas = dynamic(
  () => Promise.resolve({ default: FlowCanvasInner }),
  {
    ssr: false,
    loading: () => (
      <div className="bk-peta bk-peta-loading" aria-hidden="true">
        <span>Memuat peta konsep…</span>
      </div>
    ),
  }
);

export default function PetaGraf({ peta, konsep }: PetaGrafProps) {
  if (!peta || peta.nodes.length === 0) return null;
  return <FlowCanvas peta={peta} konsep={konsep} />;
}
