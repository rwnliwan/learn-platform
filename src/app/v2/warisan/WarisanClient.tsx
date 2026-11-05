"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "../lib/icons";
import { getV2Lessons } from "../lib/registry";
import { REG_MISI } from "../lib/reg-misi";
import {
  parseCardId,
  retrievabilityAt,
  type StoredFsrsCard,
} from "../lib/fsrs";
import {
  SCENARIOS,
  HORIZONS,
  listProjectableCards,
  projectCards,
  aggregateByTrack,
  priorityAssets,
  type ScenarioId,
  type TrackBand,
  type PriorityAsset,
  type Projection,
} from "../lib/legacy";

interface CardMeta {
  title: string;
  track: string;
  href: string;
}

function buildMeta(): Map<string, CardMeta> {
  const m = new Map<string, CardMeta>();
  for (const l of getV2Lessons())
    m.set(l.slug, {
      title: l.title,
      track: l.track,
      href: "/v2/learn/" + l.slug,
    });
  for (const [slug, mis] of Object.entries(REG_MISI))
    if (!m.has(slug))
      m.set(slug, {
        title: mis.title,
        track: mis.track,
        href: "/v2/misi/" + slug,
      });
  return m;
}

function trackOf(cardId: string, meta: Map<string, CardMeta>): string {
  const p = parseCardId(cardId);
  if (!p) return "Lainnya";
  return meta.get(p.slug)?.track ?? "Lainnya";
}

const pct = (v: number) => Math.round(v) + "%";

export default function WarisanClient() {
  const [ready, setReady] = useState(false);
  const [cards, setCards] = useState<StoredFsrsCard[]>([]);
  const [meta, setMeta] = useState<Map<string, CardMeta>>(new Map());
  const [scenario, setScenario] = useState<ScenarioId>("stop");
  const [horizon, setHorizon] = useState(365);
  const [assets, setAssets] = useState<(PriorityAsset & { meta: CardMeta })[]>([]);

  useEffect(() => {
    try {
      const c = listProjectableCards();
      setCards(c);
      const mm = buildMeta();
      setMeta(mm);
      const stop1y = projectCards(c, "stop", 365);
      const pa = priorityAssets(c, stop1y)
        .slice(0, 12)
        .map((a) => ({
          ...a,
          meta: mm.get(parseCardId(a.cardId)?.slug ?? "") ?? {
            title: a.cardId,
            track: "Lainnya",
            href: "/v2/learn",
          },
        }));
      setAssets(pa);
    } catch {
      /* data lokal rusak -> empty state jujur */
    }
    setReady(true);
  }, []);

  const proj: Projection[] = useMemo(
    () => (cards.length ? projectCards(cards, scenario, horizon) : []),
    [cards, scenario, horizon]
  );
  const bands: TrackBand[] = useMemo(
    () =>
      proj.length
        ? aggregateByTrack(proj, (id) => trackOf(id, meta))
        : [],
    [proj, meta]
  );
  const queue = useMemo(
    () =>
      [...proj]
        .sort((a, b) => a.retention - b.retention)
        .slice(0, 20)
        .map((p) => ({
          ...p,
          meta: meta.get(parseCardId(p.cardId)?.slug ?? "") ?? {
            title: p.cardId,
            track: "Lainnya",
            href: "/v2/learn",
          },
        })),
    [proj, meta]
  );

  const scen = SCENARIOS.find((s) => s.id === scenario)!;
  const horizonLabel = HORIZONS.find((h) => h.days === horizon)!.label;

  if (!ready) {
    return (
      <div className="wr-wrap">
        <p className="wr-muted">Menghitung proyeksi dari data review…</p>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="wr-wrap">
        <div className="wr-empty">
          <Icon name="book" className="wr-empty-ic" />
          <h2>Belum ada data review</h2>
          <p>
            Warisan Pengetahuan dihitung dari kartu review FSRS yang sudah
            pernah kamu nilai. Mulai belajar dan tinjau ulang beberapa kartu —
            proyeksi akan muncul di sini begitu datanya ada.
          </p>
          <Link className="btn" href="/v2/review">
            Buka Tinjau Ulang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wr-wrap">
      <p className="wr-intro">
        Berdasarkan <b>{cards.length} kartu review</b> yang sudah kamu nilai,
        inilah perkiraan berapa banyak pengetahuan yang <b>bertahan</b> pada 1,
        3, dan 5 tahun dari sekarang — dihitung dari model FSRS yang sama
        dengan Tinjau Ulang, bukan tebakan baru. Semua angka adalah{" "}
        <b>rentang perkiraan</b>, bukan janji.
      </p>

      {/* ── Pemilih skenario ── */}
      <div
        className="wr-seg"
        role="group"
        aria-label="Pilih skenario kebiasaan"
      >
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={"wr-segbtn" + (s.id === scenario ? " sel" : "")}
            aria-pressed={s.id === scenario}
            onClick={() => setScenario(s.id)}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="wr-assume">
        <b>Asumsi skenario “{scen.title}”:</b> {scen.assumption}
      </div>
      <p className="wr-muted wr-tight">{scen.desc}</p>

      {/* ── Pemilih horizon ── */}
      <div
        className="wr-seg wr-hz"
        role="group"
        aria-label="Pilih horizon proyeksi"
      >
        {HORIZONS.map((h) => (
          <button
            key={h.days}
            type="button"
            className={"wr-segbtn" + (h.days === horizon ? " sel" : "")}
            aria-pressed={h.days === horizon}
            onClick={() => setHorizon(h.days)}
          >
            {h.label}
          </button>
        ))}
      </div>

      {/* ── Peta per track ── */}
      <h2 className="wr-h2">
        Peta retensi per track · {horizonLabel}
      </h2>
      <p className="wr-muted wr-tight">
        Diurut dari yang paling rapuh. Batang = rentang perkiraan (kuartil
        25–75 antar kartu); garis = rata-rata track.
      </p>
      <div className="wr-tracks">
        {bands.map((b) => (
          <div key={b.track} className="wr-track">
            <div className="wr-trackhead">
              <span className="wr-trackname">{b.track}</span>
              <span className="wr-trackmeta">
                {b.n} kartu · rata-rata {pct(b.mean)} · rentang{" "}
                {pct(b.p25)}–{pct(b.p75)}
              </span>
            </div>
            <div
              className="wr-band"
              role="img"
              aria-label={`${b.track}: rata-rata ${pct(b.mean)}, rentang ${pct(b.p25)} sampai ${pct(b.p75)}`}
            >
              <div
                className="wr-range"
                style={{ left: b.p25 + "%", width: Math.max(1, b.p75 - b.p25) + "%" }}
              />
              <div className="wr-mean" style={{ left: "calc(" + b.mean + "% - 1.5px)" }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Aset prioritas preservasi ── */}
      <h2 className="wr-h2">Aset prioritas preservasi</h2>
      <p className="wr-muted wr-tight">
        Kartu yang investasi review-nya besar tapi meluruh tercepat bila
        berhenti total — paling layak dijaga. Skor = jumlah review × kerapuhan.
      </p>
      <ul className="wr-list">
        {assets.map((a) => (
          <li key={a.cardId} className="wr-item">
            <Link href={a.meta.href} className="wr-itemtitle">
              {a.meta.title}
            </Link>
            <div className="wr-itemmeta">
              {a.meta.track} · direview {a.reps}× · retensi kini{" "}
              {pct(a.retentionNow)} · 1 thn tanpa review ≈{" "}
              {pct(a.retentionStop1y)}
            </div>
          </li>
        ))}
      </ul>

      {/* ── Rencana maintenance minimal ── */}
      <h2 className="wr-h2">
        Rencana maintenance minimal · {scen.title} · {horizonLabel}
      </h2>
      <p className="wr-muted wr-tight">
        Kartu-kartu dengan proyeksi terendah pada skenario terpilih — antrean
        kecil untuk dijaga, bukan kewajiban. Diperbarui otomatis setiap ada
        review baru.
      </p>
      <ul className="wr-list">
        {queue.map((q) => (
          <li key={q.cardId} className="wr-item">
            <Link href={q.meta.href} className="wr-itemtitle">
              {q.meta.title}
            </Link>
            <div className="wr-itemmeta">
              {q.meta.track} · proyeksi {pct(q.retention)}
            </div>
          </li>
        ))}
      </ul>

      {/* ── Metode & batas ── */}
      <div className="wr-method">
        <h2 className="wr-h2">Cara membaca halaman ini</h2>
        <ul>
          <li>
            Proyeksi memakai <b>model lupa FSRS yang sama</b> dengan Tinjau
            Ulang (stability tiap kartu), diekstrapolasi ke 1/3/5 tahun —
            bukan model baru.
          </li>
          <li>
            Rentang = kuartil 25–75 antar kartu di track itu. Kartu yang
            berbeda meluruh dengan kecepatan berbeda; rata-rata saja
            menyembunyikan itu.
          </li>
          <li>
            Skenario adalah <b>model kebiasaan</b>, bukan ramalan perilakumu.
            “Berhenti total” murni kurva lupa; “review ringan” dan “dipakai
            lewat proyek” memodelkan latihan ulang terjadwal (lihat asumsi
            tiap skenario).
          </li>
          <li>
            Angka berubah setiap kamu mereview — kembali ke halaman ini
            setelah sesi Tinjau Ulang untuk melihat kurva yang diperbarui.
          </li>
        </ul>
      </div>
    </div>
  );
}
