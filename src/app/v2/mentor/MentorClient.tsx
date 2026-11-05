// Silent Mentor Network — Gelombang P (ide #16), client.
//
// Mentor diam-diam: TIDAK ada panggilan AI otomatis saat halaman dimuat.
// Catatan tersimpan langsung tampil; tombol "Minta catatan baru" memicu
// tepat satu panggilan AI per mentor. localStorage HANYA dibaca di useEffect
// (pelajaran hidrasi Gelombang J).
"use client";

import { useEffect, useRef, useState } from "react";
import {
  AiError,
  isAiConfigured,
  loadAiConfig,
} from "../lib/ai";
import AiNotConfigured from "../components/AiGate";
import {
  MENTORS,
  MentorNote,
  MentorPersona,
  buildFactPack,
  renderFactPack,
  requestMentorNote,
  loadMentorNotes,
  saveMentorNote,
  type FactPack,
} from "../lib/mentor";
import "./mentor.css";

function fmtTs(ts: number): string {
  try {
    return new Date(ts).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(ts);
  }
}

function NoteView({ note, stale }: { note: MentorNote; stale: boolean }) {
  return (
    <div className="mnt-note">
      <div className="mnt-note-head">
        <h4 className="mnt-note-title">{note.judul}</h4>
        <span className="mnt-ts">{fmtTs(note.ts)}</span>
        {stale && (
          <span className="mnt-stale" title="Paket fakta berubah sejak catatan ini dibuat">
            Data berubah sejak catatan ini
          </span>
        )}
      </div>
      <p className="mnt-isi">{note.isi}</p>
      <p className="mnt-saran">
        <strong>Saran:</strong> {note.saran}
      </p>
    </div>
  );
}

function MentorCard({
  persona,
  note,
  pack,
  onNoteSaved,
}: {
  persona: MentorPersona;
  note: MentorNote | null;
  pack: FactPack;
  onNoteSaved: (id: string, n: MentorNote) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stale = !!note && note.faktaHash !== pack.hash;

  const request = async () => {
    setError(null);
    setRaw(null);
    setLoading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await requestMentorNote(
        persona,
        renderFactPack(pack),
        ctrl.signal
      );
      if (!res.ok) {
        setRaw(res.raw);
        setError(
          "Format catatan AI tidak terbaca. Respons mentah ditampilkan di bawah — tidak ada catatan yang dikarang, dan catatan lamamu tetap utuh."
        );
        return;
      }
      const saved: MentorNote = {
        ...res.note,
        ts: Date.now(),
        faktaHash: pack.hash,
      };
      saveMentorNote(persona.id, saved);
      onNoteSaved(persona.id, saved);
    } catch (e) {
      if (e instanceof AiError) {
        setError(e.message + " Catatan lamamu tidak hilang — perbaiki lalu coba lagi.");
      } else if (e instanceof DOMException && e.name === "AbortError") {
        setError("Permintaan dibatalkan. Catatan lamamu tidak hilang.");
      } else {
        setError("Terjadi kesalahan tak terduga. Catatan lamamu tidak hilang — coba lagi.");
      }
    } finally {
      abortRef.current = null;
      setLoading(false);
    }
  };

  return (
    <section className="mnt-card" aria-label={persona.nama}>
      <div className="mnt-card-head">
        <div>
          <h3 className="mnt-name">{persona.nama}</h3>
          <p className="mnt-lensa">{persona.lensa}</p>
        </div>
      </div>
      <p className="mnt-gaya">{persona.gaya}</p>
      {note ? (
        <NoteView note={note} stale={stale} />
      ) : (
        <p className="mnt-muted">Belum ada catatan dari {persona.nama}. Minta satu saat kamu siap.</p>
      )}
      {loading ? (
        <div className="mnt-actions">
          <p className="mnt-muted">{persona.nama} sedang menulis catatan…</p>
          <button
            type="button"
            className="mnt-btn mnt-ghost"
            onClick={() => abortRef.current?.abort()}
          >
            Batalkan
          </button>
        </div>
      ) : (
        <div className="mnt-actions">
          <button type="button" className="mnt-btn" onClick={() => void request()}>
            {note ? "Minta catatan baru" : "Minta catatan"}
          </button>
        </div>
      )}
      {error && (
        <div className="mnt-error" role="alert">
          <p>{error}</p>
          <button type="button" className="mnt-btn mnt-ghost" onClick={() => void request()}>
            Coba lagi
          </button>
        </div>
      )}
      {raw && (
        <details className="mnt-raw">
          <summary>Respons mentah AI</summary>
          <pre>{raw}</pre>
        </details>
      )}
    </section>
  );
}

export default function MentorClient() {
  // Nilai netral saat SSR — localStorage HANYA dibaca di useEffect.
  const [ready, setReady] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [pack, setPack] = useState<FactPack | null>(null);
  const [notes, setNotes] = useState<Record<string, MentorNote>>({});
  const [refreshing, setRefreshing] = useState(false);
  const refreshAbort = useRef<AbortController | null>(null);

  useEffect(() => {
    setConfigured(isAiConfigured(loadAiConfig()));
    setPack(buildFactPack());
    setNotes(loadMentorNotes());
    setReady(true);
  }, []);

  const onNoteSaved = (id: string, n: MentorNote) =>
    setNotes((prev) => ({ ...prev, [id]: n }));

  /** Perbarui semua: satu panggilan per mentor, berurutan; error satu mentor tidak menjatuhkan yang lain. */
  const refreshAll = async () => {
    if (!pack || refreshing) return;
    setRefreshing(true);
    const ctrl = new AbortController();
    refreshAbort.current = ctrl;
    try {
      for (const p of MENTORS) {
        if (ctrl.signal.aborted) break;
        try {
          const res = await requestMentorNote(p, renderFactPack(pack), ctrl.signal);
          if (res.ok) {
            const saved: MentorNote = {
              ...res.note,
              ts: Date.now(),
              faktaHash: pack.hash,
            };
            saveMentorNote(p.id, saved);
            setNotes((prev) => ({ ...prev, [p.id]: saved }));
          }
          // Gagal parse / error AI di satu mentor: lewati, lanjut ke mentor berikutnya.
        } catch {
          /* lanjut ke mentor berikutnya */
        }
      }
    } finally {
      refreshAbort.current = null;
      setRefreshing(false);
    }
  };

  if (!ready || !pack) {
    return (
      <div className="mnt-wrap" aria-label="Mentor Senyap">
        <p className="mnt-muted">Memuat…</p>
      </div>
    );
  }

  const factText = renderFactPack(pack);

  return (
    <div className="mnt-wrap" aria-label="Mentor Senyap">
      <p className="mnt-intro">
        Jaringan mentor yang <strong>diam-diam</strong> mengamati data belajarmu
        dan hanya berbicara saat kamu meminta — tanpa notifikasi, tanpa pop-up.
        Setiap mentor membaca <strong>paket fakta yang sama</strong> (di bawah),
        dari lensanya masing-masing. Mereka dilarang mengarang angka di luar
        paket fakta ini.
      </p>

      <section className="mnt-facts" aria-label="Basis fakta">
        <div className="mnt-facts-head">
          <h3 className="mnt-sub">Basis fakta</h3>
          <span className="mnt-muted">{pack.items.length} fakta · hash {pack.hash}</span>
        </div>
        {pack.empty ? (
          <p className="mnt-muted">
            Belum ada aktivitas tercatat — mentor belum bisa membaca apa pun.
          </p>
        ) : (
          <dl className="mnt-factlist">
            {pack.items.map((f, i) => (
              <div className="mnt-fact" key={i}>
                <dt>{f.label}</dt>
                <dd>
                  {f.value}
                  <span className="mnt-src"> · {f.source}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}
        <details className="mnt-raw">
          <summary>Teks paket fakta yang dikirim ke AI</summary>
          <pre>{factText || "(kosong)"}</pre>
        </details>
      </section>

      {!configured ? (
        <AiNotConfigured featureLabel="Mentor Senyap" />
      ) : pack.empty ? (
        <p className="mnt-muted">
          Mentor siap, tapi belum ada data belajar yang bisa dibaca. Selesaikan
          satu lesson atau review beberapa kartu dulu, lalu kembali ke sini.
        </p>
      ) : (
        <>
          <div className="mnt-actions">
            <button
              type="button"
              className="mnt-btn"
              onClick={() => void refreshAll()}
              disabled={refreshing}
            >
              {refreshing ? "Memperbarui…" : "Perbarui semua mentor"}
            </button>
            {refreshing && (
              <button
                type="button"
                className="mnt-btn mnt-ghost"
                onClick={() => refreshAbort.current?.abort()}
              >
                Batalkan
              </button>
            )}
          </div>
          <div className="mnt-grid">
            {MENTORS.map((p) => (
              <MentorCard
                key={p.id}
                persona={p}
                note={notes[p.id] ?? null}
                pack={pack}
                onNoteSaved={onNoteSaved}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
