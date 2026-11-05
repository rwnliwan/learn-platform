// Bedah Buku — Deep Dive sebagai kartu akordeon (Gelombang Poles).
//
// Tiap deep dive: header (judul + kalimat `ringkas` sebagai pengait +
// chevron) yang membuka/menutup isi dengan animasi Motion height-auto
// (pola aman yang sama dengan TrackAccordion: AnimatePresence initial=false
// + overflow hidden pada wadah animasi; cabang no-motion bila
// useReducedMotion aktif). Kartu pertama terbuka default; state lokal per
// kartu, tidak dipersist.
//
// Di dalam kartu terbuka: sub-blok berlabel chip berwarna (Definisi biru,
// Kenapa penting kuning, Contoh hijau, Jebakan pemahaman oranye — mengikuti
// token warna poles.css). Bila `d.poin` ada: kalimat `d.definisi` tampil
// sebagai pembuka + grid kartu mini bernomor; field kenapa/contoh/jebakan
// tetap tampil sebagai sub-blok biasa.
//
// Cetak: listener beforeprint/afterprint (+ matchMedia print) memaksa semua
// kartu terbuka; CSS print di poles.css melepaskan overflow/height.
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type {
  ChapterPack,
  BukuDeepDive,
  BukuDeepDivePoin,
} from "../../lib/bedahbuku";
import { RichInline } from "./rich";
import "./poles.css";

type BlokKind = "definisi" | "kenapa" | "contoh" | "jebakan";

const BLOK_LABEL: Record<BlokKind, string> = {
  definisi: "Definisi",
  kenapa: "Kenapa penting",
  contoh: "Contoh",
  jebakan: "Jebakan pemahaman",
};

function SubBlok({ kind, children }: { kind: BlokKind; children: ReactNode }) {
  return (
    <div className={`bk-dd-blok bk-dd-${kind}`}>
      <span className="bk-dd-chip">{BLOK_LABEL[kind]}</span>
      <div className="bk-dd-teks">{children}</div>
    </div>
  );
}

function PoinGrid({ poin }: { poin: BukuDeepDivePoin[] }) {
  return (
    <div className="bk-dd-poin-grid">
      {poin.map((p, i) => {
        const isJebakan = p.nada === "jebakan";
        return (
          <div
            className={"bk-dd-poin" + (isJebakan ? " bk-dd-poin-jebakan" : "")}
            key={i}
          >
            <span className="bk-dd-num" aria-hidden="true">
              {i + 1}
            </span>
            <div className="bk-dd-poin-badan">
              {isJebakan && (
                <span className="bk-dd-poin-tag">Jebakan</span>
              )}
              <h4 className="bk-dd-poin-judul">
                <RichInline text={p.judul} />
              </h4>
              <p className="bk-dd-poin-isi">
                <RichInline text={p.isi} />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Fallback pengait bila data belum mengisi `ringkas`: kalimat pertama. */
function hookFallback(plain: string): string {
  const t = plain.replace(/[$*_`#]/g, "").trim();
  const m = t.match(/^.{24,}?[.!?](?:\s|$)/);
  const s = (m ? m[0] : t.slice(0, 160)).trim();
  return s.length > 220 ? s.slice(0, 217) + "…" : s;
}

function DeepDiveCard({
  d,
  index,
  defaultOpen,
  forceOpen,
}: {
  d: BukuDeepDive;
  index: number;
  defaultOpen: boolean;
  forceOpen: boolean;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);
  const shown = forceOpen || open;
  const hook = (d.ringkas ?? "").trim() || hookFallback(d.definisi);
  const bodyId = `bk-dd-isi-${index}`;

  const isi = (
    <>
      {d.poin && d.poin.length > 0 ? (
        <>
          <p className="bk-dd-pembuka">
            <RichInline text={d.definisi} />
          </p>
          <PoinGrid poin={d.poin} />
        </>
      ) : (
        <SubBlok kind="definisi">
          <p className="bk-p">
            <RichInline text={d.definisi} />
          </p>
        </SubBlok>
      )}
      <SubBlok kind="kenapa">
        <p className="bk-p">
          <RichInline text={d.kenapa} />
        </p>
      </SubBlok>
      <SubBlok kind="contoh">
        <p className="bk-p">
          <RichInline text={d.contoh} />
        </p>
      </SubBlok>
      <SubBlok kind="jebakan">
        <p className="bk-p">
          <RichInline text={d.jebakan} />
        </p>
      </SubBlok>
    </>
  );

  return (
    <article className={"bk-dd" + (shown ? " bk-dd-open" : "")}>
      <button
        type="button"
        className="bk-dd-head"
        aria-expanded={shown}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="bk-dd-head-teks">
          <span className="bk-dd-judul" role="heading" aria-level={3}>
            <RichInline text={d.judul} />
          </span>
          <span className="bk-dd-ringkas">
            <RichInline text={hook} />
          </span>
        </span>
        <span className="bk-dd-chev" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path
              d="M4 6l4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {reduce ? (
        shown && (
          <div className="bk-dd-collapse" id={bodyId}>
            <div className="bk-dd-isi">{isi}</div>
          </div>
        )
      ) : (
        <AnimatePresence initial={false}>
          {shown && (
            <motion.div
              key="isi"
              className="bk-dd-collapse"
              id={bodyId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="bk-dd-isi">{isi}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </article>
  );
}

export default function DeepDiveSection({ pack }: { pack: ChapterPack }) {
  // Saat mencetak, paksa semua kartu terbuka (pola pendamping CSS print).
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    const on = () => setPrinting(true);
    const off = () => setPrinting(false);
    window.addEventListener("beforeprint", on);
    window.addEventListener("afterprint", off);
    const mq = window.matchMedia("print");
    const mqFn = (e: MediaQueryListEvent) => setPrinting(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", mqFn);
    return () => {
      window.removeEventListener("beforeprint", on);
      window.removeEventListener("afterprint", off);
      if (mq.removeEventListener) mq.removeEventListener("change", mqFn);
    };
  }, []);

  return (
    <div className="bk-dd-list">
      {pack.deepDive.map((d, i) => (
        <DeepDiveCard
          key={i}
          d={d}
          index={i}
          defaultOpen={i === 0}
          forceOpen={printing}
        />
      ))}
    </div>
  );
}
