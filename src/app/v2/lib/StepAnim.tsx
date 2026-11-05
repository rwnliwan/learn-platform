"use client";
import { useEffect, useState, type ReactNode } from "react";

/* Transisi antar-langkah runner (fade + slide kecil, mode="wait", ≤200ms).
   - Motion dimuat LAZY (dynamic import) agar bundle awal rute runner ramping.
   - prefers-reduced-motion mematikan semua animasi -> div biasa (fallback).
   - Tidak menyentuh logika gating/progres; hanya membungkus kontainer langkah.
   - className diteruskan ke motion.div agar layout flex (.scroll) tidak berubah. */
export default function StepAnim({
  stepKey,
  className,
  children,
}: {
  stepKey: string;
  className?: string;
  children: ReactNode;
}) {
  const [lib, setLib] = useState<null | typeof import("motion/react")>(null);
  const [reduce, setReduce] = useState(true);

  useEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    } catch {
      /* noop */
    }
    setReduce(false);
    let alive = true;
    import("motion/react")
      .then((m) => {
        if (alive) setLib(m);
      })
      .catch(() => {
        /* fallback jujur: animasi mati, konten tetap tampil */
      });
    return () => {
      alive = false;
    };
  }, []);

  if (reduce || !lib) return <div className={className}>{children}</div>;

  const { AnimatePresence, motion } = lib;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stepKey}
        className={className}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
