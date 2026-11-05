"use client";
import { useEffect, useRef, useState } from "react";
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

/** Judul step (~440 KB) TIDAK ikut bundle awal: di-load lazy via dynamic
    import hanya saat halaman ini dibuka. lessonMeta.json ramping (judul /
    track / est saja) tetap dibaca sinkron via lessonMeta.ts. Gagal load ->
    fallback stepId (perilaku lama untuk judul yang memang tidak ada). */
type StepsData = {
  lessons: Record<string, [string, string][]>;
  misi: Record<string, [string, string][]>;
};
const EMPTY_STEPS: StepsData = { lessons: {}, misi: {} };
let stepsPromise: Promise<StepsData> | null = null;
function loadStepTitles(): Promise<StepsData> {
  if (!stepsPromise) {
    stepsPromise = import("../lib/lessonMetaSteps.json")
      .then((mod) => ((mod.default ?? mod) as unknown as StepsData) ?? EMPTY_STEPS)
      .catch(() => EMPTY_STEPS);
  }
  return stepsPromise;
}

function buildMeta(stepTitles: StepsData): {
  lessonOf: Map<string, { title: string; track: string; href: string }>;
  stepTitleOf: Map<string, string>;
} {
  const lessonOf = new Map<string, { title: string; track: string; href: string }>();
  const stepTitleOf = new Map<string, string>();
  for (const l of lessonMetas()) {
    lessonOf.set(l.slug, { title: l.title, track: l.track, href: "/v2/learn/" + l.slug });
    for (const [id, title] of stepTitles.lessons[l.slug] ?? [])
      stepTitleOf.set(l.slug + "␟" + id, title);
  }
  for (const mis of misiMetas()) {
    const slug = mis.slug;
    if (!lessonOf.has(slug))
      lessonOf.set(slug, { title: mis.title, track: mis.track, href: "/v2/misi/" + slug });
    for (const [id, title] of stepTitles.misi[slug] ?? [])
      if (!stepTitleOf.has(slug + "␟" + id)) stepTitleOf.set(slug + "␟" + id, title);
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
  const stepTitlesRef = useRef<StepsData>(EMPTY_STEPS);

  const reload = () => {
    try {
      const { lessonOf, stepTitleOf } = buildMeta(stepTitlesRef.current);
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
    // Judul step dimuat dulu (lazy chunk); halaman tetap di state
    // "Menganalisis…" sampai judul tiba, jadi hasil akhir identik.
    loadStepTitles().then((t) => {
      stepTitlesRef.current = t;
      reload();
      setOptOut(signalOptedOut());
      setReady(true);
    });
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
          <Link prefetch={false} className="btn" href="/v2/review">
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
