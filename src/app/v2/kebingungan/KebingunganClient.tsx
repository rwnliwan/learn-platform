"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "../lib/icons";
// Code splitting 2026-11-05 (temuan N1 Instinct): halaman ini HANYA butuh
// judul/track/judul-step — JANGAN impor registry penuh (konten ~26 MB ikut
// ke chunk client). Baca lessonMeta.json via lessonMeta.ts.
import { lessonMetas, misiMetas } from "../lib/lessonMeta";
import { parseCardId } from "../lib/fsrs";
import {
  CONFUSION_KINDS,
  computeNodes,
  confirmedKind,
  confirmKind,
  dismissNode,
  readIntervention,
  rescheduleNodeCards,
  resolutionHistory,
  setSignalOptOut,
  signalOptedOut,
  type ConfusionKind,
  type ConfusionNode,
  type NodeMeta,
  type ResolutionEntry,
} from "../lib/confusion";

function buildMeta(): {
  lessonOf: Map<string, { title: string; track: string; href: string }>;
  stepTitleOf: Map<string, string>;
} {
  const lessonOf = new Map<string, { title: string; track: string; href: string }>();
  const stepTitleOf = new Map<string, string>();
  for (const l of lessonMetas()) {
    lessonOf.set(l.slug, { title: l.title, track: l.track, href: "/v2/learn/" + l.slug });
    for (const s of l.steps) stepTitleOf.set(l.slug + "␟" + s.id, s.title);
  }
  for (const mis of misiMetas()) {
    const slug = mis.slug;
    if (!lessonOf.has(slug))
      lessonOf.set(slug, { title: mis.title, track: mis.track, href: "/v2/misi/" + slug });
    for (const s of mis.steps)
      if (!stepTitleOf.has(slug + "␟" + s.id)) stepTitleOf.set(slug + "␟" + s.id, s.title);
  }
  return { lessonOf, stepTitleOf };
}

const KIND_LABEL: Record<ConfusionKind, string> = {
  definisi: "Definisi / konsep inti",
  prasyarat: "Prasyarat",
  notasi: "Notasi / interpretasi soal",
  transfer: "Transfer ke kasus nyata",
};

function NodeCard({
  node,
  onChanged,
}: {
  node: ConfusionNode;
  onChanged: () => void;
}) {
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState<"scheduled" | null>(
    readIntervention(node.slug, node.stepId) ? "scheduled" : null
  );
  const confirmed = confirmedKind(node.slug, node.stepId);
  const kind: ConfusionKind = confirmed ?? node.kind;

  return (
    <li className="kb-item">
      <div className="kb-itemhead">
        <div>
          <div className="kb-itemtitle">
            {node.lessonTitle} <span className="kb-step">· {node.stepTitle}</span>
          </div>
          <div className="kb-itemmeta">
            {node.track} · {node.signals.cardCount} kartu · basis: {node.kindBasis}
          </div>
        </div>
        <span className="kb-kind" title="Dugaan awal — bisa salah, bisa ditolak">
          Dugaan: {KIND_LABEL[kind]}
        </span>
      </div>

      {!checking && !confirmed ? (
        <div className="kb-actions">
          <button type="button" className="btn ghost" onClick={() => setChecking(true)}>
            Cek dulu — apa yang bikin stuck?
          </button>
        </div>
      ) : !confirmed ? (
        <div className="kb-micro">
          <p className="kb-mut">
            Menurutmu, apa yang paling bikin stuck di langkah ini? Dugaan di
            atas bisa salah — pilih yang paling pas, atau tolak semuanya.
          </p>
          <div className="kb-kinds">
            {CONFUSION_KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                className="kb-kindbtn"
                onClick={() => {
                  confirmKind(node.slug, node.stepId, k.id);
                  onChanged();
                }}
                title={k.desc}
              >
                {k.title}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn ghost kb-dismiss"
            onClick={() => {
              dismissNode(node.slug, node.stepId);
              onChanged();
            }}
          >
            Bukan keempatnya — sembunyikan titik ini
          </button>
        </div>
      ) : (
        <p className="kb-mut">
          Kamu mengonfirmasi: <b>{KIND_LABEL[confirmed]}</b>
        </p>
      )}

      <div className="kb-actions">
        <Link className="btn" href={node.href}>
          Buka langkahnya
          <Icon name="right" />
        </Link>
        {done ? (
          <span className="kb-done">✓ Sudah dijadwalkan ulang</span>
        ) : (
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              const n = rescheduleNodeCards(node);
              if (n > 0) {
                setDone("scheduled");
                onChanged();
              }
            }}
            title="Majukan jatuh tempo kartu-kartu titik ini ke sekarang agar masuk antrean Tinjau Ulang"
          >
            Jadwalkan review ulang
          </button>
        )}
      </div>
    </li>
  );
}

export default function KebingunganClient() {
  const [ready, setReady] = useState(false);
  const [nodes, setNodes] = useState<ConfusionNode[]>([]);
  const [history, setHistory] = useState<ResolutionEntry[]>([]);
  const [optOut, setOptOut] = useState(false);

  const reload = () => {
    try {
      const { lessonOf, stepTitleOf } = buildMeta();
      const metaOf = (slug: string, stepId: string): NodeMeta => {
        const l = lessonOf.get(slug);
        return {
          lessonTitle: l?.title ?? slug,
          stepTitle: stepTitleOf.get(slug + "␟" + stepId) ?? stepId,
          track: l?.track ?? "Lainnya",
          href: l?.href ?? "/v2/learn",
        };
      };
      setNodes(computeNodes(metaOf));
      setHistory(resolutionHistory(metaOf));
    } catch {
      /* data lokal rusak -> empty state jujur */
    }
  };

  useEffect(() => {
    reload();
    setOptOut(signalOptedOut());
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <div className="kb-wrap">
        <p className="kb-mut">Menganalisis sinyal belajarmu…</p>
      </div>
    );
  }

  return (
    <div className="kb-wrap">
      <p className="kb-intro">
        Kebingungan adalah <b>sinyal diagnostik</b>, bukan vonis. Titik-titik
        di bawah disusun dari data review FSRS (jawaban Again), petunjuk yang
        kamu buka, dan revisi jawaban — diurut dari yang paling butuh
        perhatian. Dugaan jenisnya <b>selalu bisa salah</b>: konfirmasi atau
        tolak sebelum bertindak.
      </p>

      {/* ── Saklar pencatatan sinyal ── */}
      <label className="kb-opt">
        <input
          type="checkbox"
          checked={!optOut}
          onChange={(e) => {
            setSignalOptOut(!e.target.checked);
            setOptOut(!e.target.checked);
            reload();
          }}
        />
        <span>
          Catat sinyal belajar (petunjuk yang dibuka &amp; revisi jawaban).
          Data review FSRS tidak terpengaruh — itu mesin Tinjau Ulang itu
          sendiri. Mematikan ini <b>menghentikan pencatatan</b> sepenuhnya.
        </span>
      </label>

      {nodes.length === 0 ? (
        <div className="kb-empty">
          <Icon name="bulb" className="kb-empty-ic" />
          <h2>Tidak ada titik kebingungan terdeteksi</h2>
          <p>
            Belum ada sinyal yang cukup kuat: tidak ada kartu dengan Again
            berulang, petunjuk yang sering dibuka, atau review yang lama
            tertunggak. Terus belajar dan tinjau ulang — peta ini terisi
            begitu friksinya muncul.
          </p>
          <Link className="btn" href="/v2/review">
            Buka Tinjau Ulang
          </Link>
        </div>
      ) : (
        <>
          <h2 className="kb-h2">Titik paling rapuh</h2>
          <p className="kb-mut kb-tight">
            Diurut dari skor sinyal tertinggi. Mulai dari yang paling atas —
            satu intervensi kecil lebih baik dari daftar panjang.
          </p>
          <ul className="kb-list">
            {nodes.map((n) => (
              <NodeCard
                key={n.slug + ":" + n.stepId}
                node={n}
                onChanged={reload}
              />
            ))}
          </ul>
        </>
      )}

      {history.length > 0 && (
        <>
          <h2 className="kb-h2">Riwayat intervensi</h2>
          <p className="kb-mut kb-tight">
            Titik yang pernah kamu jadwalkan review ulangnya, dan apakah
            sinyalnya membaik setelah itu — dihitung dari data, bukan klaim.
          </p>
          <ul className="kb-list">
            {history.map((h) => (
              <li key={h.slug + ":" + h.stepId} className="kb-item">
                <div className="kb-itemhead">
                  <div className="kb-itemtitle">
                    {h.lessonTitle} <span className="kb-step">· {h.stepTitle}</span>
                  </div>
                  <span
                    className={
                      "kb-kind" + (h.status === "membaik" ? " kb-good" : "")
                    }
                  >
                    {h.status === "membaik" ? "Membaik" : "Belum jelas"}
                  </span>
                </div>
                <div className="kb-itemmeta">{h.detail}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ── Metode & batas ── */}
      <div className="kb-method">
        <h2 className="kb-h2">Cara membaca halaman ini</h2>
        <ul>
          <li>
            Skor = 3 × Again (maks 12) + petunjuk dibuka (maks 5) + revisi
            jawaban (maks 10) + ½ × upaya lab gagal (maks 10) + 0,1 × hari
            tunggak (maks 30). Again adalah sinyal terkuat karena datang
            dari penilaian recall langsung.
          </li>
          <li>
            Jenis kebingungan (definisi / prasyarat / notasi / transfer)
            adalah <b>heuristik</b> dari pola sinyal — selalu dilabeli dugaan
            awal dan selalu bisa kamu tolak.
          </li>
          <li>
            Kemampuan <b>tidak pernah</b> disimpulkan dari kecepatan
            menjawab. Pencatatan sinyal bisa dimatikan total lewat saklar di
            atas.
          </li>
          <li>
            “Jadwalkan review ulang” hanya memajukan jatuh tempo kartu ke
            sekarang — tidak mengubah isi materi atau perilaku review.
          </li>
        </ul>
      </div>
    </div>
  );
}
